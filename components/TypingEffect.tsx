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
      "Do you think I have forgotten about you?",
      "Whatever we had, can we just have it again?",
      "Someone stood where you used to lean.",
      "The room stayed colder than usual.",
      "You’d hate how loud everything got.",
      "There’s a dent in the couch cushion still.",
      "The tea stained both cups even though one stayed full.",
      "Your coat still gets caught in the doorframe in my head.",
      "The drawers learned not to open all the way.",
      "The mirror forgets a face each morning.",
      "A toothbrush ages untouched in the glass.",
      "The door creaks like it’s asking where you are.",
      "Shoes untie themselves by the bed you never claimed again.",
      "No one fights me for the warm blanket corner now.",
      "Your umbrella never found the rain again.",
      "The fridge light pauses like it’s waiting for your hand.",
      "The floor remembers your barefoot pattern.",
      "The playlist skips your song on its own.",
      "A ring imprint won’t leave my finger.",
      "Half a photograph curls near the vent.",
      "The plants seem to lean the wrong way lately.",
      "Nobody calls out from the kitchen anymore.",
      "The scarf still smells like a winter that didn’t end.",
      "I park on your side out of habit.",
      "The porch light pretends you’ll come back late.",
      "I left the voicemail unread, again.",
      "The cabinet has one plate less but too much space.",
      "There’s an apology trapped in the walls.",
      "The laundry clings tighter to what’s left.",
      "Your mug got chipped, I blamed the wind.",
      "The chair shifts when I don’t touch it.",
      "Your hoodie sags on the hanger like it knows.",
      "Every drawer holds something that forgot your name.",
      "The light flickers when I say your birthday.",
      "There’s a dent in the mattress, yours.",
      "Your name hides under my tongue some nights.",
      "The clock counts wrong when I think of you.",
      "A cup of coffee cooled beside your empty seat.",
      "The house groans less now. Or more. I can’t tell.",
      "Your slippers moved once. Or maybe I did.",
      "The rain found its way under your window again.",
      "I told the mailman you don’t live here anymore.",
      "I lied to myself and said you’d be late.",
      "The mirror still stretches to fit your height.",
      "The bed isn’t big, but now it’s too wide.",
      "No one argues with the GPS anymore.",
      "You never finished your crossword puzzle.",
      "The neighbors still ask if you’re away.",
      "Your side of the closet sighs.",
      "The wind closed the door I left open for you.",
      "Your cologne ran out slowly, then all at once.",
      "I talk to your voicemail less lately.",
      "The nightstand leans toward your ghost.",
      "That book you hated still has your page folded.",
      "I wore your watch to a place you’d never go.",
      "The lamp turns off like it’s tired of waiting.",
      "I smiled in a photo. You would’ve hated it.",
      "Your laughter stained the walls deeper than paint.",
      "I pretend I don’t see your name on receipts.",
      "A fork goes untouched in the drawer. Yours.",
      "The shower forgets your warmth by now.",
      "Your fingerprints faded where the door used to squeak.",
      "The air conditioner fights a ghost every night.",
      "My jacket still expects your arms around me.",
      "I tripped where you used to wait.",
      "There’s a list I never finished, with your handwriting.",
      "My calendar reminds me when you left.",
      "Your voice got trapped in the last voicemail I saved.",
      "I stopped correcting people when they mention us.",
      "The light turns green, but I don’t drive.",
      "There’s one less spoon in the sink lately.",
      "Your necklace lives in the box I can’t open.",
      "The candles know your birthday better than me now.",
      "I found your ticket stub in a book you hated.",
      "I hum songs you never liked.",
      "I sleep on your side to feel unbalanced.",
      "I folded your sweater wrong. Again.",
      "That movie you loved hurts in new ways now.",
      "I left your slippers where your feet never returned.",
      "I rearranged everything except where you should be.",
      "There’s a note you never finished writing.",
      "The fridge magnets still spell your favorite joke.",
      "You missed the storm you always wanted to watch.",
      "The kettle doesn’t scream like it used to.",
      "The lights flicker when I say your middle name.",
      "The mirror blinked and saw only me.",
      "You left your scent on the pillow for too long.",
      "I say 'we' in stories where only I remain.",
      "I set two plates by mistake. Then I didn’t correct it.",
      "That key you never used still scratches my pocket.",
      "I dream in reruns of the life we faked.",
      "The coat rack leans like it misses your weight.",
      "I don’t water your plant the right way.",
      "Your face won’t leave the corner of the photo.",
      "I wore your hoodie until it didn’t smell like you.",
      "There’s a drawer I can’t open without losing years.",
      "I found a receipt with your name and the date after.",
      "I sent a message to nowhere, again.",
      "Your seatbelt still sticks.",
      "The hall light stays on like it expects you.",
      "I folded your favorite blanket. For no one.",
      "Your ghost doesn’t knock, it walks right in.",
      "Your cereal box expired untouched.",
      "The blinds sway like you passed too fast.",
      "I stopped buying your brand of tea. Mostly.",
      "I found your sock behind the dresser.",
      "I still flinch when the doorbell rings at 8.",
      "The thermostat doesn’t argue with you anymore.",
      "That sweater shrunk. You’d have been mad.",
      "I left your ringtone on. No one's called it.",
      "I opened the box with your letters. Just once.",
      "I forgot what you smelled like. Then remembered.",
      "You’d laugh at what I’ve become.",
      "I lied when I said I threw your things away.",
      "I still say goodnight. Quietly.",
      "There’s a bruise where your hand used to rest.",
      "You didn’t say goodbye. So I say it daily.",
      "I framed a photo you hated. I think it misses you.",
      "There’s a pencil you bit still in the drawer.",
      "I almost washed your scent off the scarf.",
      "The sky rained just once on your birthday.",
      "I made your recipe. It didn’t taste like anything.",
      "Your comb still clutches a strand.",
      "There’s a sweater you never finished knitting.",
      "The fan hums a song you hummed better.",
      "I kept your toothbrush. I’m sorry.",
      "I still expect your key in the lock at 6.",
      "You took the argument with you. I lost anyway.",
      "Your charger lives in the socket like a scar.",
      "I bought your favorite chips. I didn’t eat them.",
      "I keep one of your texts unread.",
      "There’s a receipt from our last fight in my coat.",
      "The sink ran for two. It only needed one.",
      "I held your cup. It didn’t feel empty.",
      "The walls forgot your laughter but not the dent.",
      "You left your shadow in the hallway.",
      "I sing your part in the song. Off-key.",
      "I walked past your favorite aisle. Twice.",
      "The mirror cracked. Just once. Over your spot.",
      "I asked about you out loud. No one answered.",
      "There’s a letter you never meant to send.",
      "You left one earring in the soap dish.",
      "I still flinch when I smell your shampoo.",
      "Your voice still finishes my sentences sometimes.",
      "There’s a dent on the pillow where memory sleeps.",
      "Your number lives in a phone I don't use.",
      "The curtains still open the way you left them.",
      "That clock stopped when you left. I never fixed it.",
      "I still check your horoscope.",
      "Your old hoodie fits like a bad memory.",
      "There’s a draft where you used to stand.",
      "You left the light on once. It stayed on.",
      "That sweater got your perfume trapped in the sleeves.",
      "The stairs creak where you’d skip a step.",
      "I miss your sneeze in allergy season.",
      "Your name doesn’t feel like mine anymore.",
      "You left lipstick on the wineglass. I washed around it.",
      "Your shoes gathered dust faster than expected.",
      "The remote lands on your channel like a ritual.",
      "I blamed the wind for the door closing too hard.",
      "You taught me how to lose you slowly.",
      "The lamp beside your bed hasn’t moved.",
      "I still check the weather where you don’t live.",
      "Your cereal turned stale waiting.",
      "I kept your voicemail password. Just in case.",
      "The mug cracked where your lip used to touch.",
      "You forgot your charger. I didn’t.",
      "There’s an indentation in the mattress that never healed.",
      "I wrote your name in steam. It faded.",
      "The blanket won’t fold the way you did it.",
      "Your drawer jammed. It still does.",
      "The last time you laughed here shook the window.",
      "I read your book upside down, just to feel wrong.",
      "Your birthday gift still waits in the drawer.",
      "The playlist skips your song like it remembers the pain.",
      "The wind knocks twice like it used to be you.",
      "You used to hum at this hour.",
      "The fridge stopped humming the day you left.",
      "I still look at the seatbelt expecting to click two.",
      "I kept the movie stub, even though we walked out early.",
      "The keychain you hated still guards my spare key.",
      "I never liked that restaurant. But I miss it now.",
      "I forget to breathe when I see your sweater.",
      "I left your name on the Wi-Fi.",
      "The guest list still has one unchecked name.",
      "That day never turned into night properly.",
      "You left mid-sentence. The room finished it badly.",
      "The streetlight flickers on your corner.",
      "The quilt has a fold where your knees bent.",
      "I slept facing the wrong way. And it felt right.",
      "You taught me how not to wait. I still do."
    ],
    []
  );
  
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * messages.length));
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
          setCurrentIndex(Math.floor(Math.random() * messages.length));
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
