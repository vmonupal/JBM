import { NextResponse } from 'next/server';
import { getSongs, addSong } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
    const query = searchParams.get('q') || undefined;

    const songs = getSongs(categoryId, query);
    return NextResponse.json(songs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { song_number, title_english, title_telugu, lyrics_english, lyrics_telugu, category_id, author, audio_url, video_url, bible_reference } = body;

    if (!title_english || !title_telugu || !lyrics_telugu) {
      return NextResponse.json({ error: 'Title and Telugu lyrics are required' }, { status: 400 });
    }

    const id = addSong({
      song_number: Number(song_number) || 999,
      title_english,
      title_telugu,
      lyrics_english: lyrics_english || '',
      lyrics_telugu,
      category_id: Number(category_id) || 1,
      author,
      audio_url,
      video_url,
      bible_reference
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
