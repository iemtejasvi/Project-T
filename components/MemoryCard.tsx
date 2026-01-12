"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CursiveText from './CursiveText';
import HandwrittenText from './HandwrittenText';
import { laBelleAurore } from '@/lib/fonts';
import "../app/globals.css";
import { typewriterSubTags, typewriterPromptsBySubTag } from './typewriterPrompts';

const BurnOverlay: React.FC<{ enabled: boolean; intensity: number; className?: string }> = ({ enabled, intensity, className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const variantRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      startRef.current = 0;
      return;
    }

    if (!startRef.current) {
      startRef.current = performance.now();
      variantRef.current = Math.floor(Math.random() * 24);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const hash = (n: number) => {
      const x = Math.sin(n) * 43758.5453;
      return x - Math.floor(x);
    };

    const getVariant = (v: number) => {
      const variants = [
        { pattern: 'smoke', speed: 0.7, height: 0.7, density: 0.9, flicker: 0.85, sway: 0.6, ember: 0.4, smoke: 1.7, dark: 1.35, fire: 0.0 },
        { pattern: 'bottom', speed: 0.75, height: 0.85, density: 0.95, flicker: 0.85, sway: 0.65, ember: 0.8, smoke: 1.35, dark: 1.15, fire: 0.55 },
        { pattern: 'bottom', speed: 0.9, height: 1.0, density: 1.0, flicker: 0.95, sway: 0.75, ember: 1.0, smoke: 1.0, dark: 1.0, fire: 0.95 },
        { pattern: 'bottom', speed: 1.15, height: 1.1, density: 1.15, flicker: 1.15, sway: 0.9, ember: 1.2, smoke: 0.95, dark: 0.95, fire: 1.1 },
        { pattern: 'bottom', speed: 1.35, height: 1.25, density: 1.25, flicker: 1.35, sway: 1.05, ember: 1.35, smoke: 0.85, dark: 0.9, fire: 1.25 },
        { pattern: 'bottom', speed: 1.5, height: 1.05, density: 1.35, flicker: 1.45, sway: 0.95, ember: 1.45, smoke: 0.8, dark: 0.9, fire: 1.35 },

        { pattern: 'sides', speed: 0.8, height: 0.9, density: 1.05, flicker: 0.9, sway: 0.75, ember: 0.85, smoke: 1.25, dark: 1.1, fire: 0.8 },
        { pattern: 'sides', speed: 1.05, height: 1.0, density: 1.15, flicker: 1.1, sway: 0.85, ember: 1.05, smoke: 1.05, dark: 1.0, fire: 1.0 },
        { pattern: 'sides', speed: 1.35, height: 1.1, density: 1.3, flicker: 1.35, sway: 1.0, ember: 1.15, smoke: 0.9, dark: 0.95, fire: 1.15 },
        { pattern: 'sides', speed: 0.75, height: 0.75, density: 0.95, flicker: 0.85, sway: 0.7, ember: 0.65, smoke: 1.55, dark: 1.25, fire: 0.5 },

        { pattern: 'bottom+sides', speed: 0.85, height: 0.9, density: 1.0, flicker: 0.95, sway: 0.75, ember: 0.95, smoke: 1.2, dark: 1.05, fire: 0.9 },
        { pattern: 'bottom+sides', speed: 1.0, height: 1.05, density: 1.1, flicker: 1.1, sway: 0.85, ember: 1.1, smoke: 1.05, dark: 1.0, fire: 1.0 },
        { pattern: 'bottom+sides', speed: 1.25, height: 1.2, density: 1.25, flicker: 1.25, sway: 0.95, ember: 1.25, smoke: 0.95, dark: 0.95, fire: 1.15 },
        { pattern: 'bottom+sides', speed: 1.4, height: 1.35, density: 1.35, flicker: 1.35, sway: 1.05, ember: 1.35, smoke: 0.9, dark: 0.9, fire: 1.25 },

        { pattern: 'full', speed: 0.8, height: 0.95, density: 0.95, flicker: 0.95, sway: 0.9, ember: 0.85, smoke: 1.5, dark: 1.25, fire: 0.5 },
        { pattern: 'full', speed: 0.95, height: 1.1, density: 1.15, flicker: 1.1, sway: 1.0, ember: 1.15, smoke: 1.05, dark: 1.05, fire: 0.95 },
        { pattern: 'full', speed: 1.2, height: 1.25, density: 1.25, flicker: 1.25, sway: 1.05, ember: 1.25, smoke: 0.95, dark: 1.0, fire: 1.1 },
        { pattern: 'full', speed: 1.35, height: 1.35, density: 1.3, flicker: 1.35, sway: 1.1, ember: 1.35, smoke: 0.9, dark: 0.95, fire: 1.15 },
        { pattern: 'full', speed: 1.55, height: 1.05, density: 1.45, flicker: 1.55, sway: 1.1, ember: 1.45, smoke: 0.8, dark: 0.9, fire: 1.25 },

        { pattern: 'bottom', speed: 0.65, height: 0.7, density: 0.85, flicker: 0.8, sway: 0.6, ember: 0.6, smoke: 1.6, dark: 1.25, fire: 0.35 },
        { pattern: 'sides', speed: 1.25, height: 1.15, density: 1.2, flicker: 1.25, sway: 0.95, ember: 1.0, smoke: 0.95, dark: 0.95, fire: 1.05 },
        { pattern: 'bottom+sides', speed: 0.75, height: 0.85, density: 1.15, flicker: 0.95, sway: 0.75, ember: 0.95, smoke: 1.35, dark: 1.15, fire: 0.75 },
        { pattern: 'smoke', speed: 1.1, height: 0.9, density: 1.0, flicker: 1.0, sway: 0.75, ember: 0.35, smoke: 1.9, dark: 1.4, fire: 0.0 },
      ] as const;
      return variants[v % variants.length];
    };

    const draw = (now: number) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const t = now - startRef.current;

      const i = Math.max(0, Math.min(1, intensity));
      const v = getVariant(variantRef.current);

      const tScaled = t * v.speed;

      ctx.clearRect(0, 0, w, h);

      const edge = 0.10 + i * 0.22;
      const smokePhase = i >= 0.98 ? Math.min(1, (i - 0.98) / 0.02) : 0;
      const phase = smokePhase;

      // char/darkness
      ctx.globalCompositeOperation = 'source-over';
      const charA = (0.05 + i * 0.30) * v.dark + phase * 0.22;
      ctx.fillStyle = `rgba(10, 0, 0, ${charA})`;
      ctx.fillRect(0, 0, w, h);

      // charred edges vignette
      const edgeGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * (0.25 - edge * 0.15), w * 0.5, h * 0.45, Math.min(w, h) * 0.75);
      edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
      edgeGrad.addColorStop(0.55, `rgba(20,10,0,${0.05 + i * 0.18})`);
      edgeGrad.addColorStop(1, `rgba(0,0,0,${0.14 + i * 0.32})`);
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, w, h);

      // burn line glow near edges
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = `rgba(255, 80, 0, ${0.10 + i * 0.25})`;
      ctx.shadowBlur = 8 + i * 22;
      const edgeGlow = ctx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.15, w * 0.5, h * 0.45, Math.min(w, h) * 0.75);
      edgeGlow.addColorStop(0, 'rgba(0,0,0,0)');
      edgeGlow.addColorStop(0.6, `rgba(255,140,40,${0.04 + i * 0.10})`);
      edgeGlow.addColorStop(1, `rgba(255,80,0,${0.03 + i * 0.10})`);
      ctx.fillStyle = edgeGlow;
      ctx.fillRect(0, 0, w, h);
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';

      // hot glow vignette
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.75, Math.min(w, h) * 0.05, w * 0.5, h * 0.75, Math.min(w, h) * 0.9);
      glow.addColorStop(0, `rgba(255, 120, 0, ${0.06 + i * 0.18})`);
      glow.addColorStop(0.5, `rgba(255, 40, 0, ${0.03 + i * 0.10})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const flameStrength = (1 - phase) * (v.fire || 0);
      if (flameStrength > 0.01 && v.pattern !== 'smoke') {
        const cols = Math.max(10, Math.floor((26 + i * 54) * v.density));
        const colW = w / cols;
        const baseHeight = h * (0.22 + i * 0.55) * flameStrength * v.height;
        const flicker = (1 + i * 1.8) * v.flicker;

        const drawBottom = v.pattern === 'bottom' || v.pattern === 'bottom+sides' || v.pattern === 'full';
        const drawSides = v.pattern === 'sides' || v.pattern === 'bottom+sides' || v.pattern === 'full';

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.65 + 0.25 * (1 - phase);

        if (drawBottom) {
          for (let c = 0; c < cols; c++) {
            const seed = c * 13.37;
            const n1 = hash(seed + Math.floor(tScaled / 17));
            const n2 = hash(seed + 99.1 + Math.floor(tScaled / 31));
            const x = c * colW;
            const sway = (n2 - 0.5) * colW * v.sway;
            const hMul = 0.55 + n1 * 0.9;
            const flameH = baseHeight * hMul * (0.70 + 0.30 * Math.sin((tScaled / 70 + seed) * flicker));

            const gx = x + colW / 2 + sway;
            const gy = h;

            const grad = ctx.createLinearGradient(gx, gy, gx, gy - flameH);
            grad.addColorStop(0, `rgba(255, 150, 55, ${(0.16 + i * 0.18) * flameStrength})`);
            grad.addColorStop(0.4, `rgba(225, 95, 20, ${(0.14 + i * 0.20) * flameStrength})`);
            grad.addColorStop(0.78, `rgba(255, 210, 120, ${(0.07 + i * 0.12) * flameStrength})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            const width = colW * (0.9 + n2 * 0.8);
            ctx.beginPath();
            ctx.moveTo(gx - width / 2, gy);
            ctx.quadraticCurveTo(gx, gy - flameH, gx + width / 2, gy);
            ctx.closePath();
            ctx.fill();
          }
        }

        if (drawSides) {
          const rows = Math.max(12, Math.floor((18 + i * 42) * v.density));
          const rowH = h / rows;
          const sideBase = w * (0.08 + i * 0.28) * v.height * (0.6 + 0.4 * flameStrength);
          for (let r = 0; r < rows; r++) {
            const seed = r * 21.73;
            const n1 = hash(seed + Math.floor(tScaled / 19));
            const n2 = hash(seed + 77.3 + Math.floor(tScaled / 33));
            const y = r * rowH + rowH * 0.5 + (n2 - 0.5) * rowH * 0.6;
            const wMul = 0.55 + n1 * 0.9;
            const flameW = sideBase * wMul * (0.70 + 0.30 * Math.sin((tScaled / 85 + seed) * flicker));

            const leftGrad = ctx.createLinearGradient(0, y, flameW, y);
            leftGrad.addColorStop(0, `rgba(255, 150, 55, ${(0.13 + i * 0.16) * flameStrength})`);
            leftGrad.addColorStop(0.5, `rgba(225, 95, 20, ${(0.12 + i * 0.18) * flameStrength})`);
            leftGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = leftGrad;
            ctx.beginPath();
            ctx.moveTo(0, y - rowH * 0.55);
            ctx.quadraticCurveTo(flameW, y, 0, y + rowH * 0.55);
            ctx.closePath();
            ctx.fill();

            const rx0 = w;
            const rx1 = w - flameW;
            const rightGrad = ctx.createLinearGradient(rx0, y, rx1, y);
            rightGrad.addColorStop(0, `rgba(255, 150, 55, ${(0.13 + i * 0.16) * flameStrength})`);
            rightGrad.addColorStop(0.5, `rgba(225, 95, 20, ${(0.12 + i * 0.18) * flameStrength})`);
            rightGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = rightGrad;
            ctx.beginPath();
            ctx.moveTo(w, y - rowH * 0.55);
            ctx.quadraticCurveTo(w - flameW, y, w, y + rowH * 0.55);
            ctx.closePath();
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1;
      }

      // smoke top vignette
      ctx.globalCompositeOperation = 'source-over';
      const smokeA = (0.05 + i * 0.14 + phase * 0.22) * v.smoke;
      const smoke = ctx.createLinearGradient(0, 0, 0, h);
      smoke.addColorStop(0, `rgba(0,0,0,${smokeA})`);
      smoke.addColorStop(0.5, `rgba(0,0,0,0)`);
      ctx.fillStyle = smoke;
      ctx.fillRect(0, 0, w, h);

      // full-screen smoke fade at end
      if (phase > 0) {
        ctx.globalCompositeOperation = 'source-over';
        const fade = 0.10 + phase * 0.38;
        ctx.fillStyle = `rgba(40, 40, 40, ${fade})`;
        ctx.fillRect(0, 0, w, h);
      }

      // screen-filling smoke sweep near the end
      if (i > 0.7 || phase > 0) {
        ctx.globalCompositeOperation = 'source-over';
        const sweepA = (Math.max(0, i - 0.7) / 0.3) * 0.10 + phase * 0.28;
        const sweep = ctx.createLinearGradient(0, 0, w, 0);
        sweep.addColorStop(0, `rgba(55,55,55,${sweepA})`);
        sweep.addColorStop(0.5, `rgba(55,55,55,${sweepA * 0.6})`);
        sweep.addColorStop(1, `rgba(55,55,55,${sweepA})`);
        ctx.fillStyle = sweep;
        ctx.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
  }, [enabled, intensity]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  reveal_at?: string;
  destruct_at?: string;
  time_capsule_delay_minutes?: number;
  status: string;
  color: string;
  full_bg: boolean;
  letter_style?: string;
  animation?: string;
  pinned?: boolean;
  ip?: string;
  country?: string;
  uuid?: string;
  tag?: string;
  sub_tag?: string;
  pinned_until?: string;
  typewriter_enabled?: boolean;
}

