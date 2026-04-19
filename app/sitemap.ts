import { MetadataRoute } from 'next'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { isLinkableName } from '@/lib/nameUtils'

export const revalidate = 3600 // ISR: regenerate sitemap at most once per hour

// In-memory guard: prevent concurrent regeneration from hammering the DB.
// Once the sitemap is built, the ISR cache serves it for `revalidate` seconds.
let _lastGeneratedAt = 0;
let _cachedRoutes: MetadataRoute.Sitemap | null = null;
const MIN_REGEN_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Module-level singleton — reused across requests in the same Lambda
let _supabase: SupabaseClient | null | undefined;
function getSupabase() {
  if (_supabase !== undefined) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) { _supabase = null; return null; }
  _supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _supabase;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // SECURITY: In-memory dedup — if we generated within the last 5 min, return cached result.
  // This prevents DoS via repeated cold-cache sitemap requests.
  const now = Date.now();
  if (_cachedRoutes && (now - _lastGeneratedAt) < MIN_REGEN_INTERVAL_MS) {
    return _cachedRoutes;
  }

  const baseUrl = 'https://www.ifonlyisentthis.com'

  // Static routes with stable lastModified dates
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/memories`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/unsent-letters`,
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/love-letters-never-sent`,
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date('2026-04-14'),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    // Articles hub + individual articles
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal/psychology-of-unsent-letters`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/how-to-write-a-letter-you-will-never-send`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/emotional-release-through-writing`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/famous-unsent-letters-in-history`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/why-we-hold-back-words`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/grief-letters-writing-to-someone-you-lost`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/digital-age-confessions`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/therapeutic-benefits-of-expressive-writing`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/anonymous-expression-and-mental-health`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/art-of-letting-go-through-words`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/writing-closure-letters`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal/love-you-never-expressed`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic name pages from DB
  try {
    const supabase = getSupabase();
    if (supabase) {
      const nowIso = new Date().toISOString();

      // Paginate through all approved memories to avoid the 5000-row Supabase limit.
      // Only select the name columns to minimize payload.
      const nameCounts = new Map<string, number>();
      const PAGE_SIZE = 5000;

      async function fetchAllNames(column: 'recipient' | 'sender') {
        let page = 0;
        let hasMore = true;
        const notNullFilter = column === 'sender';
        while (hasMore) {
          let query = supabase!
            .from('memories')
            .select(column)
            .eq('status', 'approved')
            .or(`reveal_at.is.null,reveal_at.lte.${nowIso}`)
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
          if (notNullFilter) query = query.not('sender', 'is', null);
          const { data } = await query;
          if (!data || data.length === 0) { hasMore = false; break; }
          for (const row of data) {
            const name = (row as Record<string, string>)[column];
            if (name) {
              const n = name.toLowerCase().trim();
              nameCounts.set(n, (nameCounts.get(n) || 0) + 1);
            }
          }
          if (data.length < PAGE_SIZE) hasMore = false;
          page++;
        }
      }

      await Promise.all([fetchAllNames('recipient'), fetchAllNames('sender')]);

      // Add name routes: only linkable names with >= 3 messages (avoid thin content)
      for (const [name, count] of nameCounts) {
        if (count < 5) continue;
        if (!isLinkableName(name)) continue;
        routes.push({
          url: `${baseUrl}/name/${encodeURIComponent(name)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        });
      }
    }
  } catch (err) {
    console.error('Error generating name sitemap entries:', err);
  }

  // Dynamic individual memory pages
  try {
    const supabase = getSupabase();
    if (supabase) {
      const nowIso = new Date().toISOString();
      const MEM_PAGE_SIZE = 5000;
      let page = 0;
      let hasMore = true;
      while (hasMore) {
        const { data, error } = await supabase
          .from('memories')
          .select('id, created_at')
          .eq('status', 'approved')
          .or(`reveal_at.is.null,reveal_at.lte.${nowIso}`)
          .is('destruct_at', null)
          .or('night_only.is.null,night_only.eq.false')
          .order('created_at', { ascending: false })
          .range(page * MEM_PAGE_SIZE, (page + 1) * MEM_PAGE_SIZE - 1);
        if (error || !data || data.length === 0) { hasMore = false; break; }
        for (const row of data) {
          routes.push({
            url: `${baseUrl}/memories/${row.id}`,
            lastModified: new Date(row.created_at),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
          });
        }
        if (data.length < MEM_PAGE_SIZE) hasMore = false;
        page++;
      }
    }
  } catch (err) {
    console.error('Error generating memory sitemap entries:', err);
  }

  // Cache the result in-memory for the dedup guard
  _cachedRoutes = routes;
  _lastGeneratedAt = Date.now();

  return routes
}
