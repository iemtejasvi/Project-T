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
  pinned?: boolean;
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
      "Even if you called 6 months later at 3am, I'd still answer.",
      "Why did you spend so much time with me only to leave?",
      "I wish you missed me half as much.",
      "We got married in our heads.",
      "I forgot how to be okay without you.",
      "The worst part is you meant it when you left.",
      "You let go, and I'm still holding on.",
      "We stopped talking, but I never stopped caring.",
      "I still check the door hoping it's you.",
      "I stopped writing because everything turned into you.",
      "I miss who I was when I was yours.",
      "You left, and now nothing feels right.",
      "I still save you songs you'll never hear.",
      "You promised, and I believed you.",
      "I stayed long after you stopped loving me.",
      "Some nights I sleep just to dream of you.",
      "Your last words still live in my head.",
      "I kept the sweater you forgot.",
      "I'd still wait, even knowing you won't come.",
      "I pretend I'm okay, but I'm just tired.",
      "I was your always, you were my sometimes.",
      "I still text you in my head.",
      "I see you in everyone but you.",
      "I hope you think of me sometimes.",
      "You were my best hello and worst goodbye.",
      "I still pause at your name.",
      "You meant the world and I lost it.",
      "I never wanted forever to end this way.",
      "I waited for a message that never came.",
      "I replay what I could've said.",
      "You became a memory too soon.",
      "You made me feel like I mattered.",
      "You made missing someone an art.",
      "You left, but your warmth stayed a while.",
      "It's not just missing you, it's needing you.",
      "I carry you in all my plans.",
      "It hurts to know you're okay without me.",
      "I think you knew I'd wait forever.",
      "I remember your smile more than your words.",
      "I wish you needed me back.",
      "I never stopped choosing you.",
      "Even my dreams can't find you anymore.",
      "I still count the days like they matter.",
      "You were a chapter I keep rereading.",
      "You let me love you too much.",
      "I kept your photos, just in case.",
      "You became someone I can't talk to.",
      "I loved you more than you'll know.",
      "I wake up reaching for you still.",
      "You were the dream I woke up from.",
      "I hope your smile still exists somewhere.",
      "I never learned how to unlove you.",
      "I reread your messages like prayers.",
      "I still talk about you in present tense.",
      "I wish I'd said more that last time.",
      "You're the reason I write sad songs.",
      "You forgot me faster than I expected.",
      "Your goodbye didn't sound like goodbye.",
      "You were my favorite mistake.",
      "It's always you, even now.",
      "You made love feel like loss.",
      "Even strangers remind me of you.",
      "I miss the way you said my name.",
      "You stayed in my heart, not in my life.",
      "I wonder if you ever look back.",
      "I waited longer than I admitted.",
      "I let you go, but not inside.",
      "I miss you at the worst times.",
      "You were the comfort I lost.",
      "Even the sky feels empty without you.",
      "I learned how to smile through pain.",
      "You let me love you blind.",
      "You turned our love into a memory.",
      "I miss your voice like a song.",
      "You forgot me like a dream.",
      "You were a season I wanted forever.",
      "You would've stayed if I hadn't waited so long.",
      "If timing meant anything, we had none.",
      "I should've said something before you stopped listening.",
      "Maybe I held the wrong parts tighter.",
      "I thought you'd come back without asking.",
      "The pause I gave became permanent.",
      "It wasn't the fight, it was the forgetting.",
      "Maybe we never started right.",
      "It was supposed to be different by now.",
      "The delay cost more than I imagined.",
      "Regret tastes like cold coffee now.",
      "I watched the clock instead of you.",
      "You needed more than what I knew to give.",
      "I never asked you to stay, and that's on me.",
      "The space was mine to fill and I didn't.",
      "I chose quiet over us.",
      "I handed you every reason to go.",
      "You were the right thing on the wrong timeline.",
      "We ran out of luck before we ran out of time.",
      "Life took the one thing I didn't expect to lose.",
      "I didn't know some goodbyes aren't loud.",
      "Some endings don't even give you a scene.",
      "Life gave us a clock with no hands.",
      "Some people meet just to miss.",
      "Maybe we asked the wrong stars.",
      "You were a story the world deleted too soon.",
      "There was a better version of me—I was too late for it.",
      "I let distance win.",
      "I listened to doubt when you needed faith.",
      "Some chances are only given once.",
      "I thought love would be louder than time.",
      "I let comfort kill the spark.",
      "I never looked you in the eyes when it mattered.",
      "The door was open. I just didn't walk through.",
      "I know better now, and it hurts worse.",
      "We were better before we named it.",
      "I gave time to everything but us.",
      "You disappeared so slowly I didn't even notice.",
      "I kept pretending it was just a quiet day.",
      "Everything kept going like you were never here.",
      "You left and no one asked why.",
      "The days after you feel wrong but keep coming.",
      "Even the light doesn't land the same anymore.",
      "You became a habit I had to unlearn.",
      "We stopped talking like it never mattered.",
      "I still wait for nothing without realizing it.",
      "I didn't think the last time was the last.",
      "I still sit where you'd never sit again.",
      "Some rooms forget faster than hearts do.",
      "You're gone in the kind of way that lingers.",
      "No one replaced the space you took.",
      "You're not here, but your absence is.",
      "It hurts more now that I understand it.",
      "I knew it was ending and still stayed quiet.",
      "We were fading and I just let it happen.",
      "It wasn't sudden, but it still felt cruel.",
      "Everything moved on except the parts that mattered.",
      "You became someone I don't know how to talk about.",
      "I never got used to you not coming back.",
      "We didn't fall apart, we just stopped holding on.",
      "The goodbye was quiet but the echo still rings.",
      "I miss you in ways I don't admit out loud.",
      "Even your name feels distant now.",
      "It's not that I didn't care — I just froze.",
      "You deserved more than a slow ending.",
      "I watched us dissolve without trying to stop it.",
      "You were gone before I learned how to need you.",
      "I'm still answering questions no one asked.",
      "I let you go without knowing I did.",
      "We didn't have a fight — just a fade.",
      "I kept checking for something that wasn't coming.",
      "You weren't replaced, just erased.",
      "I'm still not sure how it slipped away.",
      "I let life get too loud to notice you leaving.",
      "You stopped showing up and I acted like it was fine.",
      "I pretended it didn't hurt and made it worse.",
      "You were already gone when I finally looked.",
      "I thought not reacting would save us.",
      "You left gently and it still wrecked me.",
      "It broke slowly but felt instant.",
      "I watched the end come in quiet parts.",
      "Even our memories feel uncomfortable now.",
      "You became a moment I can't explain.",
      "There's no good reason you're gone, but you are.",
      "It felt permanent until it wasn't.",
      "No one tells you love can leave without warning.",
      "Everything faded with no color left.",
      "I still check for you out of habit.",
      "Your name feels foreign in my mouth now.",
      "I didn't ask you to stay, and maybe I should have.",
      "I never thought this could end — so I didn't protect it.",
      "I kept choosing later until it was gone.",
      "I gave you nothing to hold onto.",
      "I waited for you in all the wrong ways.",
      "You were leaving before I noticed the signs.",
      "It ended without a word, just a shift.",
      "I regret every time I stayed quiet.",
      "You drifted and I let you.",
      "I lost you slowly, but it hurt like all at once.",
      "We weren't broken, just undone.",
      "Your side of everything still feels cold.",
      "Even the light switch feels wrong now.",
      "I never imagined you wouldn't stay.",
      "I held onto the idea longer than the person.",
      "We died out in the background.",
      "The parts of me that knew you are fading.",
      "I keep almost texting you, then remembering.",
      "I wish I had listened more when it mattered.",
      "You became part of the routine that stopped.",
      "Everything after felt like waiting.",
      "I didn't believe you'd really leave.",
      "I held back when I should've held on.",
      "You were still here when I started letting go.",
      "I still leave space for you by mistake.",
      "Even the plans don't make sense without you.",
      "You were constant — then you weren't.",
      "The pieces I saved don't fit anything anymore.",
      "Your absence shaped more than your presence.",
      "I still flinch when a number looks like yours.",
      "I let comfort become distance.",
      "I answered too late and you stopped asking.",
      "I chose quiet over clarity.",
      "The timing wasn't wrong, I just wasn't ready.",
      "You slipped into memory while I was distracted.",
      "I treated forever like an option.",
      "Everything feels borrowed now.",
      "You were fading while I stood still.",
      "I blinked and you became the past.",
      "The days feel thinner without you.",
      "I lost you in the pauses between words.",
      "Even the photos don't feel real anymore.",
      "Your absence rearranged everything.",
      "We were too careful and it cost us everything.",
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

  const renderMessage = (memory: Memory) => {
    const wordCount = memory.message.split(/\s+/).length;
    const isShortOrExact = wordCount <= 30;
    // Premium sizing and spacing classes
    const textClass = isShortOrExact
      ? "text-2xl tracking-wide leading-snug break-words hyphens-none"
      : "text-lg tracking-wide leading-snug break-words hyphens-none";
    switch (memory.animation) {
      case "bleeding":
        return (
          <div className="bleeding-text pl-[0.1rem] antialiased space-y-2">
            <p className={textClass}>{memory.message}</p>
          </div>
        );
      case "handwritten":
        return (
          <HandwrittenText message={memory.message} textClass={textClass} />
        );
      default:
        return (
          <div className="space-y-2">
            <p className={textClass}>{memory.message}</p>
          </div>
        );
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
          <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-[var(--text)]">
            {memory.animation && (
              <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>
                ★
              </span>
            )}
            To: {memory.recipient}
          </h3>
            {memory.pinned && (
              <span className="text-yellow-500 text-xl">📌</span>
            )}
          </div>
          {memory.sender && <p className="mt-1 text-lg italic text-[var(--text)]">From: {memory.sender}</p>}
          <hr className="my-2 border-[var(--border)]" />
        </div>
        <div className="flex-grow text-[var(--text)] whitespace-pre-wrap break-normal hyphens-auto pt-2">
          {renderMessage(memory)}
        </div>
        <hr className="my-2 border-[var(--border)]" />
        <div className="text-xs text-[var(--text)] flex justify-center gap-2 whitespace-nowrap font-normal">
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
              <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-[var(--text)]">
                {memory.animation && (
                  <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>
                    ★
                  </span>
                )}
                To: {memory.recipient}
              </h3>
                {memory.pinned && (
                  <span className="text-yellow-500 text-xl">📌</span>
                )}
              </div>
              {memory.sender && <p className="mt-1 text-md italic text-[var(--text)]">From: {memory.sender}</p>}
              <hr className="my-2 border-[var(--border)]" />
            </div>
            <div className="text-xs text-[var(--text)] text-center font-normal">
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
}

const HandwrittenText: React.FC<HandwrittenTextProps> = ({ message, textClass }) => (
  <div className="handwritten-text pl-[0.1rem] antialiased space-y-2">
    <p className={textClass}>{message}</p>
  </div>
);

export default MemoryCard;
