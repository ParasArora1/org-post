// File: src/pages/api/organization/available.js

import prisma from '../../../prisma/PrismaClient.js';
import { authenticate } from '../../../utils/authMiddleware.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    authenticate(req, res, async () => {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      try {
        // Fetch organizations where the current user is NOT a member.
        const availableOrganizations = await prisma.organization.findMany({
          where: {
            users: {
              none: {
                userId: req.userId,
              },
            },
          },
        });
        return res.status(200).json({ organizations: availableOrganizations });
      } catch (error) {
        console.error("Error fetching available organizations:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
