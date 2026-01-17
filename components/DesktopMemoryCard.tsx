import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CursiveText from './CursiveText';
import HandwrittenText from './HandwrittenText';
import { laBelleAurore } from '@/lib/fonts';
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
        { pattern: 'bottom', speed: 0.45, height: 0.7, density: 0.85, flicker: 0.7, sway: 0.5, ember: 0.5, smoke: 1.7, dark: 1.4, fire: 0.3 },
        { pattern: 'bottom', speed: 0.55, height: 0.8, density: 0.9, flicker: 0.75, sway: 0.55, ember: 0.7, smoke: 1.4, dark: 1.2, fire: 0.55 },
        { pattern: 'bottom', speed: 0.7, height: 0.95, density: 1.0, flicker: 0.85, sway: 0.65, ember: 0.9, smoke: 1.1, dark: 1.05, fire: 0.8 },
        { pattern: 'bottom', speed: 0.85, height: 1.1, density: 1.15, flicker: 0.95, sway: 0.75, ember: 1.1, smoke: 0.95, dark: 0.95, fire: 1.0 },
        { pattern: 'bottom', speed: 0.95, height: 1.25, density: 1.25, flicker: 1.05, sway: 0.85, ember: 1.2, smoke: 0.85, dark: 0.9, fire: 1.15 },
        { pattern: 'bottom', speed: 0.6, height: 1.15, density: 1.05, flicker: 0.8, sway: 0.6, ember: 0.95, smoke: 1.25, dark: 1.1, fire: 0.75 },

        { pattern: 'sides', speed: 0.55, height: 0.8, density: 0.95, flicker: 0.75, sway: 0.6, ember: 0.6, smoke: 1.55, dark: 1.3, fire: 0.35 },
        { pattern: 'sides', speed: 0.7, height: 0.95, density: 1.05, flicker: 0.85, sway: 0.7, ember: 0.85, smoke: 1.2, dark: 1.1, fire: 0.7 },
        { pattern: 'sides', speed: 0.9, height: 1.1, density: 1.2, flicker: 1.0, sway: 0.8, ember: 1.05, smoke: 0.95, dark: 0.95, fire: 1.0 },
        { pattern: 'sides', speed: 1.05, height: 1.25, density: 1.35, flicker: 1.05, sway: 0.85, ember: 1.2, smoke: 0.85, dark: 0.9, fire: 1.15 },
        { pattern: 'sides', speed: 0.65, height: 0.85, density: 0.9, flicker: 0.7, sway: 0.55, ember: 0.7, smoke: 1.35, dark: 1.2, fire: 0.55 },

        { pattern: 'bottom+sides', speed: 0.55, height: 0.85, density: 1.0, flicker: 0.8, sway: 0.6, ember: 0.8, smoke: 1.45, dark: 1.25, fire: 0.45 },
        { pattern: 'bottom+sides', speed: 0.7, height: 1.0, density: 1.1, flicker: 0.9, sway: 0.7, ember: 0.95, smoke: 1.2, dark: 1.1, fire: 0.85 },
        { pattern: 'bottom+sides', speed: 0.85, height: 1.15, density: 1.25, flicker: 1.0, sway: 0.8, ember: 1.1, smoke: 1.0, dark: 1.0, fire: 1.0 },
        { pattern: 'bottom+sides', speed: 1.0, height: 1.3, density: 1.35, flicker: 1.05, sway: 0.9, ember: 1.25, smoke: 0.9, dark: 0.95, fire: 1.15 },
        { pattern: 'bottom+sides', speed: 0.6, height: 1.1, density: 1.05, flicker: 0.85, sway: 0.65, ember: 0.95, smoke: 1.35, dark: 1.15, fire: 0.75 },

        { pattern: 'full', speed: 0.55, height: 0.9, density: 0.95, flicker: 0.8, sway: 0.65, ember: 0.7, smoke: 1.6, dark: 1.35, fire: 0.4 },
        { pattern: 'full', speed: 0.75, height: 1.05, density: 1.1, flicker: 0.9, sway: 0.75, ember: 0.95, smoke: 1.15, dark: 1.1, fire: 0.85 },
        { pattern: 'full', speed: 0.9, height: 1.2, density: 1.25, flicker: 1.0, sway: 0.85, ember: 1.1, smoke: 0.95, dark: 1.0, fire: 1.0 },
        { pattern: 'full', speed: 1.05, height: 1.3, density: 1.35, flicker: 1.05, sway: 0.9, ember: 1.25, smoke: 0.85, dark: 0.95, fire: 1.15 },
        { pattern: 'full', speed: 0.65, height: 1.25, density: 1.2, flicker: 0.9, sway: 0.8, ember: 1.0, smoke: 1.35, dark: 1.2, fire: 0.7 },
        { pattern: 'full', speed: 0.95, height: 1.15, density: 1.3, flicker: 1.05, sway: 0.9, ember: 1.2, smoke: 0.9, dark: 0.95, fire: 1.1 },

        { pattern: 'bottom', speed: 0.5, height: 0.9, density: 1.2, flicker: 0.75, sway: 0.55, ember: 0.85, smoke: 1.3, dark: 1.15, fire: 0.65 },
        { pattern: 'sides', speed: 0.6, height: 1.0, density: 1.15, flicker: 0.8, sway: 0.7, ember: 0.9, smoke: 1.25, dark: 1.1, fire: 0.8 },
      ] as const;
      return variants[v % variants.length];
    };

    const draw = (now: number) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const t = now - startRef.current;

      const i = Math.max(0, Math.min(1, intensity));
      const v = getVariant(variantRef.current);

      const tScaled = t * v.speed * 0.5;

      const drawFlame = (gx: number, gy: number, flameH: number, width: number, lean: number, strength: number) => {
        if (flameH <= 0 || width <= 0 || strength <= 0) return;
        ctx.save();
        ctx.filter = `blur(${0.35 + i * 0.45}px)`;
        const grad = ctx.createLinearGradient(gx, gy, gx + lean * 0.2, gy - flameH);
        grad.addColorStop(0, `rgba(255, 190, 80, ${(0.22 + i * 0.2) * strength})`);
        grad.addColorStop(0.45, `rgba(255, 120, 30, ${(0.18 + i * 0.16) * strength})`);
        grad.addColorStop(0.85, `rgba(255, 210, 140, ${(0.08 + i * 0.12) * strength})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(gx - width / 2, gy);
        ctx.quadraticCurveTo(gx + lean * 0.7, gy - flameH * 0.55, gx, gy - flameH);
        ctx.quadraticCurveTo(gx - lean * 0.55, gy - flameH * 0.55, gx + width / 2, gy);
        ctx.closePath();
        ctx.fill();

        const coreH = flameH * 0.55;
        const coreW = width * 0.35;
        const coreGrad = ctx.createLinearGradient(gx, gy, gx + lean * 0.15, gy - coreH);
        coreGrad.addColorStop(0, `rgba(255, 245, 220, ${(0.3 + i * 0.35) * strength})`);
        coreGrad.addColorStop(0.5, `rgba(255, 200, 120, ${(0.2 + i * 0.25) * strength})`);
        coreGrad.addColorStop(1, 'rgba(255, 160, 60, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.moveTo(gx - coreW / 2, gy);
        ctx.quadraticCurveTo(gx + lean * 0.45, gy - coreH * 0.6, gx, gy - coreH);
        ctx.quadraticCurveTo(gx - lean * 0.35, gy - coreH * 0.6, gx + coreW / 2, gy);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      const drawSideFlame = (edgeX: number, baseY: number, flameLen: number, thickness: number, direction: 'left' | 'right', lean: number, strength: number) => {
        const angle = direction === 'left' ? Math.PI / 2 : -Math.PI / 2;
        ctx.save();
        ctx.translate(edgeX, baseY);
        ctx.rotate(angle);
        drawFlame(0, 0, flameLen, thickness, lean, strength);
        ctx.restore();
      };

      ctx.clearRect(0, 0, w, h);

      const edge = 0.10 + i * 0.22;
      const smokePhase = i >= 0.85 ? Math.min(1, (i - 0.85) / 0.15) : 0;
      const phase = smokePhase;
      const smokeStrength = (0.35 + i * 0.65) * v.smoke;

      ctx.globalCompositeOperation = 'source-over';
      const charA = (0.05 + i * 0.30) * v.dark + phase * 0.22;
      ctx.fillStyle = `rgba(10, 0, 0, ${charA})`;
      ctx.fillRect(0, 0, w, h);

      const edgeGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * (0.25 - edge * 0.15), w * 0.5, h * 0.45, Math.min(w, h) * 0.75);
      edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
      edgeGrad.addColorStop(0.55, `rgba(20,10,0,${0.05 + i * 0.18})`);
      edgeGrad.addColorStop(1, `rgba(0,0,0,${0.14 + i * 0.32})`);
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'source-over';
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.75, Math.min(w, h) * 0.05, w * 0.5, h * 0.75, Math.min(w, h) * 0.9);
      glow.addColorStop(0, `rgba(255, 170, 80, ${0.05 + i * 0.14})`);
      glow.addColorStop(0.5, `rgba(140, 55, 20, ${0.04 + i * 0.08})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      const flameStrength = (1 - phase) * (v.fire || 0);
      if (flameStrength > 0.01) {
        const baseHeight = h * (0.22 + i * 0.55) * flameStrength * v.height;
        const flicker = (1 + i * 1.8) * v.flicker;

        const drawBottom = v.pattern === 'bottom' || v.pattern === 'bottom+sides' || v.pattern === 'full';
        const drawSides = v.pattern === 'sides' || v.pattern === 'bottom+sides' || v.pattern === 'full';

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.65 + 0.25 * (1 - phase);

        if (drawBottom) {
          const flameCount = Math.max(5, Math.floor(6 + v.density * 6 + i * 6));
          for (let f = 0; f < flameCount; f++) {
            const seed = f * 19.7;
            const n1 = hash(seed + Math.floor(tScaled / 23));
            const n2 = hash(seed + 4.2 + Math.floor(tScaled / 31));
            const n3 = hash(seed + 13.7 + Math.floor(tScaled / 41));
            const baseX = ((f + 0.25 + n2 * 0.6) / flameCount) * w;
            const flameH = baseHeight * (0.65 + n1 * 0.9) * (0.85 + 0.15 * Math.sin((tScaled / 90 + seed) * flicker));
            const width = (w / flameCount) * (0.7 + n3 * 0.9);
            const lean = (n2 - 0.5) * w * 0.06 * v.sway;
            drawFlame(baseX, h, flameH, width, lean, flameStrength);
          }
        }

        if (drawSides) {
          const sideCount = Math.max(6, Math.floor(7 + v.density * 6 + i * 5));
          const rowH = h / sideCount;
          const sideBase = w * (0.1 + i * 0.26) * v.height * (0.6 + 0.4 * flameStrength);
          for (let r = 0; r < sideCount; r++) {
            const seed = r * 27.5;
            const n1 = hash(seed + Math.floor(tScaled / 21));
            const n2 = hash(seed + 6.3 + Math.floor(tScaled / 29));
            const n3 = hash(seed + 11.4 + Math.floor(tScaled / 41));
            const y = r * rowH + rowH * (0.3 + n2 * 0.4);
            const flameLen = sideBase * (0.55 + n1 * 0.85);
            const thickness = rowH * (0.8 + n3 * 1.2);
            const lean = (n2 - 0.5) * h * 0.05 * v.sway;
            drawSideFlame(0, y, flameLen, thickness, 'left', lean, flameStrength * 0.85);
            drawSideFlame(w, y, flameLen, thickness, 'right', lean, flameStrength * 0.85);
          }
        }

        if (v.pattern === 'full') {
          const centerCount = Math.max(2, Math.floor(2 + i * 3));
          for (let c = 0; c < centerCount; c++) {
            const seed = c * 47.1;
            const n1 = hash(seed + Math.floor(tScaled / 33));
            const n2 = hash(seed + 9.7 + Math.floor(tScaled / 41));
            const n3 = hash(seed + 17.9 + Math.floor(tScaled / 57));
            const baseX = w * (0.25 + n1 * 0.5);
            const baseY = h * (0.65 + n2 * 0.15);
            const flameH = baseHeight * (0.6 + n3 * 0.6);
            const width = w * (0.08 + n2 * 0.06);
            const lean = (n2 - 0.5) * w * 0.05 * v.sway;
            drawFlame(baseX, baseY, flameH, width, lean, flameStrength * 0.75);
          }
        }

        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = 'source-over';
      const smokeA = (0.06 + i * 0.16 + phase * 0.18) * smokeStrength;
      const smoke = ctx.createLinearGradient(0, 0, 0, h);
      smoke.addColorStop(0, `rgba(0,0,0,${smokeA})`);
      smoke.addColorStop(0.5, `rgba(0,0,0,0)`);
      ctx.fillStyle = smoke;
      ctx.fillRect(0, 0, w, h);

      const wispCount = Math.max(5, Math.floor((6 + i * 9) * v.smoke));
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineCap = 'round';
      ctx.filter = 'blur(0.6px)';
      for (let s = 0; s < wispCount; s++) {
        const seed = s * 31.3;
        const rx = hash(seed + Math.floor(tScaled / 90));
        const ry = hash(seed + 9.1 + Math.floor(tScaled / 120));
        const rz = hash(seed + 21.5 + Math.floor(tScaled / 140));
        const baseX = rx * w;
        const baseY = h * (0.05 + ry * 0.25);
        const drift = Math.sin(tScaled / 180 + seed) * w * 0.05;
        const height = h * (0.12 + rz * 0.25);
        ctx.strokeStyle = `rgba(70,70,70,${0.04 + i * 0.08})`;
        ctx.lineWidth = 1 + i * 1.2;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY + height);
        ctx.bezierCurveTo(baseX + drift * 0.4, baseY + height * 0.6, baseX + drift * 0.8, baseY + height * 0.25, baseX + drift, baseY);
        ctx.stroke();
      }
      ctx.restore();

      if (phase > 0) {
        ctx.globalCompositeOperation = 'source-over';
        const fade = 0.10 + phase * 0.38;
        ctx.fillStyle = `rgba(40, 40, 40, ${fade})`;
        ctx.fillRect(0, 0, w, h);
      }

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
  pinned_until?: string;
  ip?: string;
  country?: string;
  uuid?: string;
  tag?: string;
  sub_tag?: string;
  typewriter_enabled?: boolean;
}

interface DesktopMemoryCardProps {
  memory: Memory;
  detail?: boolean;
  large?: boolean;
}

function useDragToScroll(opts: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollRef } = opts;
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const movedRef = useRef(false);
  const didDragRef = useRef(false);

  const zoneElRef = useRef<HTMLElement | null>(null);

  const setZoneEl = (el: HTMLElement | null) => {
    zoneElRef.current = el;
  };

  useEffect(() => {
    const canHover =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    const zoneEl = zoneElRef.current;
    if (!zoneEl) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (e.button !== 0) return;

      const scrollEl = scrollRef.current;
      if (!scrollEl) return;
      if (scrollEl.scrollHeight <= scrollEl.clientHeight + 1) return;

      isDraggingRef.current = true;
      movedRef.current = false;
      didDragRef.current = false;
      pointerIdRef.current = e.pointerId;
      startYRef.current = e.clientY;
      startScrollTopRef.current = scrollEl.scrollTop;

      // prevent text selection during a drag gesture
      e.preventDefault();

      // Do not rely on pointer capture; we track move/up on window.
    };

    const onPointerMoveWindow = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      // Some browsers/devtools can change pointerId mid-drag; don't hard-fail.

      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const dy = e.clientY - startYRef.current;
      if (!movedRef.current && Math.abs(dy) > 3) {
        movedRef.current = true;
        didDragRef.current = true;
      }

      scrollEl.scrollTop = startScrollTopRef.current - dy;
      e.preventDefault();
    };

    const endDrag = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      pointerIdRef.current = null;
      startYRef.current = 0;
      startScrollTopRef.current = 0;
    };

    const endDragWindow = () => {
      endDrag();
    };

    const endDragOnBlur = () => {
      endDrag();
    };

    const onClickCapture = (e: MouseEvent) => {
      if (didDragRef.current) {
        e.preventDefault();
        e.stopPropagation();
        didDragRef.current = false;
      }
    };

    zoneEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMoveWindow, { passive: false });
    window.addEventListener("pointerup", endDragWindow);
    window.addEventListener("pointercancel", endDragWindow);
    window.addEventListener("blur", endDragOnBlur);
    document.addEventListener("visibilitychange", endDragOnBlur);
    zoneEl.addEventListener("click", onClickCapture, true);

    return () => {
      zoneEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMoveWindow as EventListener);
      window.removeEventListener("pointerup", endDragWindow);
      window.removeEventListener("pointercancel", endDragWindow);
      window.removeEventListener("blur", endDragOnBlur);
      document.removeEventListener("visibilitychange", endDragOnBlur);
      zoneEl.removeEventListener("click", onClickCapture, true);
    };
  }, [scrollRef]);

  const getCursorClassName = () => {
    return "cursor-grab active:cursor-grabbing";
  };

  const getZoneStyle = () => {
    return { cursor: "grab" as const };
  };

  return { setZoneEl, getCursorClassName, getZoneStyle };
}

