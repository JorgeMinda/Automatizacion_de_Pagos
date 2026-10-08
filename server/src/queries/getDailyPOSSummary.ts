import { prisma } from 'wasp/server'

import { getDailyPOSSummary } from '../../../src/modules/pos/queries'


export default async function (args, context) {
  return (getDailyPOSSummary as any)(args, {
    ...context,
    entities: {
      DeliveryRecord: prisma.deliveryRecord,
      MealPackage: prisma.mealPackage,
      Student: prisma.student,
    },
  })
}
