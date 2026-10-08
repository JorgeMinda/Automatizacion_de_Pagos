import { HttpError } from 'wasp/server';
import type { DispatchMealConsumption, SyncOfflineBatchDeliveries } from 'wasp/server/operations';
import { Prisma } from '@prisma/client';
import { DoubleEntryLedgerService } from '../payments/ledgerService';

interface DispatchMealInput {
  idempotencyKey: string;
  studentId: string;
  menuItemSku: string;
  posStationId: string;
  forceAllergyOverride?: boolean;
}

interface OfflineDeliveryItem {
  idempotencyKey: string;
  studentId: string;
  menuItemSku: string;
  posStationId: string;
  offlineTimestamp: string;
}

export const dispatchMealConsumption: DispatchMealConsumption<
  DispatchMealInput,
  { success: boolean; deliveryId: string; remainingUnits: number }
> = async (args, context) => {
  if (!context.user || (context.user.role !== 'CAJERO' && context.user.role !== 'ADMIN')) {
    throw new HttpError(403, 'No autorizado para realizar despachos en punto de venta.');
  }

  const { idempotencyKey, studentId, menuItemSku, posStationId, forceAllergyOverride } = args;

  if (!idempotencyKey || !studentId || !menuItemSku) {
    throw new HttpError(400, 'Datos incompletos para procesar el despacho.');
  }

  // 1. Verificación de Idempotencia previa
  const existingDelivery = await context.entities.DeliveryRecord.findUnique({
    where: { idempotencyKey }
  });

  if (existingDelivery) {
    return {
      success: true,
      deliveryId: existingDelivery.id,
      remainingUnits: 0
    };
  }

  // 2. Ejecución bajo aislamiento transaccional estricto (ACID)
  return await context.entities.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // A. Consultar al estudiante con bloqueo
      const student = await tx.student.findUnique({
        where: { id: studentId },
        include: {
          allergies: true,
          packages: {
            where: { availableUnits: { gt: 0 } },
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!student) {
        throw new HttpError(404, 'Estudiante no encontrado en la base de datos central.');
      }

      // B. Verificación de Alergias Críticas
      const criticalAllergies = student.allergies.filter((a) => a.severity === 'CRITICO');
      if (criticalAllergies.length > 0 && !forceAllergyOverride) {
        throw new HttpError(
          422,
          `Alerta Médica Crítica Bloqueante: El alumno presenta restricciones severas (${criticalAllergies
            .map((a) => a.allergen)
            .join(', ')}). Requiere confirmación manual del cajero.`
        );
      }

      // C. Consultar Ítem de Menú / Receta
      const menuItem = await tx.menuItemRecipe.findUnique({
        where: { skuPontifico: menuItemSku }
      });

      if (!menuItem || !menuItem.active) {
        throw new HttpError(404, 'Producto no disponible en el catálogo activo.');
      }

      let selectedPackageId: string | null = null;
      let remainingUnits = 0;

      // D. Lógica de deducción: Priorizar Paquete de Almuerzos si es plato producido
      if (menuItem.type === 'PRODUCIDO' && student.packages.length > 0) {
        const activePackage = student.packages[0];
        selectedPackageId = activePackage.id;

        const updatedPackage = await tx.mealPackage.update({
          where: { id: activePackage.id },
          data: {
            availableUnits: { decrement: 1 }
          }
        });

        remainingUnits = updatedPackage.availableUnits;
      } else {
        // Deducción de Monedero Monetario
        if (student.walletBalance.lessThan(menuItem.price)) {
          throw new HttpError(
            402,
            `Saldo insuficiente en monedero ($${student.walletBalance.toString()}). Requiere $${menuItem.price.toString()}.`
          );
        }

        await tx.student.update({
          where: { id: student.id },
          data: {
            walletBalance: { decrement: menuItem.price }
          }
        });

        // Registro en Ledger para Wallet
        const walletAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, student.id, 'STUDENT_WALLET');
        const revenueAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, null, 'REVENUE_SALES');

        await DoubleEntryLedgerService.recordDoubleEntry(tx, {
          debitAccountId: walletAccount.id,
          creditAccountId: revenueAccount.id,
          amount: menuItem.price,
          description: `Consumo en POS: ${menuItem.name}`
        });
      }

      // E. Registro inmutable de la entrega
      const delivery = await tx.deliveryRecord.create({
        data: {
          idempotencyKey,
          studentId: student.id,
          cashierId: context.user!.id,
          packageId: selectedPackageId,
          menuItemId: menuItem.id,
          posStationId,
          syncStatus: 'PENDING'
        }
      });

      // F. Registro de Auditoría
      await tx.auditLog.create({
        data: {
          userId: context.user!.id,
          action: 'POS_MEAL_DISPATCH',
          entityType: 'DeliveryRecord',
          entityId: delivery.id,
          payload: {
            studentId: student.id,
            skuPontifico: menuItem.skuPontifico,
            packageId: selectedPackageId
          }
        }
      });

      return {
        success: true,
        deliveryId: delivery.id,
        remainingUnits
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5000,
      timeout: 10000
    }
  );
};

export const syncOfflineBatchDeliveries: SyncOfflineBatchDeliveries<
  { deliveries: OfflineDeliveryItem[] },
  { processed: number; duplicatesIgnored: number; errors: string[] }
> = async (args, context) => {
  if (!context.user || (context.user.role !== 'CAJERO' && context.user.role !== 'ADMIN')) {
    throw new HttpError(403, 'Acceso no autorizado para sincronización offline.');
  }

  const { deliveries } = args;
  let processed = 0;
  let duplicatesIgnored = 0;
  const errors: string[] = [];

  for (const item of deliveries) {
    try {
      // Verificar si ya existe
      const existing = await context.entities.DeliveryRecord.findUnique({
        where: { idempotencyKey: item.idempotencyKey }
      });

      if (existing) {
        duplicatesIgnored++;
        continue;
      }

      await dispatchMealConsumption(
        {
          idempotencyKey: item.idempotencyKey,
          studentId: item.studentId,
          menuItemSku: item.menuItemSku,
          posStationId: item.posStationId,
          forceAllergyOverride: true // Despacho físico ya consumido en caja
        },
        context
      );

      processed++;
    } catch (err: any) {
      errors.push(`Error en clave ${item.idempotencyKey}: ${err.message}`);
    }
  }

  return { processed, duplicatesIgnored, errors };
};
