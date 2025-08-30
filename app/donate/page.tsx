"use client";

import Link from "next/link";
import { useState } from "react";

export default function Donate() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Support Us</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex justify-center gap-4 desktop-nav-list">
              <li>
                <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors desktop-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors desktop-nav-link">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 py-8">
        <section className="bg-[var(--card-bg)] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Support Our Mission</h2>
          <p className="text-[var(--text)] text-lg mb-6">
            Your donations help us maintain the platform and continue providing a safe space for unsent memories. Every contribution, big or small, makes a difference.
          </p>
          
          <div className="bg-[var(--background)] p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Cryptocurrency</h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <span className="text-[var(--text)]">TON:</span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <code className="bg-[var(--card-bg)] px-4 py-2 rounded-lg text-[var(--text)] break-all w-full sm:w-auto">UQB5HOYYssoLz0cOxWxXHuRnMlHuIBdojokuIoJ3Nw8WivkJ</code>
                  <button
                    onClick={() => copyToClipboard('UQB5HOYYssoLz0cOxWxXHuRnMlHuIBdojokuIoJ3Nw8WivkJ', 'ton')}
                    className="px-3 py-2 bg-[var(--accent)] text-[var(--text)] rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                  >
                    {copied === 'ton' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <span className="text-[var(--text)]">Solana:</span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <code className="bg-[var(--card-bg)] px-4 py-2 rounded-lg text-[var(--text)] break-all w-full sm:w-auto">F7kqLV7kCp9CWe34rdtE9NjUf5615FBeTrwgFZCqazxE</code>
                  <button
                    onClick={() => copyToClipboard('F7kqLV7kCp9CWe34rdtE9NjUf5615FBeTrwgFZCqazxE', 'solana')}
                    className="px-3 py-2 bg-[var(--accent)] text-[var(--text)] rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                  >
                    {copied === 'solana' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <span className="text-[var(--text)]">Ethereum:</span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <code className="bg-[var(--card-bg)] px-4 py-2 rounded-lg text-[var(--text)] break-all w-full sm:w-auto">0xc626eb78b14dA3f400706084130fc693906EC0c1</code>
                  <button
                    onClick={() => copyToClipboard('0xc626eb78b14dA3f400706084130fc693906EC0c1', 'eth')}
                    className="px-3 py-2 bg-[var(--accent)] text-[var(--text)] rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                  >
                    {copied === 'eth' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[var(--text)] text-lg mt-8">
            Thank you for your support!
          </p>
        </section>
      </main>

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-[var(--text)] footer-copyright">
          © {new Date().getFullYear()} — If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
