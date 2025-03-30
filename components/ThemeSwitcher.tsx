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

    // Set color variables for card borders and backgrounds.
    // These variables ensure the chosen card colors are consistent across themes.
    const colors = {
      default: { border: "#A0AEC0", bg: "#FDFDFD" },
      blue: { border: "#63B3ED", bg: "#EBF8FF" },
      gray: { border: "#A0AEC0", bg: "#F7FAFC" },
      purple: { border: "#B794F4", bg: "#FAF5FF" },
      navy: { border: "#5A9BD3", bg: "#EBF8FF" },
      maroon: { border: "#E57373", bg: "#FFF5F5" },
      pink: { border: "#F687B3", bg: "#FFF5F7" },
      teal: { border: "#38B2AC", bg: "#E6FFFA" },
      olive: { border: "#A9B665", bg: "#F0FFF4" },
      mustard: { border: "#FFDB58", bg: "#FFFFF0" },
      coral: { border: "#FF9A8B", bg: "#FFF5F0" },
      lavender: { border: "#E6E6FA", bg: "#F8F8FF" },
      mint: { border: "#98FF98", bg: "#F0FFF0" },
      aqua: { border: "#00FFFF", bg: "#F0FFFF" },
      peach: { border: "#FFE5B4", bg: "#FFF5EE" },
      sky: { border: "#87CEEB", bg: "#F0F8FF" },
      rose: { border: "#FF007F", bg: "#FFF0F5" },
      sapphire: { border: "#0F52BA", bg: "#F0F8FF" },
      emerald: { border: "#50C878", bg: "#F0FFF0" },
      amber: { border: "#FFBF00", bg: "#FFFAF0" },
    };

    for (const [color, values] of Object.entries(colors)) {
      root.style.setProperty(`--color-${color}-border`, values.border);
      root.style.setProperty(`--color-${color}-bg`, values.bg);
    }
  }, []);

  return null;
}
