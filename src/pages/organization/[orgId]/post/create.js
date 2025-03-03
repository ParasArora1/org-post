import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePost() {
  const router = useRouter();
  const { orgId } = router.query;
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, organizationId: orgId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create post");
    } else {
      router.push(`/organization/${orgId}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white relative">
      {/* Overlay for Blur */}
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
          Create Post
        </motion.h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md mx-auto"
        >
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-300 font-semibold">
              Post Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-lg text-center text-white font-semibold hover:from-green-500 hover:to-green-700 transition"
          >
            Submit Post
          </button>
          <p className="mt-4 text-center">
            <Link
              href={`/organization/${orgId}`}
              className="text-blue-400 hover:underline hover:text-blue-500"
            >
              Back to Organization
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
