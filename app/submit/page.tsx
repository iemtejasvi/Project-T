"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const colorOptions = [
  { value: "default", label: "Default" },
  { value: "blue", label: "Blue" },
  { value: "gray", label: "Gray" },
  { value: "purple", label: "Purple" },
  { value: "navy", label: "Navy" },
  { value: "maroon", label: "Maroon" },
  { value: "pink", label: "Pink" },
  { value: "teal", label: "Teal" },
  { value: "olive", label: "Olive" },
  { value: "mustard", label: "Mustard" },
  { value: "coral", label: "Coral" },
  { value: "lavender", label: "Lavender" },
  // Additional colors
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "brown", label: "Brown" },
  { value: "magenta", label: "Magenta" },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!recipient || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    // Gather extra details: IP and geolocation
    let ip = "";
    let city = "";
    let country = "";
    let stateRegion = "";
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      ip = data.ip || "";
      city = data.city || "";
      country = data.country_name || "";
      stateRegion = data.region || "";
    } catch (err) {
      console.error("Error fetching IP info:", err);
    }

    // Get device info from user agent
    const device = navigator.userAgent;

    const status = "pending";
    const { error } = await supabase
      .from("memories")
      .insert([
        {
          recipient,
          message,
          sender,
          status,
          color,
          full_bg: fullBg,
          letter_style: "default",
          animation: specialEffect,
          ip,
          city,
          country,
          state: stateRegion,
          device,
        },
      ]);

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
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-serif text-[var(--text)]">Submit a Memory</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6 text-[var(--text)]">
              <li>
                <Link href="/" className="hover:text-[var(--accent)] transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-[var(--accent)] transition duration-200">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[var(--accent)] transition duration-200">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        {submitted ? (
          <div className="bg-[var(--secondary)] text-[var(--text)] p-8 rounded-lg shadow-lg text-center animate-fade-in">
            Thank you for your submission! Your memory is pending approval.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--card-bg)] p-8 rounded-lg shadow-xl">
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}

            <div className="animate-slide-up">
              <label className="block font-serif text-[var(--text)]">{`Recipient's Name (required):`}</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition duration-200"
              />
            </div>

            <div className="animate-slide-up delay-100">
              <label className="block font-serif text-[var(--text)]">{`Message (required):`}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition duration-200"
              ></textarea>
            </div>

            <div className="animate-slide-up delay-200">
              <label className="block font-serif text-[var(--text)]">{`Your Name (optional):`}</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition duration-200"
              />
            </div>

            <div className="animate-slide-up delay-300">
              <label className="block font-serif text-[var(--text)]">{`Select a Color for Your Message (optional):`}</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition duration-200"
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="animate-slide-up delay-400">
              <label className="block font-serif text-[var(--text)]">{`Do you want any special effect?`}</label>
              <select
                value={specialEffect}
                onChange={(e) => setSpecialEffect(e.target.value)}
                className="w-full mt-2 p-3 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition duration-200"
              >
                {specialEffectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center animate-slide-up delay-500">
              <input
                type="checkbox"
                checked={fullBg}
                onChange={(e) => setFullBg(e.target.checked)}
                id="fullBg"
                className="mr-2"
              />
              <label htmlFor="fullBg" className="font-serif text-[var(--text)]">
                Apply color to full card background
              </label>
            </div>

            <div className="text-center animate-slide-up delay-600">
              <button
                type="submit"
                className="px-8 py-3 bg-[var(--accent)] text-[var(--text)] font-semibold rounded-lg shadow-md hover:bg-blue-200 transition duration-200"
              >
                Submit Memory
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-[var(--text)]">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
