"use client";

import { useState, useEffect, useCallback } from "react";
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
  pinned_until?: string;
}

type Tab = "pending" | "approved" | "banned" | "announcements";

export default function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState<Tab>("pending");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [announcementTimer, setAnnouncementTimer] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: ""
  });
  const [currentAnnouncement, setCurrentAnnouncement] = useState<{ id: string; message: string; expires_at: string } | null>(null);
  const [pinTimers, setPinTimers] = useState<{ [key: string]: { days: string; hours: string; minutes: string; seconds: string } }>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bannedIps, setBannedIps] = useState<{ ip: string; country?: string }[]>([]);

  // Memoize refreshMemories to prevent infinite loops
  const refreshMemories = useCallback(() => {
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
  }, [isAuthorized, selectedTab]);

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
        .select("id, message, expires_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching announcement:", error.message);
        return;
      }

      if (data?.[0]) {
        // Check if announcement has expired
        if (new Date(data[0].expires_at) < new Date()) {
          // Deactivate expired announcement
          await supabase
            .from("announcements")
            .update({ is_active: false })
            .eq("id", data[0].id);
          setCurrentAnnouncement(null);
        } else {
          setCurrentAnnouncement(data[0]);
        }
      } else {
        setCurrentAnnouncement(null);
      }
    } catch (err) {
      console.error("Unexpected error fetching announcement:", err);
    }
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to calculate total seconds from timer object
  const calculateTotalSeconds = (timer: { days: string; hours: string; minutes: string; seconds: string }) => {
    const days = parseInt(timer.days) || 0;
    const hours = parseInt(timer.hours) || 0;
    const minutes = parseInt(timer.minutes) || 0;
    const seconds = parseInt(timer.seconds) || 0;
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  };

  // Helper function to format remaining time
  const formatRemainingTime = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - currentTime.getTime();
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
    
    return parts.join(" ") || "Expired";
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    const totalSeconds = calculateTotalSeconds(announcementTimer);
    if (totalSeconds <= 0) return;

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + totalSeconds);

    // Deactivate all current announcements
    await supabase
      .from("announcements")
      .update({ is_active: false })
      .eq("is_active", true);

    // Create new announcement
    const { data, error } = await supabase
      .from("announcements")
      .insert([{ 
        message: announcement, 
        is_active: true,
        expires_at: expiresAt.toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating announcement:", error);
    } else if (data) {
      setAnnouncement("");
      setAnnouncementTimer({ days: "", hours: "", minutes: "", seconds: "" });
      setCurrentAnnouncement(data);
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
    const password = prompt("Please enter the ban password:");
    if (password !== "2000@") {
      alert("Incorrect password. Ban aborted.");
      return;
    }
    // First delete the memory
    const { error: deleteError } = await supabase
      .from("memories")
      .delete()
      .eq("id", memory.id);
    
    if (deleteError) {
      console.error("Error deleting memory:", deleteError);
      return;
    }

    // Then ban the IP if it exists
    if (memory.ip) {
      const { error: banError } = await supabase
        .from("banned_ips")
        .insert([{ ip: memory.ip, country: memory.country }]);
      
      if (banError) {
        console.error("Error banning IP:", banError);
      }
    }
    
    setSelectedTab("pending");
    refreshMemories();
  }

  async function unbanMemory(memory: Memory) {
    const password = prompt("Please enter the unban password:");
    if (password !== "2000@") {
      alert("Incorrect password. Unban aborted.");
      return;
    }
    // Only unban the IP, since the message is already deleted
    if (memory.ip) {
      const { error } = await supabase
        .from("banned_ips")
        .delete()
        .eq("ip", memory.ip);
      
      if (error) {
        console.error("Error unbanning IP:", error);
      }
    }
    
    setSelectedTab("banned");
    refreshMemories();
  }

  async function togglePin(memory: Memory) {
    if (memory.pinned) {
      // If already pinned, just unpin it
      const { error } = await supabase
        .from("memories")
        .update({ 
          pinned: false,
          pinned_until: null
        })
        .eq("id", memory.id);
      if (error) console.error(error);
      refreshMemories();
      return;
    }

    // For pinning, check timer
    const timer = pinTimers[memory.id];
    if (!timer) return;
    
    const totalSeconds = calculateTotalSeconds(timer);
    if (totalSeconds <= 0) return;

    const pinnedUntil = new Date();
    pinnedUntil.setSeconds(pinnedUntil.getSeconds() + totalSeconds);

    const { error } = await supabase
      .from("memories")
      .update({ 
        pinned: true,
        pinned_until: pinnedUntil.toISOString()
      })
      .eq("id", memory.id);
    if (error) console.error(error);
    refreshMemories();
  }

  // Add interval for checking expired items
  useEffect(() => {
    const checkExpiredItems = async () => {
      // Check expired announcements
      if (currentAnnouncement) {
        const expiry = new Date(currentAnnouncement.expires_at);
        if (currentTime >= expiry) {
          await supabase
            .from("announcements")
            .update({ is_active: false })
            .eq("id", currentAnnouncement.id);
          setCurrentAnnouncement(null);
          await fetchCurrentAnnouncement(); // Refresh announcement state
        }
      }

      // Check expired pins
      const { data: pinnedMemories, error } = await supabase
        .from("memories")
        .select("id, pinned_until")
        .eq("pinned", true)
        .not("pinned_until", "is", null);

      if (error) {
        console.error("Error checking expired pins:", error);
        return;
      }

      let needsRefresh = false;
      for (const memory of pinnedMemories || []) {
        if (new Date(memory.pinned_until) <= currentTime) {
          await supabase
            .from("memories")
            .update({ pinned: false, pinned_until: null })
            .eq("id", memory.id);
          needsRefresh = true;
        }
      }

      // Refresh memories if we're on the approved tab and any pins were updated
      if (needsRefresh && selectedTab === "approved") {
        refreshMemories();
      }
    };

    const interval = setInterval(checkExpiredItems, 1000); // Check every second
    return () => clearInterval(interval);
  }, [currentTime, currentAnnouncement, selectedTab, refreshMemories]);

  // Fetch banned IPs when banned tab is selected
  useEffect(() => {
    if (selectedTab === "banned") {
      supabase
        .from("banned_ips")
        .select("ip, country")
        .then(({ data, error }) => {
          if (error) console.error(error);
          else setBannedIps(data || []);
        });
    }
  }, [selectedTab]);

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
        <div className="flex justify-between border-b border-[var(--border)]">
          {(["pending", "approved", "banned", "announcements"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold whitespace-nowrap ${
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
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {selectedTab === "announcements" ? (
          <div className="bg-[var(--card-bg)] p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
              <span className="text-lg sm:text-xl md:text-2xl">📢</span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)]">Announcements</h2>
            </div>
            {currentAnnouncement ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-[var(--bg)] p-3 sm:p-4 md:p-6 rounded-lg border border-[var(--border)]">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base md:text-lg text-[var(--text)] whitespace-pre-wrap break-words">
                        {currentAnnouncement.message}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        Active Announcement • Expires in: {formatRemainingTime(currentAnnouncement.expires_at)}
                      </p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <button
                        onClick={handleRemoveAnnouncement}
                        className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                      >
                        <span>🗑️</span>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAnnouncementSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="announcement" className="block text-[var(--text)] mb-2 font-medium text-sm sm:text-base">
                    Create New Announcement
                  </label>
                  <textarea
                    id="announcement"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                    rows={4}
                    placeholder="Type your announcement here..."
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full sm:w-auto">
                    <div className="grid grid-cols-4 gap-1 sm:gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Days</label>
                        <input
                          type="number"
                          value={announcementTimer.days}
                          onChange={(e) => setAnnouncementTimer(prev => ({ ...prev, days: e.target.value }))}
                          min="0"
                          className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Hours</label>
                        <input
                          type="number"
                          value={announcementTimer.hours}
                          onChange={(e) => setAnnouncementTimer(prev => ({ ...prev, hours: e.target.value }))}
                          min="0"
                          max="23"
                          className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Mins</label>
                        <input
                          type="number"
                          value={announcementTimer.minutes}
                          onChange={(e) => setAnnouncementTimer(prev => ({ ...prev, minutes: e.target.value }))}
                          min="0"
                          max="59"
                          className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Secs</label>
                        <input
                          type="number"
                          value={announcementTimer.seconds}
                          onChange={(e) => setAnnouncementTimer(prev => ({ ...prev, seconds: e.target.value }))}
                          min="0"
                          max="59"
                          className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-[var(--accent)] text-[var(--text)] rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap"
                    disabled={!announcement.trim() || calculateTotalSeconds(announcementTimer) <= 0}
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
                        className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                      >
                        Delete
                      </button>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        {memory.pinned && memory.pinned_until && (
                          <div className="text-sm text-gray-500">
                            Unpins in: {formatRemainingTime(memory.pinned_until)}
                          </div>
                        )}
                        {!memory.pinned && (
                          <div className="w-full sm:w-auto">
                            <div className="grid grid-cols-4 gap-1">
                              <input
                                type="number"
                                value={pinTimers[memory.id]?.days ?? ""}
                                onChange={(e) => setPinTimers(prev => ({
                                  ...prev,
                                  [memory.id]: { ...(prev[memory.id] || { days: "", hours: "", minutes: "", seconds: "" }), days: e.target.value }
                                }))}
                                min="0"
                                className="w-14 sm:w-16 p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                placeholder="D"
                              />
                              <input
                                type="number"
                                value={pinTimers[memory.id]?.hours ?? ""}
                                onChange={(e) => setPinTimers(prev => ({
                                  ...prev,
                                  [memory.id]: { ...(prev[memory.id] || { days: "", hours: "", minutes: "", seconds: "" }), hours: e.target.value }
                                }))}
                                min="0"
                                max="23"
                                className="w-14 sm:w-16 p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                placeholder="H"
                              />
                              <input
                                type="number"
                                value={pinTimers[memory.id]?.minutes ?? ""}
                                onChange={(e) => setPinTimers(prev => ({
                                  ...prev,
                                  [memory.id]: { ...(prev[memory.id] || { days: "", hours: "", minutes: "", seconds: "" }), minutes: e.target.value }
                                }))}
                                min="0"
                                max="59"
                                className="w-14 sm:w-16 p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                placeholder="M"
                              />
                              <input
                                type="number"
                                value={pinTimers[memory.id]?.seconds ?? ""}
                                onChange={(e) => setPinTimers(prev => ({
                                  ...prev,
                                  [memory.id]: { ...(prev[memory.id] || { days: "", hours: "", minutes: "", seconds: "" }), seconds: e.target.value }
                                }))}
                                min="0"
                                max="59"
                                className="w-14 sm:w-16 p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                placeholder="S"
                              />
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => togglePin(memory)}
                          className={`w-full sm:w-auto px-3 sm:px-4 py-2 ${
                            memory.pinned 
                              ? "bg-yellow-500 hover:bg-yellow-600" 
                              : "bg-gray-500 hover:bg-gray-600"
                          } text-white rounded transition-colors text-sm`}
                          disabled={!memory.pinned && (!pinTimers[memory.id] || calculateTotalSeconds(pinTimers[memory.id]) <= 0)}
                        >
                          {memory.pinned ? "Unpin" : "Pin"}
                        </button>
                      </div>
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
        {selectedTab === "banned" && bannedIps.length > 0 && (
          <div className="bg-white/90 shadow rounded-lg p-6 border-l-4 border-red-600 w-full mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Banned IPs</h3>
            <ul className="divide-y divide-gray-200">
              {bannedIps.map((ipObj) => (
                <li key={ipObj.ip} className="py-2 flex items-center justify-between">
                  <span>
                    <span className="font-mono">{ipObj.ip}</span>
                    {ipObj.country && <span className="ml-2 text-gray-500">({ipObj.country})</span>}
                  </span>
                  <button
                    onClick={async () => {
                      const password = prompt("Please enter the unban password:");
                      if (password !== "2000@") {
                        alert("Incorrect password. Unban aborted.");
                        return;
                      }
                      const { error } = await supabase
                        .from("banned_ips")
                        .delete()
                        .eq("ip", ipObj.ip);
                      if (error) {
                        alert("Failed to unban IP");
                      } else {
                        setBannedIps((prev) => prev.filter((b) => b.ip !== ipObj.ip));
                      }
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Unban
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
