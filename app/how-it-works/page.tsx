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
          <nav className="relative">
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 items-center">
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
              <li className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 flex items-center py-2"
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
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[var(--text)]">Using If Only I Sent This</h2>
          <p className="text-base sm:text-lg text-[var(--text)] mb-4">
            This is a sanctuary for unsent words—a place to lay down memories you couldn’t share. Whether it’s for a person, a pet, or a moment, your thoughts find peace here.
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-[var(--text)]">What You Can Do</h3>
          <ul className="list-disc list-inside text-base sm:text-lg text-[var(--text)] mb-4">
            <li><strong>Create Memories:</strong> Write messages, pick colors, and add effects like bleeding or handwritten text.</li>
            <li><strong>Explore:</strong> Flip cards on the home page to read messages or click the arrow to dive deeper.</li>
            <li><strong>Stars:</strong> Special effects are marked with a ★ on cards.</li>
            <li><strong>Quotes:</strong> Rotating quotes on the home page set the tone.</li>
          </ul>
          <p className="text-base sm:text-lg text-[var(--text)]">
            Start by heading to the <Link href="/submit" className="text-[var(--accent)] hover:underline">Submit</Link> page, or browse the <Link href="/memories" className="text-[var(--accent)] hover:underline">Memories</Link> page to see what others have shared.
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
