import React, { useEffect, useState } from "react";
import MemoryCard from "./MemoryCard";
import DesktopMemoryCard from "./DesktopMemoryCard";

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  color: string;
  full_bg: boolean;
  letter_style: string;
  animation?: string;
  pinned?: boolean;
  pinned_until?: string;
}

interface GridMemoryListProps {
  memories: Memory[];
}

const GridMemoryList: React.FC<GridMemoryListProps> = ({ memories }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-x-32 gap-y-2 w-full px-8 max-w-screen-xl mx-auto items-start"
           style={{ gridTemplateColumns: 'repeat(2, 350px)' }}>
        {memories.map((memory) => (
          <div key={memory.id}>
            <DesktopMemoryCard memory={memory} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      {memories.map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
};

// Desktop grid for home page (3 cards, larger size/text)
export const HomeDesktopMemoryGrid: React.FC<{ memories: Memory[] }> = ({ memories }) => {
  return (
    <div
      className="grid grid-cols-2 gap-x-32 gap-y-12 w-full px-8 max-w-screen-xl mx-auto items-start"
      style={{ gridTemplateColumns: 'repeat(2, 350px)' }}
    >
      {memories.slice(0, 4).map((memory) => (
        <div key={memory.id}>
          <DesktopMemoryCard memory={memory} large />
        </div>
      ))}
    </div>
  );
};

// Mobile 'Desktop site' mode grid for home page (5 cards in a column)
export const HomeMobileDesktopSiteModeGrid: React.FC<{ memories: Memory[] }> = ({ memories }) => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-md mx-auto">
      {memories.slice(0, 5).map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
};

export default GridMemoryList; 