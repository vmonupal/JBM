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
    const { 
      song_number, 
      title_english, 
      title_telugu, 
      lyrics_english, 
      lyrics_telugu, 
      lyrics_other,
      language,
      other_language_name,
      category_id, 
      author, 
      composer,
      source_origin,
      image_url,
      audio_url, 
      video_url, 
      bible_reference 
    } = body;

    const finalTitleEn = (title_english || title_telugu || 'Untitled Song').trim();
    const finalTitleTe = (title_telugu || title_english || 'శీర్షిక లేదు').trim();

    const hasLyrics = (lyrics_telugu && lyrics_telugu.trim()) || 
                      (lyrics_english && lyrics_english.trim()) || 
                      (lyrics_other && lyrics_other.trim());

    if (!hasLyrics) {
      return NextResponse.json({ error: 'Please provide lyrics for the song.' }, { status: 400 });
    }

    const id = addSong({
      song_number: Number(song_number) || 101,
      title_english: finalTitleEn,
      title_telugu: finalTitleTe,
      lyrics_english: lyrics_english || '',
      lyrics_telugu: lyrics_telugu || '',
      lyrics_other: lyrics_other || '',
      language: language || 'Telugu + English',
      other_language_name: other_language_name || '',
      category_id: Number(category_id) || 1,
      author: author || undefined,
      composer: composer || undefined,
      source_origin: source_origin || undefined,
      image_url: image_url || undefined,
      audio_url: audio_url || undefined,
      video_url: video_url || undefined,
      bible_reference: bible_reference || undefined
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
