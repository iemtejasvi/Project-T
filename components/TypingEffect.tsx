"use client";
import { useState, useEffect } from "react";

const messages = [
  "I wish I said no more often",
  "You inspire me to be nothing like you",
  "I miss the person I thought you were",
  "Sometimes silence is the loudest scream",
  "I’m tired of pretending everything is okay",
  "The hardest part is waking up",
  "I feel like I’m drowning in my own thoughts",
  "I wish I could turn back time",
  "I’m sorry for all the things I didn’t say",
  "I’m not okay, but I smile anyway",
  "Every day feels heavier than the last",
  "I keep replaying what went wrong",
  "I thought time would heal, but it hasn’t",
  "I’m haunted by what could have been",
  "I never learned to say goodbye",
  "My heart still aches for you",
  "I’m lost without your light",
  "I wish I could forget your name",
  "I’m trapped in memories of us",
  "I still look for you in crowds",
  "I’m sorry I wasn’t enough",
  "I wish I could undo the past",
  "I’m drowning in my regrets",
  "I miss the sound of your voice",
  "I’m still waiting for closure",
  "I wish I could erase the pain",
  "I’m sorry for loving you too much",
  "I’m haunted by your absence",
  "I wish I could turn off my feelings",
  "I’m tired of being strong",
  "I miss the way things used to be",
  "I’m sorry for holding on too long",
  "I wish I could let go",
  "I’m lost in the silence between us",
  "I miss the warmth of your touch",
  "I’m sorry for the words I never said",
  "I wish I could rewrite our story",
  "I’m drowning in what-ifs",
  "I miss the way you made me feel",
  "I’m sorry for the mistakes I made",
  "I wish I could turn back the clock",
  "I’m lost without your guidance",
  "I miss the laughter we shared",
  "I’m sorry for the pain I caused",
  "I wish I could make things right",
  "I’m drowning in my own sorrow",
  "I miss the dreams we built together",
  "I’m sorry for the times I failed you",
  "I wish I could say goodbye properly",
  "I’m lost in the void you left behind",
  "The nights are colder without you",
  "I’m sorry I couldn’t fix us",
  "I wish I had one more chance",
];

const TypingEffect = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];
    if (isTyping) {
      if (charIndex < currentMessage.length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + currentMessage[charIndex]);
          setCharIndex((prev) => prev + 1);
          if (Math.random() < 0.05 && charIndex > 5) {
            // Add a random typo
            setDisplayedText((prev) => prev + String.fromCharCode(97 + Math.floor(Math.random() * 26)));
            setTimeout(() => {
              setDisplayedText((prev) => prev.slice(0, -1)); // Backspace it
              setIsTyping(true);
            }, 500);
          }
        }, 100); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          setDisplayedText("");
          setCharIndex(0);
        }, 3000); // Pause before next message
        return () => clearTimeout(timeout);
      }
    }
  }, [charIndex, isTyping, currentMessageIndex]);

  return (
    <div className="typing-effect text-lg sm:text-xl italic text-[var(--text)] font-mono">
      {displayedText}
      <span className="cursor">|</span>
    </div>
  );
};

export default TypingEffect;
