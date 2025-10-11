// Ultra-performant, future-proof caching system for millions of memories
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

interface CachedData {
  data: Memory[];
  totalCount: number;
  totalPages: number;
  timestamp: number;
  etag?: string;
  isStale?: boolean;
}

interface CacheOptions {
  maxAge?: number;
  staleWhileRevalidate?: number;
  prefetchDepth?: number;
}

class UltraCache {
  private cache: Map<string, CachedData>;
  private prefetchQueue: Set<string>;
  private pendingFetches: Map<string, Promise<any>>;
  private readonly maxAge: number = 1800000; // 30 minutes cache (increased for better performance)
  private readonly staleWhileRevalidate: number = 3600000; // 1 hour stale-while-revalidate
  private readonly maxSize: number = 1000; // Support thousands of pages
  private readonly prefetchDepth: number = 5; // Prefetch 5 pages ahead
  
  constructor() {
    this.cache = new Map();
    this.prefetchQueue = new Set();
    this.pendingFetches = new Map();
    
    // Initialize cache with localStorage if available
    if (typeof window !== 'undefined') {
      this.restoreFromLocalStorage();
      
      // Save to localStorage periodically
      setInterval(() => this.persistToLocalStorage(), 30000); // Save every 30s
      
      // Clean up old entries less frequently
      setInterval(() => this.cleanupOldEntries(), 600000); // Clean every 10 minutes
      
      // Process prefetch queue
      setInterval(() => this.processPrefetchQueue(), 100); // Process queue frequently
      
      // Save on page unload
      window.addEventListener('beforeunload', () => this.persistToLocalStorage());
    }
  }
  
  private getCacheKey(
    page: number,
    pageSize: number,
    filters: Record<string, string> = {},
    searchTerm: string = '',
    orderBy: Record<string, string> = {}
  ): string {
    // Compact key format for efficiency
    return `${page}:${pageSize}:${JSON.stringify(filters)}:${searchTerm}:${JSON.stringify(orderBy)}`;
  }
  
  private restoreFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('ultraCache');
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        
        // Restore entries that aren't too old
        Object.entries(parsed).forEach(([key, value]: [string, any]) => {
          if (now - value.timestamp < this.staleWhileRevalidate) {
            this.cache.set(key, value);
          }
        });
        
