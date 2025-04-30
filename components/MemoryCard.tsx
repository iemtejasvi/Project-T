"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
}

interface MemoryCardProps {
  memory: Memory;
  detail?: boolean;
}

const TypewriterPrompt: React.FC = () => {
  const prompts = useMemo(
    () => [
      "Why did you?",
      "It still hurts.",
      "I still love you.",
      "I hope it was worth it.",
    ],
    []
  );

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
    <div className="min-h-[2rem] overflow-hidden text-center text-sm text-[var(--text)] font-serif transition-all duration-300 break-words px-4">
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
      className={`flex-1 overflow-y-auto text-sm text-[var(--text)] whitespace-pre-wrap break-words mt-4 mx-4 pb-4 ${
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

  // Dynamic sizing for short messages
  const isVeryShort = memory.message.length < 30;
  const cardHeightClass = isVeryShort ? 'h-[350px] sm:h-[400px]' : 'h-[300px] sm:h-[350px]';
  const paddingClass = isVeryShort ? 'p-8 sm:p-10' : 'p-6 sm:p-8';

  const allowedColors = new Set([
    "default",
    "mint",
    "cherry",
    "sapphire",
    "lavender",
    "coral",
    "olive",
    "turquoise",
    "amethyst",
    "gold",
    "midnight",
    "emerald",
    "ruby",
    "periwinkle",
    "peach",
    "sky",
    "lemon",
    "aqua",
    "berry",
    "graphite",
  ]);
  const colorMapping: Record<string, string> = { rose: "cherry" };
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

  const dateObj = new Date(memory.created_at);
  const dateStr = dateObj.toLocaleDateString();
  const timeStr = dateObj.toLocaleTimeString();
  const dayStr = dateObj.toLocaleDateString(undefined, { weekday: "long" });

  const handleCardClick = () => {
    if (!detail) {
      setFlipped(!flipped);
    }
  };

  const renderMessage = (memory: Memory) => {
    const isShort = memory.message.length < 100;
    const messageStyle: React.CSSProperties = isShort
      ? { fontSize: "1.5rem", lineHeight: 1.2 }
      : { lineHeight: 1.5 };
    const marginClasses = "mt-4 mx-4";

    switch (memory.animation) {
      case "bleeding":
        return (
          <p className={`bleeding-text ${marginClasses}`} style={messageStyle}>
            {memory.message}
          </p>
        );
      case "handwritten":
        return (
          <div className={marginClasses}>
            <HandwrittenText message={memory.message} messageStyle={messageStyle} />
          </div>
        );
      default:
        return (
          <p className={marginClasses} style={messageStyle}>
            {memory.message}
          </p>
        );
    }
  };

  if (detail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-xs sm:max-w-sm mx-auto my-6 border-2 rounded-2xl shadow-lg flex flex-col ${paddingClass} ${isVeryShort ? 'min-h-[350px]' : 'min-h-[300px]'}`}
        style={{ ...bgStyle, ...borderStyle }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--text)]">
            {memory.animation && (
              <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>
                ★
              </span>
            )}
            To: {memory.recipient}
          </h3>
          {memory.sender && <p className="mt-2 text-lg italic text-[var(--text)]">From: {memory.sender}</p>}
          <hr className="my-4 border-[var(--border)]" />
        </div>
        <div className="flex-grow text-[var(--text)] whitespace-pre-wrap break-words mt-4 mx-4">
          {renderMessage(memory)}
        </div>
        <hr className="my-4 border-[var(--border)]" />
        <div className="text-xs text-[var(--text)] text-center space-x-2 whitespace-nowrap">
          <span>{dateStr}</span> | <span>{dayStr}</span> | <span>{timeStr}</span> | <span>{effectiveColor}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative group my-6">
      <div className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 sm:right-[-50px]">
        <Link href={`/memories/${memory.id}`}>
          <span className="arrow-icon" style={arrowStyle}>➜</span>
        </Link>
      </div>
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flip-card w-full max-w-xs sm:max-w-sm mx-auto perspective-1000 ${cardHeightClass} cursor-pointer rounded-2xl hover:shadow-2xl`}
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
            className={`flip-card-front absolute w-full h-full backface-hidden rounded-2xl shadow-md flex flex-col justify-between text-center ${paddingClass}`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            <div>
              <h3 className="text-xl font-bold text-[var(--text)]">
                {memory.animation && (
                  <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>
                    ★
                  </span>
                )}
                To: {memory.recipient}
              </h3>
              {memory.sender && <p className="mt-2 text-md italic text-[var(--text)]">From: {memory.sender}</p>}
              <hr className="my-4 border-[var(--border)]" />
            </div>
            <div className="text-xs text-[var(--text)]">
              {dateStr} | {dayStr}
            </div>
            <TypewriterPrompt />
          </div>
          {/* BACK */}
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden rounded-2xl shadow-md flex flex-col justify-start rotate-y-180 text-center ${paddingClass}`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            <h3 className="italic text-lg text-[var(--text)]">if only i sent this</h3>
            <hr className="my-4 border-[var(--border)]" />
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

interface HandwrittenTextProps {
  message: string;
  messageStyle: React.CSSProperties;
}

const HandwrittenText: React.FC<HandwrittenTextProps> = ({ message, messageStyle }) => (
  <div className="handwritten-text">
    <p style={messageStyle}>{message}</p>
  </div>
);

export default MemoryCard;
