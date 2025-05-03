"use client";

import { useState, useEffect } from "react";
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
  country?: string;
  animation?: string;
}

type Tab = "pending" | "approved" | "banned";

export default function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState<Tab>("pending");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check for admin secret from query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secret = params.get("secret");
    const ADMIN_SECRET = "myadminsecret";
    setIsAuthorized(secret === ADMIN_SECRET);
    setAuthChecked(true);
  }, []);

  // Fetch memories based on status
  useEffect(() => {
    if (isAuthorized) {
      async function fetchMemories() {
        let query = supabase
          .from("memories")
          .select("*")
          .order("created_at", { ascending: false });
        query = query.eq("status", selectedTab);
        const { data, error } = await query;
        if (error) console.error(error);
        else setMemories(data || []);
      }
      fetchMemories();
    }
  }, [isAuthorized, selectedTab]);

  // Helpers to refresh list
  const refresh = async () => {
    if (!isAuthorized) return;
    let query = supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("status", selectedTab);
    const { data, error } = await query;
    if (error) console.error(error);
    else setMemories(data || []);
  };

  // Actions
  async function updateMemoryStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("memories")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) console.error(error);
    await refresh();
  }

  async function deleteMemory(id: string) {
    const password = prompt("Please enter the delete password:");
    if (password !== "2000@") {
      alert("Incorrect password. Delete aborted.");
      return;
    }
    const { error } = await supabase.from("memories").delete().eq("id", id);
    if (error) console.error(error);
    await refresh();
  }

  async function banMemory(memory: Memory) {
    const { error } = await supabase
      .from("memories")
      .update({ status: "banned" })
      .eq("id", memory.id);
    if (error) console.error(error);
    if (memory.ip) {
      await supabase.from("banned_ips").insert([
        { ip: memory.ip, country: memory.country }
      ]);
    }
    setSelectedTab("pending");
    await refresh();
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
    await refresh();
  }

  if (!authChecked) {
    return (
      <div className="p-6 text-center text-gray-600">Loading...</div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-6 text-center text-red-600">
        Access Denied. Please provide a valid secret.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg w-full">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between px-4 py-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Admin Panel
          </h1>
          <nav>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Tabs */}
      <div className="w-full bg-[var(--card-bg)] shadow-inner">
        <div className="max-w-4xl mx-auto flex overflow-x-auto whitespace-nowrap px-4">
          {(["pending", "approved", "banned"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={
                `py-2 px-4 font-semibold flex-1 text-center transition-colors duration-200 ` +
                (selectedTab === tab
                  ? "border-b-2 border-blue-600 text-gray-900"
                  : "text-gray-600 hover:text-gray-900")
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {memories.length > 0 ? (
            memories.map((memory) => (
              <div
                key={memory.id}
                className={
                  `bg-white/90 shadow rounded-lg p-6 border-l-4 transition-all ` +
                  (selectedTab === "pending"
                    ? "border-yellow-400"
                    : selectedTab === "approved"
                    ? "border-green-400"
                    : "border-red-600")
                }
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  To: {memory.recipient}
                </h3>
                <p className="mt-2 text-gray-700 break-words">
                  {memory.message}
                </p>
                {memory.sender && (
                  <p className="mt-2 italic text-base text-gray-600">
                    — {memory.sender}
                  </p>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  <p>IP: {memory.ip}</p>
                  <p>Country: {memory.country}</p>
                </div>
                <small className="block mt-2 text-gray-500">
                  {new Date(memory.created_at).toLocaleString()}
                </small>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTab === "pending" && (
                    <>
                      <button
                        onClick={() => updateMemoryStatus(memory.id, "approved")}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => deleteMemory(memory.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => banMemory(memory)}
                        className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                      >
                        Ban
                      </button>
                    </>
                  )}
                  {selectedTab === "approved" && (
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  {selectedTab === "banned" && (
                    <>
                      <button
                        onClick={() => unbanMemory(memory)}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Unban
                      </button>
                      <button
                        onClick={() => deleteMemory(memory.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700 text-center">
              No {selectedTab} memories found.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md shadow-inner w-full">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} If Only I Sent This - Admin Panel
        </div>
      </footer>
    </div>
  );
}
