import MessageLog from '../models/MessageLog.js';
import { sendMessageToNumber } from '../services/whatsapp.js';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

export async function sendBulk(req, res) {
  const { numbers, message, delayMs } = req.body;
  if (!Array.isArray(numbers) || !numbers.length || !message) {
    return res.status(400).json({ error: 'Números ou mensagem inválidos' });
  }

  const perDelay = Number(delayMs) || Number(process.env.DEFAULT_SEND_DELAY_MS) || 3500;
  const maxRetry = Number(process.env.MAX_RETRY) || 2;

  (async () => {
    for (const num of numbers) {
      let attempt = 0, sent = false, lastErr = null;
      while (attempt <= maxRetry && !sent) {
        attempt++;
        try {
          await sendMessageToNumber(req.user.id, num, message);
          await MessageLog.create({ userId: req.user.id, number: num, message, status: 'success', attempt });
          sent = true;
        } catch (e) {
          lastErr = e?.message || String(e);
          await MessageLog.create({ userId: req.user.id, number: num, message, status: 'failed', error: lastErr, attempt });
          if (attempt <= maxRetry) await delay(1200);
        }
      }
      await delay(perDelay);
    }
  })().catch(() => {});

  res.json({ accepted: true });
}

export async function getLogs(req, res) {
  const { limit = 100 } = req.query;
  const logs = await MessageLog.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(Number(limit));
  res.json({ logs });
}

// NOVO: limpa todos os logs do usuário logado
export async function clearLogs(req, res) {
  try {
    await MessageLog.deleteMany({ userId: req.user.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
