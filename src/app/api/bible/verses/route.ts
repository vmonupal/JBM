import { NextResponse } from 'next/server';
import { getVerses, getVerse, addVerse, updateVerse, deleteVerse, getBibleBooks, loadFallbackVerses } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawBook = searchParams.get('bookId') || searchParams.get('book') || searchParams.get('book_id');
    const chapter = searchParams.get('chapter');
    const verse = searchParams.get('verse');

    if (!rawBook || !chapter) {
      return NextResponse.json({ error: 'bookId (or book) and chapter are required' }, { status: 400 });
    }

    let resolvedBookId = Number(rawBook);
    if (isNaN(resolvedBookId) || resolvedBookId <= 0) {
      const allBooks = getBibleBooks();
      const norm = rawBook.trim().toLowerCase();
      const found = allBooks.find(b =>
        b.name_english.toLowerCase() === norm ||
        b.name_telugu.toLowerCase() === norm ||
        b.name_english.toLowerCase().startsWith(norm)
      );
      if (found) {
        resolvedBookId = found.id;
      } else {
        return NextResponse.json({ error: `Book '${rawBook}' not found` }, { status: 404 });
      }
    }

    if (verse) {
      let v = getVerse(resolvedBookId, Number(chapter), Number(verse));
      if (!v) {
        const fb = loadFallbackVerses(resolvedBookId, Number(chapter));
        v = fb.find(item => item.verse_number === Number(verse));
      }
      if (!v) return NextResponse.json({ error: 'Verse not found' }, { status: 404 });
      return NextResponse.json(v, {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
        }
      });
    }

    let verses = getVerses(resolvedBookId, Number(chapter));
    if (!verses || verses.length === 0) {
      verses = loadFallbackVerses(resolvedBookId, Number(chapter));
    }

    return NextResponse.json(verses, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
      }
    });
  } catch (error: any) {
    try {
      const { searchParams } = new URL(request.url);
      const rawBook = searchParams.get('bookId') || searchParams.get('book') || searchParams.get('book_id');
      const chapter = searchParams.get('chapter');
      if (rawBook && chapter) {
        const bId = Number(rawBook);
        if (!isNaN(bId) && bId > 0) {
          const fb = loadFallbackVerses(bId, Number(chapter));
          if (fb.length > 0) {
            return NextResponse.json(fb);
          }
        }
      }
    } catch (e) {}
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
