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
  const [showWelcome, setShowWelcome] = useState(false);
  const quotes = [
    "The wound is the place where the Light enters you.",
    "Let yourself be silently drawn by the strange pull of what you really love.",
    "When you let go, you feel free.",
    "Don’t grieve. Anything you lose comes round in another form.",
    "The minute I heard my first love story, I started looking for you.",
    "Why do you stay in prison when the door is so wide open?",
    "The soul has its own ears to hear things the mind does not understand.",
    "Let the beauty we love be what we do.",
    "Everything beautiful is made for the eye of one who sees.",
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

    if (!localStorage.getItem("hasVisited")) {
      setShowWelcome(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
      {showWelcome && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Welcome to If Only I Sent This</h2>
            <p className="text-gray-400 mb-6">
              A place for the words you never sent. Learn more on our{" "}
              <Link href="/how-it-works" className="text-teal-400 hover:underline">
                How It Works
              </Link>{" "}
              page.
            </p>
            <button
              onClick={handleWelcomeClose}
              className="px-4 py-2 bg-teal-600 text-gray-200 rounded hover:bg-teal-700 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <header className="bg-gray-900/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-bold text-gray-200">If Only I Sent This</h1>
          <hr className="my-4 border-gray-600" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6 text-gray-400">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-teal-400 transition-colors duration-200">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-teal-400 transition-colors duration-200">
                  Submit
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-teal-400 transition-colors duration-200">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="mb-10 p-4 bg-gray-900 text-gray-300 rounded-lg shadow-lg text-center mx-auto max-w-4xl">
        <p className="text-xl md:text-2xl italic">{quotes[quoteIndex]}</p>
      </section>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-200">Recent Memories</h2>
        {recentMemories.length > 0 ? (
          recentMemories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))
        ) : (
          <p className="text-gray-400">No recent memories found.</p>
        )}
        <div className="text-right mt-4">
          <Link href="/memories" className="text-teal-400 hover:underline transition-colors duration-200">
            View All Memories →
          </Link>
        </div>
      </main>

      <footer className="bg-gray-900/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
