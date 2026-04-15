"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";

interface TypingEffectProps {
	className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ className }) => {
  const messages = useMemo(
    () => [
      // — DEATH (20) —
      "the nurse asked me to stop holding you so tightly",
      "they pulled the white sheet over your face too fast",
      "i still have your last prescription sitting on the counter",
      "you were warm when i got there but not breathing",
      "the doctor said your time of death and i screamed",
      "i keep refreshing your instagram like you might post again",
      "the mortician asked me if you liked wearing your ring",
      "your phone still rang four times before it stopped forever",
      "i washed your blood out of my shirt this morning",
      "the icu machine beeped once then nothing then just silence",
      "they found you with my photo still open on screen",
      "i signed the papers to donate your eyes to strangers",
      "your body was cold but your watch was still ticking",
      "i got the call while ordering your favorite takeout meal",
      "you flatlined to the sound of the hallway television playing",
      "i carried your ashes home in a box this small",
      "the funeral home spelled your middle name wrong on everything",
      "you died on a tuesday and the weather was perfect",
      "i told the paramedics your allergies before remembering you died",
      "the hospital sent your final bill to our home address",

      // — LOVE (20) —
      "i memorized every single freckle on your face while sleeping",
      "you laugh and the whole room forgets it was sad",
      "i would learn every language just to love you better",
      "your voice is the only sound that makes silence jealous",
      "i fell in love with you mid sentence last tuesday",
      "you make even the ugly parts of me feel chosen",
      "i love you the way lungs love their first breath",
      "your name is the only prayer my heart keeps saying",
      "i found god the first time you looked at me",
      "you could burn this city and i would hand matches",
      "loving you is the single bravest thing i ever did",
      "i want to grow old and forget everything but you",
      "the way you say my name rewrites my entire history",
      "i am so in love with you it terrifies me",
      "you are the only plot twist i never saw coming",
      "when you sleep i count your breaths like tiny prayers",
      "i wrote your name in wet cement and meant forever",
      "every love song ever written was secretly just about you",
      "you smiled at me once and i have never recovered",
      "i love you like the tide loves the stubborn shore",

      // — MISSING EX (20) —
      "your side of the bed still smells like your shampoo",
      "i accidentally liked your photo from forty seven weeks ago",
      "the pizza place still asks if i want your usual",
      "i heard our song at the gas station and froze",
      "your mom still texts me happy birthday every single year",
      "i found your netflix profile still logged in on mine",
      "the dog sits at the door every day at six",
      "your razor is rusting in the shower and nobody cares",
      "i still accidentally order two coffees every single stupid morning",
      "your number is still the one my fingers type first",
      "the passenger seat is still pushed back to your setting",
      "the landlord keeps asking when you are coming for mail",
      "i found your grocery list still crumpled in my jacket",
      "your favorite mug is still sitting in the cabinet untouched",
      "the spotify algorithm still thinks we are a happy couple",
      "i drove to your apartment on autopilot again last night",
      "your emergency contact at my doctor is still your name",
      "i saw someone wearing your exact jacket and i followed",
      "the pharmacy called to say your prescription is ready again",
      "i still sleep on my half like yours is taken",

      // — REGRET (20) —
      "i should have run to the gate before it closed",
      "the last text i ever sent you was just okay",
      "i hung up the phone not knowing it was final",
      "you asked me to stay and i grabbed my keys",
      "i rehearsed the perfect apology but you changed your number",
      "the unsent draft in my email is four years old",
      "i was going to propose that thursday but i hesitated",
      "you begged me to fight for you and i froze",
      "i saw the signs and chose to look away instead",
      "the plane ticket i never used expired on your birthday",
      "i typed i love you then deleted it for good",
      "you said please just once and i still said no",
      "i showed up at your door a whole year late",
      "the right words came to me on the drive home",
      "i left you on read the night you needed me",
      "you asked do i love you and i said maybe",
      "i had the ring in my pocket and said nothing",
      "the voicemail you left that night is still saved here",
      "i picked my pride and lost everything else that mattered",
      "you reached for my hand and i put mine away",

      // — GRIEF/LOSS (20) —
      "i set your place at the table again on christmas",
      "your voicemail greeting is the only recording of your voice",
      "the grief hit me today in the cereal aisle again",
      "i celebrated your birthday alone at our spot like always",
      "it has been three years and your coat still hangs",
      "the morning after you died the birds still sang outside",
      "your plants are still alive and you are not somehow",
      "i still buy your brand of toothpaste out of habit",
      "someone else has your apartment now with different colored curtains",
      "the world kept spinning the exact same day you stopped",
      "your handwriting on the fridge note is slowly fading away",
      "the empty chair still gets bumped when people walk past",
      "i drove past the hospital and had to pull over",
      "three christmases now and i still almost wrap your gift",
      "the year you died the garden grew without anyone watering",
      "i found your hair on my coat from before everything",
      "your side of the closet still smells exactly like you",
      "the anniversary of the worst day came on a sunday",
      "i still say goodnight out loud even though nobody answers",
      "mother's day comes every year and i still fall apart",

      // — BETRAYAL (20) —
      "i found the second phone taped behind the nightstand drawer",
      "your location said her apartment while you said work trip",
      "she called you baby in a text i accidentally saw",
      "you came home smelling like a perfume i never owned",
      "i recognized her handwriting on the note inside your wallet",
      "you said you were alone but i heard her laugh",
      "the hotel charge showed up on our shared bank statement",
      "you proposed to me the same week you kissed her",
      "i found earrings in your car that were not mine",
      "you taught our daughter to keep your secret from me",
      "you looked at me at the altar already knowing everything",
      "i found the messages because you forgot to log out",
      "you gave her the exact necklace you promised to me",
      "you bought two valentine dinners and only one was mine",
      "she knew my name and my face and my birthday",
      "you cried and said it meant nothing but it did",
      "you whispered her name in your sleep and i heard",
      "the truth came from a stranger in my own inbox",
      "our wedding photos were still up when her text came",
      "you had a whole life i was not part of",

      // — FAMILY (20) —
      "mom set your plate at dinner for twelve years straight",
      "dad came to my wedding but sat in the back",
      "i learned to ride a bike from a youtube video",
      "you left before i was old enough to remember why",
      "the custody judge asked who i loved more on record",
      "i called you mom once and you looked away fast",
      "the teacher asked about my dad and i invented one",
      "your new family got the version of you i needed",
      "i have your last name but nothing else from you",
      "the nursery has been painted and empty for two years",
      "you went to her daughter's play instead of my graduation",
      "i googled how to tie a tie on father's day",
      "you told your new wife things you never told mom",
      "my sister got the love and i got the leftovers",
      "mom died asking for you and you did not answer",
      "the family photo on the wall is missing one face",
      "you promised to come every christmas and never once did",
      "i raised your grandchild and you do not even know",
      "i became a mother and had no one to call",
      "the table has three chairs now and nobody mentions you",

      // — FRIENDSHIP (20) —
      "you started a group chat and left me out completely",
      "i saw you at the store and you looked away",
      "your new best friend posted your birthday party without me",
      "we got matching tattoos and you already covered yours up",
      "ten years of sleepovers and you picked her over me",
      "you told her the secret i only ever told you",
      "i found out about your wedding through a random post",
      "the inside joke we shared showed up on her story",
      "you slowly replaced every memory of me with someone newer",
      "i saw you tag her as your person on instagram",
      "we were supposed to grow old on the same porch",
      "you did not even put me in your bridal party",
      "the friendship bracelet i made you is on her wrist",
      "you unfollowed me on everything and pretended you did not",
      "our bench at the park has someone else's initials now",
      "i texted happy birthday and you left it on read",
      "you became a stranger so slowly i almost missed it",
      "twelve years of us and you could not say goodbye",
      "you laughed at my dream in front of new friends",
      "we planned to travel the world but you took her",

      // — SELF/IDENTITY (20) —
      "nobody noticed the day i finally stopped trying to exist",
      "i deleted all my photos because none looked like me",
      "i faked being fine so long i forgot the difference",
      "the mirror shows someone i have not been introduced to",
      "i do not know who i am without being needed",
      "the person everyone thinks i am does not actually exist",
      "i built a whole personality out of what people wanted",
      "my therapist knows a version of me nobody else does",
      "i have been performing my own life from the outside",
      "the real me left the building and nobody noticed anything",
      "i keep shrinking myself so i do not bother anyone",
      "i rehearse conversations in my head that never actually happen",
      "i apologize for existing and nobody tells me to stop",
      "i lost myself so quietly that even i missed it",
      "everyone has a version of me and none are right",
      "i have been invisible so long i forgot my shape",
      "the only time i feel real is when i cry",
      "i play a background character in every story except mine",
      "i am most alone when i am surrounded by people",
      "i have forgotten what my very own laughter sounds like",

      // — LONGING (20) —
      "i still leave the porch light on hoping you return",
      "i replay the last good day we had every night",
      "i look for your face in every crowded room still",
      "every song on the radio sounds like it knows something",
      "the jacket you left still smells like that one december",
      "i dial your old number just to hear the voicemail",
      "i take the long way home just to pass yours",
      "you exist somewhere right now and i cannot reach you",
      "your last text to me is saved as my wallpaper",
      "every window seat on every flight reminds me of you",
      "somewhere right now you are waking up and forgetting me",
      "i saved every voice note and play them when lonely",
      "all i want is one more ordinary tuesday with you",
      "the empty space next to me at night is yours",
      "i wrote your name in the steam on my mirror",
      "i keep almost texting you then remembering all at once",
      "if i could go back i would stay that morning",
      "the sunset looked exactly like the one we watched together",
      "i still set two alarms because you needed the extra",
      "come find me i am exactly where you left me",
    ],
    []
  );

  const initialMessage = messages[0];

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const [currentIndex, setCurrentIndex] = useState(0);
  // Keep first client render identical to server HTML, then start animation after hydration.
  const [hasHydrated, setHasHydrated] = useState(false);
  const [displayText, setDisplayText] = useState(() => initialMessage);
  const [isDeleting, setIsDeleting] = useState(true);
  const [isMistyped, setIsMistyped] = useState(false);
  const [charIndex, setCharIndex] = useState(() => initialMessage.length);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Randomize on mount (client only) to avoid hydration mismatch
  const hasRandomized = useRef(false);
  useEffect(() => {
    if (!hasHydrated || hasRandomized.current) {
      return;
    }

    hasRandomized.current = true;
    const idx = Math.floor(Math.random() * messages.length);
    setCurrentIndex(idx);
    setDisplayText(messages[idx]);
    setCharIndex(messages[idx].length);
  }, [hasHydrated, messages]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

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
  }, [hasHydrated, charIndex, isDeleting, isMistyped, currentIndex]);

  return (
    <div
      suppressHydrationWarning
      className={
        "min-h-[1.75rem] lg:min-h-[2.5rem] overflow-hidden text-center text-base sm:text-xl md:text-4xl font-serif font-normal text-[var(--text)] whitespace-pre-wrap break-normal hyphens-auto" +
        (className ? " " + className : "")
      }
    >
      {displayText || '\u00A0'}
    </div>
  );
};

export default TypingEffect;
