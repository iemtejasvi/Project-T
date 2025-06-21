"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

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

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
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

  // Check memory limit on component mount and when IP/UUID changes
  useEffect(() => {
    async function checkMemoryLimit() {
      let uuid = null;
      if (typeof window !== 'undefined') {
        uuid = localStorage.getItem('user_uuid') || getCookie('user_uuid');
      }

      if (ipData?.ip || uuid) {
        const { count, error: memErr } = await supabase
          .from("memories")
          .select("*", { count: "exact" })
          .or([
            ipData?.ip ? `ip.eq.${ipData.ip}` : null,
            uuid ? `uuid.eq.${uuid}` : null
          ].filter(Boolean).join(","));
        
        if (memErr) console.error("Error checking submission count:", memErr);
        if (count && count >= 2) {
          setHasReachedLimit(true);
          setError(twoMemoryLimitMessages[Math.floor(Math.random() * twoMemoryLimitMessages.length)]);
        }
      }
    }

    if (ipData) {
      checkMemoryLimit();
    }
  }, [ipData]);

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
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Get UUID from localStorage or cookie
    let uuid = null;
    if (typeof window !== 'undefined') {
      uuid = localStorage.getItem('user_uuid') || getCookie('user_uuid');
    }

    // Check if banned by IP or UUID
    if (ipData?.ip || uuid) {
      const { data: banData, error: banErr } = await supabase
        .from("banned_users")
        .select("id")
        .or([
          ipData?.ip ? `ip.eq.${ipData.ip}` : null,
          uuid ? `uuid.eq.${uuid}` : null
        ].filter(Boolean).join(","));
      if (banErr) console.error("Error checking banned users:", banErr);
      if (banData && banData.length > 0) {
        setError("You are banned from submitting memories.");
        setIsSubmitting(false);
        return;
      }
    }

    // Check if user has already submitted 2 memories (by IP or UUID)
    if (ipData?.ip || uuid) {
      const { count, error: memErr } = await supabase
        .from("memories")
        .select("*", { count: "exact" })
        .or([
          ipData?.ip ? `ip.eq.${ipData.ip}` : null,
          uuid ? `uuid.eq.${uuid}` : null
        ].filter(Boolean).join(","));
      if (memErr) console.error("Error checking submission count:", memErr);
      if (count && count >= 2) {
        setError(twoMemoryLimitMessages[Math.floor(Math.random() * twoMemoryLimitMessages.length)]);
        setHasReachedLimit(true);
        setIsSubmitting(false);
        return;
      }
    }

    const submission = {
      recipient,
      message,
      sender,
      status: "pending",
      color,
      full_bg: fullBg,
      animation: specialEffect,
      ip: ipData?.ip || null,
      country: ipData?.country || null,
      uuid: uuid || null,
    };

    const { error: insertErr } = await supabase
      .from("memories")
      .insert([submission]);
    if (insertErr) {
      console.error(insertErr);
      setError("Error submitting your memory.");
      setIsSubmitting(false);
    } else {
      setSubmitted(true);
    }
  };

  // Helper function to get cookie value
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <header className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <h1 className="text-4xl font-serif">Submit a Memory</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex justify-center gap-6">
              <li>
                <Link href="/" className="hover:text-[var(--accent)] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-[var(--accent)] transition">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[var(--accent)] transition">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        {!submitted && (
          <div className="max-w-2xl w-full bg-[var(--card-bg)] backdrop-blur-sm bg-opacity-60 p-6 rounded-2xl shadow-2xl mb-8">
            <p className="text-center italic font-medium">
              Share your unsent message. Keep it honest, heartfelt, and in English only. <strong>Off-topic submissions will be rejected.</strong>
            </p>
          </div>
        )}

        {submitted ? (
          <div className="max-w-2xl w-full bg-[var(--secondary)] p-8 rounded-2xl shadow-xl text-center animate-fade-in">
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
            className="w-full max-w-2xl bg-[var(--card-bg)] backdrop-blur-sm bg-opacity-70 p-8 rounded-2xl shadow-2xl space-y-6"
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
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>

            <div>
              <label className="block font-serif">Message* (max 50 words)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
              <div className="relative h-2 w-full bg-[var(--border)] rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    wordCount <= 30
                      ? "bg-[var(--accent)]"
                      : wordCount <= 50
                      ? "bg-[var(--secondary)]"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>{wordCount} / 50</span>
                {wordCount > 30 && specialEffectVisible && (
                  <span className="text-red-500">
                    Special effects disabled beyond 30 words.
                  </span>
                )}
                {overLimit && (
                  <span className="text-red-500">{limitMsg}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block font-serif">Your Name (optional)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>

            <div>
              <label className="block font-serif">Select a Color (optional)</label>
              <select
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  // Automatically set fullBg to true for any color except default
                  setFullBg(e.target.value !== "default");
                }}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
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
                disabled={!isSpecialAllowed}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition disabled:opacity-50"
              >
                {specialEffects.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="fullBg"
                type="checkbox"
                checked={fullBg}
                onChange={(e) => setFullBg(e.target.checked)}
                className="h-5 w-5 accent-[var(--accent)]"
              />
              <label htmlFor="fullBg" className="font-serif">
                Apply color to full card background
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || hasReachedLimit}
                className={`px-8 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg transition-transform ${
                  isSubmitting || hasReachedLimit 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Memory'}
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="bg-[var(--card-bg)] shadow-inner">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
