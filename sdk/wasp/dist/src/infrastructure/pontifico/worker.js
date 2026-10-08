import { PontificoERPAdapter } from './client.js';
import { RecipeDecompositionService } from '../../modules/inventory/recipeService.js';
/**
 * Worker ejecutado para sincronización de inventario con Pontífico.
 */
export async function syncPontificoInventoryWorker(args, context) {
    const pendingDeliveries = await context.entities.DeliveryRecord.findMany({
        where: { syncStatus: 'PENDING' },
        take: 20,
        include: {
            menuItem: true,
            student: true
        }
    });
    if (pendingDeliveries.length === 0) {
        return;
    }
    const adapter = new PontificoERPAdapter();
    for (const delivery of pendingDeliveries) {
        const decomposition = RecipeDecompositionService.decompose(delivery.menuItem.recipeBOM, 1);
        const payload = {
            eventId: delivery.idempotencyKey,
            timestamp: delivery.deliveredAt.toISOString(),
            transactionType: 'MEAL_DELIVERY',
            posStationId: delivery.posStationId,
            studentId: delivery.studentId,
            product: {
                skuPontifico: delivery.menuItem.skuPontifico,
                type: delivery.menuItem.type,
                quantity: 1
            },
            recipeDecomposition: decomposition
        };
        const result = await adapter.syncInventoryDeduction(payload);
        if (result.status === 'SUCCESS') {
            await context.entities.DeliveryRecord.update({
                where: { id: delivery.id },
                data: { syncStatus: 'SYNCED' }
            });
        }
        else {
            console.warn(`[syncPontificoInventoryWorker] Reintento fallido para entrega ${delivery.id}`);
        }
    }
}
/**
 * Endpoint webhook para recibir confirmaciones o auditorías desde Pontífico.
 */
export const handlePontificoSyncWebhook = async (req, res, context) => {
    const signature = req.headers['x-pontifico-signature'];
    if (!signature) {
        return res.status(401).json({ error: 'Falta firma criptográfica HMAC.' });
    }
    const { eventId, status } = req.body;
    if (eventId && status === 'CONFIRMED') {
        await context.entities.DeliveryRecord.updateMany({
            where: { idempotencyKey: eventId },
            data: { syncStatus: 'SYNCED' }
        });
    }
    return res.status(200).json({ received: true });
};
//# sourceMappingURL=worker.js.map