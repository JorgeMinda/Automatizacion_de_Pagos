/**
 * Worker ejecutado para sincronización de inventario con Pontífico.
 */
export declare function syncPontificoInventoryWorker(args: any, context: any): Promise<void>;
/**
 * Endpoint webhook para recibir confirmaciones o auditorías desde Pontífico.
 */
export declare const handlePontificoSyncWebhook: (req: any, res: any, context: any) => Promise<any>;
//# sourceMappingURL=worker.d.ts.map