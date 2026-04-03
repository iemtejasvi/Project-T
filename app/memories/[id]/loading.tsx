export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="rounded-[1.5rem] bg-[var(--card-bg)] border border-[var(--border)] p-8 flex flex-col items-center gap-4 shadow-sm">
          <div className="h-5 w-36 rounded bg-[var(--text)]/5 animate-pulse" />
          <hr className="w-full border-[var(--border)]" />
          <div className="space-y-3 w-full">
            <div className="h-4 w-full rounded bg-[var(--text)]/5 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-[var(--text)]/5 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-[var(--text)]/5 animate-pulse" />
          </div>
          <hr className="w-full border-[var(--border)]" />
          <div className="h-3 w-40 rounded bg-[var(--text)]/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
