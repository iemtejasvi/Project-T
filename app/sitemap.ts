import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { isLinkableName } from '@/lib/nameUtils'

// Use service role to bypass RLS for sitemap generation
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.ifonlyisentthis.com'
  const currentDate = new Date()

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/memories`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }
  ]

  // Dynamic name pages from DB
  try {
    const supabase = getSupabase();
    if (supabase) {
      // Fetch distinct recipient names (approved, revealed)
      const nowIso = new Date().toISOString();
      const { data: recipients } = await supabase
        .from('memories')
        .select('recipient')
        .eq('status', 'approved')
        .or(`reveal_at.is.null,reveal_at.lte.${nowIso}`)
        .limit(5000);

      // Fetch distinct sender names
      const { data: senders } = await supabase
        .from('memories')
        .select('sender')
        .eq('status', 'approved')
        .or(`reveal_at.is.null,reveal_at.lte.${nowIso}`)
        .not('sender', 'is', null)
        .limit(5000);

      // Collect names and count occurrences
      const nameCounts = new Map<string, number>();
      if (recipients) {
        for (const r of recipients) {
          if (r.recipient) {
            const n = r.recipient.toLowerCase().trim();
            nameCounts.set(n, (nameCounts.get(n) || 0) + 1);
          }
        }
      }
      if (senders) {
        for (const s of senders) {
          if (s.sender) {
            const n = s.sender.toLowerCase().trim();
            nameCounts.set(n, (nameCounts.get(n) || 0) + 1);
          }
        }
      }

      // Add name routes: only linkable names with >= 3 messages (avoid thin content)
      let nameCount = 0;
      for (const [name, count] of nameCounts) {
        if (nameCount >= 5000) break;
        if (count < 3) continue;
        if (!isLinkableName(name)) continue;
        routes.push({
          url: `${baseUrl}/name/${encodeURIComponent(name)}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        });
        nameCount++;
      }
    }
  } catch (err) {
    console.error('Error generating name sitemap entries:', err);
  }

  return routes
}