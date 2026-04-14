"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function MoreOptionsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

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
        More &#9662;
      </button>
      {open && (
        <div className="absolute top-full mt-2 w-56 right-0 bg-[var(--card-bg)] border border-[var(--border)] rounded shadow-lg z-10">
          <Link href="/articles" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">Articles</div>
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">About</div>
          </Link>
          <Link href="/unsent-letters" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">The Art of Unsent Letters</div>
          </Link>
          <Link href="/love-letters-never-sent" onClick={() => setOpen(false)}>
            <div className="px-4 py-2 text-[var(--text)] hover:bg-[var(--accent)] hover:text-white cursor-pointer text-sm">Love Letters Never Sent</div>
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
