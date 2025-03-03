import prisma from '../../prisma/PrismaClient.js';
import { authenticate } from '../../utils/authMiddleware.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    authenticate(req, res, async () => {
      const { name } = req.body;

      if (!req.userId) {
        return res.status(400).json({ error: "User ID is missing from request." });
      }

      try {
        // Check if an organization with the same name already exists
        const existingOrganization = await prisma.organization.findUnique({
          where: { name },
        });

        if (existingOrganization) {
          return res
            .status(400)
            .json({ error: "An organization with this name already exists." });
        }

        // Create the organization
        const organization = await prisma.organization.create({
          data: {
            name,
            users: {
              create: {
                user: { connect: { id: req.userId } },
                role: 'ADMIN',
              },
            },
          },
        });

        res.status(201).json(organization);
      } catch (error) {
        if (error.code === 'P2002') {
          return res
            .status(400)
            .json({ error: "An organization with this name already exists." });
        }

        console.error("Error creating organization:", error);
        res.status(500).json({ error: "Internal server error." });
      }
    });
  } else if (req.method === 'GET') {
    authenticate(req, res, async () => {
      if (!req.userId) {
        return res.status(400).json({ error: "User ID is missing from request." });
      }

      try {
        // Fetch organizations where the logged-in user is a member
        const organizations = await prisma.organization.findMany({
          where: {
            users: {
              some: {
                userId: req.userId,
              },
            },
          },
          include: {
            users: true,
          },
        });

        res.status(200).json({ organizations });
      } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ error: "Internal server error." });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
