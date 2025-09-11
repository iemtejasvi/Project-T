import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Terms & Conditions</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Use of the Service</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>Submit only content you have the right to share. No illegal, hateful, or harmful material.</li>
                  <li>Memories may be reviewed and published at our discretion.</li>
                  <li>We may remove content that violates these terms.</li>
                  <li>The service is provided “as is” without warranties.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Your Content</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>You retain ownership of your content.</li>
                  <li>By submitting, you grant us a non-exclusive right to display it.</li>
                  <li>You can request removal of a memory via the contact page.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Eligibility & Conduct</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>You must be legally allowed to use this service in your region.</li>
                  <li>Do not impersonate others or expose private sensitive info of third parties.</li>
                  <li>No spam, scams, or automated submissions.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Liability</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text)] text-base sm:text-lg">
                  <li>We are not liable for user-submitted content.</li>
                  <li>We are not responsible for third-party links or services.</li>
                  <li>To the fullest extent permitted by law, our liability is limited.</li>
                </ul>
              </div>
            </div>
            <hr className="my-8 border-[var(--border)]" />
            <p className="text-[var(--text)] text-base sm:text-lg">
              Questions? Reach us via <Link href="/contact" className="text-[var(--accent)] hover:underline">Contact</Link>.
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


