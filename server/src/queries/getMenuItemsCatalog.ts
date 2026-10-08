import { prisma } from 'wasp/server'

import { getMenuItemsCatalog } from '../../../src/modules/inventory/queries'


export default async function (args, context) {
  return (getMenuItemsCatalog as any)(args, {
    ...context,
    entities: {
      MenuItemRecipe: prisma.menuItemRecipe,
    },
  })
}
