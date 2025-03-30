"use client";

import { useState } from "react";
import Link from "next/link";

export default function HowItWorks() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-6 sm:px-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">How It Works</h1>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 flex items-center gap-1"
            >
              More Options <span className="text-lg">▼</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] border border-[var(--border)] rounded shadow-lg z-10">
                <Link href="/contact">
                  <div className="px-4 py-2 hover:bg-[var(--accent)] hover:text-[var(--text)] transition-colors cursor-pointer">
                    Contact
                  </div>
                </Link>
                <Link href="/privacy-policy">
                  <div className="px-4 py-2 hover:bg-[var(--accent)] hover:text-[var(--text)] transition-colors cursor-pointer">
                    Privacy Policy
                  </div>
                </Link>
                <Link href="/donate">
                  <div className="px-4 py-2 hover:bg-[var(--accent)] hover:text-[var(--text)] transition-colors cursor-pointer">
                    Donate
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
        <nav className="border-t border-[var(--border)]">
          <ul className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4 sm:gap-6 py-4">
            <li>
              <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/memories" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                Memories
              </Link>
            </li>
            <li>
              <Link href="/submit" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                Submit
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <article className="bg-[var(--card-bg)] p-6 sm:p-8 rounded-lg shadow-md animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[var(--text)]">
            Using If Only I Sent This
          </h2>
          <p className="text-base sm:text-lg text-[var(--text)] mb-4">
            This platform is a sanctuary for unsent words—a place to share memories you never dared to send. Whether it’s a message to a long-lost love, an apology that was never uttered, or a tribute to a cherished moment, your feelings find a home here.
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-[var(--text)]">What You Can Do</h3>
          <ul className="list-disc list-inside text-base sm:text-lg text-[var(--text)] mb-4">
            <li>
              <strong>Create Memories:</strong> Craft messages, choose color themes, and apply special effects like bleeding or handwritten text.
            </li>
            <li>
              <strong>Explore:</strong> Interact with beautifully designed cards. Click the arrow to flip and read the hidden message.
            </li>
            <li>
              <strong>Reflect:</strong> Each memory holds a piece of your past, displayed in a heartfelt design.
            </li>
          </ul>
          <p className="text-base sm:text-lg text-[var(--text)]">
            Begin by visiting the{" "}
            <Link href="/submit" className="text-[var(--accent)] hover:underline">
              Submit
            </Link>{" "}
            page or browse through the{" "}
            <Link href="/memories" className="text-[var(--accent)] hover:underline">
              Memories
            </Link>{" "}
            to see what others have shared.
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
