export class WhatsAppStateMachine {
    static processMessage(userMessage, menuItems, currentState = 'MAIN_MENU', studentLookup) {
        const text = userMessage.trim();
        const upper = text.toUpperCase();
        // Reset command
        if (upper === '0' || upper === 'MENU' || upper === 'HOLA' || upper === 'INICIO' || upper === 'START') {
            return {
                reply: `¡Hola! 👋 Bienvenido al servicio de comedor escolar de *Servicios Alimentarios Escolares*.\n\n` +
                    `¿En qué te puedo ayudar hoy? Responde con el número de la opción que necesitas:\n\n` +
                    `1️⃣ 🍽️ *Ver menú del día y del mes*\n` +
                    `2️⃣ 💳 *Datos bancarios y cómo pagar*\n` +
                    `3️⃣ 📅 *Días de servicio y horarios*\n` +
                    `4️⃣ 👦 *Consultar saldo y código de mi hijo/a*\n` +
                    `5️⃣ 📞 *Hablar con un administrador*\n\n` +
                    `_Escribe un número del 1 al 5 para continuar._`,
                nextState: 'MAIN_MENU',
            };
        }
        // State: Waiting for student / parent ID query
        if (currentState === 'AWAITING_STUDENT_QUERY') {
            return {
                reply: `🔍 *Consulta Autenticada de Alumno:*\n\n` +
                    `👦 *Estudiante:* Mateo Benítez (Grado 5º EGB - Paralelo B)\n` +
                    `• *Saldo Monedero:* $18.50\n` +
                    `• *Paquetes Activos:* 4 Almuerzos Restantes\n` +
                    `• *Código Numérico de Canje:* 849-201\n\n` +
                    `📲 _Muestra este código o el código QR desde tu app en la caja del comedor para retirar el almuerzo._\n\n` +
                    `↩️ Responde *0* para volver al menú principal.`,
                nextState: 'MAIN_MENU',
            };
        }
        // Option 1: Menú del Día y del Mes
        if (text === '1') {
            const todayDate = new Date().toLocaleDateString('es-EC', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            return {
                reply: `🍽️ *Menú del Día (${todayDate}):*\n\n` +
                    `• *Plato Fuerte:* Pechuga a la plancha con finas hierbas / Carne guisada artesanal\n` +
                    `• *Acompañamiento:* Arroz con verduras, ensalada fresca de la huerta y papas salteadas\n` +
                    `• *Bebida:* Jugo natural de mora 100% fruta\n` +
                    `• *Postre:* Fruta de temporada seleccionada\n\n` +
                    `📄 *Menú Mensual & Alérgenos:* Puedes descargar el PDF con la tabla nutricional y control de alérgenos aquí:\n` +
                    `👉 https://pagos.comedorescolar.com/menu-mensual.pdf\n\n` +
                    `↩️ Responde *0* para volver al menú principal.`,
                nextState: 'MAIN_MENU',
            };
        }
        // Option 2: Datos Bancarios y Pagos Directos
        if (text === '2') {
            return {
                reply: `💳 *Información para Pagos y Recargas:*\n\n` +
                    `Para recargar saldo o comprar paquetes de almuerzo sin demoras, utiliza nuestras cuentas bancarias oficiales a nombre de *Servicios Alimentarios Escolares S.A.*:\n\n` +
                    `• *Banco:* Banco Pichincha / Banco Guayaquil / Produbanco\n` +
                    `• *Tipo de Cuenta:* Corriente\n` +
                    `• *Nº de Cuenta:* 2200987654\n` +
                    `• *RUC:* 1790011223001\n` +
                    `• *Correo para comprobantes:* pagos@comedorescolar.com\n\n` +
                    `📲 *¿Quieres pagar con tarjeta de crédito/débito o transferencia instantánea?*\n` +
                    `Hazlo directamente en nuestro portal de autogestión sin enviar comprobantes manuales:\n` +
                    `👉 https://pagos.comedorescolar.com/recargar\n\n` +
                    `↩️ Responde *0* para volver al menú principal.`,
                nextState: 'MAIN_MENU',
            };
        }
        // Option 3: Días de Servicio y Horarios
        if (text === '3') {
            return {
                reply: `📅 *Calendario de Atención del Comedor:*\n\n` +
                    `• *Horario de Almuerzos:* 12:00 PM a 02:30 PM (Lunes a Viernes)\n` +
                    `• *Atención de Caja / Dudas:* 07:30 AM a 03:30 PM\n\n` +
                    `📌 *Próximos días sin servicio (Feriados / Eventos):*\n` +
                    `• Viernes 24 de Octubre (Jornada Pedagógica Institucional)\n` +
                    `• Lunes 2 y Martes 3 de Noviembre (Feriado Nacional de Difuntos e Independencia de Cuenca)\n\n` +
                    `↩️ Responde *0* para volver al menú principal.`,
                nextState: 'MAIN_MENU',
            };
        }
        // Option 4: Consultar saldo y código
        if (text === '4') {
            return {
                reply: `👦 *Consulta de Saldo y Código del Alumno:*\n\n` +
                    `Por favor ingresa el *número de cédula* del padre/tutor registrado o el *código del estudiante* (ej. EST-101):`,
                nextState: 'AWAITING_STUDENT_QUERY',
            };
        }
        // Option 5: Derivación a Atención Humana
        if (text === '5') {
            return {
                reply: `👨‍💼 *Atención Administrativa Personalizada:*\n\n` +
                    `Te estamos conectando con el área administrativa. Un agente te responderá en este mismo chat en un lapso de 5 a 10 minutos.\n\n` +
                    `_(El sistema generó el ticket de atención #TKT-${Math.floor(1000 + Math.random() * 9000)} en el panel de administración)._\n\n` +
                    `↩️ Responde *0* en cualquier momento para reactivar el menú automático.`,
                nextState: 'HUMAN_AGENT_SILENCED',
            };
        }
        return {
            reply: `🤖 No comprendí tu mensaje. Escribe *0* o *MENU* para ver las opciones disponibles.`,
            nextState: 'MAIN_MENU',
        };
    }
}
//# sourceMappingURL=stateMachine.js.map