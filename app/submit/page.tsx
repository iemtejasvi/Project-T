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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
      <header className="bg-gray-900/80 backdrop-blur-md shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-serif text-gray-200">Submit a Memory</h1>
          <hr className="my-4 border-gray-600" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6 text-gray-400">
              <li>
                <Link href="/" className="hover:text-teal-400 transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-teal-400 transition duration-200">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-teal-400 transition duration-200">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        {submitted ? (
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-gray-200 p-8 rounded-lg shadow-lg text-center animate-fade-in">
            Thank you for your submission! Your memory is pending approval.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/90 p-8 rounded-lg shadow-xl">
            {error && <p className="text-red-400 text-center font-medium">{error}</p>}

            <div className="animate-slide-up">
              <label className="block font-serif text-gray-300">{`Recipient's Name (required):`}</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full mt-2 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:border-teal-400 transition duration-200"
              />
            </div>

            <div className="animate-slide-up delay-100">
              <label className="block font-serif text-gray-300">{`Message (required):`}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full mt-2 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:border-teal-400 transition duration-200"
              ></textarea>
            </div>

            <div className="animate-slide-up delay-200">
              <label className="block font-serif text-gray-300">{`Your Name (optional):`}</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:border-teal-400 transition duration-200"
              />
            </div>

            <div className="animate-slide-up delay-300">
              <label className="block font-serif text-gray-300">{`Select a Color for Your Message (optional):`}</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:border-teal-400 transition duration-200"
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="animate-slide-up delay-400">
              <label className="block font-serif text-gray-300">{`Do you want any special effect?`}</label>
              <select
                value={specialEffect}
                onChange={(e) => setSpecialEffect(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:border-teal-400 transition duration-200"
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
                className="mr-2 accent-teal-400"
              />
              <label htmlFor="fullBg" className="font-serif text-gray-300">
                Apply color to full card background
              </label>
            </div>

            <div className="text-center animate-slide-up delay-600">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-700 text-gray-200 font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-teal-800 transition duration-200"
              >
                Submit Memory
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="bg-gray-900/80 backdrop-blur-md shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
