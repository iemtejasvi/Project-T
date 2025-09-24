"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CursiveText from './CursiveText';
import HandwrittenText from './HandwrittenText';
import "../app/globals.css";
import { typewriterSubTags, typewriterPromptsBySubTag } from './typewriterPrompts';

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
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
    <div className="min-h-[2rem] overflow-hidden text-center text-sm text-[var(--text)] font-serif transition-all duration-300 whitespace-pre-wrap break-normal hyphens-auto">
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
      ? { backgroundColor: "#E8E0D0" }
      : memory.full_bg
      ? { backgroundColor: `var(--color-${effectiveColor}-bg)` }
      : {};

  const arrowStyle =
    effectiveColor === "default"
      ? { color: "#D9D9D9" }
      : { color: `var(--color-${effectiveColor}-border)` };

  const dateStr = new Date(memory.created_at).toLocaleDateString();
  const timeStr = new Date(memory.created_at).toLocaleTimeString();
  const dayStr = new Date(memory.created_at).toLocaleDateString(undefined, { weekday: "long" });

  const handleCardClick = () => {
    if (!detail) {
      setFlipped(!flipped);
    }
  };

  const renderMessage = (memory: Memory, forceLarge?: boolean) => {
    const wordCount = memory.message.split(/[\s.]+/).filter(word => word.length > 0).length;
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
            message={memory.message}
            textClass={textClass}
            effectiveColor={effectiveColor}
          />
        );
      case "handwritten":
        return <HandwrittenText message={memory.message} textClass={textClass} />;
      case "rough":
        // Use handwritten text sizing/feel; card-level background handles rough paper
        return <p className={`${textClass} la-belle-aurore-regular pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased`}>{memory.message}</p>;
      default:
        return (
          <div className="space-y-2">
            <p className={textClass}>{memory.message}</p>
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
          return <p className={`${textClass} la-belle-aurore-regular pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased`}>{memory.message}</p>;
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
            {memory.animation && memory.animation !== "none" && (
              <motion.span 
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className={`${isDesktop ? "text-4xl" : "text-xl"} drop-shadow-lg`}
                style={{ ...arrowStyle }}
              >
                ★
              </motion.span>
            )}
            <h3 className={`${isDesktop ? "text-5xl" : "text-2xl"} font-bold text-[var(--text)] text-center leading-tight drop-shadow-sm`}>
              To: {memory.recipient}
            </h3>
          </div>
          
          {memory.sender && (
            <p className={`${isDesktop ? "text-2xl" : "text-base"} italic text-[var(--text)] opacity-75 mb-3 sm:mb-4 text-center font-light tracking-wide`}>
              From: {memory.sender}
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
        className={`flip-card relative overflow-hidden w-full ${variant === "home" ? 'max-w-sm' : 'max-w-xs'} sm:max-w-sm mx-auto perspective-1000 ${variant === "home" ? 'h-[300px]' : 'h-[320px]'} cursor-pointer ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-shadow duration-300`}
        onClick={handleCardClick}
        style={{ ...bgStyle, ...borderStyle }}
      >
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
            className={`flip-card-front absolute w-full h-full backface-hidden ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} shadow-[0_15px_30px_rgba(0,0,0,0.04),0_6px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.12)] ${memory.animation === "rough" ? "overflow-hidden" : "bg-gradient-to-br from-[var(--card-bg)]/99 via-[var(--card-bg)]/98 to-[var(--card-bg)]/99 backdrop-blur-[24px]"} p-5 flex flex-col justify-between`}
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
                  }}
                />
              </>
            )}
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-[var(--text)] break-words overflow-hidden">
                  {memory.animation && memory.animation !== "none" && (
                    <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>
                      ★
                    </span>
                  )}
                  To: {memory.recipient}
                </h3>
                {memory.pinned && (
                  <span
                    className="relative inline-block animate-pin-pop"
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
              </div>
              {memory.sender && <p className="mt-1 text-md italic text-[var(--text)] break-words overflow-hidden">From: {memory.sender}</p>}
              <hr className="my-2 border-[#999999]" />
            </div>
            <div className="text-xs text-[var(--text)] text-center font-normal relative z-10">
              {dateStr} | {dayStr}
            </div>
            <div className="min-h-[2.5em] w-full relative z-10">
                              <TypewriterPrompt tag={memory.tag} subTag={memory.sub_tag} typewriterEnabled={memory.typewriter_enabled} />
            </div>
          </div>
          {/* BACK */}
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} shadow-[0_15px_30px_rgba(0,0,0,0.04),0_6px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.12)] ${memory.animation === "rough" ? "overflow-hidden" : "bg-gradient-to-br from-[var(--card-bg)]/99 via-[var(--card-bg)]/98 to-[var(--card-bg)]/99 backdrop-blur-[24px]"} p-5 flex flex-col justify-start rotate-y-180`}
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

export default MemoryCard;
