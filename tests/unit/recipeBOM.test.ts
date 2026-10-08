import { describe, it, expect } from 'vitest';
import { RecipeDecompositionService } from '../../src/modules/inventory/recipeService';

describe('RecipeDecompositionService (ERP Pontífico BOM)', () => {
  const sampleBOM = [
    { rawMaterialSku: 'RAW-PROTEIN-CHICKEN', quantity: 0.15, unit: 'KG' },
    { rawMaterialSku: 'RAW-GRAIN-RICE', quantity: 0.08, unit: 'KG' },
    { rawMaterialSku: 'RAW-VEG-SALAD', quantity: 0.1, unit: 'KG' },
  ];

  it('debe descomponer 1 almuerzo en las cantidades exactas de materias primas', () => {
    const result = RecipeDecompositionService.decompose(sampleBOM, 1);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      rawMaterialSku: 'RAW-PROTEIN-CHICKEN',
      quantity: 0.15,
      unit: 'KG',
    });
    expect(result[1]).toEqual({
      rawMaterialSku: 'RAW-GRAIN-RICE',
      quantity: 0.08,
      unit: 'KG',
    });
    expect(result[2]).toEqual({
      rawMaterialSku: 'RAW-VEG-SALAD',
      quantity: 0.1,
      unit: 'KG',
    });
  });

  it('debe multiplicar proporcionalmente las cantidades para despachos en lote (ej. 10 almuerzos)', () => {
    const result = RecipeDecompositionService.decompose(sampleBOM, 10);

    expect(result[0].quantity).toBeCloseTo(1.5);
    expect(result[1].quantity).toBeCloseTo(0.8);
    expect(result[2].quantity).toBeCloseTo(1.0);
  });

  it('debe manejar recetas vacías o nulas de forma segura sin arrojar excepciones', () => {
    expect(RecipeDecompositionService.decompose(null, 1)).toEqual([]);
    expect(RecipeDecompositionService.decompose(undefined, 1)).toEqual([]);
    expect(RecipeDecompositionService.decompose([], 1)).toEqual([]);
  });
});
