'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Shuffle, ListMusic, X } from 'lucide-react';
import { Song } from '@/lib/types';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, playlist?: Song[]) => void;
  togglePlay: () => void;
  playlist: Song[];
}

const PlayerContext = createContext<PlayerContextType>({
  currentSong: null,
  isPlaying: false,
  playSong: () => {},
  togglePlay: () => {},
  playlist: []
});

export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playSong = (song: Song, list?: Song[]) => {
    setCurrentSong(song);
    if (list && list.length > 0) {
      setPlaylist(list);
    }
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = song.audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      audioRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!currentSong && playlist.length > 0) {
      playSong(playlist[0]);
      return;
    }
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong?.id);
    let nextIndex = currentIndex + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else if (nextIndex >= playlist.length) {
      nextIndex = 0;
    }
    playSong(playlist[nextIndex]);
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong?.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = playlist.length - 1;
    playSong(playlist[prevIndex]);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, togglePlay, playlist }}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (isRepeat) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
          } else {
            handleNext();
          }
        }}
      />

      {/* Floating Bottom Bar (visible when a song is loaded) */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-amber-500/30 text-white backdrop-blur-lg shadow-2xl px-4 py-2 sm:py-3 transition-all animate-slide-up">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            
            {/* Song Info */}
            <div className="flex items-center space-x-3 w-full sm:w-1/4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <span className="font-cinzel font-bold text-amber-300 text-sm">
                  #{currentSong.song_number}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {currentSong.title_english}
                </p>
                <p className="text-xs text-amber-300 font-telugu truncate">
                  {currentSong.title_telugu}
                </p>
              </div>
            </div>

            {/* Playback Controls & Progress Bar */}
            <div className="flex flex-col items-center w-full sm:w-2/4">
              <div className="flex items-center space-x-4 mb-1">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-1.5 rounded hover:text-amber-400 transition-colors ${isShuffle ? 'text-amber-400' : 'text-slate-400'}`}
                  title="Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePrev}
                  className="p-1.5 text-slate-300 hover:text-amber-400 transition-colors"
                  title="Previous"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md hover:scale-105 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 text-slate-300 hover:text-amber-400 transition-colors"
                  title="Next"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`p-1.5 rounded hover:text-amber-400 transition-colors ${isRepeat ? 'text-amber-400' : 'text-slate-400'}`}
                  title="Repeat"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Slider */}
              <div className="w-full flex items-center space-x-2 text-[11px] text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume & Playlist Drawer Toggle */}
            <div className="hidden sm:flex items-center justify-end space-x-4 w-1/4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`p-1.5 rounded hover:text-amber-400 transition-colors ${showPlaylist ? 'text-amber-400' : 'text-slate-400'}`}
                title="Playlist"
              >
                <ListMusic className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Playlist Popup Drawer */}
          {showPlaylist && playlist.length > 0 && (
            <div className="absolute bottom-full right-4 mb-2 w-80 max-h-80 bg-slate-900 border border-amber-500/30 rounded-xl p-3 shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-amber-300 font-cinzel">Current Playlist ({playlist.length})</span>
                <button onClick={() => setShowPlaylist(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {playlist.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => playSong(s)}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentSong.id === s.id
                        ? 'bg-amber-500/20 text-amber-300 font-semibold border-l-2 border-amber-500'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate pr-2">#{s.song_number} {s.title_english}</span>
                    <span className="text-[10px] text-slate-500">{s.category_name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PlayerContext.Provider>
  );
}
