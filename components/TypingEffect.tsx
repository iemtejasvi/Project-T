// components/TypingEffect.tsx
"use client";
import { useState, useEffect } from "react";

const sadMessages = [
  "I wish I said no more often",
  "You inspire me to be nothing like you",
  "The silence between us is deafening",
  "I miss the person I thought you were",
  "Sometimes, I wonder if you ever cared",
  "The hardest part is pretending to be okay",
  "I keep replaying our last conversation",
  "I never got to say goodbye",
  "Your absence is a constant presence",
  "I wish I could turn back time",
  "The memories haunt me every night",
  "I feel lost without you",
  "I never thought I'd have to live without you",
  "The pain never really goes away",
  "I miss the way things used to be",
  "I wish I could hear your voice again",
  "I keep hoping you'll come back",
  "The world feels empty without you",
  "I never got to tell you how much I loved you",
  "I wish I could have one more day with you",
  "The regret is overwhelming",
  "I miss the way you made me feel",
  "I never thought I'd have to say goodbye",
  "The silence is unbearable",
  "I wish I could turn back time",
  "I miss the person I used to be",
  "I never got to say what I needed to say",
  "The pain is a constant reminder",
  "I wish I could have one more moment with you",
  "The memories are all I have left",
];

const TypingEffect: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [mistakeState, setMistakeState] = useState<"none" | "mistyping" | "correcting">("none");
  const [mistakePosition, setMistakePosition] = useState<number>(0);

  useEffect(() => {
    const currentMessage = sadMessages[currentMessageIndex];
    const typeSpeed = 100 + Math.random() * 50;
    const eraseSpeed = 50;
    const mistakeChance = 0.15;

    const timeout = setTimeout(() => {
      if (isTyping) {
        if (charIndex < currentMessage.length) {
          if (mistakeState === "none" && Math.random() < mistakeChance) {
            setMistakeState("mistyping");
            setMistakePosition(charIndex);
            const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
            setDisplayedText(displayedText + wrongChar);
          } else if (mistakeState === "mistyping") {
            setMistakeState("correcting");
            setDisplayedText(displayedText.slice(0, -1));
          } else if (mistakeState === "correcting") {
            setDisplayedText(displayedText + currentMessage[mistakePosition]);
            setMistakeState("none");
            setCharIndex(charIndex + 1);
          } else {
            setDisplayedText(currentMessage.substring(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          }
        } else {
          setTimeout(() => setIsTyping(false), 2000);
        }
      } else {
        if (charIndex > 0) {
          setDisplayedText(currentMessage.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setCurrentMessageIndex((currentMessageIndex + 1) % sadMessages.length);
          setIsTyping(true);
          setMistakeState("none");
        }
      }
    }, isTyping ? typeSpeed : eraseSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isTyping, currentMessageIndex, mistakeState]);

  return (
    <div className="text-center text-base sm:text-lg italic text-[var(--text)] min-h-[2rem] font-serif truncate">
      {displayedText}
      <span className="animate-blink text-[var(--accent)]">|</span>
    </div>
  );
};

export default TypingEffect;
