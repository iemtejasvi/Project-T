import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import MoreOptionsDropdown from "@/components/MoreOptionsDropdown";

export const metadata: Metadata = {
  title: "You Don\u2019t Want Them Back. You Want the Feeling Back. — On Missing Your Ex, Manifesting, and Letting Go",
  description: "You googled how to get your ex back. You tried no contact, manifestation, and letting go. But what you actually miss is not the person \u2014 it\u2019s who you were with them. On breakup recovery, moving on, and writing what you cannot say.",
  alternates: { canonical: '/journal/missing-your-ex-and-letting-go' },
  openGraph: {
    title: "You Don\u2019t Want Them Back. You Want the Feeling Back.",
    description: "You googled how to get your ex back. But what you actually miss is not the person \u2014 it\u2019s who you were with them.",
    url: 'https://www.ifonlyisentthis.com/journal/missing-your-ex-and-letting-go',
    siteName: 'If Only I Sent This', type: 'article',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
};

export default function MissingYourExAndLettingGo() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">You Don&rsquo;t Want Them Back. You Want the Feeling Back.</h1>
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
          <article className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] lg:shadow-sm lg:border-transparent editorial-prose text-[var(--text)]">

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">You Googled &ldquo;How to Get My Ex Back&rdquo;</h2>
            <p className="text-base sm:text-lg">
              It is 2 AM and you are reading your fifth article about how to get your ex back. You have read about
              the no contact rule. You have read about manifesting your ex with scripting and visualization and 369
              methods. You have read about attachment styles, about whether they are an avoidant or you are the
              anxious one, about what it means when they watch your stories but do not text you. You have consumed
              every piece of breakup advice the internet has to offer and you are still lying in the dark with
              their name in your chest like something swallowed wrong.
            </p>
            <p className="text-base sm:text-lg">
              Here is what none of those articles will tell you: you probably do not want them back. Not really.
              Not the actual person who left. What you want is the version of your life that had them in it. You
              want the feeling of being chosen. You want Saturday mornings and inside jokes and someone who knew
              your coffee order. You want the version of yourself that existed when someone loved you &mdash; the
              lighter one, the one that laughed more, the one that did not check their phone with this
              particular kind of dread.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">The No Contact Rule and What It Actually Does</h2>
            <p className="text-base sm:text-lg">
              Everyone going through a breakup encounters the no contact rule eventually. Do not text them for
              30 days. Do not check their social media. Do not ask their friends about them. The advice is
              framed as a strategy to get your ex back &mdash; they will miss you, they will wonder about you,
              the distance will make them realize what they lost. And sometimes that happens. But that is not
              why no contact works.
            </p>
            <p className="text-base sm:text-lg">
              No contact works because it forces you to sit with the withdrawal. Missing your ex is not just
              emotional. It is chemical. Your brain built neural pathways around this person &mdash; their voice
              activated your reward system, their presence regulated your nervous system, their texts gave you
              a dopamine hit that you are now cut off from. When you stop contacting them, you are not playing
              a game. You are going through withdrawal from a person. And the only way through withdrawal is
              through it. Not around it. Not by manifesting them back into your bed. Through it.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Manifesting an Ex &mdash; What You Are Really Doing</h2>
            <p className="text-base sm:text-lg">
              Manifesting your ex back has become enormously popular. Write their name 33 times. Visualize them
              texting you. Script the reconciliation in your journal. Sleep with their photo under your pillow.
              The internet is full of success stories. <em>I manifested my ex back in two weeks. I used the
              369 method and they called me.</em> And maybe they did call. But here is the thing nobody mentions:
              most people who &ldquo;manifested&rdquo; their ex back broke up again within months. Because the
              thing that made the relationship end did not dissolve because someone wrote in a journal.
            </p>
            <p className="text-base sm:text-lg">
              What manifestation actually does &mdash; the real, psychological mechanism behind it &mdash; is give
              you a sense of control during a time when you feel completely powerless. Breakups strip away your
              agency. You did not choose this. You could not prevent it. You cannot fix it. Manifestation gives
              your brain something to do with all that frantic energy. And that is not worthless. The act of
              writing about what you want, of imagining a future, of sitting quietly with your feelings instead
              of numbing them &mdash; that has real psychological value. But the value is in the process, not in
              the outcome. The writing heals you. The person coming back would not.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Why You Can&rsquo;t Stop Thinking About Your Ex</h2>
            <p className="text-base sm:text-lg">
              You have tried everything to stop thinking about them. You deleted the photos. You unfollowed them.
              You went on dates with other people and spent the entire dinner comparing them to the person who
              left. You cannot stop thinking about your ex because your brain has not finished processing what
              happened. It is not a failure of willpower. It is your mind trying to complete an experience that
              was left unfinished.
            </p>
            <p className="text-base sm:text-lg">
              This is why breakups without closure are the hardest to recover from. When someone leaves without
              explanation, when the relationship ends ambiguously, when you never got the conversation that would
              have made the ending make sense &mdash; your brain cannot file it as &ldquo;complete.&rdquo; So
              it keeps pulling the memory back up, running through it again and again, looking for the missing
              piece. You are not obsessing. You are processing. And the processing will not finish until you
              give it somewhere to go.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Moving On Is Not What You Think It Is</h2>
            <p className="text-base sm:text-lg">
              Moving on from an ex does not mean you stop caring about them. It does not mean you wake up one
              morning and feel nothing. People who tell you to &ldquo;just move on&rdquo; have either never been
              truly devastated by a breakup or have forgotten what it felt like. Moving on is not the absence
              of feeling. It is the shift from <em>I need this person</em> to <em>I survived losing this person.</em> That
              shift does not happen because you forced it. It happens because you finally allowed yourself to feel
              the full weight of the loss without trying to fix it, reverse it, or manifest it away.
            </p>
            <p className="text-base sm:text-lg">
              Getting over an ex is not a straight line. It is a spiral. You will feel fine for two weeks and
              then hear a song in a grocery store and cry in your car. You will think you have healed and then
              dream about them so vividly that you wake up reaching for the other side of the bed. This is
              normal. This is not failure. This is what it looks like when a human being processes the loss
              of someone who mattered to them. There is no shortcut. There is no manifestation technique
              that skips the grief. There is only the willingness to feel it.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Write the Thing You Cannot Send Them</h2>
            <p className="text-base sm:text-lg">
              If you are still carrying something you needed to say to your ex &mdash; the apology, the
              accusation, the question, the confession, the <em>I still love you</em> or the <em>I wish
              I never met you</em> &mdash; you do not have to send it to them. You do not have to keep it
              inside either. You can <Link href="/submit" className="text-[var(--accent)] hover:underline">write
              it here</Link>. Not as a letter to be delivered. As something to be released. An anonymous
              message, addressed to the person who will never read it, placed in an archive of unsent words
              written by thousands of people who felt exactly what you feel right now.
            </p>
            <p className="text-base sm:text-lg">
              You do not need them to read it for it to matter. You do not need them to come back for you to
              heal. You do not need to manifest a text from them or engineer a coincidental meeting or decode
              their Instagram activity for hidden signals. You need to say the thing you have been carrying
              and put it down. That is not giving up. That is not letting go. That is choosing yourself
              over the waiting.
            </p>
            <p className="text-base sm:text-lg">
              The <Link href="/memories" className="text-[var(--accent)] hover:underline">archive</Link> is
              full of messages from people who still love someone who left, who miss someone who forgot them,
              who are angry at someone who will never apologize. You are not alone in this. You were never
              alone in this. And the first step toward feeling better is not getting them back. It is finally
              saying what you could not say while you were still hoping they would stay.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/submit" className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity">
                Write What You Cannot Send
              </Link>
              <Link href="/journal" className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                Browse the Journal
              </Link>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
