"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CursiveText from './CursiveText';
import HandwrittenText from './HandwrittenText';
import { laBelleAuroreClass } from '@/lib/fonts';
import "../app/globals.css";
import { DESTRUCTED_MESSAGES, allowedColors, colorMapping, colorBgMap } from './cardConstants';
import TypewriterPrompt from './TypewriterPrompt';
import { isLinkableName } from '@/lib/nameUtils';
import { filterProfanity } from '@/lib/profanityFilter';
import type { Memory } from '@/types/memory';

interface MemoryCardProps {
  memory: Memory;
  detail?: boolean;
  variant?: "default" | "home";
  compact?: boolean;
}


const ScrollableMessage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; active?: boolean }> = ({ children, style, active = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setNeedsScroll(
        containerRef.current.scrollHeight > containerRef.current.clientHeight
      );
    }
  }, [children, active]);

  // When not active (card not flipped), force overflow hidden to prevent
  // iOS Safari from breaking backface-visibility in preserve-3d context
  const canScroll = needsScroll && active;

  return (
    <div
      ref={containerRef}
      className={`flex-1 ${canScroll ? 'overflow-y-auto cute_scroll' : 'overflow-y-hidden'} text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2`}
      style={canScroll ? { ...style, WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' } : style}
    >
      {children}
    </div>
  );
};

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, detail, variant = "default", compact = false }) => {
  const [flipped, setFlipped] = useState(false);
  const roughScrollRef = useRef<HTMLDivElement>(null);
  const [roughNeedsScroll, setRoughNeedsScroll] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1280);
      setIsTablet(width >= 768 && width < 1280);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

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

  const arrowStyle = useMemo(() =>
    effectiveColor === "default"
      ? { color: "#5F554C" }
      : { color: `var(--color-${effectiveColor}-border)` },
    [effectiveColor]
  );

  // Detect if rough scroll container needs scrolling
  useEffect(() => {
    if (roughScrollRef.current) {
      setRoughNeedsScroll(
        roughScrollRef.current.scrollHeight > roughScrollRef.current.clientHeight
      );
    }
  }, [flipped, memory.message]);

  const createdDate = useMemo(() => new Date(memory.created_at), [memory.created_at]);
  const dateStr = createdDate.toLocaleDateString();
  const timeStr = createdDate.toLocaleTimeString();
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

  const destructedMessage = useMemo(() => {
    const idx = Math.floor(Math.random() * DESTRUCTED_MESSAGES.length);
    return DESTRUCTED_MESSAGES[idx];
  }, []);

  const isShortMessage = useMemo(() => {
    return filterProfanity(memory.message).trim().split(/\s+/).filter(Boolean).length <= 30;
  }, [memory.message]);

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

  const handleCardClick = () => {
    if (!detail) {
      setFlipped(!flipped);
    }
  };

  const renderMessage = (memory: Memory, forceLarge?: boolean, readingMode?: boolean) => {
    if (isDestructedNow) {
      return (
        <div className={`${readingMode ? 'text-[15px]' : forceLarge ? 'text-[16px]' : 'text-[14px]'} leading-snug break-words hyphens-none opacity-90 font-mono`}>
          <p className="tracking-tight">
            This message was destructed{destructAtLabel ? ` at ${destructAtLabel}` : ''}. You're late to read it.
          </p>
          <p className="mt-3 opacity-80">{destructedMessage}</p>
        </div>
      );
    }
    const messageToRender = filterProfanity(memory.message);
    const useLargeText = !readingMode && (forceLarge || isShortMessage);
    const textClass = readingMode
      ? `${isTablet ? "text-[21px]" : "text-[18px]"} leading-[1.75] tracking-normal break-words hyphens-none`
      : useLargeText
      ? "text-[28px] tracking-wide leading-snug break-words hyphens-none"
      : "text-[21px] tracking-wide leading-snug break-words hyphens-none";
    
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
          <div className={readingMode ? "w-full max-w-[34rem] space-y-3 text-left" : "space-y-2"}>
            <p className={`${textClass} whitespace-pre-wrap`}>{messageToRender}</p>
          </div>
        );
    }
  };

  if (detail) {
    // Large message renderer for detail desktop
    function renderMessageLargeDetail(memory: Memory) {
      if (isDestructedNow) {
        return (
          <div className="text-xl sm:text-2xl leading-snug break-words hyphens-none opacity-90 font-mono">
            <p className="tracking-tight">
              This message was destructed{destructAtLabel ? ` at ${destructAtLabel}` : ''}. You&apos;re late to read it.
            </p>
            <p className="mt-4 opacity-80">{destructedMessage}</p>
          </div>
        );
      }
      const filteredMessage = filterProfanity(memory.message);
      const textClass = "text-4xl tracking-wide leading-snug break-words hyphens-none";
      switch (memory.animation) {
        case "cursive":
          return (
            <CursiveText
              message={filteredMessage}
              textClass={textClass}
              effectiveColor={effectiveColor}
            />
          );
        case "handwritten":
          return <HandwrittenText message={filteredMessage} textClass={textClass} />;
        case "rough":
          // Use handwritten text sizing/feel; card-level background handles rough paper
          return <p className={`${textClass} ${laBelleAuroreClass} pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased whitespace-pre-wrap`}>{filteredMessage}</p>;
        default:
          return (
            <div className="space-y-2">
              <p className={`${textClass} whitespace-pre-wrap`}>{filteredMessage}</p>
            </div>
          );
      }
    }
    const detailCardClass = isDesktop
      ? "w-full max-w-3xl mx-auto my-12 p-12 rounded-[2rem] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[var(--border)]/40 bg-[var(--card-bg)] flex flex-col items-center justify-center relative overflow-hidden"
      : isTablet
      ? "w-full max-w-[680px] mx-auto my-8 p-10 rounded-[1.75rem] shadow-[0_12px_32px_rgba(0,0,0,0.13)] border border-[var(--border)]/40 bg-[var(--card-bg)] flex flex-col items-center justify-center relative overflow-hidden min-h-[56vh]"
      : "w-full max-w-[520px] mx-auto my-6 p-6 rounded-[1.5rem] shadow-[0_10px_24px_rgba(0,0,0,0.12)] border border-[var(--border)]/40 bg-[var(--card-bg)] flex flex-col items-center justify-center relative overflow-hidden min-h-[50vh]";

    return (
      <div
        className={detailCardClass}
        style={{ ...bgStyle, ...borderStyle }}
      >
        {/* Rough paper overlay for detail view */}
        {memory.animation === "rough" && (
            <div
              aria-hidden
              className="absolute inset-0 rounded-[inherit]"
              style={{
                backgroundImage: 'url(/rough-paper.webp)',
                backgroundSize: '250%',
                backgroundPosition: 'center',
                opacity: 0.5,
                mixBlendMode: 'multiply',
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
        )}


        {/* Header section */}
        <div className="w-full flex flex-col items-center relative z-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <h3 className={`${isDesktop ? "text-xl opacity-75 font-medium tracking-wide" : isTablet ? "text-[1.35rem] opacity-80 font-medium tracking-wide" : "text-2xl font-bold"} text-[var(--text)] text-center leading-tight drop-shadow-sm`}>
              To:{" "}
              {isLinkableName(memory.recipient) ? (
                <Link
                  href={`/name/${encodeURIComponent(memory.recipient.toLowerCase().trim())}`}
                  className="underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors"
                >
                  {memory.recipient}
                </Link>
              ) : (
                <span>{memory.recipient}</span>
              )}
            </h3>
          </div>
          
          {memory.sender && (
            <p className={`${isDesktop ? "text-xl opacity-75 font-medium tracking-wide" : isTablet ? "text-lg opacity-75 italic font-light" : "text-base italic font-light"} text-[var(--text)] mb-3 sm:mb-4 text-center`}>
              From:{" "}
              {isLinkableName(memory.sender) ? (
                <Link
                  href={`/name/${encodeURIComponent(memory.sender.toLowerCase().trim())}`}
                  className="underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors"
                >
                  {memory.sender}
                </Link>
              ) : (
                <span>{memory.sender}</span>
              )}
            </p>
          )}
          
          <hr className="my-2 border-[#999999] w-full" />
        </div>

        {/* Message section */}
        <div className={`w-full flex-1 flex flex-col justify-center items-center ${isTablet ? "my-6" : "my-4 sm:my-8"} relative z-10`}>
          <div className={`${isDesktop ? "text-5xl text-center" : isTablet ? "w-full max-w-[38rem] text-left" : "w-full max-w-[34rem] text-base text-left"} font-serif text-[var(--text)] leading-relaxed break-words hyphens-none px-3 sm:px-4`}>
            {isDesktop ? renderMessageLargeDetail(memory) : renderMessage(memory, false, true)}
          </div>
        </div>

        {/* Footer section */}
        <div className="w-full flex flex-col items-center relative z-10">
          <hr className="my-2 border-[#999999] w-full" />
          
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span className={`${isDesktop ? "text-xl" : isTablet ? "text-sm" : "text-xs"} text-[var(--text)] opacity-75 font-medium text-center tracking-wide`}>
              {dateStr} • {dayStr} • {timeStr}
            </span>
            <span className={`${isDesktop ? "text-base" : isTablet ? "text-sm" : "text-xs"} text-[var(--text)] opacity-60 font-light text-center capitalize`}>
              {effectiveColor}
            </span>
            {destructCountdown && !isDestructedNow && (
              <span className={`${isDesktop ? "text-sm" : isTablet ? "text-xs" : "text-[11px]"} font-mono opacity-90 text-[var(--text)]`}>
                self-destructs in <span className="font-bold">{destructCountdown}</span>
              </span>
            )}
          </div>
        </div>


      </div>
    );
  }

  return (
    <div className={`relative group ${compact ? 'my-1 sm:my-2 pb-7' : 'my-3 sm:my-4 pb-7'}`}>
      <div className="pointer-events-none absolute bottom-1 left-1/2 z-20 w-[84vw] max-w-[460px] -translate-x-1/2">
        <Link
          href={`/memories/${memory.id}`}
          aria-label="Open full memory"
          className="pointer-events-auto ml-auto -mr-1 flex h-11 w-[68px] items-center justify-end gap-1.5 transition-opacity duration-200 active:opacity-75"
          style={{ color: arrowStyle.color }}
        >
          <svg
            aria-hidden="true"
            className="h-3 w-8 opacity-35"
            viewBox="0 0 36 12"
            fill="none"
          >
            <path
              d="M1.5 7.1C8 5.9 14.5 7.8 20.8 6.7C25.3 5.9 29.8 5.8 34.5 6.5"
              stroke="currentColor"
              strokeWidth="1.15"
              strokeLinecap="round"
            />
          </svg>
          <span
            aria-hidden="true"
            className="block select-none text-3xl font-light leading-none opacity-50"
          >
            ›
          </span>
        </Link>
      </div>
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flip-card relative ${variant === "home" ? "w-[84vw] h-[400px] rounded-[1.75rem]" : "w-[84vw] h-[390px] rounded-[2rem]"} max-w-[460px] mx-auto perspective-1000 cursor-pointer hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-shadow duration-300`}
        onClick={handleCardClick}
        style={{ ...bgStyle, ...borderStyle, WebkitPerspective: '1000px', perspective: '1000px' } as React.CSSProperties}
      >
        {/* Rough paper base for underside during flip */}
        {memory.animation === "rough" && (
            <div
              aria-hidden
              className="absolute inset-0 rounded-[inherit]"
              style={{
                backgroundImage: 'url(/rough-paper.webp)',
                backgroundSize: '185%',
                backgroundPosition: 'center',
                opacity: 0.5,
                mixBlendMode: 'multiply',
                pointerEvents: "none",
              }}
            />
        )}
        <div
          className="flip-card-inner relative w-full h-full"
          style={{
            WebkitTransformStyle: 'preserve-3d',
            transformStyle: 'preserve-3d',
            WebkitTransform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          } as React.CSSProperties}
        >
          {/* FRONT */}
          <div
            className={`flip-card-front absolute w-full h-full backface-hidden ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} shadow-[0_15px_30px_rgba(0,0,0,0.04),0_6px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.12)] ${memory.animation === "rough" ? "overflow-hidden" : ""} p-5 flex flex-col justify-between ${flipped ? "pointer-events-none" : "pointer-events-auto"}`}
            style={{ ...bgStyle, ...borderStyle, WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', WebkitTransform: 'rotateY(0deg)', transform: 'rotateY(0deg)' } as React.CSSProperties}
          >
            {/* Rough paper overlay for front */}
            {memory.animation === "rough" && (
              <div
                aria-hidden
                className="absolute inset-0 rounded-[inherit]"
                style={{
                  backgroundImage: 'url(/rough-paper.webp)',
                  backgroundSize: '185%',
                  backgroundPosition: 'center',
                  opacity: 0.5,
                  mixBlendMode: 'multiply',
                  pointerEvents: "none",
                }}
              />
            )}

            <div className="pt-1 relative z-10">
              {memory.pinned && (
                <span
                  className="absolute top-0 right-0 z-20"
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
                      fontSize: '1.1rem',
                      lineHeight: 1,
                    }}
                  >
                    📌
                  </span>
                </span>
              )}
              <h3 className="text-xl font-bold text-[var(--text)] text-left leading-tight">
                <span className="break-words overflow-hidden leading-tight">
                  <span className="font-bold">To:</span>{" "}
                  {isLinkableName(memory.recipient) ? (
                    <Link
                      href={`/name/${encodeURIComponent(memory.recipient.toLowerCase().trim())}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold underline decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors"
                    >
                      {memory.recipient}
                    </Link>
                  ) : (
                    <span className="font-bold">{memory.recipient}</span>
                  )}
                </span>
              </h3>
              {memory.sender && (
                <p className="mt-1 text-lg italic text-[var(--text)] break-words overflow-hidden text-left">
                  From:{" "}
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
                </p>
              )}
              <hr className="my-2 border-[#999999]" />
            </div>

            {/* Message preview — faded teaser */}
            {!isDestructedNow && memory.message && (
              <div className="flex-1 flex items-center justify-center relative z-10 overflow-hidden px-1">
                <p className="text-sm font-serif text-[var(--text)] text-center leading-relaxed opacity-30 line-clamp-2">
                  {filterProfanity(memory.message)}
                </p>
              </div>
            )}

            <div className="relative z-10">
              <div className="text-sm text-[var(--text)] text-center font-normal">
                {dateStr} | {dayStr}
              </div>
              {createdAgoLabel && !isDestructedNow && (
                <div className="text-[12px] text-[var(--text)]/60 text-center font-normal mt-1">
                  {createdAgoLabel}
                </div>
              )}
            </div>

            <div className="h-[3em] w-full relative z-10 overflow-hidden">
              {destructCountdown && !isDestructedNow ? (
                <div className="text-[12px] text-center font-mono opacity-90 text-[var(--text)]">
                  <span className="opacity-80">self-destructs in</span>{" "}
                  <span className="font-bold">{destructCountdown}</span>
                </div>
              ) : isDestructedNow ? null : (
                <TypewriterPrompt tag={memory.tag} subTag={memory.sub_tag} typewriterEnabled={memory.typewriter_enabled} />
              )}
            </div>
          </div>
          {/* BACK */}
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} shadow-[0_15px_30px_rgba(0,0,0,0.04),0_6px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.12)] ${memory.animation === "rough" ? "overflow-hidden" : ""} p-5 flex flex-col justify-start rotate-y-180 ${flipped ? "pointer-events-auto" : "pointer-events-none"}`}
            style={{ ...bgStyle, ...borderStyle, WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', WebkitTransform: 'rotateY(180deg)', transform: 'rotateY(180deg)' } as React.CSSProperties}
          >
            {/* Rough paper overlay for back */}
            {memory.animation === "rough" && (
              <div
                aria-hidden
                className="absolute inset-0 rounded-[inherit]"
                style={{
                  backgroundImage: 'url(/rough-paper.webp)',
                  backgroundSize: '185%',
                  backgroundPosition: 'center',
                  opacity: 0.5,
                  mixBlendMode: 'multiply',
                  pointerEvents: "none",
                }}
              />
            )}
            <h3 className="text-xl italic text-[var(--text)] text-center relative z-10">if only i sent this</h3>
            <hr className="my-2 border-[#999999] relative z-10" />
            {memory.animation === "rough" ? (
              <div
                ref={roughScrollRef}
                className={`flex-1 ${roughNeedsScroll && flipped ? 'overflow-y-auto cute_scroll' : 'overflow-y-hidden'} text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2 relative z-10`}
                style={roughNeedsScroll && flipped ? {
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`,
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y',
                } as React.CSSProperties : undefined}
              >
                {renderMessage(memory)}
              </div>
            ) : (
              <ScrollableMessage
                active={flipped}
                style={
                  {
                    "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                    "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
                  } as React.CSSProperties
                }
              >
                <div className="relative z-10">
                  {renderMessage(memory)}
                </div>
              </ScrollableMessage>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(MemoryCard);
