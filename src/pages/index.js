import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Simple inline SVG logo component
function Logo() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto">
      <circle cx="50" cy="50" r="45" fill="#4f46e5" stroke="#4338ca" strokeWidth="5" />
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontFamily="sans-serif"
      >
        M
      </text>
    </svg>
  );
}

// Inline SVG for Login icon
function LoginIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" d="M10 17l5-5-5-5v10z" />
      <path fill="none" d="M0 0h24v24H0z" />
    </svg>
  );
}

// Inline SVG for Sign Up icon
function SignupIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 flex flex-col items-center justify-center p-6`}
    >
      {/* Header Section */}
      <header className="mb-12 text-center">
        <Logo />
        <h1 className="text-4xl font-bold mt-4 text-gray-800">
          Management Platform
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Streamline your operations. Empower your team.
        </p>
      </header>

      {/* Navigation Buttons */}
      <main className="flex flex-col items-center gap-6">
        <div className="flex gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white text-lg hover:bg-blue-700 transition"
          >
            <LoginIcon />
            Login
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-blue-600 text-blue-600 text-lg hover:bg-blue-600 hover:text-white transition"
          >
            <SignupIcon />
            Sign Up
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Management Platform. All rights reserved.
      </footer>
    </div>
  );
}
