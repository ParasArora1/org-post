// pages/api/organization/members.js

import prisma from '../../../prisma/PrismaClient.js';
import { authenticate } from '../../../utils/authMiddleware.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // GET: fetch all members for a given organization
    authenticate(req, res, async () => {
      const { orgId } = req.query;
      if (!orgId) {
        return res.status(400).json({ error: "Organization ID is required" });
      }
      try {
        // Query for all memberships for the given organization,
        // including user details.
        const members = await prisma.userOrganization.findMany({
          where: { organizationId: orgId },
          include: { user: true },
        });

        // Determine the current user's role for this organization.
        const currentMembership = members.find(
          (m) => m.userId === req.userId
        );
        const currentUserRole = currentMembership ? currentMembership.role : null;

        return res.status(200).json({ members, currentUserRole });
      } catch (error) {
        console.error("Error fetching members:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  } else if (req.method === 'DELETE') {
    // DELETE: remove a member (only admins can do this)
    authenticate(req, res, async () => {
      const { organizationId, memberId } = req.body;
      if (!organizationId || !memberId) {
        return res.status(400).json({ error: "Organization ID and member ID are required" });
      }
      try {
        // Only allow deletion if current user is admin
        const currentMembership = await prisma.userOrganization.findUnique({
          where: {
            userId_organizationId: {
              userId: req.userId,
              organizationId,
            },
          },
        });
        if (!currentMembership || currentMembership.role !== "ADMIN") {
          return res.status(403).json({ error: "Not authorized to remove members" });
        }
        // Remove the membership for the specified member.
        await prisma.userOrganization.delete({
          where: {
            userId_organizationId: {
              userId: memberId,
              organizationId,
            },
          },
        });
        return res.status(200).json({ message: "Member removed" });
      } catch (error) {
        console.error("Error removing member:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
