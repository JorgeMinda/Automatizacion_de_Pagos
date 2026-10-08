import { HttpError } from 'wasp/server';
import { Prisma } from '@prisma/client';
export const createMenuItemRecipe = async (args, context) => {
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
//# sourceMappingURL=actions.js.map