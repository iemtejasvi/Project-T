"use client";
import { useEffect } from "react";

export default function ThemeSwitcher() {
  useEffect(() => {
    const hour = new Date().getHours();
    let theme = "morning";
    if (hour >= 12 && hour < 18) {
      theme = "evening";
    } else if (hour >= 18 || hour < 6) {
      theme = "night";
    }
    const root = document.documentElement;
    if (theme === "morning") {
      root.style.setProperty("--background", "#F5F5F5");
      root.style.setProperty("--text", "#4A4A4A");
      root.style.setProperty("--accent", "#AEDFF7");
      root.style.setProperty("--secondary", "#E8D8D8");
      root.style.setProperty("--card-bg", "#FDFDFD");
      root.style.setProperty("--border", "#D9D9D9");
    } else if (theme === "evening") {
      root.style.setProperty("--background", "#F0ECE3");
      root.style.setProperty("--text", "#4A4A4A");
      root.style.setProperty("--accent", "#B0C4DE");
      root.style.setProperty("--secondary", "#D3C0B4");
      root.style.setProperty("--card-bg", "#FFF8F0");
      root.style.setProperty("--border", "#D9D9D9");
    } else if (theme === "night") {
      root.style.setProperty("--background", "#E8E8E8");
      root.style.setProperty("--text", "#4A4A4A");
      root.style.setProperty("--accent", "#C0D6E4");
      root.style.setProperty("--secondary", "#DADADA");
      root.style.setProperty("--card-bg", "#F8F8F8");
      root.style.setProperty("--border", "#CCCCCC");
    }
  }, []);

  return null;
}
