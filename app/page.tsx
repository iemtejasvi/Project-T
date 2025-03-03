"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import MemoryCard from "../components/MemoryCard";

interface Memory {
  id: string;
  recipient: string;
  sender?: string;
  message: string;
  color: string;
  created_at: string;
  animation?: boolean;
  full_bg: boolean;
  status?: string;
  letter_style: string;
}

const TypingEffect: React.FC = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [mistyped, setMistyped] = useState(false);

  const quotes = useMemo(
    () => [
      "I wish I said no more often",
      "You inspire me to be nothing like you",
      "The silence between us was deafening",
      "I kept my pain hidden behind a smile",
      "The hardest part was letting go",
      "I never knew how to say goodbye",
      "My heart still aches for what could have been",
      "I miss the person I used to be",
      "The memories haunt me every night",
      "I wish I could turn back time",
      "Every word I didn’t say weighs on me",
      "I loved you more than I showed",
      "The emptiness feels louder than words",
      "I’m sorry I wasn’t enough",
      "You’ll never know how much I cared",
      "I lost myself trying to keep you",
      "The past is a ghost I can’t escape",
      "I wish I fought harder for us",
      "Your absence echoes in my soul",
      "I hid my tears so you wouldn’t see",
      "Time didn’t heal what I broke",
      "I regret the chances I didn’t take",
      "My silence was my biggest mistake",
      "I still hear your voice in my dreams",
      "I gave up when I should’ve held on",
      "The words I held back choke me now",
      "I wish I told you I was scared",
      "You were my home, and I left",
      "I pretended I didn’t need you",
      "The pain lingers like an old song",
      "I should’ve said I love you more",
      "I watched you fade from my life",
      "My heart broke in silence",
      "I wish I hadn’t pushed you away",
      "You’ll never read these words",
      "I failed to be who you needed",
      "The goodbye I never said haunts me",
      "I buried my feelings too deep",
      "I wish I’d been braver for you",
      "Your memory cuts like a knife",
      "I let pride steal my voice",
      "I miss the us we could’ve been",
      "I didn’t fight the tears you caused",
      "I’m trapped in what I didn’t say",
      "You were my unsent letter",
      "I wish I’d held you longer",
      "The regret grows heavier each day",
      "I lost you to my own silence",
      "I should’ve begged you to stay",
      "My heart whispers your name",
      "I hid my love behind fear",
      "I wish I’d shared my darkness",
      "You left a hole words can’t fill",
      "I’m sorry I let you slip away",
      "I never told you how I broke",
      "The unsaid burns brighter than fire",
      "I wish I’d been honest with you",
      "You were my almost, my maybe",
      "I still feel you in the quiet",
      "I let you go without a word",
      "My soul aches for one more chance",
      "I wish I’d said it all",
      "You’ll never know my truth",
      "I drowned in my own silence",
      "I miss you more than I can say",
    ],
    []
  );

  useEffect(() => {
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseTime = 1500;
    const mistypeChance = 0.1;
    const currentQuote = quotes[currentQuoteIndex];

    const type = () => {
      if (!isDeleting && charIndex < currentQuote.length) {
        if (Math.random() < mistypeChance && !mistyped && charIndex > 5) {
          setDisplayedText((prev) =>
            prev + String.fromCharCode(97 + Math.floor(Math.random() * 26))
          );
          setMistyped(true);
          setTimeout(() => {
            setDisplayedText(currentQuote.substring(0, charIndex));
            setMistyped(false);
          }, 200);
        } else {
          setDisplayedText(currentQuote.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }
      } else if (isDeleting && charIndex > 0) {
        setDisplayedText(currentQuote.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentQuote.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setCurrentQuoteIndex((currentQuoteIndex + 1) % quotes.length);
      }
    };

    const timer = setTimeout(
      type,
      isDeleting ? deleteSpeed : mistyped ? 200 : typeSpeed
    );
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentQuoteIndex, mistyped, quotes]);

  return (
    <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-[var(--text)] animate-pulse-slow">
      {displayedText}
      <span className="animate-blink">|</span>
    </p>
  );
};

export default function Home() {
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    async function fetchRecentMemories() {
      const { data, error } = await supabase
        .from<Partial<Memory>, any>("memories")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) {
        console.error("Error fetching memories:", error);
      } else if (data) {
        const memoriesWithDefaults: Memory[] = data.map((mem) => ({
          id: mem.id,
          recipient: mem.recipient,
          sender: mem.sender,
          message: mem.message,
          color: mem.color,
          created_at: mem.created_at,
          animation: mem.animation,
          full_bg: mem.full_bg ?? false,
          status: mem.status,
          letter_style: mem.letter_style ?? "",
        }));
        setRecentMemories(memoriesWithDefaults);
      }
    }
    fetchRecentMemories();

    if (!localStorage.getItem("hasVisited")) {
      setShowWelcome(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {showWelcome && (
        <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50 p-4">
          <div
            className="bg-[var(--card-bg)] p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-500 animate-fade-in"
            style={{
              background: `linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)`,
              boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
            }}
          >
            <h2 className="text-2xl font-serif font-bold text-[var(--text)] mb-4">
              Welcome
            </h2>
            <p className="text-[var(--text)] mb-6 font-serif">
              A sanctuary for unsent memories. Discover{" "}
              <Link
                href="/how-it-works"
                className="text-[var(--accent)] hover:underline"
              >
                How It Works
              </Link>
              .
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="px-6 py-2 bg-[var(--accent)] text-[var(--text)] rounded-lg hover:bg-blue-200 transition duration-300 font-serif"
            >
              Understood
            </button>
          </div>
        </div>
      )}
      <header className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[var(--text)] tracking-wide">
            If Only I Sent This
          </h1>
          <hr className="my-6 border-[var(--border)] border-dashed" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6 sm:gap-8">
              {["Home", "Memories", "Submit", "How It Works"].map((item) => (
                <li key={item}>
                  <Link
                    href={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300 font-serif text-lg"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <section className="my-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div
          className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:shadow-xl"
          style={{
            background: `linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)`,
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
        >
          <TypingEffect />
        </div>
      </section>
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold mb-8 text-[var(--text)] text-center">
          Recent Memories
        </h2>
        {recentMemories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {recentMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--text)] text-center font-serif">
            No memories yet.
          </p>
        )}
        <div className="text-right mt-6">
          <Link
            href="/memories"
            className="text-[var(--accent)] hover:underline font-serif text-lg"
          >
            See All →
          </Link>
        </div>
      </main>
      <footer className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-[var(--text)] font-serif">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
