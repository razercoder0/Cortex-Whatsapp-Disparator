import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

import QRCode from 'qrcode';

const clients = new Map(); // userId -> { client, ready, qrDataUrl }

export function getClient(userId) {
  if (clients.has(userId)) return clients.get(userId);
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: String(userId) }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox']
    }
  });
  const state = { client, ready: false, qrDataUrl: null };
  clients.set(userId, state);

  client.on('qr', async (qr) => {
    try {
      const dataUrl = await QRCode.toDataURL(qr);
      state.qrDataUrl = dataUrl;
      state.ready = false;
      // console.log('QR atualizado para', userId);
    } catch (e) {
      console.error('Falha ao gerar QR:', e);
    }
  });

  client.on('ready', () => {
    state.ready = true;
    state.qrDataUrl = null;
    console.log('✅ WhatsApp pronto para userId', userId);
  });

  client.on('disconnected', (reason) => {
    console.log('⚠️ Desconectado userId', userId, reason);
    state.ready = false;
  });

  client.initialize().catch(e => console.error('Erro init client:', e));
  return state;
}

export async function getQrDataUrl(userId) {
  const state = getClient(userId);
  return state.qrDataUrl;
}

export function isReady(userId) {
  const state = clients.get(userId);
  return !!(state && state.ready);
}

export async function logout(userId) {
  const state = clients.get(userId);
  if (!state) return;
  try {
    await state.client.logout();
  } catch {}
  try {
    await state.client.destroy();
  } catch {}
  clients.delete(userId);
}

export async function sendMessageToNumber(userId, number, text) {
  const state = getClient(userId);
  if (!state.ready) throw new Error('Cliente não conectado');
  // Normalize possible formats
  const clean = String(number).replace(/\D/g, '');
  const jid = clean.includes('@c.us') ? clean : clean + '@c.us';
  return await state.client.sendMessage(jid, text);
}
