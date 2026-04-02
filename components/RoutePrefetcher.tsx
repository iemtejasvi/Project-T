"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const warmup = async () => {
      try {
        // Let initial content paint first
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) return;

        // Prefetch common routes (code + RSC payload)
        router.prefetch("/memories");
        router.prefetch("/submit");
        router.prefetch("/how-it-works");
      } catch {
        // Silent
      }
    };

    warmup();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
