"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { primaryDBRead } from "@/lib/dualMemoryDB";
import { fetchWithUltraCache, warmUpCache } from "@/lib/enhancedCache";
import { storage } from "@/lib/persistentStorage";
import { browserSession } from "@/lib/browserSession";
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
  const [memoriesLoading, setMemoriesLoading] = useState(false); // Start with false for instant perceived load
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
        // Keep warmup lightweight: home + first archive pages only
        const pagesToWarm = [
          { page: 0, pageSize: 6 },   // Home page memories
          { page: 0, pageSize: 18 },  // Archive (desktop) first page
          { page: 0, pageSize: 10 },  // Archive (mobile) first page
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
        // Fetch announcement (always from primary database)
        const { data: announcementData, error: announcementError } = await primaryDBRead
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
            // Delete expired announcement via API
            await fetch('/api/admin/delete-announcement', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: announcementData[0].id })
            });
            if (isMounted) {
              setAnnouncement(null);
              setAnnouncementCheckComplete(true);
            }
          } else {
            // Check dismissal status BEFORE setting announcement
            const isDismissed = storage.isAnnouncementDismissed(announcementData[0].id);
            
            if (isMounted) {
              setAnnouncement(announcementData[0]);
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

        // Fetch recent memories with ultra cache for instant load
        // Don't show loading for cached content
        const memoriesResult = await fetchWithUltraCache(
          0, // page
          6, // pageSize - only need 6 for home
          { status: "approved" },
          '', // no search on home
          { created_at: "desc" },
          { maxAge: 180000, staleWhileRevalidate: 300000 } // 3min fresh, 5min stale for ultra-fresh content
        );

        if (!isMounted) return;

        if (memoriesResult.data) {
          setRecentMemories(memoriesResult.data);
          
          // Only show loading if this was NOT from cache
          if (!memoriesResult.fromCache && memoriesResult.data.length === 0) {
            setMemoriesLoading(true);
            // Hide loader after a brief moment
            setTimeout(() => setMemoriesLoading(false), 500);
          }
        } else {
          setRecentMemories([]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
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
    
    // Start warming up cache after initial load for instant navigation everywhere
    setTimeout(() => {
      warmUpCacheForAllPages();
    }, 500); // Start sooner for better UX

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
          const { error } = await supabase.rpc('increment_announcement_view', { announcement_id_in: announcement.id });
          if (error) console.error('Error tracking view:', error);
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
              className="px-4 py-2 bg-[var(--accent)] text-[var(--text)] rounded hover:bg-blue-200 transition duration-200"
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
                <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
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

        {announcement && !isAnnouncementDismissed && announcementCheckComplete && (
          <section className={`my-8 px-4 sm:px-6 max-w-5xl mx-auto transition-all duration-300 ${announcementTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
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
        
        {/* Mobile typewriter section - keep layout stable and avoid fade-in CLS */}
        <section className="my-8 px-4 sm:px-6 max-w-5xl mx-auto lg:hidden">
          <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow-md text-center min-h-[72px]">
            {(!announcement || isAnnouncementDismissed) && !announcementTransitioning && announcementCheckComplete && (
              <TypingEffect />
            )}
          </div>
        </section>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-[var(--text)] text-center lg:text-center lg:ml-0">
          Recent Memories
        </h2>
        <section className="min-h-[520px]">
        {memoriesLoading ? (
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
        <section aria-label="Alternative to The Unsent Project copy" className="sr-only">
          <h2>If Only I Sent This is an independent alternative to The Unsent Project</h2>
          <p>
            Discover a curated unsent messages archive where anonymous confessions, heartbreak letters, and reflective
            journal entries live in a calm, moderated space separate from The Unsent Project. We highlight softer
            typography, regional filters, and compassionate review so every unsent text or letter lands safely.
          </p>
          <p>
            Writers searching for unsent project alternatives, heartfelt message journals, or private confession boards
            can publish drafts here without usernames, ads, or distracting UI. Stories remain searchable by feeling,
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
              <Link href="/how-it-works">Learn how this unsent project alternative works</Link>
            </li>
          </ul>
          <p>
            Each submission encourages short paragraphs, active voice, descriptive alt text for any branded imagery, and
            outbound resources marked with rel=&quot;noopener noreferrer nofollow&quot; to keep readers focused on your story.
          </p>
        </section>

        <section aria-label="Unsent message keyword cloud" className="sr-only">
          <h2>Unsent message keywords we focus on</h2>
          <p>
            This archive targets phrases like unsent texts, breakup letters, anonymous confessions, digital time capsules,
            and indie alternatives to the main Unsent Project feed. We also surface seasonal heartbreak trends such as
            Christmas breakup stories, New Year closure notes, and Valentine confession dumps.
          </p>
          <p>
            Visitors hunting for phrases like &ldquo;sites like the unsent project,&rdquo; &ldquo;anonymous message wall,&rdquo;
            &ldquo;unsent letters to ex,&rdquo; &ldquo;memory dropbox,&rdquo; or &ldquo;calm confession journal&rdquo; will find the same
            emotional resonance without ads or chaotic color palettes. Regional storytellers from Mumbai, Manila, Lagos,
            London, and São Paulo each receive equal placement via our moderation and tagging systems.
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
              <Link href="/submit">Submit a calm confession instead of texting your ex</Link>
            </li>
          </ul>
          <p>
            Keyword clusters include unsent text messages, unsent letters project, breakup archive, digital journal for
            emotions, Olivia Rodrigo inspired confessions, Taylor Swift lyric letters, and gentler alternatives to viral
            anonymous walls. All of this copy stays hidden from everyday visitors but gives crawlers context about our
            niche.
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
            alternateName: "Independent alternative to The Unsent Project",
            url: "https://www.ifonlyisentthis.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.ifonlyisentthis.com/memories?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
            inLanguage: "en",
            description:
              "Anonymous unsent messages archive offering a calmer alternative to The Unsent Project with moderated, keyword-rich memories.",
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
