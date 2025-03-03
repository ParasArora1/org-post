import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/auth?type=login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.form
        onSubmit={handleLogin}
        className="bg-gray-900 bg-opacity-80 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl text-blue-500 font-extrabold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-400 font-semibold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="mt-2 w-full p-3 rounded-xl bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-400 font-semibold">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="mt-2 w-full p-3 rounded-xl bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          Login
        </motion.button>
        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
