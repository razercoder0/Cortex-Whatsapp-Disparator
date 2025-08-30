import User from '../models/User.js';

// Overview já existente
export async function overview(req, res) {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  const totalSent = 0; // ou puxar dos logs
  const totalFailed = 0;

  res.json({
    users: users.map(u => ({ id: u._id, email: u.email, role: u.role, lastLoginAt: u.lastLoginAt })),
    totals: { sent: totalSent, failed: totalFailed },
    ranking: [] // ou preencher com ranking real
  });
}

// Promover a admin
export async function makeAdmin(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    if (user.role === "owner") return res.status(403).json({ message: "Não pode modificar o dono" });

    user.role = "admin";
    await user.save();
    res.json({ message: `${user.email} agora é admin.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Remover admin
export async function removeAdmin(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    if (user.role !== "admin") return res.status(400).json({ message: "Usuário não é admin" });

    user.role = "user";
    await user.save();
    res.json({ message: `${user.email} deixou de ser admin.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
