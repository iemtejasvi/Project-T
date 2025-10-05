"use client";
import { useEffect } from "react";

export default function SessionInitializer() {
  useEffect(() => {
    try {
      const hasSession = typeof document !== 'undefined' && document.cookie.split('; ').some(c => c.startsWith('ioist_session_seen='));
      if (!hasSession) {
        document.cookie = 'ioist_session_seen=1; path=/';
      }
    } catch {}
  }, []);
  return null;
}
