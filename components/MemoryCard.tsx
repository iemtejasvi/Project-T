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
      "I hope it was worth it.",
      "You chose this.",
      "I was never enough.",
      "Did you ever mean it?",
      "Was it a lie?",
      "You let go first.",
      "I won’t ask again.",
      "So that’s it?",
      "You promised.",
      "I waited. You didn’t.",
      "You stopped trying.",
      "This is what you wanted.",
      "I saw the signs.",
      "You made it easy to leave.",
      "I still check.",
      "We had forever.",
      "You left so quietly.",
      "I almost called.",
      "Do you even care?",
      "Was I just convenient?",
      "I still dream of you.",
      "This doesn’t feel real.",
      "I should hate you.",
      "You changed first.",
      "What a waste.",
      "I’m done waiting.",
      "You’re a stranger now.",
      "Was it ever love?",
      "I’ll never know why.",
      "You never looked back.",
      "I still hear your voice.",
      "I don’t know you anymore.",
      "You chose someone else.",
      "Was I easy to forget?",
      "I deserved better.",
      "You let me down.",
      "I don’t miss you. (Lie)",
      "I should have left first.",
      "Did you even love me?",
      "It wasn’t supposed to end.",
      "How long were you pretending?",
      "Did you find better?",
      "You said forever.",
      "I wish I hated you.",
      "Was it all fake?",
      "I don’t blame you.",
      "You never fought for me.",
      "I loved you. That was my mistake.",
      "You disappeared so easily.",
      "We don’t even talk now.",
      "You broke me. Did you notice?",
      "What changed?",
      "You moved on too fast.",
      "I saw you with her.",
      "Was I just a phase?",
      "I wish you missed me.",
      "I wish I could forget.",
      "I hope she’s worth it.",
      "You never said sorry.",
      "I wrote, then deleted it.",
      "I hope it haunts you.",
      "You always walked away first.",
      "I never stopped loving you.",
      "You don’t even check.",
      "This is all I have left.",
      "I still have your hoodie.",
      "I hate how much I care.",
      "I don’t text first anymore.",
      "You knew you’d hurt me.",
      "I lost myself in you.",
      "Was I a mistake?",
      "You faded so easily.",
      "You left and never looked back.",
      "I should’ve left too.",
      "Why wasn’t I enough?",
      "You never fought for me.",
      "You didn’t even try.",
      "Did I mean anything?",
      "I still have your playlist.",
      "I was never yours, was I?",
      "I can’t hate you.",
      "You left without a word.",
      "I should hate you, but I don’t.",
      "I should have let go first.",
      "You meant everything.",
      "You left me empty.",
      "Do you even remember?",
      "You forgot me so fast.",
      "I wish I didn’t care.",
      "You chose her.",
      "You were my home.",
      "I gave you everything.",
      "This wasn’t the plan.",
      "I should be over this.",
      "I hate that I miss you.",
      "I should have seen it coming.",
      "You don’t even think of me.",
      "You took my heart with you.",
      "I hope you’re happy.",
      "You let go too soon.",
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
        whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flip-card w-full max-w-xs sm:max-w-sm mx-auto perspective-1000 h-[250px] cursor-pointer rounded-xl hover:shadow-2xl"
        onClick={handleCardClick}
      >
        <motion.div 
          className="flip-card-inner relative w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
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
