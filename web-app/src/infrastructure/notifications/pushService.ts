export class PushNotificationService {
  /**
   * Dispara una notificación Push al dispositivo móvil del padre de familia al validar el almuerzo en POS.
   */
  public static async notifyMealDelivered(params: {
    parentToken?: string;
    studentName: string;
    gradeSection: string;
    mealName: string;
    deliveredAt: Date;
  }): Promise<boolean> {
    const timeFormatted = params.deliveredAt.toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const message = `🍱 ¡Hola! Tu hijo(a) ${params.studentName} (${params.gradeSection}) ha recibido su ${params.mealName} en el comedor escolar. Hora: ${timeFormatted}.`;

    console.log(`[PushNotificationService] Disparando Push a Token: ${params.parentToken || 'WEB_DEVICE_ALL'}`);
    console.log(`[PushNotificationService] Mensaje: "${message}"`);

    // En producción, integración con Firebase Cloud Messaging (FCM) / Apple APNs
    return true;
  }
}
