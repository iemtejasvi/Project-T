"use client";
import { useState, useEffect } from "react";
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
}

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function fetchData() {
      try {
        // Fetch announcement
        const { data: announcementData, error: announcementError } = await supabase
          .from("announcements")
          .select("id, message, expires_at")
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
            // Deactivate expired announcement
            await supabase
              .from("announcements")
              .update({ is_active: false })
              .eq("id", announcementData[0].id);
            if (isMounted) setAnnouncement(null);
          } else {
            if (isMounted) setAnnouncement(announcementData[0].message);
            
            // Schedule next check for this announcement
            const timeUntilExpiry = expiryTime.getTime() - now.getTime();
            timeoutId = setTimeout(() => {
              if (isMounted) fetchData();
            }, timeUntilExpiry);
          }
        } else {
          if (isMounted) setAnnouncement(null);
        }

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
          // Check for expired pins
          const updatedMemories = memoriesData || [];
          let needsUpdate = false;
          const now = new Date();

          for (const memory of updatedMemories) {
            if (memory.pinned && memory.pinned_until) {
              const pinExpiry = new Date(memory.pinned_until);
              if (now >= pinExpiry) {
                await supabase
                  .from("memories")
                  .update({ pinned: false, pinned_until: null })
                  .eq("id", memory.id);
                needsUpdate = true;
              }
            }
          }

          // If any pins were updated, fetch memories again
          if (needsUpdate) {
            const { data: refreshedMemories } = await supabase
              .from("memories")
              .select("*")
              .eq("status", "approved")
              .order("pinned", { ascending: false })
              .order("created_at", { ascending: false });
            if (isMounted) setMemories(refreshedMemories || []);
          } else {
            if (isMounted) setMemories(updatedMemories);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentTime]); // Add currentTime as dependency

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">Memories</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6">
              <li>
                <Link
                  href="/"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Submit
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200"
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        {memories.length > 0 ? (
          memories.map((memory) => <MemoryCard key={memory.id} memory={memory} />)
        ) : (
          <p className="text-[var(--text)]">No memories found.</p>
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
