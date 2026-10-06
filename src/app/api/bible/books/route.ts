import { NextResponse } from 'next/server';
import { getBibleBooks, getBibleBook } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const testament = searchParams.get('testament');

    if (id) {
      const book = getBibleBook(Number(id));
      if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      return NextResponse.json(book);
    }

    let books = getBibleBooks();
    if (testament) {
      books = books.filter(b => b.testament.toUpperCase() === testament.toUpperCase());
    }

    return NextResponse.json(books);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
