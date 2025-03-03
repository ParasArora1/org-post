import jwt from 'jsonwebtoken';
import prisma from '../prisma/PrismaClient.js';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) return res.status(401).json({ error: 'User not found' });

    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
