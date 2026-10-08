import { Prisma, PrismaClient } from '@prisma/client';
import { LedgerEntryType } from '../../core/domain/types';

export class DoubleEntryLedgerService {
  /**
   * Asegura que exista una cuenta de ledger para el estudiante o entidad contable.
   */
  public static async getOrCreateAccount(
    tx: Prisma.TransactionClient,
    studentId: string | null,
    accountType: 'STUDENT_WALLET' | 'REVENUE_SALES' | 'CASH_GATEWAY'
  ) {
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
  public static async recordDoubleEntry(
    tx: Prisma.TransactionClient,
    params: {
      debitAccountId: string;
      creditAccountId: string;
      amount: Prisma.Decimal | number;
      description: string;
      paymentId?: string;
    }
  ) {
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
