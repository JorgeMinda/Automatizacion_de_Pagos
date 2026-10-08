import crypto from 'crypto';
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

export class PontificoERPAdapter {
  private readonly baseUrl: string;
  private readonly apiSecret: string;

  constructor() {
    this.baseUrl = process.env.PONTIFICO_API_URL || 'https://erp.pontifico.com/api/v1';
    this.apiSecret = process.env.PONTIFICO_HMAC_SECRET || 'pontifico_enterprise_hmac_secret_key_32bytes';
  }

  private generateHmacSignature(payload: string): string {
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(payload)
      .digest('hex');
  }

  public async syncInventoryDeduction(
    payload: PontificoSyncPayload,
    maxRetries: number = 5
  ): Promise<{ status: 'SUCCESS' | 'FAILED'; ackId?: string; error?: string; retries?: number }> {
    const rawBody = JSON.stringify(payload);
    const signature = this.generateHmacSignature(rawBody);

    let attempt = 0;
    let lastError = '';

    while (attempt < maxRetries) {
      attempt++;
      try {
        const response = await fetch(`${this.baseUrl}/inventory/atomic-deduct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Pontifico-Signature': signature,
            'X-Idempotency-Key': payload.eventId,
          },
          body: rawBody,
        });

        if (response.ok) {
          const data = (await response.json()) as { ackId?: string };
          return { status: 'SUCCESS', ackId: data.ackId || 'ACK_' + payload.eventId, retries: attempt };
        }

        lastError = await response.text();
        console.warn(`[PontificoERPAdapter] Intento ${attempt}/${maxRetries} fallido (${response.status}): ${lastError}`);
      } catch (err: any) {
        lastError = err.message || 'Error desconocido';
        console.warn(`[PontificoERPAdapter] Intento ${attempt}/${maxRetries} excepción de red: ${lastError}`);
      }

      // Exponential backoff: 2^attempt * 100ms
      if (attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 100;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    return { status: 'FAILED', error: lastError, retries: attempt };
  }
}
