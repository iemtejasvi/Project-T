import Link from "next/link";
import Footer from "@/components/Footer";
import TypingEffect from "@/components/TypingEffect";
import HomeClient from "@/components/HomeClient";
import { fetchMemoriesPaginated, redactIfDestructed, redactIfUnrevealed, isNightOnlyVisibleNow } from '@/lib/memoryDB';
import { unstable_cache } from 'next/cache';
import type { Memory } from '@/types/memory';

export const revalidate = 60; // ISR: regenerate at most once per 60s

const getRecentMemories = unstable_cache(
  async () => {
    const result = await fetchMemoriesPaginated(0, 6, { status: 'approved' }, '', { created_at: 'desc' });
    if (!result.data) return [];
    // Apply server-side redaction
    return result.data
      .map((m: Memory) => redactIfDestructed(m))
      .map((m: Memory) => redactIfUnrevealed(m))
      .filter((m: Memory) => isNightOnlyVisibleNow(m));
  },
  ['home-recent-memories'],
  { revalidate: 60, tags: ['memories-feed'] }
);

export default async function Home() {
  let initialMemories: Memory[] = [];
  try {
    initialMemories = await getRecentMemories();
  } catch {
    // Fallback to empty — HomeClient will fetch client-side
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-4xl sm:text-4xl font-bold text-[var(--text)] home-desktop-heading lg:text-6xl lg:tracking-widest lg:leading-tight">If Only I Sent This</h1>
          {/* Typewriter effect */}
          <div className="mt-1 flex items-center justify-center lg:mt-4">
            <div className="italic text-[var(--text)]/70">
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

      <HomeClient initialMemories={initialMemories} />

      <Footer />
    </div>
  );
}
