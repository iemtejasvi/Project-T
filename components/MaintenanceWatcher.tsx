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

    async function checkMaintenance() {
      try {
        // Avoid redundant checks on excluded paths
        const pathname = window.location.pathname;
        if (skipPaths.some(p => pathname.startsWith(p))) return;

        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/maintenance?id=eq.1&select=is_active`;
        const res = await fetch(url, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Cache-Control': 'no-cache'
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

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Kick off immediately if visible
    if (document.visibilityState === 'visible') startPolling();

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return null;
}


