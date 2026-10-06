import { NextResponse } from 'next/server';
import { getReadingHistory, saveReadingHistory } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const userId = 1;
    const history = getReadingHistory(userId);
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = 1;

    const body = await request.json();
    const { book_id, chapter_number } = body;

    if (!book_id || !chapter_number) {
      return NextResponse.json({ error: 'book_id and chapter_number required' }, { status: 400 });
    }

    const success = saveReadingHistory(userId, Number(book_id), Number(chapter_number));
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
