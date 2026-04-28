"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import { fetchWithUltraCache } from "@/lib/enhancedCache";
import { storage } from "@/lib/persistentStorage";
import { browserSession } from "@/lib/browserSession";
import MemoryCard from "@/components/MemoryCard";
import Loader from "@/components/Loader";
import { HomeDesktopMemoryGrid } from "@/components/GridMemoryList";
import { SidebarAdUnit } from "@/components/AdUnit";
import TypingEffect from "@/components/TypingEffect";
import type { Memory } from '@/types/memory';

interface HomeClientProps {
  initialMemories?: Memory[];
}

export default function HomeClient({ initialMemories }: HomeClientProps) {
  const [recentMemories, setRecentMemories] = useState<Memory[]>(initialMemories || []);
  const [memoriesLoading, setMemoriesLoading] = useState(!initialMemories || initialMemories.length === 0);
  const isInitialMount = useRef(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [typewriterSlot, setTypewriterSlot] = useState<HTMLElement | null>(null);
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
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop' | null>(null);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);
  const [announcementCheckComplete, setAnnouncementCheckComplete] = useState(false);

  // Find the typewriter slot in the header
  useEffect(() => {
    setTypewriterSlot(document.getElementById('typewriter-slot'));
  }, []);

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
      if (isMounted && !browserSession.isWelcomeDismissed() && !storage.isWelcomeClosed()) {
        setShowWelcome(true);
      }
    }

    // Warm up cache for instant navigation without over-fetching
    // (removed — ISR edge cache serves archive pages fast, no pre-warm needed)

    async function fetchData() {
      try {
        // Skip redundant memories fetch on initial mount when SSR provided data
        const hasSSRMemories = isInitialMount.current && initialMemories && initialMemories.length > 0;
        isInitialMount.current = false;

        if (isMounted && !hasSSRMemories) {
          setMemoriesLoading(true);
        }

        // Fetch announcement (no SSR equivalent) — always needed
        // Wrap in a timeout so a slow Supabase call can never block the page
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

        // Use SSR data on initial mount to avoid redundant Vercel function invocation
        const memoriesPromise = hasSSRMemories
          ? Promise.resolve({ data: initialMemories, totalCount: initialMemories.length, totalPages: 1, currentPage: 0, fromCache: true })
          : fetchWithUltraCache(
              0,
              6,
              { status: "approved" },
              "",
              { created_at: "desc" },
              { maxAge: 18000000, staleWhileRevalidate: 36000000 } // 5hr fresh, 10hr stale
            );

        const [announcementResult, memoriesResult] = await Promise.all([
          announcementPromise,
          memoriesPromise,
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
      if (isMounted && !browserSession.isWelcomeDismissed() && !storage.isWelcomeClosed()) {
        setShowWelcome(true);
      }
    };

    window.addEventListener('browser-session-started', handleNewBrowserSession);

    // Show welcome if not dismissed
    if (!browserSession.isWelcomeDismissed() && !storage.isWelcomeClosed()) {
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
          { created_at: "desc" },
          { maxAge: 18000000, staleWhileRevalidate: 36000000 }
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
    const check = () => {
      const w = window.innerWidth;
      if (w >= 1280) setDeviceType('desktop');
      else if (w >= 768) setDeviceType('tablet');
      else setDeviceType('mobile');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    browserSession.setWelcomeDismissed();
    storage.setWelcomeClosed();
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

      {/* Typewriter / Announcement — portalled into header slot */}
      {typewriterSlot && createPortal(
        announcement && !isAnnouncementDismissed && announcementCheckComplete ? (
          <div
            className={`h-full px-4 lg:px-6 rounded-full flex items-center justify-center mx-auto max-w-md lg:max-w-2xl transition-all duration-300 ${announcementTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            style={{
              backgroundColor: announcement.background_color || '#ef4444',
              color: announcement.text_color || '#ffffff',
              opacity: 0.9,
            }}
          >
            <div className="relative w-full flex items-center justify-center gap-1.5 text-xs lg:text-sm font-medium leading-none">
              <span className="shrink-0">{announcement.icon || '📢'}</span>
              <span className="truncate">{announcement.message}</span>
              {announcement.link_url && (
                <a
                  href={announcement.link_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="underline opacity-80 hover:opacity-100 transition-opacity shrink-0"
                  onClick={trackAnnouncementClick}
                >
                  more
                </a>
              )}
              {announcement.is_dismissible && (
                <button
                  onClick={handleDismissAnnouncement}
                  className="shrink-0 w-5 h-5 flex items-center justify-center text-sm leading-none opacity-70 hover:opacity-100 transition-opacity rounded-full hover:bg-black/10"
                  aria-label="Dismiss announcement"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="italic text-[var(--text)]/70">
            <TypingEffect className="lg:text-2xl" />
          </div>
        ),
        typewriterSlot
      )}

      <main className="flex-grow max-w-5xl mx-auto px-2 sm:px-6 py-8 relative">
        <SidebarAdUnit slot="4305235800" />
        <h2 className="text-3xl sm:text-3xl lg:text-4xl font-semibold mb-6 text-[var(--text)] text-center lg:text-center lg:ml-0">
          Recent Memories
        </h2>
        <section className="min-h-[520px]">
        {memoriesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader text="" />
          </div>
        ) : recentMemories.length > 0 ? (
          deviceType === null ? (
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
          ) : deviceType === 'desktop' || deviceType === 'tablet' ? (
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
