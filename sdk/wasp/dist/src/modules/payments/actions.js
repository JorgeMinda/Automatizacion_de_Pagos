import { HttpError, prisma } from 'wasp/server';
import { Prisma } from '@prisma/client';
import { DoubleEntryLedgerService } from './ledgerService';
export const processDirectPayment = async (args, context) => {
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
    return await prisma.$transaction(async (tx) => {
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
                userId: context.user.id,
                amount: decimalAmount,
                destination,
                status: 'APROBADO',
                bankReference,
                metadata: {
                    processedAt: new Date().toISOString(),
                    studentId: student.id,
                    parentEmail: context.user.email
                }
            }
        });
        const cashGatewayAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, null, 'CASH_GATEWAY');
        let createdPackageId = undefined;
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
        }
        else {
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
                userId: context.user.id,
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
export const registerStudentForParent = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401, 'Usuario no autenticado.');
    }
    const { firstName, lastName, gradeSection, allergen, staticCode } = args;
    if (!firstName || !lastName || !gradeSection) {
        throw new HttpError(400, 'Nombre, apellido y grado son requeridos.');
    }
    const code = staticCode?.trim().toUpperCase() || `EST-${Math.floor(100 + Math.random() * 900)}`;
    const student = await prisma.student.create({
        data: {
            parentId: context.user.id,
            firstName,
            lastName,
            gradeSection,
            staticCode: code,
            qrSeed: `seed_${code.toLowerCase()}_${Date.now()}`,
            walletBalance: 0,
            allergies: allergen && allergen.trim().length > 0 ? {
                create: [
                    {
                        allergen: allergen.trim(),
                        severity: allergen.toLowerCase().includes('maní') || allergen.toLowerCase().includes('mani') || allergen.toLowerCase().includes('celia') || allergen.toLowerCase().includes('sever') ? 'CRITICO' : 'MODERADO',
                        description: `Restricción médica reportada por el representante familiar.`
                    }
                ]
            } : undefined
        },
        include: {
            allergies: true,
            packages: true
        }
    });
    return student;
};
export const setUserRole = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401, 'No autenticado.');
    }
    const updatedUser = await prisma.user.update({
        where: { id: context.user.id },
        data: { role: args.role }
    });
    return updatedUser;
};
//# sourceMappingURL=actions.js.map