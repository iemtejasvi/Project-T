"use client";
import React, { useState, useEffect, useMemo } from "react";

interface TypewriterPromptProps {
  tag?: string;
  subTag?: string;
  typewriterEnabled?: boolean;
  size?: "sm" | "xl";
}

const wordBreakStyle = {
  wordWrap: 'break-word' as const,
  overflowWrap: 'break-word' as const,
  hyphens: 'none' as const,
  WebkitHyphens: 'none' as const,
  msHyphens: 'none' as const,
  MozHyphens: 'none' as const,
};

interface PromptsData {
  typewriterSubTags: Record<string, string[]>;
  typewriterPromptsBySubTag: Record<string, string[]>;
}

// Module-level cache so the dynamic import only runs once
let cachedPromptsData: PromptsData | null = null;
let loadPromise: Promise<PromptsData> | null = null;

function loadPromptsData(): Promise<PromptsData> {
  if (cachedPromptsData) return Promise.resolve(cachedPromptsData);
  if (loadPromise) return loadPromise;
  loadPromise = import('./typewriterPrompts').then(mod => {
    cachedPromptsData = {
      typewriterSubTags: mod.typewriterSubTags,
      typewriterPromptsBySubTag: mod.typewriterPromptsBySubTag,
    };
    return cachedPromptsData;
  });
  return loadPromise;
}

const TypewriterPrompt: React.FC<TypewriterPromptProps> = ({ tag, subTag, typewriterEnabled, size = "sm" }) => {
  const isDisabled = typewriterEnabled === false;

  const [promptsData, setPromptsData] = useState<PromptsData | null>(cachedPromptsData);

  useEffect(() => {
    if (isDisabled || cachedPromptsData) return;
    let cancelled = false;
    loadPromptsData().then(data => {
      if (!cancelled) setPromptsData(data);
    });
    return () => { cancelled = true; };
  }, [isDisabled]);

  const prompts = useMemo(() => {
    if (!promptsData) return [];
    const { typewriterSubTags, typewriterPromptsBySubTag } = promptsData;

    if (subTag && subTag !== "undefined" && subTag !== "null" && typewriterPromptsBySubTag[subTag]) {
      return typewriterPromptsBySubTag[subTag];
    }

    if (tag && typewriterSubTags[tag]) {
      const allPrompts: string[] = [];
      typewriterSubTags[tag].forEach(st => {
        const subPrompts = typewriterPromptsBySubTag[st] || [];
        allPrompts.push(...subPrompts);
      });
      return allPrompts.length > 0 ? allPrompts : typewriterPromptsBySubTag["other_feeling"] || [];
    }

    const mixedPrompts: string[] = [];
    Object.values(typewriterPromptsBySubTag).forEach(categoryPrompts => {
      const shuffled = [...categoryPrompts].sort(() => 0.5 - Math.random());
      mixedPrompts.push(...shuffled.slice(0, Math.min(2, shuffled.length)));
    });
    return mixedPrompts.sort(() => 0.5 - Math.random()).slice(0, 20);
  }, [tag, subTag, promptsData]);

  const randomOffset = useMemo(() => Math.random() * 1000, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  // Reset index when prompts change
  useEffect(() => {
    if (prompts.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * prompts.length));
      setCharIndex(0);
      setDisplayedText("");
      setIsDeleting(false);
    }
  }, [prompts]);

  useEffect(() => {
    if (prompts.length === 0) return;

    const currentPrompt = prompts[currentIndex];
    if (!currentPrompt) return;

    let delay = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === 0) {
      delay += randomOffset;
    }
    let pauseTimeout: ReturnType<typeof setTimeout>;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentPrompt.substring(0, charIndex + 1));
        if (charIndex + 1 === currentPrompt.length) {
          pauseTimeout = setTimeout(() => setIsDeleting(true), 2000);
        } else {
          setCharIndex(charIndex + 1);
        }
      } else {
        setDisplayedText(currentPrompt.substring(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * prompts.length);
          } while (newIndex === currentIndex && prompts.length > 1);
          setCurrentIndex(newIndex);
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, delay);
    return () => { clearTimeout(timeout); clearTimeout(pauseTimeout); };
  }, [charIndex, isDeleting, currentIndex, prompts, randomOffset]);

  if (isDisabled || prompts.length === 0) {
    return <></>;
  }

  const textClass = size === "xl" ? "text-xl" : "text-sm";

  return (
    <div
      className={`min-h-[2rem] text-center ${textClass} text-[var(--text)] font-serif transition-all duration-300 break-words`}
      style={wordBreakStyle}
    >
      {displayedText}
    </div>
  );
};

export default React.memo(TypewriterPrompt);
