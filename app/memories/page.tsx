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

  useEffect(() => {
    async function fetchMemories() {
      let query = supabase
        .from("memories")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (searchTerm) {
        query = query.ilike("recipient", `%${searchTerm}%`);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching memories:", error);
      } else {
        setMemories(data || []);
      }
    }
    fetchMemories();
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">Memories</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            {/* Changed flex-wrap to flex-nowrap */}
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6">
              <li>
                <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                  Submit
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
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
