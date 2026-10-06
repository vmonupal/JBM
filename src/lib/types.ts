export interface BibleBook {
  id: number;
  testament: 'OT' | 'NT';
  name_english: string;
  name_telugu: string;
  book_order: number;
  total_chapters: number;
}

export interface BibleVerse {
  id: number;
  book_id: number;
  chapter_number: number;
  verse_number: number;
  telugu_text: string;
  english_text: string;
  book_english?: string;
  book_telugu?: string;
}

export interface Song {
  id: number;
  song_number: number;
  title_english: string;
  title_telugu: string;
  lyrics_english: string;
  lyrics_telugu: string;
  category_id: number;
  category_name?: string;
  author: string | null;
  audio_url: string | null;
  video_url: string | null;
  bible_reference?: string | null;
  views: number;
  created_at?: string;
  updated_at?: string;
}

export interface SongVersion {
  id: number;
  song_id: number;
  version_number: number;
  song_number: number;
  title_english: string;
  title_telugu: string;
  lyrics_english: string;
  lyrics_telugu: string;
  category_id: number;
  category_name?: string;
  author: string | null;
  audio_url: string | null;
  video_url: string | null;
  bible_reference: string | null;
  change_summary: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  song_count?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
}

export interface FavoriteItem {
  id: number;
  user_id: number;
  item_type: 'verse' | 'chapter' | 'song';
  item_id: string;
  details_json: string;
  created_at: string;
}

export interface ReadingHistoryItem {
  id: number;
  user_id: number;
  book_id: number;
  chapter_number: number;
  last_read_at: string;
  book_english?: string;
  book_telugu?: string;
}

export interface AdminStats {
  totalBooks: number;
  totalVerses: number;
  totalSongs: number;
  totalUsers: number;
  totalCategories: number;
}
