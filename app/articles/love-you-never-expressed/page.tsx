import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";

export const metadata: Metadata = {
  title: "The Love You Never Said Out Loud – On Unexpressed Love and Why It Stays With Us",
  description: "On the particular ache of unexpressed love — why it stays with us, what it means, and how writing about it can bring understanding and relief.",
  alternates: { canonical: '/articles/love-you-never-expressed' },
  openGraph: {
    title: "The Love You Never Said Out Loud",
    description: "On the particular ache of unexpressed love — why it stays with us and how writing about it can bring relief.",
    url: 'https://www.ifonlyisentthis.com/articles/love-you-never-expressed',
    siteName: 'If Only I Sent This', type: 'article',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
};

export default function LoveYouNeverExpressed() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">The Love You Never Said Out Loud</h1>
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
          <article className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] lg:shadow-sm lg:border-transparent editorial-prose text-[var(--text)]">

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">The Weight of Unspoken Love</h2>
            <p className="text-base sm:text-lg">
              There is a particular kind of ache that belongs exclusively to love that was felt but never spoken. It is different
              from heartbreak, which at least implies that the love was known to both parties. It is different from rejection,
              which at least implies that the words were said. Unexpressed love carries a unique psychological signature: the
              combination of fullness and absence, of wanting and withholding, of knowing what you feel and choosing — for
              reasons that may or may not be rational — not to say it.
            </p>
            <p className="text-base sm:text-lg">
              Almost everyone has experienced this. The friend you loved in a way that exceeded friendship but could never
              name without risking what you had. The person at work whose presence rearranged your day. The ex you let go
              of before you fully understood what you were holding. The parent you loved fiercely but could never tell in
              plain language because your family did not speak that way. Unexpressed love is not rare. It may be the most
              common form of love there is.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Why We Do Not Say It</h2>
            <p className="text-base sm:text-lg">
              The reasons for withholding love are as varied as love itself. Fear of rejection is the most obvious — the
              paralysing calculation that saying &ldquo;I love you&rdquo; could cost you the person entirely. But there
              are subtler forces at work. Timing: you recognised the feeling only after the moment had passed. Power
              dynamics: expressing love would shift the balance of a relationship in a direction you could not control.
              Identity: the love you felt did not match the identity you had constructed for yourself. Protection: the
              person you loved was fragile, spoken for, or in a position where your confession would create obligation
              rather than joy.
            </p>
            <p className="text-base sm:text-lg">
              Sometimes the reason is simpler and more painful: you did not have the language. Many people grow up in
              environments where love is demonstrated through action but never articulated in words. They learn to cook
              for the people they love, to fix things, to show up — but they never learn to say &ldquo;I love you&rdquo;
              in a way that feels natural. The words exist in their chest but never make it to their mouth. By the time
              they realise they needed to say it, the person is gone.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">The Psychology of Romantic Regret</h2>
            <p className="text-base sm:text-lg">
              Research on regret consistently finds that people regret inaction more than action over the long term. In a
              foundational study by Gilovich and Medvec, participants asked to describe their single greatest regret in
              life overwhelmingly cited things they <em>did not</em> do — with unexpressed romantic feelings ranking among
              the most commonly reported. The pain of rejection fades. The pain of never knowing does not.
            </p>
            <p className="text-base sm:text-lg">
              Psychologists attribute this asymmetry to the brain&apos;s capacity for cognitive rationalisation. When you
              take an action and it fails, your brain constructs narratives that soften the blow: &ldquo;It was not meant
              to be,&rdquo; &ldquo;I learned from it,&rdquo; &ldquo;At least I tried.&rdquo; But when you fail to act,
              the brain has less material to work with. There is no outcome to reinterpret, no lesson to extract — only
              the persistent question of what might have happened if you had spoken. That question becomes a low-grade
              hum that can persist for years, even decades.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Unexpressed Love in Literature</h2>
            <p className="text-base sm:text-lg">
              The literary tradition is saturated with unexpressed love. Gabriel Garcia Marquez&apos;s <em>Love in the Time
              of Cholera</em> follows Florentino Ariza across fifty-one years of silent devotion. Kazuo Ishiguro&apos;s
              <em> The Remains of the Day</em> depicts a butler whose entire life is shaped by a love he could never
              articulate. Emily Bronte&apos;s <em>Wuthering Heights</em>, Edith Wharton&apos;s <em>The Age of Innocence</em>,
              Carson McCullers&apos; <em>The Heart Is a Lonely Hunter</em> — the canon of Western literature returns
              obsessively to the same theme: the devastating gravity of love that remains locked inside.
            </p>
            <p className="text-base sm:text-lg">
              These stories endure because they articulate something that nearly every reader has lived. The unexpressed
              love story is not tragic because the love was unrequited — it is tragic because the love was never given
              the chance to be requited. The silence was the tragedy, not the feeling.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Writing the Love You Could Not Speak</h2>
            <p className="text-base sm:text-lg">
              Writing about unexpressed love does not undo the silence. It does not retroactively deliver the words to
              the person who needed to hear them. What it does — and the research on expressive writing supports this
              consistently — is transform the relationship between the writer and the feeling. When you write &ldquo;I
              loved you and I never told you&rdquo; to a person who will never read it, something shifts. The feeling
              is no longer trapped inside you. It exists in language, outside of your body, in a form that can be read,
              witnessed, and — eventually — released.
            </p>
            <p className="text-base sm:text-lg">
              The unsent love letter is not a substitute for the conversation you never had. It is its own act, with its
              own meaning. It is the acknowledgment that what you felt was real, that it mattered, and that it deserves
              to exist somewhere outside of your chest. Many of the most beautiful submissions
              to <Link href="/" className="text-[var(--accent)] hover:underline">If Only I Sent This</Link> are
              exactly this: love letters to people who will never know they were written. They are not failures of
              communication. They are its purest form.
            </p>

            <blockquote className="border-l-4 border-[var(--accent)] pl-4 my-6 italic text-base sm:text-lg opacity-85">
              &ldquo;I loved you in a language you could not hear. I am writing it now so it can finally exist somewhere.&rdquo;
            </blockquote>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/submit" className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity">
                Write Your Love Letter
              </Link>
              <Link href="/articles" className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                More Articles
              </Link>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
