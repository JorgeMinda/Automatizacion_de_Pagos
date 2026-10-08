export type BotState = 'IDLE' | 'MENU' | 'CONSULTA_MENU' | 'DATOS_BANCARIOS' | 'CALENDARIO';

export interface BotContext {
  phoneNumber: string;
  lastInteraction: Date;
  state: BotState;
}

export class WhatsAppStateMachine {
  public static processMessage(
    userMessage: string,
    menuItems: Array<{ name: string; price: number }>
  ): string {
    const text = userMessage.trim().toUpperCase();

    if (text === 'HOLA' || text === 'MENU' || text === 'INICIO' || text === 'START') {
      return (
        `🍱 *COMEDOR ESCOLAR - ATENCIÓN AUTOMATIZADA*\n\n` +
        `¡Hola! Selecciona una opción respondiendo con el número:\n\n` +
        `1️⃣ *Menú Escolar del Mes / Día*\n` +
        `2️⃣ *Cuentas Bancarias Corporativas*\n` +
        `3️⃣ *Horarios y Calendario de Servicio*\n` +
        `4️⃣ *Acceso al Portal de Padres (App)*\n\n` +
        `_Escribe el número correspondiente a tu consulta._`
      );
    }

    if (text === '1') {
      if (menuItems.length === 0) {
        return `🥗 *Menú Escolar:* No hay platos programados en el catálogo activo hoy.`;
      }
      const list = menuItems
        .map((item) => `• *${item.name}* — $${item.price.toFixed(2)}`)
        .join('\n');
      return (
        `🥗 *MENÚ DEL DÍA DISPONIBLE:*\n\n${list}\n\n` +
        `_Para comprar paquetes prepagados con descuento, utiliza la App Móvil._\n\n` +
        `Escribe *MENU* para regresar.`
      );
    }

    if (text === '2') {
      return (
        `🏦 *DATOS BANCARIOS OFICIALES (PAGO DIRECTO):*\n\n` +
        `• *Banco:* Banco Guayaquil / Banco Pichincha\n` +
        `• *Tipo de Cuenta:* Corriente\n` +
        `• *Número:* 2200987654\n` +
        `• *Beneficiario:* Servicios Alimentarios Escolares S.A.\n` +
        `• *RUC:* 1790011223001\n` +
        `• *Correo:* pagos@comedorescolar.com\n\n` +
        `💡 _Nota: Si realizas el pago directo desde la App, la acreditación de almuerzos es inmediata y automática._\n\n` +
        `Escribe *MENU* para volver.`
      );
    }

    if (text === '3') {
      return (
        `📅 *CALENDARIO Y HORARIOS DE ATENCIÓN:*\n\n` +
        `• *Jornada Matutina:* 07:30 AM – 11:30 AM\n` +
        `• *Almuerzos (Receso Principal):* 11:30 AM – 13:45 PM\n` +
        `• *Días Lectivos:* Lunes a Viernes\n` +
        `• *Feriados:* No se descuentan almuerzos de los paquetes en días sin asistencia escolar.\n\n` +
        `Escribe *MENU* para volver.`
      );
    }

    if (text === '4') {
      return (
        `📲 *PORTAL DE PADRES Y AUTOGESTIÓN:*\n\n` +
        `Ingresa al portal web oficial para consultar saldos en vivo, descargar el carnet QR de tu hijo o comprar paquetes:\n` +
        `👉 https://comedor.escuela.edu.ec/parent/dashboard\n\n` +
        `Escribe *MENU* para ver más opciones.`
      );
    }

    return `🤖 No comprendí tu mensaje. Escribe *MENU* o *HOLA* para consultar las opciones disponibles.`;
  }
}
