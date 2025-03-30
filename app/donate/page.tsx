import Link from "next/link";

export default function Donate() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)]">Donate</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex justify-center gap-4">
              <li>
                <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 py-8">
        <section className="bg-[var(--card-bg)] p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Support Our Mission</h2>
          <p className="text-[var(--text)] text-lg mb-6">
            Your donations help us maintain the platform and continue providing a safe space for unsent memories. Every contribution, big or small, makes a difference.
          </p>
          <p className="text-[var(--text)] text-lg mb-6">
            We are currently working on integrating a secure payment system. Please check back soon for updates.
          </p>
          <p className="text-[var(--text)] text-lg">
            Thank you for your support!
          </p>
        </section>
      </main>

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
