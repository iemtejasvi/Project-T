import Link from "next/link";
import { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found .  If Only I Sent This",
  description: "The page you are looking for does not exist. Browse our archive of unsent messages or write your own.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">
            If Only I Sent This
          </h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6">
              <li>
                <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="text-[var(--text)] hover:text-[var(--accent)]">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-[var(--text)] hover:text-[var(--accent)]">
                  Confess
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-8xl font-bold text-[var(--text)] opacity-20 mb-4">404</p>
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-3">
            This page was never sent
          </h2>
          <p className="text-[var(--text)] opacity-70 mb-8">
            Some words are never meant to be found. But there are thousands of unsent messages waiting for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/memories"
              className="px-6 py-3 bg-[var(--text)] text-[var(--background)] font-semibold rounded-lg shadow hover:opacity-90 transition-opacity"
            >
              Browse Messages
            </Link>
            <Link
              href="/submit"
              className="px-6 py-3 border border-[var(--text)] text-[var(--text)] font-semibold rounded-lg hover:bg-[var(--text)] hover:text-[var(--background)] transition-colors"
            >
              Write Your Own
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
