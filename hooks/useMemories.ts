import { useState, useEffect, useCallback } from 'react';
import { getMemoryCache } from '@/lib/memoryCache';
import { getPerformanceMonitor } from '@/lib/performanceMonitor';

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
  [key: string]: any;
}

interface UseMemoriesOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  enableCache?: boolean;
}

interface UseMemoriesResult {
  memories: Memory[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  fromCache: boolean;
  refetch: () => Promise<void>;
}

// Request deduplication
const activeRequests = new Map<string, Promise<any>>();

async function fetchFromAPI(
  page: number,
  pageSize: number,
  searchTerm: string,
  status: string
): Promise<any> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search: searchTerm,
    status: status,
  });
  
  const url = `/api/memories?${params}`;
  const requestKey = url;
  
  // Check if request is already in flight
  if (activeRequests.has(requestKey)) {
    return activeRequests.get(requestKey);
  }
  
  // Create new request
  const requestPromise = fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .finally(() => {
      activeRequests.delete(requestKey);
    });
  
  activeRequests.set(requestKey, requestPromise);
  return requestPromise;
}

export function useMemories({
  page = 0,
  pageSize = 10,
  searchTerm = '',
  status = 'approved',
  enableCache = true,
}: UseMemoriesOptions = {}): UseMemoriesResult {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  
  const fetchMemories = useCallback(async () => {
    const monitor = getPerformanceMonitor();
    monitor.startTimer('total-memory-fetch');
    
    try {
      setIsLoading(true);
      setError(null);
      
      let result;
      
      if (enableCache) {
        // Try cache first
        const cache = getMemoryCache();
        result = await cache.get(
          page,
          pageSize,
          { status },
          searchTerm,
          { created_at: 'desc' }
        );
        setFromCache(result.fromCache);
      } else {
        // Direct API call
        result = await fetchFromAPI(page, pageSize, searchTerm, status);
        setFromCache(false);
      }
      
      setMemories(result.data || []);
      setTotalCount(result.totalCount || 0);
      setTotalPages(result.totalPages || 0);
      setCurrentPage(result.currentPage || page);
      
      const fetchTime = monitor.endTimer('total-memory-fetch');
      
      // Log performance
      if (fetchTime < 50) {
        console.debug(`⚡ Ultra-fast load: ${fetchTime.toFixed(2)}ms${result.fromCache ? ' (cached)' : ''}`);
      } else if (fetchTime < 100) {
        console.debug(`✅ Fast load: ${fetchTime.toFixed(2)}ms${result.fromCache ? ' (cached)' : ''}`);
      } else {
        console.warn(`⚠️ Slow load: ${fetchTime.toFixed(2)}ms - optimization needed`);
      }
    } catch (err) {
      console.error('Failed to fetch memories:', err);
      setError('Failed to load memories');
      setMemories([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchTerm, status, enableCache]);
  
  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);
  
  return {
    memories,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    fromCache,
    refetch: fetchMemories,
  };
}
