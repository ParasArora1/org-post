import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function OrganizationPosts() {
  const router = useRouter();
  const { orgId } = router.query;

  const [posts, setPosts] = useState([]);
  // currentUserRole is set using the membership API response ("ADMIN" or "MEMBER")
  const [currentUserRole, setCurrentUserRole] = useState("MEMBER");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Fetch membership data and set currentUserRole
  useEffect(() => {
    if (!orgId) return;
    const token = localStorage.getItem("token");
    fetch(`/api/organization/members?orgId=${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        // Expect the API to return a field "currentUserRole"
        setCurrentUserRole(data.currentUserRole || "MEMBER");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load membership information.");
      });
  }, [orgId]);

  // Fetch posts for the organization
  useEffect(() => {
    if (!orgId) return;
    const token = localStorage.getItem("token");
    fetch(`/api/post?orgId=${orgId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data.posts || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load posts.");
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  // Function to delete a post (only rendered for admins)
  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const message = await res.text();
        console.error("Delete failed:", message);
        throw new Error(message);
      }
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete the post.");
    }
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setShowDialog(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      handleDelete(postToDelete);
      setPostToDelete(null);
    }
    setShowDialog(false);
  };

  const handleCancelDelete = () => {
    setPostToDelete(null);
    setShowDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800">
        <div className="text-white text-xl font-semibold">Loading Posts...</div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white relative">
      {/* Sidebar Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-opacity-40 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg z-50 flex flex-col items-start p-6"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white text-xl self-end mb-4"
            >
              &#x2715;
            </button>
            <ul className="space-y-4 text-lg">
              <li>
                <Link href="/dashboard" className="text-blue-400 hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/organization/create" className="text-blue-400 hover:underline">
                  Create Organization
                </Link>
              </li>
              <li>
                <Link href="/organization/join" className="text-blue-400 hover:underline">
                  Join Organization
                </Link>
              </li>
              <li>
                <Link href="/logout" className="text-red-400 hover:underline">
                  Logout
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative p-6">
        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 left-4 z-20 focus:outline-none text-white"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg"
        >
          Organization Posts
        </motion.h1>

        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="p-4 bg-gray-800 rounded-lg flex justify-between items-center"
              >
                <p>{post.content}</p>
                {/* Render delete button only if currentUserRole is ADMIN */}
                {currentUserRole === "ADMIN" && (
                  <button
                    onClick={() => handleDeleteClick(post.id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg text-center">
            <p className="text-white mb-4">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
