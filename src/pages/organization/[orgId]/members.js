import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function OrganizationMembers() {
  const router = useRouter();
  const { orgId } = router.query;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

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
        setMembers(data.members || []);
        setCurrentUserRole(data.currentUserRole);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load members.");
        setLoading(false);
      });
  }, [orgId]);

  async function removeMember(memberId) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/organization/members`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organizationId: orgId, memberId }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error removing member: ${text}`);
      }
      // Update the state by filtering out the removed member.
      setMembers(members.filter((m) => m.user.id !== memberId));
    } catch (error) {
      console.error(error);
      setError("Failed to remove member.");
    }
  }

  function handleRemoveClick(memberId) {
    setMemberToRemove(memberId);
    setShowDialog(true);
  }

  function handleConfirmRemove() {
    if (memberToRemove) {
      removeMember(memberToRemove);
      setMemberToRemove(null);
    }
    setShowDialog(false);
  }

  function handleCancelRemove() {
    setMemberToRemove(null);
    setShowDialog(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800">
        <div className="text-white text-xl font-semibold">Loading Members...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white flex items-center justify-center relative">
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

      <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-md">
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

        <h1 className="text-3xl font-bold mb-4 text-center">Organization Members</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {members.length === 0 ? (
          <p className="text-gray-400 italic text-center">No members found.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4">
            {members.map((member) => (
              <li
                key={member.user.id}
                className="p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-medium">{member.user.email}</p>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </div>
                {currentUserRole === "ADMIN" && member.role !== "ADMIN" && (
                  <button
                    onClick={() => handleRemoveClick(member.user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-center">
          <Link
            href={`/organization/${orgId}`}
            className="text-blue-400 hover:underline"
          >
            Back to Organization
          </Link>
        </p>
      </div>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg text-center">
            <p className="text-white mb-4">Are you sure you want to remove this member?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmRemove}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Remove
              </button>
              <button
                onClick={handleCancelRemove}
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
