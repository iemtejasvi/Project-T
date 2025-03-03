import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">About</h1>
          <hr className="my-4 border-gray-300" />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link href="/memories" className="hover:text-blue-600">Memories</Link></li>
              <li><Link href="/submit" className="hover:text-blue-600">Submit</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-8">
        <article className="bg-white/90 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">A Tale of Unsent Words</h2>
          <p className="text-lg text-gray-700 mb-4">
            This space is a tribute to a first love that left us with a thousand unsent messages.
            It is a sanctuary for memories that were never fully expressed—a place where every word,
            every regret, and every tear is honored.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            We remember that bittersweet moment when courage failed, and the last words remained
            locked inside our hearts. Here, you can relive those moments, find solace in shared sorrow,
            and honor the love that once was.
          </p>
          <p className="text-lg text-gray-700">
            This archive is for anyone who has loved deeply and lost painfully, who still holds onto
            the hope of one more chance to say goodbye—or maybe, even, hello.
          </p>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} If Only I Sent This
        </div>
      </footer>
    </div>
  );
}
