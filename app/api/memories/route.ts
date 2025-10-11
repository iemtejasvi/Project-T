import { NextRequest, NextResponse } from 'next/server';
import { fetchMemoriesPaginated } from '@/lib/dualMemoryDB';

export const runtime = 'edge'; // Use edge runtime for better performance

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '0', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const searchTerm = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'approved';
    
    // Validate parameters
    if (page < 0 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }
    
    // Build filters
    const filters: Record<string, string> = {};
    if (status) filters.status = status;
    
    // Fetch memories
    const result = await fetchMemoriesPaginated(
      page,
      pageSize,
      filters,
      searchTerm,
      { created_at: 'desc' }
    );
    
    if (result.error) {
      return NextResponse.json(
        { error: 'Failed to fetch memories' },
        { status: 500 }
      );
    }
    
    // Return with cache headers for CDN caching
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'CDN-Cache-Control': 'public, s-maxage=60',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=60',
      },
    });
  } catch (error) {
    console.error('Error in memories API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
