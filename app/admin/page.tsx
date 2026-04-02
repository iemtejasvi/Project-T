"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UnlimitedUsersPage from "./unlimited/page";
import { forceRefreshAllCaches } from "@/lib/enhancedCache";
import Loader from "@/components/Loader";
import type { Memory } from '@/types/memory';

// Utility: fetch with automatic timeout (prevents any admin action from hanging forever)
function timedFetch(url: string, opts: RequestInit = {}, ms = 12000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

type Tab = "pending" | "approved" | "banned" | "announcements" | "maintenance" | "dbhealth" | "unlimited";

// Lightweight toast notification system
function ToastContainer({ toasts, onDismiss }: { toasts: { id: number; message: string; type: 'success' | 'error' }[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(t => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium cursor-pointer animate-[slideIn_0.2s_ease-out] ${
            t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {t.type === 'success' ? '\u2713' : '\u2717'} {t.message}
        </div>
      ))}
    </div>
  );
}

export default function AdminPanel() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<Tab>("pending");
  const [announceMenuOpen, setAnnounceMenuOpen] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [memoriesTotalCount, setMemoriesTotalCount] = useState<number>(0);
  const [memoriesLoading, setMemoriesLoading] = useState(false);
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<Set<string>>(new Set());
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [stylesReady, setStylesReady] = useState(false);
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
  const searchTermRef = useRef("");
  const [displayCount, setDisplayCount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [adminPage, setAdminPage] = useState(0);
  const [adminTotalPages, setAdminTotalPages] = useState(0);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  // DB Health state
  const [dbHealthLoading, setDbHealthLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<null | { databaseA: boolean; healthy: boolean }>(null);
  const [dbCounts, setDbCounts] = useState<null | { count: number | null }>(null);
  const [recentMemories, setRecentMemories] = useState<Array<{ id: string; created_at: string }>>([]);
  const [statusCounts, setStatusCounts] = useState<null | Record<'pending' | 'approved' | 'banned', number | null>>(null);
  const [latency, setLatency] = useState<null | number>(null);
  const [expiredPinned, setExpiredPinned] = useState<null | { total: number }>(null);
  // Tab badge counts
  const [tabCounts, setTabCounts] = useState<Record<string, number | null>>({});
  // Toast notifications
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);
  const toastIdRef = useRef(0);
  // Inline editing
  const [editingMemory, setEditingMemory] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{ recipient: string; message: string; sender: string }>({ recipient: '', message: '', sender: '' });

  const loadDbHealth = useCallback(async () => {
    setDbHealthLoading(true);
    try {
      const res = await timedFetch('/api/admin/dbhealth', {
        credentials: 'include',
        cache: 'no-store',
      }, 15000);
      const json = await res.json();
      if (json.success) {
        setDbStatus(json.status);
        setDbCounts(json.counts);
        setStatusCounts(json.statusCounts);
        setLatency(json.latency);
        setExpiredPinned(json.expiredPinned);
        setRecentMemories(json.recent || []);
      }
    } catch (err) {
      console.error('Error fetching DB health:', err);
    } finally {
      setDbHealthLoading(false);
    }
  }, []);

  // Toast helper
  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch tab counts (lightweight — just counts, no data)
  const loadTabCounts = useCallback(async () => {
    try {
      const res = await timedFetch('/api/admin/dbhealth', {
        credentials: 'include',
        cache: 'no-store',
      }, 10000);
      const json = await res.json();
      if (json.success && json.statusCounts) {
        setTabCounts(json.statusCounts);
      }
    } catch { /* silent */ }
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

  // Server-side search: filteredMemories = memories (server already filtered)
  const filteredMemories = memories;

  // Display all server-returned results (already paginated to 50 per page)
  const displayedMemories = useMemo(() => {
    return filteredMemories.slice(0, displayCount);
  }, [filteredMemories, displayCount]);

  // Has more within current page fetch
  const hasMoreMemories = useMemo(() => {
    return filteredMemories.length > displayCount;
  }, [filteredMemories.length, displayCount]);

  const formatTimeUntilReveal = useCallback((memory: Memory): string | null => {
    const rawDelay = memory.time_capsule_delay_minutes;
    const delayMinutes = typeof rawDelay === 'number' ? rawDelay : (typeof rawDelay === 'string' ? Number(rawDelay) : 0);
    const hasExplicit = Number.isFinite(delayMinutes) && delayMinutes > 0;

    const revealAt = memory.reveal_at;
    if (!hasExplicit && (!revealAt || typeof revealAt !== 'string')) return null;
    if (!revealAt || typeof revealAt !== 'string') return null;

    const revealTs = new Date(revealAt).getTime();
    if (!Number.isFinite(revealTs)) return null;

    const now = Date.now();
    const remainingMs = revealTs - now;
    if (!Number.isFinite(remainingMs) || remainingMs <= 0) return null;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    const days = Math.floor(remainingMs / day);
    const hours = Math.floor((remainingMs % day) / hour);
    const mins = Math.floor((remainingMs % hour) / minute);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${Math.max(0, mins)}m`);

    return `Reveals in ${parts.join(' ')}`;
  }, []);

  // Reset display count, page, and clear search when tab changes
  useEffect(() => {
    setDisplayCount(50);
    setSelectedMemoryIds(new Set());
    setSearchTerm("");
    searchTermRef.current = "";
    setAdminPage(0);
  }, [selectedTab]);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 50);
      setLoading(false);
    }, 300);
  }, []);

  const [searchTrigger, setSearchTrigger] = useState(0);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    searchTermRef.current = val;
    // Debounce: trigger server-side search after 500ms of inactivity
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setAdminPage(0);
      setSearchTrigger(prev => prev + 1);
    }, 500);
  }, []);

  const broadcastContentUpdated = useCallback(() => {
    try {
      localStorage.setItem('last_content_update', Date.now().toString());
      localStorage.setItem('last_memory_update', Date.now().toString());
    } catch {
    }

    try {
      forceRefreshAllCaches();
      window.dispatchEvent(new CustomEvent('content-updated'));
      if (window.location.pathname === '/') {
        window.dispatchEvent(new CustomEvent('refresh-home-memories'));
      }
      if (window.location.pathname === '/memories') {
        window.dispatchEvent(new CustomEvent('refresh-archives'));
      }
    } catch {
    }

    // Refresh tab counts after mutation
    loadTabCounts();
  }, [loadTabCounts]);

  // Memoize refreshMemories to prevent infinite loops
  const refreshMemories = useCallback((page?: number) => {
    if (!isAuthorized) return;
    if (selectedTab !== 'pending' && selectedTab !== 'approved' && selectedTab !== 'banned') return;
    const status = selectedTab;
    const fetchPage = typeof page === 'number' ? page : adminPage;
    setMemoriesLoading(true);
    setMemories([]);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const searchQ = searchTermRef.current ? `&search=${encodeURIComponent(searchTermRef.current)}` : '';
    fetch(`/api/admin/memories?status=${encodeURIComponent(status)}&page=${fetchPage}&pageSize=50${searchQ}`, {
      credentials: 'include',
      cache: 'no-store',
      signal: ctrl.signal,
    })
      .then((r) => { clearTimeout(t); return r.json(); })
      .then((res) => {
        setMemories((res?.data || []) as Memory[]);
        setMemoriesTotalCount(Number(res?.totalCount || 0));
        setAdminTotalPages(Number(res?.totalPages || 0));
      })
      .catch((error) => {
        console.error('Error fetching memories:', error);
      })
      .finally(() => {
        setMemoriesLoading(false);
      });
  }, [isAuthorized, selectedTab, adminPage]);

  // Trigger server-side search when debounced search fires
  useEffect(() => {
    if (searchTrigger > 0) {
      refreshMemories(0);
    }
  }, [searchTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check authentication with API
  useEffect(() => {
    async function checkAuth() {
      try {
        const authCtrl = new AbortController();
        const authTimer = setTimeout(() => authCtrl.abort(), 10000);
        const response = await fetch('/api/admin/auth', {
          credentials: 'include',
          cache: 'no-store',
          signal: authCtrl.signal,
        });
        clearTimeout(authTimer);
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthorized(true);
          setAuthChecked(true);
          // If IP-based auth, auto-authenticated
          if (data.autoAuth) {
            // Auto-authenticated via IP
          }
        } else {
          // Not authenticated - redirect to login
          setAuthChecked(true);
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthChecked(true);
        router.push('/admin/login');
      }
    }
    
    checkAuth();
  }, [router]);

  // Fetch memories when authorized and tab changes
  useEffect(() => {
    if (isAuthorized) {
      refreshMemories();
    }
  }, [isAuthorized, selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let raf = 0;
    const start = Date.now();

    const check = () => {
      try {
        const cardBg = getComputedStyle(document.documentElement)
          .getPropertyValue('--card-bg')
          .trim();
        if (cardBg) {
          setStylesReady(true);
          return;
        }
      } catch {
      }

      if (Date.now() - start > 1500) {
        setStylesReady(true);
        try {
          const key = 'admin_fouc_reload_v1';
          const already = sessionStorage.getItem(key);
          if (!already) {
            sessionStorage.setItem(key, '1');
            window.location.reload();
            return;
          }
        } catch {
        }
        return;
      }

      raf = requestAnimationFrame(check);
    };

    raf = requestAnimationFrame(check);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Fetch DB health when DB Health tab is active
  useEffect(() => {
    if (!isAuthorized || selectedTab !== 'dbhealth') return;
    loadDbHealth();
  }, [isAuthorized, selectedTab, loadDbHealth]);

  useEffect(() => {
    fetchCurrentAnnouncement();
    fetchMaintenanceStatus();
  }, []);

  // Load tab counts when authorized, and refresh after mutations
  useEffect(() => {
    if (isAuthorized) loadTabCounts();
  }, [isAuthorized, loadTabCounts]);

  const fetchMaintenanceStatus = async () => {
    try {
      const res = await timedFetch('/api/admin/maintenance', {
        credentials: 'include',
        cache: 'no-store',
      });
      const json = await res.json();
      if (json.success && json.data) {
        setMaintenanceMode(json.data.is_active || false);
        setMaintenanceMessage(json.data.message || "");
      }
    } catch (err) {
      console.error("Error fetching maintenance status:", err);
    }
  };

  const fetchCurrentAnnouncement = async () => {
    try {
      const res = await timedFetch('/api/admin/announcements', {
        credentials: 'include',
        cache: 'no-store',
      });
      const json = await res.json();
      if (json.data) {
        // Check if announcement has expired
        if (new Date(json.data.expires_at) < new Date()) {
          await timedFetch('/api/admin/delete-announcement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: json.data.id }),
            credentials: 'include',
          });
          setCurrentAnnouncement(null);
        } else {
          setCurrentAnnouncement(json.data);
        }
      } else {
        setCurrentAnnouncement(null);
      }
    } catch (err) {
      console.error("Error fetching announcement:", err);
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
      const response = await timedFetch('/api/admin/announcements', {
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
      broadcastContentUpdated();
      refreshMemories();
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleRemoveAnnouncement = async () => {
    if (!currentAnnouncement) return;
    
    try {
      const response = await timedFetch(`/api/admin/announcements?id=${currentAnnouncement.id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        console.error("Error removing announcement:", result.error);
      } else {
        setCurrentAnnouncement(null);
        broadcastContentUpdated();
        refreshMemories();
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
        const response = await timedFetch('/api/admin/maintenance', {
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
          broadcastContentUpdated();
        }
      } else {
        // Enable maintenance mode
        const message = prompt("Enter maintenance message (optional):") || "Site is under maintenance. Please check back later.";
        
        const response = await timedFetch('/api/admin/maintenance', {
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
          broadcastContentUpdated();
        }
      }
    } catch (err) {
      console.error("Unexpected error toggling maintenance mode:", err);
    }
  };

  async function updateMemoryStatus(id: string, newStatus: string) {
    // Optimistic update - update UI immediately
    // When actioning an item in the current list (especially "pending"), remove it right away
    // so the admin doesn't need a manual refresh.
    let prevSnapshot: Memory[] | null = null;
    setMemories(prev => {
      prevSnapshot = prev;
      const next = prev.map(m => (m.id === id ? { ...m, status: newStatus } : m));
      const isWorkingOnCurrentTab = true;
      if (isWorkingOnCurrentTab) {
        return next.filter(m => m.id !== id);
      }
      return next;
    });

    // Background API call
    timedFetch('/api/admin/update-memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates: { status: newStatus } })
    }).then(response => response.json()).then(result => {
      if (result.error) {
        console.error('Update failed:', result.error);
        addToast(`Failed to ${newStatus} memory`, 'error');
        if (prevSnapshot) setMemories(prevSnapshot);
        refreshMemories(); // Re-sync on error
        return;
      }

      addToast(`Memory ${newStatus}`, 'success');
      broadcastContentUpdated();
      refreshMemories();
    }).catch(error => {
      console.error('Update error:', error);
      addToast(`Failed to ${newStatus} memory`, 'error');
      if (prevSnapshot) setMemories(prevSnapshot);
      refreshMemories(); // Re-sync on error
    });
  }

  // Inline edit: start editing
  const startEditing = useCallback((memory: Memory) => {
    setEditingMemory(memory.id);
    setEditFields({ recipient: memory.recipient, message: memory.message, sender: memory.sender || '' });
  }, []);

  // Inline edit: save
  const saveEdit = useCallback(async (id: string) => {
    try {
      const res = await timedFetch('/api/admin/update-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { recipient: editFields.recipient, message: editFields.message, sender: editFields.sender || null } }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        addToast('Edit failed', 'error');
        return;
      }
      setMemories(prev => prev.map(m => m.id === id ? { ...m, recipient: editFields.recipient, message: editFields.message, sender: editFields.sender || undefined } : m));
      setEditingMemory(null);
      addToast('Memory updated', 'success');
      broadcastContentUpdated();
    } catch {
      addToast('Edit failed', 'error');
    }
  }, [editFields, addToast, broadcastContentUpdated]);

  const cancelEdit = useCallback(() => {
    setEditingMemory(null);
  }, []);

  const toggleSelectedMemory = useCallback((id: string, checked: boolean) => {
    setSelectedMemoryIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const setAllDisplayedSelected = useCallback((checked: boolean) => {
    setSelectedMemoryIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        for (const m of displayedMemories) next.add(m.id);
      } else {
        for (const m of displayedMemories) next.delete(m.id);
      }
      return next;
    });
  }, [displayedMemories]);

  const selectedDisplayedCount = useMemo(() => {
    let c = 0;
    for (const m of displayedMemories) {
      if (selectedMemoryIds.has(m.id)) c += 1;
    }
    return c;
  }, [displayedMemories, selectedMemoryIds]);

  const canBulkApprove = selectedTab === 'pending' && selectedMemoryIds.size > 0;
  const canBulkDelete = (selectedTab === 'pending' || selectedTab === 'approved') && selectedMemoryIds.size > 0;

  const runBulkAction = useCallback(async (action: 'approve' | 'delete') => {
    const ids = Array.from(selectedMemoryIds);
    if (ids.length === 0) return;

    if (action === 'delete') {
      if (!confirm(`Delete ${ids.length} selected memories? This cannot be undone.`)) return;
    }
    if (action === 'approve') {
      if (!confirm(`Approve ${ids.length} selected memories?`)) return;
    }

    setMemories((prev) => prev.filter((m) => !selectedMemoryIds.has(m.id)));
    setSelectedMemoryIds(new Set());

    try {
      const res = await timedFetch('/api/admin/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids })
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || json?.error) {
        addToast(`Bulk ${action} failed`, 'error');
        refreshMemories();
        return;
      }

      addToast(`${json?.ok ?? ids.length} memories ${action === 'approve' ? 'approved' : 'deleted'}`, 'success');
      broadcastContentUpdated();
      refreshMemories();
    } catch {
      addToast(`Bulk ${action} failed`, 'error');
      refreshMemories();
    }
  }, [selectedMemoryIds, refreshMemories, broadcastContentUpdated, addToast]);

  async function deleteMemoryById(id: string) {
    if (!confirm('Are you sure you want to delete this memory? This cannot be undone.')) {
      return;
    }

    // Optimistic update - remove from UI immediately
    setMemories(prev => prev.filter(m => m.id !== id));

    // Background API call
    timedFetch('/api/admin/delete-memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(response => response.json()).then(result => {
      if (result.error) {
        console.error('Delete failed:', result.error);
        addToast('Delete failed', 'error');
        refreshMemories(); // Restore on error
        return;
      }

      addToast('Memory deleted', 'success');
      broadcastContentUpdated();
      refreshMemories();
    }).catch(error => {
      console.error('Delete error:', error);
      addToast('Delete failed', 'error');
      refreshMemories(); // Restore on error
    });
  }

  async function banMemory(memory: Memory) {
    if (!confirm(`Are you sure you want to ban this user and delete their memory? This cannot be undone.\n\nIP: ${memory.ip || 'N/A'}\nUUID: ${memory.uuid || 'N/A'}`)) {
      return;
    }
    // First delete the memory
    try {
      const response = await timedFetch('/api/admin/delete-memory', {
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
        const response = await timedFetch('/api/admin/ban', {
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
    broadcastContentUpdated();
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
      
      await timedFetch(`/api/admin/ban?${params.toString()}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error unbanning:", error);
    }
    broadcastContentUpdated();
    setSelectedTab("banned");
    refreshMemories();
  }

  async function togglePin(memory: Memory) {
    if (memory.pinned) {
      // Optimistic update - unpin immediately in UI
      setMemories(prev => prev.map(m => 
        m.id === memory.id ? { ...m, pinned: false, pinned_until: undefined } : m
      ));

      // Background API call
      timedFetch('/api/admin/update-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: memory.id, updates: { pinned: false, pinned_until: null } })
      }).then(response => response.json()).then(result => {
        if (result.error) {
          console.error(result.error);
          refreshMemories(); // Revert on error
          return;
        }

        broadcastContentUpdated();
        refreshMemories();
      }).catch(error => {
        console.error(error);
        refreshMemories(); // Revert on error
      });
      return;
    }

    // For pinning, check timer
    const timer = pinTimers[memory.id];
    if (!timer) return;
    
    const totalSeconds = calculateTotalSeconds(timer);
    if (totalSeconds <= 0) return;

    const pinnedUntil = new Date();
    pinnedUntil.setSeconds(pinnedUntil.getSeconds() + totalSeconds);

    // Optimistic update - pin immediately in UI
    setMemories(prev => prev.map(m => 
      m.id === memory.id ? { ...m, pinned: true, pinned_until: pinnedUntil.toISOString() } : m
    ));

    // Background API call
    timedFetch('/api/admin/update-memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: memory.id, updates: { pinned: true, pinned_until: pinnedUntil.toISOString() } })
    }).then(response => response.json()).then(result => {
      if (result.error) {
        console.error(result.error);
        refreshMemories(); // Revert on error
        return;
      }

      broadcastContentUpdated();
      refreshMemories();
    }).catch(error => {
      console.error(error);
      refreshMemories(); // Revert on error
    });
  }

  // Add interval for checking expired items ONLY when there are active items
  useEffect(() => {
    if (!hasActiveItems) return;

    const checkExpiredItems = async () => {
      // Check expired announcements
      if (currentAnnouncement) {
        const expiry = new Date(currentAnnouncement.expires_at);
        if (currentTime >= expiry) {
          await timedFetch('/api/admin/delete-announcement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentAnnouncement.id }),
            credentials: 'include',
          });
          setCurrentAnnouncement(null);
          await fetchCurrentAnnouncement(); // Refresh announcement state
        }
      }

      // Unpin expired pins via server-side bulk operation (lightweight, scales to millions)
      const unpinRes = await timedFetch('/api/unpin-expired', { method: 'POST', credentials: 'include' });
      const unpinData = await unpinRes.json().catch(() => ({ unpinned: 0 }));
      if (unpinData.unpinned > 0 && selectedTab === "approved") {
        refreshMemories();
      }
    };

    const interval = setInterval(checkExpiredItems, 30000); // Check every 30s — no need for sub-second precision
    return () => clearInterval(interval);
  }, [currentTime, hasActiveItems, selectedTab, refreshMemories, currentAnnouncement]);

  // Fetch banned users when banned tab is selected (via API with admin auth)
  useEffect(() => {
    if (selectedTab === "banned") {
      timedFetch('/api/admin/banned-users', {
        credentials: 'include',
        cache: 'no-store',
      }).then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setBannedUsers(json.data);
          }
        })
        .catch((err) => console.error('Error fetching banned users:', err));
    }
  }, [selectedTab]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader text="Authenticating..." />
      </div>
    );
  }

  if (!stylesReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader text="Loading admin..." />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const logoutCtrl = new AbortController();
      setTimeout(() => logoutCtrl.abort(), 10000);
      await fetch('/api/admin/auth', { 
        method: 'DELETE',
        credentials: 'include',
        signal: logoutCtrl.signal,
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/admin/login');
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
              className={`py-2 px-1 sm:px-2 md:px-3 text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
                selectedTab === tab
                  ? "border-b-2 border-blue-600 text-gray-900"
                  : "text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tabCounts[tab] != null && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  tab === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {tabCounts[tab]}
                </span>
              )}
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
              <div className="py-6"><Loader text="Checking database..." /></div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                    <h3 className="font-semibold mb-2">Status</h3>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${dbStatus?.databaseA ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        Database {dbStatus?.databaseA ? '(OK)' : '(Down)'}
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                    <h3 className="font-semibold mb-2">Total Memories</h3>
                    <div className="text-sm">
                      <span className="font-mono text-lg">{dbCounts?.count ?? '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                    <h3 className="font-semibold mb-2">Status Counts</h3>
                    <div className="text-sm space-y-1">
                      <div>Pending: <span className="font-mono">{statusCounts?.pending ?? '—'}</span></div>
                      <div>Approved: <span className="font-mono">{statusCounts?.approved ?? '—'}</span></div>
                      <div>Banned: <span className="font-mono">{statusCounts?.banned ?? '—'}</span></div>
                    </div>
                  </div>
                  <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                    <h3 className="font-semibold mb-2">Latency (ms)</h3>
                    <div className="text-sm">
                      <span className="font-mono">{typeof latency === 'number' ? latency.toFixed(0) : '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Expired Pins</h3>
                    <span className="text-sm text-gray-600">(total: {expiredPinned?.total ?? '—'})</span>
                    <button
                      onClick={async () => { if (confirm('Unpin all expired memories now?')) { await timedFetch('/api/unpin-expired', { method: 'POST', credentials: 'include' }); addToast('Expired pins cleared', 'success'); await loadDbHealth(); } }}
                      className="ml-auto px-3 py-1.5 rounded bg-amber-500 text-white text-sm hover:bg-amber-600"
                    >
                      Unpin expired now
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Self-Destructed Memories</h3>
                    <button
                      onClick={async () => {
                        if (!confirm('Scrub all self-destructed memories now? This blanks their messages permanently.')) return;
                        try {
                          const res = await timedFetch('/api/admin/scrub-destructed', { method: 'POST', credentials: 'include' });
                          const json = await res.json();
                          addToast(`Scrubbed ${json.scrubbed || 0} memories`, 'success');
                          await loadDbHealth();
                        } catch { addToast('Scrub failed', 'error'); }
                      }}
                      className="ml-auto px-3 py-1.5 rounded bg-red-500 text-white text-sm hover:bg-red-600"
                    >
                      Scrub destructed now
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--bg)]">
                  <h3 className="font-semibold mb-3">Last 10 Memories</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className="py-2 pr-4">ID</th>
                          <th className="py-2 pr-4">Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentMemories.map((r) => (
                          <tr key={r.id} className="border-t border-[var(--border)]">
                            <td className="py-2 pr-4 font-mono break-all">{r.id}</td>
                            <td className="py-2 pr-4">{new Date(r.created_at).toLocaleString()}</td>
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
            {(selectedTab === 'pending' || selectedTab === 'approved') && displayedMemories.length > 0 && (
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="inline-flex items-center gap-2 text-sm text-[var(--text)] opacity-80 select-none">
                  <input
                    type="checkbox"
                    checked={displayedMemories.length > 0 && selectedDisplayedCount === displayedMemories.length}
                    onChange={(e) => setAllDisplayedSelected(e.target.checked)}
                  />
                  Select all shown
                </label>
                <div className="text-sm text-[var(--text)] opacity-70">
                  Selected: {selectedMemoryIds.size}
                </div>
                <div className="flex flex-wrap gap-2 sm:ml-auto">
                  {selectedTab === 'pending' && (
                    <button
                      onClick={() => runBulkAction('approve')}
                      disabled={!canBulkApprove}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Approve selected
                    </button>
                  )}
                  <button
                    onClick={() => runBulkAction('delete')}
                    disabled={!canBulkDelete}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete selected
                  </button>
                </div>
              </div>
            )}
            {(selectedTab === "pending" || selectedTab === "approved" || selectedTab === "banned") && (
              <div className="mb-6 flex gap-2">
                <input
                  type="text"
                  placeholder="Search by recipient, message, or sender..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-1 p-3 sm:p-3.5 text-base sm:text-lg border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] bg-white shadow-sm transition-all duration-200"
                  autoComplete="off"
                  inputMode="search"
                />
                <button
                  onClick={() => refreshMemories()}
                  disabled={memoriesLoading}
                  className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 whitespace-nowrap"
                  title="Refresh"
                >
                  Refresh
                </button>
              </div>
            )}
            {memoriesLoading ? (
              <div className="py-6">
                <Loader text="Loading memories..." />
              </div>
            ) : displayedMemories.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-[var(--text)] opacity-75">
                  {searchTerm ? (
                    <span>Showing {displayedMemories.length} of {filteredMemories.length} search results</span>
                  ) : (
                    <span>Showing {displayedMemories.length} of {memoriesTotalCount} memories</span>
                  )}
                </div>
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
                      <div className="flex items-start gap-3">
                        {(selectedTab === 'pending' || selectedTab === 'approved') && (
                          <input
                            type="checkbox"
                            checked={selectedMemoryIds.has(memory.id)}
                            onChange={(e) => toggleSelectedMemory(memory.id, e.target.checked)}
                            className="mt-1"
                          />
                        )}
                        {editingMemory === memory.id ? (
                          <input
                            value={editFields.recipient}
                            onChange={e => setEditFields(p => ({ ...p, recipient: e.target.value }))}
                            className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-400 bg-transparent focus:outline-none w-full"
                          />
                        ) : (
                          <h3 className="text-2xl font-semibold text-gray-800 break-words">To: {memory.recipient}</h3>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {memory.pinned && <span className="text-yellow-500 text-xl">📌</span>}
                        {editingMemory !== memory.id && (
                          <button onClick={() => startEditing(memory)} className="text-gray-400 hover:text-blue-500 text-xs" title="Edit">✏️</button>
                        )}
                      </div>
                    </div>
                    {editingMemory === memory.id ? (
                      <textarea
                        value={editFields.message}
                        onChange={e => setEditFields(p => ({ ...p, message: e.target.value }))}
                        className="mt-3 w-full text-gray-700 border border-blue-300 rounded p-2 bg-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                        rows={4}
                      />
                    ) : (
                      <p className="mt-3 text-gray-700 break-words whitespace-pre-wrap">
                        {memory.message && memory.message.length > 200 ? (
                          <>
                            {expandedMessages.has(memory.id) ? memory.message : memory.message.slice(0, 200) + '...'}
                            <button
                              onClick={() => setExpandedMessages(prev => {
                                const next = new Set(prev);
                                if (next.has(memory.id)) next.delete(memory.id); else next.add(memory.id);
                                return next;
                              })}
                              className="ml-2 text-blue-600 hover:underline text-xs font-medium"
                            >
                              {expandedMessages.has(memory.id) ? 'Show less' : 'Show more'}
                            </button>
                          </>
                        ) : memory.message}
                      </p>
                    )}
                    {editingMemory === memory.id ? (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-gray-500 italic">—</span>
                        <input
                          value={editFields.sender}
                          onChange={e => setEditFields(p => ({ ...p, sender: e.target.value }))}
                          className="italic text-lg text-gray-600 border-b border-blue-300 bg-transparent focus:outline-none flex-1"
                          placeholder="Sender (optional)"
                        />
                      </div>
                    ) : memory.sender ? (
                      <p className="mt-3 italic text-lg text-gray-600 break-words">— {memory.sender}</p>
                    ) : null}
                    {editingMemory === memory.id && (
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => saveEdit(memory.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Save</button>
                        <button onClick={cancelEdit} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Cancel</button>
                      </div>
                    )}
                    {/* Metadata badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {memory.color && memory.color !== 'default' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          🎨 {memory.color}{memory.full_bg ? ' (full)' : ''}
                        </span>
                      )}
                      {memory.animation && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700 border border-purple-200">
                          ✨ {memory.animation}
                        </span>
                      )}
                      {memory.typewriter_enabled && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                          ⌨️ typewriter
                        </span>
                      )}
                      {memory.tag && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          #{memory.tag}{memory.sub_tag ? `/${memory.sub_tag}` : ''}
                        </span>
                      )}
                      {memory.night_only && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-200 border border-slate-600">
                          🌙 night-only{memory.night_tz ? ` (${memory.night_tz})` : ''}
                        </span>
                      )}
                      {memory.destruct_at && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 border border-red-200">
                          💣 self-destruct {new Date(memory.destruct_at) > new Date() ? formatRemainingTime(memory.destruct_at) : 'expired'}
                        </span>
                      )}
                      {memory.letter_style && memory.letter_style !== 'default' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                          📝 {memory.letter_style}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 text-sm text-gray-500 break-words space-y-0.5">
                      <p className="flex items-center gap-1 cursor-pointer" onClick={() => memory.ip && navigator.clipboard.writeText(memory.ip)} title="Click to copy IP">
                        IP: <span className="underline decoration-dotted">{memory.ip || '-'}</span>
                      </p>
                      <p className="flex items-center gap-1 cursor-pointer" onClick={() => memory.uuid && navigator.clipboard.writeText(memory.uuid)} title="Click to copy UUID">
                        UUID: <span className="underline decoration-dotted break-all">{memory.uuid || '-'}</span>
                      </p>
                      <p>Country: {memory.country || '-'}</p>
                      {(() => {
                        const label = formatTimeUntilReveal(memory);
                        if (!label) return null;
                        return <p className="text-blue-600 font-semibold">{label}</p>;
                      })()}
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
                {hasMoreMemories && (
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
                {/* Server-side pagination controls */}
                {adminTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => { const p = Math.max(0, adminPage - 1); setAdminPage(p); setDisplayCount(50); refreshMemories(p); }}
                      disabled={adminPage === 0 || memoriesLoading}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-600 font-mono">
                      Page {adminPage + 1} of {adminTotalPages}
                    </span>
                    <button
                      onClick={() => { const p = Math.min(adminTotalPages - 1, adminPage + 1); setAdminPage(p); setDisplayCount(50); refreshMemories(p); }}
                      disabled={adminPage >= adminTotalPages - 1 || memoriesLoading}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-700">
                {searchTerm ? "No memories found matching your search." : `No ${selectedTab} memories found.`}
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
                      
                      await timedFetch(`/api/admin/ban?${params.toString()}`, {
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
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
