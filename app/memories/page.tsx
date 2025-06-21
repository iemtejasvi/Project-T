"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import MemoryCard from "@/components/MemoryCard";

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
  const [displayCount, setDisplayCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Memoized filtered memories to prevent unnecessary recalculations
  const filteredMemories = useMemo(() => {
    return allMemories.filter(memory => 
      memory.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allMemories, searchTerm]);

  // Memoized displayed memories
  const displayedMemories = useMemo(() => {
    return filteredMemories.slice(0, displayCount);
  }, [filteredMemories, displayCount]);

  // Memoized hasMore calculation
  const hasMoreMemories = useMemo(() => {
    return filteredMemories.length > displayCount;
  }, [filteredMemories.length, displayCount]);

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
  }, [currentTime, hasActivePinnedMemories]);

  // Reset display count when search changes
  useEffect(() => {
    setDisplayCount(10);
  }, [searchTerm]);

  // Update hasMore when filtered memories change
  useEffect(() => {
    setHasMore(hasMoreMemories);
  }, [hasMoreMemories]);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 10);
      setLoading(false);
    }, 300); // Reduced delay for better UX
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">Memories</h1>
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
            className="w-full p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        
        {initialLoading ? (
          <div className="text-center py-8">
            <p className="text-[var(--text)]">Loading memories...</p>
          </div>
        ) : displayedMemories.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-[var(--text)] opacity-75">
              {searchTerm ? (
                <span>Showing {displayedMemories.length} of {filteredMemories.length} search results</span>
              ) : (
                <span>Showing {displayedMemories.length} of {allMemories.length} memories</span>
              )}
            </div>
            {displayedMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-[#f8f6f1] text-[#6b5b47] border border-[#d4c4a8] rounded-lg hover:bg-[#f0ede4] hover:border-[#c4b498] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium tracking-wide"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-[var(--text)]">
            {searchTerm ? "No memories found matching your search." : "No memories found."}
          </p>
        )}
      </main>

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
