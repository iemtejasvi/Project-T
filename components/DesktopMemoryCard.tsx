import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CursiveText from './CursiveText';
import HandwrittenText from './HandwrittenText';
import { typewriterSubTags, typewriterPromptsBySubTag } from './typewriterPrompts';

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  color: string;
  full_bg: boolean;
  letter_style?: string;
  animation?: string;
  pinned?: boolean;
  pinned_until?: string;
  ip?: string;
  country?: string;
  uuid?: string;
  tag?: string;
  sub_tag?: string;
  typewriter_enabled?: boolean;
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

// Direct hex values with more saturated/visible colors (20-30% darker than CSS variables)
const colorBgMap: Record<string, string> = {
  default: "#E8E0D0",
  aqua: "#B8D8D8",      // was #E0EBEB
  azure: "#C0D0DB",     // was #E4E8EB
  berry: "#D1C3D8",     // was #E9E3E8
  brass: "#E0D8C8",     // was #F0EDE8
  bronze: "#DDC7B0",    // was #EDE7E0
  clay: "#E0C5B2",      // was #F0E5E2
  cloud: "#DCDFF1",     // was #ECEFF1
  copper: "#E0C8B3",    // was #F0E8E3
  coral: "#E3C6B2",     // was #F3E6E2
  cream: "#E5E3CD",     // was #F5F3ED
  cyan: "#C2DCDC",      // was #E2ECEC
  dune: "#E2DECA",      // was #F2F0EA
  garnet: "#D8C0C0",    // was #E8E0E0
  gold: "#E3E0C4",      // was #F3F0E4
  honey: "#E3CDC3",     // was #F3EDE3
  ice: "#C7CBCD",       // was #E7EBED
  ivory: "#E6E5D2",     // was #F6F5F2
  jade: "#C5DCC8",      // was #E5ECE8
  lilac: "#DBC8DD",     // was #EBE8ED
  mint: "#C9E0C9",      // was #E9F0E9
  moss: "#C6D8C2",      // was #E6E8E2
  night: "#C1C3D9",     // was #E1E3E9
  ocean: "#C2C6DA",     // was #E2E6EA
  olive: "#DCDAC2",     // was #EAEAE2
  peach: "#E5CDC7",     // was #F5EDE7
  pearl: "#DCC9DE",     // was #ECE9EE
  pine: "#C2D6C3",      // was #E2E6E3
  plum: "#D7C2C4",      // was #E7E2E4
  rose: "#E2CACB",      // was #F2EAEB
  rouge: "#E0C6C8",     // was #F0E6E8
  ruby: "#E1C3C3",      // was #F1E3E3
  sage: "#DADCC8",      // was #EAECE8
  sand: "#E5E2CA",      // was #F5F2EA
  sepia: "#D9D5C2",     // was #E9E5E2
  sky: "#DBDFE4",       // was #EBEFF4
  slate: "#D6D8DA",     // was #E6E8EA
  steel: "#D8D9DA",     // was #E8E9EA
  sunny: "#E6E4C9",     // was #F6F4E9
  teal: "#C2DBDA",      // was #E2EBEA
  wine: "#D9C3C4"       // was #E9E3E4
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
  const wordCount = memory.message.split(/[\s.]+/).filter(word => word.length > 0).length;
  const isShortOrExact = wordCount <= 30;
  const textClass = isShortOrExact
    ? "text-4xl tracking-wide leading-snug break-words hyphens-none"
    : "text-2xl tracking-wide leading-snug break-words hyphens-none";
  switch (memory.animation) {
    case "cursive":
      return (
        <CursiveText
          message={memory.message}
          textClass={textClass}
          effectiveColor={effectiveColor}
        />
      );
    case "handwritten":
      return <HandwrittenText message={memory.message} textClass={textClass} />;
    case "rough":
      // Use handwritten text sizing/feel; card-level background handles rough paper
      return <p className={`${textClass} la-belle-aurore-regular pl-3 pr-[0.05rem] sm:pl-3 sm:pr-[0.05rem] antialiased`}>{memory.message}</p>;
    default:
      return (
        <div className="space-y-2">
          <p className={textClass}>{memory.message}</p>
        </div>
      );
  }
}



