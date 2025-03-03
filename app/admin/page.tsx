"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  animation?: string;
}

function AdminPanelContent() {
  const searchParams = useSearchParams();
  const secret = searchParams.get("secret");
  const ADMIN_SECRET = "myadminsecret";
  const isAuthorized = secret === ADMIN_SECRET;

  const [pendingMemories, setPendingMemories] = useState<Memory[]>([]);

  async function fetchPendingMemories() {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setPendingMemories(data || []);
  }

  useEffect(() => {
    if (isAuthorized) {
      fetchPendingMemories();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return <p className="p-6 text-center text-red-600">Access Denied</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">
          Pending Memories for Review
        </h2>
        {pendingMemories.length > 0 ? (
          pendingMemories.map((memory) => (
            <div
              key={memory.id}
              className="bg-white/90 shadow rounded-lg p-6 mb-6 border-l-4 border-yellow-400"
            >
              <h3 className="text-2xl font-semibold text-gray-800">
                To: {memory.recipient}
              </h3>
              <p className="mt-3 text-gray-700">{memory.message}</p>
              {memory.sender && (
                <p className="mt-3 italic text-lg text-gray-600">— {memory.sender}</p>
              )}
              <small className="block mt-3 text-gray-500">
                {new Date(memory.created_at).toLocaleString()}
              </small>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => updateMemoryStatus(memory.id, "approved", fetchPendingMemories)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateMemoryStatus(memory.id, "rejected", fetchPendingMemories)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => updateMemoryStatus(memory.id, "banned", fetchPendingMemories)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Ban
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No pending memories for review.</p>
        )}
      </main>

      <footer className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} If Only I Sent This - Admin Panel
        </div>
      </footer>
    </div>
  );
}

async function updateMemoryStatus(
  id: string,
  newStatus: string,
  refreshCallback: () => void
) {
  if (newStatus === "rejected") {
    const { error } = await supabase
      .from("memories")
      .delete()
      .eq("id", id);
    if (error) console.error(error);
  } else {
    const { error } = await supabase
      .from("memories")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) console.error(error);
  }
  refreshCallback();
}

export default function AdminPanel() {
  return (
    <Suspense fallback={<p className="p-6 text-center">Loading admin panel...</p>}>
      <AdminPanelContent />
    </Suspense>
  );
}
