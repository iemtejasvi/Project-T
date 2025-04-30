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

  // Fetch IP and geo info on mount using ipapi.co
  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const mappedData: IPData = {
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
        };
        setIpData(mappedData);
      } catch (err) {
        console.error("Error fetching IP info:", err);
      }
    }
    fetchIP();
  }, []);

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const maxWords = 250;
  const effectLimit = 30;
  const isEffectAllowed = wordCount <= effectLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (wordCount > maxWords) {
      setError(`Message cannot exceed ${maxWords} words.`);
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
      if (bannedData?.length) {
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

    const { error: insertError } = await supabase.from("memories").insert([submission]);
    if (insertError) {
      setError("Error submitting your memory.");
      console.error(insertError);
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

  // Calculate percentage
  const percentage = Math.min((wordCount / maxWords) * 100, 100);
  const effectPercentage = Math.min((wordCount / effectLimit) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <header className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-serif text-[var(--text)]">Submit a Memory</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              {['/', '/memories', '/how-it-works'].map((path, idx) => (
                <li key={path}>
                  <Link href={path} className="text-lg hover:text-[var(--accent)] transition-colors">
                    {['Home', 'Memories', 'How It Works'][idx]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-8 w-full">
        {submitted ? (
          <div className="bg-[var(--secondary)] text-[var(--text)] p-8 rounded-2xl shadow-2xl text-center animate-fade-in">
            <p className="text-2xl font-serif mb-4">Thank you for your submission!</p>
            <p className="italic">Your memory is pending approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 bg-[var(--card-bg)] p-8 rounded-2xl shadow-2xl">
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}

            {/* Recipient */}
            <div>
              <label className="block font-serif text-xl text-[var(--text)]">Recipient's Name *</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="mt-2 w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>

            {/* Message with Progress Bar */}
            <div>
              <label className="block font-serif text-xl text-[var(--text)]">Message *</label>
              <p className="text-sm text-[var(--text)] mb-2">Max {maxWords} words. Special effects until {effectLimit} words.</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="mt-2 w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition resize-none"
              />

              {/* Progress Bar Container */}
              <div className="mt-4 w-full h-4 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-width duration-500 ease-out rounded-full"
                  style={{ width: `${percentage}%`, background: 'linear-gradient(to right, var(--accent) ${effectPercentage}%, var(--accent-muted) ${effectPercentage}% 100%)` }}
                />
              </div>
              {/* Messages */}
              <div className="mt-2 text-sm text-[var(--text)]">
                {wordCount > effectLimit && (
                  <p className="italic text-yellow-600">Special effects cannot be used beyond {effectLimit} words.</p>
                )}
                {wordCount > maxWords && (
                  <p className="italic text-red-600">You have exceeded the {maxWords}-word limit.</p>
                )}
              </div>
            </div>

            {/* Sender */}
            <div>
              <label className="block font-serif text-xl text-[var(--text)]">Your Name (optional)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="mt-2 w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>

            {/* Color Selector */}
            <div>
              <label className="block font-serif text-xl text-[var(--text)]">Select a Color (optional)</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-2 w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              >
                {colorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Special Effect */}
            <div>
              <label className="block font-serif text-xl text-[var(--text)]">Special Effect</label>
              <select
                value={specialEffect}
                onChange={(e) => setSpecialEffect(e.target.value)}
                disabled={!isEffectAllowed}
                className="mt-2 w-full p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              >
                {specialEffectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Full Background Checkbox */}
            <div className="flex items-center">
              <input
                id="fullBg"
                type="checkbox"
                checked={fullBg}
                onChange={(e) => setFullBg(e.target.checked)}
                className="h-5 w-5 text-[var(--accent)] focus:ring-[var(--accent)] transition"
              />
              <label htmlFor="fullBg" className="ml-3 font-serif text-[var(--text)]">
                Apply color to full card background
              </label>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="px-10 py-4 bg-[var(--accent)] text-[var(--text)] font-semibold text-lg rounded-2xl shadow-lg hover:scale-105 transform transition"
              >
                Submit Memory
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card-bg)] shadow-inner">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
