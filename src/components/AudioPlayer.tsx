import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, FastForward, Rewind, Radio, CheckCircle, Info } from 'lucide-react';
import { formatTime, playSoundTestChime } from '../utils/audioUtils';

interface AudioPlayerProps {
  transcript: string;
  narratorVoice: 'en-GB' | 'en-US' | 'en-AU';
  externalSources?: { label: string; url: string }[];
  onTimeUpdate?: (currentTime: number) => void;
  onSentenceChange?: (sentenceIndex: number, text: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  transcript,
  narratorVoice = 'en-GB',
  externalSources = [],
  onSentenceChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [audioMode, setAudioMode] = useState<'tts' | 'stream'>('tts');
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<'en-GB' | 'en-US' | 'en-AU'>(narratorVoice);

  // Audio HTML element ref for stream mode
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSpeakingRef = useRef(false);

  // Parse transcript into spoken segments
  const sentences = React.useMemo(() => {
    return transcript
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }, [transcript]);

  // Cancel any speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update sentence notification
  useEffect(() => {
    if (sentences[activeSentenceIndex]) {
      onSentenceChange?.(activeSentenceIndex, sentences[activeSentenceIndex]);
    }
  }, [activeSentenceIndex, sentences, onSentenceChange]);

  // Stop audio when mode or transcript changes
  useEffect(() => {
    stopAllAudio();
    setActiveSentenceIndex(0);
  }, [transcript, audioMode]);

  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  // Play sentence via Web Speech API (Cambridge standard voice)
  const speakSentence = (index: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (index >= sentences.length) {
      setIsPlaying(false);
      setActiveSentenceIndex(0);
      return;
    }

    window.speechSynthesis.cancel();
    setActiveSentenceIndex(index);

    const textToSpeak = sentences[index];
    const cleanText = textToSpeak.replace(/^[A-Z\s]+:\s*/, '').replace(/\[Q\d+\]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedVoice;
    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : volume;

    // Best matching British/Academic voice selection
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      v => v.lang.startsWith(selectedVoice) ||
      (selectedVoice === 'en-GB' && (v.name.includes('UK') || v.name.includes('British') || v.name.includes('English (United Kingdom)')))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      if (isSpeakingRef.current) {
        setTimeout(() => {
          if (isSpeakingRef.current) {
            speakSentence(index + 1);
          }
        }, 350);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      isSpeakingRef.current = false;
    };

    isSpeakingRef.current = true;
    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAllAudio();
    } else {
      if (audioMode === 'tts') {
        setIsPlaying(true);
        speakSentence(activeSentenceIndex);
      } else {
        if (audioRef.current) {
          audioRef.current.volume = isMuted ? 0 : volume;
          audioRef.current.playbackRate = playbackRate;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch((err) => {
            console.warn('Online stream failed, auto-switching to Cambridge TTS Engine', err);
            setStreamError('Máy chủ stream không khả dụng. Đã tự động chuyển sang Giọng đọc Cambridge chuẩn.');
            setAudioMode('tts');
            setIsPlaying(true);
            speakSentence(activeSentenceIndex);
          });
        }
      }
    }
  };

  const handleSkip = (direction: 'forward' | 'backward') => {
    if (audioMode === 'tts') {
      const nextIndex = direction === 'forward'
        ? Math.min(sentences.length - 1, activeSentenceIndex + 1)
        : Math.max(0, activeSentenceIndex - 1);
      setActiveSentenceIndex(nextIndex);
      if (isPlaying) {
        speakSentence(nextIndex);
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime += direction === 'forward' ? 5 : -5;
    }
  };

  const handleRestart = () => {
    stopAllAudio();
    setActiveSentenceIndex(0);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Sound check
  const handleTestAudio = () => {
    playSoundTestChime();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-sm">
      {/* Fallback Notice if Stream Fails */}
      {streamError && (
        <div className="mb-3 flex items-center justify-between gap-2 p-2.5 bg-amber-950/60 border border-amber-800 text-amber-200 rounded text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{streamError}</span>
          </div>
          <button
            onClick={() => setStreamError(null)}
            className="text-amber-400 hover:text-amber-200 text-xs font-semibold cursor-pointer shrink-0"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Top Controls: Audio Source & Accents & Sound Check */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-slate-400">
            <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>EXAM AUDIO CONSOLE</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded">
            <button
              onClick={() => { setAudioMode('tts'); setStreamError(null); }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                audioMode === 'tts'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Giọng Cambridge (Offline)
            </button>
            <button
              onClick={() => setAudioMode('stream')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                audioMode === 'stream'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audio Stream
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Accent selector */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">Giọng:</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-400"
            >
              <option value="en-GB">Anh - Anh (British en-GB)</option>
              <option value="en-US">Anh - Mỹ (American en-US)</option>
              <option value="en-AU">Anh - Úc (Australian en-AU)</option>
            </select>
          </div>

          {/* Test Chime */}
          <button
            onClick={handleTestAudio}
            title="Thử âm lượng tai nghe"
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
          >
            <Volume2 className="w-3 h-3 text-amber-400" />
            <span>Test Tai Nghe</span>
          </button>
        </div>
      </div>

      {/* Hidden audio for stream mode */}
      {audioMode === 'stream' && (
        <audio
          ref={audioRef}
          src={externalSources[0]?.url || ''}
          onError={() => {
            setStreamError('Máy chủ stream không khả dụng. Đã chuyển sang Giọng đọc chuẩn Cambridge.');
            setAudioMode('tts');
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Playback Controls & Scrubber */}
      <div className="mt-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
        {/* Play/Pause & Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSkip('backward')}
            title="Lùi 1 câu"
            className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all cursor-pointer shadow-sm ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400/50'
                : 'bg-white hover:bg-slate-200 text-slate-900 ring-2 ring-white/20'
            }`}
            title={isPlaying ? 'Tạm dừng bài nghe' : 'Bắt đầu phát bài nghe'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
          </button>

          <button
            onClick={() => handleSkip('forward')}
            title="Tiến 1 câu"
            className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <FastForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleRestart}
            title="Phát lại từ đầu"
            className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Audio Tracking Display */}
        <div className="flex-1 min-w-[200px] bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
              {isPlaying ? 'AUDIO PLAYING' : 'AUDIO PAUSED'}
            </span>
            <span>
              Phần {activeSentenceIndex + 1} / {sentences.length}
            </span>
          </div>
          <p className="text-slate-200 truncate font-medium font-serif-reading text-sm">
            {sentences[activeSentenceIndex] || 'Bấm nút Play để bắt đầu bài thi nghe...'}
          </p>
        </div>

        {/* Speed & Volume Controls */}
        <div className="flex items-center gap-3">
          {/* Playback rate */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded p-0.5">
            {[0.8, 1.0, 1.25].map(rate => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`px-1.5 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                  playbackRate === rate
                    ? 'bg-slate-800 text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                setIsMuted(false);
                if (audioRef.current) audioRef.current.volume = val;
              }}
              className="w-16 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
