import { HttpError, prisma } from 'wasp/server';
import type { CreateMenuItemRecipe } from 'wasp/server/operations';
import { Prisma } from '@prisma/client';

interface CreateMenuItemInput {
  [key: string]: any;
  skuPontifico: string;
  name: string;
  type: 'PRODUCIDO' | 'SIMPLE';
  price: number;
  recipeBOM?: Array<{
    rawMaterialSku: string;
    quantity: number;
    unit: string;
  }>;
}

export const createMenuItemRecipe: CreateMenuItemRecipe<
  CreateMenuItemInput,
  any
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'No autenticado.');
  }

  const { skuPontifico, name, type, price, recipeBOM } = args;

  if (!skuPontifico || !name || price === undefined || price < 0) {
    throw new HttpError(400, 'SKU, nombre y precio válido son requeridos.');
  }

  const cleanSku = skuPontifico.trim().toUpperCase();

  const existing = await context.entities.MenuItemRecipe.findUnique({
    where: { skuPontifico: cleanSku }
  });

  if (existing) {
    // Actualizar si ya existe
    const updated = await context.entities.MenuItemRecipe.update({
      where: { skuPontifico: cleanSku },
      data: {
        name: name.trim(),
        type: type || 'PRODUCIDO',
        price: new Prisma.Decimal(price.toFixed(2)),
        recipeBOM: recipeBOM || [],
        active: true
      }
    });
    return updated;
  }

  const newItem = await context.entities.MenuItemRecipe.create({
    data: {
      skuPontifico: cleanSku,
      name: name.trim(),
      type: type || 'PRODUCIDO',
      price: new Prisma.Decimal(price.toFixed(2)),
      recipeBOM: recipeBOM || [],
      active: true
    }
  });

  return newItem;
};
