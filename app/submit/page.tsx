"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { typewriterTags, typewriterSubTags } from "@/components/typewriterPrompts";

interface IPData {
  ip?: string;
  country?: string;
}

const colorOptions = [
  { value: "default", label: "Default" },
  { value: "aqua", label: "Aqua" },
  { value: "azure", label: "Azure" },
  { value: "berry", label: "Berry" },
  { value: "brass", label: "Brass" },
  { value: "bronze", label: "Bronze" },
  { value: "clay", label: "Clay" },
  { value: "cloud", label: "Cloud" },
  { value: "copper", label: "Copper" },
  { value: "coral", label: "Coral" },
  { value: "cream", label: "Cream" },
  { value: "cyan", label: "Cyan" },
  { value: "dune", label: "Dune" },
  { value: "garnet", label: "Garnet" },
  { value: "gold", label: "Gold" },
  { value: "honey", label: "Honey" },
  { value: "ice", label: "Ice" },
  { value: "ivory", label: "Ivory" },
  { value: "jade", label: "Jade" },
  { value: "lilac", label: "Lilac" },
  { value: "mint", label: "Mint" },
  { value: "moss", label: "Moss" },
  { value: "night", label: "Night" },
  { value: "ocean", label: "Ocean" },
  { value: "olive", label: "Olive" },
  { value: "peach", label: "Peach" },
  { value: "pearl", label: "Pearl" },
  { value: "pine", label: "Pine" },
  { value: "plain", label: "Plain" },
  { value: "plum", label: "Plum" },
  { value: "rose", label: "Rose" },
  { value: "rouge", label: "Rouge" },
  { value: "ruby", label: "Ruby" },
  { value: "sage", label: "Sage" },
  { value: "sand", label: "Sand" },
  { value: "sepia", label: "Sepia" },
  { value: "sky", label: "Sky" },
  { value: "slate", label: "Slate" },
  { value: "steel", label: "Steel" },
  { value: "sunny", label: "Sunny" },
  { value: "teal", label: "Teal" },
  { value: "wine", label: "Wine" }
];

const specialEffects = [
  { value: "none", label: "None" },
  { value: "bleeding", label: "Bleeding Text" },
  { value: "handwritten", label: "Handwritten Text" },
  { value: "cursive", label: "Melting Text" },
  { value: "poetic", label: "Poetic Fade" }
];

const limitMessages = [
  "You're typing like they still care. Shorten it.",
  "50 words max. If they didn't read your texts, they won't read your novel.",
  "Unsent message, not an autobiography. Edit that trauma.",
  "This ain't your therapist. Keep it under 50, Shakespeare.",
  "They ghosted you, not gave you a book deal. Trim it.",
  "Nobody's ex read this much. Why should we?",
  "50 words or less. You're not auditioning for heartbreak Netflix.",
  "Less is more. Oversharing is out.",
  "Unsent doesn't mean unpublished, Hemingway.",
  "Writing a saga? Nah. This ain't 'Lord of the Goodbyes'.",
  "Send a message, not a memoir.",
  "Keep it short. Mystery is sexier than essays.",
  "Your feelings are valid. But also... too damn long.",
  "Brevity is hot. Trauma dumps are not.",
  "This isn't your diary. It's a message they'll never read.",
  "It's 'Unsent,' not 'Unhinged.' Chill.",
  "Typing like you're pitching to a publisher. Relax.",
  "You lost them, not the plot. Tighten it up.",
  "This ain't a TED Talk. Drop the mic in 50.",
  "Keep the mystery. Oversharing is a red flag.",
  "We said unsent, not unlimited.",
  "Heartbreak's poetic, not academic.",
  "If it takes more than 50 words to hurt, you've healed.",
  "Save it for your therapist. They get paid to read that much.",
  "Ever heard of a 'read more' button? No? Exactly.",
  "This ain't Medium. Don't medium dump.",
  "If they didn't reply to a text, why drop a chapter?",
  "50 max. Anything else is just emotional spam.",
  "Word vomit isn't romantic. Edit that heartbreak.",
  "Oversharing? In this economy?",
  "Tell us how you *feel*, not your life story.",
  "You're not the main character of this paragraph.",
  "You miss them, not your English teacher. Cut it down.",
  "Pain should punch. Not drone.",
  "Keep it sharp. This ain't 'War & Peace'.",
  "They left you on read. You giving them a sequel?",
  "50 max, heal artistically, not endlessly.",
  "Emotional dumping isn't aesthetic. It's exhausting.",
  "We came for heartbreak, not homework.",
];

