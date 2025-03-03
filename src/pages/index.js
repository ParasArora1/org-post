import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { motion } from "framer-motion";

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
      className={`
        ${geistSans.variable} 
        ${geistMono.variable} 
        relative 
        min-h-screen 
        flex 
        flex-col 
        items-center 
        justify-center 
        text-gray-200
        bg-gradient-to-b 
        from-black 
        to-[#0A0F1C]
      `}
    >
      {/* Dark wave background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#0B1120"
            fillOpacity="1"
            d="M0,64L60,80C120,96,240,128,360,138.7C480,149,600,139,720,138.7C840,139,960,149,1080,138.7C1200,128,1320,96,1380,80L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>

      {/* Header Section */}
      <header className="mb-12 text-center z-10">
        <Logo />
        <h1 className="text-4xl md:text-5xl font-bold mt-4 text-blue-500">
          Management Platform
        </h1>
        <p className="mt-2 text-lg text-gray-400 max-w-md mx-auto">
          Streamline your operations. Empower your team.
        </p>
      </header>

      {/* Navigation Buttons */}
      <main className="flex flex-col items-center gap-6 z-10">
        <div className="flex flex-wrap gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/login"
              className="
                flex 
                items-center 
                gap-2 
                px-6 
                py-3 
                rounded-full 
                bg-blue-600 
                text-white 
                text-lg 
                font-medium
                shadow-md
                hover:shadow-blue-700/50
                hover:bg-blue-700 
                transition 
                focus:ring-4 
                focus:ring-blue-300
              "
            >
              <LoginIcon />
              Login
            </Link>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/signup"
              className="
                flex 
                items-center 
                gap-2 
                px-6 
                py-3 
                rounded-full 
                border 
                border-blue-600 
                text-blue-600 
                text-lg 
                font-medium
                shadow-md
                hover:bg-blue-600 
                hover:text-white 
                hover:shadow-blue-700/50
                transition 
                focus:ring-4 
                focus:ring-blue-300
              "
            >
              <SignupIcon />
              Sign Up
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-gray-500 z-10">
        © {new Date().getFullYear()} Management Platform. All rights reserved.
      </footer>
    </div>
  );
}
