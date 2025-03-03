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

function getBorderColor(color: string) {
  const mapping: { [key: string]: string } = {
    default: "border-gray-400",
    blue: "border-blue-400",
    gray: "border-gray-400",
    purple: "border-purple-400",
    navy: "border-blue-900",
    maroon: "border-red-800",
    pink: "border-pink-400",
    teal: "border-teal-400",
    olive: "border-olive-400",
    mustard: "border-yellow-600",
    coral: "border-coral-400",
    lavender: "border-lavender-400",
  };
  return mapping[color] || "border-gray-400";
}

function getColorHex(color: string): string {
  const mapping: { [key: string]: string } = {
    default: "#A0AEC0",
    blue: "#63B3ED",
    gray: "#A0AEC0",
    purple: "#B794F4",
    navy: "#2A4365",
    maroon: "#C53030",
    pink: "#F687B3",
    teal: "#38B2AC",
    olive: "#808000",
    mustard: "#FFDB58",
    coral: "#FF6F61",
    lavender: "#E6E6FA",
  };
  return mapping[color] || "#A0AEC0";
}

function getBgColor(color: string) {
  const mapping: { [key: string]: string } = {
    default: "bg-gray-700",
    blue: "bg-blue-700",
    gray: "bg-gray-700",
    purple: "bg-purple-700",
    navy: "bg-blue-900",
    maroon: "bg-red-900",
    pink: "bg-pink-700",
    teal: "bg-teal-700",
    olive: "bg-olive-700",
    mustard: "bg-yellow-700",
    coral: "bg-coral-700",
    lavender: "bg-lavender-700",
  };
  return mapping[color] || "bg-gray-700";
}

function getScrollColors(color: string) {
  const mapping: { [key: string]: { track: string; thumb: string } } = {
    default: { track: "#ECEFF1", thumb: "#90A4AE" },
    blue: { track: "#BBDEFB", thumb: "#1E88E5" },
    gray: { track: "#ECEFF1", thumb: "#607D8B" },
    purple: { track: "#E1BEE7", thumb: "#8E24AA" },
    navy: { track: "#BBDEFB", thumb: "#0D47A1" },
    maroon: { track: "#FFCDD2", thumb: "#C62828" },
    pink: { track: "#F8BBD0", thumb: "#D81B60" },
    teal: { track: "#B2DFDB", thumb: "#00796B" },
    olive: { track: "#D9E2C9", thumb: "#556B2F" },
    mustard: { track: "#FFF9C4", thumb: "#FBC02D" },
    coral: { track: "#FFCCBC", thumb: "#F4511E" },
    lavender: { track: "#EDE7F6", thumb: "#9575CD" },
  };
  return mapping[color] || { track: "#ECEFF1", thumb: "#90A4AE" };
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

  const initialIndex = useMemo(() => Math.floor(Math.random() * prompts.length), [prompts]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
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
    <div className="h-6 text-center text-sm text-gray-400 font-serif">
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
  const bgColor = memory.full_bg ? getBgColor(memory.color) : "bg-gray-800/90";
  const scrollColors = getScrollColors(memory.color);
  const arrowColor = getColorHex(memory.color);

  const dateStr = new Date(memory.created_at).toLocaleDateString();
  const timeStr = new Date(memory.created_at).toLocaleTimeString();
  const dayStr = new Date(memory.created_at).toLocaleDateString(undefined, { weekday: "long" });

  const handleCardClick = () => {
    setFlipped(!flipped);
  };

  if (detail) {
    return (
      <div className={`book-card mx-auto my-4 w-full max-w-md p-6 ${bgColor} ${borderColor} border-4 rounded-lg shadow-xl`}>
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-gray-200">
            {memory.animation && (
              <span style={{ fontSize: "0.8rem", color: arrowColor, marginRight: "4px" }}>★</span>
            )}
            To: {memory.recipient}
          </h3>
          {memory.sender && <p className="mt-1 text-lg italic text-gray-400">From: {memory.sender}</p>}
        </div>
        <hr className="my-2 border-gray-600" />
        <div className="mb-2 text-gray-300">{renderMessage(memory)}</div>
        <hr className="my-2 border-gray-600" />
        <div className="text-xs text-gray-400 flex flex-wrap justify-center gap-2">
          <span>Date: {dateStr}</span>
          <span>|</span>
          <span>Day: {dayStr}</span>
          <span>|</span>
          <span>Time: {timeStr}</span>
          <span>|</span>
          <span>Color: {memory.color}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute right-[-30px] top-1/2 transform -translate-y-1/2">
        <Link href={`/memories/${memory.id}`}>
          <span className="text-3xl arrow-icon" style={{ color: arrowColor }}>➜</span>
        </Link>
      </div>
      <div
        className="flip-card w-full max-w-sm mx-auto my-4 perspective-1000 aspect-square cursor-pointer overflow-hidden"
        onClick={handleCardClick}
      >
        <div
          className={`flip-card-inner relative w-full h-full transition-transform duration-700 transform ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          <div
            className={`flip-card-front absolute w-full h-full backface-hidden rounded-lg shadow-xl ${bgColor} ${borderColor} border-4 p-4 flex flex-col justify-between`}
          >
            <div>
              <h3 className="text-xl font-bold text-gray-200">
                {memory.animation && (
                  <span style={{ fontSize: "0.8rem", color: arrowColor, marginRight: "4px" }}>★</span>
                )}
                To: {memory.recipient}
              </h3>
              {memory.sender && <p className="mt-1 text-md italic text-gray-400">From: {memory.sender}</p>}
            </div>
            <hr className="border-t border-gray-600 my-1" />
            <div className="text-xs text-gray-400 flex flex-wrap justify-center gap-1">
              <span>Date: {dateStr}</span>
              <span>|</span>
              <span>Day: {dayStr}</span>
              <span>|</span>
              <span>Time: {timeStr}</span>
              <span>|</span>
              <span>Color: {memory.color}</span>
            </div>
            <div className="mt-2">
              <TypewriterPrompt />
            </div>
          </div>
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden rounded-lg shadow-xl ${bgColor} ${borderColor} border-4 transform rotate-y-180 p-4 flex flex-col justify-start`}
          >
            <div>
              <h3 className="text-lg italic text-gray-400 text-center">if only I sent this</h3>
              <hr className="border-t border-gray-600 my-1" />
            </div>
            <div
              className="flex-1 overflow-y-auto card-scroll cute_scroll text-sm text-gray-300 whitespace-pre-wrap"
              style={
                {
                  "--scroll-bg": scrollColors.track,
                  "--scroll-thumb": scrollColors.thumb,
                } as React.CSSProperties
              }
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
