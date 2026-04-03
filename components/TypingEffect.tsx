"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";

interface TypingEffectProps {
	className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ className }) => {
  const messages = useMemo(
    () => [
      "do you think i've forgotten about you",
      "i found your suicide note too late",
      "the baby kicked. you were already buried",
      "your heart stopped inside my hands",
      "mom died still waiting for you",
      "the pregnancy test came back. you didn't",
      "i named our dead child after you",
      "you overdosed. i found you cold",
      "our daughter has your dead father's eyes",
      "the crash took you mid-sentence",
      "you died with my name half-said",
      "the nurse held me when you flatlined",
      "i scattered your ashes where we kissed",
      "you were smiling in the crash photo",
      "the paramedic lied. you suffered",
      "i forgave you standing over your casket",
      "your mother still calls me her child",
      "i held your hand. it went cold",
      "the organ donor saved five. not you",
      "your last search: surprise gift ideas",
      "the crib was built. you weren't coming",
      "i whisper goodnight to your ashes nightly",
      "our wedding song makes me pull over",
      "the suicide letter said my name first",
      "your phone still rings. nobody answers it",
      "i found your journal. page one: me",
      "you died before i could say sorry",
      "the dog still waits by the door",
      "i kept your half-eaten candy bar",
      "your cologne ran out. i panic-bought three",
      "i still set your place at dinner",
      "the doctor said months. you had weeks",
      "i read your diary after the funeral",
      "you married her. i watched. smiling",
      "dad never got to meet you",
      "the last voicemail: just you breathing",
      "i visit your grave every tuesday still",
      "i told our son you're just sleeping",
      "the ER doctor couldn't face me after",
      "i never washed your last coffee mug",
      "you died and spring still came anyway",
      "i deleted our photos. then screamed",
      "the hospital called. you refused to see me",
      "i found your wedding vow drafts. seventeen",
      "your handwriting on the fridge: buy milk",
      "i kept the blanket from your deathbed",
      "the answering machine still has your voice",
      "the life insurance felt like blood money",
      "your last words were completely ordinary ones",
      "i found your reasons to stay list",
      "you stopped breathing. i stopped living too",
      "i sleep diagonal. still no room somehow",
      "the baby has your nose. she'll never know",
      "your boots are still by the door",
      "our son drew family. included you in it",
      "i tried your recipe. it tasted like grief",
      "the pharmacy auto-refilled your prescription again",
      "your spotify still plays discover weekly",
      "i wore black for three hundred sixty-five days",
      "your mother blames me. she's probably right",
      "the funeral home asked your favorite color",
      "i talk to your empty chair still",
      "the christmas stocking still has your name",
      "i learned to cook. you'll never taste it",
      "you said see you later. you lied",
      "the dentist office called. i said you moved",
      "i hear your key in the lock. never",
      "the grief counselor cried alongside me today",
      "your favorite mug cracked. i glued it twice",
      "i found your hidden birthday present. for me",
      "you died on a tuesday morning. regular",
      "your gym auto-renewed. i can't cancel it",
      "the barber didn't know. i couldn't say it",
      "i kept every sticky note you wrote",
      "i drive slower now. i understand impact",
      "the pizza place still asks the usual",
      "the garden you planted bloomed without you",
      "i found sand from our last beach",
      "i celebrate your birthday alone. two slices",
      "i still say we when i mean i",
      "the wifi password is still your birthday",
      "your coat still hangs on the hook",
      "i talk about you every therapy session",
      "the mechanic asked when you're bringing the car",
      "i kept the lint from your pockets",
      "your subscriptions keep emailing. i keep reading",
      "the swing set you built still sways",
      "your half of the bed sinks different",
      "i tell your jokes. nobody laughs right",
      "the dry cleaner has your unclaimed suit",
      "i kept your hospital socks. they're blue",
      "your voicemail is my alarm every morning",
      "i sleep on your pillow on bad nights",
      "i found our bucket list. half-checked off",
      "you were my emergency contact. now nobody",
      "the rearview mirror still angled to you",
      "i archive your texts so they won't delete",
      "your sister can't look at me anymore",
      "your charger is still plugged in. waiting",
      "your journal entry that day: feeling good",
      "i replayed your laugh until my phone died",
      "the smoke alarm died. you always fixed those",
      "the couch still has your body's indent",
      "your spare key still under the mat",
      "i kept the pen you always chewed",
      "the hallway still echoes your footsteps somehow",
      "your favorite bench has someone else now",
      "the vet asked about the dog's other parent",
      "she asked about you. i changed the subject",
      "i sleep in your shirt. it's threadbare",
      "you died mid-laugh. most you thing ever",
      "the autopsy report is in my nightstand",
      "i can't watch our home videos anymore",
      "your blood type is still on my phone",
      "your side of the sink is still dry",
      "i kept the hospital wristband. it's fading",
      "the coroner asked me to identify you",
      "i found your letter. it was to me",
      "your toothbrush is dry. i can't move it",
      "the ambulance sirens still trigger me nightly",
      "our anniversary passed. i set the table anyway",
      "you'd be thirty-four today. i bought cake",
      "i wear your wedding ring on my thumb",
      "the nurse asked if i was family. was",
      "your pillow stopped smelling like you last month",
      "i scream into your sweater on bad nights",
      "the child you never met has your laugh",
      "your car keys are still on the hook",
      "the last photo of you is blurry",
      "i iron your shirt every sunday. still",
      "your death certificate is in my sock drawer",
      "the flowers on your grave froze last night",
      "i folded your laundry one final time",
      "your fingerprints are still on the mirror",
      "i found your unsent text to me",
      "the hospital bill arrived after the funeral",
      "i kept our last date's movie tickets",
      "you promised tomorrow. there was no tomorrow",
      "the lock screen is your sleeping face",
      "your best friend stopped calling me too",
      "i flinch when the phone rings at night",
      "the ultrasound photo is still framed. dusty",
      "you crashed while the voicemail was playing",
      "i never told you it was cancer",
      "our song played at your funeral. i screamed",
      "you were already dead when i arrived",
      "i water flowers you will never see",
      "you said forever. lasted seven months",
      "the engagement ring sits in a drawer",
      "i dream you're alive then i wake up",
      "i found your playlist titled: for her",
      "the hospital room number is burned into me",
      "your side of the closet echoes now",
      "i bought two tickets. force of habit",
      "the clock stopped the same hour you did",
      "your mother brought your childhood blanket. sobbing",
      "i called your phone just to hear you",
      "the obituary couldn't fit who you were",
      "your favorite season started without you this year",
      "i kept the medical bills. proof you fought",
      "the priest mispronounced your name at the service",
      "i found your to-do list. i finished it",
      "you died wearing the shirt i bought",
      "the waiting room chairs still haunt me",
      "i talk to your grave in the rain",
      "your dog howled for three nights straight",
      "the neighbors brought casseroles. like that fixes death",
      "i found your glasses under the couch",
      "your handwriting still makes me physically collapse",
      "i kept your boarding pass from our trip",
      "the alarm you set still goes off",
      "your unfinished book sits on the nightstand open",
      "i found us in your search history",
      "the hospital parking garage makes me shake",
      "you were supposed to grow old with me",
      "i set two alarms. yours still rings",
      "the undertaker asked about your smile. i broke",
      "your mother wears your jacket now. every day",
      "i kept your half-written grocery list forever",
      "our street got repaved. you wouldn't know",
      "your inbox has unread messages from me",
      "the therapist said closure. i said there's none",
      "i found your hair on my old coat",
      "your voicemail greeting is my deepest comfort now",
      "the cemetery knows my car by now",
      "i donated your clothes. kept one shirt",
      "we were supposed to try that restaurant",
      "the last normal morning was a tuesday",
      "your coffee mug still has your lip stain",
      "i found your will. i was everything",
      "your perfume bottle is almost empty now",
      "the hospice nurse remembered your name. i cried",
      "i kept your last prescription bottle. empty",
      "our song came on. i pulled over",
      "your handwriting fades a little more each year",
      "the obituary couldn't capture who you were",
      "i still make your coffee every single morning",
      "your side of the garage collects dust now",
      "the coroner's report said time of death: morning",
      "i kept your last grocery receipt. forever",
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
