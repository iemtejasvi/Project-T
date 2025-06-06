"use client";
import React, { useEffect, useRef } from 'react';

interface PoeticTextProps {
  message: string;
  textClass: string;
  effectiveColor?: string;
}

const PoeticText: React.FC<PoeticTextProps> = ({ message, textClass, effectiveColor = 'default' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = containerRef.current.querySelectorAll('.letter');
    letters.forEach((letter, idx) => {
      const delay = Math.random() * 0.5 + 0.1;
      setTimeout(() => {
        letter.classList.add('visible');
        if (letter instanceof HTMLElement) {
          letter.style.color = `var(--color-${effectiveColor}-border)`;
          letter.style.textShadow = `0px 0px 2px var(--color-${effectiveColor}-border), 
                                   0px 0px 6px var(--color-${effectiveColor}-bg)`;
        }
      }, delay * 1000 * (idx + 1));
    });
  }, [message, effectiveColor]);

  return (
    <div className="poetic-text px-[0.05rem] sm:px-[0.05rem] antialiased space-y-2">
      <p className={textClass} ref={containerRef}>
        {message.split(' ').map((word, wordIdx) => (
          <span key={wordIdx} className="word inline-block mr-2 sm:mr-2">
            {word.split('').map((char, charIdx) => (
              <span key={`${wordIdx}-${charIdx}`} className="letter">
                {char}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  );
};

export default PoeticText; 