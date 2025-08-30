import { getQrDataUrl, isReady, logout } from '../services/whatsapp.js';

export async function getQr(req, res) {
  const dataUrl = await getQrDataUrl(req.user.id);
  if (!dataUrl) return res.json({ qr: null, ready: isReady(req.user.id) });
  res.json({ qr: dataUrl, ready: false });
}

export async function getStatus(req, res) {
  res.json({ ready: isReady(req.user.id) });
}

export async function doLogout(req, res) {
  await logout(req.user.id);
  res.json({ ok: true });
}
