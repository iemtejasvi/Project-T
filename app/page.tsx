"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import MemoryCard from "@/components/MemoryCard";
import TypingEffect from "@/components/TypingEffect";
import { HomeDesktopMemoryGrid } from "@/components/GridMemoryList";
import { FaFeatherAlt } from "react-icons/fa";

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

export default function Home() {
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if there are any active pinned memories or announcements that need monitoring
  const hasActiveItems = useMemo(() => {
    const now = new Date();
    
    // Check for active pinned memories
    const hasActivePinnedMemories = recentMemories.some(memory => 
      memory.pinned && 
      memory.pinned_until && 
      new Date(memory.pinned_until) > now
    );
    
    // Check for active announcement
    const hasActiveAnnouncement = announcement !== null;
    
    return hasActivePinnedMemories || hasActiveAnnouncement;
  }, [recentMemories, announcement]);

  // Update current time every second ONLY if there are active items
  useEffect(() => {
    if (!hasActiveItems) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [hasActiveItems]);

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
        const { data: memoriesData, error: memoriesError } = await supabase
          .from("memories")
          .select("*")
          .eq("status", "approved")
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(4);

        if (!isMounted) return;

        if (memoriesError) {
          console.error("Error fetching memories:", memoriesError.message);
        } else {
          if (isMounted) setRecentMemories(memoriesData || []);
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
  }, []); // Remove currentTime dependency

  // Check expired pins only when there are active items
  useEffect(() => {
    if (!hasActiveItems) return;

    const now = new Date();
    const expiredPins = recentMemories.filter(memory => 
      memory.pinned && 
      memory.pinned_until && 
      new Date(memory.pinned_until) <= now
    );

    if (expiredPins.length === 0) return;

    let isMounted = true;

    async function updateExpiredPins() {
      try {
        const expiredPinIds = expiredPins.map(memory => memory.id);

        // Update expired pins in database
        for (const id of expiredPinIds) {
          await supabase
            .from("memories")
            .update({ pinned: false, pinned_until: null })
            .eq("id", id);
        }

        // Update local state without refetching
        if (isMounted) {
          setRecentMemories(prevMemories => 
            prevMemories.map(memory => 
              expiredPinIds.includes(memory.id) 
                ? { ...memory, pinned: false, pinned_until: undefined }
                : memory
            )
          );
        }
      } catch (err) {
        console.error("Error updating expired pins:", err);
      }
    }

    updateExpiredPins();

    return () => {
      isMounted = false;
    };
  }, [currentTime, hasActiveItems]);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleWelcomeClose = () => setShowWelcome(false);

  const featherColor = useMemo(() => {
    let theme = typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme');
    if (!theme) theme = 'light';
    if (theme === 'dark') return '#F8BBD0'; // soft pink for dark
    if (theme === 'sepia') return '#FFD700'; // gold for sepia/custom
    return '#B39DDB'; // purple for light
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Floating feather accents (desktop only) */}
      <div className="hidden lg:block absolute left-[-100px] top-1/4 z-0 opacity-30 pointer-events-none select-none">
        <FaFeatherAlt size={180} style={{ color: featherColor }} className="drop-shadow-2xl blur-[2px]" />
      </div>
      <div className="hidden lg:block absolute right-[-80px] bottom-1/4 z-0 opacity-20 pointer-events-none select-none rotate-[25deg]">
        <FaFeatherAlt size={120} style={{ color: featherColor }} className="drop-shadow-2xl blur-[1.5px]" />
      </div>

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
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-[var(--text)] sm:text-left sm:ml-8 text-center ml-0">
          Recent Memories
        </h2>
        {recentMemories.length > 0 ? (
          isDesktop ? (
            <HomeDesktopMemoryGrid memories={recentMemories} />
          ) : (
            recentMemories.slice(0, 3).map((memory) => <MemoryCard key={memory.id} memory={memory} />)
          )
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)] footer-copyright">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
