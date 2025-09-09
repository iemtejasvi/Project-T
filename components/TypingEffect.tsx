"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";

const TypingEffect: React.FC = () => {
  const messages = useMemo(
    () => [
      "Never got used to your name not showing up in birthdays.",
      "The jam you loved expired quietly.",
      "You smile was the prettiest.",
      "Your name sounded wrong in someone else's story.",
      "No one refills the sugar jar you always emptied.",
      "The chair you hated still squeaks for no reason.",
      "Your handwriting still lives on the whiteboard we forgot to clean.",
      "No one says bless you the way you did.",
      "The bed's colder than the weather says it should be.",
      "Found your strand of hair in the old jacket.",
      "Nobody argues with me when I'm wrong now.",
      "That one spoon you bent is still in the drawer.",
      "The socket you hated still sparks sometimes.",
      "No one calls the dog by your nickname.",
      "The mirror fogs up slower now.",
      "No one sings in the shower anymore.",
      "The knife you sharpened still cuts best.",
      "The pen you chewed doesn't write anymore.",
      "Found your doodles behind the notebook's last page.",
      "Every yellow car still gets a second glance.",
      "Your notes in the margins outshine the story.",
      "The chipped bowl sits untouched like it's sacred.",
      "The last thing you touched still has your print.",
      "No one double-knocks like you used to.",
      "Your laughter's louder in my head than it ever was out loud.",
      "Your initials are still carved on the old bench.",
      "Nobody switches off the light like you used to.",
      "Your plants lean toward the door more than the sun.",
      "That bench at the lake still creaks the same way.",
      "Still check the weather in your city.",
      "The teabag you liked expired a month ago.",
      "Found your sweater and it's still warmer than mine.",
      "The rug you tripped on is still crooked.",
      "The hoodie still smells like you but fainter now.",
      "The ringtone you picked still startles me.",
      "No one answers the house phone anymore.",
      "That last voicemail is still unread.",
      "Still save a seat sometimes just in case.",
      "The corners of our photos curled up and time did that.",
      "Still pause when someone asks who I'm texting.",
      "The last bookmark you placed is still on page 47.",
      "No one corrected my pronunciation like you did.",
      "The stairs still creak where you used to sit.",
      "The couch still dips on your side.",
      "The receipt in your jeans had a date I won't forget.",
      "A stranger wore your sweater and had to look twice.",
      "The last hug still lingers like static.",
      "Your half of the bed stays colder no matter the season.",
      "The bookshelf sags where your stories lived.",
      "No one changes the channel during ads anymore.",
      "You taught me how not to wait and I still do.",
      "Passed your street, prayed a car would take me with it.",
      "The window sticks the way you hated, I leave it that way.",
      "Even knives feel softer than living without you.",
      "The trash still has the wrapper from your last snack here.",
      "Every night I lie on your side of the bed, daring the ceiling fan to fall on me.",
      "Your hands held promises, your mouth held knives.",
      "Your ghost eats better than I do these days.",
      "The dog stopped waiting at the gate; even it gave up.",
      "The faucet drips slower, as if the house is holding its breath.",
      "I'd drink the ash if you burned in front of me.",
      "Even my bones would break gladly if you held the pieces.",
      "The bus pulled in, same stop, just no reason to get off.",
      "The day you left still hasn't finished.",
      "My veins itch for endings my mind won't say out loud.",
      "I don't want heaven, I want your skin on mine even in hell.",
      "Every cut I take feels holy if it's for you.",
      "Rain smells like promises you didn't keep.",
      "I rip open old photos like I deserve the cut.",
      "The dust on your side of the bed never gets wiped.",
      "If you asked, I'd carve my chest open for proof.",
      "I keep your number so I know exactly who I'll never call.",
      "Even my demons bow when you appear.",
      "Every second without you tastes like rust.",
      "Bet, even dog forgot your scent.",
      "The clock melts into the floor, tired of counting my breaths.",
      "The mirror still has your fingerprints, smudged and fading.",
      "I keep your old bandaid in the corner of my wallet.",
      "Heard our song in a store, no one noticed me stop breathing.",
      "I'd crawl through rusted nails if your voice waited on the other side.",
      "Wild how the chair remembers you more than I do.",
      "The hoodie you left still smells like regret and cigarettes.",
      "The couch dips where your weight used to lie, even now.",
      "Your mug is still on the counter.",
      "The dog waits by the door for a hand that never returns.",
      "Every night feels like you died again.",
      "The pills on my desk look more like you every night.",
      "Your eyes still burn through every crowd I see.",
      "You swore forever, then left me bleeding in it.",
      "Your jacket still hangs by the door, I walk around it.",
      "I'd drink poison if your lips left it behind.",
      "Even your empty shampoo bottle feels heavier than me now.",
      "Some nights I wonder if choking on your name would finally kill me.",
      "Your favorite spot on the balcony stays cold and empty.",
      "Your perfume bottle's empty, so I inhale the cap like poison.",
      "The mirror shows me your ghost behind my face.",
      "My skin only makes sense under your hands.",
      "The hallway smells faintly like the jacket you never returned.",
      "I'd crawl through glass if it ended at you.",
      "If I disappear, at least I'll finally match the way you left me.",
      "Every day alive feels like stealing from the grave.",
      "Your voicemail sits unread, like I can't face hearing you.",
      "Do you think I have forgotten about you?",
      "The dog waits by the door, but you'll never return.",
      "I'd rather starve than taste food you'll never share again.",
      "My ribs feel empty where your arms used to cage me.",
      "Sat at our table, the waiter didn't even blink.",
      "Even breathing feels like betraying you.",
      "Your goodbye still drips in my ears.",
      "The cafe spelled my name wrong, you're not here to laugh.",
      "If you kill me, make it slow so I can watch you longer.",
      "Even your broken bobby pin is still stuck in my carpet.",
      "My ribs only cage the thought of you.",
      "I'd let the world starve if it fed you once more.",
      "You ruined me, but I crave the ruin.",
      "I don't want life, I want you.",
      "I'd burn cities if it meant warming your hands once.",
      "The mirror spits at me for trying to look alive.",
      "I still check the mirror before bed, like you'll see me.",
      "If you drown, I'll tie stones to my feet just to follow.",
      "My chest ain't lungs anymore, just graves.",
      "Even my hands flinch like they remember holding you.",
      "Your name will be the last sound in my throat.",
      "Your shoes gather dust but I can't throw them away.",
      "The pen you dropped is still in my pocket.",
      "Losing you wasn't one day, it's every damn day.",
      "Even my death would be a gift if you asked for it.",
      "You're the scar I'd reopen forever.",
      "Loving you is the only thing I never regret.",
      "Every sip burns because you'll never taste it again.",
      "The door doesn't creak anymore, but I still pause before entering."
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
    <div className="min-h-[3rem] overflow-hidden text-center text-lg sm:text-xl md:text-2xl font-serif font-light italic text-[var(--text)]/45 transition-all duration-700 whitespace-pre-wrap break-normal leading-relaxed tracking-wide">
      <span className="opacity-30 text-[var(--text)]/25 select-none">&ldquo;</span>
      <span className="relative">
        {displayText}
        <span className="inline-block w-0.5 h-4 bg-[var(--text)]/25 ml-1 animate-pulse"></span>
      </span>
      <span className="opacity-30 text-[var(--text)]/25 select-none">&rdquo;</span>
    </div>
  );
};

export default TypingEffect;
