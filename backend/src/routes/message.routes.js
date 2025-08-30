import { Router } from 'express';
import { sendBulk, getLogs, clearLogs } from '../controllers/message.controller.js';
import { authRequired } from '../middleware/auth.js';

const r = Router();

r.post('/send', authRequired, sendBulk);
r.get('/logs', authRequired, getLogs);
r.delete('/logs', authRequired, clearLogs); // rota para limpar logs

export default r;
