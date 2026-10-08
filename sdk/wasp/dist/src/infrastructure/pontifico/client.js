import crypto from 'crypto';
export class PontificoERPAdapter {
    baseUrl;
    apiSecret;
    constructor() {
        this.baseUrl = process.env.PONTIFICO_API_URL || 'https://erp.pontifico.com/api/v1';
        this.apiSecret = process.env.PONTIFICO_HMAC_SECRET || 'pontifico_enterprise_hmac_secret_key_32bytes';
    }
    generateHmacSignature(payload) {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(payload)
            .digest('hex');
    }
    async syncInventoryDeduction(payload, maxRetries = 5) {
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
                    const data = (await response.json());
                    return { status: 'SUCCESS', ackId: data.ackId || 'ACK_' + payload.eventId, retries: attempt };
                }
                lastError = await response.text();
                console.warn(`[PontificoERPAdapter] Intento ${attempt}/${maxRetries} fallido (${response.status}): ${lastError}`);
            }
            catch (err) {
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
//# sourceMappingURL=client.js.map