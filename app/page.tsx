"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, supabase2, getAllMemories } from "@/lib/supabaseClient";
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
}

export default function Home() {
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function fetchData() {
      try {
        // Fetch announcement
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
          
          // Check if announcement has expired
          if (now >= expiryTime) {
            // Delete expired announcement
            await supabase
              .from("announcements")
              .delete()
              .eq("id", announcementData[0].id);
            if (isMounted) setAnnouncement(null);
          } else {
            if (isMounted) setAnnouncement(announcementData[0].message);
            
            // Schedule next check for this announcement
            const timeUntilExpiry = expiryTime.getTime() - now.getTime();
            timeoutId = setTimeout(() => {
              if (isMounted) fetchData();
            }, timeUntilExpiry);
          }
        } else {
          if (isMounted) setAnnouncement(null);
        }

        // Fetch memories
        const query = { status: "approved" };
        const memoriesData = await getAllMemories(query);
        
        if (!isMounted) return;

        if (memoriesData) {
          // Check for expired pins
          const updatedMemories = memoriesData;
          let needsUpdate = false;
          const now = new Date();

          for (const memory of updatedMemories) {
            if (memory.pinned && memory.pinned_until) {
              const pinExpiry = new Date(memory.pinned_until);
              if (now >= pinExpiry) {
                // Try both databases
                await Promise.all([
                  supabase
                    .from("memories")
                    .update({ pinned: false, pinned_until: null })
                    .eq("id", memory.id),
                  supabase2
                    .from("memories")
                    .update({ pinned: false, pinned_until: null })
                    .eq("id", memory.id)
                ]);
                needsUpdate = true;
              }
            }
          }

          // If any pins were updated, fetch memories again
          if (needsUpdate) {
            const refreshedMemories = await getAllMemories(query);
            if (isMounted) setRecentMemories(refreshedMemories.slice(0, 3));
          } else {
            if (isMounted) setRecentMemories(updatedMemories.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    fetchData();

    if (!localStorage.getItem("hasVisited")) {
      setShowWelcome(true);
      localStorage.setItem("hasVisited", "true");
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentTime]); // Add currentTime as dependency

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
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">If Only I Sent This</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6">
              <li>
                <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                  Submit
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap"
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
