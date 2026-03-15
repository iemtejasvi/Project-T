"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import MemoryCard from "@/components/MemoryCard";
import GridMemoryList from "@/components/GridMemoryList";
import Loader from "@/components/Loader";
import { useParams } from "next/navigation";

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  reveal_at?: string;
  destruct_at?: string;
  time_capsule_delay_minutes?: number;
  status: string;
  color: string;
  full_bg: boolean;
  animation?: string;
  pinned?: boolean;
  pinned_until?: string;
  tag?: string;
  sub_tag?: string;
  typewriter_enabled?: boolean;
}

export default function NameArchivePage() {
  const params = useParams();
  const rawSlug = (params?.name as string) || "";
  const slug = decodeURIComponent(rawSlug).toLowerCase().trim();

  const [memories, setMemories] = useState<Memory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nameExists, setNameExists] = useState(true);
  const [displayNameStr, setDisplayNameStr] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [relatedNames, setRelatedNames] = useState<string[]>([]);

  const pageSize = isDesktop ? 18 : 10;

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchData = useCallback(
    async (p: number) => {
      if (!slug) return;
      setLoading(true);
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 12000);
        const res = await fetch(
          `/api/names?name=${encodeURIComponent(slug)}&page=${p}&pageSize=${pageSize}`,
          { signal: ctrl.signal }
        );
        clearTimeout(timer);
        const json = await res.json();
        setMemories(json.data || []);
        setTotalCount(json.totalCount || 0);
        setTotalPages(json.totalPages || 0);
        setNameExists(json.exists !== false);
        setDisplayNameStr(json.displayName || slug);
        if (json.relatedNames) setRelatedNames(json.relatedNames);
      } catch (err) {
        console.error("Error fetching name archive:", err);
      } finally {
        setLoading(false);
      }
    },
    [slug, pageSize]
  );

  useEffect(() => {
    setPage(0);
    fetchData(0);
  }, [fetchData]);

  const handleNext = useCallback(() => {
    const next = page + 1;
    setPage(next);
    fetchData(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, fetchData]);

  const handlePrev = useCallback(() => {
    const prev = Math.max(0, page - 1);
    setPage(prev);
    fetchData(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, fetchData]);

  const hasNext = page < totalPages - 1;

  const currentDisplayCount = useMemo(() => {
    return Math.min(totalCount, page * pageSize + memories.length);
  }, [page, pageSize, memories.length, totalCount]);

  // noindex for pages with fewer than 3 messages (thin content)
  useEffect(() => {
    if (!loading && totalCount < 3 && nameExists) {
      let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'robots';
        document.head.appendChild(meta);
      }
      meta.content = 'noindex, follow';
      return () => {
        if (meta && meta.parentNode) meta.parentNode.removeChild(meta);
      };
    }
  }, [loading, totalCount, nameExists]);

  // SEO structured data with ItemList
  const structuredData = useMemo(() => {
    if (!displayNameStr || !nameExists) return null;
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Messages to ${displayNameStr} - If Only I Sent This`,
      description: `Read ${totalCount} unsent messages and letters to ${displayNameStr}. Anonymous confessions, love letters, and words never spoken.`,
      url: `https://www.ifonlyisentthis.com/name/${encodeURIComponent(slug)}`,
      isPartOf: {
        "@type": "WebSite",
        name: "If Only I Sent This",
        url: "https://www.ifonlyisentthis.com",
      },
      numberOfItems: totalCount,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: totalCount,
        itemListElement: memories.slice(0, 10).map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://www.ifonlyisentthis.com/memories/${m.id}`,
        })),
      },
    };
  }, [displayNameStr, nameExists, totalCount, slug, memories]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] memories-desktop-heading lg:tracking-tight lg:leading-tight">
            {loading
              ? "Loading..."
              : nameExists
              ? `Messages to ${displayNameStr}`
              : `No Messages for "${displayNameStr}"`}
          </h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li>
                <Link
                  href="/"
                  prefetch={false}
                  className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/memories"
                  prefetch={false}
                  className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link"
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  prefetch={false}
                  className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link"
                >
                  Confess
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  prefetch={false}
                  className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader text="Loading messages..." />
          </div>
        ) : !nameExists ? (
          <div className="text-center py-16">
            <p className="text-[var(--text)] text-lg mb-6">
              No messages found for &ldquo;{displayNameStr}&rdquo;.
            </p>
            <Link
              href={`/submit?to=${encodeURIComponent(displayNameStr)}`}
              className="inline-block px-6 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              Write a message to {displayNameStr}
            </Link>
          </div>
        ) : (
          <>
            {/* Count header */}
            <div className="mb-4 opacity-75 text-center">
              <span className="block text-base sm:text-lg font-medium text-[var(--text)]">
                {totalCount} {totalCount === 1 ? "message" : "messages"} to{" "}
                {displayNameStr}
              </span>
            </div>

            {/* Previous page */}
            {page > 0 && (
              <div className="text-center mb-6">
                <button
                  onClick={handlePrev}
                  className="pagination-btn inline-flex items-center gap-2 text-sm sm:text-base px-5 py-2 bg-[#f8f6f1] text-[#6b5b47] border border-[#d4c4a8] rounded-full hover:bg-[#f0ede4] hover:border-[#c4b498] transition-all duration-300 shadow-sm hover:shadow-md font-medium tracking-wide"
                >
                  <span className="text-lg">←</span> Previous
                </button>
              </div>
            )}

            {/* Counter */}
            <div className="mb-4 opacity-75 text-center">
              <span className="block text-sm text-[var(--text)]">
                Showing {currentDisplayCount} of {totalCount}
              </span>
            </div>

            {/* Cards */}
            {isDesktop ? (
              <GridMemoryList memories={memories} />
            ) : (
              memories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))
            )}

            {/* Next page */}
            {hasNext && (
              <div className="text-center mt-6">
                <button
                  onClick={handleNext}
                  className="pagination-btn inline-flex items-center gap-2 text-sm sm:text-base px-5 py-2 bg-[#f8f6f1] text-[#6b5b47] border border-[#d4c4a8] rounded-full hover:bg-[#f0ede4] hover:border-[#c4b498] transition-all duration-300 shadow-sm hover:shadow-md font-medium tracking-wide"
                >
                  Load More <span className="text-lg">→</span>
                </button>
              </div>
            )}

            {/* CTA to write a message to this name */}
            <div className="text-center mt-10 mb-4">
              <Link
                href={`/submit?to=${encodeURIComponent(displayNameStr)}`}
                className="inline-block px-6 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg hover:scale-105 transition-transform"
              >
                Write a message to {displayNameStr}
              </Link>
            </div>

            {/* Related names section */}
            {relatedNames.length > 0 && (
              <div className="mt-10 mb-6">
                <h2 className="text-lg font-semibold text-[var(--text)] text-center mb-4 opacity-80">Related Names</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {relatedNames.map((rn) => (
                    <Link
                      key={rn}
                      href={`/name/${encodeURIComponent(rn.toLowerCase().trim())}`}
                      className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-full text-sm text-[var(--text)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)] transition-all duration-200"
                    >
                      {rn}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Curiosity hook */}
            <div className="mt-8 mb-4 text-center">
              <p className="text-sm text-[var(--text)] opacity-60 mb-2">Curious if someone wrote about you?</p>
              <Link
                href="/memories"
                className="text-sm font-medium text-[var(--accent)] hover:underline"
              >
                Search your name →
              </Link>
            </div>
          </>
        )}

        {/* Hidden SEO content */}
        <div className="sr-only" aria-hidden="false">
          <h2>Unsent messages to {displayNameStr}</h2>
          <p>
            This page contains {totalCount} unsent {totalCount === 1 ? "message" : "messages"} and letters written to {displayNameStr}.
            These are anonymous confessions, love letters, apologies, and words that were never sent.
            Read what people wished they could say to {displayNameStr}.
          </p>
          <p>
            If Only I Sent This is a platform for sharing unsent messages, anonymous letters, and confessions.
            Every name has a story. Every message carries weight. Browse messages to {displayNameStr} and discover
            the words people never had the courage to send.
          </p>
          <ul>
            <li>Unsent letters to {displayNameStr}</li>
            <li>Anonymous messages to {displayNameStr}</li>
            <li>Love letters to {displayNameStr}</li>
            <li>Things I never told {displayNameStr}</li>
            <li>Confessions to {displayNameStr}</li>
            <li>Messages for {displayNameStr}</li>
          </ul>
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
