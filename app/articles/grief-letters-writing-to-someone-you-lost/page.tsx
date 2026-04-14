import Link from "next/link";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grief Letters: Writing to Someone You Lost",
  description: "How writing to someone who has died or a relationship that has ended can process grief, honour memory, and bring a measure of peace through unsent letters.",
  alternates: { canonical: '/articles/grief-letters-writing-to-someone-you-lost' },
  openGraph: {
    title: "Grief Letters: Writing to Someone You Lost",
    description: "How writing to the deceased or to a lost relationship can process grief, honour memory, and bring peace.",
    url: 'https://www.ifonlyisentthis.com/articles/grief-letters-writing-to-someone-you-lost',
    siteName: 'If Only I Sent This', type: 'article',
    images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: 'If Only I Sent This' }],
  },
};

export default function GriefLetters() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] desktop-heading">Grief Letters: Writing to Someone You Lost</h1>
          <hr className="my-4 border-[var(--border)]" />
          <nav>
            <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 desktop-nav-list">
              <li><Link href="/" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Home</Link></li>
              <li><Link href="/articles" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Articles</Link></li>
              <li><Link href="/submit" prefetch={false} className="text-[var(--text)] hover:text-[var(--accent)] desktop-nav-link">Confess</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <article className="bg-[var(--card-bg)] p-6 sm:p-10 rounded-xl shadow-lg border border-[var(--border)] lg:shadow-sm lg:border-transparent editorial-prose text-[var(--text)]">

            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">When the Recipient Can Never Read Your Words</h2>
            <p className="text-base sm:text-lg">
              Grief reshapes language. In the aftermath of losing someone — to death, to distance, to the slow erosion of a
              relationship that once defined your world — the words you most need to say often have nowhere to go. You cannot
              call them. You cannot text them at midnight. You cannot sit across from them and say the thing you have been
              carrying since they left. The grief letter exists for this exact impossibility: it is a letter to someone who
              cannot read it, and that is what gives it its power.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">The Continuing Bonds Theory</h2>
            <p className="text-base sm:text-lg">
              For much of the twentieth century, Western grief psychology was dominated by the idea that healthy mourning
              requires &ldquo;letting go&rdquo; of the deceased — severing the emotional bond so the bereaved can &ldquo;move
              on.&rdquo; This model, rooted in Freud&apos;s concept of &ldquo;grief work,&rdquo; has been largely overturned
              by contemporary research.
            </p>
            <p className="text-base sm:text-lg">
              The Continuing Bonds framework, developed by researchers Dennis Klass, Phyllis Silverman, and Steven Nickman,
              proposes that maintaining an ongoing, evolving relationship with the deceased is not pathological — it is normal,
              healthy, and often essential to long-term adjustment. Grieving people do not stop loving the person they lost;
              they find new ways to carry that love. The grief letter is one of the most natural expressions of continuing
              bonds: a way to keep the conversation going, to update the person on what they have missed, to say the things
              that were left unsaid.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">What Grief Letters Contain</h2>
            <p className="text-base sm:text-lg">
              Grief letters are rarely tidy. They do not follow the narrative arc of a eulogy or the controlled tone of a
              sympathy card. They are raw, recursive, and often contradictory — because grief itself is raw, recursive, and
              contradictory. A single grief letter might contain love, anger, guilt, gratitude, confusion, and humour within
              the same paragraph. This is not a sign of emotional instability; it is a sign of emotional honesty.
            </p>
            <p className="text-base sm:text-lg">
              Common themes in grief letters include: things the writer wishes they had said before the person died; updates
              on life events the person is missing; expressions of anger at the person for leaving; acknowledgments of guilt
              or regret; descriptions of how the loss has changed the writer; and simple, repeated statements of love. Many
              grief letters are addressed to pets — a loss that is frequently minimised by others but experienced as
              devastating by the bereaved. The grief letter does not judge the magnitude of the loss. It simply provides
              space for whatever the writer needs to say.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Writing Through Complicated Grief</h2>
            <p className="text-base sm:text-lg">
              Complicated grief — also called prolonged grief disorder — is characterised by persistent, intense yearning for
              the deceased, difficulty accepting the death, emotional numbness, bitterness, and a pervasive sense that life
              has lost its meaning. It affects an estimated seven to ten percent of bereaved individuals and is associated
              with increased risk of cardiovascular disease, substance use, suicidal ideation, and impaired immune function.
            </p>
            <p className="text-base sm:text-lg">
              Therapeutic approaches to complicated grief frequently incorporate letter writing as a core intervention. In
              Complicated Grief Therapy (CGT), developed by Dr. M. Katherine Shear at Columbia University, patients are
              asked to write letters to the deceased as a way of processing the ambivalent, unresolved aspects of the
              relationship. The letters serve as a bridge between avoidance (refusing to engage with the loss) and
              confrontation (engaging so intensely that the pain becomes overwhelming). Writing provides a middle ground:
              controlled engagement with the reality of the loss, at a pace the writer can manage.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">Grief Letters to the Living</h2>
            <p className="text-base sm:text-lg">
              Not all grief letters are addressed to the dead. Some of the most powerful grief letters are written to people
              who are still alive but functionally unreachable — a parent with Alzheimer&apos;s who no longer recognises you,
              a former partner who has asked you not to contact them, a friend whose betrayal ended a decade-long bond, a
              child who has become estranged.
            </p>
            <p className="text-base sm:text-lg">
              These forms of ambiguous loss — where the person is physically present but emotionally absent, or physically
              gone but psychologically present — can be even more difficult to process than death, because there is no
              clear endpoint, no funeral, no socially recognised mourning period. The grief letter provides structure to
              an experience that otherwise feels shapeless. By addressing the person directly, the writer creates a
              container for emotions that might otherwise diffuse into background anxiety or depression.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4">A Place for Your Grief</h2>
            <p className="text-base sm:text-lg">
              The grief letter does not cure grief. Nothing does. But it provides something essential: a place for the
              words to go. When you write to someone you have lost, you are not pretending they can hear you. You are
              acknowledging that the love, the anger, the regret, and the longing are real — and that they deserve
              language, even in the absence of a listener.
            </p>
            <p className="text-base sm:text-lg">
              If you are carrying words for someone who is gone,
              <Link href="/submit" className="text-[var(--accent)] hover:underline"> you can write them here</Link>.
              Your letter will be held with care, read by a person, and placed in an archive where it can exist quietly,
              as long as you need it to. You do not need to let go of the person to let go of the silence.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/submit" className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm hover:opacity-90 transition-opacity">
                Write Your Letter
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
