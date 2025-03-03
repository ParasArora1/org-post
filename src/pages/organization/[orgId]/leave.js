import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LeaveOrganization() {
  const router = useRouter();
  const { orgId } = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleLeave() {
    const response = await fetch("/api/organization/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "12345", // Replace "12345" with the actual userId
      },
      body: JSON.stringify({
        organizationId: "67890", // Replace with the actual organizationId
        newAdminId: "54321", // Optional; only required for admin leaving
      }),
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }
    console.log(data.message);
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold mb-6"
      >
        Leave Organization
      </motion.h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <p className="mb-6 text-center">
        Are you sure you want to leave this organization? If you are the current admin, the next member who joined will be promoted to admin.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={handleLeave}
          disabled={loading}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold"
        >
          {loading ? "Leaving..." : "Yes, Leave"}
        </button>
        <Link
          href={`/dashboard`}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
