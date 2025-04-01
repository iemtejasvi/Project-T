"use client";
import React, { useState, useEffect, useMemo } from "react";
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
      "It still hurts.",
      "I still love you.",
      "I hope it was worth it.",
      "You chose this.",
      "I was never enough.",
      "Did you ever mean it?",
      "Was it a lie?",
      "You let go first.",
      "I won’t ask again.",
      "So that’s it?",
      "You promised.",
      "I waited. You didn’t.",
      "You stopped trying.",
      "This is what you wanted.",
      "I saw the signs.",
      "You made it easy to leave.",
      "I still check.",
      "We had forever.",
      "You left so quietly.",
      "I almost called.",
      "Do you even care?",
      "Was I just convenient?",
      "I still dream of you.",
      "This doesn’t feel real.",
      "I should hate you.",
      "You changed first.",
      "What a waste.",
      "I’m done waiting.",
      "You’re a stranger now.",
      "Was it ever love?",
      "I’ll never know why.",
      "You never looked back.",
      "I still hear your voice.",
      "I don’t know you anymore.",
      "You chose someone else.",
      "Was I easy to forget?",
      "I deserved better.",
      "You let me down.",
      "I don’t miss you. (Lie)",
      "I should have left first.",
      "Did you even love me?",
      "It wasn’t supposed to end.",
      "How long were you pretending?",
      "Did you find better?",
      "You said forever.",
      "I wish I hated you.",
      "Was it all fake?",
      "I don’t blame you.",
      "You never fought for me.",
      "I loved you. That was my mistake.",
      "You disappeared so easily.",
      "We don’t even talk now.",
      "You broke me. Did you notice?",
      "What changed?",
      "You moved on too fast.",
      "I saw you with her.",
      "Was I just a phase?",
      "I wish you missed me.",
      "I wish I could forget.",
      "I hope she’s worth it.",
      "You never said sorry.",
      "I wrote, then deleted it.",
      "I hope it haunts you.",
      "You always walked away first.",
      "I never stopped loving you.",
      "You don’t even check.",
      "This is all I have left.",
      "I still have your hoodie.",
      "I hate how much I care.",
      "I don’t text first anymore.",
      "You knew you’d hurt me.",
      "I lost myself in you.",
      "Was I a mistake?",
      "You faded so easily.",
      "The emptiness grew after you.",
      "My tears fell unnoticed.",
      "Your absence carved a void.",
      "Time didn’t heal this.",
      "The days blur without you.",
      "Someone else holds your smile.",
      "My heart still seeks you.",
      "Your name stings now.",
      "The past taunts me daily.",
      "Loneliness became my companion.",
      "Your goodbye lingered too long.",
      "My hope died with you.",
      "The quiet reminds me of you.",
      "Your scent still haunts me.",
      "Every song recalls us.",
      "The nights stretch endlessly now.",
      "Your memory refuses to fade.",
      "My world dimmed without you.",
      "The truth hit too late.",
      "Your laughter lives in me.",
      "Regret shadows every step.",
      "The distance feels eternal.",
      "My soul mourns you still.",
      "Your face haunts my dreams.",
      "The end came too soon.",
      "My love meant so little.",
      "Your departure broke everything.",
      "The pain stays fresh.",
      "My hands miss yours.",
      "Your voice won’t leave me.",
      "The silence screams your name.",
      "My chest aches for you.",
      "Your choice erased me.",
      "The memories cut deep.",
      "My faith in us shattered.",
      "Your shadow follows me.",
      "The loss grows heavier.",
      "My tears carry your name.",
      "Your presence once saved me.",
      "The void swallowed my joy.",
      "My dreams replay your exit.",
      "Your eyes never saw me.",
      "The hurt never softens.",
      "My life feels borrowed now.",
      "Your happiness excludes me.",
      "The clock mocks my waiting.",
      "My love lingers, unclaimed.",
      "Your words left scars.",
      "The past won’t release me.",
      "My heart broke alone.",
      "Your absence defines me now.",
      "The days drag without meaning.",
      "My trust died with us.",
      "Your silence deafened me.",
      "The end still stuns me.",
      "My hope was misplaced.",
      "Your leaving stole my peace.",
      "The nights bury me alive.",
      "My love was invisible.",
      "Your heart turned cold.",
      "The ruin is all mine.",
      "My sorrow clings to you.",
      "Your footsteps faded fast.",
      "The bond dissolved too easily.",
      "My pain echoes unanswered.",
      "Your joy belongs elsewhere.",
      "The truth crushed me.",
      "My soul still calls you.",
      "Your distance broke my spirit.",
      "The love wasn’t mutual.",
      "My tears fell in vain.",
      "Your life moved without me.",
      "The ache never dulls.",
      "My heart remembers too much.",
      "Your choice haunts my nights.",
      "The emptiness owns me now.",
      "My dreams hold you captive.",
      "Your love slipped away.",
      "The loss carved me hollow.",
      "My days lack your light.",
      "Your exit left me stranded.",
      "The hurt defines me now.",
      "My love was too late.",
      "Your absence numbs me.",
      "The silence replaced you.",
      "My heart won’t let go.",
      "Your goodbye still burns.",
      "The pain paints my days.",
      "My hope crumbled alone.",
      "Your memory traps me.",
      "The end stole my breath.",
      "My love fell apart.",
      "Your heart never stayed.",
      "The nights drown me now.",
      "My tears mourn us still.",
      "Your departure haunts me.",
      "The void took your place.",
      "My soul lost its anchor.",
      "Your face won’t fade.",
      "The sorrow grows daily.",
      "My love was unanswered.",
      "Your silence broke me.",
      "The days feel pointless.",
      "My heart carries your weight.",
      "Your choice left me empty.",
      "The past torments me.",
      "My trust vanished with you.",
      "Your absence scars me.",
      "The love died alone.",
      "My hope faded unnoticed.",
      "Your voice still lingers.",
      "The ruin feels permanent.",
      "My tears trace your loss.",
      "Your heart found another.",
      "The pain binds me now.",
      "My dreams won’t release you.",
      "Your leaving crushed me.",
      "The silence owns my nights.",
      "My love was wasted.",
      "Your goodbye severed us.",
      "The emptiness consumes me.",
      "My heart beats for nothing.",
      "Your memory wounds me.",
      "The loss reshaped me.",
      "My days mourn you.",
      "Your absence stole my warmth.",
      "The hurt won’t leave.",
      "My love remains unreturned.",
      "Your exit broke my core.",
      "The nights magnify my grief.",
      "My soul clings to you.",
      "Your choice undid me.",
      "The pain stays relentless.",
      "My tears reflect your absence.",
      "Your heart forgot me.",
      "The end haunts my mind.",
      "My love was too weak.",
      "Your distance silenced me.",
      "The sorrow won’t lift.",
      "My heart holds your ghost.",
      "Your leaving drained me.",
      "The void mirrors my loss.",
      "My hope dissolved with you.",
      "Your silence pierced me.",
      "The days lack purpose.",
      "My love lies buried.",
      "Your absence rules me.",
      "The pain carves my soul.",
      "My tears beg for you.",
      "Your heart turned away.",
      "The ruin haunts my days.",
      "My dreams keep you near.",
      "Your goodbye lingers on.",
      "The loss broke my will.",
      "My love faded alone.",
      "Your choice left scars.",
      "The silence buries me.",
      "My heart won’t heal.",
      "Your absence defines my nights.",
      "The sorrow clings tight.",
      "My tears mark your exit.",
      "Your life erased me.",
      "The pain shapes my world.",
      "My love was unseen.",
      "Your heart moved on.",
      "The end left me raw.",
      "My soul misses you.",
      "Your silence stings still.",
      "The days feel hollow.",
      "My hope died quietly.",
      "Your absence cuts deep.",
      "The hurt stays alive.",
      "My love lost its home.",
      "Your choice haunts my soul.",
      "The void swallowed me.",
      "My tears fall alone.",
      "Your heart never saw.",
      "The pain won’t relent.",
      "My dreams carry you.",
      "Your goodbye broke me.",
      "The silence deafens me.",
      "My love remains lost.",
      "Your absence owns me.",
      "The sorrow fills my days.",
      "My heart still aches.",
      "Your leaving stole me.",
      "The end came too fast.",
      "My tears hold your name.",
      "Your life left me behind.",
      "The pain never fades.",
      "My love died with you.",
      "My cowardice lost you.",
      "The fault was mine alone.",
      "I failed you completely.",
      "My fears destroyed us.",
      "Selfishness blinded me.",
      "Your love deserved better.",
      "I ignored your pleas.",
      "My pride ruined everything.",
      "Regret consumes me now.",
      "I didn’t hold you close.",
      "The blame rests with me.",
      "My silence hurt you.",
      "I let you slip away.",
      "Fear kept me distant.",
      "Your tears were my doing.",
      "I saw too late.",
      "My heart failed you.",
      "The guilt crushes me.",
      "I didn’t value you.",
      "My doubts tore us apart.",
      "Sorrow follows my mistakes.",
      "I left you alone.",
      "My flaws broke us.",
      "Your pain was my fault.",
      "I couldn’t be enough.",
      "The ruin is my legacy.",
      "My inaction cost us.",
      "I didn’t see your worth.",
      "Regret stains my soul.",
      "My choices pushed you away.",
      "The loss is my burden.",
      "I failed to fight.",
      "My ego betrayed you.",
      "Your absence is my punishment.",
      "I didn’t hear you.",
      "My love was too frail.",
      "The sorrow is mine.",
      "I let us fade.",
      "My blindness ended us.",
      "Your hurt reflects my failure.",
      "I didn’t try enough.",
      "The guilt won’t leave.",
      "My fear silenced us.",
      "I lost you to myself.",
      "Your tears haunt my nights.",
      "My stubbornness broke you.",
      "The pain is my creation.",
      "I didn’t deserve you.",
      "My neglect drove you off.",
      "Regret defines me now.",
      "I couldn’t love you right.",
      "The fault lies in me.",
      "My doubts drowned us.",
      "Your loss is my doing.",
      "I failed your trust.",
      "My heart betrayed us.",
      "The sorrow buries me.",
      "I didn’t keep you safe.",
      "My pride stole our chance.",
      "Your grief was my gift.",
      "I let you down.",
      "The ruin came from me.",
      "My silence killed us.",
      "I didn’t see your pain.",
      "My fears won over you.",
      "The guilt eats me alive.",
      "I couldn’t hold on.",
      "My flaws ruined you.",
      "Your absence is my fault.",
      "I didn’t fight for us.",
      "The regret cuts deep.",
      "My love wasn’t enough.",
      "Your hurt is my shame.",
      "I pushed you too far.",
      "The loss weighs on me.",
      "My cowardice broke us.",
      "I didn’t value your heart.",
      "Sorrow fills my failure.",
      "My choices ended you.",
      "The blame haunts me.",
      "I let fear rule me.",
      "Your tears mark my guilt.",
      "My inaction lost us.",
      "The pain is my own.",
      "I didn’t see you.",
      "My pride left you alone.",
      "Regret poisons my days.",
      "I failed to love you.",
      "The fault was my silence.",
      "My doubts crushed you.",
      "Your sorrow is my sin.",
      "I couldn’t save us.",
      "The ruin is my mark.",
      "My fear tore you away.",
      "I didn’t hear your cries.",
      "Guilt shadows my life.",
      "My love let you go.",
      "The loss is my curse.",
      "I didn’t hold you tight.",
      "My flaws destroyed us.",
      "Your pain came from me.",
      "I failed to stay.",
      "The regret never fades.",
      "My silence wounded you.",
      "I didn’t fight hard.",
      "Your tears blame me.",
      "My heart wasn’t enough.",
      "The sorrow owns me.",
      "I let us break.",
      "My blindness hurt you.",
      "Your grief is my fault.",
      "I couldn’t be there.",
      "The guilt stays with me.",
      "My fear lost you.",
      "I didn’t see your love.",
      "Regret drowns my soul.",
      "My choices failed us.",
      "The pain is my price.",
      "I let you suffer.",
      "My pride undid us.",
      "Your absence is my error.",
      "I didn’t try for you.",
      "The sorrow cuts me.",
      "My love fell short.",
      "Your hurt is my doing.",
      "I pushed you out.",
      "The loss is my shame.",
      "My cowardice ended us.",
      "I didn’t cherish you.",
      "Guilt fills my days.",
      "My actions broke you.",
      "The fault lies here.",
      "I let doubt win.",
      "Your tears curse me.",
      "My inaction ruined us.",
      "The pain is my burden.",
      "I didn’t notice you.",
      "My pride cost you.",
      "Regret traps me now.",
      "I failed your love.",
      "The silence was mine.",
      "My doubts killed us.",
      "Your sorrow blames me.",
      "I couldn’t rise up.",
      "The ruin is my work.",
      "My fear pushed you off.",
      "I didn’t hear you out.",
      "Guilt binds my heart.",
      "My love wasn’t strong.",
      "The loss scars me.",
      "I didn’t hold on tight.",
      "My flaws left you.",
      "Your pain is my scar.",
      "I failed to show up.",
      "The regret gnaws me.",
      "My silence cut you.",
      "I didn’t fight enough.",
      "Your tears judge me.",
      "My heart gave up.",
      "The sorrow is my chain.",
      "I let us die.",
      "My blindness lost you.",
      "Your grief weighs me.",
      "I couldn’t stand firm.",
      "The guilt won’t lift.",
      "My fear broke you.",
      "I didn’t see your need.",
      "Regret fills my nights.",
      "My choices hurt you.",
      "The pain is my truth.",
      "I let you fade.",
      "My pride tore us.",
      "Your absence is my crime.",
      "I didn’t reach out.",
      "The sorrow grips me.",
      "My love lacked force.",
      "Your hurt stains me.",
      "I pushed you aside.",
      "The loss is my wound.",
      "My cowardice failed you.",
      "I didn’t treasure you.",
      "Guilt haunts my soul.",
      "My actions lost you.",
      "The fault is my own.",
      "I let fear take you.",
      "Your tears damn me.",
      "My inaction broke us.",
      "The pain is my cross.",
      "I didn’t feel you.",
      "My pride left scars.",
      "Regret rules my life.",
      "I failed to care.",
      "The silence was my choice.",
      "My doubts erased us.",
      "Your sorrow is my debt.",
      "I couldn’t hold us.",
      "The ruin is my blame.",
      "My fear let you go.",
      "I didn’t hear your heart.",
      "Guilt drowns me now.",
      "My love died first.",
      "You left and never looked back.",
      "I should’ve left too.",
      "Why wasn’t I enough?",
      "You never fought for me.",
      "You didn’t even try.",
      "Did I mean anything?",
      "I still have your playlist.",
      "I was never yours, was I?",
      "I can’t hate you.",
      "You left without a word.",
      "I should hate you, but I don’t.",
      "I should have let go first.",
      "You meant everything.",
      "You left me empty.",
      "Do you even remember?",
      "You forgot me so fast.",
      "I wish I didn’t care.",
      "You chose her.",
      "You were my home.",
      "I gave you everything.",
      "This wasn’t the plan.",
      "I should be over this.",
      "I hate that I miss you.",
      "I should have seen it coming.",
      "You don’t even think of me.",
      "You took my heart with you.",
      "I hope you’re happy.",
      "You let go too soon.",
      "I’m forever missing you."
    ],
    []
  );

  const randomOffset = useMemo(() => Math.random() * 1000, []);
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * prompts.length));
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
          setCurrentIndex(Math.floor(Math.random() * prompts.length));
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

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, detail }) => {
  const [flipped, setFlipped] = useState(false);

  // Map old or unknown color names to new ones
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
    "graphite"
  ]);
  const colorMapping: Record<string, string> = { rose: "cherry" };
  let effectiveColor = memory.color;
  if (!allowedColors.has(memory.color)) {
    effectiveColor = colorMapping[memory.color] || "default";
  }

  // For "default", always use off white background (#F8F8F0) and fixed border (#D9D9D9)
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
    const isShort = memory.message.length < 100;
    const messageStyle = isShort ? { fontSize: "1.5rem", lineHeight: 1.2 } : {};
    switch (memory.animation) {
      case "bleeding":
        return <p className="bleeding-text" style={messageStyle}>{memory.message}</p>;
      case "handwritten":
        return <HandwrittenText message={memory.message} messageStyle={messageStyle} />;
      default:
        return <p style={messageStyle}>{memory.message}</p>;
    }
  };

  if (detail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-xs sm:max-w-sm mx-auto my-6 p-6 border-2 rounded-xl shadow-md flex flex-col min-h-[300px] hover:shadow-2xl"
        style={{ ...bgStyle, ...borderStyle }}
      >
        <div>
          <h3 className="text-2xl font-bold text-[var(--text)]">
            {memory.animation && (
              <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>★</span>
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
                  <span style={{ fontSize: "0.8rem", ...arrowStyle, marginRight: "4px" }}>★</span>
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
            <div
              className="flex-1 overflow-y-auto cute_scroll text-sm text-[var(--text)] whitespace-pre-wrap break-words pt-2"
              // Inline CSS variables for scrollbar colors based on effectiveColor
              style={
                {
                  "--scroll-track": effectiveColor === "default" ? "#f8bbd0" : `var(--color-${effectiveColor}-bg)`,
                  "--scroll-thumb": effectiveColor === "default" ? "#e91e63" : `var(--color-${effectiveColor}-border)`
                } as React.CSSProperties
              }
            >
              {renderMessage(memory)}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

interface HandwrittenTextProps {
  message: string;
  messageStyle: React.CSSProperties;
}

const HandwrittenText: React.FC<HandwrittenTextProps> = ({ message, messageStyle }) => (
  <div className="handwritten-text">
    <p style={messageStyle}>{message}</p>
  </div>
);

export default MemoryCard;
