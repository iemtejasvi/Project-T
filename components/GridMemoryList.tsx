import React, { useEffect, useState } from "react";
import Loader from "./Loader";
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
  animation?: string;
  pinned?: boolean;
  pinned_until?: string;
  ip?: string;
  country?: string;
  uuid?: string;
  tag?: string;
  sub_tag?: string;
}

interface GridMemoryListProps {
  memories: Memory[];
}

const GridMemoryList: React.FC<GridMemoryListProps> = ({ memories }) => {
  // Initialize with SSR-safe default, then update on mount
  const [isDesktop, setIsDesktop] = useState(() => {
    // During SSR, assume desktop layout for better initial render
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });
  
  useEffect(() => {
    // Update immediately on mount for accurate detection
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Render both layouts with CSS to avoid hydration mismatch
  return (
    <>
      {/* Desktop layout - hidden on mobile */}
      <div className="hidden lg:grid grid-cols-3 gap-x-12 gap-y-12 w-full px-8 max-w-screen-xl mx-auto items-start justify-center"
           style={{ gridTemplateColumns: 'repeat(3, 350px)' }}>
        {memories.map((memory) => (
          <div key={`desktop-${memory.id}`}>
            <DesktopMemoryCard memory={memory} />
          </div>
        ))}
      </div>
      
      {/* Mobile layout - hidden on desktop */}
      <div className="flex lg:hidden flex-col gap-8">
        {memories.map((memory) => (
          <MemoryCard key={`mobile-${memory.id}`} memory={memory} />
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