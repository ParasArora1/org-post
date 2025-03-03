import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
export const generateToken = (userId) => jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });