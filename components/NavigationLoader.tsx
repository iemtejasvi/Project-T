"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Shows a dot-wave loader during client-side page transitions, but only if the
 * navigation takes longer than a short threshold. Instant navigations (prefetched
 * routes) never flash the loader — it only appears when there's a real delay.
 */
const SHOW_DELAY_MS = 120; // Only show loader if navigation takes longer than this

export default function NavigationLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);
  const showTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const safetyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendingNav = useRef(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (
        !anchor ||
        !anchor.href ||
        anchor.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) return;

      try {
        const url = new URL(anchor.href, window.location.origin);
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          // Mark navigation as pending but don't show loader yet
          pendingNav.current = true;
          clearTimeout(showTimer.current);
          clearTimeout(safetyTimer.current);

          // Only show loader if navigation hasn't completed after the delay
          showTimer.current = setTimeout(() => {
            if (pendingNav.current) setVisible(true);
          }, SHOW_DELAY_MS);

          // Safety: hide after 4s no matter what
          safetyTimer.current = setTimeout(() => {
            pendingNav.current = false;
            setVisible(false);
          }, 4000);
        }
      } catch { /* ignore invalid URLs */ }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname]);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      // Navigation complete — cancel everything
      pendingNav.current = false;
      clearTimeout(showTimer.current);
      clearTimeout(safetyTimer.current);
      setVisible(false);
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-[2px] pointer-events-none">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--text)] opacity-60"
            style={{
              animation: "navDotWave 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes navDotWave {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-4px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
