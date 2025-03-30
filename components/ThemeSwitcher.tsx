"use client";
import { useEffect } from "react";

export default function ThemeSwitcher() {
  useEffect(() => {
    const hour = new Date().getHours();
    let themeClass = "morning";
    if (hour >= 12 && hour < 18) {
      themeClass = "evening";
    } else if (hour >= 18 || hour < 6) {
      themeClass = "night";
    }
    document.documentElement.classList.remove("morning", "evening", "night");
    document.documentElement.classList.add(themeClass);
  }, []);

  return null;
}
