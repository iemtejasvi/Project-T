"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import MemoryCard from "@/components/MemoryCard";
import TypingEffect from "@/components/TypingEffect";

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
  const [showWelcome, setShowWelcome] = useState(false);
  const [theme, setTheme] = useState("light"); // Theme state

  useEffect(() => {
    async function fetchRecentMemories() {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) console.error("Error fetching memories:", error);
      else setRecentMemories(data || []);
    }
    fetchRecentMemories();

    if (!localStorage.getItem("hasVisited")) {
      setShowWelcome(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const handleWelcomeClose = () => setShowWelcome(false);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {showWelcome && (
        <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg max-w-sm w-full animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--text)] mb-4">Welcome</h2>
            <p className="text-[var(--text)] mb-6">
              A space for unsent memories. Check out{" "}
              <Link href="/how-it-works" className="text-[var(--accent)] hover:underline">
                How It Works
              </Link>
              .
            </p>
            <button
              onClick={handleWelcomeClose}
              className="px-4 py-2 bg-[var(--accent)] text-[var(--text)] rounded hover:bg-blue-200 transition duration-200"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">If Only I Sent This</h1>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <nav>
              <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <li>
                  <Link href="/" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/memories" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200">
                    Memories
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
            <select value={theme} onChange={handleThemeChange} className="p-2 border rounded">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              {/* Add more themes if needed */}
            </select>
          </div>
        </div>
      </header>

      <section className="my-8 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-[var(--card-bg)] p-4 rounded-xl shadow-md text-center">
          <TypingEffect />
        </div>
      </section>

      {/* Mobile carousel layout */}
      <div className="sm:hidden px-4">
        <div className="flex space-x-4 overflow-x-auto">
          {recentMemories.map((memory) => (
            <div key={memory.id} className="flex-shrink-0 w-4/5">
              <MemoryCard memory={memory} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 max-w-5xl mx-auto">
        {recentMemories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>

      <footer className="bg-[var(--card-bg)] shadow-md mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
