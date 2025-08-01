"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import MemoryCard from "@/components/MemoryCard";
import GridMemoryList from "@/components/GridMemoryList";
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

export default function Memories() {
  const [allMemories, setAllMemories] = useState<Memory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(0);
  // Responsive check for desktop
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);
  const pageSize = isDesktop ? 20 : 10;

  // Memoized filtered memories to prevent unnecessary recalculations
  const filteredMemories = useMemo(() => {
    const trimmedSearch = searchTerm.trim();
    return allMemories.filter(memory => 
      memory.recipient.toLowerCase().includes(trimmedSearch.toLowerCase())
    );
  }, [allMemories, searchTerm]);

  // Memoized displayed memories
  const displayedMemories = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return filteredMemories.slice(start, end);
  }, [filteredMemories, page]);

  const totalPages = Math.ceil(filteredMemories.length / pageSize);
  const hasPrevious = page > 0;
  const hasNext = page < totalPages - 1;

  // Check if there are any ACTIVE pinned memories (not expired)
  const hasActivePinnedMemories = useMemo(() => {
    const now = new Date();
    return allMemories.some(memory => 
      memory.pinned && 
      memory.pinned_until && 
      new Date(memory.pinned_until) > now
    );
  }, [allMemories]);

  // Update current time every second ONLY if there are ACTIVE pinned memories
  useEffect(() => {
    if (!hasActivePinnedMemories) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [hasActivePinnedMemories]);

  // Initial data fetch - only runs once
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setInitialLoading(true);
        
        // Fetch memories
        const { data: memoriesData, error: memoriesError } = await supabase
          .from("memories")
          .select("*")
          .eq("status", "approved")
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        if (memoriesError) {
          console.error("Error fetching memories:", memoriesError.message);
        } else {
          if (isMounted) {
            setAllMemories(memoriesData || []);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Check expired pins only when there are ACTIVE pinned memories
  useEffect(() => {
    if (!hasActivePinnedMemories) return;

    const now = new Date();
    const expiredPins = allMemories.filter(memory => 
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
          setAllMemories(prevMemories => 
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
  }, [currentTime, hasActivePinnedMemories, allMemories]);

  // Reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

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
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] memories-desktop-heading">Memories</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li>
                <Link
                  href="/"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 desktop-nav-link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 desktop-nav-link"
                >
                  Submit
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 desktop-nav-link"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by recipient name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-xs sm:w-[400px] mx-auto block p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        {initialLoading ? (
          <div className="text-center py-8">
            <p className="text-[var(--text)]">Loading memories...</p>
          </div>
        ) : displayedMemories.length > 0 ? (
          <>
            {/* Load Previous Button */}
            {hasPrevious && (
              <div className="text-center mb-6">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!hasPrevious}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-transparent text-[var(--text)] font-medium rounded-full border border-[var(--border)] shadow-sm hover:bg-[var(--card-bg)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  <span className="text-lg">←</span> Load Prev.
                </button>
              </div>
            )}
            <div className="mb-4 opacity-75 text-center">
              <span className="block text-base sm:text-lg font-medium text-[var(--text)]">
                {searchTerm
                  ? `Showing ${(Math.min((page + 1) * pageSize, filteredMemories.length))} of ${filteredMemories.length} search results`
                  : `Showing ${(Math.min((page + 1) * pageSize, allMemories.length))} of ${allMemories.length} memories`}
              </span>
            </div>
            {isDesktop ? (
              <GridMemoryList memories={displayedMemories} />
            ) : (
              displayedMemories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))
            )}
            {/* Load More Button */}
            {hasNext && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!hasNext}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-transparent text-[var(--text)] font-medium rounded-full border border-[var(--border)] shadow-sm hover:bg-[var(--card-bg)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  Load More <span className="text-lg">→</span>
                </button>
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

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)] footer-copyright">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
