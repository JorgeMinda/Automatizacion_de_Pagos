import type { CreateMenuItemRecipe } from 'wasp/server/operations';
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
export declare const createMenuItemRecipe: CreateMenuItemRecipe<CreateMenuItemInput, any>;
export {};
//# sourceMappingURL=actions.d.ts.map