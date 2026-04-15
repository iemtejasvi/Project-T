"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CursiveText from './CursiveText';
import HandwrittenText from './HandwrittenText';
import { laBelleAuroreClass } from '@/lib/fonts';
import "../app/globals.css";
import { DESTRUCTED_MESSAGES, allowedColors, colorMapping, colorBgMap } from './cardConstants';
import { SPECIAL_EFFECT_WORD_LIMIT, countWords } from '@/lib/constants';
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

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, detail, variant = "default", compact = false }) => {
  const [flipped, setFlipped] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClient, setIsClient] = useState(false);  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    setIsClient(true);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => {
      mql.removeEventListener("change", handler);
    };
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
      ? { color: "#D9D9D9" }
      : { color: `var(--color-${effectiveColor}-border)` },
    [effectiveColor]
  );

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

  const renderMessage = (memory: Memory, forceLarge?: boolean) => {
    if (isDestructedNow) {
      return (
        <div className={`${forceLarge ? 'text-[16px]' : 'text-[14px]'} leading-snug break-words hyphens-none opacity-90 font-mono`}>
          <p className="tracking-tight">
            This message was destructed{destructAtLabel ? ` at ${destructAtLabel}` : ''}. You're late to read it.
          </p>
          <p className="mt-3 opacity-80">{destructedMessage}</p>
        </div>
      );
    }
    const messageToRender = filterProfanity(memory.message);
    const wordCount = countWords(messageToRender);
    const isShortOrExact = wordCount <= SPECIAL_EFFECT_WORD_LIMIT;
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
        return <p className={`${textClass} ${laBelleAuroreClass} pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased whitespace-pre-wrap`}>{messageToRender}</p>;
      default:
        return (
          <div className="space-y-2">
            <p className={`${textClass} whitespace-pre-wrap`}>{messageToRender}</p>
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
              This message was destructed{destructAtLabel ? ` at ${destructAtLabel}` : ''}. You&apos;re late to read it.
            </p>
            <p className="mt-4 opacity-80">{destructedMessage}</p>
          </div>
        );
      }
      const filteredMessage = filterProfanity(memory.message);
      const wordCount = countWords(filteredMessage);
      const isShortOrExact = wordCount <= SPECIAL_EFFECT_WORD_LIMIT;
      const textClass = isShortOrExact
        ? "text-5xl tracking-wide leading-snug break-words hyphens-none"
        : "text-4xl tracking-wide leading-snug break-words hyphens-none";
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
    return (
      <div
        className={
          isDesktop
            ? "w-full max-w-3xl mx-auto my-12 p-12 rounded-[2rem] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[var(--border)]/40 bg-[var(--card-bg)] flex flex-col items-center justify-center relative overflow-hidden"
            : "w-full max-w-[520px] mx-auto my-6 p-6 rounded-[1.5rem] shadow-[0_10px_24px_rgba(0,0,0,0.12)] border border-[var(--border)]/40 bg-[var(--card-bg)] flex flex-col items-center justify-center relative overflow-hidden min-h-[50vh]"
        }
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
                        <h3 className={`${isDesktop ? "text-xl opacity-75 font-medium tracking-wide" : "text-2xl font-bold"} text-[var(--text)] text-center leading-tight drop-shadow-sm`}>
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
            <p className={`${isDesktop ? "text-xl opacity-75 font-medium tracking-wide" : "text-base italic font-light"} text-[var(--text)] mb-3 sm:mb-4 text-center`}>
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
        <div className="w-full flex-1 flex flex-col justify-center items-center my-4 sm:my-8 relative z-10">
          <div className={`${isDesktop ? "text-5xl" : "text-base"} font-serif text-center text-[var(--text)] leading-relaxed break-words hyphens-none px-3 sm:px-4`}>
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
            {destructCountdown && !isDestructedNow && (
              <span className={`${isDesktop ? "text-sm" : "text-[11px]"} font-mono opacity-90 text-[var(--text)]`}>
                self-destructs in <span className="font-bold">{destructCountdown}</span>
              </span>
            )}
          </div>
        </div>


      </div>
    );
  }

  return (
    <div className={`relative group ${compact ? 'my-2 sm:my-3' : 'my-4 sm:my-6'}`}>
      <div className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 sm:right-[-50px]">
        <Link href={`/memories/${memory.id}`}>
          <span className="arrow-icon" style={arrowStyle}>➜</span>
        </Link>
      </div>
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flip-card relative overflow-hidden w-[92vw] max-w-md mx-auto perspective-1000 h-[300px] cursor-pointer ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-shadow duration-300`}
        onClick={handleCardClick}
        style={{ ...bgStyle, ...borderStyle }}
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
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
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
                  zIndex: 0,
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
                <p className="mt-1 text-md italic text-[var(--text)] break-words overflow-hidden text-left">
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
              {destructCountdown && !isDestructedNow ? (
                <div className="text-[11px] text-center font-mono opacity-90 text-[var(--text)]">
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
            className={`flip-card-back absolute w-full h-full backface-hidden ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} shadow-[0_15px_30px_rgba(0,0,0,0.04),0_6px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.12)] ${memory.animation === "rough" ? "overflow-hidden" : ""} p-5 flex flex-col justify-start rotate-y-180`}
            style={{ ...bgStyle, ...borderStyle }}
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
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />
            )}
            <h3 className="text-lg italic text-[var(--text)] text-center relative z-10">if only i sent this</h3>
            <hr className="my-2 border-[#999999] relative z-10" />
            {memory.animation === "rough" ? (
              <div 
                className="flex-1 overflow-y-auto text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2 relative z-10 cute_scroll"
                style={{
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
                } as React.CSSProperties}
              >
                {renderMessage(memory)}
              </div>
            ) : (
              <ScrollableMessage
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default React.memo(MemoryCard);
