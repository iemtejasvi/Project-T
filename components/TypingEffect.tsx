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
      "I kept your toothbrush. It's dry now.",
      "You died on a Tuesday morning.",
      "The house still smells like you.",
      "I told our son you're sleeping.",
      "Your side of the closet echoes.",
      "The ER doctor couldn't look at me.",
      "I wear your ring on my thumb.",
      "You left mid-argument. Permanently.",
      "The crib was already built. You weren't.",
      "I talk to your pillow at night.",
      "Your handwriting still makes me collapse.",
      "I found your will. I was everything.",
      "The dog still waits by the door.",
      "You died with my name. Half-said.",
      "I carry your ashes in a locket.",
      "The nurse held me when you flatlined.",
      "Our wedding song makes me pull over.",
      "I never washed your last coffee mug.",
      "You were smiling in the crash photo.",
      "I tell strangers about you. Present tense.",
      "The grief counselor cried with me today.",
      "Your boots are still by the door.",
      "I scream into your favorite sweater sometimes.",
      "The baby kicked. You missed it forever.",
      "I found our bucket list. Half-checked.",
      "Your laugh echoes in empty parking lots.",
      "The organ donor saved five. Not you.",
      "I still pay for your phone line.",
      "You were my emergency contact. Now nobody.",
      "The paramedic said you didn't suffer. Liar.",
      "I kept your half of the blanket.",
      "You died and spring still came.",
      "Our playlist is 47 hours of grief.",
      "I archive your texts so they don't delete.",
      "The funeral home asked your favorite color.",
      "I set two alarms. Yours still rings.",
      "You left the oven on. I can't fix it.",
      "The hospital bracelet is in my wallet.",
      "I replay your laugh until my phone dies.",
      "You'd be 34 today. I bought cake.",
      "The doctor said peaceful. Your face said otherwise.",
      "I sleep diagonal. There's still no room.",
      "Your mother blames me. She's probably right.",
      "I kept your gym bag. It smells like you.",
      "The baby has your nose. She'll never know.",
      "You left the porch light on. It's still on.",
      "I found your journal. Page one: my name.",
      "The answering machine still has your voice.",
      "I drive past the hospital every day.",
      "Your favorite show released a new season.",
      "I Googled 'how to live without someone.'",
      "The mailman still asks about you.",
      "I wear your watch. It stopped too.",
      "You died in a waiting room chair.",
      "The grocery list still says your cereal.",
      "I kept your voicemail as my ringtone.",
      "You were mid-laugh when it happened.",
      "The sunrise looks wrong without you.",
      "I found your love letter. Unfinished.",
      "Your dentist called to confirm your appointment.",
      "I read your texts to fall asleep.",
      "The life insurance felt like blood money.",
      "I still make your coffee every morning.",
      "You died before I could say sorry.",
      "The neighbor's kid asked where you went.",
      "I kept the receipt from our last dinner.",
      "Your glasses are still on the nightstand.",
      "I can't throw away your shampoo bottle.",
      "The priest didn't know your real laugh.",
      "I park on your side of the garage.",
      "You died on our anniversary month.",
      "The fridge still has your leftovers.",
      "I write you letters. The mailbox is full.",
      "Your mom sent your childhood photos. I sobbed.",
      "The Christmas stocking still has your name.",
      "I learned to cook. You'll never taste it.",
      "Your library books are overdue. I can't return them.",
      "I found gray hairs. You'll never see them.",
      "The flowers on your grave froze last night.",
      "You were supposed to grow old with me.",
      "I fold your laundry out of habit.",
      "The rearview mirror still angled to you.",
      "I flinch when the phone rings at night.",
      "Your fingerprints are still on the mirror.",
      "The weight of your absence broke me.",
      "I kept the movie tickets from our last date.",
      "You promised tomorrow. There was no tomorrow.",
      "The lock screen is your sleeping face.",
      "I named the cat after your grandmother.",
      "Your best friend stopped calling me too.",
      "I found your bucket list in a drawer.",
      "The autumn leaves fell. You didn't see them.",
      "I kept every sticky note you wrote me.",
      "Your cologne ran out. I panic-bought three.",
      "The car seat is still adjusted to you.",
      "I sleep with the hallway light on now.",
      "Your last Google search was 'surprise gift ideas.'",
      "I iron your shirt every Sunday. Still.",
      "The snow fell. You weren't here for it.",
      "I talk about you in therapy. Every session.",
      "Your razor is rusting. I can't move it.",
      "The birthday card you bought me: unwritten.",
      "I kept your half-eaten candy bar. Fossilized grief.",
      "Your shoes are by the door. Waiting.",
      "I still say 'we' when I mean 'I.'",
      "The WiFi password is still your birthday.",
      "I got the promotion. The chair beside me: empty.",
      "Your plants died. I tried. I really tried.",
      "The neighbor plays your favorite song. Loudly.",
      "I kept your hospital socks. They're blue.",
      "You said 'see you later.' You lied.",
      "The calendar still shows your appointments.",
      "I drive your car. The seat's still warm-shaped.",
      "Your reading glasses prescription is in my pocket.",
      "I found your unsent letter to me.",
      "The pharmacy auto-refilled your prescription again.",
      "I bought groceries for two. Old habit dies slow.",
      "Your towel is still damp in my mind.",
      "The teacher asked my kid to draw family.",
      "I kept your boarding pass from our trip.",
      "Your Spotify is still playing discover weekly.",
      "I found sand from our last beach trip.",
      "The barber didn't know. I couldn't say it.",
      "Your bike is rusting in the garage.",
      "I alphabetized your bookshelf. Grief is strange.",
      "The pizza place still asks 'the usual?'",
      "I kept the blanket from the hospital bed.",
      "Your handwriting on the fridge: 'buy milk.'",
      "I drive slower now. I understand impact.",
      "The smoke alarm died. You always fixed those.",
      "I found your wedding vow drafts. Seventeen attempts.",
      "Your favorite mug cracked. I superglued it. Twice.",
      "I heard your name in a crowd. Turned.",
      "The garden you planted bloomed without you.",
      "I kept your side of the medicine cabinet.",
      "Your gym membership auto-renewed. I can't cancel.",
      "I found your secret chocolate stash. Untouched.",
      "The swing set you built still sways.",
      "I talk to your grave in the rain.",
      "Your spare key is still under the mat.",
      "I see your face in every stranger.",
      "The thermostat is set to your temperature. Always.",
      "I kept the hospital wristband. It's fading.",
      "Your last words were completely ordinary.",
      "I found your childhood teddy. It smells like you.",
      "The couch still has your indent.",
      "I celebrate your birthday alone. With two slices.",
      "Your coat still hangs on the hook.",
      "I can't change the sheets. They're yours.",
      "The mechanic asked when you're bringing the car.",
      "I found your notes app. Grocery lists. Dreams.",
      "Your sister can't look at me anymore.",
      "I kept the receipt from your last prescription.",
      "The neighbor's baby laughs like you did.",
      "I found your secret Spotify playlist. About me.",
      "Your half of the bed sinks differently now.",
      "I left your charger plugged in. Just in case.",
      "The dentist office called. I said you moved.",
      "I tried your recipe. It tasted like grief.",
      "Your journal entry that day: 'Feeling good.'",
      "I kept the lint from your pockets.",
      "The passenger seat remembers your weight.",
      "I found our initials. Carved in that tree.",
      "Your umbrella is still in my car.",
      "I tell your jokes. Nobody laughs right.",
      "The dry cleaner has your suit. Unclaimed.",
      "I hear your key in the door. Never.",
      "Your coffee order changed the barista's face.",
      "I kept the pen you always chewed.",
      "The hallway still echoes your footsteps.",
      "I found your hidden birthday present for me.",
      "Your subscriptions keep emailing. I keep reading.",
      "I sleep on your pillow when it's bad.",
      "The vet asked about your dog's other parent.",
      "I kept every receipt you ever signed.",
      "Your favorite bench has someone else now.",
      "I found your 'reasons to stay' list.",
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

    let pauseTimeout: ReturnType<typeof setTimeout>;
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
            pauseTimeout = setTimeout(() => setIsDeleting(true), 2000);
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

    return () => { clearTimeout(timeout); clearTimeout(pauseTimeout); };
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


