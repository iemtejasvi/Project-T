import Link from "next/link";
import Footer from "@/components/Footer";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Love Letters Never Sent – Anonymous Confessions of the Heart",
  description: "From Neruda's unnamed beloved to the words you never said — love letters never sent are the most honest kind. Write yours anonymously, or read what others held back.",
  alternates: {
    canonical: '/love-letters-never-sent',
  },
  openGraph: {
    title: "Love Letters Never Sent – Anonymous Confessions of the Heart",
    description: "From Neruda's unnamed beloved to the words you never said — love letters never sent are the most honest kind. Write yours anonymously, or read what others held back.",
    url: 'https://www.ifonlyisentthis.com/love-letters-never-sent',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Love Letters Never Sent – Anonymous Confessions of the Heart",
    description: "From Neruda's unnamed beloved to the words you never said — love letters never sent are the most honest kind. Write yours anonymously, or read what others held back.",
    images: ['/opengraph-image.png'],
  },
};

export default function LoveLettersNeverSent() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Love Letters Never Sent</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap items-center justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li><Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Home</Link></li>
              <li><Link href="/memories" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Archive</Link></li>
              <li><Link href="/submit" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Confess</Link></li>
              <li><Link href="/how-it-works" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link">How It Works</Link></li>
              <MoreOptionsDropdown />
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] lg:shadow-sm lg:border-transparent editorial-prose text-[var(--text)]">

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Love Letters Never Sent</h2>
            <p className="text-base sm:text-lg">
              There is a particular ache that belongs only to love unexpressed &mdash; a tenderness
              that never found its way to the surface, a sentence begun in the chest and swallowed
              before it reached the mouth. These are the letters that live folded inside us: creased,
              rewritten, never delivered. They are not lesser for having stayed silent. If anything,
              they are more honest than anything we ever dared to say aloud.
            </p>
            <blockquote className="border-l-4 border-[var(--accent)] pl-4 my-6 italic text-base sm:text-lg opacity-80">
              &ldquo;I love you without knowing how, or when, or from where. I love you simply,
              without problems or pride.&rdquo;
              <span className="block mt-1 text-sm not-italic opacity-70">&mdash; Pablo Neruda</span>
            </blockquote>
            <p className="text-base sm:text-lg">
              The Japanese speak of <em>mono no aware</em> &mdash; the gentle sadness of impermanence,
              the beauty that lives in things precisely because they pass. Every unsent love letter
              holds a small universe: the moment you almost said it, the reasons you didn&apos;t, the
              silence that followed and filled the room like weather. These letters exist in the space
              between courage and tenderness, between longing and letting go. They are not failures.
              They are the truest record of what it felt like to love someone more than you could say.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">The Courage of Silence</h2>
            <blockquote className="border-l-4 border-[var(--accent)] pl-4 my-6 italic text-base sm:text-lg opacity-80">
              &ldquo;The wound is the place where the Light enters you.&rdquo;
              <span className="block mt-1 text-sm not-italic opacity-70">&mdash; Rumi</span>
            </blockquote>
            <p className="text-base sm:text-lg">
              We are taught that love must be declared to be real, that withholding is cowardice.
              But sometimes withholding is its own form of devotion &mdash; a way of protecting
              what you feel from the clumsiness of language, from the weight of expectation, from
              the possibility that saying it would change everything in the wrong direction. Frida
              Kahlo wrote letters to Diego Rivera that were raw, contradictory, incandescent with
              need &mdash; and never fully sent in the form she intended. The unsent draft was
              truer than the delivered one could ever be.
            </p>
            <p className="text-base sm:text-lg">
              And then there are the grief letters: messages to those who have died, to pets whose
              warmth you still reach for in sleep, to the person you were before everything changed.
              These letters don&apos;t need a recipient to matter. Sometimes the bravest thing is
              to feel it fully and let the words exist without needing them to arrive. The act of
              writing is itself the act of love.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Your Letter Belongs Here</h2>
            <p className="text-base sm:text-lg">
              Whether it is a love letter to someone you lost, an apology you can&apos;t deliver,
              a confession you need to release, or a quiet thank you that came too late &mdash;
              this archive holds space for it. No judgment, no audience expectation, no algorithm.
              Just your words, preserved or released on your terms.{" "}
              <Link href="/submit" className="text-[var(--accent)] hover:underline">Write your letter</Link>,{" "}
              <Link href="/memories" className="text-[var(--accent)] hover:underline">read what others have written</Link>,
              or explore{" "}
              <Link href="/unsent-letters" className="text-[var(--accent)] hover:underline">the tradition you are joining</Link>.
              This is a place where the unsaid is not lost &mdash; it is kept.
            </p>

            <p className="text-center mt-10 text-base sm:text-lg italic">
              Write what you held back.
            </p>
            <div className="text-center mt-4">
              <Link
                href="/submit"
                className="inline-block bg-[var(--accent)] text-white rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
              >
                Write Your Letter
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
