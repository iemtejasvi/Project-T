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
  };
  return mapping[color] || mapping["default"];
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
  };
  return mapping[color] || "#A0AEC0";
}

function getBgColor(color: string) {
  const mapping: { [key: string]: string } = {
    default: "bg-gray-100",
    blue: "bg-blue-100",
    gray: "bg-gray-100",
    purple: "bg-purple-100",
    navy: "bg-blue-100",
    maroon: "bg-red-100",
    pink: "bg-pink-100",
    teal: "bg-teal-100",
  };
  return mapping[color] || mapping["default"];
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
  };
  return mapping[color] || mapping["default"];
}

/* 
   TypewriterPrompt: cycles through 50 very short, refined lines 
   that evoke the unsent pain – all still here, unchanged.
*/
const TypewriterPrompt: React.FC = () => {
  const prompts = useMemo(() => [
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
  ], []);
  
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
    <div className="h-6 text-center text-sm text-gray-700 font-serif">
      {displayedText}
    </div>
  );
};

/* BrokenWordsText component for Broken Words Effect */
const BrokenWordsText: React.FC<{ message: string }> = ({ message }) => {
  const words = message.split(" ");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <p>
      {words.map((word, index) => (
        <span
          key={index}
          className={`broken-word ${index === activeIndex ? "active" : ""}`}
          data-text={word}
        >
          {word}
        </span>
      ))}
    </p>
  );
};

/* HandwrittenText component for Handwritten Text Effect */
const HandwrittenText: React.FC<{ message: string }> = ({ message }) => (
  <div className="handwritten-text">
    <p>{message}</p>
  </div>
);

/* renderMessage function */
const renderMessage = (memory: Memory, arrowColor: string) => {
  switch (memory.animation) {
    case "bleeding":
      return <p className="bleeding-text">{memory.message}</p>;
    case "broken":
      return <BrokenWordsText message={memory.message} />;
    case "neon":
      return (
        <div className="neon-container" style={{ '--heart-color': arrowColor } as React.CSSProperties}>
          <div className="neon-heart">
            <svg width="150" height="150" viewBox="0 0 150 150">
              <g transform="translate(100 100)">
                <path
                  transform="translate(-75 -75)"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  d="M92.71,7.27L92.71,7.27c-9.71-9.69-25.46-9.69-35.18,0L50,14.79l-7.54-7.52C32.75-2.42,17-2.42,7.29,7.27v0 c-9.71,9.69-9.71,25.41,0,35.1L50,85l42.71-42.63C102.43,32.68,102.43,16.96,92.71,7.27z"
                />
              </g>
            </svg>
            <div className="gradient"></div>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <g transform="translate(100 100)">
                <path
                  transform="translate(-75 -75)"
                  stroke="#fffa"
                  strokeWidth="1"
                  strokeLinecap="round"
                  fill="none"
                  d="M92.71,7.27L92.71,7.27c-9.71-9.69-25.46-9.69-35.18,0L50,14.79l-7.54-7.52C32.75-2.42,17-2.42,7.29,7.27v0 c-9.71,9.69-9.71,25.41,0,35.1L50,85l42.71-42.63C102.43,32.68,102.43,16.96,92.71,7.27z"
                />
              </g>
            </svg>
          </div>
          <div className="background"></div>
          <p className="neon-text">{memory.message}</p>
        </div>
      );
    case "handwritten":
      return <HandwrittenText message={memory.message} />;
    default:
      return <p>{memory.message}</p>;
  }
};

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, detail }) => {
  console.log("Memory prop in MemoryCard:", memory); // Debug memory prop

  const [flipped, setFlipped] = useState(false);
  const borderColor = getBorderColor(memory.color);
  const bgColor = memory.full_bg ? getBgColor(memory.color) : "bg-white/90";
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
          <h3 className="text-2xl font-bold text-gray-800">
            {memory.animation && <span style={{ fontSize: "0.8rem", color: arrowColor, marginRight: "4px" }}>★</span>}
            To: {memory.recipient}
          </h3>
          {memory.sender && <p className="mt-1 text-lg italic text-gray-600">From: {memory.sender}</p>}
        </div>
        <hr className="my-2 border-gray-300" />
        <div className="mb-2">
          {renderMessage(memory, arrowColor)}
        </div>
        <hr className="my-2 border-gray-300" />
        <div className="text-xs text-gray-500 flex flex-wrap justify-center gap-2">
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
      <div className="absolute right-[-30px] top-1/2 transform -translate-y-1/2" onClick={(e) => e.stopPropagation()}>
        <Link href={`/memories/${memory.id}`}>
          <span className="text-3xl cursor-pointer" style={{ color: arrowColor, fontFamily: "cursive" }}>➜</span>
        </Link>
      </div>
      <div
        className="flip-card w-full max-w-sm mx-auto my-4 perspective-1000 aspect-square cursor-pointer overflow-hidden"
        onClick={handleCardClick}
      >
        <div className={`flip-card-inner relative w-full h-full transition-transform duration-700 transform ${flipped ? "rotate-y-180" : ""}`}>
          <div className={`flip-card-front absolute w-full h-full backface-hidden rounded-lg shadow-xl ${bgColor} ${borderColor} border-4 p-4 flex flex-col justify-between`}>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {memory.animation && <span style={{ fontSize: "0.8rem", color: arrowColor, marginRight: "4px" }}>★</span>}
                To: {memory.recipient}
              </h3>
              {memory.sender && <p className="mt-1 text-md italic text-gray-600">From: {memory.sender}</p>}
            </div>
            <hr className="border-t border-gray-300 my-1" />
            <div className="text-xs text-gray-500 flex flex-wrap justify-center gap-1">
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
          <div className={`flip-card-back absolute w-full h-full backface-hidden rounded-lg shadow-xl ${bgColor} ${borderColor} border-4 transform rotate-y-180 p-4 flex flex-col justify-start`}>
            <div>
              <h3 className="text-lg italic text-gray-700 text-center">if only I sent this</h3>
              <hr className="border-t border-gray-300 my-1" />
            </div>
            <div
              className="flex-1 overflow-y-auto card-scroll cute_scroll text-sm text-gray-800 whitespace-pre-wrap"
              style={{ "--scroll-bg": scrollColors.track, "--scroll-thumb": scrollColors.thumb } as React.CSSProperties}
            >
              {renderMessage(memory, arrowColor)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
