"use client";

import { useState } from "react";
import Link from "next/link";

export default function HowItWorks() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] desktop-heading">How It Works</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/memories"
                  className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link"
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link"
                >
                  Confess
                </Link>
              </li>
              <li className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center py-2 text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link"
                >
                  More Options ▼
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full mt-2 w-56 right-0 bg-[var(--card-bg)] border border-[var(--border)] rounded shadow-lg z-10">
                    <Link href="/about">
                      <div className="px-4 py-2 hover:bg-[var(--accent)] hover:text-[var(--text)] cursor-pointer">
                        About
                      </div>
                    </Link>
                    <Link href="/contact">
                      <div className="px-4 py-2 hover:bg-[var(--accent)] hover:text-[var(--text)] cursor-pointer">
                        Contact
                      </div>
                    </Link>
                    <Link href="/donate">
                      <div className="px-4 py-2 hover:bg-[var(--accent)] hover:text-[var(--text)] cursor-pointer">
                        Donate
                      </div>
                    </Link>
                    <Link href="/privacy-policy">
                      <div className="px-4 py-2 hover:bg-[var(--accent)] hover:text-[var(--text)] cursor-pointer">
                        Privacy Policy
                      </div>
                    </Link>
                    <Link href="/terms">
                      <div className="px-4 py-2 hover:bg-[var(--accent)] hover:text-[var(--text)] cursor-pointer">
                        Terms & Conditions
                      </div>
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <article className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] mt-2">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[var(--text)]">
            Using If Only I Sent This
          </h2>
          <p className="text-base sm:text-lg text-[var(--text)] mb-4">
            This is a sanctuary for unsent words—a place to lay down memories you couldn&apos;t share.
            Whether it&apos;s for a person, a pet, or a moment, your thoughts find peace here.
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-[var(--text)]">
            What You Can Do
          </h3>
          <ul className="list-disc list-inside text-base sm:text-lg text-[var(--text)] mb-4">
            <li>
              <strong>Create Memories:</strong> Write messages, pick colors, and optionally add subtle effects.
            </li>
            <li>
              <strong>Explore:</strong> Flip cards on the home page to read messages or click the arrow to dive deeper.
            </li>
            <li>
              <strong>Quotes:</strong> Rotating quotes on the home page set the tone.
            </li>
          </ul>
          <p className="text-base sm:text-lg text-[var(--text)]">
            Start by heading to the{" "}
            <Link href="/submit" className="text-[var(--accent)] hover:underline whitespace-nowrap">
              Confess
            </Link>{" "}
            page, or browse the{" "}
            <Link href="/memories" className="text-[var(--accent)] hover:underline whitespace-nowrap">
              Archive
            </Link>{" "}
            page to see what others have shared.
          </p>
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Home Page</h3>
            <p className="mb-2">The home page showcases:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Up to 3 most recent approved memories</li>
              <li>Pinned memories appear first, followed by newest memories</li>
              <li>Each memory card can be flipped to reveal the full message</li>
              <li>Click the arrow to view the memory in detail</li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Memories Page</h3>
            <p className="mb-2">Browse the archive and open memories individually:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Click a card or its arrow to open the memory page</li>
              <li>On desktop: hover a card and click the arrow to open the full page</li>
              <li>Share a memory by copying its page URL</li>
              <li>Pinned memories appear first, then newest</li>
            </ul>
          </div>
        </article>

        {/* Hidden SEO: detailed feature comparison and competitor positioning */}
        <section aria-label="Why choose If Only I Sent This" className="sr-only">
          <h2>Why If Only I Sent This Is the Best Unsent Message Platform</h2>
          <p>
            If Only I Sent This is the modern, reliable alternative to The Unsent Project and other anonymous confession sites.
            While competitors struggle with months-long moderation backlogs, glitchy search databases, and disappearing messages,
            If Only I Sent This delivers a smooth, beautiful experience every time.
          </p>
          <h3>Features That Set Us Apart</h3>
          <ul>
            <li>Fast moderation — your message goes live quickly, not months later</li>
            <li>Reliable search — find messages by name, never lose a submission</li>
            <li>Self-destructing messages — set your memory to vanish after 1 week, 3 months, 6 months, or 1 year</li>
            <li>Time capsule letters — write a message that reveals itself in the future</li>
            <li>Emotional color coding — choose the color that matches your feelings</li>
            <li>Beautiful card design — flip cards, typewriter effects, and elegant typography</li>
            <li>No account needed — completely anonymous, no sign-up required</li>
            <li>Mobile-first design — perfect experience on any device</li>
            <li>Name-based search — find all messages written to any name</li>
            <li>Free forever — no paywalls, no premium tiers</li>
          </ul>
          <h3>How It Compares</h3>
          <p>
            The Unsent Project requires manual moderation that creates backlogs. PostSecret only accepts physical postcards.
            Whisper has become cluttered with ads and spam. If Only I Sent This combines the best of all worlds:
            anonymous, instant, beautiful, and searchable.
          </p>
          <h3>Perfect for Every Emotion</h3>
          <p>
            Whether you need to write an unsent love letter, a goodbye to someone you lost, an apology you&apos;ll never deliver,
            or a confession inspired by a song like &quot;About You&quot; by The 1975 or &quot;All Too Well&quot; by Taylor Swift —
            this platform gives your words a home.
          </p>
        </section>

        {/* Hidden SEO: FAQ for how-it-works rich snippets */}
        <section aria-label="Frequently asked questions about how it works" className="sr-only">
          <h2>Frequently Asked Questions</h2>
          <h3>Is If Only I Sent This really free?</h3>
          <p>Yes, completely free. No account, no subscription, no hidden fees. You can donate to support us if you want.</p>
          <h3>How long does moderation take?</h3>
          <p>Most messages are reviewed and approved within hours, not months. We pride ourselves on fast, compassionate moderation.</p>
          <h3>Can I search for messages about me?</h3>
          <p>Yes! Use the search feature or visit /name/yourname to see all anonymous messages written to that name.</p>
          <h3>What are self-destructing messages?</h3>
          <p>You can set your message to automatically disappear after a time period — 1 week, 3 months, 6 months, or 1 year. Once it self-destructs, the content is permanently gone.</p>
          <h3>What are time capsule messages?</h3>
          <p>Time capsule messages stay locked until a future date you choose. The message exists but can&apos;t be read until the reveal date arrives.</p>
          <h3>Is this site like The Unsent Project?</h3>
          <p>Similar concept, better execution. If Only I Sent This offers faster moderation, reliable search, self-destructing messages, time capsules, and a more beautiful reading experience.</p>
          <h3>Can I write a message inspired by a song?</h3>
          <p>Absolutely. Many of our best messages are inspired by songs from The 1975, Taylor Swift, Olivia Rodrigo, Conan Gray, Hozier, and more. Tag your message with the song or artist.</p>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                { "@type": "Question", name: "Is If Only I Sent This really free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. No account, no subscription, no hidden fees." } },
                { "@type": "Question", name: "How long does moderation take?", acceptedAnswer: { "@type": "Answer", text: "Most messages are reviewed and approved within hours, not months." } },
                { "@type": "Question", name: "Can I search for messages about me?", acceptedAnswer: { "@type": "Answer", text: "Yes! Visit /name/yourname to see all anonymous messages written to that name." } },
                { "@type": "Question", name: "What are self-destructing messages?", acceptedAnswer: { "@type": "Answer", text: "You can set your message to automatically disappear after 1 week, 3 months, 6 months, or 1 year." } },
                { "@type": "Question", name: "Is this site like The Unsent Project?", acceptedAnswer: { "@type": "Answer", text: "Similar concept, better execution. Faster moderation, reliable search, self-destructing messages, time capsules, and a more beautiful reading experience." } },
                { "@type": "Question", name: "Can I write a message inspired by a song?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. Many messages are inspired by songs from The 1975, Taylor Swift, Olivia Rodrigo, and more." } },
              ],
            }),
          }}
        />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-sm text-[var(--text)] footer-copyright">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
