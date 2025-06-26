import React from "react";
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

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isDesktopWidth() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

export const DesktopSiteHomeGrid: React.FC<{ memories: Memory[] }> = ({ memories }) => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setShow(isMobileDevice() && isDesktopWidth());
    const onResize = () => setShow(isMobileDevice() && isDesktopWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  if (!show) return null;
  return (
    <div
      className="grid grid-cols-2 gap-x-32 gap-y-12 w-full px-8 max-w-screen-xl mx-auto items-start"
      style={{ gridTemplateColumns: 'repeat(2, 350px)' }}
    >
      {memories.slice(0, 5).map((memory) => (
        <div key={memory.id}>
          <DesktopMemoryCard memory={memory} large />
        </div>
      ))}
    </div>
  );
}; 