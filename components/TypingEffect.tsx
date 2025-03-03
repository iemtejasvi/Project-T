"use client";
import React, { useState, useEffect } from "react";

const messages = [
  "I wish I said no more often.",
  "You inspire me to be nothing like you.",
  "Silence speaks louder than words.",
  "Regret lingers in every unsent message.",
  "Tears fall for the words left unsaid.",
  "I drown in the echoes of my own mistakes.",
  "Every goodbye is a silent scream.",
  "I long for the love I never dared to claim.",
  "Heartache is the price of unspoken truths.",
  "Loneliness is my only faithful friend.",
  "Dreams fade into the shadows of despair.",
  "Memories haunt me like ghosts of the past.",
  "Every regret is a reminder of what could have been.",
  "I ache for a future that never was.",
  "The silence of my heart is deafening.",
  "Broken promises litter the path of my life.",
  "I wear my sorrow like a second skin.",
  "The weight of words unspoken crushes me.",
  "I hide behind smiles that conceal my pain.",
  "Every missed chance is a wound that never heals.",
  "I am lost in a labyrinth of my own regrets.",
  "The beauty of sadness is its raw honesty.",
  "In the depths of despair, I find my truth.",
  "The night whispers secrets of forgotten dreams.",
  "I am a silent observer of my own downfall.",
  "Every heartbeat echoes a story of loss.",
  "Hope is a fragile thing in a broken heart.",
  "I wander through memories of what was never mine.",
  "The scars of the past are etched in my soul.",
  "I long for moments that time cannot return.",
  "Silence wraps around me like a cold blanket.",
  "I am the echo of a dream that died.",
  "Loneliness paints my world in shades of gray.",
  "My words are lost in the void of regret.",
  "I am the ghost of my own memories.",
  "Every tear is a whisper of my despair.",
  "I linger in the spaces between hope and sorrow.",
  "The past clings to me like an unshakable shadow.",
  "My silence speaks the language of pain.",
  "I am haunted by the love I never received.",
  "Every unsaid word is a silent agony.",
  "I am adrift in a sea of forgotten dreams.",
  "The echoes of yesterday are my constant companions.",
  "I bear the weight of memories too heavy to hold.",
  "My heart is a canvas of unspoken sorrows.",
  "In every quiet moment, regret finds a way in.",
  "I am the author of my own melancholy.",
  "Every word unsaid is a lost piece of me.",
  "I carry the silence of a thousand broken dreams.",
  "My soul is a testament to what was never spoken."
];

const TypingEffect: React.FC = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];
    let typingSpeed = Math.random() * 100 + 50; // speed between 50ms to 150ms

    // With a small chance, simulate a mistake by triggering deletion mid-type
    if (!isDeleting && Math.random() < 0.1 && charIndex > 0) {
      typingSpeed = 100;
      setIsDeleting(true);
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentMessage.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        if (charIndex + 1 === currentMessage.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayedText(currentMessage.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setCurrentMessageIndex((currentMessageIndex + 1) % messages.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentMessageIndex]);

  return (
    <div className="h-10 text-center text-xl sm:text-2xl italic text-[var(--text)] font-serif">
      {displayedText}
      <span className="border-r-2 border-[var(--text)] ml-1 animate-pulse"></span>
    </div>
  );
};

export default TypingEffect;
