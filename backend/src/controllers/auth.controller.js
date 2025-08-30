import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.json({ ok: false, field: 'email', message: 'Email já registrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash: hash, role: 'user' });
    await user.save();

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Erro no servidor' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: false, field: 'email', message: 'Email não registrado' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.json({ ok: false, field: 'password', message: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Atualiza o último login
    user.lastLoginAt = new Date();
    await user.save();

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Erro no servidor' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ ok: false });
    res.json({ email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Erro no servidor' });
  }
};
