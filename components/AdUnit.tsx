"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Fixed min-height to prevent CLS */
  minHeight?: number;
  /** Label shown above the ad */
  label?: boolean;
  /** Layout key for in-feed fluid ads */
  layoutKey?: string;
}

const ADSENSE_CLIENT = "ca-pub-8850424858354795";
const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

export default function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style,
  minHeight = 90,
  label = true,
  layoutKey,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [adFailed, setAdFailed] = useState(false);

  useEffect(() => {
    if (!ENABLE_ADS || pushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      setAdFailed(true);
    }
  }, []);

  if (!ENABLE_ADS) return null;

  // Collapse container if ad blocked / failed
  if (adFailed) return null;

  return (
    <aside
      className={`ad-container ${className}`}
      style={{ minHeight, ...style }}
      aria-hidden="true"
    >
      {label && (
        <span className="block text-center text-[10px] text-[var(--text)] opacity-20 mb-1 select-none tracking-widest uppercase">
          ad
        </span>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", ...(responsive ? {} : {}) }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        {...(responsive && !layoutKey ? { "data-full-width-responsive": "true" } : {})}
      />
    </aside>
  );
}

/** Desktop-only sidebar rail ad — sticky, shown only on 1440px+ viewports */
export function SidebarAdUnit({ slot }: { slot: string }) {
  if (!ENABLE_ADS) return null;

  return (
    <div className="hidden 2xl:block absolute top-20 -left-[180px] w-[160px]">
      <div className="sticky top-20 opacity-50 hover:opacity-70 transition-opacity duration-300">
        <AdUnit
          slot={slot}
          format="vertical"
          responsive={false}
          minHeight={600}
          style={{ width: 160, height: 600 }}
          className="rounded-xl overflow-hidden"
        />
      </div>
    </div>
  );
}

/** In-feed ad that matches the archive grid rhythm */
export function InFeedAdUnit({
  slot,
  isDesktop,
}: {
  slot: string;
  isDesktop: boolean;
}) {
  if (!ENABLE_ADS) return null;

  return (
    <div
      className={`w-full mx-auto my-6 ${
        isDesktop
          ? "max-w-screen-xl px-8 col-span-3"
          : "max-w-xs sm:max-w-sm"
      }`}
    >
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)]/10 overflow-hidden">
        <AdUnit
          slot={slot}
          format="fluid"
          layoutKey="-gj-i+16-52+b7"
          minHeight={isDesktop ? 90 : 250}
          className="px-4 py-3"
        />
      </div>
    </div>
  );
}

/** Below-content ad with generous spacing */
export function BelowContentAdUnit({
  slot,
  className = "",
}: {
  slot: string;
  className?: string;
}) {
  if (!ENABLE_ADS) return null;

  return (
    <div
      className={`max-w-3xl mx-auto mt-12 mb-8 opacity-70 ${className}`}
    >
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)]/10 overflow-hidden">
        <AdUnit
          slot={slot}
          format="horizontal"
          minHeight={90}
          className="px-4 py-3"
        />
      </div>
    </div>
  );
}
