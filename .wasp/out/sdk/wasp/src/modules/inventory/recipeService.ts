import { RecipeBOMItem } from '../../core/domain/types';

export class RecipeDecompositionService {
  /**
   * Descompone un plato producido en sus materias primas según el BOM configurado.
   */
  public static decompose(recipeBOM: unknown, multiplier: number = 1): RecipeBOMItem[] {
    if (!recipeBOM || !Array.isArray(recipeBOM)) {
      return [];
    }

    return recipeBOM.map((item: any) => ({
      rawMaterialSku: String(item.rawMaterialSku || item.sku),
      quantity: Number(item.quantity || 0) * multiplier,
      unit: String(item.unit || 'UN')
    }));
  }
}
