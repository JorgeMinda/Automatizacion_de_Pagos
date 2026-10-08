import type { Api } from 'wasp/server/api';
import { WhatsAppStateMachine } from './stateMachine';
import { WhatsAppCloudApiAdapter } from './whatsappService';

export const handleWhatsAppWebhook: Api = async (req, res, context) => {
  const body = req.body;

  if (!body || body.object !== 'whatsapp_business_account') {
    return res.status(200).send('EVENT_NOT_SUPPORTED');
  }

  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const messageObj = changes?.value?.messages?.[0];

  const fromNumber = messageObj?.from;
  const textBody = messageObj?.text?.body;

  if (!fromNumber || !textBody) {
    return res.status(200).send('IGNORED_NO_TEXT');
  }

  // 1. Obtener menú de la base de datos central en tiempo real
  const activeMenuItems = await context.entities.MenuItemRecipe.findMany({
    where: { active: true },
    select: { name: true, price: true }
  });

  const formattedMenu = activeMenuItems.map((item: any) => ({
    name: item.name,
    price: Number(item.price)
  }));

  // 2. Procesar respuesta mediante la máquina de estados desacoplada
  const replyMessage = WhatsAppStateMachine.processMessage(textBody, formattedMenu);

  // 3. Enviar respuesta usando el adaptador
  const messenger = new WhatsAppCloudApiAdapter();
  await messenger.sendTextMessage(fromNumber, replyMessage);

  return res.status(200).json({ status: 'PROCESSED' });
};

export const verifyWhatsAppWebhook: Api = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'webhook_secure_verify_token_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    return res.status(200).send(challenge);
  }

  return res.status(403).send('Forbidden: Token mismatch');
};
