"use client";
import React, { useState, useEffect, useMemo } from "react";

const TypingEffect: React.FC = () => {
  const messages = useMemo(
    () => [
      "I wish I said no more often.",
      "You inspire me to be nothing like you.",
      "We were just strangers with memories.",
      "I miss the old me, before you.",
      "Some things are better left unsaid.",
      "You never realized, did you?",
      "I was always second choice.",
      "I should have walked away sooner.",
      "You never fought for me.",
      "It still hurts, but I hide it well.",
      "I let you break me.",
      "You never even noticed.",
      "I was just an option, not a priority.",
      "The silence said more than you ever did.",
      "I cared too much. You didn't care at all.",
      "I kept waiting for something that never came.",
      "Some wounds never heal.",
      "If I mattered, you'd still be here.",
      "I should have been enough.",
      "You let me go so easily.",
      "I wish I could unmeet you.",
      "I still wait for a message that never comes.",
      "I wanted forever, you wanted convenience.",
      "We never even got closure.",
      "Maybe I was just a lesson, not a love.",
      "You promised, then you left.",
      "I should have listened when they warned me.",
      "I deserved more than unanswered texts.",
      "I was there for you. You were nowhere for me.",
      "You always said 'maybe later.' Later never came.",
      // 50 more sad messages:
      "Every goodbye leaves a scar.",
      "I still hear your silence.",
      "You were never truly mine.",
      "Regrets whisper in the dark.",
      "I lost parts of myself with you.",
      "Love turned cold too fast.",
      "Your absence echoes in my heart.",
      "I wished for more than what was given.",
      "I keep your ghost in every memory.",
      "Your shadow lingers in my dreams.",
      "I hoped for warmth, found only frost.",
      "Loneliness became my only friend.",
      "I carry the weight of unspoken words.",
      "Our memories haunt me daily.",
      "Every moment with you was bittersweet.",
      "I tried to hold on, but you slipped away.",
      "Silence became our final conversation.",
      "I wore my heart on a fragile sleeve.",
      "The truth hurts more than lies.",
      "I wish I could forget what we had.",
      "I drown in a sea of missed chances.",
      "I kept falling, even when I knew the end.",
      "You left behind more than empty promises.",
      "I once believed in us, now I only believe in solitude.",
      "I built dreams on promises that crumbled.",
      "The mirror reflects a stranger now.",
      "I still search for the love that vanished.",
      "Every memory is a bittersweet reminder.",
      "I stand alone in the ruins of our past.",
      "I sacrificed my soul for a love unreturned.",
      "The pain of goodbye never truly fades.",
      "I linger in the shadow of what could have been.",
      "Every heartbeat echoes your absence.",
      "I hoped you would be different.",
      "Your silence is louder than any words.",
      "I gave my all, but it wasn't enough.",
      "Every promise you broke still stings.",
      "I hide my scars behind a forced smile.",
      "I lost more than I ever thought possible.",
      "The emptiness inside speaks volumes.",
      "I watch the rain, feeling every drop of sorrow.",
      "I yearn for a past that can never return.",
      "I wear my solitude like a second skin.",
      "I fell for dreams that were never real.",
      "I mourn the future that we never had.",
      "Every tear tells a story of loss.",
      "I held on, even when I knew I should let go.",
      "The cold truth is harder to bear than the lies.",
      "I built hope on a foundation of despair.",
      "In the silence, my heart still whispers your name."
    ],
    []
  );
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMistyped, setIsMistyped] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentMessage = messages[currentIndex];
    let delay = Math.random() * 100 + 100; // Typing delay between 100-200ms
    if (isDeleting) {
      delay = 50; // Faster deletion
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // With a 10% chance, simulate mistyping (if not at start)
        if (!isMistyped && Math.random() < 0.1 && charIndex > 0) {
          const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
          setDisplayText(currentMessage.substring(0, charIndex) + wrongChar);
          setIsMistyped(true);
        } else if (isMistyped) {
          // Remove the wrong character and reset mistype flag
          setDisplayText(currentMessage.substring(0, charIndex));
          setIsMistyped(false);
        } else {
          const nextCharIndex = charIndex + 1;
          setDisplayText(currentMessage.substring(0, nextCharIndex));
          setCharIndex(nextCharIndex);
          if (nextCharIndex === currentMessage.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentMessage.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentIndex((currentIndex + 1) % messages.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, isMistyped, currentIndex, messages]);

  return (
    <div className="typing-effect text-center text-lg font-mono text-[var(--text)] min-h-[3rem] transition-all duration-300">
      {displayText}
    </div>
  );
};

export default TypingEffect;
