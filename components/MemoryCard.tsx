"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PoeticText from "./PoeticText";
import CursiveText from './CursiveText';
import BleedingText from './BleedingText';
import HandwrittenText from './HandwrittenText';
import "../app/globals.css";

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
  pinned?: boolean;
}

interface MemoryCardProps {
  memory: Memory;
  detail?: boolean;
}

const TypewriterPrompt: React.FC = () => {
  const prompts = useMemo(
    () => [
      "I wish you missed me half as much.",
      "did i really deserve to be forgotten",
      "your goodbye felt like mercy in disguise",
      "how do i grieve someone still alive?",
      "should i bite my tongue or cut it out",
      "you never wanted love, just an audience",
      "how silent should i stay to be enough for you?",
      "if i vanish, will you finally smile?",
      "how broken is just broken enough?",
      "every version of my future still had you in it",
      "did you ever check if i made it home?",
      "i loved you past the point of self",
      "your name doesn’t hurt, it just feels cheap now",
      "would you love me if i lost my face?",
      "i forget how to be okay without you",
      "i’d choose you in every version of time",
      "i’m tired of surviving pain meant for two",
      "how soft must i walk to not leave a mark?",
      "is there a quieter way to hurt?",
      "i don't want to heal, i just want it to stop",
      "you were healing, i was poison in disguise",
      "i swear i’ll be quiet, just let me near you",
      "was i ever more than a backup plan?",
      "i miss you so much, it’s started to rot me",
      "how much of me do i need to lose",
      "i don’t hate you, you’re just beneath memory",
      "how wrong do i become to make you feel right?",
      "why does growing up feel like goodbye?",
      "you were never mine, just passing through",
      "i regret nothing but meeting you early",
      "if i lose everything, just let me keep you",
      "how do i grieve someone still alive?",
      "i find you in every version of my future",
      "how blind do i go to keep seeing you right?",
      "your smile makes the world shut up for a second",
      "every time you reached for me, i pulled back",
      "is disappearing the only way to stay",
      "i stopped writing, but you’re still the ink",
      "if karma’s real, you’ve got a show coming",
      "you haunt me like i invited it",
      "i’m not sad anymore, i’m just done",
      "i’d tear down heaven if you asked me to stay",
      "i’m scared you were the only real thing",
      "how deep must the missing go to reach you",
      "how loud should i cry without making a scene?",
      "i didn’t lose you once, i lose you daily",
      "how are you okay? how did you move on so fast?",
      "i’d unlearn every scar just to love you better",
      "being near you feels like finally breathing right",
      "i hope someone breaks you beautifully",
      "i don’t believe in magic, but you’re close enough",
      "okay, i’m done, please just unblock me",
      "i still talk to you in my head like you’re listening",
      "i don’t cry anymore, it’s just a slow dying inside",
      "do i apologize for breathing too loud?",
      "you love me in ways i didn’t know were possible",
      "why do i remember faces that forgot me?",
      "was loving you a sentence or a choice",
      "how many parts of me should i erase to fit?",
      "i’d break myself just to feel you again",
      "some nights i hate you, all nights i miss you",
      "some nights i pray for nothing to wake me",
      "i don’t miss you, i miss who i thought you were",
      "i’m still here, but not for long",
      "what’s the use of being seen, unloved?",
      "you weren’t a chapter, just a typo",
      "what if i was born just to fade?",
      "do i need your permission to exist?",
      "you showed up for me, i showed up for myself",
      "how dead inside do i need to be?",
      "if you left, it’s because i gave you every reason",
      "breathing hurts, but stopping feels worse",
      "i’m tired of pretending i don’t miss you",
      "i miss you too much to pretend i’m okay",
      "i don’t believe in forever, but i believe in you",
      "i hope you smile tomorrow, even if i don’t see it",
      "you were never home, just a long detour to nowhere",
      "do you tell them i never mattered?",
      "losing you was the kindest thing life did",
      "did you replace me or just move on?",
      "it’s not even about you anymore",
      "i didn’t deserve you, and i proved it daily",
      "am i easier to love when i’m less",
      "i forgot how to be without needing you",
      "do you reread our messages or just delete?",
      "was i just someone to pass the time?",
      "everything reminds me, and nothing helps",
      "i answer questions like i’m still a person",
      "how much less of me would be easier?",
      "you taught me how easy love is to fake",
      "you became the addiction i pray never fades",
      "my world bends around your existence",
      "did i disappoint you by being myself?",
      "don’t flatter yourself, you were never hard to lose",
      "i hope you’re sleeping well while i carry all this",
      "what’s left of me that still bothers you?",
      "i love you past reason, past sense, past self",
      "i miss you so bad it makes me hate myself",
      "how broken should i look to make you feel whole?",
      "do you still carry me like i carry you",
      "do broken homes echo louder at night?",
      "should i fold or just burn this soul?",
      "was i just someone to pass the time?",
      "i’d unmeet you if i could—twice",
      "some part of me has always been waiting for you",
      "when you smile, time forgets how to move",
      "how many total lines? when i smile, do you still feel it?",
      "do i only matter when i’m gone?",
      "how invisible must i be to feel safe?",
      "i watched you fall apart and called it love",
      "your voice feels like home in a world that doesn’t",
      "how long can i fake being okay?",
      "i know you don’t care anymore, but i still do",
      "i still wait for a text i know won’t come",
      "can you teach me how to not exist?",
      "which parts of me should i erase first?",
      "am i enough if i’m nothing at all?",
      "if the universe resets, i’ll still look for you first",
      "when did my reflection stop looking like me?",
      "is missing someone just self-harm in disguise?",
      "if i were you, i’d hate me too",
      "do you sleep better now that i’m gone?",
      "i’d wait lifetimes just to hold this moment",
      "every day feels like waking up wrong",
      "your hand in mine is the only plan i need",
      "your heart begged me to stop, and i didn’t",
      "please just say you never loved me, so i can stop",
      "i made you question your worth to protect my ego",
      "how soft must i speak to stay loved?",
      "do i only matter when i’m gone?",
      "would you love me if i lost my face?",
      "even forever feels too short with you",
      "i wasn’t enough, was i? not even close",
      "you moved on like i was never real",
      "will you notice me if i erase myself".
    ],
    []
  );

  const randomOffset = useMemo(() => Math.random() * 1000, []);
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Math.random() * prompts.length)
  );
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentPrompt = prompts[currentIndex];
    let delay = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === 0) {
      delay += randomOffset;
    }
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
          setCurrentIndex(
            Math.floor(Math.random() * prompts.length)
          );
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, prompts, randomOffset]);

  return (
    <div className="min-h-[2rem] overflow-hidden text-center text-sm text-[var(--text)] font-serif transition-all duration-300 whitespace-pre-wrap break-normal hyphens-auto">
      {displayedText}
    </div>
  );
};

