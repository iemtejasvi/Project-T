"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] desktop-heading">About</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li>
                <Link href="/" className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap desktop-nav-link">Home</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap desktop-nav-link">How It Works</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow pb-8">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text)]">What this is</h2>
            <p className="text-[var(--text)]/85 leading-7 mt-3">
              If Only I Sent This is a quiet place for the words that never made it. Write it down,
              choose a feeling, and let it rest here—anonymously.
            </p>
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text)]">Why it exists</h3>
                <p className="text-[var(--text)]/80 mt-2">Unsent words carry weight. This space lightens it. No public profiles, no clout—just human honesty.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--text)]">How we keep it safe</h3>
                <ul className="list-disc pl-5 text-[var(--text)]/80 space-y-1 mt-2">
                  <li>Manual review for every submission</li>
                  <li>Hate, doxxing, spam and illegal content are removed</li>
                  <li>IP/UUID limits to reduce abuse (6 memories per person)</li>
                  <li>Anonymous by default—no accounts, no public identifiers</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--text)]">What we don’t do</h3>
                <ul className="list-disc pl-5 text-[var(--text)]/80 space-y-1 mt-2">
                  <li>No targeted ads, no social graphs</li>
                  <li>No engagement traps—just reading and writing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--text)]">Credits</h3>
                <p className="text-[var(--text)]/80 mt-2">Built with care, kept minimal on purpose. If you want to help, consider a small donation to keep the lights on.</p>
              </div>
            </div>
          </div>
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">Quick Links</h3>
              <ul className="mt-3 space-y-2">
                <li><Link href="/submit" className="text-[var(--accent)] hover:underline">Write a Memory</Link></li>
                <li><Link href="/memories" className="text-[var(--accent)] hover:underline">Browse the Archive</Link></li>
                <li><Link href="/how-it-works" className="text-[var(--accent)] hover:underline">How It Works</Link></li>
              </ul>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">Contact</h3>
              <p className="text-[var(--text)]/80 mt-2">Feedback, ideas, or issues? Reach out.</p>
              <Link href="/contact" className="inline-block mt-3 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--text)] border border-[var(--border)] hover:bg-blue-200">Contact Us</Link>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">Support</h3>
              <p className="text-[var(--text)]/80 mt-2">If this project helps, you can support its upkeep.</p>
              <Link href="/donate" className="inline-block mt-3 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--text)] border border-[var(--border)] hover:bg-blue-200">Donate</Link>
            </div>
          </aside>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}


