"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from 'swr';
import { supabase } from "@/lib/supabaseClient";
import MemoryCard from "@/components/MemoryCard";
import TypingEffect from "@/components/TypingEffect";

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  color: string;
  full_bg: boolean;
  letter_style: string;
  animation?: string;
  pinned?: boolean;
  pinned_until?: string;
}

const recentMemoriesFetcher = async () => {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("status", "approved")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw error;
  if (!data) return [];

  const now = new Date();
  const expiredPinIds = data
    .filter(memory => memory.pinned && memory.pinned_until && new Date(memory.pinned_until) < now)
    .map(memory => memory.id);

  if (expiredPinIds.length > 0) {
    await supabase
      .from("memories")
      .update({ pinned: false, pinned_until: null })
      .in("id", expiredPinIds);
    
    // Re-fetch to get the correct top 3 after unpinning
    const { data: freshData, error: freshError } = await supabase
      .from("memories")
      .select("*")
      .eq("status", "approved")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3);
    
    if (freshError) throw freshError;
    return freshData || [];
  }
  
  return data;
};

export default function Home() {
  const { data: recentMemories = [] } = useSWR('memories-recent', recentMemoriesFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const [showWelcome, setShowWelcome] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function fetchAnnouncement() {
      try {
        const { data: announcementData, error: announcementError } = await supabase
          .from("announcements")
          .select("id, message, expires_at")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!isMounted) return;

        if (announcementError) {
          console.error("Error fetching announcement:", announcementError.message);
        } else if (announcementData?.[0]) {
          const expiryTime = new Date(announcementData[0].expires_at);
          const now = new Date();
          
          if (now >= expiryTime) {
            await supabase
              .from("announcements")
              .delete()
              .eq("id", announcementData[0].id);
            if (isMounted) setAnnouncement(null);
          } else {
            if (isMounted) setAnnouncement(announcementData[0].message);
            
            const timeUntilExpiry = expiryTime.getTime() - now.getTime();
            timeoutId = setTimeout(() => {
              if (isMounted) fetchAnnouncement();
            }, timeUntilExpiry);
          }
        } else {
          if (isMounted) setAnnouncement(null);
        }
      } catch (err) {
        console.error("Unexpected error fetching announcement:", err);
      }
    }

    fetchAnnouncement();

    if (!localStorage.getItem("hasVisited")) {
      setShowWelcome(true);
      localStorage.setItem("hasVisited", "true");
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleWelcomeClose = () => setShowWelcome(false);

  return (
    <div className="min-h-screen flex flex-col">
      {showWelcome && (
        <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow-lg max-w-sm w-full animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--text)] mb-4">Welcome</h2>
            <p className="text-[var(--text)] mb-6">
              A space for unsent memories. Check out{" "}
              <Link href="/how-it-works" className="text-[var(--accent)] hover:underline whitespace-nowrap">
                How It Works
              </Link>
              {" "}or{" "}
              <Link href="/donate" className="text-[var(--accent)] hover:underline whitespace-nowrap">
                Support Us
              </Link>
              .
            </p>
            <button
              onClick={handleWelcomeClose}
              className="px-4 py-2 bg-[var(--accent)] text-[var(--text)] rounded hover:bg-blue-200 transition duration-200"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] home-desktop-heading">If Only I Sent This</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li>
                <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 desktop-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 desktop-nav-link">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 desktop-nav-link">
                  Submit
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap desktop-nav-link"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="my-8 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow-md text-center">
          {announcement ? (
            <h2 className="text-xl sm:text-2xl font-semibold text-red-500">
              📢 Announcement — {announcement}
            </h2>
          ) : (
          <TypingEffect />
          )}
        </div>
      </section>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-[var(--text)]">
          Recent Memories
        </h2>
        {recentMemories.length > 0 ? (
          recentMemories.map((memory) => <MemoryCard key={memory.id} memory={memory} />)
        ) : (
          <p className="text-[var(--text)]">No memories yet.</p>
        )}
        <div className="text-right mt-4">
          <Link href="/memories" className="text-[var(--accent)] hover:underline">
            See All →
          </Link>
        </div>
      </main>

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
