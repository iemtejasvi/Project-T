import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 sm:mt-12 bg-[var(--card-bg)] shadow-md">
      {/* Mobile: ultra-compact, muted footer */}
      <div className="sm:hidden max-w-5xl mx-auto px-4 py-4">
        <nav className="grid grid-cols-4 gap-x-2 gap-y-1.5 text-[10px] text-gray-400 leading-tight text-center mb-2.5">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <Link href="/memories" className="hover:text-[var(--accent)] transition-colors">Archive</Link>
          <Link href="/submit" className="hover:text-[var(--accent)] transition-colors">Confess</Link>
          <Link href="/how-it-works" className="hover:text-[var(--accent)] transition-colors whitespace-nowrap">How It Works</Link>
          <Link href="/about" className="hover:text-[var(--accent)] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link>
          <Link href="/donate" className="hover:text-[var(--accent)] transition-colors">Donate</Link>
        </nav>
        <div className="flex justify-center gap-x-3 text-[10px] text-gray-400/60 mb-1.5">
          <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <span className="select-none">&middot;</span>
          <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
        </div>
        <p className="text-center text-[10px] text-gray-400/50 leading-tight footer-copyright">
          &copy; {new Date().getFullYear()} If Only I Sent This
        </p>
      </div>

      {/* Desktop: original styling */}
      <div className="hidden sm:block max-w-5xl mx-auto px-6 py-6">
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