        console.debug(`✨ Restored ${this.cache.size} cache entries from localStorage`);
      }
    } catch (err) {
      console.debug('Cache restore error:', err);
    }
  }
  
  private persistToLocalStorage(): void {
    try {
      const toStore: Record<string, CachedData> = {};
      const now = Date.now();
      
      // Only persist recent entries
      this.cache.forEach((value, key) => {
        if (now - value.timestamp < this.staleWhileRevalidate) {
          toStore[key] = value;
        }
      });
      
      localStorage.setItem('ultraCache', JSON.stringify(toStore));
    } catch (err) {
      // Ignore storage errors (quota exceeded, etc)
      console.debug('Cache persist error:', err);
    }
  }
  
  private cleanupOldEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.staleWhileRevalidate) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.debug(`🧹 Cleaned ${keysToDelete.length} old cache entries`);
    }
  }
  
  private enforceMaxSize(): void {
    if (this.cache.size > this.maxSize) {
      // LRU eviction - remove oldest entries
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, Math.floor(this.maxSize * 0.2)); // Remove 20% when full
      toRemove.forEach(([key]) => this.cache.delete(key));
      
      console.debug(`📦 Evicted ${toRemove.length} cache entries`);
    }
  }
  
  async get(
    page: number,
    pageSize: number,
    filters: Record<string, string> = {},
    searchTerm: string = '',
    orderBy: Record<string, string> = {},
    options: CacheOptions = {}
  ): Promise<{ data: Memory[], totalCount: number, totalPages: number, currentPage: number, fromCache: boolean }> {
    const monitor = getPerformanceMonitor();
    const cacheKey = this.getCacheKey(page, pageSize, filters, searchTerm, orderBy);
    
    // Check if already fetching
    if (this.pendingFetches.has(cacheKey)) {
      console.debug('⏳ Waiting for pending fetch...');
      return this.pendingFetches.get(cacheKey)!;
    }
    
    const cached = this.cache.get(cacheKey);
    const now = Date.now();
    
    // Return cached data if fresh
    if (cached && (now - cached.timestamp) < this.maxAge) {
      monitor.startTimer('cache-hit');
      
      // Mark as stale if getting old
      if (now - cached.timestamp > this.maxAge / 2) {
        cached.isStale = true;
        this.revalidateInBackground(page, pageSize, filters, searchTerm, orderBy);
      }
      
      // Aggressively prefetch adjacent pages
      this.prefetchAdjacentPages(page, pageSize, filters, searchTerm, orderBy, cached.totalPages);
      
      monitor.endTimer('cache-hit');
      console.debug(`⚡ Instant cache hit for page ${page}`);
      
      return {
        data: cached.data,
        totalCount: cached.totalCount,
        totalPages: cached.totalPages,
        currentPage: page,
        fromCache: true
      };
    }
    
    // Return stale data while revalidating if within stale window
    if (cached && (now - cached.timestamp) < this.staleWhileRevalidate) {
      console.debug(`♻️ Serving stale-while-revalidate for page ${page}`);
      
      // Revalidate in background
      this.revalidateInBackground(page, pageSize, filters, searchTerm, orderBy);
      
      return {
        data: cached.data,
        totalCount: cached.totalCount,
        totalPages: cached.totalPages,
        currentPage: page,
        fromCache: true
      };
    }
    
    // Fetch fresh data
    monitor.startTimer('cache-miss');
    
    const fetchPromise = this.fetchFreshData(page, pageSize, filters, searchTerm, orderBy);
    this.pendingFetches.set(cacheKey, fetchPromise);
    
    try {
      const result = await fetchPromise;
      monitor.endTimer('cache-miss');
      return result;
    } finally {
      this.pendingFetches.delete(cacheKey);
    }
  }
  
  private async fetchFreshData(
    page: number,
    pageSize: number,
    filters: Record<string, string>,
    searchTerm: string,
    orderBy: Record<string, string>
  ): Promise<{ data: Memory[], totalCount: number, totalPages: number, currentPage: number, fromCache: boolean }> {
    try {
      const result = await fetchMemoriesPaginated(page, pageSize, filters, searchTerm, orderBy);
      
      if (!result.error) {
        const cacheKey = this.getCacheKey(page, pageSize, filters, searchTerm, orderBy);
        
        // Cache the result
        this.cache.set(cacheKey, {
          data: result.data,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          timestamp: Date.now(),
          etag: `${result.totalCount}-${Date.now()}`,
          isStale: false
        });
        
        this.enforceMaxSize();
        
        // Aggressively prefetch adjacent pages
        this.prefetchAdjacentPages(page, pageSize, filters, searchTerm, orderBy, result.totalPages);
        
        // Persist to localStorage
        if (this.cache.size % 10 === 0) {
          this.persistToLocalStorage();
        }
        
        return {
          ...result,
          fromCache: false
        };
      }
      
      throw new Error('Failed to fetch data');
    } catch (error) {
      console.error('Fetch error:', error);
      
      // Return cached data if available, even if stale
      const cacheKey = this.getCacheKey(page, pageSize, filters, searchTerm, orderBy);
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        console.warn('⚠️ Returning stale cache due to fetch error');
        return {
          data: cached.data,
          totalCount: cached.totalCount,
          totalPages: cached.totalPages,
          currentPage: page,
          fromCache: true
        };
      }
      
      // Return empty data as fallback
      return {
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
        fromCache: false
      };
    }
  }
  
  private async revalidateInBackground(
    page: number,
    pageSize: number,
    filters: Record<string, string>,
    searchTerm: string,
    orderBy: Record<string, string>
  ): Promise<void> {
    // Fire and forget
    fetchMemoriesPaginated(page, pageSize, filters, searchTerm, orderBy)
      .then(result => {
        if (!result.error) {
          const cacheKey = this.getCacheKey(page, pageSize, filters, searchTerm, orderBy);
          this.cache.set(cacheKey, {
            data: result.data,
            totalCount: result.totalCount,
            totalPages: result.totalPages,
            timestamp: Date.now(),
            etag: `${result.totalCount}-${Date.now()}`,
            isStale: false
          });
          console.debug(`🔄 Background revalidation complete for page ${page}`);
        }
      })
      .catch(() => {
        // Ignore background errors
      });
  }
  
  private prefetchAdjacentPages(
    currentPage: number,
    pageSize: number,
    filters: Record<string, string>,
    searchTerm: string,
    orderBy: Record<string, string>,
    totalPages: number
  ): void {
    // Queue pages for prefetching
    for (let i = 1; i <= this.prefetchDepth; i++) {
      // Prefetch next pages
      if (currentPage + i < totalPages) {
        const key = this.getCacheKey(currentPage + i, pageSize, filters, searchTerm, orderBy);
        this.prefetchQueue.add(JSON.stringify({ page: currentPage + i, pageSize, filters, searchTerm, orderBy }));
      }
      
      // Prefetch previous pages
      if (currentPage - i >= 0) {
        const key = this.getCacheKey(currentPage - i, pageSize, filters, searchTerm, orderBy);
        this.prefetchQueue.add(JSON.stringify({ page: currentPage - i, pageSize, filters, searchTerm, orderBy }));
      }
    }
  }
  
  private async processPrefetchQueue(): Promise<void> {
    if (this.prefetchQueue.size === 0) return;
    
    // Process one item at a time to avoid overwhelming
    const item = this.prefetchQueue.values().next().value;
    if (!item) return;
    
    this.prefetchQueue.delete(item);
    
    try {
      const params = JSON.parse(item);
      const cacheKey = this.getCacheKey(params.page, params.pageSize, params.filters, params.searchTerm, params.orderBy);
      
      // Skip if already cached and fresh
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < this.maxAge) {
        return;
      }
      
      // Skip if already fetching
      if (this.pendingFetches.has(cacheKey)) {
        return;
      }
      
      // Fetch in background
      const fetchPromise = fetchMemoriesPaginated(
        params.page,
        params.pageSize,
        params.filters,
        params.searchTerm,
        params.orderBy
      );
      
      this.pendingFetches.set(cacheKey, fetchPromise);
      
      const result = await fetchPromise;
      
      if (!result.error) {
        this.cache.set(cacheKey, {
          data: result.data,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          timestamp: Date.now(),
          etag: `${result.totalCount}-${Date.now()}`,
          isStale: false
        });
        
        this.enforceMaxSize();
        console.debug(`📥 Prefetched page ${params.page}`);
      }
    } catch (err) {
      // Ignore prefetch errors
    } finally {
      const params = JSON.parse(item);
      const cacheKey = this.getCacheKey(params.page, params.pageSize, params.filters, params.searchTerm, params.orderBy);
      this.pendingFetches.delete(cacheKey);
    }
  }
  
  // Invalidate specific entries
  invalidate(searchTerm?: string): void {
    if (searchTerm !== undefined) {
      // Invalidate entries with specific search term
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.includes(searchTerm)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.cache.delete(key));
      console.debug(`🗑️ Invalidated ${keysToDelete.length} entries for search: ${searchTerm}`);
    } else {
      // Clear all cache
      this.cache.clear();
      this.prefetchQueue.clear();
      console.debug('🗑️ Cleared all cache');
    }
    
    // Clear localStorage cache too
    try {
      if (searchTerm === undefined) {
        localStorage.removeItem('ultraCache');
      }
    } catch {}
  }
  
  // Warm up cache with specific pages
  async warmUp(pages: { page: number, pageSize: number }[]): Promise<void> {
    console.debug(`🔥 Warming up cache with ${pages.length} pages`);
    
    const promises = pages.map(({ page, pageSize }) => 
      this.get(page, pageSize, { status: 'approved' }, '', { created_at: 'desc' })
    );
    
    await Promise.allSettled(promises);
  }
  
  // Get cache statistics
  getStats(): { size: number, prefetchQueueSize: number, pendingFetches: number } {
    return {
      size: this.cache.size,
      prefetchQueueSize: this.prefetchQueue.size,
      pendingFetches: this.pendingFetches.size
    };
  }
}

// Singleton instance
let cacheInstance: UltraCache | null = null;

export function getUltraCache(): UltraCache {
  if (!cacheInstance) {
    cacheInstance = new UltraCache();
  }
  return cacheInstance;
}

// Export convenience functions
export async function fetchWithUltraCache(
  page: number = 0,
  pageSize: number = 10,
  filters: Record<string, string> = {},
  searchTerm: string = '',
  orderBy: Record<string, string> = {},
  options: CacheOptions = {}
) {
  const cache = getUltraCache();
  return cache.get(page, pageSize, filters, searchTerm, orderBy, options);
}

export function invalidateCache(searchTerm?: string) {
  const cache = getUltraCache();
  cache.invalidate(searchTerm);
}

export async function warmUpCache(pages: { page: number, pageSize: number }[]) {
  const cache = getUltraCache();
  return cache.warmUp(pages);
}

export function getCacheStats() {
  const cache = getUltraCache();
  return cache.getStats();
}
