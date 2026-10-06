import { NextResponse } from 'next/server';
import { searchBible } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;

    if (!query || !query.trim()) {
      return NextResponse.json([]);
    }

    const results = searchBible(query, limit);
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
