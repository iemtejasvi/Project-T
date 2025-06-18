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
      "I held on like you were still reaching back.",
      "I laughed at the wrong time to feel less alone.",
      "I stayed quiet hoping silence would fix us.",
      "I memorized the sound of a door that never closed softly.",
      "I waited long enough for nothing to feel like something.",
      "I still flinch when someone loves me gently.",
      "I reread old arguments looking for your last trace of care.",
      "I noticed how my smile started shrinking after yours did.",
      "I broke my own heart finishing the story you left halfway.",
      "I still sit on the side you used to choose.",
      "I blamed the clock for your fading.",
      "I kept your side of the bed untouched like you’d notice.",
      "I said I’m fine because breaking down felt too loud.",
      "I stayed even when I became invisible to you.",
      "I waited for your voice in songs I now skip.",
      "I touched the spot you used to sit like it might respond.",
      "I looked for closure in people who didn’t know your name.",
      "I left the light on even when you made it clear you’re not coming back.",
      "I forgot what my laughter sounded like with you in it.",
      "I swallowed your absence like it was my fault.",
      "I dream in moments that aren’t mine anymore.",
      "I spoke to you in thoughts I’m too tired to explain.",
      "I stood in doorways you used to lean against.",
      "I wrote your name just to see if my hands still remembered it.",
      "I stared at messages I never sent like they were enough.",
      "I clung to the idea of you longer than the reality ever lasted.",
      "I put your favorite song on repeat, then cried when I couldn’t feel anything.",
      "I started hating mirrors when I couldn’t see the version of me you loved.",
      "I changed routes to avoid the places where we almost felt real.",
      "I kept conversations going in my head so you wouldn’t feel gone.",
      "I begged myself to stop missing you like it was a habit I could break.",
      "I lowered my expectations until I disappeared underneath them.",
      "I gave pieces of myself like you’d know how to arrange them.",
      "I waited at memories like they were train stations.",
      "I chose silence so you wouldn’t feel guilty leaving.",
      "I forced smiles into photographs hoping you’d notice the effort.",
      "I walked away slower than you so you wouldn’t feel like the villain.",
      "I convinced myself I was hard to love so it would hurt less.",
      "I stared at the ceiling until it started to resemble your goodbye.",
      "I cried so quietly the pillow still smells like restraint.",
      "I practiced forgetting you like it was a language I never spoke well.",
      "I placed your hoodie back on the shelf and called it growth.",
      "I sent you kindness and called it maturity while dying inside.",
      "I told mutual friends I’m happy so they’d stop asking.",
      "I learned to breathe around the lump that says your name.",
      "I lied about moving on so I wouldn’t seem weak.",
      "I touched my own hand pretending it was yours.",
      "I watched the door for longer than anyone should.",
      "I folded your ghost into my routines.",
      "I stood in rooms wondering if you’d hate the curtains now.",
      "I broke down in public and blamed the wind.",
      "I romanticized the pain because it's the only part you left behind.",
      "I missed you in ways I never got to love you.",
      "I built conversations out of what-ifs.",
      "I turned down love that wasn’t you.",
      "I sat across from someone new and wished they were you.",
      "I kept deleting your number just to memorize it better.",
      "I smiled at strangers the way I used to smile at you.",
      "I watched the sunset alone like we planned to do together.",
      "I gave my best goodbye in silence.",
      "I stayed up late because dreams are too cruel.",
      "I reread your last message like it was a prophecy.",
      "I waited for a sorry that never came.",
      "I looked for you in someone’s laugh today.",
      "I checked the time and wondered if you're thinking of me.",
      "I said 'it's okay' when I wanted to scream.",
      "I went to sleep hoping you’d be in my dream for once.",
      "I almost messaged you, then remembered how it ended.",
      "I scrolled through your feed pretending I wasn’t looking for signs.",
      "I let go too late and held on too early.",
      "I kept our memories like unpaid debts.",
      "I gave you the parts of me I never got back.",
      "I hated myself for not being enough, then hated you for making me feel that way.",
      "I stayed long enough to ruin myself, short enough to make you miss me.",
      "I tore apart who I was to keep you close.",
      "I walked around like you didn’t exist while feeling you in my bones.",
      "I’m still stuck at the part where you changed your mind.",
      "I looked happy just to make you feel free.",
      "I stood beside you like a shadow, hoping you’d notice the darkness.",
      "I said ‘take care’ and meant ‘please don’t go’.",
      "I played strong so you wouldn’t pity me.",
      "I kept your pictures because I don’t know how to let go.",
      "I learned to fake peace after you.",
      "I filled journals with unsent apologies you didn’t deserve.",
      "I let the world see me whole while I lived cracked.",
      "I convinced myself you were worth the wreckage.",
      "I was a second thought to someone I made a first prayer.",
      "I replayed the beginning so much I forgot how it ended.",
      "I held on to our past like it had a future.",
      "I wore your goodbye like a second skin.",
      "I kept your voice in a song that doesn’t play anymore.",
      "I waited for you in people who didn’t know how to stay.",
      "I carried your name into new beginnings.",
      "I tried to love myself the way you never could.",
      "I ran out of ways to tell myself it’s over.",
      "I drowned quietly in the space you left empty.",
      "I thought you were home until you locked the door.",
      "I put down my pride where you wouldn’t even pick up my heart.",
      "I rehearsed what I’d say if I saw you again and still ended up speechless.",
      "I watched the world move on and wondered why I’m still here.",
      "I didn’t cry when you left — I waited until it hurt more.",
      "I treated your indifference like it was a challenge.",
      "I loved you loud, and you left quietly.",
      "I became someone I don’t recognize while loving you.",
      "I learned the hard way that effort isn’t love.",
      "I let you go, but the echoes stayed.",
      "I gave closure to someone who never asked.",
      "I held my breath hoping it would bring you back.",
      "I apologized for things you did to me.",
      "I convinced myself I could handle the ending you gave me.",
      "I walked away carrying a goodbye I didn’t agree with.",
      "I let your silence teach me how to scream on the inside.",
      "I wore our memories like armor even though the war was over.",
      "I broke myself rebuilding someone who never stayed.",
      "I noticed how light felt heavier without you.",
      "I pretended I didn’t care so well, I forgot how to stop pretending.",
      "I mistook survival for healing.",
      "I remembered your birthday but forgot how to feel joy.",
      "I searched for closure in your absence and found myself missing instead.",
      "I let love rot in my chest where you left it.",
      "I taught myself to stay quiet when it hurts because you did too.",
      "I gave you everything except the power to miss me back.",
      "I stayed soft in a world you made hard.",
      "I kept your goodbye framed like art I can’t afford to throw away.",
      "I listened to everyone but myself, and you still left.",
      "I wrote you out of my life, but you bled through every sentence.",
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
    const textClass = isShortOrExact
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
        return <HandwrittenText message={memory.message} />;
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
          </div>
          {memory.sender && <p className="mt-1 text-lg italic text-[var(--text)]">From: {memory.sender}</p>}
          <hr className="my-2 border-[#999999]" />
        </div>
        <div className="flex-grow text-[var(--text)] whitespace-pre-wrap break-normal hyphens-auto pt-2">
          {renderMessage(memory)}
        </div>
        <hr className="my-2 border-[#999999]" />
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
            <TypewriterPrompt />
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
