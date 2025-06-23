"use client";
import React, { useState, useEffect, useMemo } from "react";

const TypingEffect: React.FC = () => {
  const messages = useMemo(
    () => [
      "Didn't answer the knock. Hoped it was you, then hoped it wasn't.",
      "Left your contact in favorites. Nothing else stayed.",
      "Never got used to your name not showing up in birthdays.",
      "That mirror blinked. Swore it saw two.",
      "Passed the station we missed on purpose. Nothing's changed.",
      "Used your blanket during the storm. It didn't help.",
      "No one closes the cupboard you used to argue with.",
      "Tried to clean your shoes. They stopped looking like yours.",
      "Your side of the closet stopped complaining when it got too empty.",
      "The jam you loved expired quietly.",
      "Used your words in a fight and lost twice.",
      "Waited for a reply longer than anyone should.",
      "Someone mentioned your smile like it wasn't borrowed from here.",
      "You smile was the prettiest.",
      "Your name sounded wrong in someone else's story.",
      "Watched someone wear your shoes. The ground didn't take them right.",
      "The clock still runs late, like it's hoping you'll catch up.",
      "Your name is still the only one I scroll past slower.",
      "Everything stayed, except the part that felt like home.",
      "No one refills the sugar jar you always emptied.",
      "Your books still sit alphabetized, except the one you last held.",
      "The chair you hated still squeaks for no reason.",
      "The fridge still hums like it's trying to say something.",
      "Pulled out your mug. Put it back. Did that twice.",
      "Your slippers moved. No one claims them.",
      "Your ringtone played in a movie. Everyone else kept watching.",
      "The door doesn't creak anymore. That's worse.",
      "Your handwriting still lives on the whiteboard we forgot to clean.",
      "Avoided the cereal aisle. Didn't work.",
      "Every thunder feels like you're about to text.",
      "The towel you left is softer now. Can't explain why.",
      "Your email's still logged in. I just don't touch it.",
      "Ate at your favorite place. Nothing had taste.",
      "Laughed too hard. Regretted it right after.",
      "Ran into someone with your perfume. Froze mid-step.",
      "The lamp flickered. Almost said your name.",
      "Your playlist played on shuffle. Felt like sabotage.",
      "The corner of your photo curled up, like it gave up too.",
      "Didn't throw away the ticket. Still don't know why.",
      "No one says bless you the way you did.",
      "The bed's colder than the weather says it should be.",
      "Found your strand of hair in the old jacket.",
      "No one fixes the Wi-Fi. You used to yell at it first.",
      "Left your seatbelt clipped in. It feels occupied.",
      "Still knock on the door before remembering.",
      "Deleted your texts. Still remember the typos.",
      "Nobody argues with me when I'm wrong now.",
      "Got a postcard. Read it with your voice.",
      "The raincoat's dry. Somehow still feels wet.",
      "Kept the plant you named. It's surviving, not growing.",
      "That one spoon you bent is still in the drawer.",
      "TV volume stays at your number. Can't change it.",
      "The laundry's done. Yours still smells louder.",
      "Every nap ends earlier than it should.",
      "Tried your recipe. Burned twice.",
      "Wrote a joke you'd laugh at. Folded the paper.",
      "The socket you hated still sparks sometimes.",
      "Birthday came. Bought nothing.",
      "The bulb flickered like it was trying to say your name.",
      "Left the extra key under the mat. Just in case.",
      "No one calls the dog by your nickname.",
      "Tried your coffee order. Got everything right. Still wrong.",
      "The ice tray stays full. No one uses it your way.",
      "Found your jacket. Didn't smell like you. That hurt worse.",
      "Saw your favorite actor win something. Turned it off.",
      "The mirror fogs up slower now.",
      "Looked out the window longer than I meant to.",
      "Used to count steps till your door. Still remember the number.",
      "No one sings in the shower anymore.",
      "The old playlist paused halfway through your song.",
      "The knife you sharpened still cuts best.",
      "Heard your laugh in a crowd. Followed it.",
      "The umbrella we bought is still broken. Haven't fixed it.",
      "The cat waits by the door. Like it knows something I don't.",
      "Stared at the moon like it owed me an answer.",
      "You hated Mondays. Now I do too.",
      "Opened a message. It wasn't from you. Felt like a trick.",
      "That pillow you flattened still doesn't rise.",
      "The floorboard you tripped on still groans in the same spot.",
      "Your contact's still pinned. For no reason now.",
      "The pen you chewed doesn't write anymore.",
      "The charger we shared doesn't reach far enough.",
      "Ate the candy you hid. It felt like betrayal.",
      "Still say your quote before sleeping. Out loud sometimes.",
      "Found your doodles behind the notebook's last page.",
      "Every yellow car still gets a second glance.",
      "The backseat feels emptier than it should.",
      "Our song came on shuffle. Let it play. Just once.",
      "The clock's battery died. Didn't replace it.",
      "The lighter you left still sparks. Didn't expect that.",
      "Your notes in the margins outshine the story.",
      "The chipped bowl sits untouched. Like it's sacred.",
      "The drawer jammed again. Didn't fix it this time.",
      "The last thing you touched still has your print.",
      "The cold water feels colder now.",
      "Left the porch light on. Not for hope. Just habit.",
      "The dishes pile up slower now. Still pile up.",
      "Your scarf's still where you left it. Didn't touch it.",
      "No one double-knocks like you used to.",
      "The song ended. Didn't press replay.",
      "Your laughter's louder in my head than it ever was out loud.",
      "Every shortcut I take avoids your street.",
      "Your photo fell. Didn't put it back.",
      "Walked into a room and forgot what I was looking for. Again.",
      "The backspace key is worn out. You'd laugh at that.",
      "Your initials are still carved on the old bench.",
      "Still sleep on one side. Yours.",
      "The elevator still dings at our floor even when no one's there.",
      "Passed a bakery. Smelled your favorite. Kept walking.",
      "Nobody switches off the light like you used to.",
      "Your plants lean toward the door more than the sun.",
      "The remote still skips channels. You liked that.",
      "That dress you liked still fits. Never wore it again.",
      "Bought your favorite snack. Threw it out unopened.",
      "Your old playlist plays itself at 3 a.m.",
      "Laughed at a meme. Reached for your name. Paused.",
      "Poured two cups by mistake. Again.",
      "Put your charger in the drawer. Then took it out.",
      "That bench at the lake still creaks the same way.",
      "The door still hesitates when it shuts. Just like you.",
      "The lighter you left still works. Burns a bit too much.",
      "The train slowed down at your stop. Didn't look.",
      "Still check the weather in your city.",
      "The teabag you liked expired a month ago.",
      "No one changes the wall clock batteries. Like it matters.",
      "Found your sweater. It's still warmer than mine.",
      "Looked up your hometown during a quiz. Didn't answer.",
      "Didn't open the package. It had your handwriting.",
      "The vending machine ate my coin. You'd know what to say.",
      "Typed your name by accident. Didn't hit send.",
      "Your toothbrush is still in the holder. No one moved it.",
      "Your birthday alarm stayed on. Didn't turn it off.",
      "That movie came out. Didn't go.",
      "Said your catchphrase out loud. Just once.",
      "The rug you tripped on is still crooked.",
      "The hoodie still smells like you. Fainter now.",
      "Your socks still show up in laundry. They don't match anything.",
      "Burned toast. You'd have eaten it anyway.",
      "The doormat still curls up on the edge. You hated that.",
      "Used your sarcasm today. Got quiet after.",
      "Drew a heart in the fog. Wiped it fast.",
      "The traffic light held red longer at your crossing.",
      "The ringtone you picked still startles me.",
      "The alarm tone you set plays every morning. Didn't change it.",
      "No one answers the house phone anymore.",
      "That last voicemail is still unread.",
      "Opened your old sketchbook. Forgot how good you were.",
      "Still save a seat, sometimes. Just in case.",
      "The corners of our photos curled up. Time did that.",
      "Heard your favorite line in a song. Didn't finish it.",
      "Waited three rings before ending the call. Again.",
      "Folded your T-shirt. Didn't put it away.",
      "Tried the movie we skipped. Didn't finish it.",
      "Still pause when someone asks who I'm texting.",
      "Found a text draft with your name. Left it there.",
      "Scraped my knee. You'd laugh. I did too. Then didn't.",
      "The seatbelt on your side locks more now. Like it misses weight.",
      "The last bookmark you placed is still on page 47.",
      "No one corrected my pronunciation like you did.",
      "The password's still your name. Couldn't change it.",
      "The stairs still creak where you used to sit.",
      "Checked the group chat. You haven't typed in years.",
      "The couch still dips on your side.",
      "The receipt in your jeans had a date I won't forget.",
      "The ceiling fan makes that sound again. You'd roll your eyes.",
      "The switchboard still flickers. You'd smack it.",
      "A stranger wore your sweater. Had to look twice.",
      "The photo booth picture still fades. Didn't frame it.",
      "The last hug still lingers like static.",
      "Your half of the bed stays colder, no matter the season.",
      "The bookshelf sags where your stories lived.",
      "No one changes the channel during ads anymore.",
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
    <div className="min-h-[2.5rem] overflow-hidden text-center text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[var(--text)] transition-all duration-300 whitespace-pre-wrap break-normal hyphens-auto">
      {displayText}
    </div>
  );
};

export default TypingEffect;
