'use client';

import React, { useState, useMemo } from 'react';
import { 
  Volume2, Play, Pause, Square, RotateCcw, SkipBack, SkipForward,
  Check, AlertCircle, Sparkles, Search, RefreshCw, Globe, BookOpen, Sliders
} from 'lucide-react';
import { ReadingLanguageMode, VoiceRankingInfo } from '@/hooks/useBibleTTS';

interface BibleTTSControlsProps {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  ttsStatusText: string;
  voiceNotice: string | null;
  testingVoiceURI?: string | null;
  // Language Mode
  readingLanguageMode: ReadingLanguageMode;
  onSelectLanguageMode: (mode: ReadingLanguageMode) => void;
  // Telugu Settings
  selectedTeluguVoiceURI: string;
  teluguSpeed: number;
  teluguVolume: number;
  teluguPitch: number;
  teluguVoices: SpeechSynthesisVoice[];
  rankedTeluguVoices: VoiceRankingInfo[];
  onChangeTeluguVoice: (uri: string) => void;
  onChangeTeluguSpeed: (speed: number) => void;
  onChangeTeluguVolume: (vol: number) => void;
  onChangeTeluguPitch: (pitch: number) => void;
  // English Settings
  selectedEnglishVoiceURI: string;
  englishSpeed: number;
  englishVolume: number;
  englishPitch: number;
  englishVoices: SpeechSynthesisVoice[];
  rankedEnglishVoices: VoiceRankingInfo[];
  onChangeEnglishVoice: (uri: string) => void;
  onChangeEnglishSpeed: (speed: number) => void;
  onChangeEnglishVolume: (vol: number) => void;
  onChangeEnglishPitch: (pitch: number) => void;
  // Reading Options
  autoRead: boolean;
  verseHighlight: boolean;
  onToggleAutoRead: (val: boolean) => void;
  onToggleVerseHighlight: (val: boolean) => void;
  // Reading Controls
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRestart: () => void;
  onPrev: () => void;
  onNext: () => void;
  // Testing & Refresh
  onTestVoice: (lang: 'te' | 'en') => void;
  onTestSpecificVoice: (voiceURI: string, lang: 'te' | 'en') => void;
  onStopVoiceTest: () => void;
  onRefreshVoices: () => void;
}

