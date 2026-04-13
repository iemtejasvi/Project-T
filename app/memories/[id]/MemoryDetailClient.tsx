"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import MemoryCard from "@/components/MemoryCard";
import Loader from "@/components/Loader";

import { BelowContentAdUnit } from "@/components/AdUnit";
import Footer from "@/components/Footer";
import type { Memory } from '@/types/memory';

export default function MemoryDetailClient({ id }: { id: string }) {
  const [memory, setMemory] = useState<Memory | null | false>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemory() {
      setLoading(true);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10_000);
        const res = await fetch(`/api/memories/${encodeURIComponent(id)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'default',
          signal: controller.signal,
        });
        clearTimeout(timer);

        const json = await res.json().catch(() => null);
        const data = json?.data as Memory | undefined;

        if (!res.ok || !data) {
          setMemory(false);
        } else {
          setMemory(data);
        }
      } catch {
        setMemory(false);
      } finally {
        setLoading(false);
      }
    }
    fetchMemory();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--text)] opacity-60"
            style={{
              animation: 'dotWave 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes dotWave {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-4px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
  if (memory === false) return <p className="p-6 text-center text-[var(--text)] text-xl font-semibold">Memory not found.</p>;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      {memory && memory.animation === "rough" && (
        <>
          <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
            <defs>
              <filter id="roughpaper-bg">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" numOctaves="5" />
                <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
                  <feDistantLight azimuth="45" elevation="60" />
                </feDiffuseLighting>
              </filter>
            </defs>
          </svg>
          <div
            className="fixed inset-0 w-full h-full"
            style={{
              filter: "url(#roughpaper-bg)",
              background: "var(--bg)",
              zIndex: -1,
            }}
          />
        </>
      )}

      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">Memory Detail</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li>
                <Link
                  href="/"
                  className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/memories"
                  className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link"
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link"
                >
                  Confess
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {memory && <MemoryCard memory={memory} detail />}

        {/* Static context for crawlers — adds substance to every memory page */}
        {memory && (
          <section className="mt-8 max-w-2xl mx-auto text-center text-[var(--text)] opacity-60 text-sm leading-relaxed">
            <p>
              This is an anonymous unsent message shared on If Only I Sent This — a quiet archive of letters
              that were never delivered.{" "}
              <Link href="/memories" className="underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors">
                Browse more unsent letters
              </Link>{" "}
              or{" "}
              <Link href="/submit" className="underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors">
                write your own
              </Link>.
            </p>
          </section>
        )}

        <BelowContentAdUnit slot="9990462319" />
      </main>

      <Footer />
    </div>
  );
}
