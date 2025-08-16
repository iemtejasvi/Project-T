import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PoeticText from "./PoeticText";
import CursiveText from './CursiveText';
import BleedingText from './BleedingText';
import HandwrittenText from './HandwrittenText';
import { typewriterPromptsByTag, typewriterTags } from './typewriterPrompts';

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
  pinned_until?: string;
  tag?: string;
}

interface DesktopMemoryCardProps {
  memory: Memory;
  detail?: boolean;
  large?: boolean;
}

const allowedColors = new Set([
  "default", "aqua", "azure", "berry", "brass", "bronze", "clay", "cloud", "copper", "coral", "cream", "cyan", "dune", "garnet", "gold", "honey", "ice", "ivory", "jade", "lilac", "mint", "moss", "night", "ocean", "olive", "peach", "pearl", "pine", "plum", "rose", "rouge", "ruby", "sage", "sand", "sepia", "sky", "slate", "steel", "sunny", "teal", "wine"
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

function renderMessageLarge(memory: Memory, effectiveColor: string) {
  const wordCount = memory.message.split(/\s+/).length;
  const isShortOrExact = wordCount <= 30;
  const textClass = isShortOrExact
    ? "text-4xl tracking-wide leading-snug break-words hyphens-none"
    : "text-2xl tracking-wide leading-snug break-words hyphens-none";
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

const pickStableTag = (seed: string) => {
  const tags = typewriterTags;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return tags[hash % tags.length];
};

const TypewriterPrompt: React.FC<{ tag: string }> = ({ tag }) => {
  const prompts = React.useMemo(() => typewriterPromptsByTag[tag] || typewriterPromptsByTag["Other"], [tag]);
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * prompts.length));
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  useEffect(() => {
    const currentPrompt = prompts[currentIndex];
    const delay = isDeleting ? 50 : 100;
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
          setCurrentIndex(Math.floor(Math.random() * prompts.length));
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, prompts]);
  return (
    <div className="min-h-[2rem] overflow-hidden text-center text-xl text-[var(--text)] font-serif transition-all duration-300 whitespace-pre-wrap break-normal hyphens-auto">
      {displayedText}
    </div>
  );
};

const DesktopMemoryCard: React.FC<DesktopMemoryCardProps> = ({ memory, large }) => {
  const [flipped, setFlipped] = useState(false);
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

  const dateStr = new Date(memory.created_at).toLocaleDateString();
  const dayStr = new Date(memory.created_at).toLocaleDateString(undefined, { weekday: "long" });
  const arrowStyle =
    effectiveColor === "default"
      ? { color: "#D9D9D9" }
      : { color: `var(--color-${effectiveColor}-border)` };
  // Prevent flip when clicking the arrow
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".desktop-arrow-link")) return;
    setFlipped((f) => !f);
  };

  return (
    <div className={`relative group ${large ? 'my-2' : 'my-6'}`}>
      <div className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 sm:right-[-50px]">
        <Link href={`/memories/${memory.id}`} className="desktop-arrow-link">
          <span className={`arrow-icon ${large ? 'text-4xl' : 'text-2xl'}`} style={arrowStyle}>➜</span>
        </Link>
      </div>
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flip-card w-full h-[420px] perspective-1000 cursor-pointer rounded-3xl hover:shadow-2xl mx-auto`}
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
            className={`flip-card-front absolute w-full h-full backface-hidden rounded-3xl shadow-md ${large ? 'p-10' : 'p-6'} flex flex-col justify-between`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            {memory.pinned && (
              <span
                className="absolute top-4 right-4 animate-pin-pop z-20"
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
            <div>
              <h3 className={`${large ? 'text-5xl' : 'text-3xl'} font-bold text-[var(--text)] flex items-center gap-2`}>
                {memory.animation && memory.animation !== "none" && (
                  <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>
                    ★
                  </span>
                )}
                To: {memory.recipient}
              </h3>
              {memory.sender && <p className={`mt-1 ${large ? 'text-3xl' : 'text-2xl'} italic text-[var(--text)]`}>From: {memory.sender}</p>}
              <hr className="my-2 border-[#999999]" />
            </div>
            <div className="text-xl text-[var(--text)] text-center font-normal">
              {dateStr} | {dayStr}
            </div>
            <div className="text-xl min-h-[2.5em] mt-2 font-serif text-center text-[var(--text)]">
              <TypewriterPrompt tag={memory.tag || pickStableTag(memory.id)} />
            </div>
          </div>
          {/* BACK */}
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden rounded-3xl shadow-md ${large ? 'p-10' : 'p-6'} flex flex-col justify-start rotate-y-180`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            <p className={`hidden lg:block text-4xl italic text-[var(--text)] text-center font-normal !font-normal`}>if only i sent this</p>
            <p className={`block lg:hidden ${large ? 'text-3xl' : 'text-xl'} italic text-[var(--text)] text-center font-normal !font-normal`}>if only i sent this</p>
            <hr className="my-2 border-[#999999]" />
            <ScrollableMessage
              style={{
                fontSize: memory.message.split(/\s+/).length <= 30 ? '2rem' : '1.25rem',
                "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
              } as React.CSSProperties}
            >
              {renderMessageLarge(memory, effectiveColor)}
            </ScrollableMessage>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DesktopMemoryCard; 
