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
  /** Called when the ad is blocked, fails, or reports no fill */
  onCollapse?: () => void;
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID || "";
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
  onCollapse,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [adFailed, setAdFailed] = useState(false);
  const collapseAd = () => {
    setAdFailed(true);
    onCollapse?.();
  };

  useEffect(() => {
    if (!ENABLE_ADS || !ADSENSE_CLIENT || pushed.current) return;
    let fallbackTimer: number | null = null;
    let observer: MutationObserver | null = null;

    try {
      if (!window.adsbygoogle) {
        window.adsbygoogle = [];
      }
      if (Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      collapseAd();
    }

    const collapseIfBlockedOrUnfilled = () => {
      const adEl = adRef.current;
      const adStatus = adEl?.getAttribute("data-ad-status");
      const adsGlobal = window.adsbygoogle as unknown as { loaded?: boolean } | undefined;

      if (adStatus === "unfilled") {
        collapseAd();
        return;
      }

      if (!adsGlobal?.loaded && !adStatus) {
        collapseAd();
      }
    };

    if (adRef.current) {
      observer = new MutationObserver(collapseIfBlockedOrUnfilled);
      observer.observe(adRef.current, {
        attributes: true,
        attributeFilter: ["data-ad-status"],
      });
    }

    fallbackTimer = window.setTimeout(collapseIfBlockedOrUnfilled, 7000);

    return () => {
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      observer?.disconnect();
    };
  }, []);

  if (!ENABLE_ADS || !ADSENSE_CLIENT) return null;

  // Collapse container if ad blocked / failed
  if (adFailed) return null;

  return (
    <aside
      className={`ad-container overflow-hidden max-w-full ${className}`}
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
        style={{ display: "block", overflow: "hidden", maxWidth: "100%" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        {...(responsive && !layoutKey ? { "data-full-width-responsive": "false" } : {})}
      />
    </aside>
  );
}

/** Desktop-only sidebar rail ad - sticky, shown only on wide viewports */
export function SidebarAdUnit({ slot }: { slot: string }) {
  const [collapsed, setCollapsed] = useState(false);
  if (!ENABLE_ADS || !ADSENSE_CLIENT) return null;
  if (collapsed) return null;

  return (
    <div className="hidden min-[1720px]:block absolute top-20 -left-[180px] w-[160px]">
      <div className="sticky top-20 opacity-50 hover:opacity-70 transition-opacity duration-300">
        <AdUnit
          slot={slot}
          format="vertical"
          responsive={false}
          minHeight={600}
          style={{ width: 160, height: 600 }}
          className="rounded-xl overflow-hidden"
          onCollapse={() => setCollapsed(true)}
        />
      </div>
    </div>
  );
}

/** In-feed ad that matches the archive grid rhythm */
export function InFeedAdUnit({
  slot,
  cols = 3,
}: {
  slot: string;
  /** Number of grid columns (1 = mobile, 2 = tablet, 3 = desktop) */
  cols?: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  if (!ENABLE_ADS || !ADSENSE_CLIENT) return null;
  if (collapsed) return null;

  const widthClass = cols === 3
    ? 'max-w-full'
    : cols === 2
      ? 'max-w-full'
      : 'w-[84vw] max-w-[460px]';
  const spacingClass = cols === 3
    ? 'my-4'
    : cols === 2
      ? 'my-3'
      : 'my-4';

  return (
    <div className={`w-full mx-auto ${spacingClass} ${widthClass}`}>
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)]/10 overflow-hidden">
        <AdUnit
          slot={slot}
          format="fluid"
          layoutKey="-gj-i+16-52+b7"
          minHeight={cols === 1 ? 250 : cols === 2 ? 150 : 90}
          className="px-4 py-3"
          onCollapse={() => setCollapsed(true)}
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
  const [collapsed, setCollapsed] = useState(false);
  if (!ENABLE_ADS || !ADSENSE_CLIENT) return null;
  if (collapsed) return null;

  return (
    <div
      className={`max-w-3xl w-full mx-auto mt-12 mb-8 opacity-70 overflow-hidden ${className}`}
    >
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)]/10 overflow-hidden">
        <AdUnit
          slot={slot}
          format="horizontal"
          minHeight={90}
          className="px-4 py-3"
          onCollapse={() => setCollapsed(true)}
        />
      </div>
    </div>
  );
}
