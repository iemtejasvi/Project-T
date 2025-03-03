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
    <div className="h-8 text-center text-sm text-[var(--text)] font-serif transition-all duration-300">
      {displayedText}
    </div>
  );
};

export default TypewriterPrompt;
