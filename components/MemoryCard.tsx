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
      "Why?", "You left.", "It’s gone.", "Was I enough?", "You forgot.", "This hurts.", "Come back?", 
      "Too late.", "You chose.", "I waited.", "It’s over.", "No more us.", "You meant it.", "Not again.", 
      "Why me?", "I tried.", "You knew.", "You promised.", "Did you care?", "You did this.", "Not enough.", 
      "I’m tired.", "Was I real?", "It lingers.", "You changed.", "It faded.", "I stayed.", "You didn’t.", 
      "Nothing left.", "We broke.", "Not us.", "I miss you.", "I let go.", "You moved on.", "I never did.", 
      "Still hurts.", "You forgot me.", "Just memories.", "Why stay?", "You never did.", "Lost us.", 
      "I’m empty.", "You walked.", "No goodbye?", "What now?", "You never saw.", "You let go.", 
      "Was it love?", "Just silence.", "I’ll go now.", "Why did you go?", "Was I not enough?", 
      "It still hurts.", "Do you miss me?", "I waited. You didn’t.", "We had forever.", "Too late now.", 
      "You let me go.", "I held on. Alone.", "Not even goodbye?", "Did you even care?", "It was real to me.", 
      "You meant the world.", "You left. I stayed.", "We were everything.", "I never let go.", "You didn’t fight.", 
      "I still wonder why.", "I miss what we had.", "You walked away.", "We fell apart.", "I still feel you.", 
      "Was it all a lie?", "You moved on fast.", "You said forever.", "You didn’t try.", "You forgot so easily.", 
      "I broke. You didn’t.", "I thought we’d last.", "Was I just a phase?", "I needed you.", 
      "You never looked back.", "I see you everywhere.", "You’re happy. I’m not.", "Why did I believe you?", 
      "I should’ve known.", "I wish I mattered.", "I lost you forever.", "We had something rare.", 
      "You didn’t stay.", "It wasn’t supposed to end.", "I replay it all.", "You never even missed me.", 
      "You let me slip away.", "I hope you remember.", "Do you ever think of me?",
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

  return <div className="h-8 text-center text-sm text-[var(--text)] font-serif transition-all duration-300">{displayedText}</div>;
};

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, detail }) => {
  const borderColor = getBorderColor(memory.color);
  const bgColor = getBgColor(memory.color, memory.full_bg);

  return (
    <div className={`w-full max-w-xs sm:max-w-sm mx-auto my-6 p-6 ${bgColor} ${borderColor} border-2 rounded-lg shadow-md`}>
      <h3 className="text-2xl font-bold text-[var(--text)]">To: {memory.recipient}</h3>
      {memory.sender && <p className="mt-1 text-lg italic text-[var(--text)]">From: {memory.sender}</p>}
      <hr className="my-2 border-[var(--border)]" />
      <div className="text-sm text-[var(--text)] whitespace-pre-wrap">{memory.message}</div>
      <hr className="my-2 border-[var(--border)]" />
      <TypewriterPrompt />
    </div>
  );
};

export default MemoryCard;
