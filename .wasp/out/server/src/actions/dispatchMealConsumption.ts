import { prisma } from 'wasp/server'

import { dispatchMealConsumption } from '../../../../../src/modules/pos/actions'


export default async function (args, context) {
  return (dispatchMealConsumption as any)(args, {
    ...context,
    entities: {
      DeliveryRecord: prisma.deliveryRecord,
      Student: prisma.student,
      MealPackage: prisma.mealPackage,
      MenuItemRecipe: prisma.menuItemRecipe,
      LedgerAccount: prisma.ledgerAccount,
      LedgerEntry: prisma.ledgerEntry,
      AuditLog: prisma.auditLog,
    },
  })
}
