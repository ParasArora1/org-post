import prisma from "../../../prisma/PrismaClient";
import { authenticate } from "../../../utils/authMiddleware";

// Helper function to check if the user is an ADMIN in the given organization.
async function isAdmin(userId, organizationId) {
  const userOrg = await prisma.userOrganization.findFirst({
    where: { organizationId, userId },
  });
  return userOrg ? userOrg.role === "ADMIN" : false;
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    // GET: Return a single post and an isAdmin flag.
    authenticate(req, res, async () => {
      try {
        const { userId } = req;
        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
          return res.status(404).json({ error: "Post not found." });
        }

        const adminCheck = await isAdmin(userId, post.organizationId);
        return res.status(200).json({ post, isAdmin: adminCheck });
      } catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).json({ error: "Internal server error." });
      }
    });
  } else if (req.method === "DELETE") {
    // DELETE: Delete the post if the user is an ADMIN.
    authenticate(req, res, async () => {
      try {
        const { userId } = req;
        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
          return res.status(404).json({ error: "Post not found." });
        }

        const adminCheck = await isAdmin(userId, post.organizationId);
        if (!adminCheck) {
          return res
            .status(403)
            .json({ error: "Only ADMIN can delete posts." });
        }

        await prisma.post.delete({ where: { id } });
        return res.status(200).json({ message: "Post deleted successfully." });
      } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ error: "Internal server error." });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
