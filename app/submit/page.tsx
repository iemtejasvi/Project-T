"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { typewriterTags, typewriterSubTags } from "@/components/typewriterPrompts";
import { colorBgMap } from "@/components/cardConstants";
import { hasSuspiciouslyLongWords } from "@/lib/inputSanitizer";
import { getCookie } from '@/lib/cookies';
import { WORD_LIMIT, SPECIAL_EFFECT_WORD_LIMIT, countWords } from '@/lib/constants';
import { BelowContentAdUnit } from "@/components/AdUnit";
import InlineLoader from "@/components/InlineLoader";
import Footer from "@/components/Footer";

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
  { value: "handwritten", label: "Handwritten Text" },
  { value: "rough", label: "Rough Paper" },
  { value: "cursive", label: "Melting Text" }
];

const MAX_MESSAGE_LENGTH = 5000;

const limitMessages = [
  "Keep it to 50 words — the best letters say more with less.",
  "50 words max. Distill what matters most.",
  "Try to capture it in 50 words or fewer.",
  "The most powerful things are often the shortest. 50 words max.",
  "50 words — just enough to say what you never could.",
  "A few words can carry a lifetime of feeling. Keep it under 50.",
  "Say it simply. 50 words is all you need.",
  "Brevity makes it hit harder. Trim it to 50.",
  "The shortest letters are often the ones we remember. 50 words max.",
  "Less is more — pare it down to 50 words.",
  "50 words. Choose the ones that matter most.",
  "Your feelings deserve to be distilled, not diluted. 50 words max.",
  "Some of the greatest love letters were only a sentence. Try 50 words.",
  "Pick the words you'd whisper, not the ones you'd shout. 50 max.",
  "If you could only say one thing — what would it be? 50 words.",
  "Let it breathe. 50 words is plenty.",
  "Every word should earn its place. Keep it under 50.",
  "Write the version they'd carry in their pocket. 50 words.",
  "50 words — like a postcard from the heart.",
  "Strip it down to what really matters. 50 words max.",
  "The weight is in what you choose to keep. 50 words.",
  "Make every word count. You have 50.",
  "What would you say if you only had a moment? 50 words.",
  "Short and true hits deeper than long and perfect. 50 max.",
  "50 words — enough to break a silence.",
];

const twoMemoryLimitMessages = [
  "Only 6 memories allowed. Some goodbyes must stay in your heart.",
  "Only 6 memories allowed. Six pieces of your story, that's all we can hold.",
  "Only 6 memories allowed. Six moments of love, the rest stays with you.",
  "Only 6 memories allowed. Six fragments of forever, the rest is yours.",
  "Only 6 memories allowed. Six echoes of your heart, the rest remains.",
  "Only 6 memories allowed. Six pieces of your truth, the rest is private.",
  "Only 6 memories allowed. Six moments of courage, the rest is strength.",
  "Only 6 memories allowed. Six pieces of your soul, the rest is sacred.",
  "Only 6 memories allowed. Six echoes of love, the rest is yours.",
  "Only 6 memories allowed. Six pieces of your story, the rest is poetry.",
  "Only 6 memories allowed. Six glimpses of forever, the rest is dream.",
  "Only 6 memories allowed. Six moments of heart, the rest is prayer.",
  "Only 6 memories allowed. Six pieces of truth, the rest is space.",
  "Only 6 memories allowed. Six echoes of soul, the rest is light.",
  "Only 6 memories allowed. Six pieces of love, the rest is song.",
  "Only 6 memories allowed. Six moments of story, the rest is verse.",
  "Only 6 memories allowed. Six pieces of heart, the rest is dream.",
  "Only 6 memories allowed. Six echoes of truth, the rest is yours.",
  "Only 6 memories allowed. Six moments of soul, the rest is sacred.",
  "Only 6 memories allowed. Six pieces of love, the rest is private."
];

