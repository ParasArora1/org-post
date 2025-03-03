import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear user token and other related data
    localStorage.removeItem("token");

    // Optionally, clear any additional state
    localStorage.removeItem("user");

    // Redirect to login page
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white">
      <div className="text-center">
        <svg
          className="animate-spin h-12 w-12 text-blue-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4zm2 5.291A7.963 7.963 0 014 12h8v8a7.963 7.963 0 01-6-2.709z"
          ></path>
        </svg>
        <p className="text-lg font-medium">Logging you out...</p>
      </div>
    </div>
  );
}
