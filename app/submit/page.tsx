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

// Custom overflow messages
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
        setIpData({ ip: data.ip, country: data.country_name });
      } catch (err) {
        console.error("Error fetching IP info:", err);
      }
    }
    fetchIP();
  }, []);

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const isSpecialAllowed = wordCount <= 30;
  const percent = Math.min((wordCount / 200) * 100, 100).toFixed(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (wordCount > 200) {
      const randomMessage = overflowMessages[Math.floor(Math.random() * overflowMessages.length)];
      setError(randomMessage);
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
      if (banErr) console.error("Error checking banned IPs:", banErr);
      if (banned && banned.length > 0) {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[var(--background)] via-[var(--card-bg)] to-[var(--secondary)] animate-gradient-xy">
      <header className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <h1 className="text-4xl font-serif text-[var(--text)] mb-2 animate-pulse">Submit a Memory</h1>
          <p className="italic text-sm text-[var(--text-accent)]">Share your final unsent message to an ex, loved one, or pet. Keep it under 200 words or it won't be accepted.</p>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex justify-center gap-6">
              <li><Link href="/" className="hover:text-[var(--accent)] transition">Home</Link></li>
              <li><Link href="/memories" className="hover:text-[var(--accent)] transition">Memories</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[var(--accent)] transition">How It Works</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        {submitted ? (
          <div className="bg-[var(--secondary)] text-[var(--text)] p-8 rounded-2xl shadow-2xl text-center animate-fade">
            Thank you! Your memory is pending approval.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-[var(--card-bg)] p-8 rounded-2xl shadow-2xl space-y-6">
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}

            <div>
              <label className="block font-serif text-[var(--text)]">Recipient’s Name (required):</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} required className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition" />
            </div>

            <div>
              <p className="text-sm text-[var(--text)] mb-1">Message (required, max 200 words):</p>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className="w-full mt-1 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition" />
              <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden mt-2">
                <div className={`h-full rounded-full transition-all duration-300 ${wordCount <= 30 ? "bg-[var(--accent)]" : wordCount <= 200 ? "bg-[var(--secondary)]" : "bg-red-500"}`} style={{ width: `${percent}%` }}></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>{wordCount} / 200</span>
                {wordCount > 30 && wordCount <= 200 && <span className="text-red-500">Special effects disabled beyond 30 words.</span>}
                {wordCount > 200 && <span className="text-red-500">Word limit exceeded.</span>}
              </div>
            </div>

            <div>
              <label className="block font-serif text-[var(--text)]">Your Name (optional):</label>
              <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition" />
            </div>

            <div>
              <label className="block font-serif text-[var(--text)]">Select a Color for Your Message (optional):</label>
              <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition">
                {colorOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-serif text-[var(--text)]">Do you want any special effect?</label>
              <select value={specialEffect} onChange={(e) => setSpecialEffect(e.target.value)} disabled={!isSpecialAllowed} className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition disabled:opacity-50">
                {specialEffectOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="flex items-center">
              <input id="fullBg" type="checkbox" checked={fullBg} onChange={(e) => setFullBg(e.target.checked)} className="mr-2" />
              <label htmlFor="fullBg" className="font-serif text-[var(--text)]">Apply color to full card background</label>
            </div>

            <div className="text-center">
              <button type="submit" className="px-8 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg hover:scale-105 transform transition">Submit Memory</button>
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