const twoMemoryLimitMessages = [
  "Only 2 memories allowed. Some goodbyes must stay in your heart.",
  "Only 2 memories allowed. Two pieces of your story, that's all we can hold.",
  "Only 2 memories allowed. Two moments of love, the rest stays with you.",
  "Only 2 memories allowed. Two fragments of forever, the rest is yours.",
  "Only 2 memories allowed. Two echoes of your heart, the rest remains.",
  "Only 2 memories allowed. Two pieces of your truth, the rest is private.",
  "Only 2 memories allowed. Two moments of courage, the rest is strength.",
  "Only 2 memories allowed. Two pieces of your soul, the rest is sacred.",
  "Only 2 memories allowed. Two echoes of love, the rest is yours.",
  "Only 2 memories allowed. Two pieces of your story, the rest is poetry.",
  "Only 2 memories allowed. Two glimpses of forever, the rest is dream.",
  "Only 2 memories allowed. Two moments of heart, the rest is prayer.",
  "Only 2 memories allowed. Two pieces of truth, the rest is space.",
  "Only 2 memories allowed. Two echoes of soul, the rest is light.",
  "Only 2 memories allowed. Two pieces of love, the rest is song.",
  "Only 2 memories allowed. Two moments of story, the rest is verse.",
  "Only 2 memories allowed. Two pieces of heart, the rest is dream.",
  "Only 2 memories allowed. Two echoes of truth, the rest is yours.",
  "Only 2 memories allowed. Two moments of soul, the rest is sacred.",
  "Only 2 memories allowed. Two pieces of love, the rest is private."
];