export default function SubmitPage() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");

  // Pre-fill recipient from ?to= query param (e.g. from /name/[name] pages)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get("to");
      if (toParam) {
        setRecipient(toParam.trim());
      }
    } catch { /* ignore */ }
  }, []);
  const [color, setColor] = useState("default");
  const [specialEffect, setSpecialEffect] = useState("");
  const [timeCapsuleDelayMinutes, setTimeCapsuleDelayMinutes] = useState<number>(0);
  const [destructDelayMinutes, setDestructDelayMinutes] = useState<number>(0);
  const [nightOnly, setNightOnly] = useState(false);
  // Full background is enforced everywhere now
  const fullBg = true;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [tag, setTag] = useState("");
  const [subTag, setSubTag] = useState("");
  const [enableTypewriter, setEnableTypewriter] = useState(false);

  const [limitMsg, setLimitMsg] = useState("");
  const [specialEffectVisible, setSpecialEffectVisible] = useState(false);
  const [hasCrossed, setHasCrossed] = useState(false);
  const [isUnlimitedUser, setIsUnlimitedUser] = useState(false);

  useEffect(() => {
    async function fetchIP() {
      // Try primary API, then fallback — silently ignore failures (ad-blockers, CORS, rate-limits)
      try {
        const ipCtrl = new AbortController();
        const ipTimer = setTimeout(() => ipCtrl.abort(), 6000);
        const res = await fetch("https://ipapi.co/json/", { signal: ipCtrl.signal });
        clearTimeout(ipTimer);
        if (res.ok) {
          const data = await res.json();
          if (data.ip) { setIpData({ ip: data.ip, country: data.country_name }); return; }
        }
      } catch { /* silent */ }
      // Fallback API
      try {
        const ctrl2 = new AbortController();
        const t2 = setTimeout(() => ctrl2.abort(), 6000);
        const res2 = await fetch("https://api.ipify.org?format=json", { signal: ctrl2.signal });
        clearTimeout(t2);
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.ip) { setIpData({ ip: data2.ip, country: '' }); return; }
        }
      } catch { /* silent */ }
    }
    fetchIP();

    // Check unlimited status once on mount
    (async () => {
      try {
        const statusCtrl = new AbortController();
        const statusTimer = setTimeout(() => statusCtrl.abort(), 10000);
        const res = await fetch('/api/check-user-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid: localStorage.getItem('user_uuid') || getCookie('user_uuid') }),
          signal: statusCtrl.signal,
        });
        clearTimeout(statusTimer);
        if (!res.ok) { setIsUnlimitedUser(false); return; }
        const data = await res.json();
        setIsUnlimitedUser(data.isUnlimited || data.globalOverrideActive || data.isOwner);
      } catch {
        setIsUnlimitedUser(false);
      }
    })();
  }, []);

  const wordCount = message.trim() ? countWords(message) : 0;
  const isSpecialAllowed = wordCount <= SPECIAL_EFFECT_WORD_LIMIT;
  const percentNumber = isUnlimitedUser ? Math.min(wordCount, 100) : Math.min((wordCount / WORD_LIMIT) * 100, 100);
  const percent = percentNumber.toFixed(0);
  const overLimit = wordCount > WORD_LIMIT;

  // Trigger special-effect warning and disable existing effect when crossing 30-word threshold
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (wordCount > SPECIAL_EFFECT_WORD_LIMIT && !hasCrossed) {
      setSpecialEffectVisible(true);
      setHasCrossed(true);
      setSpecialEffect("");
      timer = setTimeout(() => setSpecialEffectVisible(false), 5000);
    } else if (wordCount <= SPECIAL_EFFECT_WORD_LIMIT && hasCrossed) {
      setHasCrossed(false);
    }
    return () => clearTimeout(timer);
  }, [wordCount, hasCrossed]);

  // Random message when exceeding 50 words — auto-dismiss after 5 seconds
  const [limitMsgVisible, setLimitMsgVisible] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (overLimit) {
      setLimitMsg(
        limitMessages[Math.floor(Math.random() * limitMessages.length)]
      );
      setLimitMsgVisible(true);
      timer = setTimeout(() => setLimitMsgVisible(false), 5000);
    } else {
      setLimitMsgVisible(false);
    }
    return () => clearTimeout(timer);
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
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 10000);
        const response = await fetch('/api/check-user-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid }),
          signal: ctrl.signal,
        });
        clearTimeout(timer);

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

  // Reset tag and subTag when typewriter is disabled
  useEffect(() => {
    if (!enableTypewriter) {
      setTag("");
      setSubTag("");
    }
  }, [enableTypewriter]);

  // Disable typewriter when destruct is selected (they conflict on the card)
  useEffect(() => {
    if (destructDelayMinutes > 0 && enableTypewriter) {
      setEnableTypewriter(false);
    }
  }, [destructDelayMinutes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mutual exclusion: Time Capsule vs Destruction vs Night Only (all three mutually exclusive)
  useEffect(() => {
    if (timeCapsuleDelayMinutes > 0) {
      if (destructDelayMinutes > 0) setDestructDelayMinutes(0);
      if (nightOnly) setNightOnly(false);
    }
  }, [timeCapsuleDelayMinutes]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (destructDelayMinutes > 0) {
      if (timeCapsuleDelayMinutes > 0) setTimeCapsuleDelayMinutes(0);
      if (nightOnly) setNightOnly(false);
    }
  }, [destructDelayMinutes]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (nightOnly) {
      if (timeCapsuleDelayMinutes > 0) setTimeCapsuleDelayMinutes(0);
      if (destructDelayMinutes > 0) setDestructDelayMinutes(0);
    }
  }, [nightOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const timeCapsuleOptions: Array<{ value: number; label: string }> = [
    { value: 0, label: "None (submit now)" },
    { value: 7 * 24 * 60, label: "1 week" },
    { value: 30 * 24 * 60, label: "1 month" },
    { value: 3 * 30 * 24 * 60, label: "3 months" },
    { value: 6 * 30 * 24 * 60, label: "6 months" },
    { value: 9 * 30 * 24 * 60, label: "9 months" },
    { value: 365 * 24 * 60, label: "1 year" },
  ];

  const destructOptions: Array<{ value: number; label: string }> = [
    { value: 0, label: "Never (do not destruct)" },
    { value: 7 * 24 * 60, label: "1 week" },
    { value: 30 * 24 * 60, label: "1 month" },
    { value: 3 * 30 * 24 * 60, label: "3 months" },
    { value: 6 * 30 * 24 * 60, label: "6 months" },
    { value: 9 * 30 * 24 * 60, label: "9 months" },
    { value: 365 * 24 * 60, label: "1 year" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (overLimit) {
      let allowed = false;
      try {
        const limitCtrl = new AbortController();
        const limitTimer = setTimeout(() => limitCtrl.abort(), 10000);
        const res = await fetch('/api/check-user-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid: localStorage.getItem('user_uuid') || getCookie('user_uuid') }),
          signal: limitCtrl.signal,
        });
        clearTimeout(limitTimer);
        if (res.ok) {
          const status = await res.json();
          allowed = status.isUnlimited || status.globalOverrideActive || status.isOwner;
        }
      } catch {
        // network failure or timeout => treat as not allowed
      }
      if (!allowed) {
        setError("Submission not allowed. Maximum word limit is 50.");
        setIsSubmitting(false);
        return;
      }
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

    // Enhanced ban and limit checking via API route (with 10s timeout — server re-checks anyway)
    try {
      const statusCheck = await Promise.race([
        fetch('/api/check-user-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid }),
        }).then(async (res) => {
          if (!res.ok) return { blocked: false, reason: '' };
          const data = await res.json();
          if (data.isBanned) return { blocked: true, reason: 'banned' };
          if (data.hasReachedLimit) return { blocked: true, reason: 'limit' };
          return { blocked: false, reason: '' };
        }),
        new Promise<{ blocked: false; reason: '' }>((resolve) =>
          setTimeout(() => resolve({ blocked: false, reason: '' }), 10000)
        ),
      ]);

      if (statusCheck.blocked) {
        if (statusCheck.reason === 'banned') {
          setError("You are banned from submitting memories.");
          setIsBanned(true);
        } else {
          setError(twoMemoryLimitMessages[Math.floor(Math.random() * twoMemoryLimitMessages.length)]);
        }
        setHasReachedLimit(true);
        setIsFormDisabled(true);
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Unexpected error during validation:", err);
      // Let server handle validation — don't block submission
    }

    const shortTag = enableTypewriter && tag && subTag ? getShortTag(subTag) : null;

    const submission = {
      recipient: recipient.trim(),
      message: message.trim(),
      sender: sender.trim() || undefined,
      color,
      full_bg: fullBg,
      animation: specialEffect || undefined,
      uuid: uuid || undefined,
      tag: enableTypewriter ? (tag || undefined) : undefined,
      sub_tag: shortTag || undefined,  // Convert to short tag
      typewriter_enabled: enableTypewriter,
      time_capsule_delay_minutes: timeCapsuleDelayMinutes || undefined,
      destruct_delay_minutes: destructDelayMinutes || undefined,
      night_only: nightOnly,
      night_tz: (() => {
        try {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
          return undefined;
        }
      })(),
    };

    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(`Message must be ${MAX_MESSAGE_LENGTH} characters or less.`);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Client-side word length validation (with fun error messages!)
    if (!isUnlimitedUser) {
      const messageCheck = hasSuspiciouslyLongWords(message);
      if (!messageCheck.valid) {
        setError(messageCheck.error || "Message contains words that are too long.");
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Check recipient for long words
      const recipientCheck = hasSuspiciouslyLongWords(recipient);
      if (!recipientCheck.valid) {
        setError(recipientCheck.error || "Recipient name is too long or contains concatenated words. Please use spaces.");
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // All client-side validation passed - show success immediately for smooth UX
    setSubmitted(true);
    setError("");
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Process submission in background (non-blocking, 15s timeout)
    const submitCtrl = new AbortController();
    const submitTimer = setTimeout(() => submitCtrl.abort(), 15000);
    fetch('/api/submit-memory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
      signal: submitCtrl.signal,
    }).then(response => {
      clearTimeout(submitTimer);
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (response.status === 429) {
          // Rate limit or memory limit reached - critical error
          setSubmitted(false);
          setError(result.error || "Too many requests. Please slow down.");
          setHasReachedLimit(true);
          setIsFormDisabled(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Other errors (400, 500, etc) - log but keep success shown
          // Client-side validation should have caught most issues
          console.error('Background submission failed:', result.error);
        }
      } else {
        // Successfully submitted - user already sees success
      }
    }).catch(err => {
      // Network or parsing error - log but don't disturb user experience
      console.error('Background submission error:', err);
      // Keep success message shown since validation passed
    });
  };



  // Removed decorative leaf color logic

  // Desktop entrance animation variant
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)] relative overflow-x-hidden">
      <header className="bg-[var(--card-bg)] shadow-lg lg:shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-5 text-center">
          <h1 className="text-4xl font-serif desktop-heading submit-desktop-heading">Confess</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li>
                <Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 lg:py-14 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <motion.div
            className="hidden lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {/* Left Panel - Editorial Quote & Guidelines */}
            <motion.div variants={fadeUp} className="lg:col-span-4 lg:sticky lg:top-20">
              <div className="pl-6 border-l-2 border-[var(--accent)]/25">
                <blockquote className="text-2xl font-[var(--font-la-belle-aurore)] italic text-[var(--text)] opacity-80 mb-0 leading-relaxed">
                  &ldquo;Some words are too heavy to send, but too important to keep.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 my-8">
                  <div className="flex-1 h-px bg-[var(--border)]/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/30"></div>
                  <div className="flex-1 h-px bg-[var(--border)]/20"></div>
                </div>
                <div>
                  <h2 className="submit-section-label">Guidelines</h2>
                  <ul className="space-y-3 text-[var(--text)] opacity-75 text-sm">
                    <li className="flex items-start gap-2.5">
                      <span className="w-0.5 h-3 mt-0.5 bg-[var(--accent)]/40 rounded-full flex-shrink-0"></span>
                      Max 50 words. Short, sharp, honest.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-0.5 h-3 mt-0.5 bg-[var(--accent)]/40 rounded-full flex-shrink-0"></span>
                      English only. No hate, spam, or off-topic.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-0.5 h-3 mt-0.5 bg-[var(--accent)]/40 rounded-full flex-shrink-0"></span>
                      Special effects for ≤30 words.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-0.5 h-3 mt-0.5 bg-[var(--accent)]/40 rounded-full flex-shrink-0"></span>
                      6 memories per person. Make them count.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Right Panel - Form */}
            <motion.div variants={fadeUp} className="lg:col-span-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className="bg-[var(--card-bg)] p-16 rounded-2xl shadow-sm border border-[var(--border)]/15 text-center"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-4xl font-[var(--font-la-belle-aurore)] mb-3 text-[var(--text)]"
                  >
                    Sent.
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-sm mb-10 text-[var(--text)]"
                  >
                    Your memory is pending approval.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    <Link
                      href="/"
                      className="inline-block px-8 py-3 bg-[var(--accent)] text-white font-medium rounded-xl hover:opacity-80 transition-opacity text-sm tracking-wide"
                    >
                      Return Home
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                  >
                    <BelowContentAdUnit slot="4174420046" className="mt-10 mb-0 opacity-100" />
                  </motion.div>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-[var(--card-bg)] p-10 rounded-2xl shadow-sm border border-[var(--border)]/15"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50/80 border border-red-200/50 rounded-xl p-4 text-red-600/80 text-center text-sm mb-8"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Section A: Core Message */}
                  <motion.div variants={fadeUp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="submit-field-label">Recipient&apos;s Name*</label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                        disabled={isFormDisabled}
                        className={`submit-input ${
                          isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                        }`}
                        placeholder="Who is this for?"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="submit-field-label">Message* {!isUnlimitedUser && "(max 50 words)"} {isUnlimitedUser && <span className="text-pink-500 normal-case tracking-normal">🌸 No word limit</span>}</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={MAX_MESSAGE_LENGTH}
                        required
                        rows={6}
                        disabled={isFormDisabled}
                        className={`submit-input resize-none ${
                          isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                        }`}
                        placeholder="What did you never say?"
                      />
                      <div className="space-y-1.5">
                        <div className="relative h-1 w-full bg-[var(--border)]/15 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isUnlimitedUser ? "bg-[var(--accent)]" : (wordCount <= SPECIAL_EFFECT_WORD_LIMIT ? "bg-[var(--accent)]" : wordCount <= WORD_LIMIT ? "bg-[var(--secondary)]" : "bg-red-500")
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--text)] opacity-40">{isUnlimitedUser ? `${wordCount} words` : `${wordCount} / 50`}</span>
                          {wordCount > SPECIAL_EFFECT_WORD_LIMIT && specialEffectVisible && (
                            <span className="text-red-500">
                              Special effects disabled beyond 30 words.
                            </span>
                          )}
                          {overLimit && !isUnlimitedUser && (
                            <span className="text-red-500">{limitMsg}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div className="h-px bg-[var(--border)]/15 my-8"></div>

                  {/* Section B: Identity & Appearance */}
                  <motion.div variants={fadeUp} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="submit-field-label">Your Name (optional)</label>
                      <input
                        type="text"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                        disabled={isFormDisabled}
                        className={`submit-input ${
                          isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                        }`}
                        placeholder="Anonymous"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="submit-field-label">Color Theme</label>
                      <div className="grid grid-cols-7 gap-2">
                        {colorOptions.map((o) => (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => setColor(o.value)}
                            disabled={isFormDisabled}
                            title={o.label}
                            className={`relative aspect-square rounded-lg border transition-all duration-200 ${
                              color === o.value
                                ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--card-bg)] scale-110 border-transparent'
                                : 'border-black/[0.06] hover:scale-105 hover:ring-1 hover:ring-[var(--border)]'
                            } ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            style={{ backgroundColor: colorBgMap[o.value] || '#E8E0D0' }}
                          >
                            {color === o.value && (
                              <motion.div
                                layoutId="colorCheck"
                                className="absolute inset-0 flex items-center justify-center"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              >
                                <div className="w-2 h-2 rounded-full bg-[var(--text)]/60"></div>
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-[var(--text)] opacity-40 mt-1">
                        {colorOptions.find(o => o.value === color)?.label || 'Default'}
                      </p>
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div className="h-px bg-[var(--border)]/15 my-8"></div>

                  {/* Section C: Effects */}
                  <motion.div variants={fadeUp}>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="submit-field-label">Special Effect</label>
                        <select
                          value={specialEffect}
                          onChange={(e) => setSpecialEffect(e.target.value)}
                          disabled={!isSpecialAllowed || isFormDisabled}
                          className={`submit-input ${
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

                      <div className="space-y-1.5">
                        <label className="submit-field-label">Time Capsule</label>
                        {(destructDelayMinutes > 0 || nightOnly) && <span className="text-[10px] italic opacity-40">Disabled</span>}
                        <select
                          value={timeCapsuleDelayMinutes}
                          onChange={(e) => setTimeCapsuleDelayMinutes(Number(e.target.value) || 0)}
                          disabled={isFormDisabled || destructDelayMinutes > 0 || nightOnly}
                          className={`submit-input ${
                            (isFormDisabled || destructDelayMinutes > 0 || nightOnly) ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                        >
                          {timeCapsuleOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="submit-field-label">Self-Destruct</label>
                        {(timeCapsuleDelayMinutes > 0 || nightOnly) && <span className="text-[10px] italic opacity-40">Disabled</span>}
                        <select
                          value={destructDelayMinutes}
                          onChange={(e) => setDestructDelayMinutes(Number(e.target.value) || 0)}
                          disabled={isFormDisabled || timeCapsuleDelayMinutes > 0 || nightOnly}
                          className={`submit-input ${
                            (isFormDisabled || timeCapsuleDelayMinutes > 0 || nightOnly) ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                        >
                          {destructOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div className="h-px bg-[var(--border)]/15 my-8"></div>

                  {/* Section D: Additional Options */}
                  <motion.div variants={fadeUp}>
                    <p className="submit-section-label mb-3">Additional Options</p>
                    <div className="p-6 rounded-xl bg-[var(--background)]/50 border border-[var(--border)]/10">
                      <div className="flex items-center gap-3">
                        <input
                          id="enableTypewriter"
                          type="checkbox"
                          checked={enableTypewriter}
                          onChange={(e) => setEnableTypewriter(e.target.checked)}
                          disabled={isFormDisabled || destructDelayMinutes > 0}
                          className={`h-4 w-4 accent-[var(--accent)] rounded-sm ${
                            (isFormDisabled || destructDelayMinutes > 0) ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        />
                        <label htmlFor="enableTypewriter" className="text-[var(--text)] text-sm opacity-70">
                          Enable typewriter text on memory card
                        </label>
                        {destructDelayMinutes > 0 && (
                          <span className="text-[10px] text-[var(--text)] opacity-40 italic">Disabled when destruct is active</span>
                        )}
                      </div>

                      <AnimatePresence>
                        {enableTypewriter && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-2 gap-4 pt-3 mt-3 border-t border-[var(--border)]/10">
                              <div className="space-y-1.5">
                                <label className="submit-field-label">Emotion Tag</label>
                                <select
                                  value={tag}
                                  onChange={(e) => setTag(e.target.value)}
                                  disabled={isFormDisabled}
                                  className={`submit-input ${
                                    isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                                  }`}
                                >
                                  <option value="">Mixed emotions</option>
                                  {typewriterTags.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              {tag && (
                                <div className="space-y-1.5">
                                  <label className="submit-field-label">Specific Emotion</label>
                                  <select
                                    value={subTag}
                                    onChange={(e) => setSubTag(e.target.value)}
                                    disabled={isFormDisabled}
                                    className={`submit-input ${
                                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                                    }`}
                                  >
                                    <option value="">All {tag} emotions</option>
                                    {getSubTags(tag).map((st) => (
                                      <option key={st} value={st}>{st}</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="mt-3 pt-3 border-t border-[var(--border)]/10">
                        <div className="flex items-center gap-3">
                          <input
                            id="nightOnly"
                            type="checkbox"
                            checked={nightOnly}
                            onChange={(e) => setNightOnly(e.target.checked)}
                            disabled={isFormDisabled || timeCapsuleDelayMinutes > 0 || destructDelayMinutes > 0}
                            className={`h-4 w-4 accent-[var(--accent)] rounded-sm ${
                              (isFormDisabled || timeCapsuleDelayMinutes > 0 || destructDelayMinutes > 0) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          />
                          <label htmlFor="nightOnly" className="text-[var(--text)] text-sm opacity-70">
                            Night-only (visible 9PM–6AM)
                          </label>
                          {(timeCapsuleDelayMinutes > 0 || destructDelayMinutes > 0) && <span className="text-[10px] italic opacity-40">Disabled</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <div className="pt-8">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || hasReachedLimit || isFormDisabled}
                      whileHover={!(isSubmitting || hasReachedLimit || isFormDisabled) ? { scale: 1.015 } : {}}
                      whileTap={!(isSubmitting || hasReachedLimit || isFormDisabled) ? { scale: 0.985 } : {}}
                      className={`w-full px-6 py-3.5 text-sm font-medium tracking-wide rounded-xl transition-all duration-300 ${
                        isSubmitting || hasReachedLimit || isFormDisabled
                          ? 'opacity-40 cursor-not-allowed bg-[var(--border)] text-[var(--text)]'
                          : 'bg-[var(--accent)] text-white hover:shadow-[0_0_20px_rgba(74,106,138,0.25)] shadow-sm'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <InlineLoader />
                          Submitting...
                        </div>
                      ) : isBanned ? 'Banned from Submitting' :
                       hasReachedLimit ? 'Memory Limit Reached' :
                       'Submit Memory'}
                    </motion.button>
                    <p className="text-center text-xs text-[var(--text)] opacity-50 mt-3">
                      By submitting, you agree to our{" "}
                      <Link href="/terms" className="underline hover:opacity-80">Terms</Link> and{" "}
                      <Link href="/privacy-policy" className="underline hover:opacity-80">Privacy Policy</Link>.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {!submitted && (
              <div className="bg-[var(--card-bg)]/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl mb-6">
                <p className="text-center text-[var(--text)]/80">
                  Share your unsent message. Keep it honest, heartfelt, and in English only. <strong>Off-topic submissions will be rejected.</strong>
                </p>
              </div>
            )}

            {submitted ? (
              <div className="bg-[var(--secondary)] p-8 rounded-2xl shadow-xl text-center animate-fade-in">
                <div className="text-3xl font-bold mb-4 animate-bounce">Sent!</div>
                <p className="mb-6">Your memory is pending approval. Please wait while we review it.</p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  Return Home
                </Link>
                <div className="mt-8">
                  <BelowContentAdUnit slot="4174420046" className="mt-0 mb-0 opacity-100" />
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[var(--card-bg)]/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl space-y-6"
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block font-medium text-[var(--text)] mb-2">Recipient&apos;s Name*</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                    disabled={isFormDisabled}
                    className={`w-full p-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                    placeholder="Who is this for?"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--text)] mb-2">Message* {!isUnlimitedUser && "(max 50 words)"} {isUnlimitedUser && <span className="text-pink-500">🌸 You're special! No word limit.</span>}</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={MAX_MESSAGE_LENGTH}
                    required
                    rows={5}
                    disabled={isFormDisabled}
                    className={`w-full p-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition resize-none ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                    placeholder="What did you never say?"
                  />
                  <div className="mt-2 space-y-1">
                    <div className="relative h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        wordCount <= SPECIAL_EFFECT_WORD_LIMIT
                          ? "bg-[var(--accent)]"
                          : wordCount <= WORD_LIMIT
                          ? "bg-[var(--secondary)]"
                          : "bg-red-500"
                        }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-mono text-[var(--text)]/70">{isUnlimitedUser ? `${wordCount} words` : `${wordCount} / 50`}</span>
                    {wordCount > SPECIAL_EFFECT_WORD_LIMIT && specialEffectVisible && (
                        <span className="text-red-500">Special effects disabled beyond 30 words.</span>
                    )}
                    {overLimit && !isUnlimitedUser && limitMsgVisible && (
                        <span className="text-red-500">{limitMsg}</span>
                    )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[var(--text)] mb-2">Your Name (optional)</label>
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    disabled={isFormDisabled}
                    className={`w-full p-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition ${
                      isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                    placeholder="Anonymous"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--text)] mb-2">Color Theme</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={isFormDisabled}
                    className={`w-full p-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition ${
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
                  <label className="block font-medium text-[var(--text)] mb-2">Special Effect (optional)</label>
                  <select
                    value={specialEffect}
                    onChange={(e) => setSpecialEffect(e.target.value)}
                    disabled={!isSpecialAllowed || isFormDisabled}
                    className={`w-full p-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition disabled:opacity-50 ${
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
                  <label className="block font-medium text-[var(--text)] mb-2">Time Capsule (optional)</label>
                  {(destructDelayMinutes > 0 || nightOnly) && <span className="text-xs italic block mb-1" style={{ color: '#6b7280' }}>Disabled when destruct or night-only is active</span>}
                  <select
                    value={timeCapsuleDelayMinutes}
                    onChange={(e) => setTimeCapsuleDelayMinutes(Number(e.target.value) || 0)}
                    disabled={isFormDisabled || destructDelayMinutes > 0 || nightOnly}
                    className={`w-full p-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition ${
                      (isFormDisabled || destructDelayMinutes > 0 || nightOnly) ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                  >
                    {timeCapsuleOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[var(--text)] mb-2">Destructing Message (optional)</label>
                  {(timeCapsuleDelayMinutes > 0 || nightOnly) && <span className="text-xs italic block mb-1" style={{ color: '#6b7280' }}>Disabled when time capsule or night-only is active</span>}
                  <select
                    value={destructDelayMinutes}
                    onChange={(e) => setDestructDelayMinutes(Number(e.target.value) || 0)}
                    disabled={isFormDisabled || timeCapsuleDelayMinutes > 0 || nightOnly}
                    className={`w-full p-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition ${
                      (isFormDisabled || timeCapsuleDelayMinutes > 0 || nightOnly) ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                    }`}
                  >
                    {destructOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-[var(--secondary)]/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <input
                      id="enableTypewriter-mobile"
                      type="checkbox"
                      checked={enableTypewriter}
                      onChange={(e) => setEnableTypewriter(e.target.checked)}
                      disabled={isFormDisabled || destructDelayMinutes > 0}
                      className={`h-4 w-4 accent-[var(--accent)] rounded ${
                        (isFormDisabled || destructDelayMinutes > 0) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                    <label htmlFor="enableTypewriter-mobile" className="text-[var(--text)] font-medium">
                      Enable typewriter text on memory card (optional)
                    </label>
                    {destructDelayMinutes > 0 && (
                      <span className="text-xs text-[var(--text)]/60 italic">Disabled when destruct is active</span>
                    )}
                  </div>

                  {enableTypewriter && (
                    <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Emotion Tag (optional)</label>
                      <select
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        disabled={isFormDisabled}
                        className={`w-full p-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition ${
                          isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                        }`}
                      >
                        <option value="">Mixed emotions</option>
                        {typewriterTags.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {tag && (
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">Specific Emotion (optional)</label>
                        <select
                          value={subTag}
                          onChange={(e) => setSubTag(e.target.value)}
                          disabled={isFormDisabled}
                          className={`w-full p-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition ${
                            isFormDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                          }`}
                        >
                          <option value="">All {tag} emotions</option>
                          {getSubTags(tag).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                        )}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-[var(--accent)]/10">
                    <div className="flex items-center gap-3">
                      <input
                        id="nightOnly-mobile"
                        type="checkbox"
                        checked={nightOnly}
                        onChange={(e) => setNightOnly(e.target.checked)}
                        disabled={isFormDisabled || timeCapsuleDelayMinutes > 0 || destructDelayMinutes > 0}
                        className={`h-4 w-4 accent-[var(--accent)] rounded ${
                          (isFormDisabled || timeCapsuleDelayMinutes > 0 || destructDelayMinutes > 0) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                      <label htmlFor="nightOnly-mobile" className="text-[var(--text)] font-medium">
                        Night-only (optional, visible 9PM-6AM)
                      </label>
                      {(timeCapsuleDelayMinutes > 0 || destructDelayMinutes > 0) && <span className="text-xs italic block" style={{ color: '#6b7280' }}>Disabled when time capsule or destruct is active</span>}
                    </div>
                  </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || hasReachedLimit || isFormDisabled}
                  className={`w-full px-6 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-xl shadow-lg transition ${
                      isSubmitting || hasReachedLimit || isFormDisabled
                        ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <InlineLoader />
                        Submitting...
                      </div>
                    ) : isBanned ? 'Banned from Submitting' :
                     hasReachedLimit ? 'Memory Limit Reached' : 
                     'Submit Memory'}
                  </button>
                  <p className="text-center text-xs text-[var(--text)] opacity-50 mt-3">
                    By submitting, you agree to our{" "}
                    <Link href="/terms" className="underline hover:opacity-80">Terms</Link> and{" "}
                    <Link href="/privacy-policy" className="underline hover:opacity-80">Privacy Policy</Link>.
                  </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
