"use client";
import React, { useState, useEffect, useMemo } from "react";
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
      "I’m forever missing you."
    ],
    []
  );

  // Desynchronize multiple instances with a random offset
  const randomOffset = useMemo(() => Math.random() * 1000, []);
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * prompts.length));
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
          setCurrentIndex(Math.floor(Math.random() * prompts.length));
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, prompts, randomOffset]);

  return (
    <div className="min-h-[2rem] overflow-hidden text-center text-sm text-[var(--text)] font-serif transition-all duration-300 break-words">
      {displayedText}
    </div>
  );
};

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, detail }) => {
  const [flipped, setFlipped] = useState(false);

  // Map any old or unknown color names to new ones
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
    "graphite"
  ]);
  const colorMapping: Record<string, string> = {
    rose: "cherry"
  };
  let effectiveColor = memory.color;
  if (!allowedColors.has(memory.color)) {
    effectiveColor = colorMapping[memory.color] || "default";
  }

  // Ensure default always uses off white background and fixed border regardless of full_bg.
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

  // If message is < 100 chars, we display it slightly bigger
  const renderMessage = (memory: Memory) => {
    const isShort = memory.message.length < 100;
    const messageStyle = isShort ? { fontSize: "1.5rem" } : {};
    switch (memory.animation) {
      case "bleeding":
        return <p className="bleeding-text" style={messageStyle}>{memory.message}</p>;
      case "handwritten":
        return <HandwrittenText message={memory.message} messageStyle={messageStyle} />;
      default:
        return <p style={messageStyle}>{memory.message}</p>;
    }
  };

  if (detail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-xs sm:max-w-sm mx-auto my-6 p-6 border-2 rounded-xl shadow-md flex flex-col min-h-[300px] hover:shadow-2xl"
        style={{ ...bgStyle, ...borderStyle }}
      >
        <div>
          <h3 className="text-2xl font-bold text-[var(--text)]">
            {memory.animation && (
              <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>★</span>
            )}
            To: {memory.recipient}
          </h3>
          {memory.sender && (
            <p className="mt-1 text-lg italic text-[var(--text)]">From: {memory.sender}</p>
          )}
          <hr className="my-2 border-[var(--border)]" />
        </div>
        {/* Added pt-2 so emojis or large text won't clip at the top */}
        <div className="flex-grow text-[var(--text)] whitespace-pre-wrap break-words pt-2">
          {renderMessage(memory)}
        </div>
        <hr className="my-2 border-[var(--border)]" />
        {/* Removed flex-wrap and added whitespace-nowrap to keep details on one line */}
        <div className="text-xs text-[var(--text)] flex justify-center gap-2 whitespace-nowrap">
          <span>{dateStr}</span> | <span>{dayStr}</span> | <span>{timeStr}</span> | <span>{effectiveColor}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative group my-6">
      <div className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 sm:right-[-50px]">
        <Link href={`/memories/${memory.id}`}>
          <span className="arrow-icon" style={arrowStyle}>
            ➜
          </span>
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
              <h3 className="text-xl font-bold text-[var(--text)]">
                {memory.animation && (
                  <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>★</span>
                )}
                To: {memory.recipient}
              </h3>
              {memory.sender && (
                <p className="mt-1 text-md italic text-[var(--text)]">From: {memory.sender}</p>
              )}
              <hr className="my-2 border-[var(--border)]" />
            </div>
            <div className="text-xs text-[var(--text)] text-center">
              {dateStr} | {dayStr}
            </div>
            <TypewriterPrompt />
          </div>

          {/* BACK */}
          <div
            className="flip-card-back absolute w-full h-full backface-hidden rounded-xl shadow-md p-4 flex flex-col justify-start rotate-y-180"
            style={{ ...bgStyle, ...borderStyle }}
          >
            <h3 className="text-lg italic text-[var(--text)] text-center">if only i sent this</h3>
            <hr className="my-2 border-[var(--border)]" />
            {/* Added pt-2 to avoid clipping emojis/text at the top */}
            <div className="flex-1 overflow-y-auto card-scroll text-sm text-[var(--text)] whitespace-pre-wrap break-words pt-2">
              {renderMessage(memory)}
            </div>
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
