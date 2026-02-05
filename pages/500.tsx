export default function Custom500() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-base opacity-70">
        A server error occurred. Please try again in a moment.
      </p>
    </main>
  );
}
