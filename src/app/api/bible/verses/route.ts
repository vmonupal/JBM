import { NextResponse } from 'next/server';
import { getVerses, getVerse, addVerse, updateVerse, deleteVerse } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const chapter = searchParams.get('chapter');
    const verse = searchParams.get('verse');

    if (!bookId || !chapter) {
      return NextResponse.json({ error: 'bookId and chapter are required' }, { status: 400 });
    }

    if (verse) {
      const v = getVerse(Number(bookId), Number(chapter), Number(verse));
      if (!v) return NextResponse.json({ error: 'Verse not found' }, { status: 404 });
      return NextResponse.json(v);
    }

    const verses = getVerses(Number(bookId), Number(chapter));
    return NextResponse.json(verses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { book_id, chapter_number, verse_number, telugu_text, english_text } = body;

    if (!book_id || !chapter_number || !verse_number || !telugu_text || !english_text) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const id = addVerse(Number(book_id), Number(chapter_number), Number(verse_number), telugu_text, english_text);
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, telugu_text, english_text } = body;

    if (!id || !telugu_text || !english_text) {
      return NextResponse.json({ error: 'ID and texts are required' }, { status: 400 });
    }

    const updated = updateVerse(Number(id), telugu_text, english_text);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const deleted = deleteVerse(Number(id));
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
