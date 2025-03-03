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
  "Every goodbye lingered too long.",
  "I still trace your shadow in my mind.",
  "You were my echo, now just silence.",
  "I gave you pieces I can’t reclaim.",
  "Your absence carved a hollow space.",
  "I wrote you into every unsent line.",
  "You left me unfinished, mid-sentence.",
  "I still feel the weight of your maybe.",
  "You were a chapter I can’t close.",
  "I lost myself trying to keep you.",
  "Your words faded, mine never did.",
  "I held on to a ghost of us.",
  "You slipped away without a sound.",
  "I still search for you in empty rooms.",
  "You were my almost, never my always.",
  "I buried my voice in your silence.",
  "You left me with echoes of nothing.",
  "I still taste the bitterness of your bye.",
  "You were a promise that unraveled.",
  "I waited for a you that never returned.",
  "Your memory stings sharper than time.",
  "I built a home in your fleeting glance.",
  "You left my heart half-written.",
  "I still chase the shadow you cast.",
  "You were my quiet, my loud regret.",
  "I gave you words you never earned.",
  "You walked away, I stayed too long.",
  "I still hear the door you never reopened.",
  "You were my pause, my endless wait.",
  "I lost you in pieces I can’t find.",
  "You left a mark time can’t erase.",
  "I still feel you in every unsaid word.",
  "You were my hope, now my haunt.",
  "I wrote our end in invisible ink.",
  "You faded, but I still see you.",
  "I held a you that never was mine.",
  "Your silence was my loudest goodbye.",
  "I still linger where you let go.",
  "You were a dream I woke up from.",
  "I gave you a me I can’t take back.",
  "You left me with a half-told story.",
  "I still feel the cold of your absence.",
  "You were my what if, my never again.",
  "I kept the pieces you discarded.",
  "You walked out, I stayed behind.",
  "I still whisper your name to no one.",
  "You were my silence, my screaming void.",
  "I lost you to a time we never had.",
  "You left me with a sigh unreturned.",
  "I still carry your unsent apologies.",
  "You were my almost, my always gone."
];

const TypingEffect: React.FC = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [mistake, setMistake] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const type = () => {
      if (index >= messages.length) {
        setIndex(0);
        return;
      }

      const currentMessage = messages[index];

      if (!reverse && subIndex < currentMessage.length) {
        const nextChar = currentMessage[subIndex];
        if (!mistake && Math.random() < 0.05) {
          // Mistype
          const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
          setText((prev) => prev + wrongChar);
          setMistake(true);
          timeout = setTimeout(() => {
            setText((prev) => prev.slice(0, -1) + nextChar);
            setSubIndex((prev) => prev + 1);
            setMistake(false);
            setTimeout(type, 100);
          }, 200);
        } else {
          setText((prev) => prev + nextChar);
          setSubIndex((prev) => prev + 1);
          timeout = setTimeout(type, 100);
        }
      } else if (!reverse && subIndex === currentMessage.length) {
        if (Math.random() < 0.2) {
          // Randomly erase last few words
          const words = currentMessage.split(" ");
          const deleteWords = Math.min(Math.floor(Math.random() * 3) + 1, words.length - 1);
          const newText = words.slice(0, -deleteWords).join(" ") + " ";
          setText(newText);
          setSubIndex(newText.length);
          timeout = setTimeout(type, 500);
        } else {
          timeout = setTimeout(() => {
            setReverse(true);
            type();
          }, 2000);
        }
      } else if (reverse && subIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setSubIndex((prev) => prev - 1);
        timeout = setTimeout(type, 50);
      } else if (reverse && subIndex === 0) {
        setReverse(false);
        setIndex((prev) => (prev + 1) % messages.length);
        timeout = setTimeout(type, 0);
      }
    };

    timeout = setTimeout(type, 0);
    return () => clearTimeout(timeout);
  }, [index, subIndex, reverse, mistake]);

  return (
    <div className="text-center text-lg sm:text-xl italic text-[var(--text)] min-h-[2.5rem] font-serif tracking-wide">
      {text}
      <span className="animate-blink">|</span>
    </div>
  );
};

export default TypingEffect;
