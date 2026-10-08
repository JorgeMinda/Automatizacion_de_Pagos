import { RecipeBOMItem } from '../../core/domain/types';
export interface PontificoSyncPayload {
    eventId: string;
    timestamp: string;
    transactionType: 'MEAL_DELIVERY' | 'DIRECT_SALE';
    posStationId: string;
    studentId: string;
    product: {
        skuPontifico: string;
        type: 'SIMPLE' | 'PRODUCIDO';
        quantity: number;
    };
    recipeDecomposition: RecipeBOMItem[];
}
export declare class PontificoERPAdapter {
    private readonly baseUrl;
    private readonly apiSecret;
    constructor();
    private generateHmacSignature;
    syncInventoryDeduction(payload: PontificoSyncPayload, maxRetries?: number): Promise<{
        status: 'SUCCESS' | 'FAILED';
        ackId?: string;
        error?: string;
        retries?: number;
    }>;
}
//# sourceMappingURL=client.d.ts.map