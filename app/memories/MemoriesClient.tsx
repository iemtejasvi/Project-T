"use client";
import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchWithUltraCache, invalidateCache } from "@/lib/enhancedCache";
import GridMemoryList from "@/components/GridMemoryList";
 
import Loader from "@/components/Loader";
import { SidebarAdUnit } from "@/components/AdUnit";
import Footer from "@/components/Footer";
import type { Memory } from '@/types/memory';

interface MemoriesClientProps {
  initialMemories?: Memory[];
  initialTotalCount?: number;
}

function MemoriesContent({ initialMemories, initialTotalCount }: MemoriesClientProps) {
  const searchParams = useSearchParams();
  const initialPage = useMemo(() => {
    const p = parseInt(searchParams?.get('page') || '0', 10);
    return Number.isFinite(p) && p >= 0 ? p : 0;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const initialSearch = useMemo(() => searchParams?.get('q') || '', []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasServerData = !!(initialMemories && initialMemories.length > 0 && initialPage === 0 && !initialSearch);
  const [displayedMemories, setDisplayedMemories] = useState<Memory[]>(hasServerData ? initialMemories : []);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [initialLoading, setInitialLoading] = useState(false); // Start false for instant perceived load
  const [page, setPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(hasServerData ? (initialTotalCount ?? initialMemories.length) : 0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchRef = useRef("");
  const lastPageLoadTime = useRef<number>(0);
  
  // Responsive check for desktop - Initialize correctly on first render
  const [isDesktop, setIsDesktop] = useState(() => {
    // Safe initial check for SSR
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const checkDesktop = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsDesktop(window.innerWidth >= 1024);
      }, 150); // Debounce resize events
    };

    // Check immediately
    setIsDesktop(window.innerWidth >= 1024);

    window.addEventListener("resize", checkDesktop);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);
  
  // Sync page & search to URL so browser back button restores position
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 0) params.set('page', String(page));
    if (searchTerm) params.set('q', searchTerm);
    const qs = params.toString();
    const newUrl = qs ? `/memories?${qs}` : '/memories';
    window.history.replaceState(window.history.state, '', newUrl);
  }, [page, searchTerm]);

  const pageSize = isDesktop ? 18 : 10;

  const hasNext = page < totalPages - 1;

  const currentDisplayCount = useMemo(() => {
    const calculatedCount = page * pageSize + displayedMemories.length;
    return Math.min(totalCount, calculatedCount);
  }, [page, pageSize, displayedMemories.length, totalCount]);

  // Check if there are any ACTIVE pinned memories (not expired)
  const hasActivePinnedMemories = useMemo(() => {
    const now = new Date();
    return displayedMemories.some(memory => 
      memory.pinned && 
      memory.pinned_until && 
      new Date(memory.pinned_until) > now
    );
  }, [displayedMemories]);

  // Update current time every second ONLY if there are ACTIVE pinned memories
  useEffect(() => {
    if (!hasActivePinnedMemories) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [hasActivePinnedMemories]);

  // Fetch memories with caching and pagination
  const fetchPageData = useCallback(async (
    pageNum: number,
    search: string,
    showLoader = true,
    isLoadMore = false
  ) => {
    try {
      const startTime = Date.now();
      const result = await fetchWithUltraCache(
        pageNum,
        pageSize,
        { status: "approved" },
        search.trim(),
        { created_at: "desc" },
        { maxAge: 18000000, staleWhileRevalidate: 36000000, prefetchDepth: 1 } // 5hr fresh, 10hr stale — matches Cloudflare edge TTL
      );

      // Only show loader for non-cached, slow loads
      if (showLoader && !result.fromCache && (Date.now() - startTime) > 100) {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoadingPage(true);
        }
      }

      if (!result.data) {
        console.error("Error fetching memories");
        setDisplayedMemories([]);
        setTotalCount(0);
        setTotalPages(0);
      } else {
        // Track load time for performance
        const loadTime = Date.now() - startTime;
        lastPageLoadTime.current = loadTime;
        
        // Update state with fetched data
        setDisplayedMemories(result.data || []);
        setTotalCount(result.totalCount || 0);
        setTotalPages(result.totalPages || 0);
        
        // Silent operation for seamless experience
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoadingPage(false);
      setIsLoadingMore(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  }, [pageSize, initialLoading]);
  
  // Initial load and re-fetch when page size changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    // On first render, use the URL-restored page; on subsequent (resize), reset to 0
    const startPage = isFirstRender.current ? initialPage : 0;
    const isFirst = isFirstRender.current;
    isFirstRender.current = false;
    setPage(startPage);

    // Skip redundant fetch on initial mount when SSR provided data for page 0
    if (isFirst && hasServerData && startPage === 0) {
      // SSR data already in state — no fetch needed
    } else {
      setDisplayedMemories([]);
      fetchPageData(startPage, searchTerm, true);
    }
    
    // Listen for real-time updates
    const handleRefreshArchives = async () => {
      // Silent background refresh - no loading indicators
      await fetchPageData(page, searchTerm, false);
    };
    
    window.addEventListener('refresh-archives', handleRefreshArchives);
    window.addEventListener('content-updated', handleRefreshArchives);
    
    return () => {
      window.removeEventListener('refresh-archives', handleRefreshArchives);
      window.removeEventListener('content-updated', handleRefreshArchives);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]); // Re-fetch when screen size changes

  // Check expired pins only when there are ACTIVE pinned memories
  useEffect(() => {
    if (!hasActivePinnedMemories) return;

    const now = new Date();
    const expiredPins = displayedMemories.filter(memory => 
      memory.pinned && 
      memory.pinned_until && 
      new Date(memory.pinned_until) <= now
    );

    if (expiredPins.length === 0) return;

    let isMounted = true;

    async function updateExpiredPins() {
      try {
        const expiredPinIds = expiredPins.map(memory => memory.id);

        // Update expired pins via server API (keeps DB write logic off the client)
        const unpinCtrl = new AbortController();
        const unpinTimer = setTimeout(() => unpinCtrl.abort(), 8000);
        await fetch('/api/unpin-expired', { method: 'POST', signal: unpinCtrl.signal });
        clearTimeout(unpinTimer);

        // Update local state
        if (isMounted) {
          setDisplayedMemories(prevMemories => 
            prevMemories.map(memory => 
              expiredPinIds.includes(memory.id) 
                ? { ...memory, pinned: false, pinned_until: undefined }
                : memory
            )
          );
          // Invalidate search results to force fresh fetch
          invalidateCache(searchTerm);
        }
      } catch (err) {
        console.error("Error updating expired pins:", err);
      }
    }

    updateExpiredPins();

    return () => {
      isMounted = false;
    };
  }, [currentTime, hasActivePinnedMemories, displayedMemories, searchTerm]);

  // Handle search with debouncing
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Don't search if term hasn't changed
    if (searchTerm === lastSearchRef.current) {
      return;
    }
    
    // Set loading immediately for UX
    if (searchTerm !== lastSearchRef.current) {
      setIsLoadingPage(true);
    }
    
    // Reset memories when searching
    setDisplayedMemories([]);
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      lastSearchRef.current = searchTerm;
      setPage(0);
      fetchPageData(0, searchTerm, false);
    }, searchTerm ? 300 : 0); // No delay when clearing search
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, fetchPageData]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);
  
  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    
    // Never show loader for cached content
    const showLoader = lastPageLoadTime.current > 50;
    await fetchPageData(nextPage, searchTerm, showLoader, true);
    
    // Instant scroll for cached pages, smooth for fresh
    if (lastPageLoadTime.current < 50) {
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, searchTerm, fetchPageData]);

  const handleLoadPrevious = useCallback(async () => {
    const prevPage = page - 1;
    setPage(prevPage);
    
    // If last load was instant, don't show loader
    const showLoader = lastPageLoadTime.current > 100;
    await fetchPageData(prevPage, searchTerm, showLoader, false);
    
    // Instant scroll for cached pages, smooth for fresh
    if (lastPageLoadTime.current < 50) {
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, searchTerm, fetchPageData]);

  

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">

      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] memories-desktop-heading lg:tracking-tight lg:leading-tight">Archive</h1>
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

      <main className="flex-grow max-w-5xl mx-auto px-2 sm:px-6 py-8 relative">
        <SidebarAdUnit slot="4305235800" />
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by recipient name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-xs sm:w-[400px] mx-auto block p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        {initialLoading && displayedMemories.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader />
          </div>
        ) : displayedMemories.length > 0 ? (
          <>
            {/* Previous Page Button - only show if not on first page */}
            {page > 0 && (
              <div className="text-center mb-6">
                <button
                  onClick={handleLoadPrevious}
                  disabled={isLoadingPage || isLoadingMore}
                  className="pagination-btn inline-flex items-center gap-1.5 text-xs px-4 py-1.5 text-[var(--text)] opacity-60 hover:opacity-100 transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="text-sm">&larr;</span> Previous
                </button>
              </div>
            )}
            <div className="mb-6 opacity-75 text-center">
              <span className="block text-base sm:text-lg font-medium text-[var(--text)]">
                {searchTerm
                  ? `Showing ${currentDisplayCount} of ${totalCount} search results`
                  : `Showing ${currentDisplayCount} of ${totalCount} memories`}
              </span>
            </div>
            {isLoadingPage ? (
              <div className="flex items-center justify-center py-16">
                <Loader />
              </div>
            ) : (
              <GridMemoryList memories={displayedMemories} adSlot="8954927254" />
            )}
            {/* Load More Button */}
            {hasNext && (
              <div className="text-center mt-6">
                {isLoadingMore ? (
                  <div className="inline-flex items-center gap-2 text-sm sm:text-base px-5 py-2 opacity-50">
                    <Loader />
                  </div>
                ) : (
                  <button
                    onClick={handleLoadMore}
                    disabled={!hasNext || isLoadingMore}
                    className="pagination-btn inline-flex items-center gap-1.5 text-xs px-4 py-1.5 text-[var(--text)] opacity-60 hover:opacity-100 transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Load More <span className="text-sm">&rarr;</span>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center">
            <p className="text-[var(--text)]">
              {searchTerm ? "No memories found matching your search." : "No memories found."}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function MemoriesClient({ initialMemories, initialTotalCount }: MemoriesClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    }>
      <MemoriesContent initialMemories={initialMemories} initialTotalCount={initialTotalCount} />
    </Suspense>
  );
}
