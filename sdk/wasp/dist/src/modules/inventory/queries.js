export const getMenuItemsCatalog = async (_args, context) => {
    const items = await context.entities.MenuItemRecipe.findMany({
        where: { active: true },
        orderBy: { type: 'asc' }
    });
    return items.map((item) => ({
        id: item.id,
        skuPontifico: item.skuPontifico,
        name: item.name,
        type: item.type,
        price: Number(item.price),
        active: item.active,
        recipeBOM: item.recipeBOM
    }));
};
//# sourceMappingURL=queries.js.map