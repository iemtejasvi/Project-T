"use client";
import React, { useEffect, useRef, useCallback } from 'react';
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface DroppingTextProps {
  message: string;
  textClass: string;
  effectiveColor?: string;
}

const DroppingText: React.FC<DroppingTextProps> = ({ message, textClass, effectiveColor = 'default' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout[]>([]);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  const cleanup = useCallback(() => {
    // Clear all timeouts
    animationTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutRef.current = [];
    
    // Remove all particles
    particlesRef.current.forEach(particle => particle.remove());
    particlesRef.current = [];
    
    // Reset character classes
    if (containerRef.current) {
      const chars = containerRef.current.querySelectorAll('.dropping-char');
      const lines = containerRef.current.querySelectorAll('.dropping-line');
      chars.forEach(char => char.classList.remove('dropped'));
      lines.forEach(line => line.classList.remove('complete'));
    }
  }, []);

  const createParticles = useCallback((x: number, y: number) => {
    const particleCount = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const angle = Math.random() * Math.PI * 2;
      const force = 0.6 + Math.random() * 0.6;
      const xOffset = Math.cos(angle) * force;
      const yOffset = Math.sin(angle) * force;
      
      const delay = Math.random() * 100;
      particle.style.animationDelay = `${delay}ms`;
      
      particle.style.setProperty('--x', xOffset.toString());
      particle.style.setProperty('--y', yOffset.toString());
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      document.body.appendChild(particle);
      particlesRef.current.push(particle);
      
      const timeout = setTimeout(() => {
        particle.remove();
        particlesRef.current = particlesRef.current.filter(p => p !== particle);
      }, 1200 + delay);
      
      animationTimeoutRef.current.push(timeout);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous animation
    cleanup();

    const container = containerRef.current;
    const chars = container.querySelectorAll('.dropping-char');
    const lines = container.querySelectorAll('.dropping-line');
    
    chars.forEach((char, index) => {
      const lineIndex = Math.floor(index / 20);
      const baseDelay = lineIndex * 1000;
      const charDelay = (index % 20) * 100;
      const randomOffset = Math.random() * 100;
      
      const timeout = setTimeout(() => {
        char.classList.add('dropped');
        
        const rect = char.getBoundingClientRect();
        createParticles(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
      }, baseDelay + charDelay + randomOffset);
      
      animationTimeoutRef.current.push(timeout);
    });

    lines.forEach((line, index) => {
      const timeout = setTimeout(() => {
        line.classList.add('complete');
      }, (index + 1) * 1200);
      
      animationTimeoutRef.current.push(timeout);
    });

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [message, createParticles, cleanup]);

  return (
    <div ref={containerRef} className="dropping-text px-[0.05rem] sm:px-[0.05rem] antialiased space-y-2">
      <p 
        className={`${textClass} ${pacifico.className}`}
        style={{ 
          color: `var(--color-${effectiveColor}-border)`,
          textShadow: `0px 0px 3px var(--color-${effectiveColor}-border), 
                       0px 0px 8px var(--color-${effectiveColor}-bg)`,
        }}
      >
        {message.split('\n').map((line, index) => (
          <span key={index} className="dropping-line block relative">
            {line.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-2 sm:mr-2">
                {word.split('').map((char, charIndex) => (
                  <span key={charIndex} className="dropping-char inline-block opacity-0">
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

export default DroppingText; 