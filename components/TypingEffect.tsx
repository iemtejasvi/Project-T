"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";

interface TypingEffectProps {
	className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ className }) => {
  const messages = useMemo(
    () => [
      "Do you think I forgot you?",
      "I still smell you on pillows.",
      "You died and I kept living.",
      "Mom asked about you. I lied.",
      "I wear your hoodie to sleep.",
      "The pregnancy test was positive. You left.",
      "I named our unborn child after you.",
      "Your mother still calls me son.",
      "I found your suicide note too late.",
      "The hospital called. You didn't want me.",
      "I read your diary after the funeral.",
      "You married her. I watched. Smiling.",
      "Dad never got to meet you.",
      "I deleted our photos. Then screamed.",
      "The last voicemail: just you breathing.",
      "I visit your grave on Tuesdays.",
      "You overdosed. I found you cold.",
      "Our daughter has your exact eyes.",
      "I still set your place at dinner.",
      "The doctor said months. You had weeks.",
      "I forgave you at your casket.",
      "You called me someone else's name.",
      "I held your hand. It went cold.",
      "The engagement ring is still unworn.",
      "You were already dead when I arrived.",
      "I whisper goodnight to your ashes.",
      "Mom died thinking you'd come home.",
      "I kept the baby. You didn't know.",
      "Your heart stopped inside my arms.",
      "I reread your last text daily.",
      "The ultrasound photo is still framed.",
      "You crashed. The voicemail was playing.",
      "I never told you it was cancer.",
      "Our song played at your funeral.",
      "I dream you're still breathing sometimes.",
      "The suicide letter said my name first.",
      "I water flowers you'll never see.",
      "You said forever. Lasted seven months.",
      "I talk to your empty chair.",
      "The ambulance took too long. You knew.",
      "I kissed your forehead goodbye. Twice.",
      "Your phone still rings. Nobody answers.",
      "I sleep holding your old shirt.",
      "The crash took you mid-sentence. Forever.",
      "I scattered you where we first kissed.",
      "You left a child who looks like you.",
      "I still hear your laugh. Nowhere.",
      "The funeral flowers were your favorites.",
      "I promised I'd be okay. I lied.",
      "You stopped breathing. I stopped living.",
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


