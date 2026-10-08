export class WhatsAppCloudApiAdapter {
    token;
    phoneNumberId;
    constructor() {
        this.token = process.env.WHATSAPP_API_TOKEN || '';
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    }
    async sendTextMessage(to, message) {
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
        }
        catch (err) {
            console.error('[WhatsAppCloudApiAdapter] Error enviando mensaje:', err.message);
            return false;
        }
    }
    async sendMealConsumedNotification(to, studentName, gradeSection, timeStr, remainingBalance, remainingMeals) {
        const message = `🍏 *¡Comedor Escolar!* Tu hijo(a) *${studentName}* (${gradeSection}) acaba de retirar su almuerzo en el comedor a las *${timeStr}*.\n\n` +
            `📊 *Saldo restante:* $${remainingBalance.toFixed(2)} (${remainingMeals} almuerzos disponibles en paquete).`;
        return this.sendTextMessage(to, message);
    }
    async sendLowBalanceAlert(to, studentName, currentBalance, remainingMeals) {
        const message = `⚠️ *Alerta de Saldo:* El saldo de *${studentName}* es de *$${currentBalance.toFixed(2)}* (${remainingMeals} almuerzos restantes).\n\n` +
            `📲 Recarga directo aquí para evitar interrupciones en el servicio:\n` +
            `👉 https://pagos.comedorescolar.com/recargar`;
        return this.sendTextMessage(to, message);
    }
}
//# sourceMappingURL=whatsappService.js.map