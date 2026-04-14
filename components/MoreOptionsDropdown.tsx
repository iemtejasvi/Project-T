"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MoreOptionsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const isHowItWorks = pathname === "/how-it-works";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <li className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link"
      >
        {isHowItWorks ? "How It Works" : "More"} &#9662;
      </button>
      {open && (
        <div className="absolute top-full mt-2 w-56 right-0 bg-[var(--card-bg)] border border-[var(--border)] rounded shadow-lg z-10">
          <Link href="/how-it-works" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">How It Works</div>
          </Link>
          <Link href="/articles" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">Journal</div>
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">About</div>
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">Contact</div>
          </Link>
          <Link href="/donate" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">Donate</div>
          </Link>
          <Link href="/privacy-policy" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">Privacy Policy</div>
          </Link>
          <Link href="/terms" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">Terms &amp; Conditions</div>
          </Link>
        </div>
      )}
    </li>
  );
}
