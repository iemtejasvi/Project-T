"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase, supabase2 } from "@/lib/supabaseClient";
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

export default function MemoryDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMemory() {
      try {
        setIsLoading(true);
        setError(null);

        // Try first database
        const { data: data1, error: error1 } = await supabase
          .from("memories")
          .select("*")
          .eq("id", id)
          .single();

        if (data1) {
          setMemory(data1);
          setIsLoading(false);
          return;
        }

        // If not found in first database, try second database
        const { data: data2, error: error2 } = await supabase2
          .from("memories")
          .select("*")
          .eq("id", id)
          .single();

        if (data2) {
          setMemory(data2);
        } else {
          // If not found in either database
          setError("Memory not found");
          if (error1) console.error("Error from first database:", error1);
          if (error2) console.error("Error from second database:", error2);
        }
      } catch (error) {
        console.error("Error fetching memory:", error);
        setError("Failed to load memory");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMemory();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text)]">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-[var(--card-bg)] shadow-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">Memory Detail</h1>
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
                    href="/memories"
                    className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200"
                  >
                    Back to Memories
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow-md text-center">
            <p className="text-[var(--text)] text-xl">{error}</p>
          </div>
        </main>

        <footer className="bg-[var(--card-bg)] shadow-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)]">
            © {new Date().getFullYear()} If Only I Sent This
          </div>
        </footer>
      </div>
    );
  }

  if (!memory) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">Memory Detail</h1>
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
                  href="/memories"
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Back to Memories
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <MemoryCard memory={memory} detail />
      </main>

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
