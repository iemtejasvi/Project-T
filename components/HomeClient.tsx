"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";

import { fetchWithUltraCache, warmUpCache } from "@/lib/enhancedCache";
import { storage } from "@/lib/persistentStorage";
import { browserSession } from "@/lib/browserSession";
import MemoryCard from "@/components/MemoryCard";
import Loader from "@/components/Loader";
import { HomeDesktopMemoryGrid } from "@/components/GridMemoryList";
import TypingEffect from "@/components/TypingEffect";
import type { Memory } from '@/types/memory';

export default function HomeClient() {
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [announcementTransitioning, setAnnouncementTransitioning] = useState(false);
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
  const [announcementCheckComplete, setAnnouncementCheckComplete] = useState(false);

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

    // Check if new browser session to handle cookie clears
    if (browserSession.isNewBrowserSession()) {
      // Browser was restarted - cookies may have been cleared
      storage.migrate(); // Re-migrate any persistent data

      // Show welcome on new browser session
      if (isMounted && !browserSession.isWelcomeDismissed()) {
        setShowWelcome(true);
      }
    }

    // Warm up cache for instant navigation without over-fetching
    async function warmUpCacheForAllPages() {
      try {
        // Only warm the page size matching the current device
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        const pagesToWarm = [
          { page: 0, pageSize: isDesktop ? 18 : 10 },
        ];

        await warmUpCache(pagesToWarm);
        // Silent cache warmup
        window.dispatchEvent(new CustomEvent('cache-warmed'));
      } catch {
        // Silent error
      }
    }

    async function fetchData() {
      try {
        if (isMounted) {
          setMemoriesLoading(true);
        }

        // Fetch announcement and recent memories in parallel so the main LCP content isn't delayed by announcement checks
        // Wrap announcement fetch in a timeout so a slow Supabase call can never block the page
        const announcementPromise = Promise.race([
          fetch('/api/announcements').then(async (res) => {
            if (!res.ok) return { data: null, error: { message: `HTTP ${res.status}` } };
            const json = await res.json();
            return { data: json.data ?? null, error: null };
          }).catch(() => ({ data: null, error: { message: 'Announcement fetch failed' } })),
          new Promise<{ data: null; error: { message: string } }>((resolve) =>
            setTimeout(() => resolve({ data: null, error: { message: 'Announcement fetch timeout' } }), 8000)
          ),
        ]);

        const [announcementResult, memoriesResult] = await Promise.all([
          announcementPromise,
          fetchWithUltraCache(
            0,
            6,
            { status: "approved" },
            "",
            { created_at: "desc" },
            { maxAge: 60000, staleWhileRevalidate: 120000 } // 60s fresh (matches ISR), 2min stale
          ),
        ]);

        if (!isMounted) return;

        const { data: announcementData, error: announcementError } = announcementResult;

        if (announcementError) {
          console.error("Error fetching announcement:", announcementError.message);
        } else if (announcementData) {
          const expiryTime = new Date(announcementData.expires_at);
          const now = new Date();

          // Check if announcement has expired
          if (now >= expiryTime) {
            if (isMounted) {
              setAnnouncement(null);
              setAnnouncementCheckComplete(true);
            }
          } else {
            // Check dismissal status BEFORE setting announcement
            const isDismissed = storage.isAnnouncementDismissed(announcementData.id);

            if (isMounted) {
              setAnnouncement(announcementData);
              setIsAnnouncementDismissed(isDismissed);
              setAnnouncementCheckComplete(true);
            }

            // Schedule next check for this announcement
            const timeUntilExpiry = expiryTime.getTime() - now.getTime();
            // Clamp to 2^31-1 ms (~24.8 days) to avoid 32-bit setTimeout overflow
            const safeDelay = Math.min(timeUntilExpiry, 2147483647);
            timeoutId = setTimeout(() => {
              if (isMounted) fetchData();
            }, safeDelay);
          }
        } else {
          if (isMounted) {
            setAnnouncement(null);
            setAnnouncementCheckComplete(true);
          }
        }

        if (memoriesResult.data) {
          setRecentMemories(memoriesResult.data);
        } else {
          setRecentMemories([]);
        }

      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        if (isMounted) {
          setMemoriesLoading(false);
        }
      }
    }

    fetchData();

    // Listen for real-time updates
    const handleRefreshMemories = async () => {
      if (isMounted) {
        // Silent background refresh
        await fetchData();
      }
    };

    window.addEventListener('refresh-home-memories', handleRefreshMemories);
    window.addEventListener('content-updated', handleRefreshMemories);

    // Listen for new browser sessions (shouldn't happen on this page load, but for completeness)
    const handleNewBrowserSession = () => {
      if (isMounted && !browserSession.isWelcomeDismissed()) {
        setShowWelcome(true);
      }
    };

    window.addEventListener('browser-session-started', handleNewBrowserSession);

    // Start warming up cache slightly after initial load to keep Supabase traffic lighter
    setTimeout(() => {
      warmUpCacheForAllPages();
    }, 3000);

    // Show welcome if not dismissed in this browser session
    if (!browserSession.isWelcomeDismissed()) {
      setShowWelcome(true);
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('refresh-home-memories', handleRefreshMemories);
      window.removeEventListener('content-updated', handleRefreshMemories);
      window.removeEventListener('browser-session-started', handleNewBrowserSession);
    };
  }, []); // Remove currentTime dependency

  // Track announcement view
  useEffect(() => {
    if (announcement && !isAnnouncementDismissed) {
      const viewedKey = `viewed_announcement_${announcement.id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        (async () => {
          const result = await Promise.race([
            fetch('/api/announcements/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ announcement_id: announcement.id, type: 'view' }),
            }).then((r) => (r.ok ? { error: null } : { error: { message: `HTTP ${r.status}` } })),
            new Promise<null>((r) => setTimeout(() => r(null), 5000)),
          ]);
          if (!result) return; // timeout
          if (result.error) console.error('Error tracking view:', result.error);
          else sessionStorage.setItem(viewedKey, 'true');
        })();
      }
    }
  }, [announcement, isAnnouncementDismissed]);

  const handleDismissAnnouncement = async () => {
    if (announcement?.id) {
      // Start transition to prevent visual artifacts
      setAnnouncementTransitioning(true);

      storage.setAnnouncementDismissed(announcement.id);

      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsAnnouncementDismissed(true);
        setAnnouncementTransitioning(false);
      }, 150);

      // Ensure memories are loaded if needed
      if (recentMemories.length === 0 && !memoriesLoading) {
        setMemoriesLoading(true);
        const memoriesResult = await fetchWithUltraCache(
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

  const trackAnnouncementClick = useCallback(async () => {
    if (!announcement) return;
    const r = await Promise.race([
      fetch('/api/announcements/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcement_id: announcement.id, type: 'click' }),
      }).then((res) => (res.ok ? { error: null } : { error: { message: `HTTP ${res.status}` } })),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);
    if (r?.error) console.error('Error tracking click:', r.error);
  }, [announcement]);

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

        // Update local state without refetching (DB cleanup handled by admin/cron)
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
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    setIsClient(true);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    // Dismiss welcome for this browser session only
    browserSession.setWelcomeDismissed();
  };

  return (
    <>
      {showWelcome && (
        <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow-lg max-w-sm w-full animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--text)] mb-4">Welcome</h2>
            <p className="text-[var(--text)] mb-6">
              A space for unsent memories. Check out{" "}
              <Link
                href="/how-it-works"
                className="text-[var(--text)] underline decoration-[var(--accent)] underline-offset-2 whitespace-nowrap"
              >
                How It Works
              </Link>
              {" "}or{" "}
              <Link
                href="/donate"
                className="text-[var(--text)] underline decoration-[var(--accent)] underline-offset-2 whitespace-nowrap"
              >
                Support Us
              </Link>
              .
            </p>
            <button
              onClick={handleWelcomeClose}
              className="px-4 py-2 bg-[var(--text)] text-[var(--background)] rounded shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)]"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {announcement && !isAnnouncementDismissed && announcementCheckComplete && (
        <section className={`hidden lg:block my-8 px-4 sm:px-6 max-w-5xl mx-auto transition-all duration-300 ${announcementTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
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
            <div className="text-center flex-grow">
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                <span>{announcement.icon || '📢'}</span>
                <span className="ml-2">{announcement.message}</span>
              </h2>
              {announcement.link_url && (
                <a
                  href={announcement.link_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-block mt-1.5 text-sm underline opacity-80 hover:opacity-100 transition-opacity"
                  onClick={trackAnnouncementClick}
                >
                  Read more &rarr;
                </a>
              )}
            </div>

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

      {/* Mobile typewriter section - reserve space for two lines and avoid layout shake */}
      <section className="mt-8 mb-4 px-4 sm:px-6 max-w-5xl mx-auto lg:hidden">
        <div
          className="bg-[var(--card-bg)] p-4 rounded-lg shadow-md text-center h-[88px] flex items-center justify-center"
          style={
            announcement && !isAnnouncementDismissed && announcementCheckComplete
              ? {
                  backgroundColor: announcement.background_color || '#ef4444',
                  color: announcement.text_color || '#ffffff',
                }
              : undefined
          }
        >
          {announcement && !isAnnouncementDismissed && announcementCheckComplete ? (
            <div className="relative w-full flex flex-col items-center justify-center gap-1 font-bold leading-tight">
              <div className="flex items-center gap-1.5">
                <span>{announcement.icon || '📢'}</span>
                <span>{announcement.message}</span>
              </div>
              {announcement.link_url && (
                <a
                  href={announcement.link_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-xs underline opacity-80 hover:opacity-100 transition-opacity font-medium"
                  onClick={trackAnnouncementClick}
                >
                  Read more &rarr;
                </a>
              )}
              {announcement.is_dismissible && (
                <button
                  onClick={handleDismissAnnouncement}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-xl leading-none opacity-70 hover:opacity-100 transition-opacity rounded-full hover:bg-black/10"
                  aria-label="Dismiss announcement"
                >
                  &times;
                </button>
              )}
            </div>
          ) : (
            (!announcement || isAnnouncementDismissed) && !announcementTransitioning && announcementCheckComplete && (
              <TypingEffect />
            )
          )}
        </div>
      </section>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-[var(--text)] text-center lg:text-center lg:ml-0">
          Recent Memories
        </h2>
        <section className="min-h-[520px]">
        {memoriesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader text="" />
          </div>
        ) : recentMemories.length > 0 ? (
          !isClient ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[var(--text)] opacity-60 animate-pulse"></div>
                <div
                  className="w-2 h-2 rounded-full bg-[var(--text)] opacity-60 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-[var(--text)] opacity-60 animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          ) : isDesktop ? (
            <HomeDesktopMemoryGrid memories={recentMemories} />
          ) : (
            <div>
              {recentMemories.slice(0, 3).map((memory) => (
                <MemoryCard key={memory.id} memory={memory} variant="home" />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--text)] opacity-70 text-lg">No memories yet.</p>
          </div>
        )}
        </section>

        <div className="text-right mt-4">
          <Link
            href="/memories"
            prefetch={false}
            className="text-[var(--text)] underline decoration-[var(--accent)] underline-offset-2 hover:opacity-80"
          >
            See All →
          </Link>
        </div>

        {/* FAQ content is not rendered in the UI; FAQ JSON-LD lives on /how-it-works to avoid duplicate structured data. */}
      </main>
    </>
  );
}