interface MemoryCardProps {
  memory: Memory;
  detail?: boolean;
  variant?: "default" | "home";
}

const DESTRUCTED_MESSAGES = [
  "This memory has faded. The words are gone.",
  "Only silence remains where this message used to be.",
  "This message has been destructed. Nothing can be recovered.",
  "What was here is gone now.",
  "The message is gone, but the memory remains.",
  "This message disappeared when its time ran out.",
  "These words are no longer here.",
  "This memory holds an empty space where the message once lived.",
  "The message has vanished.",
  "Gone. Like it was never written.",
  "This message was meant to disappear.",
  "Nothing is left to read.",
  "The ink is gone. The feeling stays.",
  "This message is no longer available.",
  "This space is all that remains.",
  "The message has been erased by time.",
  "Only the outline of a memory remains.",
  "This message has slipped away.",
  "Some words don’t last. This one didn’t.",
  "A quiet end: this message is gone.",
  "You arrived after the ending.",
  "The page is blank now.",
  "There’s nothing left to recover.",
  "The words didn’t survive.",
  "Time took the message first.",
  "You missed it by a moment—or a lifetime.",
  "The message expired. The space stayed.",
  "This was here. Now it isn’t.",
  "It ended before you opened it.",
  "A message that chose to vanish.",
  "This line is all that’s left.",
  "It’s gone, and it won’t come back.",
  "Nothing to read. Only the fact it existed.",
  "The message ran out of time.",
  "You’re late. The words are gone.",
  "The message has already left.",
  "An empty place where meaning used to be.",
  "This memory kept its shape, not its words.",
  "The message is beyond reach now."
];



