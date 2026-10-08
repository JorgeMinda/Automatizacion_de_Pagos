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
    payload: PontificoSyncPayload
  ): Promise<{ status: 'SUCCESS' | 'FAILED'; ackId?: string; error?: string }> {
    const rawBody = JSON.stringify(payload);
    const signature = this.generateHmacSignature(rawBody);

    try {
      const response = await fetch(`${this.baseUrl}/inventory/atomic-deduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Pontifico-Signature': signature,
          'X-Idempotency-Key': payload.eventId
        },
        body: rawBody
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[PontificoERPAdapter] Error ${response.status}: ${errorText}`);
        return { status: 'FAILED', error: errorText };
      }

      const data = (await response.json()) as { ackId?: string };
      return { status: 'SUCCESS', ackId: data.ackId || 'ACK_' + payload.eventId };
    } catch (error: any) {
      console.error('[PontificoERPAdapter] Excepción de conexión:', error.message);
      return { status: 'FAILED', error: error.message };
    }
  }
}
