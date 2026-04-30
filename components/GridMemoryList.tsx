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

type DeviceType = 'mobile' | 'tablet' | 'desktop' | null;

function useDeviceType(): DeviceType {
  const [device, setDevice] = useState<DeviceType>(null);
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w >= 1280) setDevice('desktop');
      else if (w >= 768) setDevice('tablet');
      else setDevice('mobile');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return device;
}

const AD_INTERVAL = 6;

const GridMemoryList: React.FC<GridMemoryListProps> = ({ memories, adInterval = AD_INTERVAL, adSlot }) => {
  const device = useDeviceType();

  // Don't render until client-side check completes to avoid layout flash
  if (device === null) return null;

  // Desktop (3 cols) or Tablet (2 cols) — both use DesktopMemoryCard
  if (device === 'desktop' || device === 'tablet') {
    const cols = device === 'desktop' ? 3 : 2;
    const elements: React.ReactNode[] = [];
    memories.forEach((memory, i) => {
      elements.push(
        <div key={memory.id}>
          <DesktopMemoryCard memory={memory} />
        </div>
      );
      // Insert ad row spanning full row width after every `adInterval` cards
      if (adSlot && adInterval > 0 && (i + 1) % adInterval === 0 && i < memories.length - 1) {
        elements.push(
          <div key={`ad-${i}`} style={{ gridColumn: `1 / -1` }} className="empty:hidden w-full">
            <InFeedAdUnit slot={adSlot} cols={cols} />
          </div>
        );
      }
    });

    return (
      <div
        className={`grid w-full mx-auto items-start justify-center ${
          device === 'desktop'
            ? 'gap-x-6 gap-y-10 px-5 max-w-[1290px]'
            : 'gap-x-4 gap-y-4 px-4'
        }`}
        style={{ gridTemplateColumns: device === 'desktop' ? 'repeat(3, 400px)' : 'repeat(2, 350px)' }}
      >
        {elements}
      </div>
    );
  }

  // Mobile: single column
  const mobileElements: React.ReactNode[] = [];
  memories.forEach((memory, i) => {
    mobileElements.push(
      <MemoryCard key={memory.id} memory={memory} compact />
    );
    if (adSlot && adInterval > 0 && (i + 1) % adInterval === 0 && i < memories.length - 1) {
      mobileElements.push(
        <InFeedAdUnit key={`ad-${i}`} slot={adSlot} cols={1} />
      );
    }
  });

  return (
    <div className="flex flex-col">
      {mobileElements}
    </div>
  );
};

// Desktop grid for home page (3 cols desktop, 2 cols tablet)
export const HomeDesktopMemoryGrid: React.FC<{ memories: Memory[] }> = ({ memories }) => {
  const device = useDeviceType();
  const isTablet = device === 'tablet';

  return (
    <div
      className={`grid w-full mx-auto items-start justify-center ${
        isTablet
          ? 'gap-x-4 gap-y-4 px-4'
          : 'gap-x-6 gap-y-10 px-5 max-w-[1290px]'
      }`}
      style={{ gridTemplateColumns: isTablet ? 'repeat(2, 350px)' : 'repeat(3, 400px)' }}
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
