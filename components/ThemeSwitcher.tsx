"use client";
import { useEffect } from "react";

export default function ThemeSwitcher() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const hour = new Date().getHours();
    let theme = "morning";
    if (hour >= 12 && hour < 18) {
      theme = "evening";
    } else if (hour >= 18 || hour < 6) {
      theme = "night";
    }

    // Desktop detection using matchMedia (respects "request desktop site")
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    
    const root = document.documentElement;
    
    // Desktop: Consistent premium theme (no time-based changes)
    // Mobile: Time-based themes for variety
    if (isDesktop) {
      // Rich, sophisticated darker theme for desktop
      root.style.setProperty("--background", "#DDDBD8");
      root.style.setProperty("--bg", "#DDDBD8");
      root.style.setProperty("--text", "#1F1D1D");
      root.style.setProperty("--accent", "#4A6A8A");
      root.style.setProperty("--secondary", "#A8A4A0");
      root.style.setProperty("--card-bg", "#E8E6E0");
      root.style.setProperty("--border", "#B0ACA8");
    } else {
      // Mobile: Keep time-based themes
      if (theme === "morning") {
        const bgColor = "#F5F5F5";
        root.style.setProperty("--background", bgColor);
        root.style.setProperty("--bg", bgColor);
        root.style.setProperty("--text", "#4A4A4A");
        root.style.setProperty("--accent", "#AEDFF7");
        root.style.setProperty("--secondary", "#E8D8D8");
        root.style.setProperty("--card-bg", "#FDFDFD");
        root.style.setProperty("--border", "#D9D9D9");
      } else if (theme === "evening") {
        const bgColor = "#F0ECE3";
        root.style.setProperty("--background", bgColor);
        root.style.setProperty("--bg", bgColor);
        root.style.setProperty("--text", "#4A4A4A");
        root.style.setProperty("--accent", "#B0C4DE");
        root.style.setProperty("--secondary", "#D3C0B4");
        root.style.setProperty("--card-bg", "#FFF8F0");
        root.style.setProperty("--border", "#D9D9D9");
      } else if (theme === "night") {
        const bgColor = "#E8E8E8";
        root.style.setProperty("--background", bgColor);
        root.style.setProperty("--bg", bgColor);
        root.style.setProperty("--text", "#4A4A4A");
        root.style.setProperty("--accent", "#C0D6E4");
        root.style.setProperty("--secondary", "#DADADA");
        root.style.setProperty("--card-bg", "#F8F8F8");
        root.style.setProperty("--border", "#CCCCCC");
      }
    }

    // Card colors are now managed directly in components with inline styles
    // to avoid overwriting the 40+ color definitions in globals.css

  }, []);


  return null;
}
