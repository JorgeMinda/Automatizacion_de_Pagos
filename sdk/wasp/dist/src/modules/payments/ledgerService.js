import { Prisma } from '@prisma/client';
export class DoubleEntryLedgerService {
    /**
     * Asegura que exista una cuenta de ledger para el estudiante o entidad contable.
     */
    static async getOrCreateAccount(tx, studentId, accountType) {
        let account = await tx.ledgerAccount.findFirst({
            where: {
                studentId: studentId ?? undefined,
                accountType
            }
        });
        if (!account) {
            account = await tx.ledgerAccount.create({
                data: {
                    studentId: studentId ?? undefined,
                    accountType,
                    currency: 'USD'
                }
            });
        }
        return account;
    }
    /**
     * Registra un asiento de doble entrada inmutable (Débito y Crédito balanceados).
     */
    static async recordDoubleEntry(tx, params) {
        const decimalAmount = new Prisma.Decimal(params.amount.toString());
        // 1. Asiento de Débito
        const debitEntry = await tx.ledgerEntry.create({
            data: {
                accountId: params.debitAccountId,
                paymentId: params.paymentId,
                type: 'DEBIT',
                amount: decimalAmount,
                description: `DÉBITO: ${params.description}`
            }
        });
        // 2. Asiento de Crédito
        const creditEntry = await tx.ledgerEntry.create({
            data: {
                accountId: params.creditAccountId,
                paymentId: params.paymentId,
                type: 'CREDIT',
                amount: decimalAmount,
                description: `CRÉDITO: ${params.description}`
            }
        });
        return { debitEntry, creditEntry };
    }
}
//# sourceMappingURL=ledgerService.js.map