import type { DispatchMealConsumption, SyncOfflineBatchDeliveries } from 'wasp/server/operations';
interface DispatchMealInput {
    [key: string]: any;
    idempotencyKey: string;
    studentId: string;
    menuItemSku: string;
    posStationId: string;
    forceAllergyOverride?: boolean;
}
interface OfflineDeliveryItem {
    [key: string]: any;
    idempotencyKey: string;
    studentId: string;
    menuItemSku: string;
    posStationId: string;
    offlineTimestamp: string;
}
interface SyncOfflineBatchInput {
    [key: string]: any;
    deliveries: OfflineDeliveryItem[];
}
export declare const dispatchMealConsumption: DispatchMealConsumption<DispatchMealInput, {
    success: boolean;
    deliveryId: string;
    remainingUnits: number;
}>;
export declare const syncOfflineBatchDeliveries: SyncOfflineBatchDeliveries<SyncOfflineBatchInput, {
    processed: number;
    duplicatesIgnored: number;
    errors: string[];
}>;
export {};
//# sourceMappingURL=actions.d.ts.map