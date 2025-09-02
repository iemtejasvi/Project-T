"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PoeticText from "./PoeticText";
import CursiveText from './CursiveText';
import BleedingText from './BleedingText';
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
}

interface MemoryCardProps {
  memory: Memory;
  detail?: boolean;
  variant?: "default" | "home";
}



const TypewriterPrompt: React.FC<{ tag?: string; subTag?: string }> = ({ tag, subTag }) => {
  // Create a stable, shuffled prompt array that doesn't change on re-renders
  const prompts = useMemo(() => {
    let selectedPrompts: string[] = [];
    
    // If we have a specific subTag, use prompts from that subcategory
    if (subTag && subTag !== "undefined" && subTag !== "null" && typewriterPromptsBySubTag[subTag]) {
      selectedPrompts = [...typewriterPromptsBySubTag[subTag]];
    }
    // If we have a main tag, use all prompts from that tag
    else if (tag && typewriterSubTags[tag]) {
      typewriterSubTags[tag].forEach(subTag => {
        const subPrompts = typewriterPromptsBySubTag[subTag] || [];
        selectedPrompts.push(...subPrompts);
      });
    }
    // If no tag is selected, show a mix of all categories
    else {
      Object.values(typewriterPromptsBySubTag).forEach(categoryPrompts => {
        // Take 2-3 random prompts from each category for diversity
        const shuffled = [...categoryPrompts].sort(() => 0.5 - Math.random());
        selectedPrompts.push(...shuffled.slice(0, Math.min(3, shuffled.length)));
      });
    }
    
    // Shuffle all selected prompts thoroughly and limit to 25 for variety
    return selectedPrompts
      .sort(() => 0.5 - Math.random())
      .sort(() => 0.5 - Math.random()) // Double shuffle for better randomness
      .slice(0, Math.min(25, selectedPrompts.length));
  }, [tag, subTag]);

  // Generate a unique random offset for each instance
  const randomOffset = useMemo(() => Math.random() * 2000 + 500, []);
  
  // Track used prompts to prevent immediate repeats
  const [usedPrompts, setUsedPrompts] = useState<Set<number>>(new Set());
  
  // Start with a random prompt
  const [currentIndex, setCurrentIndex] = useState(() => {
    const startIndex = Math.floor(Math.random() * prompts.length);
    return startIndex;
  });
  
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  // Reset used prompts when tag/subTag changes
  useEffect(() => {
    setUsedPrompts(new Set());
    setCurrentIndex(Math.floor(Math.random() * prompts.length));
    setDisplayedText("");
    setCharIndex(0);
    setIsDeleting(false);
  }, [tag, subTag, prompts.length]);

  useEffect(() => {
    const currentPrompt = prompts[currentIndex];
    let delay = isDeleting ? 50 : 100;
    
    // Add random variation to typing speed
    if (!isDeleting) {
      delay += Math.random() * 50; // Random 0-50ms variation
    }
    
    // Add the random offset only at the start
    if (!isDeleting && charIndex === 0) {
      delay += randomOffset;
    }
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentPrompt.substring(0, charIndex + 1));
        if (charIndex + 1 === currentPrompt.length) {
          // Random pause before deleting (2-4 seconds)
          const pauseTime = 2000 + Math.random() * 2000;
          setTimeout(() => setIsDeleting(true), pauseTime);
        } else {
          setCharIndex(charIndex + 1);
        }
      } else {
        setDisplayedText(currentPrompt.substring(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          
          // Mark current prompt as used
          setUsedPrompts(prev => new Set([...prev, currentIndex]));
          
          // Find next available prompt
          let newIndex;
          let attempts = 0;
          const maxAttempts = prompts.length * 2;
          
          do {
            // If we've used most prompts, reset the used set
            if (usedPrompts.size >= prompts.length * 0.8) {
              setUsedPrompts(new Set());
            }
            
            newIndex = Math.floor(Math.random() * prompts.length);
            attempts++;
            
            // Prevent infinite loop
            if (attempts > maxAttempts) {
              newIndex = (currentIndex + 1) % prompts.length;
              break;
            }
          } while (usedPrompts.has(newIndex) || newIndex === currentIndex);
          
          setCurrentIndex(newIndex);
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, prompts, randomOffset, usedPrompts]);

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

  const borderStyle =
    effectiveColor === "default"
      ? { borderColor: "#D9D9D9" }
      : { borderColor: `var(--color-${effectiveColor}-border)` };

  const bgStyle =
    effectiveColor === "default"
      ? { backgroundColor: "#F8F8F0" }
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
      case "poetic":
        return (
          <PoeticText message={memory.message} textClass={textClass} effectiveColor={effectiveColor} />
        );
      case "cursive":
        return (
          <CursiveText
            message={memory.message}
            textClass={textClass}
            effectiveColor={effectiveColor}
          />
        );
      case "bleeding":
        return <BleedingText message={memory.message} textClass={textClass} />;
      case "handwritten":
        return <HandwrittenText message={memory.message} textClass={textClass} />;
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
        case "poetic":
          return (
            <PoeticText message={memory.message} textClass={textClass} effectiveColor={effectiveColor} />
          );
        case "cursive":
          return (
            <CursiveText
              message={memory.message}
              textClass={textClass}
              effectiveColor={effectiveColor}
            />
          );
        case "bleeding":
          return <BleedingText message={memory.message} textClass={textClass} />;
        case "handwritten":
          return <HandwrittenText message={memory.message} textClass={textClass} />;
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
            ? "w-full max-w-3xl mx-auto my-16 p-16 rounded-[2rem] shadow-[0_25px_100px_rgba(0,0,0,0.3)] border-2 border-[var(--border)]/40 bg-gradient-to-br from-[var(--card-bg)]/95 via-[var(--card-bg)]/90 to-[var(--card-bg)]/95 backdrop-blur-2xl flex flex-col items-center justify-center relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.02] before:to-transparent before:rotate-45 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000"
            : "w-full max-w-[420px] mx-auto my-6 p-6 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] border border-[var(--border)]/40 bg-gradient-to-br from-[var(--card-bg)]/98 via-[var(--card-bg)]/95 to-[var(--card-bg)]/98 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.03] before:to-transparent before:rotate-45 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000"
        }
        style={{ ...bgStyle, ...borderStyle }}
      >


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
            <h3 className={`${isDesktop ? "text-6xl" : "text-2xl"} font-bold text-[var(--text)] text-center leading-tight drop-shadow-sm bg-gradient-to-r from-[var(--text)] to-[var(--text)]/80 bg-clip-text`}>
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
                      <div className={`${isDesktop ? "text-5xl" : "text-base"} font-serif text-center text-[var(--text)] leading-relaxed break-words hyphens-none px-3 sm:px-4 drop-shadow-sm relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--text)]/[0.02] to-transparent rounded-lg blur-xl"></div>
            <div className="relative z-10">
              {isDesktop ? renderMessageLargeDetail(memory) : renderMessage(memory, true)}
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="w-full flex flex-col items-center relative z-10">
          <hr className="my-2 border-[#999999] w-full" />
          
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span className={`${isDesktop ? "text-xl" : "text-xs"} text-[var(--text)] opacity-75 font-medium text-center tracking-wide drop-shadow-sm`}>
              {dateStr} • {dayStr} • {timeStr}
            </span>
            <span className={`${isDesktop ? "text-lg" : "text-xs"} text-[var(--text)] opacity-60 font-light text-center capitalize px-2 py-1 rounded-full bg-[var(--text)]/[0.05] border border-[var(--text)]/10 backdrop-blur-sm`}>
              {effectiveColor} theme
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
        className={`flip-card w-full max-w-xs sm:max-w-sm mx-auto perspective-1000 h-[300px] cursor-pointer ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-shadow duration-300`}
        onClick={handleCardClick}
        style={{ ...bgStyle, ...borderStyle }}
      >
        <motion.div 
          className="flip-card-inner relative w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          {/* FRONT */}
          <div
            className={`flip-card-front absolute w-full h-full backface-hidden ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} shadow-[0_15px_30px_rgba(0,0,0,0.04),0_6px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.12)] bg-gradient-to-br from-[var(--card-bg)]/99 via-[var(--card-bg)]/98 to-[var(--card-bg)]/99 backdrop-blur-[24px] p-5 flex flex-col justify-between`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            <div>
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
            <div className="text-xs text-[var(--text)] text-center font-normal">
              {dateStr} | {dayStr}
            </div>
            <div className="min-h-[2.5em] w-full">
              <TypewriterPrompt 
                key={`${memory.id}-${memory.tag}-${memory.sub_tag}`}
                tag={memory.tag} 
                subTag={memory.sub_tag} 
              />
            </div>
          </div>
          {/* BACK */}
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden ${variant === "home" ? "rounded-[1.75rem]" : "rounded-[2rem]"} shadow-[0_15px_30px_rgba(0,0,0,0.04),0_6px_12px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,0.12)] bg-gradient-to-br from-[var(--card-bg)]/99 via-[var(--card-bg)]/98 to-[var(--card-bg)]/99 backdrop-blur-[24px] p-5 flex flex-col justify-start rotate-y-180`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            <h3 className="text-lg italic text-[var(--text)] text-center">if only i sent this</h3>
            <hr className="my-2 border-[#999999]" />
            <ScrollableMessage
              style={
                {
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
                } as React.CSSProperties
              }
            >
              {renderMessage(memory)}
            </ScrollableMessage>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MemoryCard;
