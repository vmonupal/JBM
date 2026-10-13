'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BibleBook, BibleVerse } from '@/lib/types';

export type ReadingLanguageMode = 'telugu_only' | 'english_only' | 'telugu_english';

export interface TTSSpeechSegment {
  id: string;
  type: 'intro' | 'verse';
  verseNumber?: number;
  text: string;
  lang: 'te' | 'en';
  referenceLabel: string;
}

export interface VoiceRankingInfo {
  voiceURI: string;
  name: string;
  lang: string;
  isRecommended: boolean;
  isLocal: boolean;
  isHDStudio: boolean;
  nativeVoice?: SpeechSynthesisVoice;
}

export interface UseBibleTTSProps {
  selectedBook: BibleBook;
  selectedChapter: number;
  displayVerses: BibleVerse[];
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  onNextVerse?: () => void;
  onPrevVerse?: () => void;
}

declare global {
  interface Window {
    __bibleTTSActiveUtterance?: SpeechSynthesisUtterance | null;
  }
}

export function useBibleTTS({
  selectedBook,
  selectedChapter,
  displayVerses,
  onNextChapter,
  onPrevChapter,
  onNextVerse,
  onPrevVerse,
}: UseBibleTTSProps) {
  // TTS Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(-1);
  const [currentSpeakingVerseNumber, setCurrentSpeakingVerseNumber] = useState<number | null>(null);
  const [ttsStatusText, setTtsStatusText] = useState<string>('Stopped');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [testingVoiceURI, setTestingVoiceURI] = useState<string | null>(null);

  // 1. Reading Language Mode: Default is 'telugu_only'
  const [readingLanguageMode, setReadingLanguageMode] = useState<ReadingLanguageMode>('telugu_only');

  // 2. Separate Telugu Settings (Speed calibrated to 0.90x for clear natural pace without dragging)
  const [selectedTeluguVoiceURI, setSelectedTeluguVoiceURI] = useState<string>('natural_hd_te');
  const [teluguSpeed, setTeluguSpeed] = useState<number>(0.90);
  const [teluguVolume, setTeluguVolume] = useState<number>(1.0);
  const [teluguPitch, setTeluguPitch] = useState<number>(1.0);

  // 3. Separate English Settings
  const [selectedEnglishVoiceURI, setSelectedEnglishVoiceURI] = useState<string>('natural_hd_en');
  const [englishSpeed, setEnglishSpeed] = useState<number>(0.90);
  const [englishVolume, setEnglishVolume] = useState<number>(1.0);
  const [englishPitch, setEnglishPitch] = useState<number>(1.0);

  // Reading Options
  const [autoRead, setAutoRead] = useState<boolean>(false);
  const [verseHighlight, setVerseHighlight] = useState<boolean>(true);
  const [showStatusIndicator, setShowStatusIndicator] = useState<boolean>(true);

  // Real device voices
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [deviceTeluguVoices, setDeviceTeluguVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [deviceEnglishVoices, setDeviceEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  // Playback execution refs
  const queueRef = useRef<TTSSpeechSegment[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isPlayingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const isTestingRef = useRef<boolean>(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedAudioRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Telugu voice list: HD Studio Voice (Always Available, Never Breaks) + Real Device Voices
  const rankedTeluguVoices = useMemo<VoiceRankingInfo[]>(() => {
    const list: VoiceRankingInfo[] = [
      {
        voiceURI: 'natural_hd_te',
        name: 'స్వచ్ఛమైన తెలుగు HD స్వరం (Crystal Clear Studio Voice — Recommended)',
        lang: 'te-IN',
        isRecommended: true,
        isLocal: false,
        isHDStudio: true,
      },
    ];

    deviceTeluguVoices.forEach((v) => {
      list.push({
        voiceURI: v.voiceURI,
        name: v.name,
        lang: v.lang,
        isRecommended: false,
        isLocal: v.localService === true,
        isHDStudio: false,
        nativeVoice: v,
      });
    });

    return list;
  }, [deviceTeluguVoices]);

  // English voice list: HD Studio Voice + Real Device Voices
  const rankedEnglishVoices = useMemo<VoiceRankingInfo[]>(() => {
    const list: VoiceRankingInfo[] = [
      {
        voiceURI: 'natural_hd_en',
        name: 'Natural English HD Voice (Reverent Sanctuary Voice — Recommended)',
        lang: 'en-IN',
        isRecommended: true,
        isLocal: false,
        isHDStudio: true,
      },
    ];

    deviceEnglishVoices.forEach((v) => {
      list.push({
        voiceURI: v.voiceURI,
        name: v.name,
        lang: v.lang,
        isRecommended: false,
        isLocal: v.localService === true,
        isHDStudio: false,
        nativeVoice: v,
      });
    });

    return list;
  }, [deviceEnglishVoices]);

  // Load real device voices dynamically
  const refreshVoices = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const all = window.speechSynthesis.getVoices();
    if (!all || all.length === 0) return;

    setAvailableVoices(all);

    const te = all.filter((v) => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      const uri = (v.voiceURI || '').toLowerCase();
      return (
        lang === 'te-in' ||
        lang === 'te' ||
        lang.startsWith('te-') ||
        lang.startsWith('te_') ||
        name.includes('telugu') ||
        name.includes('తెలుగు') ||
        uri.includes('telugu') ||
        uri.includes('te-in')
      );
    });

    const en = all.filter((v) => (v.lang || '').toLowerCase().startsWith('en'));

    setDeviceTeluguVoices(te);
    setDeviceEnglishVoices(en);
  }, []);

  // Sync voices on mount and listen to changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    refreshVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }

    const t1 = setTimeout(refreshVoices, 300);
    const t2 = setTimeout(refreshVoices, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [refreshVoices]);

  // Load stored preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedMode = localStorage.getItem('rci_bible_tts_v3_mode') as ReadingLanguageMode;
      if (storedMode === 'telugu_only' || storedMode === 'english_only' || storedMode === 'telugu_english') {
        setReadingLanguageMode(storedMode);
      } else {
        setReadingLanguageMode('telugu_only');
      }

      const storedTeVoice = localStorage.getItem('rci_bible_tts_v3_voice_te');
      if (storedTeVoice) setSelectedTeluguVoiceURI(storedTeVoice);

      const storedEnVoice = localStorage.getItem('rci_bible_tts_v3_voice_en');
      if (storedEnVoice) setSelectedEnglishVoiceURI(storedEnVoice);

      const storedTeSpeed = localStorage.getItem('rci_bible_tts_v3_speed_te');
      if (storedTeSpeed) setTeluguSpeed(Number(storedTeSpeed));

      const storedEnSpeed = localStorage.getItem('rci_bible_tts_v3_speed_en');
      if (storedEnSpeed) setEnglishSpeed(Number(storedEnSpeed));

      const storedTeVol = localStorage.getItem('rci_bible_tts_v3_vol_te');
      if (storedTeVol) setTeluguVolume(Number(storedTeVol));

      const storedEnVol = localStorage.getItem('rci_bible_tts_v3_vol_en');
      if (storedEnVol) setEnglishVolume(Number(storedEnVol));

      const storedTePitch = localStorage.getItem('rci_bible_tts_v3_pitch_te');
      if (storedTePitch) setTeluguPitch(Number(storedTePitch));

      const storedEnPitch = localStorage.getItem('rci_bible_tts_v3_pitch_en');
      if (storedEnPitch) setEnglishPitch(Number(storedEnPitch));

      const storedAuto = localStorage.getItem('rci_bible_tts_v3_auto_read');
      if (storedAuto !== null) setAutoRead(storedAuto === 'true');

      const storedHighlight = localStorage.getItem('rci_bible_tts_v3_highlight');
      if (storedHighlight !== null) setVerseHighlight(storedHighlight === 'true');

      const storedStatus = localStorage.getItem('rci_bible_tts_v3_status_vis');
      if (storedStatus !== null) setShowStatusIndicator(storedStatus === 'true');
    } catch {}
  }, []);

  // Stop all audio & speech engines cleanly
  const stopAudioEngines = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.src = '';
      activeAudioRef.current = null;
    }
    if (preloadedAudioRef.current) {
      preloadedAudioRef.current.src = '';
      preloadedAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    window.__bibleTTSActiveUtterance = null;
  }, []);

  // Complete stop
  const stopTTS = useCallback(() => {
    stopAudioEngines();
    isPlayingRef.current = false;
    isPausedRef.current = false;
    isTestingRef.current = false;
    currentIndexRef.current = -1;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSegmentIndex(-1);
    setCurrentSpeakingVerseNumber(null);
    setTtsStatusText('Stopped');
    setTestingVoiceURI(null);
  }, [stopAudioEngines]);

  // Setting update helpers with persistence
  const updateReadingLanguageMode = (mode: ReadingLanguageMode) => {
    setReadingLanguageMode(mode);
    setVoiceNotice(null);
    try { localStorage.setItem('rci_bible_tts_v3_mode', mode); } catch {}
    if (isPlayingRef.current) stopTTS();
  };

  const updateSelectedTeluguVoice = (uri: string) => {
    setSelectedTeluguVoiceURI(uri);
    try { localStorage.setItem('rci_bible_tts_v3_voice_te', uri); } catch {}
  };

  const updateSelectedEnglishVoice = (uri: string) => {
    setSelectedEnglishVoiceURI(uri);
    try { localStorage.setItem('rci_bible_tts_v3_voice_en', uri); } catch {}
  };

  const updateTeluguSpeed = (s: number) => {
    setTeluguSpeed(s);
    if (activeAudioRef.current) activeAudioRef.current.playbackRate = s;
    try { localStorage.setItem('rci_bible_tts_v3_speed_te', String(s)); } catch {}
  };

  const updateEnglishSpeed = (s: number) => {
    setEnglishSpeed(s);
    if (activeAudioRef.current) activeAudioRef.current.playbackRate = s;
    try { localStorage.setItem('rci_bible_tts_v3_speed_en', String(s)); } catch {}
  };

  const updateTeluguVolume = (v: number) => {
    setTeluguVolume(v);
    if (activeAudioRef.current) activeAudioRef.current.volume = v;
    try { localStorage.setItem('rci_bible_tts_v3_vol_te', String(v)); } catch {}
  };

  const updateEnglishVolume = (v: number) => {
    setEnglishVolume(v);
    if (activeAudioRef.current) activeAudioRef.current.volume = v;
    try { localStorage.setItem('rci_bible_tts_v3_vol_en', String(v)); } catch {}
  };

  const updateTeluguPitch = (p: number) => {
    setTeluguPitch(p);
    try { localStorage.setItem('rci_bible_tts_v3_pitch_te', String(p)); } catch {}
  };

  const updateEnglishPitch = (p: number) => {
    setEnglishPitch(p);
    try { localStorage.setItem('rci_bible_tts_v3_pitch_en', String(p)); } catch {}
  };

  const updateAutoRead = (val: boolean) => {
    setAutoRead(val);
    try { localStorage.setItem('rci_bible_tts_v3_auto_read', String(val)); } catch {}
  };

  const updateVerseHighlight = (val: boolean) => {
    setVerseHighlight(val);
    try { localStorage.setItem('rci_bible_tts_v3_highlight', String(val)); } catch {}
  };

  const updateShowStatusIndicator = (val: boolean) => {
    setShowStatusIndicator(val);
    try { localStorage.setItem('rci_bible_tts_v3_status_vis', String(val)); } catch {}
  };

  // Build the ordered speech queue for currently displayed passage
  const buildSpeechQueue = useCallback((): TTSSpeechSegment[] => {
    if (!displayVerses || displayVerses.length === 0) return [];

    const segments: TTSSpeechSegment[] = [];

    // Mode 1: TELUGU ONLY
    if (readingLanguageMode === 'telugu_only') {
      segments.push({
        id: 'intro-te',
        type: 'intro',
        text: `${selectedBook.name_telugu}, అధ్యాయము ${selectedChapter}.`,
        lang: 'te',
        referenceLabel: `${selectedBook.name_telugu} ${selectedChapter}`,
      });

      for (const v of displayVerses) {
        segments.push({
          id: `verse-${v.verse_number}-te`,
          type: 'verse',
          verseNumber: v.verse_number,
          text: `వచనము ${v.verse_number}. ${v.telugu_text}`,
          lang: 'te',
          referenceLabel: `${selectedBook.name_telugu} ${selectedChapter}:${v.verse_number}`,
        });
      }
      return segments;
    }

    // Mode 2: ENGLISH ONLY
    if (readingLanguageMode === 'english_only') {
      segments.push({
        id: 'intro-en',
        type: 'intro',
        text: `${selectedBook.name_english}, chapter ${selectedChapter}.`,
        lang: 'en',
        referenceLabel: `${selectedBook.name_english} ${selectedChapter}`,
      });

      for (const v of displayVerses) {
        segments.push({
          id: `verse-${v.verse_number}-en`,
          type: 'verse',
          verseNumber: v.verse_number,
          text: `Verse ${v.verse_number}. ${v.english_text}`,
          lang: 'en',
          referenceLabel: `${selectedBook.name_english} ${selectedChapter}:${v.verse_number}`,
        });
      }
      return segments;
    }

    // Mode 3: TELUGU + ENGLISH (Telugu First, then English)
    if (readingLanguageMode === 'telugu_english') {
      segments.push({
        id: 'intro-te',
        type: 'intro',
        text: `${selectedBook.name_telugu}, అధ్యాయము ${selectedChapter}.`,
        lang: 'te',
        referenceLabel: `${selectedBook.name_telugu} ${selectedChapter}`,
      });
      segments.push({
        id: 'intro-en',
        type: 'intro',
        text: `${selectedBook.name_english}, chapter ${selectedChapter}.`,
        lang: 'en',
        referenceLabel: `${selectedBook.name_english} ${selectedChapter}`,
      });

      for (const v of displayVerses) {
        segments.push({
          id: `verse-${v.verse_number}-te`,
          type: 'verse',
          verseNumber: v.verse_number,
          text: `${selectedBook.name_telugu} ${selectedChapter}:${v.verse_number}. ${v.telugu_text}`,
          lang: 'te',
          referenceLabel: `${selectedBook.name_telugu} ${selectedChapter}:${v.verse_number}`,
        });
        segments.push({
          id: `verse-${v.verse_number}-en`,
          type: 'verse',
          verseNumber: v.verse_number,
          text: `${selectedBook.name_english} ${selectedChapter}:${v.verse_number}. ${v.english_text}`,
          lang: 'en',
          referenceLabel: `${selectedBook.name_english} ${selectedChapter}:${v.verse_number}`,
        });
      }
      return segments;
    }

    return segments;
  }, [displayVerses, readingLanguageMode, selectedBook, selectedChapter]);

  // Play a specific segment by index
  const playSegmentAtIndex = useCallback((index: number) => {
    const queue = queueRef.current;
    if (index < 0 || index >= queue.length) {
      stopTTS();
      if (autoRead && onNextChapter) {
        onNextChapter();
      }
      return;
    }

    currentIndexRef.current = index;
    setCurrentSegmentIndex(index);
    const segment = queue[index];

    if (segment.verseNumber !== undefined) {
      setCurrentSpeakingVerseNumber(segment.verseNumber);
    }

    setTtsStatusText(`Reading: ${segment.referenceLabel}`);
    setVoiceNotice(null);

    const isTe = segment.lang === 'te';
    const chosenURI = isTe ? selectedTeluguVoiceURI : selectedEnglishVoiceURI;
    const speed = isTe ? teluguSpeed : englishSpeed;
    const vol = isTe ? teluguVolume : englishVolume;
    const pitch = isTe ? teluguPitch : englishPitch;

    // Preload next segment to eliminate gaps and breaking
    if (index + 1 < queue.length) {
      const nextSeg = queue[index + 1];
      const nextUrl = `/api/tts?text=${encodeURIComponent(nextSeg.text)}&lang=${nextSeg.lang}`;
      const pre = new Audio(nextUrl);
      pre.preload = 'auto';
      preloadedAudioRef.current = pre;
    }

    // Check if HD Studio Voice is used (Default & Recommended, crystal clear, never breaks)
    const isHD = chosenURI.startsWith('natural_hd') || !chosenURI;

    if (isHD) {
      stopAudioEngines();

      const audioUrl = `/api/tts?text=${encodeURIComponent(segment.text)}&lang=${segment.lang}`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = speed;
      audio.volume = vol;
      activeAudioRef.current = audio;

      audio.onended = () => {
        if (isPlayingRef.current && !isPausedRef.current) {
          const pauseDelay = segment.type === 'intro' ? 400 : 300;
          setTimeout(() => {
            if (isPlayingRef.current && !isPausedRef.current) {
              playSegmentAtIndex(index + 1);
            }
          }, pauseDelay);
        }
      };

      audio.onerror = (e) => {
        console.warn('Audio streaming playback notice:', e);
        if (isPlayingRef.current && !isPausedRef.current) {
          setTimeout(() => playSegmentAtIndex(index + 1), 300);
        }
      };

      audio.play().catch((err) => {
        console.warn('Playback play call interrupted:', err);
        if (isPlayingRef.current && !isPausedRef.current) {
          setTimeout(() => playSegmentAtIndex(index + 1), 350);
        }
      });
    } else {
      // Real device voice via Web Speech API
      stopAudioEngines();

      const nativeVoice = isTe 
        ? deviceTeluguVoices.find((v) => v.voiceURI === chosenURI)
        : deviceEnglishVoices.find((v) => v.voiceURI === chosenURI);

      if (!nativeVoice) {
        // Fallback to HD Studio Voice so voice NEVER fails
        const audioUrl = `/api/tts?text=${encodeURIComponent(segment.text)}&lang=${segment.lang}`;
        const audio = new Audio(audioUrl);
        audio.playbackRate = speed;
        audio.volume = vol;
        activeAudioRef.current = audio;
        audio.onended = () => {
          if (isPlayingRef.current && !isPausedRef.current) {
            setTimeout(() => playSegmentAtIndex(index + 1), 300);
          }
        };
        audio.play().catch(() => {});
        return;
      }

      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.voice = nativeVoice;
      utterance.lang = nativeVoice.lang;
      utterance.rate = speed;
      utterance.volume = vol;
      utterance.pitch = pitch;

      window.__bibleTTSActiveUtterance = utterance;

      utterance.onend = () => {
        window.__bibleTTSActiveUtterance = null;
        if (isPlayingRef.current && !isPausedRef.current) {
          const pauseDelay = segment.type === 'intro' ? 400 : 300;
          setTimeout(() => {
            if (isPlayingRef.current && !isPausedRef.current) {
              playSegmentAtIndex(index + 1);
            }
          }, pauseDelay);
        }
      };

      utterance.onerror = () => {
        window.__bibleTTSActiveUtterance = null;
        if (isPlayingRef.current && !isPausedRef.current) {
          setTimeout(() => playSegmentAtIndex(index + 1), 300);
        }
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [autoRead, deviceEnglishVoices, deviceTeluguVoices, englishPitch, englishSpeed, englishVolume, onNextChapter, selectedEnglishVoiceURI, selectedTeluguVoiceURI, stopAudioEngines, stopTTS, teluguPitch, teluguSpeed, teluguVolume]);

  // Start reading
  const startReading = useCallback(() => {
    stopAudioEngines();

    const queue = buildSpeechQueue();
    if (queue.length === 0) return;

    queueRef.current = queue;
    isPlayingRef.current = true;
    isPausedRef.current = false;
    isTestingRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);

    setTimeout(() => {
      playSegmentAtIndex(0);
    }, 60);
  }, [buildSpeechQueue, playSegmentAtIndex, stopAudioEngines]);

  // Pause
  const pauseTTS = useCallback(() => {
    if (activeAudioRef.current && !activeAudioRef.current.paused) {
      activeAudioRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
    isPausedRef.current = true;
    setIsPaused(true);
    setTtsStatusText('Paused');
  }, []);

  // Resume
  const resumeTTS = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
    setIsPlaying(true);
    isPlayingRef.current = true;

    if (activeAudioRef.current && activeAudioRef.current.paused && activeAudioRef.current.src) {
      activeAudioRef.current.play().catch(() => {
        const curIdx = currentIndexRef.current >= 0 ? currentIndexRef.current : 0;
        playSegmentAtIndex(curIdx);
      });
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else {
      const curIdx = currentIndexRef.current >= 0 ? currentIndexRef.current : 0;
      playSegmentAtIndex(curIdx);
    }
  }, [playSegmentAtIndex]);

  // Restart
  const restartTTS = useCallback(() => {
    startReading();
  }, [startReading]);

  // Previous verse
  const prevVerseAction = useCallback(() => {
    if (isPlayingRef.current) {
      const cur = currentIndexRef.current;
      if (cur > 0) {
        stopAudioEngines();
        playSegmentAtIndex(cur - 1);
        return;
      }
    }
    if (onPrevVerse) onPrevVerse();
  }, [onPrevVerse, playSegmentAtIndex, stopAudioEngines]);

  // Next verse
  const nextVerseAction = useCallback(() => {
    if (isPlayingRef.current) {
      const cur = currentIndexRef.current;
      if (cur < queueRef.current.length - 1) {
        stopAudioEngines();
        playSegmentAtIndex(cur + 1);
        return;
      }
    }
    if (onNextVerse) onNextVerse();
  }, [onNextVerse, playSegmentAtIndex, stopAudioEngines]);

  // Test an exact voice
  const testSpecificVoice = useCallback((voiceURI: string, lang: 'te' | 'en') => {
    if (isTestingRef.current && testingVoiceURI === voiceURI) {
      stopTTS();
      return;
    }

    stopTTS();
    isTestingRef.current = true;
    setTestingVoiceURI(voiceURI);

    const sampleText = lang === 'te'
      ? 'ఇది తెలుగు బైబిల్ వాయిస్ పరీక్ష. ఈ స్వరం స్పష్టంగా మరియు సహజంగా వినిపించాలి.'
      : 'This is an English Bible voice test. This voice should sound clear, natural, and easy to understand.';

    const speed = lang === 'te' ? teluguSpeed : englishSpeed;
    const vol = lang === 'te' ? teluguVolume : englishVolume;

    setTtsStatusText(`Testing voice: ${lang === 'te' ? 'Telugu' : 'English'}...`);

    const isHD = voiceURI.startsWith('natural_hd');

    if (isHD) {
      const audioUrl = `/api/tts?text=${encodeURIComponent(sampleText)}&lang=${lang}`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = speed;
      audio.volume = vol;
      activeAudioRef.current = audio;

      audio.onended = () => {
        isTestingRef.current = false;
        setTestingVoiceURI(null);
        setTtsStatusText('Stopped');
      };
      audio.onerror = () => {
        isTestingRef.current = false;
        setTestingVoiceURI(null);
        setTtsStatusText('Stopped');
      };
      audio.play().catch(() => {
        isTestingRef.current = false;
        setTestingVoiceURI(null);
        setTtsStatusText('Stopped');
      });
    } else {
      // Device voice
      const nativeVoice = (lang === 'te' ? deviceTeluguVoices : deviceEnglishVoices).find((v) => v.voiceURI === voiceURI);
      if (!nativeVoice) {
        // Fallback to HD
        testSpecificVoice(lang === 'te' ? 'natural_hd_te' : 'natural_hd_en', lang);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.voice = nativeVoice;
      utterance.lang = nativeVoice.lang;
      utterance.rate = speed;
      utterance.volume = vol;

      utterance.onend = () => {
        isTestingRef.current = false;
        setTestingVoiceURI(null);
        setTtsStatusText('Stopped');
      };
      utterance.onerror = () => {
        isTestingRef.current = false;
        setTestingVoiceURI(null);
        setTtsStatusText('Stopped');
      };

      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }
  }, [deviceEnglishVoices, deviceTeluguVoices, englishSpeed, englishVolume, stopTTS, teluguSpeed, teluguVolume, testingVoiceURI]);

  // Test currently selected voice
  const testVoice = useCallback((lang: 'te' | 'en') => {
    const uri = lang === 'te' ? selectedTeluguVoiceURI : selectedEnglishVoiceURI;
    testSpecificVoice(uri, lang);
  }, [selectedEnglishVoiceURI, selectedTeluguVoiceURI, testSpecificVoice]);

  const stopVoiceTest = useCallback(() => {
    if (isTestingRef.current) stopTTS();
  }, [stopTTS]);

  useEffect(() => {
    return () => {
      stopAudioEngines();
    };
  }, [stopAudioEngines]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    ttsStatusText,
    currentSpeakingVerseNumber: verseHighlight ? currentSpeakingVerseNumber : null,
    voiceNotice,
    testingVoiceURI,
    readingLanguageMode,
    selectedTeluguVoiceURI,
    teluguSpeed,
    teluguVolume,
    teluguPitch,
    selectedEnglishVoiceURI,
    englishSpeed,
    englishVolume,
    englishPitch,
    autoRead,
    verseHighlight,
    highlightSpokenVerse: verseHighlight,
    showStatusIndicator,
    availableVoices,
    teluguVoices: deviceTeluguVoices,
    englishVoices: deviceEnglishVoices,
    rankedTeluguVoices,
    rankedEnglishVoices,
    startReading,
    pauseTTS,
    resumeTTS,
    stopTTS,
    restartTTS,
    prevVerseAction,
    nextVerseAction,
    testVoice,
    testSpecificVoice,
    stopVoiceTest,
    refreshVoices,
    updateReadingLanguageMode,
    updateSelectedTeluguVoice,
    updateSelectedEnglishVoice,
    updateTeluguSpeed,
    updateEnglishSpeed,
    updateTeluguVolume,
    updateEnglishVolume,
    updateTeluguPitch,
    updateEnglishPitch,
    updateAutoRead,
    updateVerseHighlight,
    updateShowStatusIndicator,
  };
}
