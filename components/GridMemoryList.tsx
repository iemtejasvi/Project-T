"use client";
import React, { useState, useEffect } from "react";
import MemoryCard from "./MemoryCard";
import DesktopMemoryCard from "./DesktopMemoryCard";
import { InFeedAdUnit } from "./AdUnit";
import type { Memory } from '@/types/memory';

interface GridMemoryListProps {
  memories: Memory[];
  /** Insert in-feed ads every N cards (0 = no ads) */
  adInterval?: number;
  /** AdSense slot ID for in-feed ads */
  adSlot?: string;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

const AD_INTERVAL = 6;

const GridMemoryList: React.FC<GridMemoryListProps> = ({ memories, adInterval = AD_INTERVAL, adSlot }) => {
  const isDesktop = useIsDesktop();

  // Don't render until client-side desktop check completes to avoid mobile flash
  if (isDesktop === null) return null;

  if (isDesktop) {
    // Build elements with ad rows inserted after every `adInterval` cards
    const elements: React.ReactNode[] = [];
    memories.forEach((memory, i) => {
      elements.push(
        <div key={memory.id}>
          <DesktopMemoryCard memory={memory} />
        </div>
      );
      // Insert ad row after every `adInterval` cards (fills full 3-col row)
      if (adSlot && adInterval > 0 && (i + 1) % adInterval === 0 && i < memories.length - 1) {
        elements.push(
          <div key={`ad-${i}`} className="col-span-3 empty:hidden">
            <InFeedAdUnit slot={adSlot} isDesktop={true} />
          </div>
        );
      }
    });

    return (
      <div className="grid grid-cols-3 gap-x-10 gap-y-9 w-full px-8 max-w-screen-xl mx-auto items-start justify-center"
           style={{ gridTemplateColumns: 'repeat(3, 350px)' }}>
        {elements}
      </div>
    );
  }

  // Mobile: insert ad after every `adInterval` cards
  const mobileElements: React.ReactNode[] = [];
  memories.forEach((memory, i) => {
    mobileElements.push(
      <MemoryCard key={memory.id} memory={memory} compact />
    );
    if (adSlot && adInterval > 0 && (i + 1) % adInterval === 0 && i < memories.length - 1) {
      mobileElements.push(
        <InFeedAdUnit key={`ad-${i}`} slot={adSlot} isDesktop={false} />
      );
    }
  });

  return (
    <div className="flex flex-col">
      {mobileElements}
    </div>
  );
};

// Desktop grid for home page (3 cards, larger size/text)
export const HomeDesktopMemoryGrid: React.FC<{ memories: Memory[] }> = ({ memories }) => {
  return (
    <div
      className="grid grid-cols-3 gap-x-10 gap-y-8 w-full px-8 max-w-screen-xl mx-auto items-start justify-center"
      style={{ gridTemplateColumns: 'repeat(3, 370px)' }}
    >
      {memories.slice(0, 6).map((memory) => (
        <div key={memory.id}>
          <DesktopMemoryCard memory={memory} large />
        </div>
      ))}
    </div>
  );
};

export default GridMemoryList;