const TypewriterPrompt: React.FC<{ tag?: string; subTag?: string; typewriterEnabled?: boolean }> = ({ tag, subTag, typewriterEnabled }) => {
  // For new memories: use the typewriter_enabled field
  // For old memories: show typewriter by default (typewriter_enabled will be undefined)
  const isDisabled = typewriterEnabled === false;

  const prompts = useMemo(() => {
    // If we have a specific subTag (short tag), use prompts from that subcategory
    if (subTag && subTag !== "undefined" && subTag !== "null" && typewriterPromptsBySubTag[subTag]) {
      return typewriterPromptsBySubTag[subTag];
    }
    
    // If we have a main tag, use all prompts from that tag
    if (tag && typewriterSubTags[tag]) {
      const allPrompts: string[] = [];
      typewriterSubTags[tag].forEach(subTag => {
        const subPrompts = typewriterPromptsBySubTag[subTag] || [];
        allPrompts.push(...subPrompts);
      });
      
      return allPrompts.length > 0 ? allPrompts : typewriterPromptsBySubTag["other_feeling"] || [];
    }
    
    // If no tag is selected, show a mix of all categories
    const mixedPrompts: string[] = [];
    Object.values(typewriterPromptsBySubTag).forEach(categoryPrompts => {
      // Take 1-2 random prompts from each category to create a diverse mix
      const shuffled = [...categoryPrompts].sort(() => 0.5 - Math.random());
      mixedPrompts.push(...shuffled.slice(0, Math.min(2, shuffled.length)));
    });
    
    // Shuffle the mixed prompts and limit to a reasonable number
    return mixedPrompts.sort(() => 0.5 - Math.random()).slice(0, 20);
  }, [tag, subTag]);

  const randomOffset = useMemo(() => Math.random() * 1000, []);
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Math.random() * prompts.length)
  );
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentPrompt = prompts[currentIndex];
    let delay = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === 0) {
      delay += randomOffset;
    }
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentPrompt.substring(0, charIndex + 1));
        if (charIndex + 1 === currentPrompt.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else {
          setCharIndex(charIndex + 1);
        }
      } else {
        setDisplayedText(currentPrompt.substring(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          // Ensure we get a different random index
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * prompts.length);
          } while (newIndex === currentIndex && prompts.length > 1);
          setCurrentIndex(newIndex);
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, prompts, randomOffset]);

  if (isDisabled) {
    return <></>;
  }

  return (
    <div className="min-h-[2rem] text-center text-sm text-[var(--text)] font-serif transition-all duration-300 break-words" style={{ 
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      hyphens: 'none',
      WebkitHyphens: 'none',
      msHyphens: 'none',
      MozHyphens: 'none'
    }}>
      {displayedText}
    </div>
  );
};

