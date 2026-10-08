import { prisma } from 'wasp/server'

import { getAdminLedgerAudit } from '../../../src/modules/payments/queries'


export default async function (args, context) {
  return (getAdminLedgerAudit as any)(args, {
    ...context,
    entities: {
      LedgerEntry: prisma.ledgerEntry,
      LedgerAccount: prisma.ledgerAccount,
      Payment: prisma.payment,
      AuditLog: prisma.auditLog,
    },
  })
}
