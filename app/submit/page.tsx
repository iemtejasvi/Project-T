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

const colorOptions = [ /* ... existing options ... */ ];
const specialEffectOptions = [ /* ... existing options ... */ ];

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
  const pctTotal = Math.min((wordCount / 250) * 100, 100);
  const pctSpecial = Math.min((wordCount / 30) * 100, 100);

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
      const { data: bannedData } = await supabase
        .from("banned_ips")
        .select("*")
        .eq("ip", ipData.ip);
      if (bannedData?.length) {
        setError("You are banned from submitting memories.");
        return;
      }
    }

    const deviceInfo = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
    const submission = { /* ... existing fields ... */ };

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[var(--card-bg)] shadow">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-serif text-[var(--text)]">Submit a Memory</h1>
          <nav className="mt-4">
            <ul className="flex flex-wrap justify-center gap-6">
              {/* links... */}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        {submitted ? (
          <div className="bg-[var(--secondary)] p-8 rounded-2xl shadow-xl text-center animate-fade-in">
            <p className="text-lg font-medium text-[var(--text)]">Thank you! Your memory is pending approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 bg-[var(--card-bg)] p-8 rounded-2xl shadow-2xl">
            {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

            {/* Recipient */}
            <div>
              <label className="block font-serif text-lg text-[var(--text)]">Recipient's Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full mt-2 p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] transition"
              />
            </div>

            {/* Message with Progress Bar */}
            <div>
              <label className="block font-serif text-lg text-[var(--text)]">Message (max 250 words)<span className="text-red-500">*</span></label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full mt-2 p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] transition resize-none"
              />

              {/* Progress Bar Container */}
              <div className="relative h-4 w-full bg-[var(--border)] rounded-full overflow-hidden mt-3">
                {/* Special Effect Segment */}
                <div
                  className="absolute top-0 left-0 h-full rounded-l-full"
                  style={{ width: `${pctSpecial}%`, backgroundColor: 'var(--accent)' }}
                />
                {/* Remaining Segment */}
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ width: `${pctTotal}%`, backgroundColor: 'rgba( var(--accent-rgb), 0.5)' }}
                />
              </div>
              {/* Status Messages */}
              <div className="flex justify-between mt-2 text-sm text-[var(--text)]">
                <span>{wordCount} / 250 words</span>
                {!isSpecialEffectAllowed && <span className="text-yellow-500">Special effects unavailable beyond 30 words</span>}
                {wordCount > 250 && <span className="text-red-500">Word limit exceeded!</span>}
              </div>
            </div>

            {/* Sender */}
            <div>
              <label className="block font-serif text-lg text-[var(--text)]">Your Name (optional)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full mt-2 p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] transition"
              />
            </div>

            {/* Color & Effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-serif text-lg text-[var(--text)]">Select a Color (optional)</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full mt-2 p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] transition"
                >
                  {colorOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-serif text-lg text-[var(--text)]">Special Effect</label>
                <select
                  value={specialEffect}
                  onChange={(e) => setSpecialEffect(e.target.value)}
                  disabled={!isSpecialEffectAllowed}
                  className="w-full mt-2 p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] transition"
                >
                  {specialEffectOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            {/* Full Background Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={fullBg}
                onChange={(e) => setFullBg(e.target.checked)}
                id="fullBg"
                className="mr-2"
              />
              <label htmlFor="fullBg" className="font-serif text-[var(--text)]">Apply full background color</label>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-10 py-4 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg hover:scale-105 transform transition"
              >
                Submit Memory
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card-bg)] shadow-inner mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
