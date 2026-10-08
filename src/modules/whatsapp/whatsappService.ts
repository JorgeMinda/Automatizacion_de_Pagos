export interface IWhatsAppMessengerPort {
  sendTextMessage(to: string, message: string): Promise<boolean>;
}

export class WhatsAppCloudApiAdapter implements IWhatsAppMessengerPort {
  private readonly token: string;
  private readonly phoneNumberId: string;

  constructor() {
    this.token = process.env.WHATSAPP_API_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  public async sendTextMessage(to: string, message: string): Promise<boolean> {
    if (!this.token || !this.phoneNumberId) {
      console.warn(`[WhatsAppCloudApiAdapter] Credenciales no configuradas. Mock dispatch a ${to}: ${message}`);
      return true;
    }

    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { preview_url: false, body: message }
        })
      });

      return res.ok;
    } catch (err: any) {
      console.error('[WhatsAppCloudApiAdapter] Error enviando mensaje:', err.message);
      return false;
    }
  }
}
