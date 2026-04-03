export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <div className="h-9 w-56 mx-auto rounded bg-[var(--text)]/5 animate-pulse" />
          <hr className="my-4 border-[var(--border)]" />
          <div className="flex justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-14 rounded bg-[var(--text)]/5 animate-pulse" />
            ))}
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[var(--text)] animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
