import { describe, it, expect, vi } from 'vitest';
import { PontificoERPAdapter, PontificoSyncPayload } from '../../src/infrastructure/pontifico/client';

describe('PontificoERPAdapter (Integración ERP Pontífico con HMAC)', () => {
  const dummyPayload: PontificoSyncPayload = {
    eventId: 'evt_test_123',
    timestamp: '2026-10-08T12:00:00.000Z',
    transactionType: 'MEAL_DELIVERY',
    posStationId: 'POS_01',
    studentId: 'stud_123',
    product: {
      skuPontifico: 'PROD-ALM-EJECUTIVO',
      type: 'PRODUCIDO',
      quantity: 1,
    },
    recipeDecomposition: [
      { rawMaterialSku: 'RAW-CHICKEN', quantity: 0.15, unit: 'KG' },
    ],
  };

  it('debe generar una firma HMAC-SHA256 válida y enviar la petición', async () => {
    const adapter = new PontificoERPAdapter();

    // Mock fetch global
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ackId: 'ACK_TEST_SUCCESS' }),
    } as Response);

    const result = await adapter.syncInventoryDeduction(dummyPayload, 1);

    expect(result.status).toBe('SUCCESS');
    expect(result.ackId).toBe('ACK_TEST_SUCCESS');
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const callArgs = (global.fetch as any).mock.calls[0];
    const headers = callArgs[1].headers;
    expect(headers['X-Pontifico-Signature']).toBeDefined();
    expect(headers['X-Idempotency-Key']).toBe('evt_test_123');
  });

  it('debe reintentar con backoff exponencial hasta 5 veces si la API responde con error', async () => {
    const adapter = new PontificoERPAdapter();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => 'Service Unavailable',
    } as Response);

    const result = await adapter.syncInventoryDeduction(dummyPayload, 3);

    expect(result.status).toBe('FAILED');
    expect(result.retries).toBe(3);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
