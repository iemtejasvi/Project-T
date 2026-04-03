"use client";
import React from "react";
import MemoryCard from "./MemoryCard";
import DesktopMemoryCard from "./DesktopMemoryCard";
import type { Memory } from '@/types/memory';

interface GridMemoryListProps {
  memories: Memory[];
}

const GridMemoryList: React.FC<GridMemoryListProps> = ({ memories }) => {
  return (
    <>
      {/* Desktop grid — hidden below lg, shown on lg+ */}
      <div className="hidden lg:grid grid-cols-3 gap-x-12 gap-y-12 w-full px-8 max-w-screen-xl mx-auto items-start justify-center"
           style={{ gridTemplateColumns: 'repeat(3, 350px)' }}>
        {memories.map((memory) => (
          <div key={memory.id}>
            <DesktopMemoryCard memory={memory} />
          </div>
        ))}
      </div>
      {/* Mobile cards — shown below lg, hidden on lg+ */}
      <div className="flex flex-col gap-8 lg:hidden">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>
    </>
  );
};

// Desktop grid for home page (3 cards, larger size/text)
export const HomeDesktopMemoryGrid: React.FC<{ memories: Memory[] }> = ({ memories }) => {
  return (
    <div
      className="grid grid-cols-3 gap-x-12 gap-y-12 w-full px-8 max-w-screen-xl mx-auto items-start justify-center"
      style={{ gridTemplateColumns: 'repeat(3, 350px)' }}
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
