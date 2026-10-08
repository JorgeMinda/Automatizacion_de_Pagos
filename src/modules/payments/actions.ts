import { HttpError, prisma } from 'wasp/server';
import type { ProcessDirectPayment } from 'wasp/server/operations';
import { Prisma } from '@prisma/client';
import { DoubleEntryLedgerService } from './ledgerService';

interface ProcessPaymentInput {
  [key: string]: any;
  studentId: string;
  amount: number;
  destination: 'PAQUETE' | 'MONEDERO';
  bankReference: string;
  packageUnits?: number;
  unitPrice?: number;
}

export const processDirectPayment: ProcessDirectPayment<ProcessPaymentInput, { success: boolean; paymentId: string; packageId?: string }> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Usuario no autenticado.');
  }

  const { studentId, amount, destination, bankReference, packageUnits, unitPrice } = args;

  if (!studentId || !amount || amount <= 0 || !bankReference) {
    throw new HttpError(400, 'Parámetros de pago inválidos o incompletos.');
  }

  const existingPayment = await context.entities.Payment.findUnique({
    where: { bankReference }
  });

  if (existingPayment) {
    throw new HttpError(409, 'Esta referencia bancaria ya ha sido procesada previamente.');
  }

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const student = await tx.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      throw new HttpError(404, 'Estudiante no encontrado.');
    }

    if (context.user?.role === 'PADRE' && student.parentId !== context.user.id) {
      throw new HttpError(403, 'No tiene autorización para acreditar saldos a este estudiante.');
    }

    const decimalAmount = new Prisma.Decimal(amount.toFixed(2));
    const payment = await tx.payment.create({
      data: {
        userId: context.user!.id,
        amount: decimalAmount,
        destination,
        status: 'APROBADO',
        bankReference,
        metadata: {
          processedAt: new Date().toISOString(),
          studentId: student.id,
          parentEmail: context.user!.email
        }
      }
    });

    const cashGatewayAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, null, 'CASH_GATEWAY');
    let createdPackageId: string | undefined = undefined;

    if (destination === 'PAQUETE') {
      const units = packageUnits && packageUnits > 0 ? packageUnits : Math.floor(amount / (unitPrice || 3.50));
      const effectiveUnitPrice = unitPrice ? new Prisma.Decimal(unitPrice.toFixed(2)) : new Prisma.Decimal('3.50');

      const mealPackage = await tx.mealPackage.create({
        data: {
          studentId: student.id,
          paymentId: payment.id,
          totalUnits: units,
          availableUnits: units,
          unitPrice: effectiveUnitPrice
        }
      });
      createdPackageId = mealPackage.id;

      const revenueAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, null, 'REVENUE_SALES');
      await DoubleEntryLedgerService.recordDoubleEntry(tx, {
        debitAccountId: cashGatewayAccount.id,
        creditAccountId: revenueAccount.id,
        amount: decimalAmount,
        description: `Compra de Paquete de ${units} almuerzos para ${student.firstName} ${student.lastName}`,
        paymentId: payment.id
      });
    } else {
      await tx.student.update({
        where: { id: student.id },
        data: {
          walletBalance: { increment: decimalAmount }
        }
      });

      const studentWalletAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, student.id, 'STUDENT_WALLET');
      await DoubleEntryLedgerService.recordDoubleEntry(tx, {
        debitAccountId: cashGatewayAccount.id,
        creditAccountId: studentWalletAccount.id,
        amount: decimalAmount,
        description: `Recarga de Monedero para ${student.firstName} ${student.lastName}`,
        paymentId: payment.id
      });
    }

    await tx.auditLog.create({
      data: {
        userId: context.user!.id,
        action: 'DIRECT_PAYMENT_PROCESSED',
        entityType: 'Payment',
        entityId: payment.id,
        payload: {
          studentId: student.id,
          amount: amount,
          destination,
          bankReference
        }
      }
    });

    return {
      success: true,
      paymentId: payment.id,
      packageId: createdPackageId
    };
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });
};
