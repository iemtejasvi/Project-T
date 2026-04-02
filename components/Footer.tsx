import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--card-bg)] shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--text)] mb-4">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <Link href="/memories" className="hover:text-[var(--accent)] transition-colors">Archive</Link>
          <Link href="/submit" className="hover:text-[var(--accent)] transition-colors">Confess</Link>
          <Link href="/how-it-works" className="hover:text-[var(--accent)] transition-colors whitespace-nowrap">How It Works</Link>
          <Link href="/about" className="hover:text-[var(--accent)] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link>
          <Link href="/donate" className="hover:text-[var(--accent)] transition-colors">Donate</Link>
        </nav>
        <div className="flex justify-center gap-x-4 text-xs text-[var(--text)] opacity-60 mb-3">
          <Link href="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
          <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms</Link>
        </div>
        <p className="text-center text-sm text-[var(--text)] footer-copyright">
          &copy; {new Date().getFullYear()} If Only I Sent This
        </p>
      </div>
    </footer>
  );
}
