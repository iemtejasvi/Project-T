import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)]">Contact</h1>
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
        <p className="text-[var(--text)] text-lg text-center">
          For inquiries, please email: <a href="mailto:ifonlyisentthis@gmail.com" className="text-[var(--accent)] hover:underline">ifonlyisentthis@gmail.com</a>
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
