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

    // Set constant card color variables (they remain the same regardless of theme)
    const cardColors = {
      default: { border: "#D9D9D9", bg: "#F8F8F0" },
      mint: { border: "#98FF98", bg: "#E0FFE0" },
      cherry: { border: "#FF4C4C", bg: "#FFD6D6" },
      sapphire: { border: "#0F52BA", bg: "#DDEEFF" },
      lavender: { border: "#B57EDC", bg: "#F0E6FF" },
      coral: { border: "#FF7F50", bg: "#FFEFE6" },
      olive: { border: "#808000", bg: "#E6E6B3" },
      turquoise: { border: "#40E0D0", bg: "#E0FFFF" },
      amethyst: { border: "#9966CC", bg: "#F2E6FF" },
      gold: { border: "#FFD700", bg: "#FFF9E6" },
      midnight: { border: "#191970", bg: "#C0C0FF" },
      emerald: { border: "#50C878", bg: "#E0FFE0" },
      ruby: { border: "#E0115F", bg: "#FFD1DC" },
      periwinkle: { border: "#CCCCFF", bg: "#E6E6FF" },
      peach: { border: "#FFE5B4", bg: "#FFF5E6" },
      sky: { border: "#87CEEB", bg: "#E0F7FF" },
      lemon: { border: "#FFF44F", bg: "#FFFBE6" },
      aqua: { border: "#00FFFF", bg: "#E0FFFF" },
      berry: { border: "#8A2BE2", bg: "#E6D6FF" },
      graphite: { border: "#383838", bg: "#D3D3D3" },
    };

    for (const [color, values] of Object.entries(cardColors)) {
      root.style.setProperty(`--color-${color}-border`, values.border);
      root.style.setProperty(`--color-${color}-bg`, values.bg);
    }
  }, []);

  return null;
}
