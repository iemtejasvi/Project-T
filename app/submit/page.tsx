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
  { value: "pearl", label: "Pearl" },
  { value: "ivory", label: "Ivory" },
  { value: "obsidian", label: "Obsidian" },
  { value: "ruby", label: "Ruby" },
  { value: "amethyst", label: "Amethyst" },
  { value: "topaz", label: "Topaz" },
  { value: "opal", label: "Opal" },
  { value: "quartz", label: "Quartz" },
  { value: "sapphire", label: "Sapphire" },
  { value: "emerald", label: "Emerald" },
  { value: "onyx", label: "Onyx" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "bronze", label: "Bronze" },
  { value: "copper", label: "Copper" },
  { value: "jade", label: "Jade" },
  { value: "crimson", label: "Crimson" },
  { value: "platinum", label: "Platinum" },
  { value: "cerulean", label: "Cerulean" },
];

const colorMap: { [key: string]: string } = {
  default: "inherit",
  pearl: "#f8f4e3",
  ivory: "#fffff0",
  obsidian: "#3b3b3b",
  ruby: "#9b111e",
  amethyst: "#9966cc",
  topaz: "#ffc87c",
  opal: "#a8c3bc",
  quartz: "#c9c0bb",
  sapphire: "#0f52ba",
  emerald: "#50c878",
  onyx: "#353839",
  silver: "#c0c0c0",
  gold: "#d4af37",
  bronze: "#cd7f32",
  copper: "#b87333",
  jade: "#00a86b",
  crimson: "#dc143c",
  platinum: "#e5e4e2",
  cerulean: "#007ba7",
};

const specialEffectOptions = [
  { value: "", label: "None" },
  { value: "bleeding", label: "Bleeding Text Effect" },
  { value: "handwritten", label: "Handwritten Text Effect" },
];

function getDeviceInfo() {
  const ua = navigator.userAgent;
  let device = "";

  if (/iPhone/.test(ua)) {
    // For iPhones, extract iOS version
    const osMatch = ua.match(/OS\s([\d_]+)/);
    const osVersion = osMatch ? osMatch[1].replace(/_/g, ".") : "";
    device = `iPhone (iOS ${osVersion})`;
  } else if (/iPad/.test(ua)) {
    const osMatch = ua.match(/OS\s([\d_]+)/);
    const osVersion = osMatch ? osMatch[1].replace(/_/g, ".") : "";
    device = `iPad (iOS ${osVersion})`;
  } else if (/Android/.test(ua)) {
    // Extract details from inside parentheses
    const parenMatch = ua.match(/\(([^)]+)\)/);
    let model = "";
    if (parenMatch) {
      const parts = parenMatch[1].split(";");
      // Try to find a part that contains "Build"
      for (let part of parts) {
        if (part.includes("Build")) {
          model = part.split("Build")[0].trim();
          break;
        }
      }
      // Fallback: if no part with "Build" found, use the last part
      if (!model && parts.length >= 1) {
        model = parts[parts.length - 1].trim();
      }
      // If model seems too short, discard it.
      if (model.length < 3) {
        model = "";
      }
    }
    const osMatch = ua.match(/Android\s([\d\.]+)/);
    const osVersion = osMatch ? osMatch[1] : "";
    device = model ? `${model} (Android ${osVersion})` : `Android Device (Android ${osVersion})`;
  } else if (/Windows NT/.test(ua)) {
    const match = ua.match(/Windows NT ([\d\.]+)/);
    const version = match ? match[1] : "";
    device = `Windows PC (Windows ${version})`;
  } else if (/Mac OS X/.test(ua)) {
    const match = ua.match(/Mac OS X ([\d_]+)/);
    const version = match ? match[1].replace(/_/g, ".") : "";
    device = `Macintosh (macOS ${version})`;
  } else {
    device = "Desktop";
  }

  return device;
}

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

  // Fetch IP and geo info on mount using ipify and ipapi.co
  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const ipDataTemp = await res.json();
        const ip = ipDataTemp.ip;
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geoData = await geoRes.json();
        setIpData({
          ip,
          city: geoData.city,
          region: geoData.region,
          country: geoData.country,
        });
      } catch (err) {
        console.error("Error fetching IP info:", err);
      }
    }
    fetchIP();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!recipient || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    // Check if user's IP is banned
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

    // Get a more precise device description using our enhanced parser
    const device = getDeviceInfo();

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
      device,
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
          <div
            className="bg-[var(--secondary)] text-[var(--text)] p-8 rounded-lg shadow-lg text-center animate-fade-in"
          >
            Thank you for your submission! Your memory is pending approval.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-8 rounded-lg shadow-xl"
            style={
              fullBg && color !== "default"
                ? { backgroundColor: colorMap[color] }
                : { backgroundColor: "var(--card-bg)" }
            }
          >
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}

            <div className="animate-slide-up">
              <label className="block font-serif text-[var(--text)]">
                {`Recipient's Name (required):`}
              </label>
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
              <label className="block font-serif text-[var(--text)]">
                {`Select a Color for Your Message (optional):`}
              </label>
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
              <label className="block font-serif text-[var(--text)]">
                {`Do you want any special effect?`}
              </label>
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
