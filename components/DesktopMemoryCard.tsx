"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CursiveText from './CursiveText';
import HandwrittenText from './HandwrittenText';
import { laBelleAuroreClass } from '@/lib/fonts';
import { DESTRUCTED_MESSAGES, allowedColors, colorMapping, colorBgMap } from './cardConstants';
import { SPECIAL_EFFECT_WORD_LIMIT, countWords } from '@/lib/constants';
import TypewriterPrompt from './TypewriterPrompt';
import { isLinkableName } from '@/lib/nameUtils';
import { filterProfanity } from '@/lib/profanityFilter';
import type { Memory } from '@/types/memory';

interface DesktopMemoryCardProps {
  memory: Memory;
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

function renderMessageLarge(memory: Memory, effectiveColor: string, destructedMessage: string, isDestructedNow: boolean, destructAtLabel: string | null) {
  if (isDestructedNow) {
    return (
      <div className="text-[16px] sm:text-[18px] leading-snug break-words hyphens-none opacity-90 font-mono">
        <p className="tracking-tight">
          This message was destructed{destructAtLabel ? ` at ${destructAtLabel}` : ''}. You’re late to read it.
        </p>
        <p className="mt-3 opacity-80">{destructedMessage}</p>
      </div>
    );
  }
  const messageToRender = filterProfanity(memory.message);
  const wordCount = countWords(messageToRender);
  const isShortOrExact = wordCount <= SPECIAL_EFFECT_WORD_LIMIT;
  const textClass = isShortOrExact
    ? "text-[2.5rem] tracking-wide leading-snug break-words hyphens-none"
    : "text-[1.65rem] tracking-wide leading-snug break-words hyphens-none";
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
      return <p className={`${textClass} ${laBelleAuroreClass} pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased whitespace-pre-wrap`}>{messageToRender}</p>;
    default:
      return (
        <div className="space-y-2">
          <p className={`${textClass} whitespace-pre-wrap`}>{messageToRender}</p>
        </div>
      );
  }
}


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
    if (!isApproved) return false;
    if (destructAtTs === null) return false;
    // Only destructed if destruct_at is in the past — never for future dates
    return destructAtTs <= Date.now();
  }, [destructAtTs, isApproved]);

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
    // setTimeout uses a 32-bit signed int; delays > ~24.8 days overflow and fire instantly.
    // For long delays, skip the timer — computeIsDestructedNow re-checks on every render.
    if (delay > 2_147_483_647) return;
    const t = setTimeout(() => setIsDestructedNow(true), delay);
    return () => clearTimeout(t);
  }, [destructAtTs, isApproved, isDestructedNow]);

  // Live destruct countdown
  const [destructCountdown, setDestructCountdown] = useState<string | null>(null);
  useEffect(() => {
    if (!destructAtTs || isDestructedNow) {
      setDestructCountdown(null);
      return;
    }
    function tick() {
      const remaining = (destructAtTs as number) - Date.now();
      if (remaining <= 0) {
        setDestructCountdown(null);
        return;
      }
      const d = Math.floor(remaining / 86400000);
      const h = Math.floor((remaining % 86400000) / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      const parts: string[] = [];
      if (d > 0) parts.push(`${d}d`);
      if (h > 0 || d > 0) parts.push(`${h}h`);
      if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
      parts.push(`${s}s`);
      setDestructCountdown(parts.join(' '));
    }
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [destructAtTs, isDestructedNow]);

  let effectiveColor = memory.color;
  if (!allowedColors.has(memory.color)) {
    effectiveColor = colorMapping[memory.color] || "default";
  }
  const borderStyle = useMemo(() => ({
    borderWidth: '1px',
    borderStyle: 'solid' as const,
    borderColor: 'var(--border)'
  }), []);
  const bgStyle = useMemo(() =>
    effectiveColor === "default"
      ? { backgroundColor: colorBgMap.default }
      : memory.full_bg
      ? { backgroundColor: colorBgMap[effectiveColor] || colorBgMap.default }
      : {},
    [effectiveColor, memory.full_bg]
  );

  const createdDate = useMemo(() => new Date(memory.created_at), [memory.created_at]);
  const dateStr = createdDate.toLocaleDateString();
  const dayStr = createdDate.toLocaleDateString(undefined, { weekday: "long" });

  const timeCapsuleDelayMinutes = useMemo(() => {
    const rawDelayMinutes = memory.time_capsule_delay_minutes;
    const delayMinutes =
      typeof rawDelayMinutes === 'number'
        ? rawDelayMinutes
        : (typeof rawDelayMinutes === 'string' ? Number(rawDelayMinutes) : 0);
    return Number.isFinite(delayMinutes) ? delayMinutes : 0;
  }, [memory]);

  const createdAgoLabel = useMemo(() => {
    // Only show "created X ago" for actual time capsule memories
    if (timeCapsuleDelayMinutes <= 0) return null;

    const createdTs = new Date(memory.created_at).getTime();
    if (!Number.isFinite(createdTs)) return null;

    const diffMs = Date.now() - createdTs;
    if (!Number.isFinite(diffMs) || diffMs < 0) return null;

    const minute = 60 * 1000;
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
  }, [memory.created_at, timeCapsuleDelayMinutes]);
  // Prevent flip when clicking the arrow
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.open-card-btn')) return;
    setFlipped((f) => !f);
  };

  return (
    <div className={`relative group ${large ? 'my-2' : 'my-0'}`}>
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 30px 60px rgba(0,0,0,0.18), 0 12px 24px rgba(0,0,0,0.10)", transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, scale: 1, boxShadow: "0 20px 44px rgba(0,0,0,0.16), 0 8px 18px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.05)" }}
        className={`flip-card relative w-full h-[440px] perspective-1000 ${flipped ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"} rounded-[2rem] hover:shadow-2xl mx-auto`}
        onClick={handleCardClick}
        style={{ ...bgStyle, ...borderStyle, WebkitPerspective: '1000px', perspective: '1000px' } as React.CSSProperties}
      >
        {memory.animation === "rough" && (
          <div
            aria-hidden
            className="absolute inset-0 rounded-[inherit]"
            style={{
              backgroundImage: 'url(/rough-paper.webp)',
              backgroundSize: '200%',
              backgroundPosition: 'center',
              opacity: 0.5,
              mixBlendMode: 'multiply',
              pointerEvents: "none",
            }}
          />
        )}
        <motion.div
          className="flip-card-inner relative w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 28, mass: 0.8 }}
          style={{ WebkitTransformStyle: 'preserve-3d', transformStyle: 'preserve-3d' } as React.CSSProperties}
        >
          {/* FRONT */}
          <div
            className={`flip-card-front absolute w-full h-full backface-hidden rounded-[2rem] shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)] border border-[var(--border)]/25 ${memory.animation === "rough" ? "overflow-hidden" : ""} ${large ? 'pt-6 pb-8 px-10' : 'pt-5 pb-6 px-7'} flex flex-col justify-between ${flipped ? "pointer-events-none" : "pointer-events-auto"}`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            {memory.animation === "rough" && (
              <div
                aria-hidden
                className="absolute inset-0 rounded-[inherit]"
                style={{
                  backgroundImage: 'url(/rough-paper.webp)',
                  backgroundSize: '200%',
                  backgroundPosition: 'center',
                  opacity: 0.5,
                  mixBlendMode: 'multiply',
                  pointerEvents: "none",
                }}
              />
            )}
            {memory.pinned && (
              <span
                className="absolute top-5 right-5 animate-pin-pop z-20"
                style={{
                  display: 'inline-block',
                  WebkitFilter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
                }}
                title="Pinned"
              >
                <span
                  className="relative z-10"
                  style={{
                    fontSize: '1.5rem',
                    lineHeight: 1,
                  }}
                >
                  📌
                </span>
              </span>
            )}
            <div className="pb-1 relative z-10">
               <h3 className={`${large ? 'text-[2.5rem]' : 'text-3xl'} font-normal text-[var(--text)] flex items-center gap-2 leading-tight`}>
                                <span className="break-words overflow-hidden leading-tight">To:{" "}
                  {isLinkableName(memory.recipient) ? (
                    <Link
                      href={`/name/${encodeURIComponent(memory.recipient.toLowerCase().trim())}`}
                      onClick={(e) => e.stopPropagation()}
                      className="underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors"
                    >
                      {memory.recipient}
                    </Link>
                  ) : (
                    <span>{memory.recipient}</span>
                  )}
                </span>
              </h3>
              {memory.sender && <p className={`mt-1 ${large ? 'text-[2rem]' : 'text-[1.65rem]'} italic text-[var(--text)] break-words overflow-hidden`}>From:{" "}
                {isLinkableName(memory.sender) ? (
                  <Link
                    href={`/name/${encodeURIComponent(memory.sender.toLowerCase().trim())}`}
                    onClick={(e) => e.stopPropagation()}
                    className="underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors"
                  >
                    {memory.sender}
                  </Link>
                ) : (
                  <span>{memory.sender}</span>
                )}
              </p>}
              <div className="my-3 h-[1px] relative z-10" style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.35), transparent)' }} />
            </div>
            <div className="text-2xl text-[var(--text)] text-center font-normal relative z-10">
              {dateStr} | {dayStr}
            </div>
            {createdAgoLabel && !isDestructedNow && (
              <div className="text-sm text-[var(--text)]/60 text-center font-normal relative z-10 mt-1">
                {createdAgoLabel}
              </div>
            )}
            <div className="text-2xl min-h-[3em] mt-2 px-2 font-serif text-center text-[var(--text)] relative z-10" style={{ lineHeight: '1.5' }}>
              {destructCountdown && !isDestructedNow ? (
                <div className="text-sm text-center font-mono opacity-90 text-[var(--text)]">
                  <span className="opacity-80">self-destructs in</span>{" "}
                  <span className="font-bold">{destructCountdown}</span>
                </div>
              ) : isDestructedNow ? null : (
                <TypewriterPrompt tag={memory.tag} subTag={memory.sub_tag} typewriterEnabled={memory.typewriter_enabled} size="xl" />
              )}
            </div>
          </div>
          {/* BACK */}
          <div
            ref={(el) => {
              backFaceRef.current = el;
              dragScroll.setZoneEl(el);
            }}
            className={`flip-card-back absolute w-full h-full backface-hidden rounded-[2rem] shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)] border border-[var(--border)]/25 ${memory.animation === "rough" ? "overflow-hidden" : ""} ${large ? 'pt-6 pb-8 px-10' : 'pt-5 pb-6 px-7'} flex flex-col justify-start rotate-y-180 ${dragScroll.getCursorClassName()} ${flipped ? "pointer-events-auto" : "pointer-events-none"}`}
            style={{ ...bgStyle, ...borderStyle, ...dragScroll.getZoneStyle(), userSelect: "none", touchAction: "none" }}
          >
            {memory.animation === "rough" && (
              <div
                aria-hidden
                className="absolute inset-0 rounded-[inherit]"
                style={{
                  backgroundImage: 'url(/rough-paper.webp)',
                  backgroundSize: '200%',
                  backgroundPosition: 'center',
                  opacity: 0.5,
                  mixBlendMode: 'multiply',
                  pointerEvents: "none",
                }}
              />
            )}
            <p className={`hidden lg:block text-[2rem] italic text-[var(--text)] text-center font-normal !font-normal relative z-10`}>if only i sent this</p>
            <p className={`block lg:hidden ${large ? 'text-3xl' : 'text-xl'} italic text-[var(--text)] text-center font-normal !font-normal relative z-10`}>if only i sent this</p>
            <div className="my-3 h-[1px] relative z-10" style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.35), transparent)' }} />
            {memory.animation === "rough" ? (
              <div 
                ref={backMessageRef}
                className={`flex-1 overflow-y-auto text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2 relative z-10 no_scrollbar ${dragScroll.getCursorClassName()}`}
                style={{
                  fontSize: (isDestructedNow ? '' : filterProfanity(memory.message)).split(/[\s.]+/).filter(word => word.length > 0).length <= SPECIAL_EFFECT_WORD_LIMIT ? '2.5rem' : '1.65rem',
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
                } as React.CSSProperties}
              >
                {renderMessageLarge(memory, effectiveColor, destructedMessage, isDestructedNow, destructAtLabel)}
              </div>
            ) : (
              <ScrollableMessage
                containerRefOverride={backMessageRef}
                className={dragScroll.getCursorClassName()}
                style={{
                  fontSize: (isDestructedNow ? '' : filterProfanity(memory.message)).split(/[\s.]+/).filter(word => word.length > 0).length <= SPECIAL_EFFECT_WORD_LIMIT ? '2.5rem' : '1.65rem',
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
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

export default React.memo(DesktopMemoryCard); 
