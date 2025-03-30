"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  ip?: string;
  city?: string;
  state?: string;
  country?: string;
  device?: string;
  animation?: string;
}

type Tab = "pending" | "approved" | "banned";

export default function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState<Tab>("pending");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check for admin secret from query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secret = params.get("secret");
    const ADMIN_SECRET = "myadminsecret";
    setIsAuthorized(secret === ADMIN_SECRET);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchMemories();
    }
  }, [isAuthorized, selectedTab]);

  async function fetchMemories() {
    let query = supabase.from("memories").select("*").order("created_at", { ascending: false });
    if (selectedTab === "pending") {
      query = query.eq("status", "pending");
    } else if (selectedTab === "approved") {
      query = query.eq("status", "approved");
    } else if (selectedTab === "banned") {
      query = query.eq("status", "banned");
    }
    const { data, error } = await query;
    if (error) console.error(error);
    else setMemories(data || []);
  }

  async function updateMemoryStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("memories")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) console.error(error);
    fetchMemories();
  }

  async function deleteMemory(id: string) {
    const { error } = await supabase.from("memories").delete().eq("id", id);
    if (error) console.error(error);
    fetchMemories();
  }

  async function banMemory(memory: Memory) {
    const { error } = await supabase
      .from("memories")
      .update({ status: "banned" })
      .eq("id", memory.id);
    if (error) console.error(error);
    if (memory.ip) {
      await supabase
        .from("banned_ips")
        .insert([{ ip: memory.ip, city: memory.city, state: memory.state, country: memory.country, device: memory.device }]);
    }
    fetchMemories();
  }

  async function unbanMemory(memory: Memory) {
    const { error } = await supabase
      .from("memories")
      .update({ status: "approved" })
      .eq("id", memory.id);
    if (error) console.error(error);
    if (memory.ip) {
      await supabase.from("banned_ips").delete().eq("ip", memory.ip);
    }
    fetchMemories();
  }

  if (!isAuthorized) {
    return (
      <div className="p-6 text-center text-red-600">
        Access Denied. Please provide a valid secret.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-6">
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

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex space-x-4 border-b border-[var(--border)]">
          <button
            onClick={() => setSelectedTab("pending")}
            className={`py-2 px-4 font-semibold ${selectedTab === "pending" ? "border-b-2 border-blue-600 text-gray-900" : "text-gray-600"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedTab("approved")}
            className={`py-2 px-4 font-semibold ${selectedTab === "approved" ? "border-b-2 border-blue-600 text-gray-900" : "text-gray-600"}`}
          >
            Approved
          </button>
          <button
            onClick={() => setSelectedTab("banned")}
            className={`py-2 px-4 font-semibold ${selectedTab === "banned" ? "border-b-2 border-blue-600 text-gray-900" : "text-gray-600"}`}
          >
            Banned
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-8 space-y-6">
        {memories.length > 0 ? (
          memories.map((memory) => (
            <div
              key={memory.id}
              className={`bg-white/90 shadow rounded-lg p-6 border-l-4 ${
                selectedTab === "pending"
                  ? "border-yellow-400"
                  : selectedTab === "approved"
                  ? "border-green-400"
                  : "border-red-600"
              }`}
            >
              <h3 className="text-2xl font-semibold text-gray-800">To: {memory.recipient}</h3>
              <p className="mt-3 text-gray-700">{memory.message}</p>
              {memory.sender && (
                <p className="mt-3 italic text-lg text-gray-600">— {memory.sender}</p>
              )}
              <div className="mt-3 text-sm text-gray-500">
                <p>IP: {memory.ip}</p>
                <p>City: {memory.city}</p>
                <p>State: {memory.state}</p>
                <p>Country: {memory.country}</p>
                <p>Device: {memory.device}</p>
              </div>
              <small className="block mt-3 text-gray-500">
                {new Date(memory.created_at).toLocaleString()}
              </small>
              <div className="mt-4 flex gap-4">
                {selectedTab === "pending" && (
                  <>
                    <button
                      onClick={() => updateMemoryStatus(memory.id, "approved")}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => banMemory(memory)}
                      className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      Ban
                    </button>
                  </>
                )}
                {selectedTab === "approved" && (
                  <button
                    onClick={() => deleteMemory(memory.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                )}
                {selectedTab === "banned" && (
                  <>
                    <button
                      onClick={() => unbanMemory(memory)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Unban
                    </button>
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No {selectedTab} memories found.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} If Only I Sent This - Admin Panel
        </div>
      </footer>
    </div>
  );
}
