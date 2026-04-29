import Link from "next/link";
import Footer from "@/components/Footer";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal – Reflections on Unsent Letters, Emotions & Expression",
  description: "Explore thoughtful articles about unsent letters, emotional expression, expressive writing therapy, and the psychology behind the words we never say.",
  alternates: {
    canonical: '/journal',
  },
  openGraph: {
    title: "Journal – If Only I Sent This",
    description: "Explore thoughtful articles about unsent letters, emotional expression, expressive writing therapy, and the psychology behind the words we never say.",
    url: 'https://www.ifonlyisentthis.com/journal',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Journal – If Only I Sent This",
    description: "Explore thoughtful articles about unsent letters, emotional expression, and the psychology behind the words we never say.",
    images: ['/opengraph-image.png'],
  },
};

const articles = [
  {
    href: "/journal/psychology-of-unsent-letters",
    title: "The Psychology Behind Unsent Letters",
    description: "Why do we write letters we never send? Explore the cognitive and emotional mechanisms behind unsent letters and what psychology tells us about withholding words.",
  },
  {
    href: "/journal/how-to-write-a-letter-you-will-never-send",
    title: "How to Write a Letter You'll Never Send",
    description: "A practical, reflective guide to writing unsent letters — from choosing your recipient to releasing what you have been carrying.",
  },
  {
    href: "/journal/emotional-release-through-writing",
    title: "The Emotional Power of Writing It Down",
    description: "How putting feelings into words activates different parts of the brain and creates measurable emotional relief.",
  },
  {
    href: "/journal/famous-unsent-letters-in-history",
    title: "Famous Unsent Letters That Shaped History",
    description: "From Beethoven's Immortal Beloved to Kafka's letters to Felice — the unsent letters that shaped literary and cultural history.",
  },
  {
    href: "/journal/why-we-hold-back-words",
    title: "Why We Hold Back the Words That Matter",
    description: "The social, psychological, and evolutionary reasons humans suppress emotional language — and the cost of silence.",
  },
  {
    href: "/journal/grief-letters-writing-to-someone-you-lost",
    title: "Letters to the Lost — Writing Through Grief",
    description: "How writing to the deceased or to a lost relationship can process grief, honour memory, and bring a measure of peace.",
  },
  {
    href: "/journal/digital-age-confessions",
    title: "Confessions in the Digital Age",
    description: "From PostSecret to anonymous apps — how the internet transformed the ancient human need to confess and be heard.",
  },
  {
    href: "/journal/therapeutic-benefits-of-expressive-writing",
    title: "The Science of Expressive Writing",
    description: "Decades of research show that expressive writing improves mental and physical health. Here is what the science says.",
  },
  {
    href: "/journal/anonymous-expression-and-mental-health",
    title: "Anonymous Expression and the Quiet Art of Healing",
    description: "Why anonymity can unlock emotional honesty, reduce shame, and create a safer space for vulnerable self-expression.",
  },
  {
    href: "/journal/art-of-letting-go-through-words",
    title: "Letting Go, One Word at a Time",
    description: "Writing as a release valve — how naming emotions on paper helps the brain process and eventually release them.",
  },
  {
    href: "/journal/writing-closure-letters",
    title: "The Closure Letter — Writing the Ending You Deserve",
    description: "When you cannot get closure from another person, you can write it for yourself. A guide to closure letters and how they help.",
  },
  {
    href: "/journal/love-you-never-expressed",
    title: "The Love You Never Said Out Loud",
    description: "On the particular ache of unexpressed love — why it stays with us, what it means, and how writing about it can bring relief.",
  },
  {
    href: "/journal/messages-you-almost-sent",
    title: "The Messages You Almost Sent",
    description: "The draft in your notes app. The text you deleted at 3am. Why almost-sent messages haunt us — and how to finally release them.",
  },
  {
    href: "/journal/missing-your-ex-and-letting-go",
    title: "You Don\u2019t Want Them Back. You Want the Feeling Back.",
    description: "You googled how to get your ex back. You tried no contact and manifestation. But what you actually miss is who you were with them.",
  },
  {
    href: "/unsent-letters",
    title: "The Art of Unsent Letters",
    description: "From Kafka's letters to Felice to the text you deleted at 2am — unsent letters are humanity's most honest form of expression.",
  },
  {
    href: "/love-letters-never-sent",
    title: "Love Letters Never Sent",
    description: "From Neruda's unnamed beloved to the words you never said — love letters never sent are the most honest kind.",
  },
  {
    href: "/unsent-project-alternative",
    title: "The Best Unsent Project Alternative",
    description: "Looking for a modern alternative to The Unsent Project? Compare features and discover a faster, more customisable platform for your unsent letters.",
  },
];

export default function Articles() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Journal</h1>
          <p className="mt-2 text-[var(--text)] opacity-70 text-base sm:text-lg">Reflections on unsent letters, emotional expression, and the words we never say.</p>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-nowrap items-center justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li><Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Home</Link></li>
              <li><Link href="/memories" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Archive</Link></li>
              <li><Link href="/submit" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Confess</Link></li>
              <MoreOptionsDropdown />
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="article-card group bg-[var(--card-bg)] p-6 rounded-xl shadow-md border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
              >
                <h2 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-[var(--text)] opacity-70 leading-relaxed">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
