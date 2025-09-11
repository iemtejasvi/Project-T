import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 text-center">
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

      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)]">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] mb-6 tracking-tight">Your Privacy, Simply Put</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">What we collect</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>Submitted memory content and chosen styles (for approved display).</li>
                  <li>Basic technical data for performance and analytics.</li>
                  <li>Anonymous identifiers for spam prevention and abuse control.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">How we use it</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>To operate and improve the archive experience.</li>
                  <li>To moderate and publish approved memories.</li>
                  <li>To keep the service secure and reliable.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Cookies & storage</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>We may use local storage/cookies for preferences and basic session features.</li>
                  <li>You can clear them at any time via your browser settings.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--text)]">Sharing & retention</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>No data selling. We share only if required by law or to protect the service.</li>
                  <li>Memories may remain published until removed or requested for removal.</li>
                </ul>
              </div>
            </div>
            <hr className="my-8 border-[var(--border)]" />
            <p className="text-[var(--text)] text-base sm:text-lg">
              Need something removed or have a question? Contact us via <Link href="/contact" className="text-[var(--accent)] hover:underline">Contact</Link>.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-[var(--text)] footer-copyright">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
