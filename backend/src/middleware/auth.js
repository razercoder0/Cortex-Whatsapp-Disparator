import jwt from 'jsonwebtoken';

// Middleware para autenticação básica
export function authRequired(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token ausente' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Middleware para acesso de admins (agora owner também tem acesso)
export function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Não autenticado' });

  if (req.user.role === 'admin' || req.user.role === 'owner') {
    return next();
  }

  return res.status(403).json({ error: 'Acesso negado. Entre com admin.' });
}

// Middleware apenas para o dono (owner)
export const ownerOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Não autenticado' });

  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Acesso negado. Apenas o dono pode fazer isso." });
  }

  next();
};