export function BibleTTSControlsSettingsPanel({
  isSupported,
  isPlaying,
  isPaused,
  ttsStatusText,
  voiceNotice,
  testingVoiceURI,
  readingLanguageMode,
  onSelectLanguageMode,
  selectedTeluguVoiceURI,
  teluguSpeed,
  teluguVolume,
  teluguPitch,
  teluguVoices,
  rankedTeluguVoices,
  onChangeTeluguVoice,
  onChangeTeluguSpeed,
  onChangeTeluguVolume,
  onChangeTeluguPitch,
  selectedEnglishVoiceURI,
  englishSpeed,
  englishVolume,
  englishPitch,
  englishVoices,
  rankedEnglishVoices,
  onChangeEnglishVoice,
  onChangeEnglishSpeed,
  onChangeEnglishVolume,
  onChangeEnglishPitch,
  autoRead,
  verseHighlight,
  onToggleAutoRead,
  onToggleVerseHighlight,
  onStart,
  onPause,
  onResume,
  onStop,
  onRestart,
  onPrev,
  onNext,
  onTestVoice,
  onTestSpecificVoice,
  onStopVoiceTest,
  onRefreshVoices,
}: BibleTTSControlsProps) {
  // Search Settings query (Requirement 20)
  const [searchQuery, setSearchQuery] = useState('');

  // 13 Speed options specified in Requirement 10
  const speedOptions = [
    0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 1.10, 1.20, 1.30, 1.50
  ];

  // Search keyword matcher (Requirement 20)
  const matchesSearch = (keywords: string[]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return keywords.some(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-amber-500/40 space-y-4 shadow-inner">
      {/* ============================================================== */}
      {/* SEARCH SETTINGS (Requirement 20)                               */}
      {/* ============================================================== */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="సెట్టింగ్స్ వెతకండి • Search settings (Telugu, English, speed, volume, pitch, voice test, read aloud...)"
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              టెక్స్ట్ టు స్పీచ్ • చదవండి / Text-to-Speech (TTS)
            </h4>
            <p className="text-[11px] text-slate-400 font-telugu">
              డిస్‌ప్లే లో ఉన్న బైబిల్ వచనాలను పరికరంలో ఉన్న నిజమైన స్వరాలతో నెమ్మదిగా, స్పష్టంగా చదివి వినిపిస్తుంది
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefreshVoices();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 border border-slate-700 transition"
            title="Refresh available device voices"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh Voices</span>
          </button>

          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            isPlaying && !isPaused
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
              : isPaused
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {isPlaying && !isPaused ? '🔊 చదువుతోంది / SPEAKING' : isPaused ? '⏸ నిలిపివేయబడింది / PAUSED' : '⏹ ఆగింది / STOPPED'}
          </span>
        </div>
      </div>

      {/* Voice Warning Notice if any (Requirement 6, 23) */}
      {voiceNotice && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start justify-between gap-3 font-telugu">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">{voiceNotice}</p>
              <p className="text-[10px] text-rose-300/80 mt-1">
                సూచన: Android ఫోన్లలో Settings → System/Accessibility → Text-to-speech output లో Telugu voice pack ను ఇన్స్టాల్ చేసుకోండి. Windows లో Settings → Time &amp; Language → Speech లో Telugu language pack ను యాడ్ చేయండి.
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefreshVoices();
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/50 text-[11px] font-bold whitespace-nowrap active:scale-95 transition"
          >
            🔄 TRY AGAIN
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. MAIN LANGUAGE MODES (Requirement 1, 2, 3, 4)                */}
      {/* Exactly THREE modes: TELUGU ONLY (default), ENGLISH ONLY, TELUGU + ENGLISH */}
      {/* ============================================================== */}
      {matchesSearch(['reading language', 'telugu only', 'english only', 'telugu + english', 'language', 'mode']) && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-300 font-telugu uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              చదివే భాష • READING LANGUAGE
            </span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
              {readingLanguageMode === 'telugu_only' ? 'తెలుగు మాత్రమే (Default)' : readingLanguageMode === 'english_only' ? 'English Only' : 'తెలుగు + English (Telugu First)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Mode 1: TELUGU ONLY (Default) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectLanguageMode('telugu_only');
              }}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1 active:scale-95 ${
                readingLanguageMode === 'telugu_only'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-telugu">1. తెలుగు మాత్రమే • TELUGU ONLY</span>
                {readingLanguageMode === 'telugu_only' && (
                  <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                పుస్తకం పేరు, అధ్యాయము, వచనము మరియు బైబిల్ అంతా తెలుగులో మాత్రమే చదువుతుంది (Default)
              </p>
            </button>

            {/* Mode 2: ENGLISH ONLY */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectLanguageMode('english_only');
              }}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1 active:scale-95 ${
                readingLanguageMode === 'english_only'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-telugu">2. ENGLISH ONLY</span>
                {readingLanguageMode === 'english_only' && (
                  <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                Book, chapter, verse reference &amp; Bible text spoken entirely in English
              </p>
            </button>

            {/* Mode 3: TELUGU + ENGLISH (Telugu First) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectLanguageMode('telugu_english');
              }}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1 active:scale-95 ${
                readingLanguageMode === 'telugu_english'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-telugu">3. TELUGU + ENGLISH</span>
                {readingLanguageMode === 'telugu_english' && (
                  <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                ముందుగా తెలుగు వచనం, తర్వాత ఇంగ్లీష్ వచనం చదువుతుంది (Telugu First → Then English)
              </p>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* READING CONTROLS ACTION BAR (Requirement 17)                   */}
      {/* ============================================================== */}
      {matchesSearch(['reading controls', 'play', 'pause', 'resume', 'stop', 'restart', 'previous', 'next', 'read aloud']) && (
        <div className="flex flex-wrap items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span className="font-telugu font-bold text-xs sm:text-sm">
                {readingLanguageMode === 'telugu_only' ? '🔊 చదవండి (తెలుగు)' : readingLanguageMode === 'english_only' ? '🔊 READ ALOUD (English)' : '🔊 చదవండి • READ ALOUD (Telugu + English)'}
              </span>
            </button>
          ) : isPaused ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResume();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span className="font-telugu font-bold text-xs sm:text-sm">▶ కొనసాగించు • RESUME</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPause();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4" />
              <span className="font-telugu font-bold text-xs sm:text-sm">⏸ పాజ్ • PAUSE</span>
            </button>
          )}

          {/* Stop Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStop();
            }}
            disabled={!isPlaying && !isPaused}
            className="py-2.5 px-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-95 border border-slate-700 disabled:opacity-40 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
            title="Stop reading completely"
          >
            <Square className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>⏹ ఆపు • STOP</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-95 border border-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1"
            title="Restart from first verse"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">మళ్ళీ • Restart</span>
          </button>

          {/* Previous Verse */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-95 border border-slate-700 text-slate-300 text-xs transition"
            title="Previous verse"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Next Verse */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-95 border border-slate-700 text-slate-300 text-xs transition"
            title="Next verse"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DEDICATED TELUGU VOICE SECTION (Requirement 5, 6, 7, 8, 10, 11, 12) */}
      {/* ============================================================== */}
      {matchesSearch(['telugu voice', 'telugu', 'voice', 'telugu speed', 'telugu volume', 'telugu pitch', 'test voice', 'clear voice']) && (
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-amber-400 font-telugu tracking-wide">
                  తెలుగు స్వరం • TELUGU VOICE
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {teluguVoices.length} {teluguVoices.length === 1 ? 'Voice' : 'Voices'} Detected
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Real installed Telugu TTS voices on this device ({teluguVoices.length > 0 ? 'Verified' : 'None detected'})
              </p>
            </div>

            {/* Quick Test Telugu Voice Button (Requirement 8) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTestVoice('te');
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition active:scale-95"
              title="Test selected Telugu voice"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>TEST TELUGU VOICE</span>
            </button>
          </div>

          {/* List of Real Available Telugu Voices (Requirement 6, 7, 8) */}
          {teluguVoices.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 font-telugu">
                లభ్యమైన తెలుగు స్వరాలు • Available Telugu Voices:
              </span>

              {rankedTeluguVoices.map((item, idx) => {
                const isSelected = selectedTeluguVoiceURI === item.voiceURI;
                const isTesting = testingVoiceURI === item.voiceURI;

                return (
                  <div
                    key={item.voiceURI || idx}
                    className={`p-3 rounded-xl border transition ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-[200px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white">
                            {item.name}
                          </span>

                          {item.isRecommended && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              RECOMMENDED TELUGU VOICE
                            </span>
                          )}

                          {item.isHDStudio && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                              HD Studio Audio (100% Clear)
                            </span>
                          )}

                          {item.isLocal && (
                            <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded font-mono">
                              Local Device
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="font-mono text-slate-300">Locale: {item.lang}</span>
                          <span>•</span>
                          <span>Status: {item.isHDStudio ? 'HD Studio Stream (Never Breaks)' : item.isLocal ? 'Installed on Device' : 'Network Service Available'}</span>
                        </div>
                      </div>

                      {/* Actions: TEST VOICE & SELECT */}
                      <div className="flex items-center gap-2">
                        {/* TEST VOICE with Stop capability */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isTesting) {
                              onStopVoiceTest();
                            } else {
                              onTestSpecificVoice(item.voiceURI, 'te');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                            isTesting
                              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                          }`}
                          title="Test with exact Telugu test sentence"
                        >
                          {isTesting ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span>STOP TEST</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>TEST VOICE</span>
                            </>
                          )}
                        </button>

                        {/* SELECT button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onChangeTeluguVoice(item.voiceURI);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition active:scale-95 ${
                            isSelected
                              ? 'bg-emerald-600 text-white border border-emerald-400'
                              : 'bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>SELECTED</span>
                            </>
                          ) : (
                            <span>SELECT</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Clear notice when 0 real Telugu voices are detected (Requirement 6, 23) */
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2 text-xs font-telugu">
              <div className="flex items-center gap-2 font-bold text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>No Telugu text-to-speech voice is available on this device/browser.</span>
              </div>
              <p className="text-[11px] text-amber-300/80">
                మీ బ్రౌజర్ లో లేదా ఆపరేటింగ్ సిస్టమ్ లో నిజమైన తెలుగు TTS వాయిస్ కనుగొనబడలేదు. మేము ఇంగ్లీష్ స్వరాన్ని తెలుగు కొరకు వాడము.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefreshVoices();
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>🔄 Refresh &amp; Check Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Telugu Speech Speed (Requirement 10) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium font-telugu">
                తెలుగు చదివే వేగం • TELUGU SPEECH SPEED (Default: 0.80x):
              </span>
              <div className="flex items-center gap-1.5">
                {Math.abs(teluguSpeed - 0.80) < 0.01 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                    Recommended Default
                  </span>
                )}
                <span className="font-mono text-amber-400 font-bold">{teluguSpeed.toFixed(2)}x</span>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-13 gap-1.5">
              {speedOptions.map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeTeluguSpeed(s);
                  }}
                  className={`py-1.5 rounded-xl text-[11px] font-bold font-mono transition ${
                    Math.abs(teluguSpeed - s) < 0.01
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {s.toFixed(2)}x
                </button>
              ))}
            </div>
          </div>

          {/* Telugu Volume & Pitch (Requirement 11 & 12) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Telugu Volume */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-telugu">
                <span className="text-slate-300 font-medium">తెలుగు శబ్దం • TELUGU VOLUME:</span>
                <span className="font-mono text-amber-400 font-bold">{Math.round(teluguVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={teluguVolume}
                onChange={(e) => onChangeTeluguVolume(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Telugu Pitch */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-telugu">
                <span className="text-slate-300 font-medium">తెలుగు స్వర స్థాయి • TELUGU PITCH:</span>
                <span className="font-mono text-amber-400 font-bold">{teluguPitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={teluguPitch}
                onChange={(e) => onChangeTeluguPitch(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. DEDICATED ENGLISH VOICE SECTION (Requirement 5, 9, 10, 11, 12) */}
      {/* ============================================================== */}
      {matchesSearch(['english voice', 'english', 'voice', 'english speed', 'english volume', 'english pitch', 'test voice']) && (
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-amber-400 font-telugu tracking-wide">
                  ఇంగ్లీష్ స్వరం • ENGLISH VOICE
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {englishVoices.length} {englishVoices.length === 1 ? 'Voice' : 'Voices'} Detected
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Real installed English TTS voices on this device ({englishVoices.length} detected)
              </p>
            </div>

            {/* Quick Test English Voice Button (Requirement 9) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTestVoice('en');
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition active:scale-95"
              title="Test selected English voice"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>TEST ENGLISH VOICE</span>
            </button>
          </div>

          {/* List of Real Available English Voices (Requirement 9) */}
          {englishVoices.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 font-telugu">
                లభ్యమైన ఇంగ్లీష్ స్వరాలు • Available English Voices:
              </span>

              {/* Show top ranked + dropdown for all */}
              <div className="space-y-2">
                {rankedEnglishVoices.slice(0, 3).map((item, idx) => {
                  const isSelected = selectedEnglishVoiceURI === item.voiceURI;
                  const isTesting = testingVoiceURI === item.voiceURI;

                  return (
                    <div
                      key={item.voiceURI || idx}
                      className={`p-3 rounded-xl border transition ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5 min-w-[200px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-white">
                              {item.name}
                            </span>

                            {item.isRecommended && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                RECOMMENDED ENGLISH VOICE
                              </span>
                            )}

                            {item.isHDStudio && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                                HD Studio Audio
                              </span>
                            )}

                            {item.isLocal && (
                              <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded font-mono">
                                Local Device
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="font-mono text-slate-300">Locale: {item.lang}</span>
                            <span>•</span>
                            <span>Status: {item.isHDStudio ? 'HD Studio Stream (Never Breaks)' : item.isLocal ? 'Installed on Device' : 'Network Service Available'}</span>
                          </div>
                        </div>

                        {/* Actions: TEST & SELECT */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isTesting) {
                                onStopVoiceTest();
                              } else {
                                onTestSpecificVoice(item.voiceURI, 'en');
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                              isTesting
                                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                            }`}
                            title="Test with exact English test sentence"
                          >
                            {isTesting ? (
                              <>
                                <Square className="w-3 h-3 fill-current" />
                                <span>STOP TEST</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-current" />
                                <span>TEST VOICE</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onChangeEnglishVoice(item.voiceURI);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition active:scale-95 ${
                              isSelected
                                ? 'bg-emerald-600 text-white border border-emerald-400'
                                : 'bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-300 border border-slate-700'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>SELECTED</span>
                              </>
                            ) : (
                              <span>SELECT</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Dropdown for complete list of all English voices */}
                {englishVoices.length > 3 && (
                  <div className="pt-1">
                    <label className="text-[10px] text-slate-400 block mb-1">
                      మరిన్ని ఇంగ్లీష్ స్వరాలు • All English Voices ({englishVoices.length}):
                    </label>
                    <select
                      value={selectedEnglishVoiceURI}
                      onChange={(e) => {
                        e.stopPropagation();
                        onChangeEnglishVoice(e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                    >
                      {englishVoices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang}) {v.localService ? '— Local' : '— Online'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              English text-to-speech is not available on this device/browser.
            </div>
          )}

          {/* English Speech Speed (Requirement 10) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium font-telugu">
                ఇంగ్లీష్ చదివే వేగం • ENGLISH SPEECH SPEED (Default: 0.80x):
              </span>
              <div className="flex items-center gap-1.5">
                {Math.abs(englishSpeed - 0.80) < 0.01 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                    Recommended Default
                  </span>
                )}
                <span className="font-mono text-amber-400 font-bold">{englishSpeed.toFixed(2)}x</span>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-13 gap-1.5">
              {speedOptions.map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeEnglishSpeed(s);
                  }}
                  className={`py-1.5 rounded-xl text-[11px] font-bold font-mono transition ${
                    Math.abs(englishSpeed - s) < 0.01
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {s.toFixed(2)}x
                </button>
              ))}
            </div>
          </div>

          {/* English Volume & Pitch (Requirement 11 & 12) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* English Volume */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-telugu">
                <span className="text-slate-300 font-medium">ఇంగ్లీష్ శబ్దం • ENGLISH VOLUME:</span>
                <span className="font-mono text-amber-400 font-bold">{Math.round(englishVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={englishVolume}
                onChange={(e) => onChangeEnglishVolume(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* English Pitch */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-telugu">
                <span className="text-slate-300 font-medium">ఇంగ్లీష్ స్వర స్థాయి • ENGLISH PITCH:</span>
                <span className="font-mono text-amber-400 font-bold">{englishPitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={englishPitch}
                onChange={(e) => onChangeEnglishPitch(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. READING OPTIONS (Requirement 13 & 21)                        */}
      {/* ============================================================== */}
      {matchesSearch(['reading options', 'highlight', 'verse', 'automatic reading', 'chapter']) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer text-xs">
            <span className="text-slate-300 font-telugu">
              చదువుతున్న వచనం హైలైట్ చేయండి • Highlight Spoken Verse
            </span>
            <input
              type="checkbox"
              checked={verseHighlight}
              onChange={(e) => onToggleVerseHighlight(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
          </label>

          <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer text-xs">
            <span className="text-slate-300 font-telugu">
              తదుపరి అధ్యాయాన్ని ఆటోమేటిక్ గా చదవండి • Auto-Read Next Chapter
            </span>
            <input
              type="checkbox"
              checked={autoRead}
              onChange={(e) => onToggleAutoRead(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
          </label>
        </div>
      )}
    </div>
  );
}

// Floating Mini-Indicator (Persistent Sanctuary Overlay)
export function BibleTTSFloatingIndicator({
  isPlaying,
  isPaused,
  ttsStatusText,
  onPause,
  onResume,
  onStop,
  onRestart,
}: {
  isPlaying: boolean;
  isPaused: boolean;
  ttsStatusText: string;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRestart: () => void;
}) {
  if (!isPlaying && !isPaused) return null;

  return (
    <div className="fixed top-20 right-4 z-40 bg-slate-950/90 backdrop-blur-md border border-amber-500/50 rounded-2xl px-3.5 py-2 shadow-2xl flex items-center gap-3 animate-fade-in text-white text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
        <span className="font-telugu font-semibold text-amber-200 text-xs truncate max-w-[200px]">
          {ttsStatusText}
        </span>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
        {isPlaying && !isPaused ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPause();
            }}
            className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white"
            title="Pause speech"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResume();
            }}
            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
            title="Resume speech"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestart();
          }}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          title="Restart passage"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onStop();
          }}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-300"
          title="Stop speech"
        >
          <Square className="w-3.5 h-3.5 fill-rose-400" />
        </button>
      </div>
    </div>
  );
}
