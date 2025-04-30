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

    if (ipData && ipData.ip) {
      const { data: bannedData, error: bannedError } = await supabase
        .from("banned_ips")
        .select("*")
        .eq("ip", ipData.ip);
      if (bannedError) {
        console.error("Error checking banned IPs:", bannedError);
      }
      if (bannedData && bannedData.length > 0) {
        setError("You are banned from submitting memories.");
        return;
      }
    }

    const deviceInfo =
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown";

    const status = "pending";
    const submission = {
      recipient,
      message,
      sender,
      status,
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

  const progressPercentage = Math.min((wordCount / 250) * 100, 100);
  const specialEffectLimitPercentage = (30 / 250) * 100;

  let progressColor = "bg-green-500";
  if (wordCount > 30 && wordCount <= 250) {
    progressColor = "bg-yellow-500";
  } else if (wordCount > 250) {
    progressColor = "bg-red-500";
  }

  let progressMessage = "";
  if (wordCount <= 30) {
    progressMessage = "Special effects can be used!";
  } else if (wordCount <= 250) {
    progressMessage = "Special effects cannot be used.";
  } else {
    progressMessage = "Message exceeds 250 words.";
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <header className="bg-[var(--card-bg)] shadow-lg border-b border-[var(--border)] py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text)] text-center mb-4 tracking-wide">
            Submit a Memory
          </h1>
          <nav className="flex justify-center gap-6 sm:gap-8">
            <Link
              href="/"
              className="text-[var(--text)] text-sm sm:text-base font-medium hover:underline hover:text-[var(--accent)] transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/memories"
              className="text-[var(--text)] text-sm sm:text-base font-medium hover:underline hover:text-[var(--accent)] transition duration-300"
            >
              Memories
            </Link>
            <Link
              href="/how-it-works"
              className="text-[var(--text)] text-sm sm:text-base font-medium hover:underline hover:text-[var(--accent)] transition duration-300"
            >
              How It Works
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {submitted ? (
          <div className="bg-[var(--secondary)] text-[var(--text)] p-6 sm:p-8 rounded-xl shadow-xl text-center transition-all duration-500 ease-in-out">
            <p className="text-lg sm:text-xl font-serif">
              Thank you for your submission! Your memory is pending approval.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-6 transition-all duration-300"
          >
            {error && (
              <p className="text-red-500 text-center font-medium text-sm sm:text-base">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label className="block font-serif text-[var(--text)] text-base sm:text-lg flex items-center">
                <i className="fas fa-user mr-2 text-[var(--text)]"></i>
                Recipient's Name (required)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition duration-300 ease-in-out"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-serif text-[var(--text)] text-base sm:text-lg flex items-center">
                <i className="fas fa-comment mr-2 text-[var(--text)]"></i>
                Message (required)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="w-full p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y transition duration-300 ease-in-out"
              ></textarea>
              <div className="mt-3 space-y-2">
                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-300 ease-in-out`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                  <div
                    className="absolute top-0 h-full border-r-2 border-dashed border-gray-500"
                    style={{ left: `${specialEffectLimitPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text)] font-light italic">
                  {progressMessage}
                </p>
                <p className="text-xs sm:text-sm text-[var(--text)] font-light">
                  Word count: {wordCount}/250
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-serif text-[var(--text)] text-base sm:text-lg flex items-center">
                <i className="fas fa-signature mr-2 text-[var(--text)]"></i>
                Your Name (optional)
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition duration-300 ease-in-out"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-serif text-[var(--text)] text-base sm:text-lg flex items-center">
                <i className="fas fa-palette mr-2 text-[var(--text)]"></i>
                Select a Color for Your Message (optional)
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition duration-300 ease-in-out"
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-serif text-[var(--text)] text-base sm:text-lg flex items-center">
                <i className="fas fa-magic mr-2 text-[var(--text)]"></i>
                Do you want any special effect?
              </label>
              <select
                value={specialEffect}
                onChange={(e) => setSpecialEffect(e.target.value)}
                disabled={!isSpecialEffectAllowed}
                className="w-full p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50 transition duration-300 ease-in-out"
              >
                {specialEffectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {!isSpecialEffectAllowed && (
                <p className="text-xs sm:text-sm text-[var(--text)] font-light italic">
                  Special effects are only available for messages under 30 words.
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={fullBg}
                onChange={(e) => setFullBg(e.target.checked)}
                id="fullBg"
                className="h-4 w-4 text-[var(--accent)] border-[var(--border)] rounded focus:ring-[var(--accent)]"
              />
              <label
                htmlFor="fullBg"
                className="font-serif text-[var(--text)] text-sm sm:text-base"
              >
                Apply color to full card background
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Submit Memory
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="bg-[var(--card-bg)] border-t border-[var(--border)] py-4 shadow-inner">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm text-[var(--text)] font-light">
            © {new Date().getFullYear()} If Only I Sent This
          </p>
        </div>
      </footer>
    </div>
  );
}
