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
  letter_style: string;
  animation?: string;
  pinned?: boolean;
  tag?: string;
  sub_tag?: string;
}

interface MemoryCardProps {
  memory: Memory;
  detail?: boolean;
}



const TypewriterPrompt: React.FC<{ tag?: string; subTag?: string }> = ({ tag, subTag }) => {
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
          setCurrentIndex(
            Math.floor(Math.random() * prompts.length)
          );
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, prompts, randomOffset]);

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

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, detail }) => {
  const [flipped, setFlipped] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
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
      ? "text-3xl tracking-wide leading-snug break-words hyphens-none"
      : isShortOrExact
        ? "text-2xl tracking-wide leading-snug break-words hyphens-none"
        : "text-lg tracking-wide leading-snug break-words hyphens-none";
    
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
            ? "w-full max-w-2xl min-h-[500px] mx-auto my-16 p-16 rounded-3xl shadow-2xl border border-[var(--border)]/30 bg-[var(--card-bg)]/90 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden"
            : "w-full max-w-md mx-auto my-8 p-6 rounded-3xl shadow-xl border border-[var(--border)]/30 bg-[var(--card-bg)]/95 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]"
        }
        style={{ ...bgStyle, ...borderStyle }}
      >


        {/* Header section */}
        <div className="w-full flex flex-col items-center relative z-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            {memory.animation && memory.animation !== "none" && (
              <span 
                className="text-xl sm:text-2xl md:text-3xl"
                style={{ ...arrowStyle }}
              >
                ★
              </span>
            )}
            <h3 className={`${isDesktop ? "text-5xl" : "text-2xl sm:text-3xl"} font-bold text-[var(--text)] text-center leading-tight`}>
              To: {memory.recipient}
            </h3>
          </div>
          
          {memory.sender && (
            <p 
              className={`${isDesktop ? "text-xl" : "text-base sm:text-lg"} italic text-[var(--text)] opacity-80 mb-3 sm:mb-4 text-center`}
            >
              From: {memory.sender}
            </p>
          )}
          
          <hr className="my-2 border-[#999999] w-full" />
        </div>

        {/* Message section */}
        <div className="w-full flex-1 flex flex-col justify-center items-center my-6 sm:my-8 relative z-10">
          <div className={`${isDesktop ? "text-4xl" : "text-2xl sm:text-3xl"} font-serif text-center text-[var(--text)] leading-relaxed break-words hyphens-none px-3 sm:px-4`}>
            {isDesktop ? renderMessageLargeDetail(memory) : renderMessage(memory, true)}
          </div>
        </div>

        {/* Footer section */}
        <div className="w-full flex flex-col items-center relative z-10">
          <hr className="my-2 border-[#999999] w-full" />
          
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span className={`${isDesktop ? "text-lg" : "text-xs sm:text-sm"} text-[var(--text)] opacity-70 font-medium text-center`}>
              {dateStr} • {dayStr} • {timeStr}
            </span>
            <span className={`${isDesktop ? "text-base" : "text-xs"} text-[var(--text)] opacity-50 font-normal text-center capitalize`}>
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
        className="flip-card w-full max-w-xs sm:max-w-sm mx-auto perspective-1000 h-[300px] cursor-pointer rounded-xl hover:shadow-2xl"
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
            className="flip-card-front absolute w-full h-full backface-hidden rounded-xl shadow-md p-4 flex flex-col justify-between"
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
                              <TypewriterPrompt tag={memory.tag} subTag={memory.sub_tag} />
            </div>
          </div>
          {/* BACK */}
          <div
            className="flip-card-back absolute w-full h-full backface-hidden rounded-xl shadow-md p-4 flex flex-col justify-start rotate-y-180"
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
