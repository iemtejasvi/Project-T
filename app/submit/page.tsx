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
  const maxWords = 250;
  const specialLimit = 30;
  const percent = Math.min((wordCount / maxWords) * 100, 100);
  const specialPercent = Math.min((wordCount / specialLimit) * 100, 100);
  const isSpecialEffectAllowed = wordCount <= specialLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (wordCount > maxWords) {
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
      if (bannedData?.length) {
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

    const { error } = await supabase.from("memories").insert([submission]);
    if (error) {
      setError("Error submitting your memory.");
      console.error(error);
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
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <h1 className="text-4xl font-serif text-[var(--text)]">Submit a Memory</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <Link href="/" className="transition hover:text-[var(--accent)]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="transition hover:text-[var(--accent)]">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="transition hover:text-[var(--accent)]">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-2xl bg-[var(--card-bg)] p-8 rounded-2xl shadow-2xl transition transform hover:-translate-y-1">
          {submitted ? (
            <div className="p-10 bg-[var(--secondary)] rounded-xl text-center font-medium animate-fade-in">
              Thank you for your submission! Your memory is pending approval.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500 text-center font-medium">{error}</p>}

              <div>
                <label className="block text-lg font-serif text-[var(--text)]">
                  Recipient's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                  className="mt-2 block w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                />
              </div>

              <div>
                <label className="block text-lg font-serif text-[var(--text)]">
                  Message <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-[var(--text)] mb-1">
                  Maximum {maxWords} words. Current: {wordCount}
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="mt-2 block w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition resize-none"
                ></textarea>

                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="w-full h-3 rounded-full bg-[var(--border)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        background: wordCount <= specialLimit ? 'var(--accent)' : 'var(--accent-hover)',
                      }}
                    ></div>
                    {/* Special threshold marker */}
                    <div
                      className="absolute h-3 w-px bg-[var(--border)]"
                      style={{ left: `${(specialLimit / maxWords) * 100}%` }}
                    ></div>
                  </div>
                  {!isSpecialEffectAllowed && (
                    <p className="text-sm italic text-red-500 mt-1">
                      Special effects disabled after {specialLimit} words.
                    </p>
                  )}
                  {wordCount >= maxWords && (
                    <p className="text-sm italic text-red-500 mt-1">
                      You have reached the word limit of {maxWords}.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-lg font-serif text-[var(--text)]">Your Name</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="mt-2 block w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-serif text-[var(--text)]">
                    Message Color
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-2 block w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                  >
                    {colorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-serif text-[var(--text)]">
                    Special Effect
                  </label>
                  <select
                    value={specialEffect}
                    onChange={(e) => setSpecialEffect(e.target.value)}
                    disabled={!isSpecialEffectAllowed}
                    className="mt-2 block w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition disabled:opacity-50"
                  >
                    {specialEffectOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={fullBg}
                  onChange={(e) => setFullBg(e.target.checked)}
                  id="fullBg"
                  className="h-5 w-5 text-[var(--accent)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--accent)] transition"
                />
                <label htmlFor="fullBg" className="ml-3 text-lg font-serif text-[var(--text)]">
                  Apply full-card background color
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 text-lg font-semibold rounded-2xl shadow-lg bg-[var(--accent)] text-[var(--text)] hover:bg-[var(--accent-hover)] transition transform hover:-translate-y-0.5"
              >
                Submit Memory
              </button>
            </form>
          )}
        </div>
      </main>
      <footer className="bg-[var(--card-bg)] mt-auto shadow-inner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
