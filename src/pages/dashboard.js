import { useEffect, useState } from "react"; 
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch("/api/organization", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrganizations(data.organizations || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800">
        <div className="text-white text-xl font-semibold">Loading Dashboard...</div>
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

        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg"
        >
          ORG-POST
        </motion.h1>

        <section className="mb-6">
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-gray-600 pb-2">
            Your Organizations
          </h2>
          {organizations.length === 0 ? (
            <p className="text-gray-400 italic">
              You haven't joined any organizations yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {organizations.map((org) => (
                <motion.div
                  key={org.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                >
                  <h3 className="text-2xl font-semibold text-blue-400 mb-2">
                    <Link href={`/organization/${org.id}`} className="hover:underline">
                      {org.name}
                    </Link>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href={`/organization/${org.id}/post/create`}
                      className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 rounded-lg text-center text-white font-semibold hover:from-green-500 hover:to-green-700 transition"
                    >
                      Create Post
                    </Link>
                    <Link
                      href={`/organization/${org.id}/members`}
                      className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg text-center text-white font-semibold hover:from-purple-500 hover:to-purple-700 transition"
                    >
                      View Members
                    </Link>
                    <Link
                      href={`/organization/${org.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg text-center text-white font-semibold hover:from-blue-500 hover:to-blue-700 transition"
                    >
                      View Posts
                    </Link>
                    <Link
                      href={`/organization/${org.id}/leave`}
                      className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 rounded-lg text-center text-white font-semibold hover:from-red-500 hover:to-red-700 transition"
                    >
                      Leave Org
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
