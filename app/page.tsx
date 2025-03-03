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

export default function Home() {
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = [
    "The wound is the place where the Light enters you.",
    "Let yourself be silently drawn by the strange pull of what you really love.",
    "When you let go, you feel free.",
    "Don’t grieve. Anything you lose comes round in another form.",
    "The minute I heard my first love story, I started looking for you, not knowing how blind that was.",
    "Why do you stay in prison when the door is so wide open?",
    "The soul has been given its own ears to hear things the mind does not understand.",
    "Let the beauty we love be what we do.",
    "Everything that is made beautiful and fair is made for the eye of one who sees.",
    "Forget safety. Live where you fear to live.",
  ];

  useEffect(() => {
    async function fetchRecentMemories() {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) {
        console.error("Error fetching recent memories:", error);
      } else {
        setRecentMemories(data || []);
      }
    }
    fetchRecentMemories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">If Only I Sent This</h1>
          <hr className="my-4 border-gray-300" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-blue-600 transition-colors duration-200">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-blue-600 transition-colors duration-200">
                  Submit
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors duration-200">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Rotating Quote */}
      <section
        className="mb-10 p-4 bg-white/90 rounded-lg shadow-lg text-center flex items-center justify-center overflow-hidden"
        style={{ minHeight: "4rem" }}
      >
        <p className="w-full text-xl md:text-2xl italic text-gray-700 px-2 break-words whitespace-normal overflow-hidden">
          {quotes[quoteIndex]}
        </p>
      </section>

      {/* Recent Memories */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">Recent Memories</h2>
        {recentMemories.length > 0 ? (
          recentMemories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))
        ) : (
          <p className="text-gray-700">No recent memories found.</p>
        )}
        <div className="text-right mt-4">
          <Link href="/memories" className="text-blue-600 hover:underline transition-colors duration-200">
            View All Memories →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
