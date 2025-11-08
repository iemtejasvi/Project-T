"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";

interface TypingEffectProps {
	className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ className }) => {
  const messages = useMemo(
    () => [
      "Your birthday still comes, but you don't.",
      "The grocery list still has your handwriting at the bottom.",
      "Your toothbrush dried out months ago but I can't move it.",
      "The pillow on your side still holds the shape of you.",
      "I set two plates down sometimes before I remember.",
      "Your contact name hasn't changed, it's still 'Home'.",
      "The last text you sent still sits at the top, unarchived.",
      "I bought your favorite snack today out of habit.",
      "Your shoes by the door look like they're still waiting.",
      "The song you loved came on and I had to pull over.",
      "I still say 'we' when I mean 'I' now.",
      "Your laugh lives in my voicemail, I play it on bad nights.",
      "The sweater you borrowed is the only one I wear now.",
      "Your half-finished book is still on page 143.",
      "I caught myself saving a funny thing to tell you later.",
      "The coffee you hated is all I drink now.",
      "Your name almost slipped out when someone asked about my day.",
      "The restaurant we loved closed, I felt relieved I didn't have to see it.",
      "Your favorite mug cracked today and I cried for an hour.",
      "I drove past your street just to feel something.",
      "The blanket you always stole is the one I sleep with.",
      "Your scent is fading from the clothes I refuse to wash.",
      "I still text your number knowing it'll never deliver.",
      "The inside jokes we had don't land with anyone else.",
      "Your playlist is the only thing that understands me now.",
      "I found a receipt from our last dinner together.",
      "The plant you got me is dying and I'm letting it.",
      "Your side of the closet is exactly how you left it.",
      "I rehearse conversations we'll never have.",
      "The calendar still marks the day you promised to come back.",
      "Your handwriting on that old note is starting to fade.",
      "I bought tickets to that movie we planned to see.",
      "The jacket you left smells like someone I used to know.",
      "Your favorite song makes me want to drive into traffic.",
      "I still cook for two and throw half away.",
      "The ring you gave me is heavier than my own body.",
      "Your name tastes like blood every time I say it.",
      "I wear your shirt to bed and pretend it's your arms.",
      "The sunset looks wrong without you next to me.",
      "Your memory is a knife I can't stop twisting.",
      "I'd give anything to argue with you one more time.",
      "The bed feels like a coffin without you in it.",
      "Your absence is the loudest thing in every room.",
      "I keep your last voice message like it's oxygen.",
      "The photos of us hurt more than they comfort.",
      "I still look for you in every crowded room.",
      "Your favorite season came and it felt like betrayal.",
      "I'm afraid I'm forgetting the sound of your voice.",
      "The promises we made are ash in my mouth now.",
      "Your ghost is kinder to me than you ever were.",
      "I'd rather drown in missing you than learn to swim without you.",
      "The world kept spinning and it feels obscene.",
      "Your empty chair at dinner screams louder than conversation.",
      "I found your hair tie in my car and sobbed at a red light.",
      "The future we planned is a graveyard I visit daily.",
      "Your favorite flower is in season and I hate every bloom.",
      "I still reach for my phone to call you when good things happen.",
      "The silence where your laugh used to be is deafening.",
      "I'm alive but everything that made me feel it died with you.",
      "Your pillow still smells like you and I'm terrified of laundry day.",
      "I keep having dreams where you come back and apologize.",
      "The stairs remember your footsteps better than I do.",
      "Your favorite sweater is falling apart and so am I.",
      "I still set your birthday as a reminder I'll never need.",
      "The goodbye you gave me wasn't enough to last a lifetime.",
      "Your name is a prayer I whisper into empty rooms.",
      "I'm haunted by the life we were supposed to live.",
      "The ring tone you set for yourself still makes my heart stop.",
      "Your absence is a wound that won't close, won't scar.",
      "I keep your picture in my wallet like a suicide note.",
      "The last place we kissed is a shrine I can't stop visiting.",
      "Your memory is the only thing keeping me from peace.",
      "I'd trade every tomorrow for one more yesterday with you.",
      "The mirror shows me someone you'd no longer recognize.",
      "Your favorite song is my favorite form of self-harm now.",
      "I'm afraid of healing because it means losing you twice.",
      "The sunrise feels like an insult without you here to see it.",
      "Your goodbye was a door that slammed on my fingers.",
      "I collect your memories like other people collect air.",
      "The playlist we made together is the only thing I listen to.",
      "Your name is written in every breath I'm too tired to take.",
      "I visit places we never went hoping to feel you there.",
      "The future is a room I refuse to enter without you.",
      "Your laugh is an echo I chase through empty hallways.",
      "I'm drowning in the space you used to fill.",
      "The stars look dimmer since you stopped pointing them out.",
      "Your favorite hoodie is threadbare from me clinging to it.",
      "I keep your toothbrush like it's evidence of something real.",
      "The promises we made are tombstones in my chest.",
      "Your memory is my favorite way to bleed.",
      "I'd carve your name into my bones if you'd feel it.",
      "The world is too loud without your voice in it.",
      "Your last words play on repeat in my head.",
      "I'm living a life you'll never see and it feels like theft.",
      "Your favorite restaurant sits empty in my phone's saved places.",
      "The goodbye we had wasn't goodbye enough.",
      "I keep waiting for a miracle that looks like you.",
      "Your absence rewrote every definition of loneliness I knew.",
      "I'm afraid of forgetting you and afraid of remembering.",
      "The version of me you loved is buried with you.",
      "Your favorite song came on shuffle and I let it destroy me.",
      "I still sleep on my side of the bed out of habit.",
      "The necklace you gave me is a noose I choose to wear.",
      "Your memory is the only thing that feels like home anymore.",
      "I'd let the world burn if it meant one more minute with you.",
      "The sky hasn't been the same color since you left.",
      "Your name is graffiti on every wall of my mind.",
      "I'm living proof that hearts can break and keep beating.",
      "The last time I saw you is the last time I felt alive.",
      "Your absence is a scar that throbs with every heartbeat.",
      "I keep your number saved as 'Don't Call'.",
      "The promises you made are ghosts I sleep with nightly.",
      "I'd give every tomorrow to relive one yesterday.",
      "Your favorite mug sits unused on the highest shelf.",
      "The playlist you made me is a shrine I worship at.",
      "I'm terrified of the day I stop missing you.",
      "Your memory is the sharpest knife in my drawer.",
      "The sunset we watched together was our last, and I didn't know.",
      "I keep your old t-shirt under my pillow like a security blanket.",
      "Your laugh is archived in my brain but fading fast.",
      "I'd walk through fire if your shadow was on the other side.",
      "The goodbye you gave me is the scar that never healed.",
      "Your name is the password to a life I can't access anymore.",
      "I'm collecting dust in a world that moved on without you.",
      "Your favorite season feels like mockery now.",
      "The bed is a battlefield I lose every night.",
      "Your absence taught me that ghosts don't need to be dead.",
      "I'd trade my future for your past in a heartbeat.",
      "The world is too bright without you here to dim it.",
      "Your memory is my favorite kind of torture.",
      "I keep your last text like it's a sacred text.",
      "The promises we exchanged are chains I drag daily.",
      "Your name is my last thought before sleep claims me.",
      "I'm alive in a world that died when you left it.",
      "Your favorite spot on the couch is a memorial now.",
      "The ring you gave me is heavier than my grief.",
      "I'd let the ocean take me if you were waiting beneath.",
      "Your absence is the loudest silence I've ever heard.",
      "The photograph of us is fading, just like my hope.",
      "I keep your voice message and pretend it's new.",
      "Your memory is the only thing I'm loyal to anymore.",
      "I'd rewrite history if it meant keeping you in mine."
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
    <div className={
      "min-h-[2.5rem] overflow-hidden text-center text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[var(--text)] transition-all duration-300 whitespace-pre-wrap break-normal hyphens-auto" +
      (className ? " " + className : "")
    }>
      {displayText}
    </div>
  );
};

export default TypingEffect;


