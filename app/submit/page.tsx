"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface IPData {
  ip?: string;
  country?: string;
}

const colorOptions = [
  { value: "default", label: "Default" },
  { value: "mint", label: "Mint" },
  { value: "cherry", label: "Cherry" },
  { value: "sapphire", label: "Sapphire" },
  { value: "lavender", label: "Lavender" },
  { value: "coral", label: "Coral" },
  { value: "olive", label: "Olive" },
  { value: "turquoise", label: "Turquoise" },
  { value: "amethyst", label: "Amethyst" },
  { value: "gold", label: "Gold" },
  { value: "midnight", label: "Midnight" },
  { value: "emerald", label: "Emerald" },
  { value: "ruby", label: "Ruby" },
  { value: "periwinkle", label: "Periwinkle" },
  { value: "peach", label: "Peach" },
  { value: "sky", label: "Sky" },
  { value: "lemon", label: "Lemon" },
  { value: "aqua", label: "Aqua" },
  { value: "berry", label: "Berry" },
  { value: "graphite", label: "Graphite" },
];

const specialEffectOptions = [
  { value: "", label: "None" },
  { value: "bleeding", label: "Bleeding Text Effect" },
  { value: "handwritten", label: "Handwritten Text Effect" },
];

// Overflow messages for >200 words
const overflowMessages = [
  "You’re typing like they still care. Shorten it.",
  "200 words max. If they didn’t read your texts, they won’t read your novel.",
  "Unsent message, not an autobiography. Edit that trauma.",
  "This ain’t your therapist. Keep it under 200, Shakespeare.",
  "They ghosted you, not gave you a book deal. Trim it.",
  "Nobody’s ex read this much. Why should we?",
  "200 words or less. You’re not auditioning for heartbreak Netflix.",
  "Less is more. Oversharing is out.",
  "Unsent doesn’t mean unpublished, Hemingway.",
  "Writing a saga? Nah. This ain’t ‘Lord of the Goodbyes’.",
  "Send a message, not a memoir.",
  "Keep it short. Mystery is sexier than essays.",
  "Your feelings are valid. But also… too damn long.",
  "Brevity is hot. Trauma dumps are not.",
  "This isn’t your diary. It’s a message they’ll never read.",
  "It’s ‘Unsent,’ not ‘Unhinged.’ Chill.",
  "Typing like you're pitching to a publisher. Relax.",
  "You lost them, not the plot. Tighten it up.",
  "This ain't a TED Talk. Drop the mic in 200.",
  "Keep the mystery. Oversharing is a red flag.",
  "We said unsent, not unlimited.",
  "Heartbreak’s poetic, not academic.",
  "If it takes more than 200 words to hurt, you’ve healed.",
  "Save it for your therapist. They get paid to read that much.",
  "Ever heard of a ‘read more’ button? No? Exactly.",
  "This ain't Medium. Don’t medium dump.",
  "If they didn’t reply to a text, why drop a chapter?",
  "200 max. Anything else is just emotional spam.",
  "Word vomit isn’t romantic. Edit that heartbreak.",
  "Oversharing? In this economy?",
  "Tell us how you *feel*, not your life story.",
  "You’re not the main character of this paragraph.",
  "You miss them, not your English teacher. Cut it down.",
  "Pain should punch. Not drone.",
  "Keep it sharp. This ain’t ‘War & Peace’.",
  "They left you on read. You giving them a sequel?",
  "200 words, max. Heal artistically, not endlessly.",
  "Emotional dumping isn’t aesthetic. It’s exhausting.",
  "We came for heartbreak, not homework.",
  "Short and sad, like your situationship."
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

  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setIpData({
          ip: data.ip,
          country: data.country_name,
        });
      } catch (err) {
        console.error("Error fetching IP info:", err);
      }
    }
    fetchIP();
  }, []);

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const isSpecialAllowed = wordCount <= 30;
  const percent = Math.min((wordCount / 200) * 100, 100).toFixed(0);

  // random overflow message when limit crossed
  const overflowNote = useMemo(() => {
    if (wordCount > 200) {
      const idx = Math.floor(Math.random() * overflowMessages.length);
      return overflowMessages[idx];
    }
    return null;
  }, [wordCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (wordCount > 200) {
      setError(overflowNote || "Message cannot exceed 200 words.");
      return;
    }

    if (!recipient || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    if (ipData?.ip) {
      const { data: banned, error: banErr } = await supabase
        .from("banned_ips")
        .select("*")
        .eq("ip", ipData.ip);
      if (banErr) console.error(banErr);
      if (banned && banned.length) {
        setError("You are banned from submitting memories.");
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
    };

    const { error: insertErr } = await supabase.from("memories").insert([submission]);
    if (insertErr) {
      console.error(insertErr);
      setError("Error submitting your memory.");
    } else {
      setSubmitted(true);
      setRecipient("");
      setMessage("");
      setSender("");
      setColor("default");
      setSpecialEffect("");
      setFullBg(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg p-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-serif uppercase tracking-wide drop-shadow-lg animate-pulse">
            Submit an Unsent Memory
          </h1>
          <p className="mt-4 italic text-lg max-w-2xl mx-auto opacity-90">
            For that last unsent message to your ex, a moment with a loved one or pet, or any unsaid confession. Keep it real—anything else won’t be accepted.
          </p>
          <nav className="mt-6 flex justify-center gap-8 text-xl">
            <Link href="/" className="hover:underline hover:opacity-80 transition">
              Home
            </Link>
            <Link href="/memories" className="hover:underline hover:opacity-80 transition">
              Memories
            </Link>
            <Link href="/how-it-works" className="hover:underline hover:opacity-80 transition">
              How It Works
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        {submitted ? (
          <div className="bg-[var(--secondary)] p-10 rounded-2xl shadow-2xl text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p>Your memory is pending approval. We’ll let you know when it goes live.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-[var(--card-bg)] p-10 rounded-3xl shadow-2xl space-y-8 lg:p-12">
            {error && <p className="text-red-400 text-center font-semibold">{error}</p>}

            <div className="space-y-2">
              <label className="block font-serif text-2xl">Recipient’s Name *</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-serif text-2xl">Message * (max 200 words)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition shadow-inner resize-none"
              />
              <div className="h-3 w-full bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    wordCount <= 30
                      ? "bg-[var(--accent)]"
                      : wordCount <= 200
                      ? "bg-[var(--secondary)]"
                      : "bg-red-500 animate-shake"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>{wordCount} / 200</span>
                {wordCount > 30 && wordCount <= 200 && (
                  <span className="text-yellow-400">Special effects disabled beyond 30 words.</span>
                )}
                {wordCount > 200 && (
                  <span className="text-red-400 font-medium">{overflowNote}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-serif text-2xl">Your Name (optional)</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-serif text-2xl">Select Color (optional)</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition shadow-inner"
                >
                  {colorOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-serif text-2xl">Special Effect</label>
                <select
                  value={specialEffect}
                  onChange={(e) => setSpecialEffect(e.target.value)}
                  disabled={!isSpecialAllowed}
                  className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition shadow-inner disabled:opacity-50"
                >
                  {specialEffectOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 mt-6 md:mt-10">
                <input
                  id="fullBg"
                  type="checkbox"
                  checked={fullBg}
                  onChange={(e) => setFullBg(e.target.checked)}
                  className="w-5 h-5 text-[var(--accent)] focus:ring-transparent"
                />
                <label htmlFor="fullBg" className="font-serif text-xl">
                  Full card background color
                </label>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="relative inline-block px-10 py-4 font-semibold rounded-full overflow-hidden transition group bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 text-white shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">Submit Memory</span>
                <span className="absolute inset-0 bg-white opacity-10 transform -translate-x-full group-hover:translate-x-0 transition duration-500"></span>
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="bg-[var(--card-bg)] py-4 shadow-inner text-center text-sm">
        © {new Date().getFullYear()} If Only I Sent This
      </footer>
    </div>
  );
}
