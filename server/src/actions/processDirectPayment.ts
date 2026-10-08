import { prisma } from 'wasp/server'

import { processDirectPayment } from '../../../../../src/modules/payments/actions'


export default async function (args, context) {
  return (processDirectPayment as any)(args, {
    ...context,
    entities: {
      Payment: prisma.payment,
      Student: prisma.student,
      MealPackage: prisma.mealPackage,
      LedgerAccount: prisma.ledgerAccount,
      LedgerEntry: prisma.ledgerEntry,
      AuditLog: prisma.auditLog,
    },
  })
}
