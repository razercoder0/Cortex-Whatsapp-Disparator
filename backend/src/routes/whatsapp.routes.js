import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getQr, getStatus, doLogout } from '../controllers/whatsapp.controller.js';

const r = Router();
r.get('/qr', authRequired, getQr);
r.get('/status', authRequired, getStatus);
r.post('/logout', authRequired, doLogout);
export default r;
