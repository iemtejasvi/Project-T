"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Shows a brief dot-wave loader during client-side page transitions.
 * On desktop, prefetched routes resolve instantly so the Suspense loading.tsx
 * never triggers — this component fills that gap with a consistent transition.
 */
export default function NavigationLoader() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathname = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Intercept <a> clicks on internal links to show loader immediately
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
        // Only trigger for internal same-origin navigations to a different path
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          setIsNavigating(true);
          // Safety timeout — hide after 4s even if pathname change is missed
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setIsNavigating(false), 4000);
        }
      } catch { /* ignore invalid URLs */ }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname]);

  useEffect(() => {
    // When pathname actually changes, hide the loader
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsNavigating(false);
      clearTimeout(timeoutRef.current);
    }
  }, [pathname]);

  if (!isNavigating) return null;

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
