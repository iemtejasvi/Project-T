import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">About</h1>
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

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <section className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)]">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[var(--text)]">Our Purpose</h2>
          <p className="text-[var(--text)] text-base sm:text-lg mb-6">
            If Only I Sent This is a sanctuary for unsent words. We built this place so you can
            safely share memories you couldn’t send—letters to people, pets, or moments that still
            live with you. Your voice matters here: anonymously, gently, and without judgment.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[var(--text)]">What We Value</h3>
          <ul className="list-disc list-inside space-y-2 text-[var(--text)]">
            <li>Safety and respect for everyone’s story</li>
            <li>Simple, distraction‑free writing</li>
            <li>Careful curation to keep the archive meaningful</li>
          </ul>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/contact" className="block text-center px-4 py-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--background)] transition-colors">
              Contact Us
            </Link>
            <Link href="/donate" className="block text-center px-4 py-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--background)] transition-colors">
              Support the Project
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)] footer-copyright">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
