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
      "I replay your last words every single day.",
      "I blamed clocks more than you at times.",
      "I wanted one more moment more than closure.",
      "I stayed while you collected attention everywhere else.",
      "I let you lie and still stayed loyal.",
      "I stayed silent while you played both sides.",
      "I lost pieces you never even noticed missing.",
      "I saw your disinterest before it showed up.",
      "I love you in ways I can't explain properly.",
      "I hated how things ended without a villain.",
      "I acted like love was a scoreboard.",
      "I missed chances thinking they'd come again.",
      "I kept waiting for something already gone.",
      "I let time decide what words should've.",
      "I regret all the love I left unspoken.",
      "I tried pretending it wasn't final.",
      "I saw us fail in slow motion.",
      "I made you feel temporary in permanence.",
      "I gave love like you gave excuses.",
      "I stayed loyal while you considered replacements.",
      "I waited for proof you already gave.",
      "I watched you fall for someone I'm not.",
      "I saw life get in the way again.",
      "I chose silence when words could've saved us.",
      "I replayed fights just to feel something again.",
      "I gave trust you used as leverage.",
      "I watched timing destroy something worth saving.",
      "I forgot you weren't mine to shape.",
      "I stayed soft for someone playing sharp.",
      "I spent days proving I didn't need you.",
      "I gave you half of what you needed.",
      "I noticed your effort had a deadline.",
      "I waited while you played with options.",
      "I lost sleep over your peace.",
      "I gave you more reasons to leave than stay.",
      "I thought honesty could fix timing.",
      "I wanted forever even when you didn't mean it.",
      "I didn't know distance would mean disconnect.",
      "I thought love was enough until it wasn't.",
      "I held grudges longer than your apologies lasted.",
      "I watched life push us from the middle.",
      "I begged for breaks we never received.",
      "I saw the door and still stood still.",
      "I didn't know I was watching the end.",
      "I stayed loyal to a memory, not a person.",
      "I should've asked what you needed earlier.",
      "I gave you forever before you even asked.",
      "I waited through storms that never cleared.",
      "I lost you somewhere I didn't even notice.",
      "I hated how long it took to unlove.",
      "I regretted not slamming that door harder.",
      "I made healing feel like punishment.",
      "I couldn't say goodbye, so I just watched.",
      "I broke silently while you blamed timing again.",
      "I assumed effort would bring us back.",
      "I still wear the songs you left behind.",
      "I missed you even when you were next to me.",
      "I kept score in something meant to heal.",
      "I loved you knowing it might ruin me.",
      "I saw you slipping through cracks life created.",
      "I lost you to timing, not intention.",
      "I should've returned what you gave: nothing.",
      "I kept loving long after the goodbye ended.",
      "I tried winning instead of understanding.",
      "I watched you perform care like a script.",
      "I didn't expect timing to turn traitor.",
      "I made excuses for your obvious shift.",
      "I loved beyond reason, beyond logic, beyond return.",
      "I used distance to prove a point.",
      "I let pride speak instead of my love.",
      "I loved loudly while you listened half-heartedly.",
      "I watched you ruin things just for ego.",
      "I stayed present while you drafted escape plans.",
      "I never got to say the right things.",
      "I didn't thank you when it mattered most.",
      "I handed loyalty to someone careless with it.",
      "I stood still while you rewrote the ending.",
      "I thought you meant it every single time.",
      "I watched everything end like a bystander.",
      "I wanted answers you laughed away.",
      "I stayed when you wouldn't even try.",
      "I let your absence teach me resentment.",
      "I held back when you deserved the worst.",
      "I believed we'd find our way back eventually.",
      "I trusted the future too blindly for us.",
      "I let you become a part of my forever.",
      "I kept it together while you fell apart deliberately.",
      "I still imagine how your day might've gone.",
      "I heard lies dressed up as soft truths.",
      "I loved someone who only loved being loved.",
      "I gave effort while you gamed connection.",
      "I took you seriously when you were just bored.",
      "I gave closure you never earned once.",
      "I thought we had more time than we did.",
      "I loved you when you weren't ready yet.",
      "I gave you grace you never deserved once.",
      "I cleaned up messes you called accidents.",
      "I kept planning futures we never discussed.",
      "I broke down after pretending for too long.",
      "I met you when I couldn't meet myself.",
      "I wanted to be okay too soon.",
      "I trusted you while you rehearsed your goodbye.",
      "I wished for you in quieter timelines.",
      "I blamed distance for things we couldn't fix.",
      "I saw the change and blamed the season.",
      "I stayed calm when I should've fought.",
      "I chose you while life chose differently.",
      "I begged for depth from someone surface-level.",
      "I lost the only thing that felt real.",
      "I noticed you stopped noticing me first.",
      "I let you teach me pain in lessons.",
      "I regretted waiting for clearer signs.",
      "I let moments pass I should've claimed.",
      "I watched everything fall without fault.",
      "I thought you'd wait while I figured out.",
      "I handled blame while you disappeared conveniently.",
      "I lowered standards you still didn't reach.",
      "I waited too long to be honest.",
      "I stayed while you learned how to leave.",
      "I never thought your absence could feel permanent.",
      "I kept pace with someone already gone.",
      "I tried being kind while you kept score.",
      "I met you during my worst chapters.",
      "I still think of what we almost became.",
      "I still carry your name like a secret blessing.",
      "I questioned loyalty instead of nurturing it.",
      "I felt it slip but stayed quiet anyway.",
      "I held you like you'd never leave.",
      "I still save space for what we were.",
      "I believed words that cost you nothing.",
      "I wanted peace while you wanted control.",
      "I gave you peace while you built storms.",
      "I turned every small thing into a reason.",
      "I forgot how much pretending cost me.",
      "I kept your voice somewhere my thoughts still go.",
      "I still pause at things you used to love.",
      "I gave you parts I've never given anyone.",
      "I gave ultimatums where patience was needed.",
      "I kept trying while you kept checking out.",
      "I chased closure you never planned to give.",
      "I held on long after you let go.",
      "I love you in silence now, quietly permanent.",
      "I held on to feelings you outgrew quietly.",
      "I didn't hold tight enough at the end.",
      "I still believe you loved me once too.",
      "I believed in us while you believed in options.",
      "I held you to standards I couldn't meet.",
      "I begged the universe to buy us time.",
      "I saw us fail under perfect skies.",
      "I thought the world would wait for us.",
      "I hoped you'd care eventually.",
      "I made you explain what should've been obvious.",
      "I made excuses while you made exits.",
      "I kept loving even when you stopped noticing.",
      "I believed love could fix bad timing.",
      "I left you wondering if you mattered.",
      "I still look for signs you cared more.",
      "I welcomed you while you packed silently.",
      "I held on while time pulled you away.",
      "I bent until you stopped seeing the effort.",
      "I missed the signs written in your silence.",
      "I lost sleep while you lived casually unbothered.",
      "I reread our memories like they'd update themselves.",
      "I gave more every time you gave less.",
      "I let you in deeper than I planned.",
      "I loved you while the world collapsed quietly.",
      "I showed up uninvited to your detachment.",
      "I smiled through your fading interest.",
      "I broke what I swore I'd protect forever.",
      "I blamed jobs, cities, and clocks, not hearts.",
      "I watched you fade and still stood still.",
      "I lost you in my own reflection.",
      "I acted fine while you played victim flawlessly.",
      "I love you in quiet ways I can't undo.",
      "I ignored patterns that screamed truth.",
      "I noticed the difference when you stopped pretending.",
      "I forgot to show up when it mattered.",
      "I knew life wouldn't let us align properly.",
      "I never expected our last moment to be that.",
      "I still replay laughs you forgot you gave me.",
      "I hated how easily you moved on.",
      "I should've left when I still felt loved.",
      "I held space while you filled someone else's.",
      "I played strong when I should've begged.",
      "I treated love like a puzzle to solve.",
      "I realized what I had once it left.",
      "I waited while you looked for exits.",
      "I made you earn affection you already had.",
      "I begged for honesty you never intended to give.",
      "I learned to love your distance daily.",
      "I gave the version of me you hated.",
      "I cursed the calendar more than you.",
      "I never stopped thinking you'd call eventually.",
      "I didn't know that was our last memory.",
      "I lost you to things we couldn't name.",
      "I treated forever like it couldn't run out.",
      "I kept it real while you rehearsed exits.",
      "I needed to be right more than kind.",
      "I picked you even when you paused me.",
      "I smiled while you shredded my name silently.",
      "I picked pride over presence every time.",
      "I let you choose me last, again.",
      "I let my ego speak for my heart.",
      "I stayed angry longer than you deserved.",
      "I held back instead of holding on.",
      "I never thought missing you would feel like this.",
      "I got lost in things I couldn't control.",
      "I believed love could rewrite time's script.",
      "I swallowed truths just to protect your name.",
      "I loved without backup plans or exit routes.",
      "I held on while the seasons changed us.",
      "I stood by while you blamed everything else.",
      "I said things just to hear myself win.",
      "I forgave things you wouldn't tolerate yourself.",
      "I wish you knew I still look back often.",
      "I mistook confusion for complexity.",
      "I deserved better than your apologies recycled weekly.",
      "I overthought things you never even noticed.",
      "I found peace too late for us both.",
      "I opened up while you made plans alone.",
      "I showed up while you practiced absence.",
      "I met you during life's messiest reroute.",
      "I missed you even in moments meant for joy.",
      "I ruined the one thing that was real.",
      "I still expect you in every good moment.",
      "I let you win what wasn't a game.",
      "I waited for moments that never came true.",
      "I thought you'd circle back eventually.",
      "I adjusted until I became unfamiliar.",
      "I listened to lies wrapped in affection.",
      "I watched you drift like it wasn't your choice.",
      "I let my fears lead every conversation.",
      "I still check the sky hoping you're looking too.",
      "I never got to give a proper goodbye.",
      "I ruined peace just to be right.",
      "I watched fate twist everything out of shape.",
      "I assumed love meant the same to both.",
      "I forgave things that rewired my trust permanently.",
      "I watched you ruin peace like it meant nothing.",
      "I realized too late what you were offering.",
      "I looked away when you reached out.",
      "I tolerated things that warped who I was.",
      "I kept thinking there'd be a later.",
      "I spent nights defending what you destroyed daily.",
      "I regretted not loving louder when I could.",
      "I ran out of time before running to you.",
      "I tried building something on unstable ground.",
      "I left gaps you filled with doubt.",
      "I met you in the middle of endings.",
      "I let karma sleep too long with you.",
      "I outgrew the version you left behind.",
      "I still hope you're doing okay out there.",
      "I showed up when everything else fell apart.",
      "I made it hard for you to stay.",
      "I filled in blanks you left empty.",
      "I never made you beg the way I did.",
      "I left my guard down and you moved in.",
      "I remembered your smile more than your absence.",
      "I planned a future we never discussed properly.",
      "I met you in the wrong lifetime entirely.",
      "I shared dreams you didn't intend to stay for.",
      "I demanded what I failed to give.",
      "I still reread old texts like they're holy.",
      "I held onto versions of you long gone.",
      "I felt fate laugh every time we tried.",
      "I mistook love for a win to earn.",
      "I loved you with no safety net underneath.",
      "I gave you all the versions of me.",
      "I felt love get buried under reality.",
      "I would do it all over for one more day.",
      "I watched you rehearse things just for ego.",
      "I believed in us while we ended silently.",
      "I knew fate had other cruel plans for us.",
      "I still smile at memories that break me later.",
      "I left the mess with my name on it.",
      "I see you in wins I wish you shared.",
      "I mistook your coldness as temporary.",
      "I read your silence as a challenge.",
      "I forgot what it felt like to be chosen.",
      "I answered your affection with hesitation.",
      "I waited while you looked for exits.",
      "I carry your name in moments you'll never hear.",
      "I saved pieces of you in my routines.",
      "I wanted peace for you even from afar.",
      "I stayed loyal to feelings that outlived their place.",
      "I didn't listen when I should've heard.",
      "I miss things I never appreciated enough.",
      "I thought we'd survive the chaos around us.",
      "I learned to love the ghost of you.",
      "I carried the weight of your indifference.",
      "I traced moments hoping to feel you again.",
      "I read affection into obligation.",
      "I forgave things you denied ever doing.",
      "I remembered the exact moment I lost you.",
      "I carried guilt that was always yours first.",
      "I find you in strangers who don't even look alike.",
      "I misread your love as something conditional.",
      "I gave love the world wouldn't allow to grow.",
      "I fell for you mid-storm, not knowing better.",
      "I broke what I swore I'd protect forever.",
      "I still remember your way of saying goodbye.",
      "I waited for you to fix me."
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
