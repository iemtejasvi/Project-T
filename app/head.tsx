export default function Head() {
  return (
    <>
      {/* Preconnect Supabase origins early so Lighthouse sees them and connections are warmed */}
      <link
        rel="preconnect"
        href="https://ppkbuhaklzbgwvaaoudn.supabase.co"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://goltnprxtenbrkxcvsha.supabase.co"
        crossOrigin="anonymous"
      />
    </>
  );
}
