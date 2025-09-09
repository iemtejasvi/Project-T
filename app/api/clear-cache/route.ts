import { NextResponse } from 'next/server';

export async function GET() {
  // Return an empty response with Clear-Site-Data for cache and storage only
  // Do NOT clear cookies to avoid auth/session disruption
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('Clear-Site-Data', '"cache", "storage"');
  return res;
}


