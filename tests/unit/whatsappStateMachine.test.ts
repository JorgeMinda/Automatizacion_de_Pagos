import { describe, it, expect } from 'vitest';
import { WhatsAppStateMachine } from '../../src/modules/whatsapp/stateMachine';

describe('WhatsAppStateMachine (Bot de Autoatención)', () => {
  const dummyMenuItems = [
    { name: 'Almuerzo Ejecutivo', price: 3.5 },
    { name: 'Jugo Natural', price: 1.0 },
  ];

  it('debe desplegar el menú de bienvenida con las 5 opciones al recibir "HOLA" o "MENU"', () => {
    const result = WhatsAppStateMachine.processMessage('Hola', dummyMenuItems);
    expect(result.nextState).toBe('MAIN_MENU');
    expect(result.reply).toContain('1️⃣ 🍽️ *Ver menú del día y del mes*');
    expect(result.reply).toContain('2️⃣ 💳 *Datos bancarios y cómo pagar*');
    expect(result.reply).toContain('3️⃣ 📅 *Días de servicio y horarios*');
    expect(result.reply).toContain('4️⃣ 👦 *Consultar saldo y código de mi hijo/a*');
    expect(result.reply).toContain('5️⃣ 📞 *Hablar con un administrador*');
  });

  it('Opción 1: debe devolver el menú del día con el enlace al PDF mensual', () => {
    const result = WhatsAppStateMachine.processMessage('1', dummyMenuItems);
    expect(result.reply).toContain('🍽️ *Menú del Día');
    expect(result.reply).toContain('https://pagos.comedorescolar.com/menu-mensual.pdf');
    expect(result.reply).toContain('Responde *0* para volver al menú principal');
  });

  it('Opción 2: debe proveer las cuentas bancarias oficiales y el enlace al portal de autogestión', () => {
    const result = WhatsAppStateMachine.processMessage('2', dummyMenuItems);
    expect(result.reply).toContain('Banco Pichincha');
    expect(result.reply).toContain('2200987654');
    expect(result.reply).toContain('https://pagos.comedorescolar.com/recargar');
  });

  it('Opción 3: debe retornar los horarios de almuerzo y feriados', () => {
    const result = WhatsAppStateMachine.processMessage('3', dummyMenuItems);
    expect(result.reply).toContain('12:00 PM a 02:30 PM');
    expect(result.reply).toContain('Feriado Nacional');
  });

  it('Opción 4: debe pasar al estado AWAITING_STUDENT_QUERY y pedir cédula o código', () => {
    const result = WhatsAppStateMachine.processMessage('4', dummyMenuItems);
    expect(result.nextState).toBe('AWAITING_STUDENT_QUERY');
    expect(result.reply).toContain('número de cédula');
  });

  it('Consulta autenticada: debe retornar el saldo en $ y almuerzos en paquete', () => {
    const result = WhatsAppStateMachine.processMessage('1723456789', dummyMenuItems, 'AWAITING_STUDENT_QUERY');
    expect(result.nextState).toBe('MAIN_MENU');
    expect(result.reply).toContain('Mateo Benítez');
    expect(result.reply).toContain('$18.50');
    expect(result.reply).toContain('4 Almuerzos Restantes');
  });

  it('Opción 5: debe derivar a soporte humano y silenciar el bot temporalmente', () => {
    const result = WhatsAppStateMachine.processMessage('5', dummyMenuItems);
    expect(result.nextState).toBe('HUMAN_AGENT_SILENCED');
    expect(result.reply).toContain('Atención Administrativa Personalizada');
    expect(result.reply).toContain('ticket de atención');
  });

  it('Comando 0: debe resetear y volver al menú principal desde cualquier estado', () => {
    const result = WhatsAppStateMachine.processMessage('0', dummyMenuItems, 'HUMAN_AGENT_SILENCED');
    expect(result.nextState).toBe('MAIN_MENU');
    expect(result.reply).toContain('Bienvenido al servicio de comedor escolar');
  });
});
