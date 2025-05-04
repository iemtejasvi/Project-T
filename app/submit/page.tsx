"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Particles from "react-tsparticles";
import Lottie from "lottie-react";
import envelopeAnimation from "@/lib/envelope.json";
import heartAnimation from "@/lib/heart.json";
import particlesConfig from "@/lib/particlesConfig.json";

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
  "Short and sad, like your situationship.",
];

export default function SubmitPage() {
  // form fields
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [color, setColor] = useState("default");
  const [specialEffect, setSpecialEffect] = useState("");
  const [fullBg, setFullBg] = useState(false);

  // submission state
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // IP info
  const [ipData, setIpData] = useState<IPData | null>(null);

  // word count & progress
  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const percent = Math.min((wordCount / 200) * 100, 100).toFixed(0);
  const over200 = wordCount > 200;

  // special-effect warning
  const [warnVisible, setWarnVisible] = useState(false);
  const hasWarned = useRef(false);

  // over-limit message
  const [limitMsg, setLimitMsg] = useState("");

  // typewriter title
  const fullTitle = "Submit a Memory";
  const [title, setTitle] = useState("");
  const titleIdx = useRef(0);

  // fetch IP on load
  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setIpData({ ip: data.ip, country: data.country_name });
      } catch {}
    }
    fetchIP();
  }, []);

  // typewriter effect for header
  useEffect(() => {
    const interval = setInterval(() => {
      if (titleIdx.current < fullTitle.length) {
        setTitle((t) => t + fullTitle[titleIdx.current]);
        titleIdx.current += 1;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // show warning once each time crossing 30 words
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

  // pick random 200+ message
  useEffect(() => {
    if (over200) {
      setLimitMsg(limitMessages[Math.floor(Math.random() * limitMessages.length)]);
    }
  }, [over200]);

  // handle form submit
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

  // reset form for another submission
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
    titleIdx.current = fullTitle.length; // keep title displayed
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text)]">
      {/* Background particles */}
      <Particles className="absolute inset-0" options={particlesConfig} />

      <header className="relative z-10 bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          {/* Typewriter title */}
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
          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <ul className="flex justify-center gap-6">
              {["Home", "Memories", "How It Works"].map((label) => (
                <li key={label}>
                  <Link
                    href={label === "Home" ? "/" : `/${label.toLowerCase().replace(/\s+/g, "-")}`}
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

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-8">
        {/* Intro banner */}
        {!submitted && (
          <motion.div
            className="max-w-2xl w-full bg-[var(--card-bg)] backdrop-blur-sm bg-opacity-60 p-6 rounded-2xl shadow-2xl mb-8"
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

        {/* Submission success */}
        <AnimatePresence>
          {submitted && (
            <>
              <Confetti recycle={false} numberOfPieces={200} />
              <motion.div
                className="max-w-2xl w-full bg-[var(--secondary)] p-8 rounded-2xl shadow-xl text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Lottie animationData={envelopeAnimation} loop={false} />
                </motion.div>
                <motion.p
                  className="mt-4 mb-6 font-semibold"
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
            </>
          )}
        </AnimatePresence>

        {/* Form */}
        {!submitted && (
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-[var(--card-bg)] backdrop-blur-sm bg-opacity-70 p-8 rounded-2xl shadow-2xl space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            {...(error && { animate: { x: [0, -10, 10, -10, 0] }, transition: { duration: 0.4 } })}
          >
            {error && (
              <p className="text-red-500 text-center font-medium">{error}</p>
            )}

            {/* Recipient field with floating label */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <input
                id="recipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
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
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full p-3 border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] transition"
              />
              <div className="relative h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    wordCount >= 30 && wordCount < 200
                      ? "animate-pulse bg-[var(--accent)]"
                      : wordCount < 30
                      ? "bg-[var(--accent)]"
                      : wordCount <= 200
                      ? "bg-[var(--secondary)]"
                      : "bg-red-500"
                  } transition-all duration-300`}
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

            {/* Additional inputs/selects */}
            {[
              {
                label: "Your Name (optional)",
                render: (
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full p-3 border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] transition"
                  />
                ),
              },
              {
                label: "Select a Color (optional)",
                render: (
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full p-3 border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] transition"
                  >
                    {colorOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ),
              },
              {
                label: "Special Effect",
                render: (
                  <select
                    value={specialEffect}
                    onChange={(e) => setSpecialEffect(e.target.value)}
                    disabled={wordCount > 30}
                    className="w-full p-3 border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] transition disabled:opacity-50"
                  >
                    {specialEffectOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ),
              },
            ].map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <label className="block font-serif mb-1">{field.label}</label>
                {field.render}
              </motion.div>
            ))}

            {/* Full-bg checkbox */}
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
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
            </motion.div>

            {/* Submit button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
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

      <footer className="relative z-10 bg-[var(--card-bg)] shadow-inner">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
