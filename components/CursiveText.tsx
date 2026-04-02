"use client";
import React, { useEffect, useRef } from 'react';
import { pacificoClass } from '@/lib/fonts';

interface CursiveTextProps {
  message: string;
  textClass: string;
  effectiveColor?: string;
}

const CursiveText: React.FC<CursiveTextProps> = ({ message, textClass, effectiveColor = 'default' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const chars = Array.from(container.querySelectorAll('.cursive-char'));
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Shuffle characters for random melting
    const shuffledChars = [...chars].sort(() => Math.random() - 0.5);

    // Function to create a drip effect
    const createDrip = (char: Element) => {
      const numDrips = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numDrips; i++) {
        const charDrip = document.createElement('div');
        charDrip.className = 'cursive-char-drip';

        const dripHeight = 20 + Math.random() * 35;
        const delay = 0.3 + Math.random() * 0.7;
        const duration = 2 + Math.random() * 2;
        const horizontalOffset = (Math.random() - 0.5) * 4;

        Object.assign(charDrip.style, {
          '--drip-height': `${dripHeight}px`,
          left: `calc(50% + ${horizontalOffset}px)`,
          animation: `charDripAnimation ${duration}s ease-in-out ${delay}s infinite`,
          opacity: '0.6',
        });

        char.appendChild(charDrip);

        timers.push(setTimeout(() => {
          charDrip.classList.add('active');
        }, 100));
      }
    };

    // Function to melt a character
    const meltCharacter = (char: Element, index: number) => {
      const meltDistance = 3 + Math.random() * 4 + (index % 4);
      char.setAttribute('style', `--melt-distance: ${meltDistance}px`);

      timers.push(setTimeout(() => {
        char.classList.add('melting');

        timers.push(setTimeout(() => {
          createDrip(char);
        }, 300));

        timers.push(setTimeout(() => {
          char.classList.remove('melting');
          char.classList.add('melted');
        }, 2000));
      }, 100));
    };

    // Start melting characters with varying delays
    shuffledChars.forEach((char, index) => {
      const baseDelay = index * (800 + Math.random() * 1200);
      const randomOffset = Math.random() * 500;
      timers.push(setTimeout(() => {
        meltCharacter(char, index);
      }, baseDelay + randomOffset));
    });

    // Add line-level drips for additional effect
    const lines = container.querySelectorAll('.cursive-line');
    lines.forEach((line) => {
      const lineWidth = line.getBoundingClientRect().width;
      const numberOfDrips = Math.floor(lineWidth / 15);

      for (let i = 0; i < numberOfDrips; i++) {
        const drip = document.createElement('div');
        drip.className = 'cursive-drip';

        const left = (i * 15) + Math.random() * 10;
        const height = 25 + Math.random() * 40;
        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 2;

        Object.assign(drip.style, {
          left: `${left}px`,
          height: `${height}px`,
          animation: `dripAnimation ${duration}s ease-in-out ${delay}s infinite`,
          opacity: '0.4',
        });

        line.appendChild(drip);
      }
    });

    return () => {
      // Remove dynamically created drip elements before clearing timeouts
      if (container) {
        container.querySelectorAll('.cursive-char-drip').forEach(el => el.remove());
        container.querySelectorAll('.cursive-drip').forEach(el => el.remove());
        container.querySelectorAll('.melting, .melted').forEach(el => {
          el.classList.remove('melting', 'melted');
        });
      }
      timers.forEach(clearTimeout);
    };
  }, [message]);

  return (
    <div ref={containerRef} className="cursive-text px-[0.05rem] sm:px-[0.05rem] antialiased space-y-2">
      <p 
        className={`${textClass} ${pacificoClass}`}
        style={{ 
          color: `var(--color-${effectiveColor}-border)`,
          textShadow: `0px 0px 3px var(--color-${effectiveColor}-border), 
                       0px 0px 8px var(--color-${effectiveColor}-bg)`,
        }}
      >
        {message.split('\n').map((line, index) => (
          <span key={index} className="cursive-line block relative">
            {line.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-2 sm:mr-2">
                {word.split('').map((char, charIndex) => (
                  <span key={charIndex} className="cursive-char relative inline-block">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  );
};

export default CursiveText; 