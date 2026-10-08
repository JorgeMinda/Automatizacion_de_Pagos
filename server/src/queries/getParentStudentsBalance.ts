import { prisma } from 'wasp/server'

import { getParentStudentsBalance } from '../../../src/modules/payments/queries'


export default async function (args, context) {
  return (getParentStudentsBalance as any)(args, {
    ...context,
    entities: {
      Student: prisma.student,
      MealPackage: prisma.mealPackage,
      StudentAllergy: prisma.studentAllergy,
      Payment: prisma.payment,
    },
  })
}
