import { NextResponse } from 'next/server';
import { getBibleBooks, getBibleBook, loadFallbackBooks } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const testament = searchParams.get('testament');

    if (id) {
      let book = getBibleBook(Number(id));
      if (!book) {
        const fallback = loadFallbackBooks();
        book = fallback.find(b => b.id === Number(id));
      }
      if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      return NextResponse.json(book, {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
        }
      });
    }

    let books = getBibleBooks();
    if (!books || books.length === 0) {
      books = loadFallbackBooks();
    }

    if (testament) {
      books = books.filter(b => b.testament.toUpperCase() === testament.toUpperCase());
    }

    return NextResponse.json(books, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
      }
    });
  } catch (error: any) {
    // If any error occurs, return fallback books directly rather than 500
    try {
      const fb = loadFallbackBooks();
      if (fb.length > 0) {
        return NextResponse.json(fb);
      }
    } catch (e) {}
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
