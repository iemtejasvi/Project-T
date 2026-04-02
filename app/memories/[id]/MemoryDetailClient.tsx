"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import MemoryCard from "@/components/MemoryCard";
import Loader from "@/components/Loader";

import Footer from "@/components/Footer";

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  color: string;
  full_bg: boolean;
  animation?: string;
  pinned?: boolean;
  pinned_until?: string;
  ip?: string;
  country?: string;
  uuid?: string;
  tag?: string;
  sub_tag?: string;
  reveal_at?: string;
  destruct_at?: string;
  is_time_capsule_locked?: string;
  typewriter_enabled?: boolean;
}

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
          cache: 'no-store',
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
    <div className="min-h-screen flex items-center justify-center">
      <Loader text="Loading memory..." />
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
                  Back to Archive
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {memory && <MemoryCard memory={memory} detail />}
      </main>

      <Footer />
    </div>
  );
}
