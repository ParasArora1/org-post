// import bcrypt from 'bcryptjs';
// import prisma from '../../prisma/PrismaClient.js';
// import { generateToken } from '../../utils/auth.js';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;
//     if (req.query.type === 'signup') {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       try {
//         const user = await prisma.user.create({ data: { email, password: hashedPassword } });
//         res.status(201).json(user);
//       } catch (error) {
//         res.status(400).json({ error: 'User already exists' });
//       }
//     } else if (req.query.type === 'login') {
//       const user = await prisma.user.findUnique({ where: { email } });
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
//       const token = generateToken(user.id);
//       res.status(200).json({ token });
//     }
//   }
// }

// pages/api/auth.js
// pages/api/auth.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Log out what you receive in the body
    console.log('POST body:', req.body);

    // Send back a JSON response
    return res.status(200).json({
      success: true,
      message: 'POST request successful!',
      method: req.method,
      query: req.query,
      body: req.body,
    });
  }

  // For GET or other methods, just send back something basic
  return res.status(200).json({
    success: true,
    message: 'This is a GET (or other) request.',
    method: req.method,
    query: req.query,
  });
}

