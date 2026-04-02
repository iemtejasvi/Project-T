import Link from "next/link";
import Footer from "@/components/Footer";
import TypingEffect from "@/components/TypingEffect";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] home-desktop-heading lg:tracking-tight lg:leading-tight">If Only I Sent This</h1>
          {/* Typewriter effect - desktop only */}
          <div className="hidden lg:block mt-4">
            <div className="text-lg italic text-[var(--text)]/70">
              <TypingEffect className="lg:text-2xl" />
            </div>
          </div>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li>
                <Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/submit" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Confess
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  prefetch={false}
                  className="text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <HomeClient />

      <Footer />
    </div>
  );
}
