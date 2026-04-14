import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles – Reflections on Unsent Letters, Emotions & Expression",
  description: "Explore thoughtful articles about unsent letters, emotional expression, expressive writing therapy, and the psychology behind the words we never say.",
  alternates: {
    canonical: '/articles',
  },
  openGraph: {
    title: "Articles – If Only I Sent This",
    description: "Explore thoughtful articles about unsent letters, emotional expression, expressive writing therapy, and the psychology behind the words we never say.",
    url: 'https://www.ifonlyisentthis.com/articles',
    siteName: 'If Only I Sent This',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Articles – If Only I Sent This",
    description: "Explore thoughtful articles about unsent letters, emotional expression, and the psychology behind the words we never say.",
    images: ['/opengraph-image.png'],
  },
};

const articles = [
  {
    href: "/articles/psychology-of-unsent-letters",
    title: "The Psychology of Unsent Letters",
    description: "Why do we write letters we never send? Explore the cognitive and emotional mechanisms behind unsent letters and what psychology tells us about withholding words.",
  },
  {
    href: "/articles/how-to-write-a-letter-you-will-never-send",
    title: "How to Write a Letter You Will Never Send",
    description: "A practical, reflective guide to writing unsent letters — from choosing your recipient to releasing what you have been carrying.",
  },
  {
    href: "/articles/emotional-release-through-writing",
    title: "Emotional Release Through Writing",
    description: "How putting feelings into words activates different parts of the brain and creates measurable emotional relief.",
  },
  {
    href: "/articles/famous-unsent-letters-in-history",
    title: "Famous Unsent Letters in History",
    description: "From Beethoven's Immortal Beloved to Kafka's letters to Felice — the unsent letters that shaped literary and cultural history.",
  },
  {
    href: "/articles/why-we-hold-back-words",
    title: "Why We Hold Back Words",
    description: "The social, psychological, and evolutionary reasons humans suppress emotional language — and the cost of silence.",
  },
  {
    href: "/articles/grief-letters-writing-to-someone-you-lost",
    title: "Grief Letters: Writing to Someone You Lost",
    description: "How writing to the deceased or to a lost relationship can process grief, honour memory, and bring a measure of peace.",
  },
  {
    href: "/articles/digital-age-confessions",
    title: "Confessions in the Digital Age",
    description: "From PostSecret to anonymous apps — how the internet transformed the ancient human need to confess and be heard.",
  },
  {
    href: "/articles/therapeutic-benefits-of-expressive-writing",
    title: "The Therapeutic Benefits of Expressive Writing",
    description: "Decades of research show that expressive writing improves mental and physical health. Here is what the science says.",
  },
  {
    href: "/articles/anonymous-expression-and-mental-health",
    title: "Anonymous Expression and Mental Health",
    description: "Why anonymity can unlock emotional honesty, reduce shame, and create a safer space for vulnerable self-expression.",
  },
  {
    href: "/articles/art-of-letting-go-through-words",
    title: "The Art of Letting Go Through Words",
    description: "Writing as a release valve — how naming emotions on paper helps the brain process and eventually release them.",
  },
  {
    href: "/articles/writing-closure-letters",
    title: "Writing Closure Letters",
    description: "When you cannot get closure from another person, you can write it for yourself. A guide to closure letters and how they help.",
  },
  {
    href: "/articles/love-you-never-expressed",
    title: "The Love You Never Expressed",
    description: "On the particular ache of unexpressed love — why it stays with us, what it means, and how writing about it can bring relief.",
  },
];

export default function Articles() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Articles</h1>
          <p className="mt-2 text-[var(--text)] opacity-70 text-base sm:text-lg">Reflections on unsent letters, emotional expression, and the words we never say.</p>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li><Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Home</Link></li>
              <li><Link href="/memories" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Archive</Link></li>
              <li><Link href="/submit" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Confess</Link></li>
              <li><Link href="/how-it-works" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] whitespace-nowrap desktop-nav-link">How It Works</Link></li>
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
                className="group bg-[var(--card-bg)] p-6 rounded-xl shadow-md border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
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
