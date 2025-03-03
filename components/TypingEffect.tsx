"use client";

import React, { useState, useEffect } from "react";

const messages = [
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
];

export default function TypingEffect() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentMessage = messages[index];
    const typingSpeed = deleting ? 50 : 120;
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(currentMessage.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        if (charIndex + 1 === currentMessage.length) {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        setText(currentMessage.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        if (charIndex === 0) {
          setDeleting(false);
          setIndex((index + 1) % messages.length);
        }
      }
    }, typingSpeed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index]);

  return <div className="text-center text-lg font-serif text-[var(--text)]">{text}</div>;
}
