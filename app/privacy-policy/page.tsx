import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)]">Privacy Policy</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-4">
              <li>
                <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8">
        <p className="text-[var(--text)] text-lg">
          We value your privacy. This policy is a placeholder and will be updated based on our practices.
        </p>
      </main>
      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
