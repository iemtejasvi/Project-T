import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
      <header className="bg-gray-900/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-bold text-gray-200">How It Works</h1>
          <hr className="my-4 border-gray-600" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6 text-gray-400">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-teal-400 transition-colors duration-200">
                  Memories
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-teal-400 transition-colors duration-200">
                  Submit
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        <article className="bg-gray-800/90 p-8 rounded-lg shadow-lg text-gray-300">
          <h2 className="text-3xl font-semibold mb-4 text-gray-200">A Digital Graveyard for Unsent Words</h2>
          <p className="text-lg mb-4">
            If Only I Sent This is a sanctuary for the messages you never sent—a place where unspoken words find rest. Whether it’s a letter to a lost loved one, a pet, or a fleeting moment, this site holds your unsent memories with care.
          </p>
          <p className="text-lg mb-4">
            Create memory cards to capture your regrets, confessions, or farewells. Each card is a quiet tribute to what might have been, shared with a community that understands the weight of silence.
          </p>
          <h3 className="text-2xl font-semibold mb-2 text-gray-200">How to Use This Space</h3>
          <ul className="list-disc list-inside text-lg mb-4">
            <li>
              <strong>Submit a Memory:</strong> Go to the Submit page, enter a recipient and message, and choose a color and effect to personalize your card.
            </li>
            <li>
              <strong>Special Effects:</strong> Add "Bleeding Text" or "Handwritten Text" to your message. These cards are marked with a star (★) on the home page.
            </li>
            <li>
              <strong>View Memories:</strong> On the home page, click a card to flip it and read the message, or use the arrow to see it in detail.
            </li>
            <li>
              <strong>Rotating Quotes:</strong> Reflect on the home page’s changing quotes, designed to set a somber tone.
            </li>
          </ul>
          <p className="text-lg">
            Explore the memories left by others or add your own. This is a place for closure, reflection, and the beauty of the unsaid.
          </p>
        </article>
      </main>

      <footer className="bg-gray-900/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
