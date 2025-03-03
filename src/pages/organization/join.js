import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function JoinOrganization() {
  const [availableOrgs, setAvailableOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch organizations that the current user is not a member of.
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/organization/available", {
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
        setAvailableOrgs(data.organizations || []);
      })
      .catch((err) => {
        console.error("Error fetching available organizations:", err);
        setError("Failed to load available organizations.");
      });
  }, []);

  async function handleJoin(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/organization/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organizationId: selectedOrg }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error joining organization (${res.status}): ${text}`);
      }
      await res.json();
      router.push(`/organization/${selectedOrg}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to join organization.");
    }
  }

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-800">
      <form
        onSubmit={handleJoin}
        className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-all hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Join Organization</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-6">
          <label htmlFor="organization" className="block text-gray-300 text-sm mb-2">
            Select an Organization
          </label>
          <select
            id="organization"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            required
          >
            <option value="">Choose an organization</option>
            {availableOrgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
        >
          Join Organization
        </button>
        <p className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:underline hover:text-blue-500 transition duration-300"
          >
            Back to Dashboard
          </Link>
        </p>
      </form>
    </div>
  );
}