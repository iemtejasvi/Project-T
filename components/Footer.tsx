import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--card-bg)] shadow-md">
      {/* Mobile: ultra-compact, muted footer */}
      <div className="sm:hidden max-w-5xl mx-auto px-4 py-4">
        <nav className="grid grid-cols-3 gap-x-2 gap-y-1.5 text-[10px] text-gray-400 leading-tight text-center mb-2.5">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <Link href="/memories" className="hover:text-[var(--accent)] transition-colors">Archive</Link>
          <Link href="/how-it-works" className="hover:text-[var(--accent)] transition-colors whitespace-nowrap">How It Works</Link>
          <Link href="/journal" className="hover:text-[var(--accent)] transition-colors">Journal</Link>
          <Link href="/about" className="hover:text-[var(--accent)] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link>
        </nav>
        <div className="flex justify-center gap-x-3 text-[10px] text-gray-400/60 mb-1.5">
          <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <span className="select-none">&middot;</span>
          <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          <span className="select-none">&middot;</span>
          <Link href="/cookie-policy" className="hover:text-gray-400 transition-colors">Cookies</Link>
          <span className="select-none">&middot;</span>
          <Link href="/disclaimer" className="hover:text-gray-400 transition-colors">Disclaimer</Link>
        </div>
        <p className="text-center text-[10px] text-gray-400/50 leading-tight footer-copyright">
          &copy; {new Date().getFullYear()} If Only I Sent This
        </p>
      </div>

      {/* Desktop: refined, minimal footer */}
      <div className="hidden sm:block max-w-5xl mx-auto px-6 py-4">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs tracking-wide text-[var(--text)] opacity-50 mb-2.5">
          <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
          <Link href="/memories" className="hover:opacity-100 transition-opacity">Archive</Link>
          <Link href="/how-it-works" className="hover:opacity-100 transition-opacity whitespace-nowrap">How It Works</Link>
          <Link href="/journal" className="hover:opacity-100 transition-opacity">Journal</Link>
          <Link href="/about" className="hover:opacity-100 transition-opacity">About</Link>
          <Link href="/contact" className="hover:opacity-100 transition-opacity">Contact</Link>
        </nav>
        <div className="flex justify-center gap-x-3 text-[10px] text-[var(--text)] opacity-35 mb-1.5">
          <Link href="/privacy-policy" className="hover:opacity-70 transition-opacity">Privacy Policy</Link>
          <span className="select-none">&middot;</span>
          <Link href="/terms" className="hover:opacity-70 transition-opacity">Terms</Link>
          <span className="select-none">&middot;</span>
          <Link href="/cookie-policy" className="hover:opacity-70 transition-opacity">Cookie Policy</Link>
          <span className="select-none">&middot;</span>
          <Link href="/disclaimer" className="hover:opacity-70 transition-opacity">Disclaimer</Link>
        </div>
        <p className="text-center text-[10px] text-[var(--text)] opacity-30 leading-tight footer-copyright">
          &copy; {new Date().getFullYear()} If Only I Sent This
        </p>
      </div>
    </footer>
  );
}
