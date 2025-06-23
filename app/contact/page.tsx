import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)]">Contact Us</h1>
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
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Get in Touch</h2>
          <p className="text-[var(--text)] text-lg mb-6">
            We love hearing from you! Whether you have questions, feedback, or simply want to share your story, feel free to reach out.
          </p>
          <div className="mb-6">
            <p className="text-[var(--text)] font-medium">Email:</p>
            <a
              href="mailto:ifonlyisentthis@gmail.com"
              className="text-[var(--accent)] hover:underline text-lg"
            >
              ifonlyisentthis@gmail.com
            </a>
          </div>
          <div>
            <p className="text-[var(--text)] font-medium">Follow Us:</p>
            <div className="mt-2">
              <a 
                href="https://instagram.com/ifonlyisentthis" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[var(--accent)] hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>
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
