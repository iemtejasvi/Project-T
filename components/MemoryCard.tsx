"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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

const TypewriterPrompt: React.FC = () => {
  const prompts = useMemo(
    () => [
      "Why did you?",
      "Do you think I have forgotten about you?",
      "Whatever we had, can we just have it again?",
      "Please come back.",
      "Even if you called 6 months later at 3am, I'd still answer.",
      "Why did you spend so much time with me only to leave?",
      "I gave up on everything except you.",
      "I wish you missed me half as much.",
      "I smile for others and cry for you.",
      "There was something about you that now I can't remember.",
      "You said forever like it was temporary.",
      "I talk to your old texts like you're still there.",
      "We got married in our heads.",
      "Your name still unlocks every memory.",
      "You didn’t stay, but your scent did.",
      "I forgot how to be okay without you.",
      "The worst part is you meant it when you left.",
      "I didn’t know that was our last hug.",
      "You let go, and I’m still holding on.",
      "We stopped talking, but I never stopped caring.",
      "I still check the door hoping it’s you.",
      "You said you cared, but then you vanished.",
      "I still flinch when I hear your ringtone.",
      "Even the quiet reminds me of you.",
      "I stopped writing because everything turned into you.",
      "You weren’t a phase, you were home.",
      "I miss who I was when I was yours.",
      "You left, and now nothing feels right.",
      "I still save you songs you’ll never hear.",
      "You promised, and I believed you.",
      "I stayed long after you stopped loving me.",
      "Some nights I sleep just to dream of you.",
      "Your last words still live in my head.",
      "I kept the sweater you forgot.",
      "I’d still wait, even knowing you won’t come.",
      "I pretend I'm okay, but I’m just tired.",
      "I miss you in all my favorite songs.",
      "You moved on, I stayed behind.",
      "Your memory is louder than my healing.",
      "I was your always, you were my sometimes.",
      "I still text you in my head.",
      "I see you in everyone but you.",
      "I hope you think of me sometimes.",
      "You were my best hello and worst goodbye.",
      "I still pause at your name.",
      "You meant the world and I lost it.",
      "Your absence has a heartbeat in my chest.",
      "I laugh like I’m not breaking inside.",
      "I don’t cry loud, but I cry long.",
      "I never wanted forever to end this way.",
      "I waited for a message that never came.",
      "You left, and the days got heavier.",
      "I replay what I could’ve said.",
      "You became a memory too soon.",
      "You made me feel like I mattered.",
      "I still love you quietly.",
      "I forget to breathe when I think of you.",
      "You made missing someone an art.",
      "You left, but your warmth stayed a while.",
      "It’s not just missing you, it’s needing you.",
      "I still walk past your place by accident.",
      "Some days I almost text you.",
      "I carry you in all my plans.",
      "You slipped away and I let you.",
      "It hurts to know you’re okay without me.",
      "I smile through tears you’ll never see.",
      "I still wear your goodbye like a scar.",
      "You made me feel safe, then left.",
      "I think you knew I’d wait forever.",
      "I remember your eyes more than your words.",
      "You left, but your playlist stayed.",
      "I wish you needed me back.",
      "I keep expecting you to come home.",
      "I never stopped choosing you.",
      "Your memory tastes like Sunday mornings.",
      "I loved you in silence after the end.",
      "Even my dreams can't find you anymore.",
      "You left a space I can't fill.",
      "I wish I meant more to you.",
      "You made goodbye look easy.",
      "I remember your hands like they’re still here.",
      "I still count the days like they matter.",
      "You were a chapter I keep rereading.",
      "I should’ve let go, but I didn’t.",
      "You stopped caring before I even noticed.",
      "You let me love you too much.",
      "Even the air feels different without you.",
      "You were home, not just a person.",
      "Your name still makes my chest tighten.",
      "I wait for a call that won’t come.",
      "I wish you missed what we had.",
      "You left quietly, I broke loudly.",
      "I wonder if you think of me still.",
      "I kept your photos, just in case.",
      "You became someone I can’t talk to.",
      "I loved you more than you’ll know.",
      "I wake up reaching for you still.",
      "You changed my favorite songs forever.",
      "You were the dream I woke up from.",
      "I hope your smile still exists somewhere.",
      "I never learned how to unlove you.",
      "You left, but I never did.",
      "I reread your messages like prayers.",
      "I still talk about you in present tense.",
      "You meant forever, I believed you.",
      "I wish I’d said more that last time.",
      "You’re the reason I write sad songs.",
      "You forgot me faster than I expected.",
      "Your goodbye didn’t sound like goodbye.",
      "You were my favorite mistake.",
      "It’s always you, even now.",
      "You made love feel like loss.",
      "I still see you in crowded places.",
      "You left like you were never here.",
      "I miss who I was with you.",
      "I kept hoping you'd come back.",
      "You were the peace I can’t find.",
      "Even strangers remind me of you.",
      "You forgot me in real time.",
      "I still keep space for you.",
      "You let go when I held tighter.",
      "I miss the way you said my name.",
      "I loved you more than I should’ve.",
      "You stayed in my heart, not in my life.",
      "Your absence is louder than your love was.",
      "I still cry in places you held me.",
      "I wonder if you ever look back.",
      "I waited longer than I admitted.",
      "You moved on, I stayed stuck.",
      "I let you go, but not inside.",
      "I hide my hurt behind fake laughs.",
      "You ended us like it meant nothing.",
      "I still find your hair on my clothes.",
      "You stopped choosing me too soon.",
      "You were the ache I still carry.",
      "I miss the little things the most.",
      "You said you’d stay. You didn’t.",
      "I loved you with everything I had.",
      "You left, but I still keep waiting.",
      "I miss you at the worst times.",
      "You were the comfort I lost.",
      "Even the sky feels empty without you.",
      "I thought we were forever.",
      "I learned how to smile through pain.",
      "You let me love you blind.",
      "You turned our love into a memory.",
      "You broke me gently.",
      "I waited even after the goodbye.",
      "I miss your voice like a song.",
      "You forgot me like a dream.",
      "I still hope you’re missing me.",
      "You promised and walked away anyway.",
      "You’re the name I still whisper.",
      "I look for you in every sunset.",
      "You were never mine, just visiting.",
      "I miss the way you looked at me.",
      "You left, and I lost parts of me.",
      "You made leaving look soft.",
      "I hold onto moments that faded.",
      "I still feel you in my bones.",
      "I miss the quiet between us.",
      "You meant more than I ever said.",
      "You disappeared like we never mattered.",
      "I wonder if you feel anything now.",
      "You let go too fast.",
      "I kept hoping love would be enough.",
      "You were the ending I didn’t expect.",
      "I still sit with the memory of us.",
      "You took the light when you left.",
      "You were a season I wanted forever.",
      "I still think you'd understand.",
      "You left quietly, and I broke loud.",
      "I still wake up thinking of you.",
      "You meant home, not just love.",
      "I wish I could forget you like you did.",
      "You were the silence I filled with tears.",
      "I never unlearned the way I loved you.",
      "You became everything I write about.",
      "I still wonder what we could’ve been.",
      "You left, but your words stayed behind.",
      "You never came back, but I stayed.",
      "You made love feel like waiting.",
      "I should’ve left first.",
      "You were the song I didn’t finish.",
      "I miss the way you held me close.",
      "You loved me until it got hard.",
      "You left the part of me that loved."
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
    <div className="min-h-[2rem] overflow-hidden text-center text-sm text-[var(--text)] font-serif transition-all duration-300 break-words">
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
      className={`flex-1 overflow-y-auto text-sm text-[var(--text)] whitespace-pre-wrap break-words pt-2 ${
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

  const allowedColors = new Set([
    "default",
    "mint",
    "cherry",
    "sapphire",
    "lavender",
    "coral",
    "olive",
    "turquoise",
    "amethyst",
    "gold",
    "midnight",
    "emerald",
    "ruby",
    "periwinkle",
    "peach",
    "sky",
    "lemon",
    "aqua",
    "berry",
    "graphite",
  ]);
  const colorMapping: Record<string, string> = { rose: "cherry" };
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

  const renderMessage = (memory: Memory) => {
    const wordCount = memory.message.split(/\s+/).length;
    const isShort = wordCount < 30;
    const textClass = isShort ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg lg:text-xl";
    const lineHeightClass = isShort ? "leading-relaxed" : "leading-loose";

    switch (memory.animation) {
      case "bleeding":
        return (
          <p className={`bleeding-text ${textClass} ${lineHeightClass}`}>
            {memory.message}
          </p>
        );
      case "handwritten":
        return (
          <HandwrittenText message={memory.message} textClass={textClass} lineHeightClass={lineHeightClass} />
        );
      default:
        return <p className={`${textClass} ${lineHeightClass}`}>{memory.message}</p>;
    }
  };

  if (detail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs sm:max-w-sm mx-auto my-6 p-6 border-2 rounded-xl shadow-md flex flex-col min-h-[300px]"
        style={{ ...bgStyle, ...borderStyle }}
      >
        <div>
          <h3 className="text-2xl font-bold text-[var(--text)]">
            {memory.animation && (
              <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>
                ★
              </span>
            )}
            To: {memory.recipient}
          </h3>
          {memory.sender && <p className="mt-1 text-lg italic text-[var(--text)]">From: {memory.sender}</p>}
          <hr className="my-2 border-[var(--border)]" />
        </div>
        <div className="flex-grow text-[var(--text)] whitespace-pre-wrap break-words pt-2">
          {renderMessage(memory)}
        </div>
        <hr className="my-2 border-[var(--border)]" />
        <div className="text-xs text-[var(--text)] flex justify-center gap-2 whitespace-nowrap">
          <span>{dateStr}</span> | <span>{dayStr}</span> | <span>{timeStr}</span> | <span>{effectiveColor}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative group my-6">
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
              <h3 className="text-xl font-bold text-[var(--text)]">
                {memory.animation && (
                  <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>
                    ★
                  </span>
                )}
                To: {memory.recipient}
              </h3>
              {memory.sender && <p className="mt-1 text-md italic text-[var(--text)]">From: {memory.sender}</p>}
              <hr className="my-2 border-[var(--border)]" />
            </div>
            <div className="text-xs text-[var(--text)] text-center">
              {dateStr} | {dayStr}
            </div>
            <TypewriterPrompt />
          </div>
          {/* BACK */}
          <div
            className="flip-card-back absolute w-full h-full backface-hidden rounded-xl shadow-md p-4 flex flex-col justify-start rotate-y-180"
            style={{ ...bgStyle, ...borderStyle }}
          >
            <h3 className="text-lg italic text-[var(--text)] text-center">if only i sent this</h3>
            <hr className="my-2 border-[var(--border)]" />
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

interface HandwrittenTextProps {
  message: string;
  textClass: string;
  lineHeightClass: string;
}

const HandwrittenText: React.FC<HandwrittenTextProps> = ({ message, textClass, lineHeightClass }) => (
  <div className="handwritten-text">
    <p className={`${textClass} ${lineHeightClass}`}>{message}</p>
  </div>
);

export default MemoryCard;
