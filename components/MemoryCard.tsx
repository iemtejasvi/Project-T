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

// Color mappings for the light palette
function getBorderColor(color: string) {
  const mapping: { [key: string]: string } = {
    default: "border-gray-300",
    blue: "border-blue-300",
    gray: "border-gray-300",
    purple: "border-purple-300",
    navy: "border-blue-400",
    maroon: "border-red-300",
    pink: "border-pink-300",
    teal: "border-teal-300",
    olive: "border-green-300",
    mustard: "border-yellow-300",
    coral: "border-orange-300",
    lavender: "border-purple-200",
  };
  return mapping[color] || "border-gray-300";
}

function getColorHex(color: string): string {
  const mapping: { [key: string]: string } = {
    default: "#A0AEC0",
    blue: "#63B3ED",
    gray: "#A0AEC0",
    purple: "#B794F4",
    navy: "#5A9BD3",
    maroon: "#E57373",
    pink: "#F687B3",
    teal: "#38B2AC",
    olive: "#A9B665",
    mustard: "#FFDB58",
    coral: "#FF9A8B",
    lavender: "#E6E6FA",
  };
  return mapping[color] || "#A0AEC0";
}

function getBgColor(color: string, full_bg: boolean) {
  if (full_bg) {
    const mapping: { [key: string]: string } = {
      default: "bg-gray-50",
      blue: "bg-blue-50",
      gray: "bg-gray-50",
      purple: "bg-purple-50",
      navy: "bg-blue-50",
      maroon: "bg-red-50",
      pink: "bg-pink-50",
      teal: "bg-teal-50",
      olive: "bg-green-50",
      mustard: "bg-yellow-50",
      coral: "bg-orange-50",
      lavender: "bg-purple-50",
    };
    return mapping[color] || "bg-gray-50";
  }
  return "bg-[var(--card-bg)]";
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
  const borderColor = getBorderColor(memory.color);
  const bgColor = getBgColor(memory.color, memory.full_bg);
  const arrowColor = getColorHex(memory.color);

  const dateStr = new Date(memory.created_at).toLocaleDateString();
  const timeStr = new Date(memory.created_at).toLocaleTimeString();
  const dayStr = new Date(memory.created_at).toLocaleDateString(undefined, { weekday: "long" });

  const handleCardClick = () => !detail && setFlipped(!flipped);

  // Determine hover animation based on animation type
  const hoverAnimation =
    memory.animation === "handwritten"
      ? { scale: 1.01, boxShadow: "0 6px 12px rgba(0,0,0,0.1)" }
      : { scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" };

  if (detail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`w-full max-w-xs sm:max-w-sm mx-auto my-6 p-6 ${bgColor} ${borderColor} border-2 rounded-xl shadow-md flex flex-col min-h-[300px] hover:shadow-2xl`}
      >
        <div>
          <h3 className="text-2xl font-bold text-[var(--text)]">
            {memory.animation && (
              <span style={{ fontSize: "0.8rem", color: arrowColor, marginRight: "4px" }}>★</span>
            )}
            To: {memory.recipient}
          </h3>
          {memory.sender && <p className="mt-1 text-lg italic text-[var(--text)]">From: {memory.sender}</p>}
          <hr className="my-2 border-[var(--border)]" />
        </div>
        <div className="flex-grow text-[var(--text)] whitespace-pre-wrap break-words">
          {renderMessage(memory)}
        </div>
        <hr className="my-2 border-[var(--border)]" />
        <div className="text-xs text-[var(--text)] flex flex-wrap justify-center gap-2">
          <span>{dateStr}</span> | <span>{dayStr}</span> | <span>{timeStr}</span> | <span>{memory.color}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative group my-6">
      <div className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 sm:right-[-50px]">
        <Link href={`/memories/${memory.id}`}>
          <span className="arrow-icon" style={{ color: arrowColor }}>➜</span>
        </Link>
      </div>
      <motion.div
        whileHover={hoverAnimation}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flip-card w-full max-w-xs sm:max-w-sm mx-auto perspective-1000 h-[300px] cursor-pointer rounded-xl hover:shadow-2xl"
        onClick={handleCardClick}
      >
        <motion.div 
          className="flip-card-inner relative w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          <div
            className={`flip-card-front absolute w-full h-full backface-hidden ${bgColor} ${borderColor} border-2 rounded-xl shadow-md p-4 flex flex-col justify-between`}
          >
            <div>
              <h3 className="text-xl font-bold text-[var(--text)]">
                {memory.animation && (
                  <span style={{ fontSize: "0.8rem", color: arrowColor, marginRight: "4px" }}>★</span>
                )}
                To: {memory.recipient}
              </h3>
              {memory.sender && <p className="mt-1 text-md italic text-[var(--text)]">From: {memory.sender}</p>}
              <hr className="my-2 border-[var(--border)]" />
            </div>
            <div className="text-xs text-[var(--text)] text-center">
              {dateStr} | {dayStr}
            </div>
            <TypewriterPrompt />
          </div>
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden ${bgColor} ${borderColor} border-2 rounded-xl shadow-md p-4 flex flex-col justify-start rotate-y-180`}
          >
            <h3 className="text-lg italic text-[var(--text)] text-center">if only i sent this</h3>
            <hr className="my-2 border-[var(--border)]" />
            <div
              className="flex-1 overflow-y-auto card-scroll text-sm text-[var(--text)] whitespace-pre-wrap break-words"
              style={{ "--scroll-thumb": arrowColor } as React.CSSProperties}
            >
              {renderMessage(memory)}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const renderMessage = (memory: Memory) => {
  switch (memory.animation) {
    case "bleeding":
      return <p className="bleeding-text">{memory.message}</p>;
    case "handwritten":
      return <HandwrittenText message={memory.message} />;
    default:
      return <p>{memory.message}</p>;
  }
};

const HandwrittenText: React.FC<{ message: string }> = ({ message }) => (
  <div className="handwritten-text">
    <p>{message}</p>
  </div>
);

export default MemoryCard;
