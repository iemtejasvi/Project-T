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
      "Please come back.",
      "Even if you called 6 months later at 3 a.m., I'd still answer.",
      "You’d love the rain today.",
      "The streetlight blinked the way you used to.",
      "It's still the same song in that cafe.",
      "Nothing feels full anymore.",
      "You would’ve hated the new furniture.",
      "The window still fogs up like it used to.",
      "I never moved the second glass.",
      "The coat you liked is still in season.",
      "The train still waits too long at your stop.",
      "They changed the name of that bar.",
      "There’s a new street sign near your old place.",
      "I sat in the wrong seat again today.",
      "The bus driver still doesn’t smile on Thursdays.",
      "Even the sky looks unsure lately.",
      "Someone wore your jacket today.",
      "The calendar still thinks it's October.",
      "I never finished that movie.",
      "The sun fell weirdly today.",
      "Nothing fits right anymore.",
      "You’d hate how quiet the nights got.",
      "I keep passing your street by accident.",
      "That stupid mug still leaks.",
      "They finally fixed the elevator.",
      "I still check the second drawer.",
      "The lights flicker like they know something.",
      "The keys don’t sound right without you.",
      "Even my shoes walk differently now.",
      "That shop closed down like we said it would.",
      "I still stand on the left side of the escalator.",
      "You’d laugh at the way I hold my phone now.",
      "The kettle whistles a little earlier lately.",
      "I almost bought two again.",
      "Someone else ordered your drink today.",
      "You’d never let me forget that mistake.",
      "They changed the wrapping paper this year.",
      "The train was late again. You’d call it fate.",
      "It rained and I thought of your umbrella.",
      "There’s a dent on the seat beside me.",
      "You’d hate the new playlist at the diner.",
      "I saw a dog that looked almost like yours.",
      "The traffic light blinked too long today.",
      "They renamed our usual coffee spot.",
      "The picture frame’s still tilted.",
      "That pair of socks still disappear in the wash.",
      "My phone still predicts your name.",
      "You’d hate how long this winter is.",
      "The radio played track five today.",
      "There’s a crack in your favorite mug.",
      "I sat at the wrong table again.",
      "I still fold towels the way you taught me.",
      "They restocked your favorite cereal.",
      "It smells like August again.",
      "That old movie is back in theaters.",
      "There’s dust on your side of the shelf.",
      "You’d hate how the curtains fall now.",
      "Someone wrote your name on a wall.",
      "The sky looked heavy today.",
      "I held the door open too long.",
      "I left the umbrella on your chair.",
      "You’d hate how slow I drive now.",
      "Your cup still sits beside mine.",
      "They lit up the street for no reason.",
      "Even the pigeons looked confused today.",
      "That song came on when I walked in.",
      "The wind pushed like it remembered something.",
      "They painted your building grey.",
      "My shoes squeaked the way you hated.",
      "Your favorite fruit’s finally in season.",
      "There’s a picture of us somewhere still loading.",
      "The air felt borrowed today.",
      "You’d mock the way I stir tea now.",
      "The elevator paused on your floor.",
      "Someone wore your perfume wrong.",
      "The leaves skipped differently this year.",
      "There’s a dent where you used to lean.",
      "That cafe removed your table.",
      "My key still sticks at the door.",
      "The paint’s peeling by your initials.",
      "They opened a bookstore near your street.",
      "The lightbulb above the sink flickers.",
      "I heard your ringtone somewhere else.",
      "The soup boiled too early.",
      "There’s static in your favorite channel.",
      "The hallway felt longer this time.",
      "That same stranger nodded at me again.",
      "I still read that cereal box for fun.",
      "The door creaked just right today.",
      "You’d laugh at the new doormat.",
      "Even the fan sounds unsure now.",
      "The wind pushed the gate open twice.",
      "That record skipped on your favorite part.",
      "Someone dropped your exact keys outside.",
      "The wallpaper peeled at your corner.",
      "That old cat showed up again.",
      "The cereal box had a new puzzle.",
      "Someone had your handwriting on a note.",
      "The bakery smells like you again.",
      "There’s an empty seat at the bar still.",
      "The mirror steamed up faster today.",
      "Even the crosswalk beeped slower.",
      "The toaster burnt it like you warned.",
      "The floorboard squeaked on your step.",
      "I heard our song on a stranger’s phone.",
      "The paint on the bench chipped more today.",
      "You’d roll your eyes at the playlist now.",
      "They still overwater the plants you hated.",
      "The rug curled at your favorite corner.",
      "There’s lint on your old hoodie again.",
      "The street name sounds wrong now.",
      "The heater wheezes like it remembers us.",
      "You’d hate how the fridge hums now.",
      "The taxi turned without asking.",
      "There’s dust where your hand used to be.",
      "The curtains moved without wind.",
      "The pencil broke at the same word again.",
      "I missed the step you always skipped.",
      "Your favorite bus is still never on time.",
      "There’s a smudge on your photo again.",
      "The handle jiggles like it’s looking for you.",
      "They paved over that crack we laughed at.",
      "There’s static when I play your songs now.",
      "The coin you flipped stayed upright today.",
      "The sun came up too fast today.",
      "There’s a book with your name in the spine.",
      "You’d hate how late the post came.",
      "The drawer won’t close again.",
      "Someone else liked your favorite book.",
      "The stairs creaked like it knew a secret.",
      "That picture frame tilted itself again.",
      "The weather feels like waiting.",
      "Your jacket still gets caught on the chair.",
      "The teabag broke before it brewed.",
      "I forgot to water your plant again.",
      "Your pen ran out mid-sentence.",
      "The drawer squeaked like your laugh used to.",
      "Someone stood where you used to lean.",
      "The room stayed colder than usual.",
      "You’d hate how loud everything got.",
      "There’s a dent in the couch cushion still.",
      "The moon looked closer than it should.",
      "The shadows moved like they remembered.",
      "That alley smelled like your cologne again.",
      "The bowl cracked after I set it down.",
      "Your coat slipped off the hook again.",
      "The matches burnt too fast today.",
      "The light buzzed when I turned it on.",
      "The spoon bent the way you warned it would.",
      "The clock paused for a moment too long.",
      "Your sock got stuck in the dryer vent.",
      "Someone walked like you today.",
      "The sky blinked before it rained.",
      "There’s a mark on the wall where your head rested.",
      "You’d roll your eyes at this weather.",
      "That pigeon came back alone again.",
      "The drain still clogs every Sunday.",
      "Your coffee order is on the board still.",
      "The cat waits by your door like clockwork.",
      "Someone wore your old hat wrong.",
      "The lamp buzzed until I turned it off.",
      "There’s a crease in the sheet on your side.",
      "The light stayed green too long.",
      "You’d hate how long I stood there.",
      "The air tasted like burnt toast again.",
      "Even the coins felt colder today.",
      "There’s a flicker in the hallway now.",
      "The mirror cracked near your corner.",
      "The tea cooled before I noticed.",
      "Someone else used your umbrella stand.",
      "That bread went stale too fast again.",
      "The tap dripped like a broken clock.",
      "There’s a fold in the blanket you used.",
      "You’d hate how nothing changed.",
      "The fridge still hums in your key.",
      "The drawer handle is still loose.",
      "That streetlight blinked twice today.",
      "Your note slid behind the shelf again.",
      "The hanger fell with no reason.",
      "There’s lint where your coat used to hang.",
      "Someone parked in your usual spot.",
      "You’d mock how quiet the hallway got.",
      "The breeze pushed the door shut slowly.",
      "The receipt had your date on it.",
      "There’s still a second pillow on the bed.",
      "The pasta boiled over again.",
      "I forgot what day it is again.",
      "Your charger’s still plugged in.",
      "The seatbelt twisted the way you hated.",
      "The bell rang and no one moved.",
      "Someone coughed like you did.",
      "The radio cut out during your song.",
      "There’s a mark on the wall from your ring.",
      "You’d hate how early the sun sets now.",
      "The clock hands lined up at 4:04 again.",
      "That bird outside still pecks at the same time.",
      "Your name popped up in a crossword.",
      "The shoes squeaked when I walked in.",
      "You’d laugh at how empty this feels."
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
