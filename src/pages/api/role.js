import prisma from '../../prisma/PrismaClient.js';
import { authenticate } from '../../utils/authMiddleware.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    authenticate(req, res, async () => {
      const { userId, organizationId, role } = req.body;
      const updatedUser = await prisma.userOrganization.update({
        where: { userId_organizationId: { userId, organizationId } },
        data: { role },
      });
      res.status(200).json(updatedUser);
    });
  }
}
