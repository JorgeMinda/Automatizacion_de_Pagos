import { prisma } from 'wasp/server'

import { validateStudentForPOS } from '../../../src/modules/pos/queries'


export default async function (args, context) {
  return (validateStudentForPOS as any)(args, {
    ...context,
    entities: {
      Student: prisma.student,
      MealPackage: prisma.mealPackage,
      StudentAllergy: prisma.studentAllergy,
      MenuItemRecipe: prisma.menuItemRecipe,
    },
  })
}
