"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { primaryDB } from "@/lib/dualMemoryDB";
import { fetchMemoriesWithCache, getMemoryCache } from "@/lib/memoryCache";
import MemoryCard from "@/components/MemoryCard";
import TypingEffect from "@/components/TypingEffect";
import { HomeDesktopMemoryGrid } from "@/components/GridMemoryList";
 

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
}

export default function Home() {
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [announcement, setAnnouncement] = useState<{
    id: string;
    message: string;
    expires_at: string;
    link_url?: string | null;
    background_color?: string | null;
    text_color?: string | null;
    icon?: string | null;
    title?: string | null;
    is_dismissible?: boolean;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);

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

    // Preload Archives page data for instant navigation
    async function preloadArchives() {
      try {
        // Preload first page of archives (both desktop and mobile sizes)
        fetchMemoriesWithCache(0, 18, { status: "approved" }, '', { created_at: "desc" });
        fetchMemoriesWithCache(0, 10, { status: "approved" }, '', { created_at: "desc" });
        
        // Also preload second page for smooth scrolling
        fetchMemoriesWithCache(1, 18, { status: "approved" }, '', { created_at: "desc" });
        fetchMemoriesWithCache(1, 10, { status: "approved" }, '', { created_at: "desc" });
      } catch (err) {
        console.debug("Archives preload error:", err);
      }
    }

    async function fetchData() {
      try {
        // Fetch announcement (always from primary database)
        const { data: announcementData, error: announcementError } = await primaryDB
          .from("announcements")
          .select("id, message, expires_at, link_url, background_color, text_color, icon, title, is_dismissible")
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
            await primaryDB
              .from("announcements")
              .delete()
              .eq("id", announcementData[0].id);
            if (isMounted) setAnnouncement(null);
          } else {
            if (isMounted) setAnnouncement(announcementData[0]);
            
            // Schedule next check for this announcement
            const timeUntilExpiry = expiryTime.getTime() - now.getTime();
            timeoutId = setTimeout(() => {
              if (isMounted) fetchData();
            }, timeUntilExpiry);
          }
        } else {
          if (isMounted) setAnnouncement(null);
        }

        // Fetch only the first 6 memories for home page with caching for instant load
        setMemoriesLoading(true);
        const memoriesResult = await fetchMemoriesWithCache(
          0, // page
          6, // pageSize - only need 6 for home
          { status: "approved" },
          '', // no search on home
          { created_at: "desc" }
        );

        if (!isMounted) return;

        if (memoriesResult.data) {
          setRecentMemories(memoriesResult.data);
          
          // If loaded from cache, fetch fresh data in background
          if (memoriesResult.fromCache) {
            console.debug('🚀 Instant load from cache, refreshing in background');
          }
        } else {
          console.error("Error fetching memories");
          setRecentMemories([]);
        }
        setMemoriesLoading(false);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    fetchData();
    
    // Start preloading archives after a short delay to prioritize home page load
    setTimeout(() => {
      preloadArchives();
    }, 1000);

    if (!sessionStorage.getItem("welcome_closed")) {
      setShowWelcome(true);
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // Remove currentTime dependency

  useEffect(() => {
    if (announcement?.id && localStorage.getItem(`dismissed_announcement_${announcement.id}`)) {
      setIsAnnouncementDismissed(true);
    } else {
      setIsAnnouncementDismissed(false);
    }
  }, [announcement]);

  // Track announcement view
  useEffect(() => {
    if (announcement && !isAnnouncementDismissed) {
      const viewedKey = `viewed_announcement_${announcement.id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        (async () => {
          const { error } = await supabase.rpc('increment_announcement_view', { announcement_id_in: announcement.id });
          if (error) console.error('Error tracking view:', error);
          else sessionStorage.setItem(viewedKey, 'true');
        })();
      }
    }
  }, [announcement, isAnnouncementDismissed]);

  const handleDismissAnnouncement = async () => {
    if (announcement?.id) {
      localStorage.setItem(`dismissed_announcement_${announcement.id}`, "true");
      setIsAnnouncementDismissed(true);
      
      // If memories are not loaded or were cleared, reload them immediately
      if (recentMemories.length === 0 && !memoriesLoading) {
        setMemoriesLoading(true);
        const memoriesResult = await fetchMemoriesWithCache(
          0,
          6,
          { status: "approved" },
          '',
          { created_at: "desc" }
        );
        
        if (memoriesResult.data) {
          setRecentMemories(memoriesResult.data);
        }
        setMemoriesLoading(false);
      }
    }
  };

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

        // Update expired pins in database (import updateMemory)
        const { updateMemory } = await import("@/lib/dualMemoryDB");
        for (const id of expiredPinIds) {
          await updateMemory(id, { pinned: false, pinned_until: undefined });
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
  }, [currentTime, hasActiveItems, recentMemories]);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    setIsClient(true);
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    try {
      sessionStorage.setItem('welcome_closed', 'true');
    } catch {}
  };

  

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      

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
                <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 desktop-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 desktop-nav-link">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 desktop-nav-link">
                  Confess
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

        {announcement && !isAnnouncementDismissed && (
          <section className="my-8 px-4 sm:px-6 max-w-5xl mx-auto">
            <div 
              className="relative p-4 rounded-lg shadow-md md:flex md:items-center md:justify-between md:gap-4 animate-pulse-glow"
              style={{
                backgroundColor: announcement.background_color || '#ef4444',
                color: announcement.text_color || '#ffffff'
              }}
            >
              {/* Spacer for desktop to balance the dismiss button */}
              {announcement.is_dismissible && <div className="hidden md:block w-8 h-8 flex-shrink-0"></div>}

              {/* Announcement Content */}
              <h2 className="text-xl sm:text-2xl font-bold leading-tight text-center flex-grow">
                <span>{announcement.icon || '📢'}</span>
                {
                  announcement.link_url ? (
                    <a 
                      href={announcement.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-80 transition-opacity ml-2"
                      onClick={async () => {
                        const { error } = await supabase.rpc('increment_announcement_click', { announcement_id_in: announcement.id });
                        if (error) console.error('Error tracking click:', error);
                      }}
                    >
                      {announcement.message}
                    </a>
                  ) : (
                    <span className="ml-2">{announcement.message}</span>
                  )
                }
              </h2>

              {/* Dismiss Button */}
              {announcement.is_dismissible && (
                <button 
                  onClick={handleDismissAnnouncement}
                  className="absolute top-1 right-1 w-8 h-8 flex items-center justify-center text-2xl leading-none opacity-70 hover:opacity-100 transition-opacity rounded-full hover:bg-black/10 md:relative md:top-auto md:right-auto"
                  aria-label="Dismiss announcement"
                >
                  &times;
                </button>
              )}
            </div>
          </section>
        )}
        
        {/* Mobile typewriter section - only shows when no announcement */}
        {(!announcement || isAnnouncementDismissed) && (
          <section className="my-8 px-4 sm:px-6 max-w-5xl mx-auto lg:hidden">
            <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow-md text-center">
              <TypingEffect />
            </div>
          </section>
        )}

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-[var(--text)] text-center lg:text-center lg:ml-0">
          Recent Memories
        </h2>
        {memoriesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[var(--text)] opacity-60 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--text)] opacity-60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-[var(--text)] opacity-60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : recentMemories.length > 0 ? (
          !isClient ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[var(--text)] opacity-60 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--text)] opacity-60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-[var(--text)] opacity-60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          ) : isDesktop ? (
            <HomeDesktopMemoryGrid memories={recentMemories} />
          ) : (
            <div>
              {recentMemories.slice(0, 3).map((memory) => <MemoryCard key={memory.id} memory={memory} variant="home" />)}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--text)] opacity-70 text-lg">No memories yet.</p>
          </div>
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