export default function SubmitPage() {
  // Add global error handler for this component
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection in SubmitPage:', event.reason);
      event.preventDefault(); // Prevent the default browser behavior
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error in SubmitPage:', event.error);
      event.preventDefault(); // Prevent the default browser behavior
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('error', handleError);

      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);
      };
    }
  }, []);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [color, setColor] = useState("default");
  const [specialEffect, setSpecialEffect] = useState("");
  const [fullBg, setFullBg] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [tag, setTag] = useState("");
  const [subTag, setSubTag] = useState("");

  const [limitMsg, setLimitMsg] = useState("");
  const [specialEffectVisible, setSpecialEffectVisible] = useState(false);
  const [hasCrossed, setHasCrossed] = useState(false);

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setIpData({ ip: data.ip, country: data.country_name });
      } catch (err) {
        console.error("Error fetching IP info:", err);
      }
    }
    fetchIP();
  }, []);

  const wordCount = message.trim() ? message.trim().split(/[\s.]+/).filter(word => word.length > 0).length : 0;
  const isSpecialAllowed = wordCount <= 30;
  const percent = Math.min((wordCount / 50) * 100, 100).toFixed(0);
  const overLimit = wordCount > 50;

  // Trigger special-effect warning and disable existing effect when crossing 30-word threshold
  useEffect(() => {
    if (wordCount > 30 && !hasCrossed) {
      setSpecialEffectVisible(true);
      setHasCrossed(true);
      setSpecialEffect("");
      setTimeout(() => setSpecialEffectVisible(false), 5000);
    } else if (wordCount <= 30 && hasCrossed) {
      setHasCrossed(false);
    }
  }, [wordCount, hasCrossed]);

  // Random message when exceeding 50 words
  useEffect(() => {
    if (overLimit) {
      setLimitMsg(
        limitMessages[Math.floor(Math.random() * limitMessages.length)]
      );
    }
  }, [overLimit]);

  // Check memory limit and ban status on component mount and when IP/UUID changes
  useEffect(() => {
    async function checkMemoryLimitAndBanStatus() {
      let uuid = null;
      if (typeof window !== 'undefined') {
        uuid = localStorage.getItem('user_uuid') || getCookie('user_uuid');
      }

      try {
        // Use server-side API for status check (bypass-proof)
        const response = await fetch('/api/check-user-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid }),
        });

        if (!response.ok) {
          console.error("Error checking user status:", response.status);
          return;
        }

        const result = await response.json();
        
        if (result.error) {
          console.error("Server error checking status:", result.error);
          return;
        }

        // Update states based on server response
        if (result.isBanned) {
          setIsBanned(true);
          setHasReachedLimit(true);
          setIsFormDisabled(true);
          setError("You are banned from submitting memories.");
        } else if (result.hasReachedLimit) {
          setHasReachedLimit(true);
          setIsFormDisabled(true);
          setError(twoMemoryLimitMessages[Math.floor(Math.random() * twoMemoryLimitMessages.length)]);
        } else if (result.canSubmit) {
          // Reset all states if user is within limits and not banned
          setIsBanned(false);
          setHasReachedLimit(false);
          setIsFormDisabled(false);
          setError("");
        }
      } catch (err) {
        console.error("Network error checking user status:", err);
      }
    }

    // Always check status (even without ipData, server will handle IP detection)
    checkMemoryLimitAndBanStatus();
  }, [ipData]);

  // Add getSubTags function
  // Get sub-tags for a main tag (convert short tags to display text)
  const getSubTags = (mainTag: string) => {
    const shortTags = typewriterSubTags[mainTag] || [];
    
    // Convert short tags to display text
    const shortToDisplayMap: Record<string, string> = {
      // Love
      "love_you": "i love you",
      "dont_love_anymore": "i don't love you anymore",
      "love_cant_be_together": "i love you but can't be with you",
      "still_love": "i still love you",
      "never_loved": "i never loved you",
      
      // Hate
      "hate_you": "i hate you",
      "hate_myself": "i hate myself",
      "hate_what_we_became": "i hate what we became",
      "dont_hate_anymore": "i don't hate you anymore",
      "i_cant_hate_you": "i can't hate you",
      
      // Apology
      "im_sorry": "i'm sorry",
      "you_should_be_sorry": "you should be sorry",
      "both_need_apologize": "we both need to apologize",
      "im_not_sorry": "i'm not sorry",
      
      // Blame
      "blame_you": "i blame you",
      "blame_myself": "i blame myself",
      "both_to_blame": "we're both to blame",
      "no_one_to_blame": "no one's to blame",
      
      // Confession
      "have_to_tell_you": "i have to tell you",
      "keep_secret": "i'll keep this secret",
      "i_was_wrong": "i was wrong",
      "you_were_wrong": "you were wrong",
      "both_made_mistakes": "we both made mistakes",
      
      // Fear
      "afraid_losing_you": "i'm afraid of losing you",
      "afraid_commitment": "i'm afraid of commitment",
      "afraid_future": "i'm afraid of the future",
      "not_afraid_anymore": "i'm not afraid anymore",
      
      // Forgiveness
      "asking_forgiveness": "i'm asking for forgiveness",
      "forgive_you": "i forgive you",
      "cant_forgive": "i can't forgive you",
      "forgive_myself": "i forgive myself",
      "need_forgive_each_other": "we need to forgive each other",
      
      // Goodbye
      "goodbye_forever": "goodbye forever",
      "see_you_again": "see you again",
      "im_leaving": "i'm leaving",
      "dont_leave": "don't leave",
      "need_part_ways": "we need to part ways",
      
      // Gratitude
      "thank_everything": "thank you for everything",
      "thank_lessons": "thank you for the lessons",
      "grateful_us": "i'm grateful for us",
      "grateful_pain": "i'm grateful for the pain",
      
      // Guilt
      "feel_guilty": "i feel guilty",
      "innocent": "i'm innocent",
      "you_should_guilty": "you should feel guilty",
      "no_one_guilty": "no one's guilty",
      "both_guilty": "we both feel guilty",
      
      // Heartbreak
      "you_broke_heart": "you broke my heart",
      "broke_own_heart": "i broke my own heart",
      "broke_each_other": "we broke each other",
      "heart_healing": "my heart is healing",
      
      // Jealousy
      "jealous_of_you": "i'm jealous of you",
      "jealous_of_others": "i'm jealous of others",
      "you_jealous_of_me": "you're jealous of me",
      "not_jealous_anymore": "i'm not jealous anymore",
      
      // Missing
      "miss_you": "i miss you",
      "dont_miss_anymore": "i don't miss you anymore",
      "miss_who_you_were": "i miss who you were",
      "miss_who_we_were": "i miss who we were",
      "miss_myself": "i miss myself",
      
      // Regret
      "regret_everything": "i regret everything",
      "no_regrets": "i have no regrets",
      "regret_not_trying": "i regret not trying harder",
      "regret_meeting": "i regret meeting you",
      "both_have_regrets": "we both have regrets",
      
      // Sadness
      "so_sad": "i'm so sad",
      "finding_happiness": "i'm finding happiness",
      "sad_what_lost": "i'm sad for what we lost",
      "sad_for_you": "i'm sad for you",
      "sad_for_me": "i'm sad for me",
      
      // Shame
      "ashamed": "i'm ashamed",
      "proud_myself": "i'm proud of myself",
      "you_should_ashamed": "you should be ashamed",
      "both_should_ashamed": "we should both be ashamed",
      "no_one_ashamed": "no one should be ashamed",
      
      // Thank You
      "thank_you": "thank you",
      "no_thanks_needed": "no thanks needed",
      "thank_pain": "thank you for the pain",
      "thank_memories": "thank you for the memories",
      "thank_leaving": "thank you for leaving",
      
      // Closure
      "need_answers": "i need answers",
      "dont_need_answers": "i don't need answers",
      "need_understand": "i need to understand",
      "need_move_on": "i need to move on",
      "need_closure": "we need closure",
      "never_got_closure": "i never got closure",
      "seeking_closure": "i'm seeking closure",
      "closure_impossible": "closure feels impossible",
      "found_own_closure": "i found my own closure",
      
      // Anger
      "angry_at_you": "i'm angry at you",
      "angry_at_myself": "i'm angry at myself",
      "angry_at_situation": "i'm angry at the situation",
      "not_angry_anymore": "i'm not angry anymore",
      
      // Betrayal
      "you_betrayed_me": "you betrayed me",
      "i_betrayed_you": "i betrayed you",
      "mutual_betrayal": "mutual betrayal",
      "trust_destroyed": "trust destroyed",
      "betrayal_by_friend": "betrayal by friend",
      
      // Devotion
      "devoted_to_you": "devoted to you",
      "worship_your_existence": "worship your existence",
      "you_are_my_religion": "you are my religion",
      "unconditional_love": "unconditional love",
      "would_die_for_you": "would die for you",
      
      // Emptiness
      "empty_without_you": "empty without you",
      "hollow_inside": "hollow inside",
      "void_in_heart": "void in heart",
      "numb_and_empty": "numb and empty",
      "emptiness_consumes": "emptiness consumes",
      
      // Hope
      "hope_for_us": "hope for us",
      "hope_you_return": "hope you return",
      "hope_for_healing": "hope for healing",
      "hope_is_fading": "hope is fading",
      "never_give_up_hope": "never give up hope",
      
      // Longing
      "ache_for_you": "ache for you",
      "desperate_yearning": "desperate yearning",
      "craving_your_touch": "craving your touch",
      "starving_for_you": "starving for you",
      "endless_desire": "endless desire",
      
      // Nostalgia
      "remember_good_times": "remember good times",
      "miss_our_past": "miss our past",
      "better_days": "better days",
      "golden_memories": "golden memories",
      "wish_we_could_go_back": "wish we could go back",
      
      // Obsession
      "cant_stop_thinking": "can't stop thinking",
      "consumed_by_you": "consumed by you",
      "unhealthy_fixation": "unhealthy fixation",
      "obsessed_with_memories": "obsessed with memories",
      "addicted_to_you": "addicted to you",
      
      // Passion
      "burning_desire": "burning desire",
      "wild_love": "wild love",
      "fierce_attraction": "fierce attraction",
      "passionate_fire": "passionate fire",
      "intense_connection": "intense connection",
      
      // Pride
      "proud_of_us": "proud of us",
      "too_proud_to_beg": "too proud to beg",
      "swallowing_pride": "swallowing pride",
      "pride_before_fall": "pride before fall",
      "damaged_pride": "damaged pride",
      
      // Vulnerability
      "opening_my_heart": "opening my heart",
      "showing_weakness": "showing weakness",
      "need_protection": "need protection",
      "trust_you_completely": "trust you completely",
      "exposed_and_fragile": "exposed and fragile",
      
      // Yearning
      "yearn_for_touch": "yearn for touch",
      "desperate_need": "desperate need",
      "soul_yearning": "soul yearning",
      "yearning_for_past": "yearning for past",
      "unfulfilled_yearning": "unfulfilled yearning",
      
      // Other
      "other_feeling": "other feeling",
      "different_emotion": "different emotion",
      "something_else": "something else",
      "cant_explain": "i can't explain",
      "complicated": "it's complicated"
    };
    
    return shortTags.map(shortTag => shortToDisplayMap[shortTag] || shortTag);
  };

  // Convert display text to short tag
  const getShortTag = (displayText: string) => {
    // Create a direct mapping from display text to short tag
    const displayToShortMap: Record<string, string> = {
      // Love
      "i love you": "love_you",
      "i don't love you anymore": "dont_love_anymore",
      "i love you but can't be with you": "love_cant_be_together",
      "i still love you": "still_love",
      "i never loved you": "never_loved",
      
      // Hate
      "i hate you": "hate_you",
      "i hate myself": "hate_myself",
      "i hate what we became": "hate_what_we_became",
      "i don't hate you anymore": "dont_hate_anymore",
      "i can't hate you": "i_cant_hate_you",
      
      // Apology
      "i'm sorry": "im_sorry",
      "you should be sorry": "you_should_be_sorry",
      "we both need to apologize": "both_need_apologize",
      "i'm not sorry": "im_not_sorry",
      
      // Blame
      "i blame you": "blame_you",
      "i blame myself": "blame_myself",
      "we're both to blame": "both_to_blame",
      "no one's to blame": "no_one_to_blame",
      
      // Confession
      "i have to tell you": "have_to_tell_you",
      "i'll keep this secret": "keep_secret",
      "i was wrong": "i_was_wrong",
      "you were wrong": "you_were_wrong",
      "we both made mistakes": "both_made_mistakes",
      
      // Fear
      "i'm afraid of losing you": "afraid_losing_you",
      "i'm afraid of commitment": "afraid_commitment",
      "i'm afraid of the future": "afraid_future",
      "i'm not afraid anymore": "not_afraid_anymore",
      
      // Forgiveness
      "i'm asking for forgiveness": "asking_forgiveness",
      "i forgive you": "forgive_you",
      "i can't forgive you": "cant_forgive",
      "i forgive myself": "forgive_myself",
      "we need to forgive each other": "need_forgive_each_other",
      
      // Goodbye
      "goodbye forever": "goodbye_forever",
      "see you again": "see_you_again",
      "i'm leaving": "im_leaving",
      "don't leave": "dont_leave",
      "we need to part ways": "need_part_ways",
      
      // Gratitude
      "thank you for everything": "thank_everything",
      "thank you for the lessons": "thank_lessons",
      "i'm grateful for us": "grateful_us",
      "i'm grateful for the pain": "grateful_pain",
      
      // Guilt
      "i feel guilty": "feel_guilty",
      "i'm innocent": "innocent",
      "you should feel guilty": "you_should_guilty",
      "no one's guilty": "no_one_guilty",
      "we both feel guilty": "both_guilty",
      
      // Heartbreak
      "you broke my heart": "you_broke_heart",
      "i broke my own heart": "broke_own_heart",
      "we broke each other": "broke_each_other",
      "my heart is healing": "heart_healing",
      
      // Jealousy
      "i'm jealous of you": "jealous_of_you",
      "i'm jealous of others": "jealous_of_others",
      "you're jealous of me": "you_jealous_of_me",
      "i'm not jealous anymore": "not_jealous_anymore",
      
      // Missing
      "i miss you": "miss_you",
      "i don't miss you anymore": "dont_miss_anymore",
      "i miss who you were": "miss_who_you_were",
      "i miss who we were": "miss_who_we_were",
      "i miss myself": "miss_myself",
      
      // Regret
      "i regret everything": "regret_everything",
      "i have no regrets": "no_regrets",
      "i regret not trying harder": "regret_not_trying",
      "i regret meeting you": "regret_meeting",
      "we both have regrets": "both_have_regrets",
      
      // Sadness
      "i'm so sad": "so_sad",
      "i'm finding happiness": "finding_happiness",
      "i'm sad for what we lost": "sad_what_lost",
      "i'm sad for you": "sad_for_you",
      "i'm sad for me": "sad_for_me",
      
      // Shame
      "i'm ashamed": "ashamed",
      "i'm proud of myself": "proud_myself",
      "you should be ashamed": "you_should_ashamed",
      "we should both be ashamed": "both_should_ashamed",
      "no one should be ashamed": "no_one_ashamed",
      
      // Thank You
      "thank you": "thank_you",
      "no thanks needed": "no_thanks_needed",
      "thank you for the pain": "thank_pain",
      "thank you for the memories": "thank_memories",
      "thank you for leaving": "thank_leaving",
      
      // Closure
      "i need answers": "need_answers",
      "i don't need answers": "dont_need_answers",
      "i need to understand": "need_understand",
      "i need to move on": "need_move_on",
      "we need closure": "need_closure",
      "i never got closure": "never_got_closure",
      "i'm seeking closure": "seeking_closure",
      "closure feels impossible": "closure_impossible",
      "i found my own closure": "found_own_closure",
      
      // Anger
      "i'm angry at you": "angry_at_you",
      "i'm angry at myself": "angry_at_myself",
      "i'm angry at the situation": "angry_at_situation",
      "i'm not angry anymore": "not_angry_anymore",
      
      // Betrayal
      "you betrayed me": "you_betrayed_me",
      "i betrayed you": "i_betrayed_you",
      "mutual betrayal": "mutual_betrayal",
      "trust destroyed": "trust_destroyed",
      "betrayal by friend": "betrayal_by_friend",
      
      // Devotion
      "devoted to you": "devoted_to_you",
      "worship your existence": "worship_your_existence",
      "you are my religion": "you_are_my_religion",
      "unconditional love": "unconditional_love",
      "would die for you": "would_die_for_you",
      
      // Emptiness
      "empty without you": "empty_without_you",
      "hollow inside": "hollow_inside",
      "void in heart": "void_in_heart",
      "numb and empty": "numb_and_empty",
      "emptiness consumes": "emptiness_consumes",
      
      // Hope
      "hope for us": "hope_for_us",
      "hope you return": "hope_you_return",
      "hope for healing": "hope_for_healing",
      "hope is fading": "hope_is_fading",
      "never give up hope": "never_give_up_hope",
      
      // Longing
      "ache for you": "ache_for_you",
      "desperate yearning": "desperate_yearning",
      "craving your touch": "craving_your_touch",
      "starving for you": "starving_for_you",
      "endless desire": "endless_desire",
      
      // Nostalgia
      "remember good times": "remember_good_times",
      "miss our past": "miss_our_past",
      "better days": "better_days",
      "golden memories": "golden_memories",
      "wish we could go back": "wish_we_could_go_back",
      
      // Obsession
      "can't stop thinking": "cant_stop_thinking",
      "consumed by you": "consumed_by_you",
      "unhealthy fixation": "unhealthy_fixation",
      "obsessed with memories": "obsessed_with_memories",
      "addicted to you": "addicted_to_you",
      
      // Passion
      "burning desire": "burning_desire",
      "wild love": "wild_love",
      "fierce attraction": "fierce_attraction",
      "passionate fire": "passionate_fire",
      "intense connection": "intense_connection",
      
      // Pride
      "proud of us": "proud_of_us",
      "too proud to beg": "too_proud_to_beg",
      "swallowing pride": "swallowing_pride",
      "pride before fall": "pride_before_fall",
      "damaged pride": "damaged_pride",
      
      // Vulnerability
      "opening my heart": "opening_my_heart",
      "showing weakness": "showing_weakness",
      "need protection": "need_protection",
      "trust you completely": "trust_you_completely",
      "exposed and fragile": "exposed_and_fragile",
      
      // Yearning
      "yearn for touch": "yearn_for_touch",
      "desperate need": "desperate_need",
      "soul yearning": "soul_yearning",
      "yearning for past": "yearning_for_past",
      "unfulfilled yearning": "unfulfilled_yearning",
      
      // Other
      "other feeling": "other_feeling",
      "different emotion": "different_emotion",
      "something else": "something_else",
      "i can't explain": "cant_explain",
      "it's complicated": "complicated"
    };
    
    return displayToShortMap[displayText] || displayText;
  };

  // Reset subTag when main tag changes
  useEffect(() => {
    setSubTag("");
  }, [tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (overLimit) {
      setError("Submission not allowed. Maximum word limit is 50.");
      setIsSubmitting(false);
      return;
    }
    if (!recipient || !message) {
      setError("Please fill in recipient and message.");
      setIsSubmitting(false);
      return;
    }

    // Get UUID from localStorage or cookie
    let uuid = null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('user_uuid') || getCookie('user_uuid');
    }

    // Enhanced ban and limit checking
    if (ipData?.ip || uuid) {
      // Owner exemption - skip all checks for owner IP
      if (ipData?.ip === '103.161.233.157') {
        // Skip all checks for owner
      } else {
        try {
          // Check if banned by IP or UUID with more specific query
          const banQuery = [];
          if (ipData?.ip) banQuery.push(`ip.eq.${ipData.ip}`);
          if (uuid) banQuery.push(`uuid.eq.${uuid}`);
          
          if (banQuery.length > 0) {
            const { data: banData, error: banErr } = await supabase
              .from("banned_users")
              .select("id, ip, uuid")
              .or(banQuery.join(","))
              .limit(1);
              
            if (banErr) {
              console.error("Error checking banned users:", banErr);
              setError("Error verifying user status. Please try again.");
              setIsSubmitting(false);
              return;
            }
            
            if (banData && banData.length > 0) {
              setError("You are banned from submitting memories.");
              setIsBanned(true);
              setHasReachedLimit(true);
              setIsFormDisabled(true);
              setIsSubmitting(false);
              return;
            }
          }

          // Check memory count with enhanced query
          const memoryQuery = [];
          if (ipData?.ip) memoryQuery.push(`ip.eq.${ipData.ip}`);
          if (uuid) memoryQuery.push(`uuid.eq.${uuid}`);
          
          if (memoryQuery.length > 0) {
            const { count, error: memErr } = await supabase
              .from("memories")
              .select("id", { count: "exact" })
              .or(memoryQuery.join(","));
              
            if (memErr) {
              console.error("Error checking submission count:", memErr);
              setError("Error checking submission limit. Please try again.");
              setIsSubmitting(false);
              return;
            }
            
            if (count && count >= 2) {
              setError(twoMemoryLimitMessages[Math.floor(Math.random() * twoMemoryLimitMessages.length)]);
              setHasReachedLimit(true);
              setIsFormDisabled(true);
              setIsSubmitting(false);
              return;
            }
          }
        } catch (err) {
          console.error("Unexpected error during validation:", err);
          setError("An unexpected error occurred. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }
    }

    const shortTag = tag && subTag ? getShortTag(subTag) : null;
    
    const submission = {
      recipient: recipient.trim(),
      message: message.trim(),
      sender: sender.trim() || undefined,
      color,
      full_bg: fullBg,
      animation: specialEffect || undefined,
      uuid: uuid || undefined,
      tag: tag || undefined,
      sub_tag: shortTag || undefined,  // Convert to short tag
    };

    // Validate required fields first
    if (!recipient || !message) {
      setError("Missing required fields. Please check your submission.");
      setIsSubmitting(false);
      return;
    }

    // Instantly show success to user for better UX
    setSubmitted(true);
    setError("");
    setIsSubmitting(false);
    
    // Scroll to top to show success message immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Process submission in background (non-blocking)
    fetch('/api/submit-memory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    }).then(response => {
      return response.json().then(result => ({ response, result }));
    }).then(({ response, result }) => {
      if (!response.ok) {
        // Handle critical errors that should override success
        if (response.status === 403) {
          // Banned user - critical error
          setSubmitted(false);
          setError(result.error || "You are banned from submitting memories.");
          setIsBanned(true);
          setHasReachedLimit(true);
          setIsFormDisabled(true);
        } else if (response.status === 429) {
          // Memory limit reached - critical error
          setSubmitted(false);
          setError(result.error || "Memory limit reached.");
          setHasReachedLimit(true);
          setIsFormDisabled(true);
        } else {
          // Other errors (network/server) - log but keep success shown
          console.error('Background submission failed:', result.error);
          // User already saw success, so don't disturb their experience
        }
      } else {
        // Successfully submitted - user already sees success
        console.log('Memory submitted successfully in background');
      }
    }).catch(err => {
      // Network or parsing error - log but don't disturb user experience
      console.error('Background submission error:', err);
      // Keep success message shown since user already saw it
    });
  };

  // Helper function to get cookie value
  function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  const getDryLeafColor = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Default theme for SSR
    let theme = 'light';
    
    // Only access document on client side
    if (typeof window !== 'undefined') {
      theme = document.documentElement.getAttribute('data-theme') || 'light';
    }
    
    // Time-based colors - dry leaf tones
    let timeColor = '#8B7355'; // Default brown
    if (hour >= 5 && hour < 12) {
      timeColor = '#A0522D'; // Morning sienna
    } else if (hour >= 12 && hour < 17) {
      timeColor = '#6B4423'; // Afternoon dark brown
    } else {
      timeColor = '#5D4037'; // Night darker brown
    }
    
    // Theme-based adjustments
    if (theme === 'dark') {
      return '#4A4A4A'; // Dark gray for dark theme
    } else if (theme === 'sepia') {
      return '#8B7355'; // Brown for sepia theme
    }
    
    return timeColor;
  };

  const [dryLeafColor, setDryLeafColor] = useState('#8B7355'); // Default color

  useEffect(() => {
    setDryLeafColor(getDryLeafColor());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)] lg:bg-gradient-to-br lg:from-[var(--background)] lg:to-[var(--card-bg)] lg:via-[var(--secondary)]/30 relative overflow-x-hidden">
      {/* Floating dry leaf accent (desktop only) */}
      <div className="hidden lg:block absolute left-[-120px] top-1/3 z-0 opacity-20 pointer-events-none select-none">
        <span style={{ color: dryLeafColor }} className="text-[180px] drop-shadow-2xl blur-[3px] transform -rotate-12">🍂</span>
      </div>
      <header className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <h1 className="text-4xl font-serif desktop-heading">Submit a Memory</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex justify-center gap-6 desktop-nav-list">
              <li>
                <Link href="/" className="hover:text-[var(--accent)] transition desktop-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-[var(--accent)] transition desktop-nav-link">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[var(--accent)] transition desktop-nav-link">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 lg:py-16 relative z-10">
        <div className="w-full max-w-5xl mx-auto lg:grid lg:grid-cols-[1fr_32px_1.2fr] lg:gap-0 lg:items-stretch relative">
          {/* Info/Quote Panel (Desktop only) */}
          <aside className="hidden lg:flex flex-col justify-center bg-[var(--card-bg)]/80 rounded-3xl shadow-2xl p-12 mr-0 animate-fade-in backdrop-blur-xl border border-[var(--accent)]/10">
            <div className="mb-8">
              <blockquote className="text-2xl font-serif italic text-[var(--accent)] mb-6 leading-snug drop-shadow-sm">&ldquo;Some words are too heavy to send, but too important to keep.&rdquo;</blockquote>
              <h2 className="text-3xl font-serif font-bold mb-4 text-[var(--text)]">Why Unsent?</h2>
              <p className="text-lg font-normal leading-relaxed text-[var(--text)] opacity-90">
                A place for the messages you never sent, but never forgot.
              </p>
            </div>
            <div className="mt-1 text-base text-[var(--text)] opacity-80">
              <ul className="list-disc pl-5 space-y-2">
                <li>Max 50 words. Short, sharp, honest.</li>
                <li>English only. No hate, spam, or off-topic.</li>
                <li>Special effects for short messages (&le;30 words).</li>
                <li>2 memories per person. Make them count.</li>
              </ul>
            </div>
          </aside>
          {/* Decorative divider */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="h-2/3 w-[2px] bg-gradient-to-b from-[var(--accent)]/0 via-[var(--accent)]/40 to-[var(--accent)]/0 rounded-full relative">
            </div>
          </div>
          {/* Form Card */}
          <div className="w-full flex flex-col justify-center">
            {!submitted && (
              <div className="max-w-2xl w-full bg-[var(--card-bg)] backdrop-blur-sm bg-opacity-60 p-6 rounded-2xl shadow-2xl mb-8 lg:hidden">
                <p className="text-center italic font-medium">
                  Share your unsent message. Keep it honest, heartfelt, and in English only. <strong>Off-topic submissions will be rejected.</strong>
                </p>
              </div>
            )}

            {submitted ? (
              <div className="w-full bg-[var(--secondary)] p-8 rounded-2xl shadow-xl text-center animate-fade-in">
                <div className="text-3xl font-bold mb-4 animate-bounce">Sent!</div>
                <p className="mb-6">Your memory is pending approval. Please wait while we review it.</p>
                <Link 
                  href="/"
                  className="inline-block px-6 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  Return Home
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-[var(--card-bg)] backdrop-blur-sm bg-opacity-70 p-8 rounded-2xl shadow-2xl space-y-6 lg:max-w-xl lg:bg-[var(--card-bg)]/80 lg:backdrop-blur-2xl lg:p-10 lg:rounded-3xl lg:shadow-3xl lg:border lg:border-[var(--accent)]/10"
              >
                {error && (
                  <p className="text-red-500 text-center font-medium">{error}</p>
                )}

                <div>
                  <label className="block font-serif">Recipient&apos;s Name*</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                    disabled={isFormDisabled}
                    className={`w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition lg:p-4 lg:rounded-3xl lg:focus:ring-4 lg:focus:ring-[var(--accent)]/30 lg:focus:shadow-lg ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-serif">Message* (max 50 words)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    disabled={isFormDisabled}
                    className={`w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition lg:p-4 lg:rounded-3xl lg:focus:ring-4 lg:focus:ring-[var(--accent)]/30 lg:focus:shadow-lg lg:resize-none ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                  />
                  <div className="relative h-2 w-full bg-[var(--border)] rounded-full overflow-hidden mt-2 lg:h-3 lg:shadow-sm">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        wordCount <= 30
                          ? "bg-[var(--accent)]"
                          : wordCount <= 50
                          ? "bg-[var(--secondary)]"
                          : "bg-red-500"
                      } lg:animate-pulse-[0.8s]`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1 lg:text-sm">
                    <span className="lg:font-mono lg:tracking-wide">{wordCount} / 50</span>
                    {wordCount > 30 && specialEffectVisible && (
                      <span className="text-red-500 lg:font-medium">
                        Special effects disabled beyond 30 words.
                      </span>
                    )}
                    {overLimit && (
                      <span className="text-red-500 lg:font-medium">{limitMsg}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-serif">Your Name (optional)</label>
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    disabled={isFormDisabled}
                    className={`w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition lg:p-4 lg:rounded-3xl lg:focus:ring-4 lg:focus:ring-[var(--accent)]/30 lg:focus:shadow-lg ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-serif">Select a Color (optional)</label>
                  <select
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                      setFullBg(e.target.value !== "default");
                    }}
                    disabled={isFormDisabled}
                    className={`w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition lg:p-4 lg:rounded-3xl lg:focus:ring-4 lg:focus:ring-[var(--accent)]/30 lg:focus:shadow-lg ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                  >
                    {colorOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-serif">Special Effect</label>
                  <select
                    value={specialEffect}
                    onChange={(e) => setSpecialEffect(e.target.value)}
                    disabled={!isSpecialAllowed || isFormDisabled}
                    className={`w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition disabled:opacity-50 lg:p-4 lg:rounded-3xl lg:focus:ring-4 lg:focus:ring-[var(--accent)]/30 lg:focus:shadow-lg ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                  >
                    {specialEffects.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-serif">Select a Tag (optional - personalizes typewriter text)</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    disabled={isFormDisabled}
                    className={`w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition lg:p-4 lg:rounded-3xl lg:focus:ring-4 lg:focus:ring-[var(--accent)]/30 lg:focus:shadow-lg ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                  >
                    <option value="">Select a tag (or leave blank for mixed emotions)</option>
                    {typewriterTags.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {!tag && (
                    <p className="text-sm text-[var(--text)]/70 mt-1 italic">
                      Leave blank to see a diverse mix of emotional prompts from all categories
                    </p>
                  )}
                </div>

                {tag && (
                  <div>
                    <label className="block font-serif">Select a Sub-Emotion (optional)</label>
                    <select
                      value={subTag}
                      onChange={(e) => setSubTag(e.target.value)}
                      disabled={isFormDisabled}
                      className={`w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition lg:p-4 lg:rounded-3xl lg:focus:ring-4 lg:focus:ring-[var(--accent)]/30 lg:focus:shadow-lg ${
                        isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                      }`}
                    >
                      <option value="">Select sub-emotion (or leave blank for mixed)</option>
                      {getSubTags(tag).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    {!subTag && (
                      <p className="text-sm text-[var(--text)]/70 mt-1 italic">
                        Leave blank to see all prompts from the {tag} category
                      </p>
                    )}
                  </div>
                )}



                <div className="flex items-center space-x-2 lg:mt-2">
                  <input
                    id="fullBg"
                    type="checkbox"
                    checked={fullBg}
                    onChange={(e) => setFullBg(e.target.checked)}
                    disabled={isFormDisabled}
                    className={`h-5 w-5 accent-[var(--accent)] lg:rounded-xl lg:border-2 lg:border-[var(--accent)]/30 lg:focus:ring-2 lg:focus:ring-[var(--accent)]/40 ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  <label htmlFor="fullBg" className="font-serif lg:text-base">
                    Apply color to full card background
                  </label>
                </div>

                <div className="text-center lg:flex-1 lg:flex lg:items-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || hasReachedLimit || isFormDisabled}
                    className={`w-full px-8 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg transition-transform lg:px-10 lg:py-4 lg:rounded-3xl lg:shadow-xl lg:text-xl lg:focus:ring-4 lg:focus:ring-[var(--accent)]/30 lg:focus:shadow-2xl ${
                      isSubmitting || hasReachedLimit || isFormDisabled
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:scale-105 lg:hover:scale-[1.04] lg:hover:shadow-2xl'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 
                     isBanned ? 'Banned from Submitting' :
                     hasReachedLimit ? 'Memory Limit Reached' : 
                     'Submit Memory'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[var(--card-bg)] shadow-inner">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-[var(--text)] footer-copyright">
          © {new Date().getFullYear()} — If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
