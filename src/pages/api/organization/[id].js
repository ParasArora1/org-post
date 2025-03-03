import prisma from "../../../prisma/PrismaClient";
import { authenticate } from "../../../utils/authMiddleware";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    authenticate(req, res, async () => {
      try {
        const { userId } = req;

        // Fetch the organization data.
        const organization = await prisma.organization.findUnique({
          where: { id },
        });

        if (!organization) {
          return res.status(404).json({ error: "Organization not found." });
        }

        // Fetch the current user's membership details for the organization.
        const membership = await prisma.userOrganization.findFirst({
          where: {
            organizationId: id,
            userId,
          },
        });

        // Explicitly set isAdmin to false if no membership record is found.
        const isAdmin = membership ? membership.role === "ADMIN" : false;

        return res.status(200).json({ organization, membership, isAdmin });
      } catch (error) {
        console.error("Error fetching organization data:", error);
        return res.status(500).json({ error: "Internal server error." });
      }
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
