"use client";
import { useState } from "react";
import Link from "next/link";
import useSWR from 'swr';
import { supabase } from "@/lib/supabaseClient";
import MemoryCard from "@/components/MemoryCard";

const memoriesFetcher = async () => {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("status", "approved")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching memories:", error.message);
    throw error;
  }
  if (!data) return [];

  const now = new Date();
  const expiredPinIds = data
    .filter(memory => memory.pinned && memory.pinned_until && new Date(memory.pinned_until) < now)
    .map(memory => memory.id);

  if (expiredPinIds.length > 0) {
    await supabase
      .from("memories")
      .update({ pinned: false, pinned_until: null })
      .in("id", expiredPinIds);
    
    const updatedData = data.map(m => 
      expiredPinIds.includes(m.id) ? { ...m, pinned: false, pinned_until: null } : m
    );
    
    return updatedData.sort((a,b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  return data;
};

export default function Memories() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: memories = [] } = useSWR('memories-all', memoriesFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        {memories.length > 0 ? (
          memories
            .filter(memory => 
              memory.recipient.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((memory) => <MemoryCard key={memory.id} memory={memory} />)
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
