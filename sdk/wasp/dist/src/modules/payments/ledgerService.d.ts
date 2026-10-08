import { Prisma } from '@prisma/client';
export declare class DoubleEntryLedgerService {
    /**
     * Asegura que exista una cuenta de ledger para el estudiante o entidad contable.
     */
    static getOrCreateAccount(tx: Prisma.TransactionClient, studentId: string | null, accountType: 'STUDENT_WALLET' | 'REVENUE_SALES' | 'CASH_GATEWAY'): Promise<{
        id: string;
        studentId: string | null;
        accountType: string;
        currency: string;
        createdAt: Date;
    }>;
    /**
     * Registra un asiento de doble entrada inmutable (Débito y Crédito balanceados).
     */
    static recordDoubleEntry(tx: Prisma.TransactionClient, params: {
        debitAccountId: string;
        creditAccountId: string;
        amount: Prisma.Decimal | number;
        description: string;
        paymentId?: string;
    }): Promise<{
        debitEntry: {
            id: string;
            accountId: string;
            paymentId: string | null;
            type: import(".prisma/client").$Enums.LedgerEntryType;
            amount: Prisma.Decimal;
            description: string;
            createdAt: Date;
        };
        creditEntry: {
            id: string;
            accountId: string;
            paymentId: string | null;
            type: import(".prisma/client").$Enums.LedgerEntryType;
            amount: Prisma.Decimal;
            description: string;
            createdAt: Date;
        };
    }>;
}
//# sourceMappingURL=ledgerService.d.ts.map