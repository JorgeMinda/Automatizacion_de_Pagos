export class RecipeDecompositionService {
    /**
     * Descompone un plato producido en sus materias primas según el BOM configurado.
     */
    static decompose(recipeBOM, multiplier = 1) {
        if (!recipeBOM || !Array.isArray(recipeBOM)) {
            return [];
        }
        return recipeBOM.map((item) => ({
            rawMaterialSku: String(item.rawMaterialSku || item.sku),
            quantity: Number(item.quantity || 0) * multiplier,
            unit: String(item.unit || 'UN')
        }));
    }
}
//# sourceMappingURL=recipeService.js.map