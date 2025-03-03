"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function MemoryDetail() {
  const { id } = useParams();
  const [memory, setMemory] = useState<Memory | null>(null);

  useEffect(() => {
    async function fetchMemory() {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error(error);
      } else {
        setMemory(data);
      }
    }
    fetchMemory();
  }, [id]);

  if (!memory) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Memory Detail</h1>
          <hr className="my-4 border-gray-300" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-blue-600">
                  Back to Memories
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        <MemoryCard memory={memory} detail />
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
