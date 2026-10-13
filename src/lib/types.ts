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
  book_name_english?: string;
  book_name_telugu?: string;
  testament?: 'OT' | 'NT';
  translation_english?: string;
  translation_telugu?: string;
  translation_source?: string;
  license_information?: string;
}

export interface BibleChapter {
  id: number;
  book_id: number;
  chapter_number: number;
  verse_count: number;
  name_english: string;
  name_telugu: string;
  testament: 'OT' | 'NT';
}

export interface BibleTranslation {
  id: number;
  code: string;
  name_english: string;
  name_telugu: string;
  language: string;
  source: string;
  license: string;
  description: string;
  is_default: number;
}

export interface BibleIntegrityReport {
  is_complete: boolean;
  books_count: number;
  expected_books: number;
  chapters_count: number;
  expected_chapters: number;
  english_verses_count: number;
  telugu_verses_count: number;
  expected_verses: number;
  missing_english: number;
  missing_telugu: number;
  duplicate_records: number;
  invalid_references: number;
  broken_relationships: number;
  book_ordering_valid: boolean;
  translations: {
    code: string;
    name_english: string;
    name_telugu: string;
    source: string;
    license: string;
  }[];
  missing_details: string[];
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
  composer?: string | null;
  source_origin?: string | null;
  language?: string | null;
  lyrics_other?: string | null;
  other_language_name?: string | null;
  image_url?: string | null;
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
  composer?: string | null;
  source_origin?: string | null;
  language?: string | null;
  lyrics_other?: string | null;
  other_language_name?: string | null;
  image_url?: string | null;
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

export interface SiteSettings {
  website_name: string;
  church_display_name: string;
  website_title: string;
  website_description: string;
  tagline?: string;
  logo_url: string;
  use_text_logo?: boolean;
  show_logo_header?: boolean;
  show_logo_projector_bible?: boolean;
  show_logo_projector_song?: boolean;
  show_logo_footer?: boolean;
  custom_domain: string;
}

export type PosterFitMode = 'contain' | 'cover' | 'original' | 'fit-width' | 'fit-height';
export type PosterBackground = 'black' | 'dark' | 'light' | 'custom';

export interface PosterDisplaySettings {
  fit_mode: PosterFitMode;
  background: PosterBackground;
  custom_background_color?: string;
  custom_bg_color?: string;
  default_zoom: 'auto' | '50' | '75' | '100' | '125' | '150' | '200' | string;
  show_poster_info: boolean;
  show_jbm_logo: boolean;
  auto_fullscreen?: boolean;
  fullscreen_default?: boolean;
  remember_settings: boolean;
}

export interface Poster {
  id: number;
  image_url: string;           // Original high-res uploaded image (100% full quality)
  large_url?: string;          // Optimized large display version for projector / lightbox
  thumbnail_url?: string;      // Gallery grid thumbnail
  image_data?: string;         // Base64 durability backup
  title?: string;
  event_name?: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  category: string;
  language: string;
  bible_reference?: string;
  speaker?: string;            // Speaker / Pastor name
  contact_info?: string;       // Contact / Social info
  width?: number;              // Image pixel width (e.g. 1920)
  height?: number;             // Image pixel height (e.g. 1080)
  aspect_ratio?: string;       // "16:9", "16:10", "4:5", "9:16", etc.
  file_type?: string;          // "PNG", "JPEG", "WebP"
  file_size?: string;          // Formatted size e.g. "2.4 MB"
  file_size_bytes?: number;    // Raw byte size
  created_at?: string;
  updated_at?: string;
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
