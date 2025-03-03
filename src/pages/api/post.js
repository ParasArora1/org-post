import prisma from '../../prisma/PrismaClient.js';
import { authenticate } from '../../utils/authMiddleware.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // GET: fetch posts for a given organization.
    authenticate(req, res, async () => {
      const { orgId } = req.query;
      if (!orgId) {
        return res.status(400).json({ error: "Organization ID is required." });
      }
      try {
        const posts = await prisma.post.findMany({
          where: {
            organizationId: orgId,
          },
          // Optionally, add ordering or other filters
        });
        return res.status(200).json({ posts });
      } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ error: "Error fetching posts" });
      }
    });
  } else if (req.method === 'POST') {
    // POST: create a new post
    authenticate(req, res, async () => {
      try {
        const { content, organizationId } = req.body;
        const orgId = organizationId || req.query.orgId;
        if (!orgId) {
          return res.status(400).json({ error: "Organization ID is required." });
        }
        // Check if the user is a member of the organization.
        const membership = await prisma.userOrganization.findUnique({
          where: {
            userId_organizationId: { userId: req.userId, organizationId: orgId },
          },
        });
        if (!membership) {
          return res.status(403).json({ error: 'Not a member of this organization' });
        }
        // Create the post (note: the relation field is "user" as per your schema)
        const post = await prisma.post.create({
          data: {
            content,
            organization: { connect: { id: orgId } },
            user: { connect: { id: req.userId } },
          },
        });
        return res.status(201).json(post);
      } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ error: error.message || "Internal server error" });
      }
    });
  } else if (req.method === 'DELETE') {
    // DELETE: delete a post. Expect the post ID in the query parameter 'id'
    authenticate(req, res, async () => {
      const { id } = req.query; // id is the post ID
      if (!id) {
        return res.status(400).json({ error: "Post ID is required." });
      }
      // Fetch the post to verify it exists and to check if the user is admin.
      const post = await prisma.post.findUnique({
        where: { id },
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }
      // Check if the user is admin of the organization that owns the post.
      const membership = await prisma.userOrganization.findUnique({
        where: {
          userId_organizationId: { userId: req.userId, organizationId: post.organizationId },
        },
      });
      if (!membership || membership.role.toUpperCase() !== "ADMIN") {
        return res.status(403).json({ error: "Not authorized to delete this post." });
      }
      try {
        const deletedPost = await prisma.post.delete({ where: { id } });
        return res.status(200).json(deletedPost);
      } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ error: error.message || "Error deleting post." });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
