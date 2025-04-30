"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface IPData {
  ip?: string;
  city?: string;
  region?: string;
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

export default function Submit() {
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
          city: data.city,
          region: data.region,
          country: data.country_name,
        });
      } catch (err) {
        console.error("Error fetching IP info:", err);
      }
    }
    fetchIP();
  }, []);

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const isSpecialEffectAllowed = wordCount <= 30;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (wordCount > 250) {
      setError("Message cannot exceed 250 words.");
      return;
    }
    if (!recipient || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    if (ipData?.ip) {
      const { data: bannedData, error: bannedError } = await supabase
        .from("banned_ips")
        .select("*")
        .eq("ip", ipData.ip);
      if (bannedError) console.error("Error checking banned IPs:", bannedError);
      if (bannedData && bannedData.length > 0) {
        setError("You are banned from submitting memories.");
        return;
      }
    }

    const deviceInfo = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
    const submission = {
      recipient,
      message,
      sender,
      status: "pending",
      color,
      full_bg: fullBg,
      letter_style: "default",
      animation: specialEffect,
      ip: ipData?.ip || null,
      city: ipData?.city || null,
      state: ipData?.region || null,
      country: ipData?.country || null,
      device: deviceInfo,
    };

    const { error: supaError } = await supabase.from("memories").insert([submission]);
    if (supaError) {
      setError("Error submitting your memory.");
      console.error(supaError);
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

  // Determine progress bar color
  const progressPercent = Math.min((wordCount / 250) * 100, 100);
  let progressColor = wordCount <= 30 ? "bg-green-400" : "bg-purple-400";
  if (wordCount > 250) progressColor = "bg-red-500";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <header className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Submit a Memory</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6 text-lg">
              {['/', '/memories', '/how-it-works'].map((href, idx) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[var(--accent)] px-3 py-1 rounded-lg transition-colors">
                    {['Home','Memories','How It Works'][idx]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-8 w-full">
        {submitted ? (
          <div className="bg-[var(--secondary)] p-8 rounded-2xl shadow-xl transform animate-fade-in text-center text-xl">
            🎉 Thank you! Your memory is pending approval.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 bg-[var(--card-bg)] p-8 rounded-2xl shadow-2xl w-full">
            {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

            <div className="flex flex-col space-y-2">
              <label className="font-serif text-lg">Recipient's Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-serif text-lg">Message (max 250 words) <span className="text-red-500">*</span></label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
              />
              {/* Progress Bar */}
              <div className="w-full bg-[var(--border)] rounded-full h-3 overflow-hidden">
                <div
                  className={`${progressColor} h-full rounded-full transition-all duration-300`} 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm font-medium">
                {wordCount <= 30
                  ? `${wordCount}/30 words for special effects`
                  : wordCount <= 250
                    ? `⚠️ Special effects disabled beyond 30 words; total ${wordCount}/250 words`
                    : `❌ Word limit exceeded: ${wordCount}/250`}
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-serif text-lg">Your Name (optional)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="font-serif text-lg">Select a Color (optional)</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  {colorOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-serif text-lg">Special Effect</label>
                <select
                  value={specialEffect}
                  onChange={(e) => setSpecialEffect(e.target.value)}
                  disabled={!isSpecialEffectAllowed}
                  className="w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50"
                >
                  {specialEffectOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fullBg"
                checked={fullBg}
                onChange={(e) => setFullBg(e.target.checked)}
                className="w-5 h-5 text-[var(--accent)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--accent)]"
              />
              <label htmlFor="fullBg" className="font-serif text-lg">Apply full card background color</label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-10 py-4 bg-[var(--accent)] font-semibold rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-200"
              >
                Submit Memory
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="bg-[var(--card-bg)] shadow-inner">
        <div className="max-w-4xl mx-auto text-center py-4 text-sm">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
