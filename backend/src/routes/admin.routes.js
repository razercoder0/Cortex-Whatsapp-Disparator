import { Router } from 'express';
import { authRequired, adminOnly, ownerOnly } from '../middleware/auth.js';
import { overview, makeAdmin, removeAdmin } from '../controllers/admin.controller.js';

const r = Router();

r.get('/overview', authRequired, adminOnly, overview);
r.post('/make-admin/:id', authRequired, ownerOnly, makeAdmin);
r.post('/remove-admin/:id', authRequired, ownerOnly, removeAdmin);

export default r;
