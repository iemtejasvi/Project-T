"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";

interface TypingEffectProps {
	className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ className }) => {
  const messages = useMemo(
    () => [
      "You would have loved this rain.",
      "Are you gonna return?",
      "Do you still read my drafts?",
      "Would you answer if I called?",
      "Do you still wear my hoodie?",
      "Your toothbrush still waits. Coming back?",
      "Should I stop saving your seat?",
      "Does rain taste better where you are?",
      "Would you forgive me if I begged?",
      "Are you done pretending I mattered?",
      "Would you notice if I vanished?",
      "Who laughs at your bad jokes now?",
      "Dating the silence I sent now?",
      "Will the moon tell you I cried?",
      "Is your new love already bored?",
      "Would you erase me given the chance?",
      "Does she know your coffee order?",
      "Are you ignoring fate or me?",
      "Would you burn the letters I kept?",
      "Did my name survive your purge?",
      "Is there room for me tonight?",
      "Why is your phone still off?",
      "Are you proud of this wreckage?",
      "Do your friends know I'm alive?",
      "Would you still call me home?",
      "Are you scared of loving again?",
      "Should I return your old secrets?",
      "Do you still flinch at us?",
      "Have you told them about our ghosts?",
      "Would you ever undo goodbye?",
      "Did you replace me in the mirror?",
      "Who gets your half-awake confessions now?",
      "Does your pillow still miss me?",
      "Did the dog stop waiting afternoons?",
      "Do you still twitch hearing my name?",
      "Are the neighbors asking about me?",
      "Did you repaint over our fight?",
      "Who wears the ring you pawned?",
      "Do you delete me every morning?",
      "Did her kiss taste like surrender?",
      "Are you keeping score of goodbyes?",
      "Do you still dream in my colors?",
      "Would you admit I was right?",
      "Are you softer without my spine?",
      "Did you ever read my letter?",
      "Does the ocean still mock you?",
      "Did your mother keep my photo?",
      "Who sings you down from panic?",
      "Did you stitch up your conscience yet?",
      "Will you ever stop rehearsing lies?",
      "Do you still bruise like promises?",
      "Is your silence finally satisfied?",
      "Who forgives you after midnight now?",
      "Did you bury the sweater I loved?",
      "Did your therapist mention my name?",
      "Does she know about the motel?",
      "Did you tell them about December?",
      "Are you still allergic to honesty?",
      "Will you ever mail my closure?",
      "Did loneliness taste how you expected?",
      "Are you warming someone else's hands now?",
      "Did your heart ever clock in?",
      "Were you scared when dawn arrived?",
      "Did you toast to my absence?",
      "Who catches your restless pacing now?",
      "Did you keep the cracked mug?",
      "Is the mirror kinder without me?",
      "Did you finally sleep through storms?",
      "Who plays translator for your moods?",
      "Did the city forgive your leaving?",
      "Do you still check my status?",
      "Did you block me for good?",
      "Are your nights quieter than mine?",
      "Did you confess to the ceiling?",
      "Who steals covers on your couch?",
      "Did you unpack the guilt yet?",
      "Are your playlists still haunted?",
      "Did you relearn how to hope?",
      "Who holds your secrets hostage now?",
      "Did you delete our shared calendar?",
      "Are you still allergic to apologies?",
      "Did you ever open my voicemail?",
      "Who laughs at your worst jokes?",
      "Did you keep the cinema stubs?",
      "Are you better at goodbyes now?",
      "Did your nerves stop saying please?",
      "Who calms your hurricane brain?",
      "Did you fix the crooked frame?",
      "Are you still running from Sunday?",
      "Did you teach her our handshake?",
      "Who drinks your burnt coffee now?",
      "Did you heal the door you slammed?",
      "Are you counting my mistakes nightly?",
      "Did your lungs forgive our smoke?",
      "Who maps your freckles these days?",
      "Did you water the dying fern?",
      "Are you still chasing distant thunderstorms?",
      "Did you invite loneliness to stay?",
      "Who traced the scar on Friday?",
      "Did you abandon our shared password?",
      "Are you still hoarding unsent drafts?",
      "Did the bed forget my shape?",
      "Who tempers your temper lately?",
      "Did you silence the alarm entirely?",
      "Are you kinder when nobody watches?",
      "Did you erase my birthday reminder?",
      "Who steals fries off your plate?",
      "Did you return the borrowed book?",
      "Are your walls tired of apologies?",
      "Did you repaint over our measurements?",
      "Who untangles your restless hair?",
      "Did the mirror tell you anything?",
      "Are you bored with her patience already?",
      "Did you delete the playlist name?",
      "Who handles you when you're feral?",
      "Did you finally call your father?",
      "Are you hiding in bar bathrooms?",
      "Did nostalgia answer your drunk texts?",
      "Who unlocked your midnight sobbing?",
      "Did you learn to be gentle?",
      "Are you still allergic to metaphors?",
      "Did our ghosts rearrange your furniture?",
      "Who counts your scars backwards?",
      "Did the summer forgive your absence?",
      "Are you still chasing new disasters?",
      "Did you mail back my heartbeat?",
      "Who explains your moods to strangers?",
      "Did the cat stop sleeping doorfront?",
      "Are you still rehearsing last lines?",
      "Did goodbye feel like vacation time?",
      "Who do you blame for weather?",
      "Did you teach her our safe word?",
      "Are your hands still shaking nightly?",
      "Did the neighbor return your spare?",
      "Who reminds you to eat breakfast?",
      "Did you quit loving on credit?",
      "Are you proud of that silence?",
      "Did you tattoo over my initials?",
      "Who edits your late-night drafts?",
      "Did you finally burn the note?",
      "Are you done practicing forgiveness yet?",
      "Did the mirror flinch seeing you?",
      "Who keeps your seat warm Sundays?",
      "Did you find god in traffic?",
      "Are you still allergic to softness?",
      "Did the stars gossip about us?",
      "Who reads your mind in elevators?",
      "Did you replace the broken lamp?",
      "Are you chasing echoes down hallways?",
      "Did regret ever text you back?",
      "Who shares cigarettes behind diners?",
      "Did the barstool miss me too?",
      "Are you still pocketing apologies?",
      "Did your shadow confess everything?",
      "Who keeps your monsters entertained?",
      "Did you memorize my new silence?",
      "Are you counting heartbeats or exits?",
      "Did the moon answer your voicemails?",
      "Who talks you off rooftops?",
      "Did you finally cry on purpose?"
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