const TypewriterPrompt: React.FC<{ tag?: string; subTag?: string; typewriterEnabled?: boolean }> = ({ tag, subTag, typewriterEnabled }) => {
  // For new memories: use the typewriter_enabled field
  // For old memories: show typewriter by default (typewriter_enabled will be undefined)
  const isDisabled = typewriterEnabled === false;

  // Get all prompts for the given tag by combining all subcategory prompts
  const prompts = React.useMemo(() => {
    // If we have a specific subTag (short tag), use prompts from that subcategory
    if (subTag && subTag !== "undefined" && subTag !== "null" && typewriterPromptsBySubTag[subTag]) {
      return typewriterPromptsBySubTag[subTag];
    }
    
    // If we have a main tag, use all prompts from that tag
    if (tag && typewriterSubTags[tag]) {
      const allPrompts: string[] = [];
      typewriterSubTags[tag].forEach(subTag => {
        const subPrompts = typewriterPromptsBySubTag[subTag] || [];
        allPrompts.push(...subPrompts);
      });
      
      return allPrompts.length > 0 ? allPrompts : typewriterPromptsBySubTag["other_feeling"] || [];
    }
    
    // If no tag is selected, show a mix of all categories
    const mixedPrompts: string[] = [];
    Object.values(typewriterPromptsBySubTag).forEach(categoryPrompts => {
      // Take 1-2 random prompts from each category to create a diverse mix
      const shuffled = [...categoryPrompts].sort(() => 0.5 - Math.random());
      mixedPrompts.push(...shuffled.slice(0, Math.min(2, shuffled.length)));
    });
    
    // Shuffle the mixed prompts and limit to a reasonable number
    return mixedPrompts.sort(() => 0.5 - Math.random()).slice(0, 20);
  }, [tag, subTag]);
  
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * prompts.length));
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  
  useEffect(() => {
    if (prompts.length === 0) return;
    
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
  
  if (isDisabled || prompts.length === 0) return null;
  
  return (
    <div className="min-h-[2rem] text-center text-xl text-[var(--text)] font-serif transition-all duration-300 break-words" style={{ 
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      hyphens: 'none',
      WebkitHyphens: 'none',
      msHyphens: 'none',
      MozHyphens: 'none'
    }}>
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
  const borderStyle = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border)'
  };
  const bgStyle =
    effectiveColor === "default"
      ? { backgroundColor: colorBgMap.default }
      : memory.full_bg
      ? { backgroundColor: colorBgMap[effectiveColor] || colorBgMap.default }
      : {};

  const dateStr = new Date(memory.created_at).toLocaleDateString();
  const dayStr = new Date(memory.created_at).toLocaleDateString(undefined, { weekday: "long" });
  // Prevent flip when clicking the arrow
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.open-card-btn')) return;
    setFlipped((f) => !f);
  };

  return (
    <div className={`relative group ${large ? 'my-2' : 'my-6'}`}>
      <motion.div
        whileHover={{ scale: 1.06, y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.20), 0 8px 16px rgba(0,0,0,0.08)", transition: { duration: 0.22, ease: 'easeOut' } }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, scale: 1.045, boxShadow: "0 16px 36px rgba(0,0,0,0.20), 0 8px 16px rgba(0,0,0,0.10)" }}
        className={`flip-card relative overflow-hidden w-full h-[420px] perspective-1000 cursor-pointer rounded-[2rem] hover:shadow-2xl mx-auto`}
        onClick={handleCardClick}
        style={{ ...bgStyle, ...borderStyle }}
      >
        {memory.animation === "rough" && (
          <>
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
              <defs>
                <filter id="roughpaper">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                  <feDiffuseLighting lightingColor="white" diffuseConstant="1" surfaceScale="2" result="diffLight">
                    <feDistantLight azimuth="45" elevation="35" />
                  </feDiffuseLighting>
                </filter>
              </defs>
            </svg>
            <div
              aria-hidden
              className="absolute inset-0 rounded-[inherit]"
              style={{
                filter: "url(#roughpaper)",
                background:
                  effectiveColor && effectiveColor !== "default"
                    ? `var(--color-${effectiveColor}-bg)`
                    : "#e8e6df",
                opacity: 0.55,
                zIndex: 0,
              }}
            />
          </>
        )}
        <motion.div
          className="flip-card-inner relative z-10 w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          {/* FRONT */}
          <div
            className={`flip-card-front absolute w-full h-full backface-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[var(--border)]/15 ${memory.animation === "rough" ? "overflow-hidden" : ""} ${large ? 'p-12' : 'p-8'} flex flex-col justify-between`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            {memory.animation === "rough" && (
              <>
                <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
                  <defs>
                    <filter id="roughpaper">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                      <feDiffuseLighting lightingColor="white" diffuseConstant="1" surfaceScale="2" result="diffLight">
                        <feDistantLight azimuth="45" elevation="35" />
                      </feDiffuseLighting>
                    </filter>
                  </defs>
                </svg>
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit]"
                  style={{
                    filter: "url(#roughpaper)",
                    background:
                      effectiveColor && effectiveColor !== "default"
                        ? `var(--color-${effectiveColor}-bg)`
                        : "#e8e6df",
                    opacity: 0.55,
                    zIndex: 0,
                  }}
                />
              </>
            )}
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
            <div className="pb-1 relative z-10">
               <h3 className={`${large ? 'text-4xl' : 'text-2xl'} font-normal text-[var(--text)] flex items-center gap-2 leading-tight`}>
                                <span className="break-words overflow-hidden leading-tight">To: {memory.recipient}</span>
              </h3>
              {memory.sender && <p className={`mt-1 ${large ? 'text-3xl' : 'text-2xl'} la-belle-aurore-regular text-[var(--text)] break-words overflow-hidden`}>From: {memory.sender}</p>}
              <hr className="my-2 border-[#999999]" />
            </div>
            <div className="text-xl text-[var(--text)] text-center font-normal relative z-10">
              {dateStr} | {dayStr}
            </div>
            <div className="text-xl min-h-[3em] mt-2 px-2 font-serif text-center text-[var(--text)] relative z-10" style={{ lineHeight: '1.5' }}>
                              <TypewriterPrompt tag={memory.tag} subTag={memory.sub_tag} typewriterEnabled={memory.typewriter_enabled} />
            </div>
          </div>
          {/* BACK */}
          <div
            className={`flip-card-back absolute w-full h-full backface-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[var(--border)]/15 ${memory.animation === "rough" ? "overflow-hidden" : ""} ${large ? 'p-12' : 'p-8'} flex flex-col justify-start rotate-y-180`}
            style={{ ...bgStyle, ...borderStyle }}
          >
            {memory.animation === "rough" && (
              <>
                <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
                  <defs>
                    <filter id="roughpaper">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                      <feDiffuseLighting lightingColor="white" diffuseConstant="1" surfaceScale="2" result="diffLight">
                        <feDistantLight azimuth="45" elevation="35" />
                      </feDiffuseLighting>
                    </filter>
                  </defs>
                </svg>
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit]"
                  style={{
                    filter: "url(#roughpaper)",
                    background:
                      effectiveColor && effectiveColor !== "default"
                        ? `var(--color-${effectiveColor}-bg)`
                        : "#e8e6df",
                    opacity: 0.55,
                    zIndex: 0,
                  }}
                />
              </>
            )}
            <p className={`hidden lg:block text-4xl italic text-[var(--text)] text-center font-normal !font-normal relative z-10`}>if only i sent this</p>
            <p className={`block lg:hidden ${large ? 'text-3xl' : 'text-xl'} italic text-[var(--text)] text-center font-normal !font-normal relative z-10`}>if only i sent this</p>
            <hr className="my-2 border-[#999999] relative z-10" />
            {memory.animation === "rough" ? (
              <div 
                className="flex-1 overflow-y-auto text-[var(--text)] whitespace-pre-wrap break-words hyphens-none pt-2 relative z-10 cute_scroll"
                style={{
                  fontSize: memory.message.split(/[\s.]+/).filter(word => word.length > 0).length <= 30 ? '2rem' : '1.25rem',
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
                } as React.CSSProperties}
              >
                {renderMessageLarge(memory, effectiveColor)}
              </div>
            ) : (
              <ScrollableMessage
                style={{
                  fontSize: memory.message.split(/[\s.]+/).filter(word => word.length > 0).length <= 30 ? '2rem' : '1.25rem',
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
                } as React.CSSProperties}
              >
                <div className="relative z-10">
                  {renderMessageLarge(memory, effectiveColor)}
                </div>
              </ScrollableMessage>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Minimal bottom-center open affordance */}
      <div className="hidden lg:flex absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <Link href={`/memories/${memory.id}`} className="open-card-btn pointer-events-auto">
          <span className="inline-flex items-center rounded-full transition-all duration-300 bg-[var(--card-bg)]/80 text-[var(--text)]/70 backdrop-blur-sm border border-transparent text-[17px] leading-none px-0 py-0 w-0 h-0 opacity-0 group-hover:px-5 group-hover:py-[8px] group-hover:w-auto group-hover:h-auto group-hover:opacity-100 group-hover:border-[var(--border)]/60">
            <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">open</span>
            <span className="ml-1 opacity-0 group-hover:opacity-100">↗</span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default DesktopMemoryCard; 
