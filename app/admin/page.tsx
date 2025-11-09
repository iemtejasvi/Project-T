"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import UnlimitedUsersPage from "./unlimited/page";
import { fetchMemories, primaryDB, secondaryDB, getDatabaseStatus, getDatabaseCounts, fetchRecentMemories, locateMemory, getStatusCounts, measureDbLatency, getExpiredPinnedCount, unpinExpiredMemories, simulateRoundRobin } from "@/lib/dualMemoryDB";
import Loader from "@/components/Loader";

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
  uuid?: string;
  tag?: string;
  sub_tag?: string;
}

type Tab = "pending" | "approved" | "banned" | "announcements" | "maintenance" | "dbhealth" | "unlimited";

export default function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState<Tab>("pending");
  const [announceMenuOpen, setAnnounceMenuOpen] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [announcementLink, setAnnouncementLink] = useState("");
  const [announcementBgColor, setAnnouncementBgColor] = useState("#ef4444"); // red-500
  const [announcementTextColor, setAnnouncementTextColor] = useState("#ffffff");
  const [announcementIcon, setAnnouncementIcon] = useState("📢");
  const [announcementTitle, setAnnouncementTitle] = useState("Announcement");
  const [announcementIsDismissible, setAnnouncementIsDismissible] = useState(false);

  const [announcementTimer, setAnnouncementTimer] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: ""
  });
  const [currentAnnouncement, setCurrentAnnouncement] = useState<{ 
    id: string; 
    message: string; 
    expires_at: string; 
    link_url?: string | null;
    background_color?: string | null;
    text_color?: string | null;
    icon?: string | null;
    title?: string | null;
    is_dismissible?: boolean;
    view_count?: number;
    click_count?: number;
  } | null>(null);
  const [pinTimers, setPinTimers] = useState<{ [key: string]: { days: string; hours: string; minutes: string; seconds: string } }>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bannedUsers, setBannedUsers] = useState<{ ip?: string; uuid?: string; country?: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  // DB Health state
  const [dbHealthLoading, setDbHealthLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<null | { databaseA: boolean; databaseB: boolean; bothHealthy: boolean; anyHealthy: boolean }>(null);
  const [dbCounts, setDbCounts] = useState<null | { A: number | null; B: number | null }>(null);
  const [recentRoutes, setRecentRoutes] = useState<Array<{ id: string; created_at: string; location: 'A' | 'B' | 'Both' | 'Unknown' }>>([]);
  const [statusCounts, setStatusCounts] = useState<null | { A: Record<'pending' | 'approved' | 'banned', number | null>; B: Record<'pending' | 'approved' | 'banned', number | null> }>(null);
  const [latency, setLatency] = useState<null | { A: number; B: number }>(null);
  const [expiredPinned, setExpiredPinned] = useState<null | { A: number; B: number; total: number }>(null);
  const [diffIds, setDiffIds] = useState<null | { onlyA: string[]; onlyB: string[]; both: string[] }>(null);
  const [rrSim, setRrSim] = useState<{ A: number; B: number; picks: Array<'A'|'B'> } | null>(null);

  const loadDbHealth = useCallback(async () => {
    setDbHealthLoading(true);
    try {
      const [status, counts, recents, statuses, lat, exp] = await Promise.all([
        getDatabaseStatus(),
        getDatabaseCounts(),
        fetchRecentMemories(10),
        getStatusCounts(),
        measureDbLatency(),
        getExpiredPinnedCount()
      ]);

      setDbStatus(status);
      setDbCounts({ A: counts.A, B: counts.B });
      setStatusCounts(statuses);
      setLatency(lat);
      setExpiredPinned(exp);

      const enriched = await Promise.all(
        (recents || []).map(async (m) => {
          const loc = await locateMemory(m.id);
          return { ...m, location: loc };
        })
      );
      setRecentRoutes(enriched);

      // Compute recent IDs divergence (last 50 from each)
      const [a50, b50] = await Promise.all([
        primaryDB.from('memories').select('id, created_at').order('created_at', { ascending: false }).limit(50),
        secondaryDB.from('memories').select('id, created_at').order('created_at', { ascending: false }).limit(50)
      ]);
      const setA = new Set(((a50.data || []) as Array<{ id: string }>).map((r) => r.id));
      const setB = new Set(((b50.data || []) as Array<{ id: string }>).map((r) => r.id));
      const onlyA: string[] = [];
      const onlyB: string[] = [];
      const both: string[] = [];
      for (const id of setA) {
        if (setB.has(id)) both.push(id); else onlyA.push(id);
      }
      for (const id of setB) {
        if (!setA.has(id)) onlyB.push(id);
      }
      setDiffIds({ onlyA, onlyB, both });

      // Round-robin simulation (50 picks)
      const sim = simulateRoundRobin(50);
      setRrSim({ A: sim.A, B: sim.B, picks: sim.picks });
    } catch (err) {
      console.error('Error fetching DB health:', err);
    } finally {
      setDbHealthLoading(false);
    }
  }, []);

  // Check if there are any active pinned memories or announcements that need monitoring
  const hasActiveItems = useMemo(() => {
    const now = new Date();
    
    // Check for active pinned memories
    const hasActivePinnedMemories = memories.some(memory => 
      memory.pinned && 
      memory.pinned_until && 
      new Date(memory.pinned_until) > now
    );
    
    // Check for active announcement
    const hasActiveAnnouncement = currentAnnouncement && 
      new Date(currentAnnouncement.expires_at) > now;
    
    return hasActivePinnedMemories || hasActiveAnnouncement;
  }, [memories, currentAnnouncement]);

  // Update current time every second ONLY if there are active items
  useEffect(() => {
    if (!hasActiveItems) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [hasActiveItems]);

  // Memoized filtered memories for approved tab only
  const filteredMemories = useMemo(() => {
    if (selectedTab !== "approved") return memories;
    
    return memories.filter(memory => 
      memory.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (memory.sender && memory.sender.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [memories, searchTerm, selectedTab]);

  // Memoized displayed memories
  const displayedMemories = useMemo(() => {
    if (selectedTab !== "approved") return memories;
    return filteredMemories.slice(0, displayCount);
  }, [filteredMemories, displayCount, selectedTab, memories]);

  // Memoized hasMore calculation
  const hasMoreMemories = useMemo(() => {
    if (selectedTab !== "approved") return false;
    return filteredMemories.length > displayCount;
  }, [filteredMemories.length, displayCount, selectedTab]);

  // Reset display count when search changes or tab changes
  useEffect(() => {
    setDisplayCount(10);
  }, [searchTerm, selectedTab]);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 10);
      setLoading(false);
    }, 300);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Memoize refreshMemories to prevent infinite loops
  const refreshMemories = useCallback(() => {
    if (!isAuthorized) return;
    fetchMemories(
      { status: selectedTab },
      { pinned: "desc", created_at: "desc" }
    ).then(({ data }) => {
      setMemories(data || []);
    }).catch((error) => {
      console.error('Error fetching memories:', error);
    });
  }, [isAuthorized, selectedTab]);

  // Check authentication with API
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/admin/auth');
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthorized(true);
        } else {
          // Not authenticated - redirect to login
          window.location.href = '/admin/login';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/admin/login';
      } finally {
        setAuthChecked(true);
      }
    }
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      async function fetchMemoriesData() {
        try {
          const status = selectedTab === "pending" ? "pending" : selectedTab;
          const { data } = await fetchMemories(
            { status },
            { pinned: "desc", created_at: "desc" }
          );
          setMemories(data || []);
        } catch (error) {
          console.error('Error fetching memories:', error);
        }
      }
      fetchMemoriesData();
    }
  }, [isAuthorized, selectedTab]);

  // Fetch DB health when DB Health tab is active
  useEffect(() => {
    if (!isAuthorized || selectedTab !== 'dbhealth') return;
    loadDbHealth();
  }, [isAuthorized, selectedTab, loadDbHealth]);

  useEffect(() => {
    fetchCurrentAnnouncement();
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("maintenance")
        .select("is_active, message")
        .eq("id", 1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching maintenance status:", error);
        return;
      }

      if (data) {
        setMaintenanceMode(data.is_active);
        setMaintenanceMessage(data.message || "");
      }
    } catch (err) {
      console.error("Unexpected error fetching maintenance status:", err);
    }
  };

  const fetchCurrentAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("id, message, expires_at, link_url, background_color, text_color, icon, title, is_dismissible, view_count, click_count")
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
          // Delete expired announcement
          await primaryDB
            .from("announcements")
            .delete()
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

    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: announcement,
          is_active: true,
          expires_at: expiresAt.toISOString(),
          link_url: announcementLink.trim() || null,
          background_color: announcementBgColor,
          text_color: announcementTextColor,
          icon: announcementIcon.trim() || null,
          title: announcementTitle.trim() || null,
          is_dismissible: announcementIsDismissible
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        console.error("Error creating announcement:", result.error);
      } else if (result.data) {
      setAnnouncement("");
      setAnnouncementLink("");
      setAnnouncementBgColor("#ef4444");
      setAnnouncementTextColor("#ffffff");
      setAnnouncementIcon("📢");
      setAnnouncementTitle("Announcement");
      setAnnouncementIsDismissible(false);
      setAnnouncementTimer({ days: "", hours: "", minutes: "", seconds: "" });
      setCurrentAnnouncement(result.data);
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleRemoveAnnouncement = async () => {
    if (!currentAnnouncement) return;
    
    try {
      const response = await fetch(`/api/admin/announcements?id=${currentAnnouncement.id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        console.error("Error removing announcement:", result.error);
      } else {
        setCurrentAnnouncement(null);
      }
    } catch (error) {
      console.error("Error removing announcement:", error);
    }
  };

  const toggleMaintenanceMode = async () => {
    if (!confirm('Are you sure you want to toggle maintenance mode?')) {
      return;
    }

    try {
      if (maintenanceMode) {
        // Disable maintenance mode
        const response = await fetch('/api/admin/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: 1, is_active: false, message: "" })
        });
        
        const result = await response.json();
        
        if (!response.ok || result.error) {
          console.error("Error disabling maintenance mode:", result.error);
        } else {
          setMaintenanceMode(false);
          setMaintenanceMessage("");
        }
      } else {
        // Enable maintenance mode
        const message = prompt("Enter maintenance message (optional):") || "Site is under maintenance. Please check back later.";
        
        const response = await fetch('/api/admin/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: 1,
            is_active: true,
            message: message,
            updated_at: new Date().toISOString()
          })
        });
        
        const result = await response.json();
        
        if (!response.ok || result.error) {
          console.error("Error enabling maintenance mode:", result.error);
        } else {
          setMaintenanceMode(true);
          setMaintenanceMessage(message);
        }
      }
    } catch (err) {
      console.error("Unexpected error toggling maintenance mode:", err);
    }
  };

  async function updateMemoryStatus(id: string, newStatus: string) {
    try {
      const response = await fetch('/api/admin/update-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { status: newStatus } })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        console.error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
    refreshMemories();
  }

  async function deleteMemoryById(id: string) {
    if (!confirm('Are you sure you want to delete this memory? This cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch('/api/admin/delete-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        console.error(result.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
    refreshMemories();
  }

  async function banMemory(memory: Memory) {
    if (!confirm(`Are you sure you want to ban this user and delete their memory? This cannot be undone.\n\nIP: ${memory.ip || 'N/A'}\nUUID: ${memory.uuid || 'N/A'}`)) {
      return;
    }
    // First delete the memory
    try {
      const response = await fetch('/api/admin/delete-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: memory.id })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        console.error("Error deleting memory:", result.error);
        return;
      }
    } catch (error) {
      console.error("Error deleting memory:", error);
      return;
    }

    // Ban IP and UUID if available
    const banEntry: { ip?: string; uuid?: string; country?: string } = {};
    if (memory.ip) banEntry.ip = memory.ip;
    if (memory.uuid) banEntry.uuid = memory.uuid;
    if (memory.country) banEntry.country = memory.country;
    if (banEntry.ip || banEntry.uuid) {
      try {
        const response = await fetch('/api/admin/ban', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(banEntry)
        });
        const result = await response.json();
        if (!response.ok || result.error) {
          console.error("Error banning user:", result.error);
        }
      } catch (error) {
        console.error("Error banning user:", error);
      }
    }
    
    setSelectedTab("pending");
    refreshMemories();
  }

  async function unbanMemory(memory: Memory) {
    if (!confirm(`Are you sure you want to unban this user?\n\nIP: ${memory.ip || 'N/A'}\nUUID: ${memory.uuid || 'N/A'}`)) {
      return;
    }
    // Unban by IP and UUID
    try {
      const params = new URLSearchParams();
      if (memory.ip) params.append('ip', memory.ip);
      if (memory.uuid) params.append('uuid', memory.uuid);
      
      await fetch(`/api/admin/ban?${params.toString()}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error unbanning:", error);
    }
    setSelectedTab("banned");
    refreshMemories();
  }

  async function togglePin(memory: Memory) {
    if (memory.pinned) {
      // If already pinned, just unpin it
      try {
        const response = await fetch('/api/admin/update-memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: memory.id, updates: { pinned: false, pinned_until: null } })
        });
        const result = await response.json();
        if (!response.ok || result.error) {
          console.error(result.error);
        }
      } catch (error) {
        console.error(error);
      }
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

    try {
      const response = await fetch('/api/admin/update-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: memory.id, updates: { pinned: true, pinned_until: pinnedUntil.toISOString() } })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
    refreshMemories();
  }

  // Add interval for checking expired items ONLY when there are active items
  useEffect(() => {
    if (!hasActiveItems) return;

    const checkExpiredItems = async () => {
      // Check expired announcements
      if (currentAnnouncement) {
        const expiry = new Date(currentAnnouncement.expires_at);
        if (currentTime >= expiry) {
          await primaryDB
            .from("announcements")
            .delete()
            .eq("id", currentAnnouncement.id);
          setCurrentAnnouncement(null);
          await fetchCurrentAnnouncement(); // Refresh announcement state
        }
      }

      // Check expired pins across both databases
      const { data: allMemories } = await fetchMemories({ pinned: "true" });
      const pinnedMemories = allMemories.filter(m => m.pinned_until);

      let needsRefresh = false;
      for (const memory of pinnedMemories || []) {
        if (memory.pinned_until && new Date(memory.pinned_until) <= currentTime) {
          await fetch('/api/admin/update-memory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: memory.id, updates: { pinned: false, pinned_until: null } })
          });
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
  }, [currentTime, hasActiveItems, selectedTab, refreshMemories, currentAnnouncement]);

  // Fetch banned users when banned tab is selected
  useEffect(() => {
    if (selectedTab === "banned") {
      primaryDB
        .from("banned_users")
        .select("ip, uuid, country")
        .then(({ data, error }) => {
          if (error) console.error(error.message || error);
          else setBannedUsers(data || []);
        });
    }
  }, [selectedTab]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader text="Authenticating..." />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
            <ul className="flex gap-6 items-center">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 border-b border-[var(--border)]">
          {(["pending", "approved", "banned"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setSelectedTab(tab); setAnnounceMenuOpen(false); }}
              className={`py-2 px-1 sm:px-2 md:px-3 text-xs font-semibold whitespace-nowrap ${
                selectedTab === tab
                  ? "border-b-2 border-blue-600 text-gray-900"
                  : "text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <div className="relative">
            <button
              onClick={() => setAnnounceMenuOpen((v) => !v)}
              className={`py-2 px-1 sm:px-2 md:px-3 text-xs font-semibold whitespace-nowrap ${
                ["announcements", "maintenance", "unlimited", "dbhealth"].includes(selectedTab)
                  ? "border-b-2 border-blue-600 text-gray-900"
                  : "text-gray-600"
              }`}
            >
              {({announcements:"Announcements",maintenance:"Maintenance",unlimited:"Unlimited Users",dbhealth:"DB Health"} as Record<string,string>)[selectedTab] ?? "Menu"} ▾
            </button>
            {announceMenuOpen && (
              <div className="absolute z-20 mt-2 w-56 max-w-[calc(100vw-1rem)] right-0 bg-white border border-gray-200 rounded shadow-md overflow-x-auto">
                <button
                  onClick={() => { setSelectedTab("announcements"); setAnnounceMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedTab === 'announcements' ? 'font-semibold' : ''}`}
                >
                  Announcements
                </button>
                <button
                  onClick={() => { setSelectedTab("maintenance"); setAnnounceMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedTab === 'maintenance' ? 'font-semibold' : ''}`}
                >
                  Maintenance
                </button>
                <button
                  onClick={() => { setSelectedTab("unlimited"); setAnnounceMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedTab === 'unlimited' ? 'font-semibold' : ''}`}
                >
                  Unlimited Users
                </button>
                <button
                  onClick={() => { setSelectedTab("dbhealth"); setAnnounceMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedTab === 'dbhealth' ? 'font-semibold' : ''}`}
                >
                  DB Health
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {selectedTab === "unlimited" ? (
          <UnlimitedUsersPage />
        ) : selectedTab === "announcements" ? (
          <div className="bg-[var(--card-bg)] p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
              <span className="text-lg sm:text-xl md:text-2xl">{currentAnnouncement?.icon || '📢'}</span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)]">{currentAnnouncement?.title || 'Announcements'}</h2>
            </div>
            {currentAnnouncement ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-[var(--bg)] p-3 sm:p-4 md:p-6 rounded-lg border border-[var(--border)]">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div 
                        className="p-4 rounded-lg shadow-inner"
                        style={{
                          backgroundColor: currentAnnouncement.background_color || '#ef4444',
                          color: currentAnnouncement.text_color || '#ffffff'
                        }}
                      >
                        <p className="font-bold text-lg">
                          <span>{currentAnnouncement.icon || '📢'}</span>
                          <span className="ml-2">{currentAnnouncement.message}</span>
                        </p>
                      </div>
                      {currentAnnouncement.link_url && (
                        <p className="text-xs sm:text-sm text-gray-500 break-all">
                          <strong>Link:</strong> <a href={currentAnnouncement.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{currentAnnouncement.link_url}</a>
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-gray-500">
                        <strong>Expires in:</strong> {formatRemainingTime(currentAnnouncement.expires_at)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        <strong>Dismissible:</strong> <span className={`font-semibold ${currentAnnouncement.is_dismissible ? 'text-green-600' : 'text-red-600'}`}>{currentAnnouncement.is_dismissible ? 'Yes' : 'No'}</span>
                      </p>

                      {/* Analytics Section */}
                      <div className="mt-4 pt-4 border-t border-[var(--border)]">
                        <h4 className="text-sm font-semibold text-[var(--text)] mb-2">Analytics</h4>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-lg font-bold text-gray-800">{currentAnnouncement.view_count ?? 0}</p>
                            <p className="text-xs text-gray-500">Views</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-800">{currentAnnouncement.click_count ?? 0}</p>
                            <p className="text-xs text-gray-500">Clicks</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-800">
                              {currentAnnouncement.view_count && currentAnnouncement.view_count > 0 
                                ? `${((currentAnnouncement.click_count ?? 0) / currentAnnouncement.view_count * 100).toFixed(1)}%`
                                : '0%'}
                            </p>
                            <p className="text-xs text-gray-500">CTR</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2 self-start">
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
              <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
                {/* Live Preview */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--text)] mb-2">Live Preview</h3>
                  <div 
                    className="p-4 rounded-lg shadow-md text-center relative"
                    style={{
                      backgroundColor: announcementBgColor || '#ef4444',
                      color: announcementTextColor || '#ffffff'
                    }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                      <span>{announcementIcon || '📢'}</span>
                      <span className="ml-2">{announcement || "Your announcement message..."}</span>
                    </h2>
                    {announcementIsDismissible && (
                      <button type="button" className="absolute top-2 right-2 text-lg opacity-70 hover:opacity-100 transition-opacity">&times;</button>
                    )}
                  </div>
                </div>

                {/* Form Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Content & Styling */}
                  <div className="space-y-4">
                    {/* Content Section */}
                    <fieldset className="border border-[var(--border)] p-4 rounded-lg">
                      <legend className="text-md font-semibold text-[var(--text)] px-2">Content</legend>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="announcementIcon" className="block text-[var(--text)] mb-2 font-medium text-sm">Icon</label>
                            <input id="announcementIcon" type="text" value={announcementIcon} onChange={(e) => setAnnouncementIcon(e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500" placeholder="📢" />
                          </div>
                          <div>
                            <label htmlFor="announcementTitle" className="block text-[var(--text)] mb-2 font-medium text-sm">Admin Title</label>
                            <input id="announcementTitle" type="text" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500" placeholder="Announcement" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="announcement" className="block text-[var(--text)] mb-2 font-medium text-sm">Message</label>
                          <textarea id="announcement" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Type your announcement here..." required />
                        </div>
                        <div>
                          <label htmlFor="announcementLink" className="block text-[var(--text)] mb-2 font-medium text-sm">Link URL (Optional)</label>
                          <input id="announcementLink" type="url" value={announcementLink} onChange={(e) => setAnnouncementLink(e.target.value)} className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500" placeholder="https://example.com" />
                        </div>
                      </div>
                    </fieldset>

                    {/* Styling Section */}
                    <fieldset className="border border-[var(--border)] p-4 rounded-lg">
                      <legend className="text-md font-semibold text-[var(--text)] px-2">Styling</legend>
                      <div className="flex items-center gap-6">
                        <div>
                          <label htmlFor="announcementBgColor" className="block text-[var(--text)] mb-2 font-medium text-sm">Background</label>
                          <input id="announcementBgColor" type="color" value={announcementBgColor} onChange={(e) => setAnnouncementBgColor(e.target.value)} className="w-16 h-10 p-1 border border-[var(--border)] rounded-lg bg-transparent cursor-pointer" />
                        </div>
                        <div>
                          <label htmlFor="announcementTextColor" className="block text-[var(--text)] mb-2 font-medium text-sm">Text</label>
                          <input id="announcementTextColor" type="color" value={announcementTextColor} onChange={(e) => setAnnouncementTextColor(e.target.value)} className="w-16 h-10 p-1 border border-[var(--border)] rounded-lg bg-transparent cursor-pointer" />
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  {/* Right Column: Settings */}
                  <div className="space-y-4">
                    <fieldset className="border border-[var(--border)] p-4 rounded-lg">
                      <legend className="text-md font-semibold text-[var(--text)] px-2">Settings</legend>
                      <div className="space-y-4">
                        {/* Dismissible Toggle */}
                        <div>
                          <label htmlFor="isDismissible" className="flex items-center justify-between cursor-pointer">
                            <span className="font-medium text-sm text-[var(--text)]">Allow users to dismiss</span>
                            <div className="relative">
                              <input id="isDismissible" type="checkbox" checked={announcementIsDismissible} onChange={(e) => setAnnouncementIsDismissible(e.target.checked)} className="sr-only" />
                              <div className={`block w-12 h-6 rounded-full transition-colors ${announcementIsDismissible ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${announcementIsDismissible ? 'transform translate-x-6' : ''}`}></div>
                            </div>
                          </label>
                        </div>
                        <hr className="border-[var(--border)]" />
                        {/* Timer */}
                        <div>
                          <label className="block text-sm font-medium text-[var(--text)] mb-2">Duration</label>
                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Days</label>
                              <input type="number" value={announcementTimer.days} onChange={(e) => setAnnouncementTimer(prev => ({ ...prev, days: e.target.value }))} min="0" className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500" placeholder="0" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Hours</label>
                              <input type="number" value={announcementTimer.hours} onChange={(e) => setAnnouncementTimer(prev => ({ ...prev, hours: e.target.value }))} min="0" max="23" className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500" placeholder="0" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Mins</label>
                              <input type="number" value={announcementTimer.minutes} onChange={(e) => setAnnouncementTimer(prev => ({ ...prev, minutes: e.target.value }))} min="0" max="59" className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500" placeholder="0" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Secs</label>
                              <input type="number" value={announcementTimer.seconds} onChange={(e) => setAnnouncementTimer(prev => ({ ...prev, seconds: e.target.value }))} min="0" max="59" className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-blue-500" placeholder="0" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold text-base whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!announcement.trim() || calculateTotalSeconds(announcementTimer) <= 0}
                  >
                    <span>{currentAnnouncement ? 'Update Announcement' : 'Post Announcement'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : selectedTab === "maintenance" ? (
          <div className="bg-[var(--card-bg)] p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
              <span className="text-lg sm:text-xl md:text-2xl">🔧</span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)]">Maintenance Mode</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-[var(--bg)] p-3 sm:p-4 md:p-6 rounded-lg border border-[var(--border)]">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base md:text-lg text-[var(--text)] mb-2">
                      Current Status: <span className={`font-semibold ${maintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
                        {maintenanceMode ? 'MAINTENANCE MODE ACTIVE' : 'SITE OPERATIONAL'}
                      </span>
                    </p>
                    {maintenanceMode && maintenanceMessage && (
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        Message: &ldquo;{maintenanceMessage}&rdquo;
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500">
                      When maintenance mode is active, all users will see a maintenance page instead of the normal site.
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <button
                      onClick={toggleMaintenanceMode}
                      className={`px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap ${
                        maintenanceMode 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      <span>{maintenanceMode ? '🔓' : '🔒'}</span>
                      <span>{maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedTab === "dbhealth" ? (
          <div className="bg-[var(--card-bg)] p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
              <span className="text-lg sm:text-xl md:text-2xl">🗄️</span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)]">Database Health</h2>
              <button
                onClick={loadDbHealth}
                className="ml-auto px-3 py-1.5 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
                title="Refresh"
              >
                Refresh
              </button>
            </div>
            {dbHealthLoading ? (
              <div className="py-6"><Loader text="Checking databases..." /></div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                    <h3 className="font-semibold mb-2">Status</h3>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${dbStatus?.databaseA ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        Database A {dbStatus?.databaseA ? '(OK)' : '(Down)'}
                      </li>
                      <li>
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${dbStatus?.databaseB ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        Database B {dbStatus?.databaseB ? '(OK)' : '(Down)'}
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                    <h3 className="font-semibold mb-2">Totals</h3>
                    <div className="text-sm space-y-1">
                      <div>Total A: <span className="font-mono">{dbCounts?.A ?? '—'}</span></div>
                      <div>Total B: <span className="font-mono">{dbCounts?.B ?? '—'}</span></div>
                      <div>Diff: <span className="font-mono">{typeof dbCounts?.A === 'number' && typeof dbCounts?.B === 'number' ? Math.abs((dbCounts?.A||0) - (dbCounts?.B||0)) : '—'}</span></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                    <h3 className="font-semibold mb-2">Status Counts</h3>
                    <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="font-semibold">DB A</div><div className="font-semibold">DB B</div>
                      <div>Pending: {statusCounts?.A.pending ?? '—'}</div><div>Pending: {statusCounts?.B.pending ?? '—'}</div>
                      <div>Approved: {statusCounts?.A.approved ?? '—'}</div><div>Approved: {statusCounts?.B.approved ?? '—'}</div>
                      <div>Banned: {statusCounts?.A.banned ?? '—'}</div><div>Banned: {statusCounts?.B.banned ?? '—'}</div>
                    </div>
                  </div>
                  <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                    <h3 className="font-semibold mb-2">Latency (ms)</h3>
                    <div className="text-sm space-y-1">
                      <div>A: <span className="font-mono">{latency?.A?.toFixed?.(0) ?? '—'}</span></div>
                      <div>B: <span className="font-mono">{latency?.B?.toFixed?.(0) ?? '—'}</span></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Expired Pins</h3>
                    <span className="text-sm text-gray-600">(total: {expiredPinned?.total ?? '—'})</span>
                    <button
                      onClick={async () => { if (confirm('Unpin all expired memories now?')) { await unpinExpiredMemories(); await loadDbHealth(); } }}
                      className="ml-auto px-3 py-1.5 rounded bg-amber-500 text-white text-sm hover:bg-amber-600"
                    >
                      Unpin expired now
                    </button>
                  </div>
                  <div className="text-sm mt-2">A: {expiredPinned?.A ?? '—'} • B: {expiredPinned?.B ?? '—'}</div>
                </div>
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                  <h3 className="font-semibold mb-2">Recent ID Divergence (last 50 each)</h3>
                  <div className="text-sm">
                    <div>Only A: {diffIds?.onlyA.length ?? 0} • Only B: {diffIds?.onlyB.length ?? 0} • Both: {diffIds?.both.length ?? 0}</div>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <div className="font-semibold">Sample Only A</div>
                        <div className="font-mono break-all">{(diffIds?.onlyA || []).slice(0,5).join(', ') || '—'}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Sample Only B</div>
                        <div className="font-mono break-all">{(diffIds?.onlyB || []).slice(0,5).join(', ') || '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                  <h3 className="font-semibold mb-2">Round‑Robin Simulation (50 picks)</h3>
                  <div className="text-sm">A: {rrSim?.A ?? '—'} • B: {rrSim?.B ?? '—'}</div>
                </div>
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                  <h3 className="font-semibold mb-3">Last 10 Memories Routing</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className="py-2 pr-4">ID</th>
                          <th className="py-2 pr-4">Created At</th>
                          <th className="py-2">Located In</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentRoutes.map((r) => (
                          <tr key={r.id} className="border-t border-[var(--border)]">
                            <td className="py-2 pr-4 font-mono break-all">{r.id}</td>
                            <td className="py-2 pr-4">{new Date(r.created_at).toLocaleString()}</td>
                            <td className="py-2">
                              {r.location === 'A' && <span className="text-green-600">Database A</span>}
                              {r.location === 'B' && <span className="text-blue-600">Database B</span>}
                              {r.location === 'Both' && <span className="text-amber-600">Both</span>}
                              {r.location === 'Unknown' && <span className="text-gray-500">Unknown</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {selectedTab === "approved" && (
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search by recipient, message, or sender..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full p-3 sm:p-3.5 text-base sm:text-lg border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] bg-white shadow-sm transition-all duration-200"
                  autoComplete="off"
                  inputMode="search"
                />
              </div>
            )}
            {displayedMemories.length > 0 ? (
              <>
                {selectedTab === "approved" && (
                  <div className="mb-4 text-sm text-[var(--text)] opacity-75">
                    {searchTerm ? (
                      <span>Showing {displayedMemories.length} of {filteredMemories.length} search results</span>
                    ) : (
                      <span>Showing {displayedMemories.length} of {memories.length} memories</span>
                    )}
                  </div>
                )}
                {displayedMemories.map((memory) => (
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
                    <div className="mt-3 text-sm text-gray-500 break-words space-y-0.5">
                      <p className="flex items-center gap-1 cursor-pointer" onClick={() => memory.ip && navigator.clipboard.writeText(memory.ip)} title="Click to copy IP">
                        IP: <span className="underline decoration-dotted">{memory.ip || '-'}</span>
                      </p>
                      <p className="flex items-center gap-1 cursor-pointer" onClick={() => memory.uuid && navigator.clipboard.writeText(memory.uuid)} title="Click to copy UUID">
                        UUID: <span className="underline decoration-dotted break-all">{memory.uuid || '-'}</span>
                      </p>
                      <p>Country: {memory.country || '-'}</p>
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
                            onClick={() => deleteMemoryById(memory.id)}
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
                            onClick={() => deleteMemoryById(memory.id)}
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
                            onClick={() => deleteMemoryById(memory.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {selectedTab === "approved" && hasMoreMemories && (
                  <div className="text-center mt-6">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-6 py-3 bg-[#f8f6f1] text-[#6b5b47] border border-[#d4c4a8] rounded-lg hover:bg-[#f0ede4] hover:border-[#c4b498] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium tracking-wide"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#6b5b47]/20 border-t-[#6b5b47] rounded-full animate-spin"></div>
                          Loading...
                        </div>
                      ) : "Load More"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-700">
                {selectedTab === "approved" && searchTerm ? "No memories found matching your search." : `No ${selectedTab} memories found.`}
              </p>
            )}
          </>
        )}
        {selectedTab === "banned" && bannedUsers.length > 0 && (
          <div className="bg-white/90 shadow rounded-lg p-6 border-l-4 border-red-600 w-full mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Banned Users</h3>
            <ul className="divide-y divide-gray-200">
              {bannedUsers.map((user, idx) => (
                <li key={user.ip || user.uuid || idx} className="py-3 flex items-center justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    {user.ip && (
                      <span className="inline-block bg-red-100 text-red-700 text-xs font-mono px-2 py-1 rounded mr-2 border border-red-300">
                        IP: {user.ip}
                      </span>
                    )}
                    {user.uuid && (
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-mono px-2 py-1 rounded border border-blue-300">
                        UUID: {user.uuid}
                      </span>
                    )}
                    {user.country && (
                      <span className="ml-2 text-gray-500 text-xs">({user.country})</span>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      if (!confirm(`Unban this user?\n\nIP: ${user.ip || 'N/A'}\nUUID: ${user.uuid || 'N/A'}`)) {
                        return;
                      }
                      const params = new URLSearchParams();
                      if (user.ip) params.append('ip', user.ip);
                      if (user.uuid) params.append('uuid', user.uuid);
                      
                      await fetch(`/api/admin/ban?${params.toString()}`, {
                        method: 'DELETE'
                      });
                      setBannedUsers((prev) => prev.filter((b) => b !== user));
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
