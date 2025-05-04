"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

const limitMessages = [
  /* … the same 40 messages … */
  "You’re typing like they still care. Shorten it.",
  "200 words max. If they didn’t read your texts, they won’t read your novel.",
  // etc.
];

export default function SubmitPage() {
  // Form state
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [color, setColor] = useState("default");
  const [specialEffect, setSpecialEffect] = useState("");
  const [fullBg, setFullBg] = useState(false);

  // Submission + error
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // IP info
  const [ipData, setIpData] = useState<IPData | null>(null);

  // Word count / limits
  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const percent = Math.min((wordCount / 200) * 100, 100).toFixed(0);
  const over200 = wordCount > 200;

  // Special-effect warning
  const [warnVisible, setWarnVisible] = useState(false);
  const hasWarned = useRef(false);

  // Over-200 message
  const [limitMsg, setLimitMsg] = useState("");

  // Typewriter header
  const fullTitle = "Submit a Memory";
  const [title, setTitle] = useState("");
  const titleIdx = useRef(0);

  // Fetch IP once
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => setIpData({ ip: d.ip, country: d.country_name }))
      .catch(() => {});
  }, []);

  // Typewriter effect
  useEffect(() => {
    const iv = setInterval(() => {
      if (titleIdx.current < fullTitle.length) {
        setTitle((t) => t + fullTitle[titleIdx.current]);
        titleIdx.current++;
      } else {
        clearInterval(iv);
      }
    }, 100);
    return () => clearInterval(iv);
  }, []);

  // Warn once each time crossing 30 words
  useEffect(() => {
    if (wordCount > 30 && !hasWarned.current) {
      setWarnVisible(true);
      hasWarned.current = true;
      setTimeout(() => setWarnVisible(false), 5000);
    }
    if (wordCount <= 30) {
      hasWarned.current = false;
    }
  }, [wordCount]);

  // Pick a random limit message when >200
  useEffect(() => {
    if (over200) {
      setLimitMsg(limitMessages[Math.floor(Math.random() * limitMessages.length)]);
    }
  }, [over200]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (over200) {
      setError("Submission not allowed. Maximum word limit is 200.");
      return;
    }
    if (!recipient || !message) {
      setError("Please fill in all required fields.");
      return;
    }
    if (ipData?.ip) {
      const { data: banned } = await supabase
        .from("banned_ips")
        .select("*")
        .eq("ip", ipData.ip);
      if (banned?.length) {
        setError("You are banned from submitting memories.");
        return;
      }
    }
    await supabase.from("memories").insert([{
      recipient,
      message,
      sender,
      status: "pending",
      color,
      full_bg: fullBg,
      animation: specialEffect,
      ip: ipData?.ip,
      country: ipData?.country
    }]);
    setSubmitted(true);
  };

  // Reset for another entry
  const resetForm = () => {
    setSubmitted(false);
    setError("");
    setRecipient("");
    setMessage("");
    setSender("");
    setColor("default");
    setSpecialEffect("");
    setFullBg(false);
    setLimitMsg("");
    setWarnVisible(false);
    hasWarned.current = false;
    titleIdx.current = fullTitle.length; // keep header visible
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <header className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <motion.h1
            className="text-4xl font-serif inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {title}
            <span className="border-r-2 border-[var(--text)] animate-pulse inline-block ml-1 h-6" />
          </motion.h1>
          <motion.hr
            className="my-4 border-[var(--border)]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          />
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <ul className="flex justify-center gap-6">
              {["Home", "Memories", "How It Works"].map((label) => (
                <li key={label}>
                  <Link
                    href={ label === "Home" ? "/" : `/${label.toLowerCase().replace(/\s+/g,"-")}` }
                    className="hover:text-[var(--accent)] transition-transform hover:scale-105"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        {!submitted && (
          <motion.div
            className="max-w-2xl w-full bg-[var(--card-bg)] p-6 rounded-2xl shadow-2xl mb-8 backdrop-blur-sm bg-opacity-60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-center italic font-medium">
              This is for your final message—the one you never sent. Keep it honest,
              heartfelt, and within theme. <strong>Submissions not aligned with this purpose will be rejected.</strong>
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {submitted && (
            <motion.div
              className="max-w-2xl w-full bg-[var(--secondary)] p-8 rounded-2xl shadow-xl text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.p
                className="text-2xl font-bold mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Sent!
              </motion.p>
              <motion.p
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Thank you! Your memory is pending approval.
              </motion.p>
              <motion.button
                onClick={resetForm}
                className="px-6 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg"
                whileHover={{ rotate: 2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share Another
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {!submitted && (
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-[var(--card-bg)] p-8 rounded-2xl shadow-2xl space-y-6 backdrop-blur-sm bg-opacity-70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            {...(error && { animate:{ x:[0,-10,10,-10,0] }, transition:{ duration:0.4 } })}
          >
            {error && (
              <p className="text-red-500 text-center font-medium">{error}</p>
            )}

            {/* Recipient with floating label */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <input
                id="recipient"
                type="text"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                required
                className="peer w-full p-3 bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition"
              />
              <label
                htmlFor="recipient"
                className="absolute left-0 top-3 text-[var(--border)] peer-focus:text-[var(--accent)] peer-focus:-top-4 peer-focus:text-sm transition-all"
              >
                Recipient’s Name*
              </label>
            </motion.div>

            {/* Message textarea */}
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block font-serif">Message* (max 200 words)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full p-3 border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] transition"
              />
              <div className="relative h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    wordCount >= 30 && wordCount < 200
                      ? "animate-pulse bg-[var(--accent)]"
                      : wordCount < 30
                      ? "bg-[var(--accent)]"
                      : wordCount <= 200
                      ? "bg-[var(--secondary)]"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>{wordCount} / 200</span>
                {warnVisible && wordCount > 30 && (
                  <span className="text-red-500">
                    Special effects disabled beyond 30 words.
                  </span>
                )}
                {over200 && (
                  <span className="text-red-500">{limitMsg}</span>
                )}
              </div>
            </motion.div>

            {/* Your Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <label className="block font-serif mb-1">Your Name (optional)</label>
              <input
                type="text"
                value={sender}
                onChange={e => setSender(e.target.value)}
                className="w-full p-3 border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </motion.div>

            {/* Color */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <label className="block font-serif mb-1">Select a Color (optional)</label>
              <select
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-full p-3 border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] transition"
              >
                {colorOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </motion.div>

            {/* Special Effect */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <label className="block font-serif mb-1">Special Effect</label>
              <select
                value={specialEffect}
                onChange={e => setSpecialEffect(e.target.value)}
                disabled={wordCount > 30}
                className="w-full p-3 border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] transition disabled:opacity-50"
              >
                {specialEffectOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </motion.div>

            {/* Full-bg checkbox */}
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <input
                id="fullBg"
                type="checkbox"
                checked={fullBg}
                onChange={e => setFullBg(e.target.checked)}
                className="h-5 w-5 accent-[var(--accent)]"
              />
              <label htmlFor="fullBg" className="font-serif">Apply color to full card background</label>
            </motion.div>

            {/* Submit */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <motion.button
                type="submit"
                className="px-8 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-2xl shadow-lg"
                whileHover={{ rotateX: 5, rotateY: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Memory
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </main>

      <footer className="bg-[var(--card-bg)] shadow-inner">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
