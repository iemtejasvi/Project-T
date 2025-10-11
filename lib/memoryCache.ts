// Memory caching system for instant loading
import { fetchMemoriesPaginated } from './dualMemoryDB';
import { getPerformanceMonitor } from './performanceMonitor';

interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  color: string;
  full_bg: boolean;
  animation?: string;
  pinned?: boolean;
  pinned_until?: string;
  ip?: string;
  country?: string;
  uuid?: string;
  tag?: string;
  sub_tag?: string;
}

interface CachedPage {
  data: Memory[];
  totalCount: number;
  totalPages: number;
  timestamp: number;
}

interface CacheKey {
  page: number;
  pageSize: number;
  filters: Record<string, string>;
  searchTerm: string;
  orderBy: Record<string, string>;
}

class MemoryCache {
  private cache: Map<string, CachedPage>;
  private readonly maxAge: number = 30000; // Cache for 30 seconds
  private readonly maxSize: number = 50; // Max 50 cached pages
  
  constructor() {
    this.cache = new Map();
    
    // Periodically clean up old cache entries
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanupOldEntries(), 60000); // Clean every minute
    }
  }
  
  private getCacheKey(key: CacheKey): string {
    return JSON.stringify({
      p: key.page,
      ps: key.pageSize,
      f: key.filters,
      s: key.searchTerm,
      o: key.orderBy
    });
  }
  
  private cleanupOldEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.maxAge) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }
  
  private enforceMaxSize(): void {
    if (this.cache.size > this.maxSize) {
      // Remove oldest entries first
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, entries.length - this.maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }
  
  async get(
    page: number,
    pageSize: number,
    filters: Record<string, string> = {},
    searchTerm: string = '',
    orderBy: Record<string, string> = {}
  ): Promise<{ data: Memory[], totalCount: number, totalPages: number, currentPage: number, fromCache: boolean }> {
    const monitor = getPerformanceMonitor();
    const cacheKey = this.getCacheKey({ page, pageSize, filters, searchTerm, orderBy });
    const cached = this.cache.get(cacheKey);
    const now = Date.now();
    
    // Return cached data if valid
    if (cached && (now - cached.timestamp) < this.maxAge) {
      monitor.startTimer('memory-fetch-cached');
      const result = {
        data: cached.data,
        totalCount: cached.totalCount,
        totalPages: cached.totalPages,
        currentPage: page,
        fromCache: true
      };
      monitor.endTimer('memory-fetch-cached');
      console.debug(`✨ Instant load from cache for page ${page}`);
      return result;
    }
    
    // Fetch fresh data
    monitor.startTimer('memory-fetch-fresh');
    const result = await fetchMemoriesPaginated(page, pageSize, filters, searchTerm, orderBy);
    monitor.endTimer('memory-fetch-fresh');
    
    if (!result.error) {
      // Cache the result
      this.cache.set(cacheKey, {
        data: result.data,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        timestamp: now
      });
      
      this.enforceMaxSize();
      
      // Prefetch adjacent pages in background for instant navigation
      this.prefetchAdjacentPages(page, pageSize, filters, searchTerm, orderBy, result.totalPages);
    }
    
    return {
      ...result,
      fromCache: false
    };
  }
  
  private async prefetchAdjacentPages(
    currentPage: number,
    pageSize: number,
    filters: Record<string, string>,
    searchTerm: string,
    orderBy: Record<string, string>,
    totalPages: number
  ): Promise<void> {
    // Prefetch next and previous pages
    const pagesToPrefetch = [];
    
    if (currentPage > 0) {
      pagesToPrefetch.push(currentPage - 1);
    }
    if (currentPage < totalPages - 1) {
      pagesToPrefetch.push(currentPage + 1);
    }
    
    // Also prefetch the next 2 pages for smooth scrolling
    if (currentPage < totalPages - 2) {
      pagesToPrefetch.push(currentPage + 2);
    }
    
    // Fetch in parallel but don't wait for completion
    Promise.all(
      pagesToPrefetch.map(async page => {
        const cacheKey = this.getCacheKey({ page, pageSize, filters, searchTerm, orderBy });
        
        // Skip if already cached
        if (this.cache.has(cacheKey)) {
          const cached = this.cache.get(cacheKey)!;
          if (Date.now() - cached.timestamp < this.maxAge) {
            return;
          }
        }
        
        try {
          const result = await fetchMemoriesPaginated(page, pageSize, filters, searchTerm, orderBy);
          if (!result.error) {
            this.cache.set(cacheKey, {
              data: result.data,
              totalCount: result.totalCount,
              totalPages: result.totalPages,
              timestamp: Date.now()
            });
            this.enforceMaxSize();
          }
        } catch (err) {
          // Ignore prefetch errors
          console.debug('Prefetch error:', err);
        }
      })
    ).catch(() => {
      // Ignore all prefetch errors
    });
  }
  
  invalidate(): void {
    this.cache.clear();
  }
  
  invalidateSearch(searchTerm: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      const parsed = JSON.parse(key);
      if (parsed.s === searchTerm) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

// Create singleton instance
let cacheInstance: MemoryCache | null = null;

export function getMemoryCache(): MemoryCache {
  if (!cacheInstance) {
    cacheInstance = new MemoryCache();
  }
  return cacheInstance;
}

// Export convenience function for fetching with cache
export async function fetchMemoriesWithCache(
  page: number = 0,
  pageSize: number = 10,
  filters: Record<string, string> = {},
  searchTerm: string = '',
  orderBy: Record<string, string> = {}
) {
  const cache = getMemoryCache();
  return cache.get(page, pageSize, filters, searchTerm, orderBy);
}
