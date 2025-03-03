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
  "I never thought I'd have to live without you",
  "The world feels different without you",
  "I miss the way you made me laugh",
  "I wish I could hear your voice again",
  "I keep hoping you'll come back",
  "The silence is deafening",
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
  const [typing, setTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  const [mistake, setMistake] = useState(false);

  useEffect(() => {
    const currentMessage = sadMessages[currentMessageIndex];
    const typeSpeed = 100;
    const eraseSpeed = 50;
    const mistakeChance = 0.1; // 10% chance to mistype

    const timeout = setTimeout(() => {
      if (typing) {
        if (charIndex < currentMessage.length) {
          if (Math.random() < mistakeChance && !mistake) {
            setMistake(true);
            setDisplayedText(displayedText + "a"); // Mistype with 'a'
          } else {
            setDisplayedText(currentMessage.substring(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          }
        } else {
          setTimeout(() => setTyping(false), 2000); // Pause before erasing
        }
      } else {
        if (charIndex > 0) {
          setDisplayedText(currentMessage.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setCurrentMessageIndex((currentMessageIndex + 1) % sadMessages.length);
          setTyping(true);
        }
      }
    }, typing ? typeSpeed : eraseSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, typing, currentMessageIndex, mistake]);

  useEffect(() => {
    if (mistake) {
      setTimeout(() => {
        setDisplayedText(displayedText.slice(0, -1));
        setMistake(false);
      }, 500); // Correct mistake after 0.5s
    }
  }, [mistake, displayedText]);

  return (
    <div className="text-center text-lg sm:text-xl italic text-[var(--text)] min-h-[2.5rem] font-serif">
      {displayedText}
      <span className="animate-blink text-[var(--accent)]">|</span>
    </div>
  );
};

export default TypingEffect;
