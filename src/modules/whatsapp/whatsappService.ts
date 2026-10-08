export interface IWhatsAppMessengerPort {
  sendTextMessage(to: string, message: string): Promise<boolean>;
  sendMealConsumedNotification(
    to: string,
    studentName: string,
    gradeSection: string,
    timeStr: string,
    remainingBalance: number,
    remainingMeals: number
  ): Promise<boolean>;
  sendLowBalanceAlert(
    to: string,
    studentName: string,
    currentBalance: number,
    remainingMeals: number
  ): Promise<boolean>;
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
      console.log(`[WhatsApp Bot Outbound] A: ${to} ->\n${message}`);
      return true;
    }

    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { preview_url: false, body: message },
        }),
      });

      return res.ok;
    } catch (err: any) {
      console.error('[WhatsAppCloudApiAdapter] Error enviando mensaje:', err.message);
      return false;
    }
  }

  public async sendMealConsumedNotification(
    to: string,
    studentName: string,
    gradeSection: string,
    timeStr: string,
    remainingBalance: number,
    remainingMeals: number
  ): Promise<boolean> {
    const message =
      `🍏 *¡Comedor Escolar!* Tu hijo(a) *${studentName}* (${gradeSection}) acaba de retirar su almuerzo en el comedor a las *${timeStr}*.\n\n` +
      `📊 *Saldo restante:* $${remainingBalance.toFixed(2)} (${remainingMeals} almuerzos disponibles en paquete).`;
    return this.sendTextMessage(to, message);
  }

  public async sendLowBalanceAlert(
    to: string,
    studentName: string,
    currentBalance: number,
    remainingMeals: number
  ): Promise<boolean> {
    const message =
      `⚠️ *Alerta de Saldo:* El saldo de *${studentName}* es de *$${currentBalance.toFixed(2)}* (${remainingMeals} almuerzos restantes).\n\n` +
      `📲 Recarga directo aquí para evitar interrupciones en el servicio:\n` +
      `👉 https://pagos.comedorescolar.com/recargar`;
    return this.sendTextMessage(to, message);
  }
}
