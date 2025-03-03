"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

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
    default: "#A0AEC0", // Light gray
    blue: "#63B3ED", // Light blue
    gray: "#A0AEC0",
    purple: "#B794F4", // Light purple
    navy: "#5A9BD3", // Lighter navy
    maroon: "#E57373", // Lighter red
    pink: "#F687B3", // Light pink
    teal: "#38B2AC",
    olive: "#A9B665", // Lighter olive
    mustard: "#FFDB58",
    coral: "#FF9A8B", // Lighter coral
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
      "Was it so simple? See what stayed.",
      "I never sent it. Look closer.",
      "Words locked away—dare a peek.",
      "Too raw to send. Uncover it.",
      "Unsaid and hidden. Might you see?",
      "A secret held tight. Dare a glance.",
      "I kept it inside. Could you find it?",
      "Unsent regret—what remains unseen?",
      "The truth stayed here. Perhaps you’ll know.",
      "I never let go. See the silent truth.",
      "Barely spoken—wanna see more?",
      "It lies unsent. Would you dare?",
      "All left behind. Could you unveil it?",
      "Hidden in quiet. Uncover my truth.",
      "The unsaid endures. Look a little closer.",
      "I held back my words. See if they shift.",
      "Silence remains—maybe you can sense it.",
      "Too much left unsaid. Notice it?",
      "I never released it. Find the hidden pain.",
      "The letter stayed. Let it reveal itself.",
      "All unsent. What if you noticed?",
      "I kept my silence. Dare to discern?",
      "Lost in stillness—see what lingers.",
      "It was never sent. Perhaps you'll sense it.",
      "My truth was hidden. Would you glimpse it?",
      "I held my words. Notice the quiet sorrow.",
      "Unspoken and raw—could you see it?",
      "What was never sent still lives here.",
      "The words stayed inside—could you unveil them?",
      "A quiet miss remains. Would you discover?",
      "I left it unsaid. Might you notice?",
      "A secret letter, unsent. Look a little closer.",
      "Unshared, it endures—could you sense its weight?",
      "I never dared to send it. See if it changes you.",
      "The silence holds a secret. Do you feel it?",
      "A muted farewell lingers—could you perceive it?",
      "I never let you in. Perhaps you'll understand.",
      "The unsent remains, hidden yet true.",
      "Too real to send—wanna glimpse the truth?",
      "My silence speaks volumes. Can you sense it?",
      "A quiet goodbye, left unsent. Look again.",
      "The words were mine alone—could you share them?",
      "I kept them hidden—maybe you'll notice the void.",
      "What was never sent still speaks softly.",
      "A secret kept in time—does it stir you?",
      "The unsaid lingers—perhaps you'll sense the loss.",
      "I never let it out. Could you feel the absence?",
      "Hidden sorrow endures—see if it calls to you.",
      "A missed goodbye remains—wonder what it holds?",
      "Unsent, unspoken—its truth lies here."
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * prompts.length));
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentPrompt = prompts[currentIndex];
    const typeSpeed = isDeleting ? 50 : 100;
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
          setCurrentIndex((currentIndex + 1) % prompts.length);
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, typeSpeed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, prompts]);

  return (
    <div className="h-6 text-center text-sm text-[var(--text)] font-serif">
      {displayedText}
    </div>
  );
};

const HandwrittenText: React.FC<{ message: string }> = ({ message }) => (
  <div className="handwritten-text">
    <p>{message}</p>
  </div>
);

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
      <div className={`w-full max-w-md mx-auto my-6 p-6 ${bgColor} ${borderColor} border-2 rounded-lg shadow-md`}>
        <h3 className="text-2xl font-bold text-[var(--text)]">
          {memory.animation && (
            <span style={{ fontSize: "0.8rem", color: arrowColor, marginRight: "4px" }}>★</span>
          )}
          To: {memory.recipient}
        </h3>
        {memory.sender && <p className="mt-1 text-lg italic text-[var(--text)]">From: {memory.sender}</p>}
        <hr className="my-4 border-[var(--border)]" />
        <div className="text-[var(--text)] whitespace-pre-wrap">{renderMessage(memory)}</div>
        <hr className="my-4 border-[var(--border)]" />
        <div className="text-xs text-[var(--text)] flex flex-wrap justify-center gap-2">
          <span>{dateStr}</span> | <span>{dayStr}</span> | <span>{timeStr}</span> | <span>{memory.color}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group my-6">
      <div className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 sm:right-[-50px]">
        <Link href={`/memories/${memory.id}`}>
          <span className="arrow-icon" style={{ color: arrowColor }}>➜</span>
        </Link>
      </div>
      <div
        className="flip-card w-full max-w-xs sm:max-w-sm mx-auto perspective-1000 aspect-square cursor-pointer"
        onClick={handleCardClick}
      >
        <div
          className={`flip-card-inner relative w-full h-full transition-transform duration-500 ${flipped ? "rotate-y-180" : ""}`}
        >
          <div
            className={`flip-card-front absolute w-full h-full backface-hidden ${bgColor} ${borderColor} border-2 rounded-lg shadow-md p-4 flex flex-col justify-between`}
          >
            <div>
              <h3 className="text-xl font-bold text-[var(--text)]">
                {memory.animation && (
                  <span style={{ fontSize: "0.8rem", color: arrowColor, marginRight: "4px" }}>★</span>
                )}
                To: {memory.recipient}
              </h3>
              {memory.sender && <p className="mt-1 text-md italic text-[var(--text)]">From: {memory.sender}</p>}
            </div>
            <div className="text-xs text-[var(--text)] text-center">
              {dateStr} | {dayStr}
            </div>
            <TypewriterPrompt />
          </div>
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden ${bgColor} ${borderColor} border-2 rounded-lg shadow-md p-4 flex flex-col justify-start rotate-y-180`}
          >
            <h3 className="text-lg italic text-[var(--text)] text-center">if only i sent this</h3>
            <hr className="my-2 border-[var(--border)]" />
            <div
              className="flex-1 overflow-y-auto card-scroll text-sm text-[var(--text)] whitespace-pre-wrap"
              style={{ "--scroll-thumb": arrowColor } as React.CSSProperties}
            >
              {renderMessage(memory)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
