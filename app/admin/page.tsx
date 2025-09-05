"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { fetchMemories, updateMemory, deleteMemory, primaryDB, getDatabaseUsageStats, getRoundRobinStats } from "@/lib/dualMemoryDB";
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

type Tab = "pending" | "approved" | "banned" | "announcements" | "maintenance" | "whitelist";

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
  const [bannedUsers, setBannedUsers] = useState<{ ip?: string; uuid?: string; country?: string }[]>([]);
  const [whitelistedIPs, setWhitelistedIPs] = useState<{ id: string; ip: string; limit: number; created_at: string; notes?: string }[]>([]);
  const [newWhitelistIP, setNewWhitelistIP] = useState("");
  const [newWhitelistLimit, setNewWhitelistLimit] = useState(4);
  const [newWhitelistNotes, setNewWhitelistNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [dbStats, setDbStats] = useState<any>(null);
  const [memoryCounts, setMemoryCounts] = useState<{ [ip: string]: { count: number; limit: number; isWhitelisted: boolean } }>({});

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

  // Check for admin secret from query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secret = params.get("secret");
    const ADMIN_SECRET = "K9mP2vL8xQ";
    
    // Debug logging
    console.log("Admin secret check:", { 
      secret, 
      ADMIN_SECRET, 
      matches: secret === ADMIN_SECRET,
      url: window.location.href,
      search: window.location.search
    });
    
    setIsAuthorized(secret === ADMIN_SECRET);
    setAuthChecked(true);
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
          // Delete expired announcement
          await supabase
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

    // Delete all announcements
    await supabase
      .from("announcements")
      .delete();

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
    if (!currentAnnouncement) return;
    
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", currentAnnouncement.id);

    if (error) {
      console.error("Error removing announcement:", error);
    } else {
      setCurrentAnnouncement(null);
    }
  };

  const toggleMaintenanceMode = async () => {
    const password = prompt("Please enter the maintenance password:");
    if (password !== "2000@") {
      alert("Incorrect password. Maintenance mode toggle aborted.");
      return;
    }

    try {
      if (maintenanceMode) {
        // Disable maintenance mode
        const { error } = await supabase
          .from("maintenance")
          .update({ is_active: false, message: "" })
          .eq("id", 1);

        if (error) {
          console.error("Error disabling maintenance mode:", error);
        } else {
          setMaintenanceMode(false);
          setMaintenanceMessage("");
        }
      } else {
        // Enable maintenance mode
        const message = prompt("Enter maintenance message (optional):") || "Site is under maintenance. Please check back later.";
        
        const { error } = await supabase
          .from("maintenance")
          .upsert({ 
            id: 1, 
            is_active: true, 
            message: message,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error("Error enabling maintenance mode:", error);
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
    const { error } = await updateMemory(id, { status: newStatus });
    if (error) console.error(error.message || error);
    refreshMemories();
  }

  async function deleteMemoryById(id: string) {
    const password = prompt("Please enter the delete password:");
    if (password !== "2000@") {
      alert("Incorrect password. Delete aborted.");
      return;
    }
    const { error } = await deleteMemory(id);
    if (error) console.error(error.message || error);
    refreshMemories();
  }

  async function banMemory(memory: Memory) {
    const password = prompt("Please enter the ban password:");
    if (password !== "2000@") {
      alert("Incorrect password. Ban aborted.");
      return;
    }
    // First delete the memory
    const { error: deleteError } = await deleteMemory(memory.id);
    
    if (deleteError) {
      console.error("Error deleting memory:", deleteError);
      return;
    }

    // Ban IP and UUID if available
    const banEntry: { ip?: string; uuid?: string; country?: string } = {};
    if (memory.ip) banEntry.ip = memory.ip;
    if (memory.uuid) banEntry.uuid = memory.uuid;
    if (memory.country) banEntry.country = memory.country;
    if (banEntry.ip || banEntry.uuid) {
      const { error: banError } = await primaryDB
        .from("banned_users")
        .insert([banEntry]);
      if (banError) {
        console.error("Error banning user:", banError);
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
    // Unban by IP and UUID
    if (memory.ip) {
      await supabase.from("banned_users").delete().eq("ip", memory.ip);
    }
    if (memory.uuid) {
      await supabase.from("banned_users").delete().eq("uuid", memory.uuid);
    }
    setSelectedTab("banned");
    refreshMemories();
  }

  async function togglePin(memory: Memory) {
    if (memory.pinned) {
      // If already pinned, just unpin it
      const { error } = await updateMemory(memory.id, { 
        pinned: false,
        pinned_until: undefined
      });
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

    const { error } = await updateMemory(memory.id, { 
      pinned: true,
      pinned_until: pinnedUntil.toISOString()
    });
    if (error) console.error(error);
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
          await supabase
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
          await updateMemory(memory.id, { pinned: false, pinned_until: undefined });
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

  // Fetch whitelisted IPs when whitelist tab is selected
  useEffect(() => {
    if (selectedTab === "whitelist") {
      loadWhitelistedIPs();
    }
  }, [selectedTab]);

  const loadWhitelistedIPs = async () => {
    try {
      // Always use primary database for whitelist operations
      const { data, error } = await primaryDB
        .from("ip_whitelist")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error loading whitelisted IPs:", error);
        // If table doesn't exist, show empty state
        if (error.code === "PGRST116" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
          console.log("Whitelist table doesn't exist yet. Please create it first.");
          setWhitelistedIPs([]);
        } else {
          // Other errors - still show empty state but log the error
          setWhitelistedIPs([]);
        }
      } else {
        setWhitelistedIPs(data || []);
        // Load memory counts for all IPs that have submitted memories
        loadAllMemoryCounts();
      }
    } catch (error) {
      console.error("Error loading whitelisted IPs:", error);
      setWhitelistedIPs([]);
    }
  };

  const loadMemoryCountsForIPs = async (ips: string[]) => {
    try {
      const counts: { [ip: string]: { count: number; limit: number; isWhitelisted: boolean } } = {};
      
      for (const ip of ips) {
        // Get whitelist info
        const { data: whitelistData } = await primaryDB
          .from("ip_whitelist")
          .select('"limit"')
          .eq("ip", ip)
          .single();
        
        const limit = whitelistData?.limit || 2;
        const isWhitelisted = !!whitelistData;
        
        // Get memory count from both databases
        const [dbACount, dbBCount] = await Promise.all([
          primaryDB
            .from("memories")
            .select("id", { count: "exact", head: true })
            .eq("ip", ip),
          primaryDB
            .from("memories_b")
            .select("id", { count: "exact", head: true })
            .eq("ip", ip)
        ]);
        
        const totalCount = (dbACount.count || 0) + (dbBCount.count || 0);
        
        counts[ip] = {
          count: totalCount,
          limit,
          isWhitelisted
        };
      }
      
      setMemoryCounts(counts);
    } catch (error) {
      console.error("Error loading memory counts:", error);
    }
  };

  const loadAllMemoryCounts = async () => {
    try {
      // Get all unique IPs that have submitted memories from both databases
      const [dbAIPs, dbBIPs] = await Promise.all([
        primaryDB
          .from("memories")
          .select("ip")
          .not("ip", "is", null),
        primaryDB
          .from("memories_b")
          .select("ip")
          .not("ip", "is", null)
      ]);
      
      // Combine and get unique IPs
      const allIPs = [...(dbAIPs.data || []), ...(dbBIPs.data || [])]
        .map(item => item.ip)
        .filter((ip, index, self) => ip && self.indexOf(ip) === index);
      
      const counts: { [ip: string]: { count: number; limit: number; isWhitelisted: boolean } } = {};
      
      for (const ip of allIPs) {
        // Get whitelist info
        const { data: whitelistData } = await primaryDB
          .from("ip_whitelist")
          .select('"limit"')
          .eq("ip", ip)
          .single();
        
        const limit = whitelistData?.limit || 2;
        const isWhitelisted = !!whitelistData;
        
        // Get memory count from both databases
        const [dbACount, dbBCount] = await Promise.all([
          primaryDB
            .from("memories")
            .select("id", { count: "exact", head: true })
            .eq("ip", ip),
          primaryDB
            .from("memories_b")
            .select("id", { count: "exact", head: true })
            .eq("ip", ip)
        ]);
        
        const totalCount = (dbACount.count || 0) + (dbBCount.count || 0);
        
        counts[ip] = {
          count: totalCount,
          limit,
          isWhitelisted
        };
      }
      
      setMemoryCounts(counts);
    } catch (error) {
      console.error("Error loading all memory counts:", error);
    }
  };

  const loadDatabaseStats = async () => {
    try {
      const stats = await getDatabaseUsageStats();
      const roundRobinStats = getRoundRobinStats();
      setDbStats({ ...stats, roundRobin: roundRobinStats });
    } catch (error) {
      console.error("Error loading database stats:", error);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`${label} copied to clipboard!`);
    }
  };

  const addToWhitelist = async () => {
    if (!newWhitelistIP.trim()) {
      alert("Please enter an IP address");
      return;
    }

    const password = prompt("Please enter the whitelist password:");
    if (password !== "2000@") {
      alert("Incorrect password. Whitelist add aborted.");
      return;
    }

    try {
      // Always use primary database for whitelist operations
      const { error } = await primaryDB
        .from("ip_whitelist")
        .insert([{
          ip: newWhitelistIP.trim(),
          "limit": newWhitelistLimit, // Use quoted "limit" since it's a reserved keyword
          notes: newWhitelistNotes.trim() || null,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error("Error adding to whitelist:", error);
        
        // If table doesn't exist, provide helpful message
        if (error.code === "PGRST116" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
          alert("The whitelist table needs to be created first. Please create the table in your Supabase dashboard with the following structure:\n\nTable: ip_whitelist\nColumns:\n- id (uuid, primary key, default: gen_random_uuid())\n- ip (text, not null)\n- \"limit\" (integer, not null, default: 4)\n- notes (text, nullable)\n- created_at (timestamptz, default: now())");
        } else {
          alert("Error adding IP to whitelist. Please try again.");
        }
      } else {
        setNewWhitelistIP("");
        setNewWhitelistLimit(4);
        setNewWhitelistNotes("");
        loadWhitelistedIPs();
        alert("IP added to whitelist successfully!");
      }
    } catch (error) {
      console.error("Error adding to whitelist:", error);
      alert("Error adding IP to whitelist. Please try again.");
    }
  };

  const removeFromWhitelist = async (id: string) => {
    const password = prompt("Please enter the whitelist password:");
    if (password !== "2000@") {
      alert("Incorrect password. Whitelist removal aborted.");
      return;
    }

    try {
      // Always use primary database for whitelist operations
      const { error } = await primaryDB
        .from("ip_whitelist")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error removing from whitelist:", error);
        alert("Error removing IP from whitelist. Please try again.");
      } else {
        loadWhitelistedIPs();
        alert("IP removed from whitelist successfully!");
      }
    } catch (error) {
      console.error("Error removing from whitelist:", error);
      alert("Error removing IP from whitelist. Please try again.");
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader text="Authenticating..." />
      </div>
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
           {(["pending", "approved", "banned", "announcements", "maintenance", "whitelist"] as Tab[]).map((tab) => (
             <button
               key={tab}
               onClick={() => setSelectedTab(tab)}
               className={`py-2 px-1 sm:px-2 md:px-3 text-xs font-semibold whitespace-nowrap ${
                 selectedTab === tab
                   ? "border-b-2 border-blue-600 text-gray-900"
                   : "text-gray-600"
               }`}
             >
               <span className="hidden sm:inline">
                 {tab === "maintenance" ? "Maintenance" : 
                  tab === "announcements" ? "Announcements" :
                  tab === "whitelist" ? "Whitelist" :
                  tab.charAt(0).toUpperCase() + tab.slice(1)}
               </span>
               <span className="sm:hidden">
                 {tab === "maintenance" ? "Maint" : 
                  tab === "announcements" ? "Announce" :
                  tab === "whitelist" ? "White" :
                  tab === "approved" ? "Approve" :
                  tab === "pending" ? "Pending" :
                  tab === "banned" ? "Ban" :
                  tab.charAt(0).toUpperCase() + tab.slice(1)}
               </span>
             </button>
           ))}
         </div>
       </div>

      {/* Content */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
                 {selectedTab === "announcements" ? (
           <div className="bg-[var(--card-bg)] p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
             <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
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
                     <span>Post Announcement</span>
                   </button>
                </div>
              </form>
            )}
          </div>
                 ) : selectedTab === "maintenance" ? (
           <div className="bg-[var(--card-bg)] p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
             <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
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
                       <span>{maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}</span>
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
                 ) : selectedTab === "whitelist" ? (
           <div className="bg-[var(--card-bg)] p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
             <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
               <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--text)]">IP Whitelist</h2>
             </div>
            
            {/* Add new IP to whitelist */}
            <div className="bg-[var(--bg)] p-3 sm:p-4 md:p-6 rounded-lg border border-[var(--border)] mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text)] mb-3">Add IP to Whitelist</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">IP Address</label>
                  <input
                    type="text"
                    value={newWhitelistIP}
                    onChange={(e) => setNewWhitelistIP(e.target.value)}
                    placeholder="e.g., 192.168.1.100"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">Submission Limit</label>
                  <select
                    value={newWhitelistLimit}
                    onChange={(e) => setNewWhitelistLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={3}>3 memories</option>
                    <option value={4}>4 memories</option>
                    <option value={5}>5 memories</option>
                    <option value={6}>6 memories</option>
                    <option value={7}>7 memories</option>
                    <option value={8}>8 memories</option>
                    <option value={9}>9 memories</option>
                    <option value={10}>10 memories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">Notes (Optional)</label>
                  <input
                    type="text"
                    value={newWhitelistNotes}
                    onChange={(e) => setNewWhitelistNotes(e.target.value)}
                    placeholder="e.g., Trusted user, VIP member"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={addToWhitelist}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add to Whitelist
                </button>
              </div>
            </div>

                         {/* Whitelisted IPs list */}
             <div className="bg-[var(--bg)] p-3 sm:p-4 md:p-6 rounded-lg border border-[var(--border)]">
               <div className="flex items-center justify-between mb-3">
                 <h3 className="text-base sm:text-lg font-semibold text-[var(--text)]">Whitelisted IPs</h3>
                 <button
                   onClick={loadAllMemoryCounts}
                   className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                 >
                   Refresh Stats
                 </button>
               </div>
              {whitelistedIPs.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-2">No whitelisted IPs yet.</p>
                  <p className="text-xs text-gray-400">
                    If this is your first time, you may need to create the database table first.
                  </p>
                </div>
              ) : (
                                 <div className="space-y-2">
                   {whitelistedIPs.map((item) => {
                     const memoryInfo = memoryCounts[item.ip] || { count: 0, limit: item.limit, isWhitelisted: true };
                     return (
                       <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                             <span className="font-mono text-sm font-medium text-[var(--text)]">{item.ip}</span>
                             <button
                               onClick={() => copyToClipboard(item.ip, 'IP address')}
                               className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                               title="Copy IP address"
                             >
                               Copy
                             </button>
                             <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                               Limit: {item.limit} memories
                             </span>
                             <span className={`text-xs px-2 py-1 rounded ${
                               memoryInfo.count >= memoryInfo.limit 
                                 ? 'bg-red-100 text-red-800' 
                                 : 'bg-green-100 text-green-800'
                             }`}>
                               Used: {memoryInfo.count}/{memoryInfo.limit}
                             </span>
                           </div>
                           {item.notes && (
                             <p className="text-xs text-gray-600">{item.notes}</p>
                           )}
                           <p className="text-xs text-gray-500">
                             Added: {new Date(item.created_at).toLocaleDateString()}
                           </p>
                         </div>
                         <button
                           onClick={() => removeFromWhitelist(item.id)}
                           className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                         >
                           Remove
                         </button>
                       </div>
                     );
                   })}
                 </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {selectedTab === "approved" && (
              <>
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

                {/* Database Statistics */}
                <div className="mb-6 bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--text)]">Database Statistics</h3>
                    <button
                      onClick={loadDatabaseStats}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      Refresh Stats
                    </button>
                  </div>
                  
                  {dbStats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-[var(--bg)] p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Database A</div>
                        <div className="text-xl font-bold text-[var(--text)]">{dbStats.databaseA.count}</div>
                        <div className={`text-xs ${dbStats.databaseA.healthy ? 'text-green-600' : 'text-red-600'}`}>
                          {dbStats.databaseA.healthy ? 'Healthy' : 'Unhealthy'}
                        </div>
                      </div>
                      
                      <div className="bg-[var(--bg)] p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Database B</div>
                        <div className="text-xl font-bold text-[var(--text)]">{dbStats.databaseB.count}</div>
                        <div className={`text-xs ${dbStats.databaseB.healthy ? 'text-green-600' : 'text-red-600'}`}>
                          {dbStats.databaseB.healthy ? 'Healthy' : 'Unhealthy'}
                        </div>
                      </div>
                      
                      <div className="bg-[var(--bg)] p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Total Memories</div>
                        <div className="text-xl font-bold text-[var(--text)]">{dbStats.totalMemories}</div>
                        <div className="text-xs text-gray-500">Across both databases</div>
                      </div>
                      
                      <div className="bg-[var(--bg)] p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Round-Robin</div>
                        <div className="text-lg font-bold text-[var(--text)]">
                          {dbStats.roundRobin?.lastUsedDatabase || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {dbStats.roundRobin?.timeSinceLastUse ? 
                            `${Math.floor(dbStats.roundRobin.timeSinceLastUse / 1000)}s ago` : 
                            'Not used yet'
                          }
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <button
                        onClick={loadDatabaseStats}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Load Database Statistics
                      </button>
                    </div>
                  )}
                </div>
              </>
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
                         <span className="text-yellow-500 text-sm font-medium">PINNED</span>
                       )}
                     </div>
                    <p className="mt-3 text-gray-700 break-words whitespace-pre-wrap">{memory.message}</p>
                    {memory.sender && (
                      <p className="mt-3 italic text-lg text-gray-600 break-words">— {memory.sender}</p>
                    )}
                    <div className="mt-3 text-sm text-gray-500 break-words">
                      <div className="flex items-center gap-2">
                        <span>IP: {memory.ip}</span>
                                                 {memory.ip && (
                           <button
                             onClick={() => copyToClipboard(memory.ip!, 'IP address')}
                             className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                             title="Copy IP address"
                           >
                             Copy
                           </button>
                         )}
                      </div>
                      {memory.uuid && (
                        <div className="flex items-center gap-2">
                          <span>UUID: {memory.uuid}</span>
                                                     <button
                             onClick={() => copyToClipboard(memory.uuid!, 'UUID')}
                             className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                             title="Copy UUID"
                           >
                             Copy
                           </button>
                        </div>
                      )}
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
                      const password = prompt("Please enter the unban password:");
                      if (password !== "2000@") {
                        alert("Incorrect password. Unban aborted.");
                        return;
                      }
                      if (user.ip) {
                        await supabase.from("banned_users").delete().eq("ip", user.ip);
                      }
                      if (user.uuid) {
                        await supabase.from("banned_users").delete().eq("uuid", user.uuid);
                      }
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
          © {new Date().getFullYear()} — If Only I Sent This - Admin Panel
        </div>
      </footer>
    </div>
  );
}