const ScrollableMessage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setNeedsScroll(
        containerRef.current.scrollHeight > containerRef.current.clientHeight
      );
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2 ${
        needsScroll ? "cute_scroll" : ""
      }`}
      style={style}
    >
      {children}
    </div>
  );
};

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, detail, variant = "default" }) => {
  const [flipped, setFlipped] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    setIsClient(true);
    window.addEventListener("resize", checkDesktop);
    return () => {
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  const allowedColors = new Set([
    "default",
    "aqua",
    "azure",
    "berry",
    "brass",
    "bronze",
    "clay",
    "cloud",
    "copper",
    "coral",
    "cream",
    "cyan",
    "dune",
    "garnet",
    "gold",
    "honey",
    "ice",
    "ivory",
    "jade",
    "lilac",
    "mint",
    "moss",
    "night",
    "ocean",
    "olive",
    "peach",
    "pearl",
    "pine",
    "plum",
    "rose",
    "rouge",
    "ruby",
    "sage",
    "sand",
    "sepia",
    "sky",
    "slate",
    "steel",
    "sunny",
    "teal",
    "wine"
  ]);
  const colorMapping: Record<string, string> = { 
    plain: "default",
    cherry: "ruby",
    sapphire: "azure",
    lavender: "lilac",
    turquoise: "cyan",
    amethyst: "pearl",
    midnight: "night",
    emerald: "jade",
    periwinkle: "sky",
    lemon: "sunny",
    graphite: "steel",
    "dusty-rose": "rose",
    "vintage-blue": "ice",
    terracotta: "clay",
    mustard: "honey",
    parchment: "ivory",
    burgundy: "wine",
    "antique-brass": "brass",
    "forest-green": "pine",
    maroon: "garnet",
    navy: "ocean",
    khaki: "sand"
  };

  // Direct hex values with more saturated/visible colors (20-30% darker than CSS variables)
  const colorBgMap: Record<string, string> = {
    default: "#E8E0D0",
    aqua: "#B8D8D8",      // was #E0EBEB
    azure: "#C0D0DB",     // was #E4E8EB
    berry: "#D1C3D8",     // was #E9E3E8
    brass: "#E0D8C8",     // was #F0EDE8
    bronze: "#DDC7B0",    // was #EDE7E0
    clay: "#E0C5B2",      // was #F0E5E2
    cloud: "#DCDFF1",     // was #ECEFF1
    copper: "#E0C8B3",    // was #F0E8E3
    coral: "#E3C6B2",     // was #F3E6E2
    cream: "#E5E3CD",     // was #F5F3ED
    cyan: "#C2DCDC",      // was #E2ECEC
    dune: "#E2DECA",      // was #F2F0EA
    garnet: "#D8C0C0",    // was #E8E0E0
    gold: "#E3E0C4",      // was #F3F0E4
    honey: "#E3CDC3",     // was #F3EDE3
    ice: "#C7CBCD",       // was #E7EBED
    ivory: "#E6E5D2",     // was #F6F5F2
    jade: "#C5DCC8",      // was #E5ECE8
    lilac: "#DBC8DD",     // was #EBE8ED
    mint: "#C9E0C9",      // was #E9F0E9
    moss: "#C6D8C2",      // was #E6E8E2
    night: "#C1C3D9",     // was #E1E3E9
    ocean: "#C2C6DA",     // was #E2E6EA
    olive: "#DCDAC2",     // was #EAEAE2
    peach: "#E5CDC7",     // was #F5EDE7
    pearl: "#DCC9DE",     // was #ECE9EE
    pine: "#C2D6C3",      // was #E2E6E3
    plum: "#D7C2C4",      // was #E7E2E4
    rose: "#E2CACB",      // was #F2EAEB
    rouge: "#E0C6C8",     // was #F0E6E8
    ruby: "#E1C3C3",      // was #F1E3E3
    sage: "#DADCC8",      // was #EAECE8
    sand: "#E5E2CA",      // was #F5F2EA
    sepia: "#D9D5C2",     // was #E9E5E2
    sky: "#DBDFE4",       // was #EBEFF4
    slate: "#D6D8DA",     // was #E6E8EA
    steel: "#D8D9DA",     // was #E8E9EA
    sunny: "#E6E4C9",     // was #F6F4E9
    teal: "#C2DBDA",      // was #E2EBEA
    wine: "#D9C3C4"       // was #E9E3E4
  };
  let effectiveColor = memory.color;
  if (!allowedColors.has(memory.color)) {
    effectiveColor = colorMapping[memory.color] || "default";
  }

  const borderStyle = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)'
  };

  const bgStyle =
    effectiveColor === "default"
      ? { backgroundColor: colorBgMap.default }
      : memory.full_bg
      ? { backgroundColor: colorBgMap[effectiveColor] || colorBgMap.default }
      : {};

  const arrowStyle =
    effectiveColor === "default"
      ? { color: "#D9D9D9" }
      : { color: `var(--color-${effectiveColor}-border)` };

  const dateStr = new Date(memory.created_at).toLocaleDateString();
  const timeStr = new Date(memory.created_at).toLocaleTimeString();
  const dayStr = new Date(memory.created_at).toLocaleDateString(undefined, { weekday: "long" });

  const timeCapsuleDelayMinutes = useMemo(() => {
    const rawDelayMinutes = (memory as unknown as Record<string, unknown>).time_capsule_delay_minutes;
    const delayMinutes =
      typeof rawDelayMinutes === 'number'
        ? rawDelayMinutes
        : (typeof rawDelayMinutes === 'string' ? Number(rawDelayMinutes) : 0);
    return Number.isFinite(delayMinutes) ? delayMinutes : 0;
  }, [memory]);

  const createdAgoLabel = useMemo(() => {
    const createdTs = new Date(memory.created_at).getTime();
    const minute = 60 * 1000;
    const allowedDelaysMinutes = [
      5, 10, 15, 20, 30, 45, 60,
      7 * 24 * 60,
      30 * 24 * 60,
      3 * 30 * 24 * 60,
      6 * 30 * 24 * 60,
      9 * 30 * 24 * 60,
      365 * 24 * 60,
    ];
    const hasExplicitTimeCapsule = Number.isFinite(timeCapsuleDelayMinutes) && timeCapsuleDelayMinutes > 0;
    let isTimeCapsulePreset = false;
    if (hasExplicitTimeCapsule) {
      isTimeCapsulePreset = true;
    } else {
      const revealAt = memory.reveal_at;
      if (typeof revealAt !== 'string' || revealAt.length === 0) return null;
      const revealTs = new Date(revealAt).getTime();
      if (!Number.isFinite(createdTs) || !Number.isFinite(revealTs)) return null;
      if (revealTs <= createdTs) return null;
      const diffMsPreset = revealTs - createdTs;
      isTimeCapsulePreset = allowedDelaysMinutes.some((m) => {
        const target = m * minute;
        const tolerance = Math.min(2 * minute, target * 0.02);
        return Math.abs(diffMsPreset - target) <= tolerance;
      });
    }

    if (!isTimeCapsulePreset) return null;
    if (!Number.isFinite(createdTs)) return null;

    const diffMs = Date.now() - createdTs;
    if (!Number.isFinite(diffMs) || diffMs < 0) return null;

    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    const fmt = (n: number, unit: string) => `This memory was created ${n} ${unit}${n === 1 ? '' : 's'} ago`;

    if (diffMs >= year) return fmt(Math.floor(diffMs / year), 'year');
    if (diffMs >= month) return fmt(Math.floor(diffMs / month), 'month');
    if (diffMs >= week) return fmt(Math.floor(diffMs / week), 'week');
    if (diffMs >= day) return fmt(Math.floor(diffMs / day), 'day');
    if (diffMs >= hour) return fmt(Math.floor(diffMs / hour), 'hour');
    if (diffMs >= minute) return fmt(Math.floor(diffMs / minute), 'minute');
    return 'This memory was created just now';
  }, [memory.created_at, memory.reveal_at, timeCapsuleDelayMinutes]);

  const destructAtTs = useMemo(() => {
    const d = memory.destruct_at;
    if (typeof d !== 'string' || d.length === 0) return null;
    const ts = new Date(d).getTime();
    if (!Number.isFinite(ts)) return null;
    return ts;
  }, [memory.destruct_at]);

  const destructAtLabel = useMemo(() => {
    const d = memory.destruct_at;
    if (typeof d !== 'string' || d.length === 0) return null;
    const ts = new Date(d).getTime();
    if (!Number.isFinite(ts)) return null;
    return new Date(ts).toLocaleString();
  }, [memory.destruct_at]);

  const isApproved = useMemo(() => {
    return String(memory.status || '').toLowerCase() === 'approved';
  }, [memory.status]);

  const computeIsDestructedNow = useMemo(() => {
    const messageEmpty = typeof memory.message === 'string' && memory.message.trim().length === 0;
    if (messageEmpty) return true;
    if (!isApproved) return false;
    if (destructAtTs === null) return false;
    return destructAtTs <= Date.now();
  }, [destructAtTs, isApproved, memory.message]);

  const [isDestructedNow, setIsDestructedNow] = useState<boolean>(computeIsDestructedNow);

  useEffect(() => {
    setIsDestructedNow((prev) => (prev === computeIsDestructedNow ? prev : computeIsDestructedNow));
  }, [computeIsDestructedNow, memory.id]);

  useEffect(() => {
    if (!isApproved) return;
    if (destructAtTs === null) return;
    if (isDestructedNow) return;
    const delay = destructAtTs - Date.now();
    if (!Number.isFinite(delay) || delay <= 0) {
      setIsDestructedNow(true);
      return;
    }
    const t = setTimeout(() => setIsDestructedNow(true), delay);
    return () => clearTimeout(t);
  }, [destructAtTs, isApproved, isDestructedNow]);

  const isBurningNow = useMemo(() => {
    if (!isApproved) return false;
    if (destructAtTs === null) return false;
    if (isDestructedNow) return false;
    return destructAtTs > Date.now();
  }, [destructAtTs, isApproved, isDestructedNow]);

  const burnIntensity = useMemo(() => {
    if (!isBurningNow) return 0;
    if (destructAtTs === null) return 0;
    const remainingMs = destructAtTs - Date.now();
    if (!Number.isFinite(remainingMs) || remainingMs <= 0) return 0;
    const windowMs = 60 * 1000;
    const t = Math.min(1, Math.max(0, 1 - remainingMs / windowMs));
    return t;
  }, [isBurningNow, destructAtTs]);

  const burnAwayStyle = useMemo(() => {
    if (!isBurningNow) return undefined;
    const t = burnIntensity;
    if (t <= 0) return undefined;
    return {
      opacity: 1 - t * 0.65,
      filter: `blur(${t * 1.6}px)`,
      transform: `translateY(${t * 6}px)`,
    } as React.CSSProperties;
  }, [burnIntensity, isBurningNow]);

  const destructedMessage = useMemo(() => {
    const idx = Math.floor(Math.random() * DESTRUCTED_MESSAGES.length);
    return DESTRUCTED_MESSAGES[idx];
  }, []);

  const handleCardClick = () => {
    if (!detail) {
      setFlipped(!flipped);
    }
  };

  const renderMessage = (memory: Memory, forceLarge?: boolean) => {
    if (isDestructedNow) {
      return (
        <div className={`${forceLarge ? 'text-[16px]' : 'text-[14px]'} leading-snug break-words hyphens-none opacity-90 font-mono`}>
          <p className="tracking-tight">
            This message was destructed{destructAtLabel ? ` at ${destructAtLabel}` : ''}. You’re late to read it.
          </p>
          <p className="mt-3 opacity-80">{destructedMessage}</p>
        </div>
      );
    }
    const messageToRender = memory.message;
    const wordCount = messageToRender.split(/[\s.]+/).filter(word => word.length > 0).length;
    const isShortOrExact = wordCount <= 30;
    const textClass = forceLarge
      ? "text-[26px] tracking-wide leading-snug break-words hyphens-none"
      : isShortOrExact
        ? "text-[22px] tracking-wide leading-snug break-words hyphens-none"
        : "text-[19px] tracking-wide leading-snug break-words hyphens-none";
    
    switch (memory.animation) {
      case "cursive":
        return (
          <CursiveText
            message={messageToRender}
            textClass={textClass}
            effectiveColor={effectiveColor}
          />
        );
      case "handwritten":
        return <HandwrittenText message={messageToRender} textClass={textClass} />;
      case "rough":
        // Use handwritten text sizing/feel; card-level background handles rough paper
        return <p className={`${textClass} ${laBelleAurore.className} pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased`}>{messageToRender}</p>;
      default:
        return (
          <div className="space-y-2">
            <p className={textClass}>{messageToRender}</p>
          </div>
        );
    }
  };

  if (detail) {
    // Show loading state until client-side detection is complete
    if (!isClient) {
      return (
        <div className="w-full max-w-md mx-auto my-6 p-6 rounded-xl bg-[var(--card-bg)] flex items-center justify-center min-h-[300px]">
          <div className="flex items-center gap-2 text-[var(--text)] opacity-60">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      );
    }
    // Large message renderer for detail desktop
    function renderMessageLargeDetail(memory: Memory) {
      if (isDestructedNow) {
        return (
          <div className="text-xl sm:text-2xl leading-snug break-words hyphens-none opacity-90 font-mono">
            <p className="tracking-tight">
              This message was destructed{destructAtLabel ? ` at ${destructAtLabel}` : ''}. You’re late to read it.
            </p>
            <p className="mt-4 opacity-80">{destructedMessage}</p>
          </div>
        );
      }
      const wordCount = memory.message.split(/\s+/).length;
      const isShortOrExact = wordCount <= 30;
      const textClass = isShortOrExact
        ? "text-5xl tracking-wide leading-snug break-words hyphens-none"
        : "text-4xl tracking-wide leading-snug break-words hyphens-none";
      switch (memory.animation) {
        case "cursive":
          return (
            <CursiveText
              message={memory.message}
              textClass={textClass}
              effectiveColor={effectiveColor}
            />
          );
        case "handwritten":
          return <HandwrittenText message={memory.message} textClass={textClass} />;
        case "rough":
          // Use handwritten text sizing/feel; card-level background handles rough paper
          return <p className={`${textClass} ${laBelleAurore.className} pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased`}>{memory.message}</p>;
        default:
          return (
            <div className="space-y-2">
              <p className={textClass}>{memory.message}</p>
            </div>
          );
      }
    }
    return (
      <div
        className={
          isDesktop
            ? "w-full max-w-3xl mx-auto my-12 p-12 rounded-[2rem] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[var(--border)]/40 bg-[var(--card-bg)] flex flex-col items-center justify-center relative overflow-hidden"
            : "w-full max-w-[520px] mx-auto my-6 p-6 rounded-[1.5rem] shadow-[0_10px_24px_rgba(0,0,0,0.12)] border border-[var(--border)]/40 bg-[var(--card-bg)] flex flex-col items-center justify-center relative overflow-hidden min-h-[50vh]"
        }
        style={{ ...bgStyle, ...borderStyle }}
      >
        <BurnOverlay enabled={isBurningNow} intensity={burnIntensity} className="absolute inset-0 z-[30] pointer-events-none" />
        {/* Rough paper defs and overlay for detail view */}
        {memory.animation === "rough" && (
          <>
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
              <defs>
                <filter id="roughpaper">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                  <feDiffuseLighting lightingColor="white" diffuseConstant="1" surfaceScale="2" result="diffLight">
                    <feDistantLight azimuth="45" elevation="35" />
                  </feDiffuseLighting>
                </filter>
              </defs>
            </svg>
            <div
              aria-hidden
              className="absolute inset-0 rounded-[inherit]"
              style={{
                filter: "url(#roughpaper)",
                background:
                  effectiveColor && effectiveColor !== "default"
                    ? `var(--color-${effectiveColor}-bg)`
                    : "#e8e6df",
                opacity: 0.55,
                zIndex: 0,
              }}
            />
          </>
        )}


        {/* Header section */}
        <div className="w-full flex flex-col items-center relative z-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <h3 className={`${isDesktop ? "text-xl opacity-75 font-medium tracking-wide" : "text-2xl font-bold"} text-[var(--text)] text-center leading-tight drop-shadow-sm`}>
              To: {memory.recipient}
            </h3>
          </div>
          
          {memory.sender && (
            <p className={`${isDesktop ? "text-xl opacity-75 font-medium tracking-wide" : "text-base italic font-light"} text-[var(--text)] mb-3 sm:mb-4 text-center`}>
              From: {memory.sender}
            </p>
          )}
          
          <hr className="my-2 border-[#999999] w-full" />
        </div>

        {/* Message section */}
        <div className="w-full flex-1 flex flex-col justify-center items-center my-4 sm:my-8 relative z-10">
          <div style={burnAwayStyle} className={`${isDesktop ? "text-5xl" : "text-base"} font-serif text-center text-[var(--text)] leading-relaxed break-words hyphens-none px-3 sm:px-4`}>
            {isDesktop ? renderMessageLargeDetail(memory) : renderMessage(memory, true)}
          </div>
        </div>

        {/* Footer section */}
        <div className="w-full flex flex-col items-center relative z-10">
          <hr className="my-2 border-[#999999] w-full" />
          
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span className={`${isDesktop ? "text-xl" : "text-xs"} text-[var(--text)] opacity-75 font-medium text-center tracking-wide`}>
              {dateStr} • {dayStr} • {timeStr}
            </span>
            <span className={`${isDesktop ? "text-base" : "text-xs"} text-[var(--text)] opacity-60 font-light text-center capitalize`}>
              {effectiveColor}
            </span>
          </div>
        </div>


      </div>
    );
  }

  return (
    <div className="relative group my-4 sm:my-6">
      <div className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 sm:right-[-50px]">
        <Link href={`/memories/${memory.id}`}>
          <span className="arrow-icon" style={arrowStyle}>➜</span>
        </Link>
      </div>
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flip-card relative overflow-hidden w-full max-w-xs sm:max-w-sm mx-auto perspective-1000 h-[300px] cursor-pointer ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-shadow duration-300`}
        onClick={handleCardClick}
        style={{ ...bgStyle, ...borderStyle }}
      >
        <BurnOverlay enabled={isBurningNow} intensity={burnIntensity} className="absolute inset-0 z-[30] pointer-events-none" />
        {/* Rough paper base for underside during flip */}
        {memory.animation === "rough" && (
          <>
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
              <defs>
                <filter id="roughpaper">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                  <feDiffuseLighting lightingColor="white" diffuseConstant="1" surfaceScale="2" result="diffLight">
                    <feDistantLight azimuth="45" elevation="35" />
                  </feDiffuseLighting>
                </filter>
              </defs>
            </svg>
            <div
              aria-hidden
              className="absolute inset-0 rounded-[inherit]"
              style={{
                filter: "url(#roughpaper)",
                background:
                  effectiveColor && effectiveColor !== "default"
                    ? `var(--color-${effectiveColor}-bg)`
                    : "#e8e6df",
                opacity: 0.55,
                zIndex: 0,
              }}
            />
          </>
        )}
        <motion.div 
          className="flip-card-inner relative z-10 w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          {/* FRONT */}
          <div
            className={`flip-card-front absolute w-full h-full backface-hidden ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} shadow-[0_15px_30px_rgba(0,0,0,0.04),0_6px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.12)] ${memory.animation === "rough" ? "overflow-hidden" : ""} p-5 flex flex-col justify-between`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            {/* Rough paper defs and overlay for front */}
            {memory.animation === "rough" && (
              <>
                <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
                  <defs>
                    <filter id="roughpaper">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                      <feDiffuseLighting lightingColor="white" diffuseConstant="1" surfaceScale="2" result="diffLight">
                        <feDistantLight azimuth="45" elevation="35" />
                      </feDiffuseLighting>
                    </filter>
                  </defs>
                </svg>
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit]"
                  style={{
                    filter: "url(#roughpaper)",
                    background:
                      effectiveColor && effectiveColor !== "default"
                        ? `var(--color-${effectiveColor}-bg)`
                        : "#e8e6df",
                    opacity: 0.55,
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />
              </>
            )}

            <div className="pt-1 relative z-10">
              {memory.pinned && (
                <span
                  className="absolute top-0 right-0 z-20"
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-15deg)',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))',
                    verticalAlign: 'middle',
                  }}
                  title="Pinned"
                >
                  <span
                    className="absolute inset-0 rounded-full border border-yellow-200 shadow-sm"
                    style={{
                      background: effectiveColor !== 'default'
                        ? `var(--color-${effectiveColor}-bg)`
                        : 'radial-gradient(circle, #fffbe6 60%, #ffe066 100%)',
                      zIndex: 0,
                      width: '1.6em',
                      height: '1.6em',
                      left: '-0.32em',
                      top: '-0.32em',
                      opacity: 0.85,
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="relative z-10 text-yellow-500"
                    style={{
                      fontSize: '1.28em',
                      textShadow: '0 1px 3px #fffbe6, 0 1px 2px #ffe066',
                      lineHeight: 1,
                    }}
                  >
                    📌
                  </span>
                </span>
              )}
              <h3 className="text-lg font-bold text-[var(--text)] text-left leading-tight">
                <span className="break-words overflow-hidden leading-tight">
                  <span className="font-bold">To:</span> <span className="font-bold">{memory.recipient}</span>
                </span>
              </h3>
              {memory.sender && (
                <p className="mt-1 text-md italic text-[var(--text)] break-words overflow-hidden text-left">
                  From: {memory.sender}
                </p>
              )}
              <hr className="my-2 border-[#999999]" />
            </div>

            <div className="relative z-10">
              <div className="text-xs text-[var(--text)] text-center font-normal">
                {dateStr} | {dayStr}
              </div>
              {createdAgoLabel && !isDestructedNow && (
                <div className="text-[11px] text-[var(--text)]/60 text-center font-normal mt-1">
                  {createdAgoLabel}
                </div>
              )}
            </div>

            <div className="min-h-[2.5em] w-full relative z-10">
                              <TypewriterPrompt tag={memory.tag} subTag={memory.sub_tag} typewriterEnabled={memory.typewriter_enabled} />
            </div>
          </div>
          {/* BACK */}
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} shadow-[0_15px_30px_rgba(0,0,0,0.04),0_6px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.12)] ${memory.animation === "rough" ? "overflow-hidden" : ""} p-5 flex flex-col justify-start rotate-y-180`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            {/* Rough paper defs and overlay for back */}
            {memory.animation === "rough" && (
              <>
                <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
                  <defs>
                    <filter id="roughpaper">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                      <feDiffuseLighting lightingColor="white" diffuseConstant="1" surfaceScale="2" result="diffLight">
                        <feDistantLight azimuth="45" elevation="35" />
                      </feDiffuseLighting>
                    </filter>
                  </defs>
                </svg>
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit]"
                  style={{
                    filter: "url(#roughpaper)",
                    background:
                      effectiveColor && effectiveColor !== "default"
                        ? `var(--color-${effectiveColor}-bg)`
                        : "#e8e6df",
                    opacity: 0.55,
                    zIndex: 0,
                  }}
                />
              </>
            )}
            <h3 className="text-lg italic text-[var(--text)] text-center relative z-10">if only i sent this</h3>
            <hr className="my-2 border-[#999999] relative z-10" />
            {memory.animation === "rough" ? (
              <div 
                className="flex-1 overflow-y-auto text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2 relative z-10 cute_scroll"
                style={{
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`,
                  ...(burnAwayStyle || {}),
                } as React.CSSProperties}
              >
                {renderMessage(memory)}
              </div>
            ) : (
              <ScrollableMessage
                style={
                  {
                    "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                    "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`,
                    ...(burnAwayStyle || {}),
                  } as React.CSSProperties
                }
              >
                <div className="relative z-10">
                  {renderMessage(memory)}
                </div>
              </ScrollableMessage>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MemoryCard;
