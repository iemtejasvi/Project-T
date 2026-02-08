"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { fetchWithUltraCache, warmUpCache } from "@/lib/enhancedCache";
import { storage } from "@/lib/persistentStorage";
import { browserSession } from "@/lib/browserSession";
import MemoryCard from "@/components/MemoryCard";
import Loader from "@/components/Loader";
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

const faqItems = [
  {
    question: "What is If Only I Sent This?",
    answer:
      "If Only I Sent This is a modern archive for unsent memories, anonymous confessions, and heartfelt messages you were never quite ready to send.",
  },
  {
    question: "Are the memories and messages really anonymous?",
    answer:
      "Yes. We do not show identifying details with public memories, and you should avoid including names, phone numbers, or personal contact information in what you submit.",
  },
  {
    question: "How can I submit my own unsent memory?",
    answer:
      "Use the Confess page to write a short, honest message. Keep paragraphs tight, use clear headings, and focus on one emotion or story per section so your words stay readable.",
  },
  {
    question: "Can I link to external resources or support pages?",
    answer:
      "You can add links to non-competing, helpful resources. For outbound links, we recommend using rel=\"noopener noreferrer nofollow\" so your browser and search visibility stay safe.",
  },
] as const;

export default function Home() {
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(true); // Start with true so we show a stable skeleton until data arrives
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
        // Keep warmup lightweight: only warm the first archive page
        const pagesToWarm = [
          { page: 0, pageSize: 18 },  // Archive first page (desktop)
          { page: 0, pageSize: 10 },  // Archive first page (mobile)
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
          supabase
            .from("announcements")
            .select("id, message, expires_at, link_url, background_color, text_color, icon, title, is_dismissible")
            .eq("is_active", true)
            .maybeSingle(),
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
            timeoutId = setTimeout(() => {
              if (isMounted) fetchData();
            }, timeUntilExpiry);
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

  // No longer needed - we check dismissal status before setting announcement
  // useEffect(() => {
  //   if (announcement?.id && storage.isAnnouncementDismissed(announcement.id)) {
  //     setIsAnnouncementDismissed(true);
  //   } else {
  //     setIsAnnouncementDismissed(false);
  //   }
  // }, [announcement]);

  // Track announcement view
  useEffect(() => {
    if (announcement && !isAnnouncementDismissed) {
      const viewedKey = `viewed_announcement_${announcement.id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        (async () => {
          const result = await Promise.race([
            supabase.rpc('increment_announcement_view', { announcement_id_in: announcement.id }).then((r) => r),
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

        // Update expired pins via server API (keeps DB write logic server-side)
        const unpinCtrl = new AbortController();
        setTimeout(() => unpinCtrl.abort(), 8000);
        fetch('/api/unpin-expired', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: unpinCtrl.signal,
        }).catch(() => {});

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
    // Dismiss welcome for this browser session only
    browserSession.setWelcomeDismissed();
  };

  

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      

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
                        const r = await Promise.race([
                          supabase.rpc('increment_announcement_click', { announcement_id_in: announcement.id }).then((r) => r),
                          new Promise<null>((r) => setTimeout(() => r(null), 5000)),
                        ]);
                        if (r?.error) console.error('Error tracking click:', r.error);
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
              <div className="w-full flex items-center justify-center gap-2 font-bold leading-tight">
                <span>{announcement.icon || '📢'}</span>
                {announcement.link_url ? (
                  <a
                    href={announcement.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80 transition-opacity"
                    onClick={async () => {
                      const r = await Promise.race([
                        supabase.rpc('increment_announcement_click', { announcement_id_in: announcement.id }).then((r) => r),
                        new Promise<null>((r) => setTimeout(() => r(null), 5000)),
                      ]);
                      if (r?.error) console.error('Error tracking click:', r.error);
                    }}
                  >
                    {announcement.message}
                  </a>
                ) : (
                  <span>{announcement.message}</span>
                )}

                {announcement.is_dismissible && (
                  <button
                    onClick={handleDismissAnnouncement}
                    className="ml-2 w-8 h-8 flex items-center justify-center text-2xl leading-none opacity-70 hover:opacity-100 transition-opacity rounded-full hover:bg-black/10"
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

        {/* SEO playbook: hidden guidance for headings, links, and copywriting */}
        <section aria-label="On-page SEO and accessibility playbook" className="sr-only">
          <h2>On-page SEO and accessibility guidelines</h2>
          <p>
            Use one clear H1 for the main page title, then H2 for major sections and H3 for subsections.
            Avoid skipping heading levels so assistive technology can follow the structure.
          </p>
          <p>
            Keep most paragraphs under three sentences and aim for about fifteen words per sentence.
            Prefer active voice and concrete verbs so memories stay readable on small screens.
          </p>
          <p>
            Add descriptive alt text to branded artwork and key imagery, and use meta descriptions that
            stay within search snippet length while inviting clicks.
          </p>
          <p>
            For outbound links, use rel=&quot;noopener noreferrer nofollow&quot; where appropriate, and point to
            non-competing resources that genuinely help the reader.
            For internal links, re-use a consistent anchor phrase for the keyword you want to rank for.
          </p>
        </section>

        {/* Additional SEO copy kept hidden from visual users per requirements */}
        <section aria-label="About If Only I Sent This" className="sr-only">
          <h2>If Only I Sent This — a modern archive for unsent memories</h2>
          <p>
            If Only I Sent This is a curated archive where anonymous confessions, heartbreak letters, and reflective
            journal entries live in a calm, moderated space. We highlight softer typography, regional filters, and
            compassionate review so every unsent text or letter lands safely.
          </p>
          <p>
            Writers searching for heartfelt message journals, private confession boards, or anonymous letter platforms
            can publish here without usernames, ads, or distracting UI. Stories remain searchable by feeling,
            music reference, or relationship type, giving readers new ways to explore closure.
          </p>
          <ul>
            <li>
              <Link href="/memories">Browse the unsent messages archive</Link>
            </li>
            <li>
              <Link href="/submit">Share an anonymous confession</Link>
            </li>
            <li>
              <Link href="/how-it-works">Learn how If Only I Sent This works</Link>
            </li>
          </ul>
          <p>
            Each submission encourages short paragraphs, active voice, descriptive alt text for any branded imagery, and
            outbound resources marked with rel=&quot;noopener noreferrer nofollow&quot; to keep readers focused on your story.
          </p>
        </section>

        <section aria-label="Unsent message keyword cloud" className="sr-only">
          <h2>Unsent message topics we cover</h2>
          <p>
            This archive covers unsent texts, breakup letters, anonymous confessions, and digital time capsules.
            We surface seasonal heartbreak trends such as Christmas breakup stories, New Year closure notes,
            and Valentine confession dumps.
          </p>
          <p>
            Visitors searching for anonymous message walls, unsent letters to ex, memory journals, or calm confession
            spaces will find emotional resonance without ads or chaotic colour palettes. Regional storytellers from
            Mumbai, Manila, Lagos, London, and São Paulo each receive equal placement via our moderation and tagging
            systems.
          </p>
          <ul>
            <li>
              <Link href="/memories">Unsent messages archive by feeling</Link>
            </li>
            <li>
              <Link href="/memories?tag=holiday">Holiday heartbreak unsent notes</Link>
            </li>
            <li>
              <Link href="/memories?tag=music">Music-referenced unsent letters</Link>
            </li>
            <li>
              <Link href="/submit">Write an anonymous confession</Link>
            </li>
          </ul>
          <p>
            Topics include unsent text messages, breakup archives, digital journals for emotions, music-inspired
            confessions, and heartfelt letter writing. All of this copy stays hidden from everyday visitors but gives
            crawlers context about our niche.
          </p>
        </section>

        {/* FAQ content is not rendered in the UI; FAQPage JSON-LD below is used only for SEO. */}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "If Only I Sent This",
            alternateName: "IOIST",
            url: "https://www.ifonlyisentthis.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.ifonlyisentthis.com/memories?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
            inLanguage: "en",
            description:
              "A modern archive for unsent memories, anonymous confessions, and heartfelt messages you were never ready to send.",
          }),
        }}
      />

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)] footer-copyright">
          {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