const ScrollableMessage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setNeedsScroll(
        containerRef.current.scrollHeight > containerRef.current.clientHeight
      );
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2 ${
        needsScroll ? "cute_scroll" : ""
      }`}
      style={style}
    >
      {children}
    </div>
  );
};

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, detail }) => {
  const [flipped, setFlipped] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => {
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  const allowedColors = new Set([
    "default",
    "aqua",
    "azure",
    "berry",
    "brass",
    "bronze",
    "clay",
    "cloud",
    "copper",
    "coral",
    "cream",
    "cyan",
    "dune",
    "garnet",
    "gold",
    "honey",
    "ice",
    "ivory",
    "jade",
    "lilac",
    "mint",
    "moss",
    "night",
    "ocean",
    "olive",
    "peach",
    "pearl",
    "pine",
    "plum",
    "rose",
    "rouge",
    "ruby",
    "sage",
    "sand",
    "sepia",
    "sky",
    "slate",
    "steel",
    "sunny",
    "teal",
    "wine"
  ]);
  const colorMapping: Record<string, string> = { 
    plain: "default",
    cherry: "ruby",
    sapphire: "azure",
    lavender: "lilac",
    turquoise: "cyan",
    amethyst: "pearl",
    midnight: "night",
    emerald: "jade",
    periwinkle: "sky",
    lemon: "sunny",
    graphite: "steel",
    "dusty-rose": "rose",
    "vintage-blue": "ice",
    terracotta: "clay",
    mustard: "honey",
    parchment: "ivory",
    burgundy: "wine",
    "antique-brass": "brass",
    "forest-green": "pine",
    maroon: "garnet",
    navy: "ocean",
    khaki: "sand"
  };
  let effectiveColor = memory.color;
  if (!allowedColors.has(memory.color)) {
    effectiveColor = colorMapping[memory.color] || "default";
  }

  const borderStyle =
    effectiveColor === "default"
      ? { borderColor: "#D9D9D9" }
      : { borderColor: `var(--color-${effectiveColor}-border)` };

  const bgStyle =
    effectiveColor === "default"
      ? { backgroundColor: "#F8F8F0" }
      : memory.full_bg
      ? { backgroundColor: `var(--color-${effectiveColor}-bg)` }
      : {};

  const arrowStyle =
    effectiveColor === "default"
      ? { color: "#D9D9D9" }
      : { color: `var(--color-${effectiveColor}-border)` };

  const dateStr = new Date(memory.created_at).toLocaleDateString();
  const timeStr = new Date(memory.created_at).toLocaleTimeString();
  const dayStr = new Date(memory.created_at).toLocaleDateString(undefined, { weekday: "long" });

  const handleCardClick = () => {
    if (!detail) {
      setFlipped(!flipped);
    }
  };

  const renderMessage = (memory: Memory, forceLarge?: boolean) => {
    const wordCount = memory.message.split(/\s+/).length;
    const isShortOrExact = wordCount <= 30;
    const textClass = forceLarge
      ? "text-3xl tracking-wide leading-snug break-words hyphens-none"
      : isShortOrExact
        ? "text-2xl tracking-wide leading-snug break-words hyphens-none"
        : "text-lg tracking-wide leading-snug break-words hyphens-none";
    
    switch (memory.animation) {
      case "poetic":
        return (
          <PoeticText message={memory.message} textClass={textClass} effectiveColor={effectiveColor} />
        );
      case "cursive":
        return (
          <CursiveText
            message={memory.message}
            textClass={textClass}
            effectiveColor={effectiveColor}
          />
        );
      case "bleeding":
        return <BleedingText message={memory.message} textClass={textClass} />;
      case "handwritten":
        return <HandwrittenText message={memory.message} textClass={textClass} />;
      default:
        return (
          <div className="space-y-2">
            <p className={textClass}>{memory.message}</p>
          </div>
        );
    }
  };

  if (detail) {
    // Large message renderer for detail desktop
    function renderMessageLargeDetail(memory: Memory) {
      const wordCount = memory.message.split(/\s+/).length;
      const isShortOrExact = wordCount <= 30;
      const textClass = isShortOrExact
        ? "text-5xl tracking-wide leading-snug break-words hyphens-none"
        : "text-4xl tracking-wide leading-snug break-words hyphens-none";
      switch (memory.animation) {
        case "poetic":
          return (
            <PoeticText message={memory.message} textClass={textClass} effectiveColor={effectiveColor} />
          );
        case "cursive":
          return (
            <CursiveText
              message={memory.message}
              textClass={textClass}
              effectiveColor={effectiveColor}
            />
          );
        case "bleeding":
          return <BleedingText message={memory.message} textClass={textClass} />;
        case "handwritten":
          return <HandwrittenText message={memory.message} textClass={textClass} />;
        default:
          return (
            <div className="space-y-2">
              <p className={textClass}>{memory.message}</p>
            </div>
          );
      }
    }
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={
          isDesktop
            ? "w-full max-w-xl min-h-[420px] mx-auto my-16 p-12 rounded-3xl shadow-2xl border border-[var(--border)]/40 bg-[var(--card-bg)]/80 backdrop-blur-xl flex flex-col items-center justify-center"
            : "w-full max-w-sm mx-auto my-8 p-6 rounded-3xl shadow-xl border border-[var(--border)]/40 bg-[var(--card-bg)]/90 backdrop-blur-md flex flex-col items-center justify-center"
        }
        style={{ ...bgStyle, ...borderStyle }}
      >
        <div className="w-full flex flex-col items-center">
          <h3 className={isDesktop ? "text-4xl font-bold text-[var(--text)] mb-2 flex items-center justify-center gap-2" : "text-2xl font-bold text-[var(--text)] mb-2 flex items-center justify-center gap-2"}>
            {memory.animation && memory.animation !== "none" && (
              <span style={{ fontSize: "1.2rem", ...arrowStyle, marginRight: "4px" }}>★</span>
            )}
            To: {memory.recipient}
          </h3>
          {memory.sender && <p className={isDesktop ? "text-lg italic text-[var(--text)] opacity-70 mb-2" : "text-md italic text-[var(--text)] opacity-70 mb-2"}>From: {memory.sender}</p>}
          <hr className="my-2 border-[#999999] w-full" />
        </div>
        <div className="w-full flex-1 flex flex-col justify-center items-center my-6">
          <div className={isDesktop ? "text-3xl font-serif text-center text-[var(--text)] leading-snug break-words hyphens-none" : "text-4xl font-serif text-center text-[var(--text)] leading-snug break-words hyphens-none"}>
            {isDesktop ? renderMessageLargeDetail(memory) : renderMessage(memory, true)}
          </div>
        </div>
        <hr className="my-2 border-[#999999] w-full" />
        <div className="w-full flex flex-col items-center mt-2">
          <span className={isDesktop ? "text-base text-[var(--text)] opacity-60 font-normal text-center" : "text-xs text-[var(--text)] opacity-60 font-normal text-center"}>
            {dateStr} &mdash; {dayStr} &mdash; {timeStr} &mdash; {effectiveColor}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative group my-4 sm:my-6">
      <div className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 sm:right-[-50px]">
        <Link href={`/memories/${memory.id}`}>
          <span className="arrow-icon" style={arrowStyle}>➜</span>
        </Link>
      </div>
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flip-card w-full max-w-xs sm:max-w-sm mx-auto perspective-1000 h-[300px] cursor-pointer rounded-xl hover:shadow-2xl"
        onClick={handleCardClick}
        style={{ ...bgStyle, ...borderStyle }}
      >
        <motion.div 
          className="flip-card-inner relative w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          {/* FRONT */}
          <div
            className="flip-card-front absolute w-full h-full backface-hidden rounded-xl shadow-md p-4 flex flex-col justify-between"
            style={{ ...bgStyle, ...borderStyle }}
          >
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-[var(--text)]">
                  {memory.animation && memory.animation !== "none" && (
                    <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>
                      ★
                    </span>
                  )}
                  To: {memory.recipient}
                </h3>
                {memory.pinned && (
                  <span
                    className="relative inline-block animate-pin-pop"
                    style={{
                      display: 'inline-block',
                      transform: 'rotate(-15deg)',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))',
                      verticalAlign: 'middle',
                    }}
                    title="Pinned"
                  >
                    <span
                      className="absolute inset-0 rounded-full border border-yellow-200 shadow-sm"
                      style={{
                        background: effectiveColor !== 'default'
                          ? `var(--color-${effectiveColor}-bg)`
                          : 'radial-gradient(circle, #fffbe6 60%, #ffe066 100%)',
                        zIndex: 0,
                        width: '1.6em',
                        height: '1.6em',
                        left: '-0.32em',
                        top: '-0.32em',
                        opacity: 0.85,
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="relative z-10 text-yellow-500"
                      style={{
                        fontSize: '1.28em',
                        textShadow: '0 1px 3px #fffbe6, 0 1px 2px #ffe066',
                        lineHeight: 1,
                      }}
                    >
                      📌
                    </span>
                  </span>
                )}
              </div>
              {memory.sender && <p className="mt-1 text-md italic text-[var(--text)]">From: {memory.sender}</p>}
              <hr className="my-2 border-[#999999]" />
            </div>
            <div className="text-xs text-[var(--text)] text-center font-normal">
              {dateStr} | {dayStr}
            </div>
            <div className="min-h-[2.5em] w-full">
              <TypewriterPrompt />
            </div>
          </div>
          {/* BACK */}
          <div
            className="flip-card-back absolute w-full h-full backface-hidden rounded-xl shadow-md p-4 flex flex-col justify-start rotate-y-180"
            style={{ ...bgStyle, ...borderStyle }}
          >
            <h3 className="text-lg italic text-[var(--text)] text-center">if only i sent this</h3>
            <hr className="my-2 border-[#999999]" />
            <ScrollableMessage
              style={
                {
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
                } as React.CSSProperties
              }
            >
              {renderMessage(memory)}
            </ScrollableMessage>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MemoryCard;
