"use client";

import { useState } from "react";
import Link from "next/link";

export default function HowItWorks() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">How It Works</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/memories"
                  className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap"
                >
                  Memories
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap"
                >
                  Submit
                </Link>
              </li>
              <li className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap"
                >
                  More Options ▼
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 right-0 bg-[var(--card-bg)] border border-[var(--border)] rounded shadow-lg z-10">
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
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <article className="bg-[var(--card-bg)] p-6 sm:p-8 rounded-lg shadow-md animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[var(--text)]">
            Using If Only I Sent This
          </h2>
          <p className="text-base sm:text-lg text-[var(--text)] mb-4">
            This is a sanctuary for unsent words—a place to lay down memories you couldn&apos;t share.
            Whether it&apos;s for a person, a pet, or a moment, your thoughts find peace here.
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-[var(--text)]">
            What You Can Do
          </h3>
          <ul className="list-disc list-inside text-base sm:text-lg text-[var(--text)] mb-4">
            <li>
              <strong>Create Memories:</strong> Write messages, pick colors, and add effects like bleeding or handwritten text.
            </li>
            <li>
              <strong>Explore:</strong> Flip cards on the home page to read messages or click the arrow to dive deeper.
            </li>
            <li>
              <strong>Stars:</strong> Special effects are marked with a ★ on cards.
            </li>
            <li>
              <strong>Quotes:</strong> Rotating quotes on the home page set the tone.
            </li>
          </ul>
          <p className="text-base sm:text-lg text-[var(--text)]">
            Start by heading to the{" "}
            <Link href="/submit" className="text-[var(--accent)] hover:underline whitespace-nowrap">
              Submit
            </Link>{" "}
            page, or browse the{" "}
            <Link href="/memories" className="text-[var(--accent)] hover:underline whitespace-nowrap">
              Memories
            </Link>{" "}
            page to see what others have shared.
          </p>
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Home Page</h3>
            <p className="mb-2">The home page showcases:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Up to 3 most recent approved memories</li>
              <li>Pinned memories appear first, followed by newest memories</li>
              <li>Each memory card can be flipped to reveal the full message</li>
              <li>Click the arrow to view the memory in detail</li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Memories Page</h3>
            <p className="mb-2">The memories page features:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>All approved memories in chronological order</li>
              <li>Pinned memories appear at the top</li>
              <li>Detailed view of each memory</li>
              <li>Option to share memories via URL</li>
            </ul>
          </div>
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
