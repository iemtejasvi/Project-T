"use client";
import Link from "next/link";
import { useState } from "react";

export default function HowItWorks() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 text-center relative">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">How It Works</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
              Home
            </Link>
            <Link href="/memories" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
              Memories
            </Link>
            <Link href="/submit" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
              Submit
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                More ▼
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] border border-[var(--border)] rounded shadow-lg z-10">
                  <Link href="/how-it-works/contact" className="block px-4 py-2 hover:bg-[var(--accent)]">
                    Contact
                  </Link>
                  <Link href="/how-it-works/privacy-policy" className="block px-4 py-2 hover:bg-[var(--accent)]">
                    Privacy Policy
                  </Link>
                  <Link href="/how-it-works/donate" className="block px-4 py-2 hover:bg-[var(--accent)]">
                    Donate
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <article className="bg-[var(--card-bg)] p-6 sm:p-8 rounded-lg shadow-md animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[var(--text)]">About If Only I Sent This</h2>
          <p className="text-base sm:text-lg text-[var(--text)] mb-4">
            Welcome to a sanctuary for unsent words—a space to share memories you never had the chance to send. Here, every message is a piece of art, evoking emotions that are tender, bittersweet, and beautifully raw.
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-[var(--text)]">What You Can Do</h3>
          <ul className="list-disc list-inside text-base sm:text-lg text-[var(--text)] mb-4">
            <li><strong>Create Memories:</strong> Write messages, choose from an array of colors and effects, and express yourself.</li>
            <li><strong>Explore:</strong> Flip through cards on the home page to relive emotions, or dive deeper by clicking the arrow.</li>
            <li><strong>Special Touch:</strong> Look for the ★ symbol indicating special effects.</li>
            <li><strong>Dynamic Experience:</strong> Enjoy a theme that changes with the time of day.</li>
          </ul>
          <p className="text-base sm:text-lg text-[var(--text)]">
            Get started by visiting the <Link href="/submit" className="text-[var(--accent)] hover:underline">Submit</Link> page or explore memories on the <Link href="/memories" className="text-[var(--accent)] hover:underline">Memories</Link> page.
          </p>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
