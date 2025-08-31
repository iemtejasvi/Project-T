"use client";
import { useEffect, useRef } from "react";

export default function MaintenanceWatcher() {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Do not enforce on localhost/dev
    if (typeof window === 'undefined') return;
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname.endsWith('.local');
    if (isLocalhost) return;

    const skipPaths = ['/maintenance', '/admin'];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    async function checkMaintenance() {
      try {
        // Avoid redundant checks on excluded paths
        const pathname = window.location.pathname;
        if (skipPaths.some(p => pathname.startsWith(p))) return;

        // If env is not available on client for any reason, fail silently
        if (!supabaseUrl || !anonKey) return;

        const url = `${supabaseUrl}/rest/v1/maintenance?id=eq.1&select=is_active`;
        const res = await fetch(url, {
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Cache-Control': 'no-cache, no-store, max-age=0'
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.is_active) {
          // Force navigation to maintenance without adding history entry
          window.location.replace('/maintenance');
        }
      } catch {
        // Silent fail
      }
    }

    function startPolling() {
      // Run immediately, then every 10s while page is visible
      checkMaintenance();
      stopPolling();
      timerRef.current = window.setInterval(checkMaintenance, 10000);
    }

    function stopPolling() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Start when page becomes visible/focused, stop when hidden
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') startPolling();
      else stopPolling();
    };
    const handleFocus = () => startPolling();
    const handleBlur = () => stopPolling();
    const handlePageShow = () => startPolling();
    const handlePopState = () => checkMaintenance();

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);

    // Kick off immediately if visible
    if (document.visibilityState === 'visible') startPolling();

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null;
}