const allowedColors = new Set([
  "default", "aqua", "azure", "berry", "brass", "bronze", "clay", "cloud", "copper", "coral", "cream", "cyan", "dune", "garnet", "gold", "honey", "ice", "ivory", "jade", "lilac", "mint", "moss", "night", "ocean", "olive", "peach", "pearl", "pine", "plum", "rose", "rouge", "ruby", "sage", "sand", "sepia", "sky", "slate", "steel", "sunny", "teal", "wine"
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

const ScrollableMessage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string; containerRefOverride?: React.RefObject<HTMLDivElement | null> }> = ({ children, style, className, containerRefOverride }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const effectiveRef = containerRefOverride ?? containerRef;

  useEffect(() => {
    if (effectiveRef.current) {
      setNeedsScroll(
        effectiveRef.current.scrollHeight > effectiveRef.current.clientHeight
      );
    }
  }, [children, effectiveRef]);

  return (
    <div
      ref={effectiveRef}
      className={`flex-1 overflow-y-auto text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2 ${
        needsScroll ? "no_scrollbar" : ""
      } ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
};

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

function renderMessageLarge(memory: Memory, effectiveColor: string, destructedMessage: string, isDestructedNow: boolean, destructAtLabel: string | null) {
  if (isDestructedNow) {
    return (
      <div className="text-[14px] sm:text-[16px] leading-snug break-words hyphens-none opacity-90 font-mono">
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
  const textClass = isShortOrExact
    ? "text-4xl tracking-wide leading-snug break-words hyphens-none"
    : "text-2xl tracking-wide leading-snug break-words hyphens-none";
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
}



const TypewriterPrompt: React.FC<{ tag?: string; subTag?: string; typewriterEnabled?: boolean }> = ({ tag, subTag, typewriterEnabled }) => {
  // For new memories: use the typewriter_enabled field
  // For old memories: show typewriter by default (typewriter_enabled will be undefined)
  const isDisabled = typewriterEnabled === false;

  // Get all prompts for the given tag by combining all subcategory prompts
  const prompts = React.useMemo(() => {
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
  
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * prompts.length));
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  
  useEffect(() => {
    if (prompts.length === 0) return;
    
    const currentPrompt = prompts[currentIndex];
    const delay = isDeleting ? 50 : 100;
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
          setCurrentIndex(Math.floor(Math.random() * prompts.length));
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, prompts]);
  
  if (isDisabled || prompts.length === 0) return null;
  
  return (
    <div className="min-h-[2rem] text-center text-xl text-[var(--text)] font-serif transition-all duration-300 break-words" style={{ 
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

const DesktopMemoryCard: React.FC<DesktopMemoryCardProps> = ({ memory, large }) => {
  const [flipped, setFlipped] = useState(false);
  const backFaceRef = useRef<HTMLDivElement>(null);
  const backMessageRef = useRef<HTMLDivElement>(null);
  const dragScroll = useDragToScroll({ scrollRef: backMessageRef });

  const destructedMessage = useMemo(() => {
    const idx = Math.floor(Math.random() * DESTRUCTED_MESSAGES.length);
    return DESTRUCTED_MESSAGES[idx];
  }, []);

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

  const dateStr = new Date(memory.created_at).toLocaleDateString();
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
  // Prevent flip when clicking the arrow
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.open-card-btn')) return;
    setFlipped((f) => !f);
  };

  return (
    <div className={`relative group ${large ? 'my-2' : 'my-6'}`}>
      <motion.div
        whileHover={{ scale: 1.06, y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.20), 0 8px 16px rgba(0,0,0,0.08)", transition: { duration: 0.22, ease: 'easeOut' } }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, scale: 1.045, boxShadow: "0 16px 36px rgba(0,0,0,0.20), 0 8px 16px rgba(0,0,0,0.10)" }}
        className={`flip-card relative overflow-hidden w-full h-[420px] perspective-1000 ${flipped ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"} rounded-[2rem] hover:shadow-2xl mx-auto`}
        onClick={handleCardClick}
        style={{ ...bgStyle, ...borderStyle }}
      >
        <BurnOverlay enabled={isBurningNow} intensity={burnIntensity} className="absolute inset-0 z-[30] pointer-events-none" />
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
        <motion.div
          className="flip-card-inner relative z-10 w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          {/* FRONT */}
          <div
            className={`flip-card-front absolute w-full h-full backface-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[var(--border)]/15 ${memory.animation === "rough" ? "overflow-hidden" : ""} ${large ? 'p-12' : 'p-8'} flex flex-col justify-between ${flipped ? "pointer-events-none" : "pointer-events-auto"}`}
            style={{ ...bgStyle, ...borderStyle }}
          >
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
            {memory.pinned && (
              <span
                className="absolute top-4 right-4 animate-pin-pop z-20"
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
            <div className="pb-1 relative z-10">
               <h3 className={`${large ? 'text-4xl' : 'text-2xl'} font-normal text-[var(--text)] flex items-center gap-2 leading-tight`}>
                                <span className="break-words overflow-hidden leading-tight">To: {memory.recipient}</span>
              </h3>
              {memory.sender && <p className={`mt-1 ${large ? 'text-3xl' : 'text-2xl'} italic text-[var(--text)] break-words overflow-hidden`}>From: {memory.sender}</p>}
              <hr className="my-2 border-[#999999]" />
            </div>
            <div className="text-xl text-[var(--text)] text-center font-normal relative z-10">
              {dateStr} | {dayStr}
            </div>
            {createdAgoLabel && !isDestructedNow && (
              <div className="text-sm text-[var(--text)]/60 text-center font-normal relative z-10 mt-1">
                {createdAgoLabel}
              </div>
            )}
            <div className="text-xl min-h-[3em] mt-2 px-2 font-serif text-center text-[var(--text)] relative z-10" style={{ lineHeight: '1.5', ...(burnAwayStyle || {}) }}>
                              <TypewriterPrompt tag={memory.tag} subTag={memory.sub_tag} typewriterEnabled={memory.typewriter_enabled} />
            </div>
          </div>
          {/* BACK */}
          <div
            ref={(el) => {
              backFaceRef.current = el;
              dragScroll.setZoneEl(el);
            }}
            className={`flip-card-back absolute w-full h-full backface-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[var(--border)]/15 ${memory.animation === "rough" ? "overflow-hidden" : ""} ${large ? 'p-12' : 'p-8'} flex flex-col justify-start rotate-y-180 ${dragScroll.getCursorClassName()} ${flipped ? "pointer-events-auto" : "pointer-events-none"}`}
            style={{ ...bgStyle, ...borderStyle, ...dragScroll.getZoneStyle(), userSelect: "none", touchAction: "none" }}
          >
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
            <p className={`hidden lg:block text-4xl italic text-[var(--text)] text-center font-normal !font-normal relative z-10`}>if only i sent this</p>
            <p className={`block lg:hidden ${large ? 'text-3xl' : 'text-xl'} italic text-[var(--text)] text-center font-normal !font-normal relative z-10`}>if only i sent this</p>
            <hr className="my-2 border-[#999999] relative z-10" />
            {memory.animation === "rough" ? (
              <div 
                ref={backMessageRef}
                className={`flex-1 overflow-y-auto text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2 relative z-10 no_scrollbar ${dragScroll.getCursorClassName()}`}
                style={{
                  fontSize: (isDestructedNow ? '' : memory.message).split(/[\s.]+/).filter(word => word.length > 0).length <= 30 ? '2rem' : '1.25rem',
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`,
                  ...(burnAwayStyle || {}),
                } as React.CSSProperties}
              >
                {renderMessageLarge(memory, effectiveColor, destructedMessage, isDestructedNow, destructAtLabel)}
              </div>
            ) : (
              <ScrollableMessage
                containerRefOverride={backMessageRef}
                className={dragScroll.getCursorClassName()}
                style={{
                  fontSize: (isDestructedNow ? '' : memory.message).split(/[\s.]+/).filter(word => word.length > 0).length <= 30 ? '2rem' : '1.25rem',
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`,
                  ...(burnAwayStyle || {}),
                } as React.CSSProperties}
              >
                <div className="relative z-10">
                  {renderMessageLarge(memory, effectiveColor, destructedMessage, isDestructedNow, destructAtLabel)}
                </div>
              </ScrollableMessage>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Minimal bottom-center open affordance */}
      {flipped ? (
        <div className="hidden lg:flex absolute top-full mt-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none cursor-default">
          <Link href={`/memories/${memory.id}`} className="open-card-btn pointer-events-auto">
            <span className="inline-flex items-center rounded-full transition-all duration-300 bg-[var(--card-bg)]/80 text-[var(--text)]/70 backdrop-blur-sm border border-transparent text-[17px] leading-none px-0 py-0 w-0 h-0 opacity-0 group-hover:px-5 group-hover:py-[8px] group-hover:w-auto group-hover:h-auto group-hover:opacity-100 group-hover:border-[var(--border)]/60">
              <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">open</span>
              <span className="ml-1 opacity-0 group-hover:opacity-100">↗</span>
            </span>
          </Link>
        </div>
      ) : (
        <div className="hidden lg:flex absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none cursor-default">
          <Link href={`/memories/${memory.id}`} className="open-card-btn pointer-events-auto">
            <span className="inline-flex items-center rounded-full transition-all duration-300 bg-[var(--card-bg)]/80 text-[var(--text)]/70 backdrop-blur-sm border border-transparent text-[17px] leading-none px-0 py-0 w-0 h-0 opacity-0 group-hover:px-5 group-hover:py-[8px] group-hover:w-auto group-hover:h-auto group-hover:opacity-100 group-hover:border-[var(--border)]/60">
              <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">open</span>
              <span className="ml-1 opacity-0 group-hover:opacity-100">↗</span>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DesktopMemoryCard; 
