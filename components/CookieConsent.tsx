"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) setVisible(true);
    } catch {
      // localStorage unavailable — don't show banner
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("cookie_consent", "accepted");
    } catch {
      // ignore
    }
    // Update Google Consent Mode v2 — grant all consent signals
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
        });
      }
    } catch {
      // gtag not loaded yet — consent default will pick it up on next page load
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[var(--card-bg)] border-t border-[var(--border)] shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 sm:px-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <p className="text-[var(--text)] text-xs sm:text-sm flex-1 text-center sm:text-left">
          We use cookies to improve your experience and serve personalized ads via Google AdSense.
          See our{" "}
          <Link href="/cookie-policy" className="text-[var(--accent)] hover:underline">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-[var(--accent)] hover:underline">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/cookie-policy"
            className="px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition-colors"
          >
            Manage
          </Link>
          <button
            onClick={accept}
            className="px-4 py-1.5 text-xs sm:text-sm rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
