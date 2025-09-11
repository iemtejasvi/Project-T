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
    const root = document.documentElement;
    if (theme === "morning") {
      root.style.setProperty("--background", "#F5F5F5");
      root.style.setProperty("--text", "#000000");
      root.style.setProperty("--accent", "#AEDFF7");
      root.style.setProperty("--secondary", "#E8D8D8");
      root.style.setProperty("--card-bg", "#FDFDFD");
      root.style.setProperty("--border", "#D9D9D9");
    } else if (theme === "evening") {
      root.style.setProperty("--background", "#F0ECE3");
      root.style.setProperty("--text", "#000000");
      root.style.setProperty("--accent", "#B0C4DE");
      root.style.setProperty("--secondary", "#D3C0B4");
      root.style.setProperty("--card-bg", "#FFF8F0");
      root.style.setProperty("--border", "#D9D9D9");
    } else if (theme === "night") {
      root.style.setProperty("--background", "#E8E8E8");
      root.style.setProperty("--text", "#000000");
      root.style.setProperty("--accent", "#C0D6E4");
      root.style.setProperty("--secondary", "#DADADA");
      root.style.setProperty("--card-bg", "#F8F8F8");
      root.style.setProperty("--border", "#CCCCCC");
    }

    // Set constant card color variables (they remain the same regardless of theme)
    const cardColors = {
      plain: { border: "#D9D9D9", bg: "#D9D9D9" },
      mint: { border: "#98FF98", bg: "#98FF98" },
      ruby: { border: "#FF4C4C", bg: "#FF4C4C" },
      azure: { border: "#0F52BA", bg: "#0F52BA" },
      lilac: { border: "#B57EDC", bg: "#B57EDC" },
      coral: { border: "#FF7F50", bg: "#FF7F50" },
      olive: { border: "#808000", bg: "#808000" },
      cyan: { border: "#40E0D0", bg: "#40E0D0" },
      pearl: { border: "#9966CC", bg: "#9966CC" },
      gold: { border: "#FFD700", bg: "#FFD700" },
      night: { border: "#191970", bg: "#191970" },
      jade: { border: "#50C878", bg: "#50C878" },
      rouge: { border: "#E0115F", bg: "#E0115F" },
      sky: { border: "#CCCCFF", bg: "#CCCCFF" },
      peach: { border: "#FFE5B4", bg: "#FFE5B4" },
      cloud: { border: "#87CEEB", bg: "#87CEEB" },
      sunny: { border: "#FFF44F", bg: "#FFF44F" },
      aqua: { border: "#00FFFF", bg: "#00FFFF" },
      berry: { border: "#8A2BE2", bg: "#8A2BE2" },
      steel: { border: "#383838", bg: "#383838" }
    };

    for (const [color, values] of Object.entries(cardColors)) {
      root.style.setProperty(`--color-${color}-border`, values.border);
      root.style.setProperty(`--color-${color}-bg`, values.bg);
    }
  }, []);

  return null;
}
