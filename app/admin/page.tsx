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
  pinned?: boolean;
}

type Tab = "pending" | "approved" | "banned" | "announcements";

export default function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState<Tab>("pending");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string | null>(null);

  // Check for admin secret from query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secret = params.get("secret");
    const ADMIN_SECRET = "myadminsecret";
    setIsAuthorized(secret === ADMIN_SECRET);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      async function fetchMemories() {
        let query = supabase
          .from("memories")
          .select("*")
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false });

        if (selectedTab !== "pending") {
          query = query.eq("status", selectedTab);
        } else {
          query = query.eq("status", "pending");
        }

        const { data, error } = await query;
        if (error) console.error(error);
        else setMemories(data || []);
      }
      fetchMemories();
    }
  }, [isAuthorized, selectedTab]);

  useEffect(() => {
    fetchCurrentAnnouncement();
  }, []);

  const fetchCurrentAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("message")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching announcement:", error.message);
        return;
      }

      setCurrentAnnouncement(data?.[0]?.message || null);
    } catch (err) {
      console.error("Unexpected error fetching announcement:", err);
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    // Deactivate all current announcements
    await supabase
      .from("announcements")
      .update({ is_active: false })
      .eq("is_active", true);

    // Create new announcement
    const { error } = await supabase
      .from("announcements")
      .insert([{ message: announcement, is_active: true }]);

    if (error) {
      console.error("Error creating announcement:", error);
    } else {
      setAnnouncement("");
      fetchCurrentAnnouncement();
    }
  };

  const handleRemoveAnnouncement = async () => {
    const { error } = await supabase
      .from("announcements")
      .update({ is_active: false })
      .eq("is_active", true);

    if (error) {
      console.error("Error removing announcement:", error);
    } else {
      setCurrentAnnouncement(null);
    }
  };

  async function updateMemoryStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("memories")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) console.error(error);
    refreshMemories();
  }

  async function deleteMemory(id: string) {
    const password = prompt("Please enter the delete password:");
    if (password !== "2000@") {
      alert("Incorrect password. Delete aborted.");
      return;
    }
    const { error } = await supabase.from("memories").delete().eq("id", id);
    if (error) console.error(error);
    refreshMemories();
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
        .insert([{ ip: memory.ip, country: memory.country }]);
    }
    setSelectedTab("pending");
    refreshMemories();
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
    setSelectedTab("banned");
    refreshMemories();
  }

  async function togglePin(memory: Memory) {
    const { error } = await supabase
      .from("memories")
      .update({ pinned: !memory.pinned })
      .eq("id", memory.id);
    if (error) console.error(error);
    refreshMemories();
  }

  function refreshMemories() {
    if (!isAuthorized) return;
    supabase
      .from("memories")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .eq("status", selectedTab)
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setMemories(data || []);
      });
  }

  if (!authChecked) {
    return (
      <div className="p-6 text-center text-gray-600">Loading...</div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-6 text-center text-red-600">Access Denied. Please provide a valid secret.</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-6">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-4 border-b border-[var(--border)]">
          {(["pending", "approved", "banned", "announcements"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-2 px-4 font-semibold ${
                selectedTab === tab
                  ? "border-b-2 border-blue-600 text-gray-900"
                  : "text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {selectedTab === "announcements" ? (
          <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📢</span>
              <h2 className="text-2xl font-semibold text-[var(--text)]">Announcements</h2>
            </div>
            {currentAnnouncement ? (
              <div className="space-y-4">
                <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-lg text-[var(--text)] whitespace-pre-wrap break-words">
                        {currentAnnouncement}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Active Announcement
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveAnnouncement}
                      className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <span>🗑️</span>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
                <div>
                  <label htmlFor="announcement" className="block text-[var(--text)] mb-3 font-medium">
                    Create New Announcement
                  </label>
                  <textarea
                    id="announcement"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className="w-full p-4 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={4}
                    placeholder="Type your announcement here..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[var(--accent)] text-[var(--text)] rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2 font-medium"
                  >
                    <span>📢</span>
                    <span>Post Announcement</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          memories.length > 0 ? (
            memories.map((memory) => (
              <div
                key={memory.id}
                className={`bg-white/90 shadow rounded-lg p-6 border-l-4 break-words w-full ${
                  selectedTab === "pending"
                    ? "border-yellow-400"
                    : selectedTab === "approved"
                    ? "border-green-400"
                    : "border-red-600"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-semibold text-gray-800 break-words">To: {memory.recipient}</h3>
                  {memory.pinned && (
                    <span className="text-yellow-500 text-xl">📌</span>
                  )}
                </div>
                <p className="mt-3 text-gray-700 break-words whitespace-pre-wrap">{memory.message}</p>
                {memory.sender && (
                  <p className="mt-3 italic text-lg text-gray-600 break-words">— {memory.sender}</p>
                )}
                <div className="mt-3 text-sm text-gray-500 break-words">
                  <p>IP: {memory.ip}</p>
                  <p>Country: {memory.country}</p>
                </div>
                <small className="block mt-3 text-gray-500">
                  {new Date(memory.created_at).toLocaleString()}
                </small>
                <div className="mt-4 flex flex-wrap gap-4">
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
                    <>
                      <button
                        onClick={() => deleteMemory(memory.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => togglePin(memory)}
                        className={`px-4 py-2 ${
                          memory.pinned 
                            ? "bg-yellow-500 hover:bg-yellow-600" 
                            : "bg-gray-500 hover:bg-gray-600"
                        } text-white rounded transition-colors`}
                      >
                        {memory.pinned ? "Unpin" : "Pin"}
                      </button>
                    </>
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
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} If Only I Sent This - Admin Panel
        </div>
      </footer>
    </div>
  );
}
