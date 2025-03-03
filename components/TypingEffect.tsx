"use client";
import { useState, useEffect } from "react";

const TypingEffect: React.FC = () => {
  const messages = [
    "Words left unsaid echo the loudest.",
    "In the silence, I found you again.",
    "Some letters are written in tears.",
    "Time fades, but regrets linger.",
    "I kept it all inside, too late.",
    "I wish I said no more often.",
    "You inspire me to be nothing like you.",
    "We were just strangers with memories.",
    "I miss the old me, before you.",
    "Some things are better left unsaid.",
    "You never realized, did you?",
    "I was always second choice.",
    "I should have walked away sooner.",
    "You never fought for me.",
    "It still hurts, but I hide it well.",
    "I let you break me.",
    "You never even noticed.",
    "I was just an option, not a priority.",
    "The silence said more than you ever did.",
    "I cared too much. You didn't care at all.",
    "I kept waiting for something that never came.",
    "Some wounds never heal.",
    "If I mattered, you'd still be here.",
    "I should have been enough.",
    "You let me go so easily.",
    "I wish I could unmeet you.",
    "I still wait for a message that never comes.",
    "I wanted forever, you wanted convenience.",
    "We never even got closure.",
    "Maybe I was just a lesson, not a love.",
    "You promised, then you left.",
    "I should have listened when they warned me.",
    "I deserved more than unanswered texts.",
    "I was there for you. You were nowhere for me.",
    "You always said 'maybe later.' Later never came.",
    "I gave you all my tomorrows, you gave me yesterday.",
    "Your absence screams louder than words.",
    "I built a world you never lived in.",
    "The echoes of you still haunt me.",
    "I lost myself trying to find you.",
    "You were my dream, now my regret.",
    "I wrote you letters I’ll never send.",
    "Your goodbye was just silence.",
    "I held on until my hands bled.",
    "You left a mark time can’t erase.",
    "I whispered your name to no one.",
    "Every maybe became a never.",
    "I was your shadow, never your light.",
    "You forgot me like an old song.",
    "I waited, but the clock stopped."
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "backspacing">("typing");
  const [charIndex, setCharIndex] = useState(0);
  const [mistakeStep, setMistakeStep] = useState<0 | 1 | 2>(0);

  const typingSpeed = 100;
  const backspaceSpeed = 50;
  const mistakeDelay = 500;
  const pauseDuration = 2000;
  const mistakeProbability = 0.05;

  const currentMessage = messages[currentMessageIndex];

  useEffect(() => {
    const handleTyping = () => {
      if (phase === "typing") {
        if (charIndex < currentMessage.length) {
          if (mistakeStep === 0) {
            const isMistake = Math.random() < mistakeProbability;
            if (isMistake) {
              const wrongChar = "abcdefghijklmnopqrstuvwxyz "[Math.floor(Math.random() * 27)];
              setDisplayedText((prev) => prev + wrongChar);
              setMistakeStep(1);
              setTimeout(handleTyping, mistakeDelay);
            } else {
              setDisplayedText((prev) => prev + currentMessage[charIndex]);
              setCharIndex((prev) => prev + 1);
              setTimeout(handleTyping, typingSpeed);
            }
          } else if (mistakeStep === 1) {
            setDisplayedText((prev) => prev.slice(0, -1));
            setMistakeStep(2);
            setTimeout(handleTyping, backspaceSpeed);
          } else if (mistakeStep === 2) {
            setDisplayedText((prev) => prev + currentMessage[charIndex]);
            setCharIndex((prev) => prev + 1);
            setMistakeStep(0);
            setTimeout(handleTyping, typingSpeed);
          }
        } else {
          setPhase("pausing");
          setTimeout(() => {
            setPhase("backspacing");
            handleTyping();
          }, pauseDuration);
        }
      } else if (phase === "backspacing") {
        if (displayedText.length > 0) {
          setDisplayedText((prev) => prev.slice(0, -1));
          setTimeout(handleTyping, backspaceSpeed);
        } else {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          setPhase("typing");
          setCharIndex(0);
          setMistakeStep(0);
          handleTyping();
        }
      }
    };

    handleTyping();
  }, []);

  return (
    <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow-md text-center">
      <p className="text-lg sm:text-xl italic text-[var(--text)]">
        <span>{displayedText}</span>
        <span className="cursor">|</span>
      </p>
    </div>
  );
};

export default TypingEffect;
