import { prisma } from 'wasp/server'

import { createMenuItemRecipe } from '../../../../../src/modules/inventory/actions'


export default async function (args, context) {
  return (createMenuItemRecipe as any)(args, {
    ...context,
    entities: {
      MenuItemRecipe: prisma.menuItemRecipe,
    },
  })
}
