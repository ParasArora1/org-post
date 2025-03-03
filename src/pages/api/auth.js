import bcrypt from 'bcryptjs';
import prisma from '../../prisma/PrismaClient.js';
import { generateToken } from '../../utils/auth.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    if (req.query.type === 'signup') {
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const user = await prisma.user.create({ data: { email, password: hashedPassword } });
        res.status(201).json(user);
      } catch (error) {
        res.status(400).json({ error: 'User already exists' });
      }
    } else if (req.query.type === 'login') {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = generateToken(user.id);
      res.status(200).json({ token });
    }
  }
}
