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

  // Warning visibility
  const [showSpecialWarning, setShowSpecialWarning] = useState(false);

  // Fetch geo info
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

  // Word counts & limits
  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const isSpecialAllowed = wordCount <= 30;

  // Trigger special-effects warning
  useEffect(() => {
    if (wordCount > 30 && wordCount <= 250) {
      setShowSpecialWarning(true);
      const timer = setTimeout(() => setShowSpecialWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [wordCount]);

  // Handle submission
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
      const { data: banned, error: banErr } = await supabase
        .from("banned_ips")
        .select("*")
        .eq("ip", ipData.ip);
      if (banErr) console.error("Ban check error:", banErr);
      if (banned && banned.length > 0) {
        setError("You are banned from submitting memories.");
        return;
      }
    }

    const deviceInfo =
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown";

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

  // Percentage for progress bar
  const percent = Math.min((wordCount / 250) * 100, 100).toFixed(0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-xl">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-serif text-[var(--text)]">Submit a Memory</h1>
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

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        {submitted ? (
          <div className="bg-[var(--secondary)] text-[var(--text)] p-8 rounded-2xl shadow-2xl text-center animate-fade-in">
            Thank you! Your memory is pending approval.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-[var(--card-bg)] p-8 rounded-2xl shadow-2xl space-y-6 transition"
          >
            {error && (
              <p className="text-red-500 text-center font-medium">{error}</p>
            )}

            {/* Recipient */}
            <div>
              <label className="block font-serif text-[var(--text)]">
                Recipient&rsquo;s Name (required):
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>

            {/* Message + Progress */}
            <div>
              <p className="text-sm text-[var(--text)] mb-1">
                Message (required, max 250 words):
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full mt-1 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />

              {/* Gradient Progress Bar */}
              <div className="mt-3 h-2 w-full bg-[var(--border)] rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full animate-pulse"
                  style={{
                    width: `${percent}%`,
                    background: `linear-gradient(to right, var(--accent), var(--secondary))`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>{wordCount} / 250</span>
                {showSpecialWarning && wordCount <= 250 && (
                  <span className="text-red-500 transition-opacity duration-500">
                    Special-effects disabled beyond 30 words
                  </span>
                )}
                {wordCount > 250 && (
                  <span className="text-red-500 transition-opacity duration-500">
                    Word limit reached
                  </span>
                )}
              </div>
            </div>

            {/* Sender */}
            <div>
              <label className="block font-serif text-[var(--text)]">
                Your Name (optional):
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>

            {/* Color Picker */}
            <div>
              <label className="block font-serif text-[var(--text)]">
                Select a Color (optional):
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              >
                {colorOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Effect */}
            <div>
              <label className="block font-serif text-[var(--text)]">
                Do you want any special effect?
              </label>
              <select
                value={specialEffect}
                onChange={(e) => setSpecialEffect(e.target.value)}
                disabled={!isSpecialAllowed}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition disabled:opacity-50"
              >
                {specialEffectOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Full Background */}
            <div className="flex items-center">
              <input
                id="fullBg"
                type="checkbox"
                checked={fullBg}
                onChange={(e) => setFullBg(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="fullBg" className="font-serif text-[var(--text)]">
                Apply color to full card background
              </label>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
              >
                Submit Memory
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
