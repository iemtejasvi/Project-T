"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { fetchMemories, updateMemory } from "@/lib/dualMemoryDB";
import MemoryCard from "@/components/MemoryCard";
import GridMemoryList from "@/components/GridMemoryList";
 
import Loader from "@/components/Loader";

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
  const pageSize = isDesktop ? 18 : 10;

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
  }, [filteredMemories, page, pageSize]);

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
        
        // Fetch memories from both databases
        const { data: memoriesData, error: memoriesError } = await fetchMemories(
          { status: "approved" },
          { pinned: "desc", created_at: "desc" }
        );

        if (!isMounted) return;

        if (memoriesError) {
          console.error("Error fetching memories:", memoriesError);
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
          await updateMemory(id, { pinned: false, pinned_until: undefined });
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

  

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] memories-desktop-heading">Archive</h1>
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
                  Confess
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
          <div className="flex items-center justify-center py-16">
            <Loader text="Loading memories..." />
          </div>
        ) : displayedMemories.length > 0 ? (
          <>
            {/* Load Previous Button */}
            {hasPrevious && (
              <div className="text-center mb-6">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!hasPrevious}
                  className="inline-flex items-center gap-2 text-sm sm:text-base px-5 py-2 bg-[#f8f6f1] text-[#6b5b47] border border-[#d4c4a8] rounded-full hover:bg-[#f0ede4] hover:border-[#c4b498] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium tracking-wide"
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
                  className="inline-flex items-center gap-2 text-sm sm:text-base px-5 py-2 bg-[#f8f6f1] text-[#6b5b47] border border-[#d4c4a8] rounded-full hover:bg-[#f0ede4] hover:border-[#c4b498] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium tracking-wide"
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
