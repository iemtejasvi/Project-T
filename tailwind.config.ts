import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 255, 255, 0)' },
          '50%': { boxShadow: '0 0 15px rgba(255, 255, 255, 0.4)' },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s infinite ease-in-out',
      }
    },
  },
  plugins: [],
} satisfies Config;
