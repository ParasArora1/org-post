import prisma from '../../../prisma/PrismaClient.js';
import { authenticate } from '../../../utils/authMiddleware.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    authenticate(req, res, async () => {
      const { organizationId } = req.body;
      if (!organizationId) {
        return res.status(400).json({ error: "Organization ID is required." });
      }
      try {
        // Check if the user is already a member of the organization.
        const existingMembership = await prisma.userOrganization.findUnique({
          where: {
            userId_organizationId: {
              userId: req.userId,
              organizationId,
            },
          },
        });

        if (existingMembership) {
          return res.status(400).json({ error: "Already a member of this organization." });
        }

        // Create a new membership with default role MEMBER.
        const newMembership = await prisma.userOrganization.create({
          data: {
            user: { connect: { id: req.userId } },
            organization: { connect: { id: organizationId } },
            role: 'MEMBER', // or use a constant if defined
          },
        });

        return res.status(200).json(newMembership);
      } catch (error) {
        console.error("Error joining organization:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
