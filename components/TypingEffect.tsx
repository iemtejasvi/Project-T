"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";

interface TypingEffectProps {
	className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ className }) => {
  const messages = useMemo(
    () => [
      "You died inside my chest.",
      "Nobody mourns us but me.",
      "I loved you too late.",
      "We ended before we started.",
      "Your silence still burns daily.",
      "I kept every broken promise.",
      "You forgot me so easily.",
      "The bed remembers your shape.",
      "I never stopped loving you.",
      "Nobody knows I still cry.",
      "You left without looking back.",
      "I sleep on your side.",
      "The flowers I never sent.",
      "You were my last hope.",
      "I died when you left.",
      "Nobody sees me missing you.",
      "Your name still wrecks me.",
      "I buried us in silence.",
      "The voicemail I never deleted.",
      "You moved on. I didn't.",
      "I still reach for you.",
      "Nobody told me you're gone.",
      "Your ghost sleeps beside me.",
      "I loved a disappearing act.",
      "The empty side hurts worse.",
      "You broke what can't heal.",
      "I whisper to your absence.",
      "Nobody warned me about you.",
      "Your laugh haunts my mornings.",
      "I chose you. You didn't.",
      "The ring collects dust now.",
      "You vanished mid-sentence. Forever.",
      "I water our dead memories.",
      "Nobody comes to this bench.",
      "Your scent is fading faster.",
      "I forgave an empty room.",
      "The last kiss tasted final.",
      "You promised forever meant something.",
      "I still dial your number.",
      "Nobody answers at your end.",
      "Your side of bed: cold.",
      "I kept your broken watch.",
      "You existed. Then you didn't.",
      "I loved you past tense.",
      "Nobody saved your place here.",
      "Your absence is the loudest.",
      "I held on too long.",
      "The door you never reopened.",
      "I still cook for two.",
      "Nobody noticed you were leaving.",
      "Your heart stopped choosing mine.",
      "I replay our last words.",
      "The mirror misses your reflection.",
      "You were my quiet ruin.",
      "I ache in your language.",
      "Nobody hears me say stay.",
      "Your clothes still hang waiting.",
      "I speak to empty chairs.",
      "You faded before my eyes.",
      "I lost you while awake.",
      "Nobody writes your name anymore.",
      "Your memory burns, never warms.",
      "I outlived us. That's worse.",
      "You smiled your last goodbye.",
      "I drowned in your leaving.",
      "Grief found me. You didn't.",
      "Your voice still cracks me.",
      "I loved you into ruins.",
      "You let go so gently.",
      "I haunt our old places.",
      "Nobody mourns what never existed.",
      "Your shadow left before you.",
      "I survived you. Barely. Barely.",
      "The apology arrived too late.",
      "You unraveled everything we built.",
      "I still flinch at forever.",
      "Nobody teaches grief an ending.",
      "Your name tastes like regret.",
      "I memorized your last goodbye.",
      "You kissed like an ending.",
      "I stayed. The room emptied.",
      "Nobody buries love this deep.",
      "Your fingerprints are still here.",
      "I burned your letters. Wept.",
      "You were my beautiful damage.",
      "I prayed you'd look back.",
      "Nobody saw us crumble quietly.",
      "Your goodbye tasted like forever.",
      "I swallowed every unsent word.",
      "You left the light on.",
      "I kept your last cigarette.",
      "Nobody counts the empty chairs.",
      "Your breath still haunts pillows.",
      "I loved what destroyed me.",
      "You ruined the word home.",
      "I'm still in that doorway.",
      "Nobody knows our real ending.",
    ],
    []
  );
  
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * messages.length));
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMistyped, setIsMistyped] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentMessage = messagesRef.current[currentIndex];
    let delay = Math.random() * 100 + 100; // Typing delay between 100-200ms
    if (isDeleting) {
      delay = 50; // Faster deletion
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (!isMistyped && Math.random() < 0.1 && charIndex > 0) {
          const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
          setDisplayText(currentMessage.substring(0, charIndex) + wrongChar);
          setIsMistyped(true);
        } else if (isMistyped) {
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
          // Ensure we get a different random index
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * messagesRef.current.length);
          } while (newIndex === currentIndex && messagesRef.current.length > 1);
          setCurrentIndex(newIndex);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, isMistyped, currentIndex]);

  return (
    <div
      className={
        "min-h-[2.5rem] overflow-hidden text-center text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[var(--text)] whitespace-pre-wrap break-normal hyphens-auto" +
        (className ? " " + className : "")
      }
    >
      {displayText}
    </div>
  );
};

export default TypingEffect;


