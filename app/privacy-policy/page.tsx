import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Privacy Policy</h1>
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
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Our Commitment to Your Privacy</h2>
          <p className="text-[var(--text)] text-lg mb-4">
            Your privacy is important to us. We collect only the information necessary to provide and improve our services. This includes data such as your current date, time, and day when you submit a memory.
          </p>
          <p className="text-[var(--text)] text-lg mb-4">
            We do not share your personal information with third parties without your consent, except as required by law or to protect our rights. All data is stored securely in our database.
          </p>
          <p className="text-[var(--text)] text-lg">
            For any questions or concerns about your data, please contact us via our <Link href="/contact" className="text-[var(--accent)] hover:underline">Contact</Link> page.
          </p>
        </section>
      </main>

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-[var(--text)] footer-copyright">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
