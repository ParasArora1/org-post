import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateOrganization() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/organization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create organization.");
    } else {
      // Redirect to the organization's detail page using the returned id.
      router.push(`/organization/${data.id}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800">
        <div className="text-white text-xl font-semibold">Loading Page...</div>
      </div>
    );
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

        <motion.form
          onSubmit={handleSubmit}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-all hover:scale-105 mx-auto"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Create Organization
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-300 text-sm mb-2">
              Organization Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            Create Organization
          </button>
          <p className="mt-6 text-center">
            <Link
              href="/dashboard"
              className="text-blue-400 hover:underline hover:text-blue-500 transition duration-300"
            >
              Back to Dashboard
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
