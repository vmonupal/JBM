import { NextResponse } from 'next/server';
import { searchBibleUniversal, parseBibleReference } from '@/lib/bible-search';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;

    if (!query || !query.trim()) {
      return NextResponse.json({ reference: null, verses: [] });
    }

    const data = searchBibleUniversal(query, limit);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
