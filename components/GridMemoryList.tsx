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
      <div className="grid grid-cols-2 gap-x-20 gap-y-2 w-full px-8 max-w-screen-xl mx-auto items-start"
           style={{ gridTemplateColumns: 'repeat(2, minmax(350px, 1fr))' }}>
        {memories.map((memory, idx) => (
          <div key={memory.id} className={idx % 2 === 0 ? 'mr-8' : ''}>
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
      className="grid grid-cols-2 gap-x-20 gap-y-12 w-full px-8 max-w-screen-xl mx-auto items-start"
      style={{ gridTemplateColumns: 'repeat(2, minmax(350px, 1fr))' }}
    >
      {memories.slice(0, 4).map((memory, idx) => (
        <div key={memory.id} className={idx % 2 === 0 ? 'mr-8' : ''}>
          <DesktopMemoryCard memory={memory} large />
        </div>
      ))}
    </div>
  );
};

export default GridMemoryList; 