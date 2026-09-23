import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, AlertCircle, ExternalLink } from 'lucide-react';
import { formatTime, playSoundTestChime } from '../utils/audioUtils';
import { AudioSourceItem } from '../types';

interface AudioPlayerProps {
  transcript: string;
  narratorVoice?: string;
  audioSources?: AudioSourceItem[];
  canonicalUrl?: string;
  examMode?: 'study' | 'simulation';
  onTimeUpdate?: (currentTime: number) => void;
  onSentenceChange?: (sentenceIndex: number, text: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  transcript,
  narratorVoice = 'en-GB',
  audioSources = [],
  canonicalUrl,
  examMode = 'study',
  onTimeUpdate,
  onSentenceChange
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>(narratorVoice);

  // Mode: 'stream' (if primary URL streamable) or 'tts' (synthetic practice fallback)
  const primaryStreamSource = audioSources.find(s => s.isStreamable && !s.isSynthetic);
  const [audioMode, setAudioMode] = useState<'stream' | 'tts'>(primaryStreamSource ? 'stream' : 'tts');
  const [userChoseSynthetic, setUserChoseSynthetic] = useState<boolean>(false);

  // Audio HTML element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const isSpeakingRef = useRef<boolean>(false);

  // Parse transcript into spoken lines
  const sentences = React.useMemo(() => {
    return transcript
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }, [transcript]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Update sentence notification
  useEffect(() => {
    if (sentences[activeSentenceIndex]) {
      onSentenceChange?.(activeSentenceIndex, sentences[activeSentenceIndex]);
    }
  }, [activeSentenceIndex, sentences, onSentenceChange]);

  // Reset when transcript changes
  useEffect(() => {
    stopAllAudio();
    setActiveSentenceIndex(0);
    setCurrentTime(0);
    setAudioMode(primaryStreamSource ? 'stream' : 'tts');
    setUserChoseSynthetic(false);
  }, [transcript, primaryStreamSource]);

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

  // Web Speech API execution - clearly documented as synthetic practice fallback
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

    const voices = window.speechSynthesis.getVoices();
    const matched = voices.find(
      v =>
        v.lang.startsWith(selectedVoice) ||
        (selectedVoice.startsWith('en-GB') && (v.name.includes('UK') || v.name.includes('British'))) ||
        (selectedVoice.startsWith('en-US') && (v.name.includes('US') || v.name.includes('United States')))
    );
    if (matched) utterance.voice = matched;

    utterance.onend = () => {
      if (isSpeakingRef.current) {
        setTimeout(() => {
          if (isSpeakingRef.current) {
            speakSentence(index + 1);
          }
        }, 300);
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
      } else if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // If stream fails, alert user rather than silently swapping
          setIsPlaying(false);
        });
      }
    }
  };

  const handleSeek = (newTime: number) => {
    if (examMode === 'simulation') return; // Strict no-rewind in exam mode
    if (audioMode === 'stream' && audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    } else if (audioMode === 'tts') {
      const targetIndex = Math.floor((newTime / Math.max(1, sentences.length)) * sentences.length);
      setActiveSentenceIndex(Math.min(sentences.length - 1, Math.max(0, targetIndex)));
      if (isPlaying) speakSentence(targetIndex);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) audioRef.current.playbackRate = speed;
  };

  const hasDirectAudio = Boolean(primaryStreamSource);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs">
      {/* Fallback Notice if official stream is unavailable */}
      {!hasDirectAudio && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Official audio hosted externally: </span>
              <span>Audio gốc của bài mẫu được bảo vệ bản quyền trên trang chính thức.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-6 sm:ml-0">
            {canonicalUrl && (
              <a
                href={canonicalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded text-[11px] font-medium"
              >
                <span>Mở trang chính thức</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {!userChoseSynthetic && (
              <button
                type="button"
                onClick={() => {
                  setUserChoseSynthetic(true);
                  setAudioMode('tts');
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium cursor-pointer"
              >
                Dùng Synthetic practice audio
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Player Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Play/Pause and Restart */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Tạm dừng audio' : 'Phát audio'}
            className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              stopAllAudio();
              setActiveSentenceIndex(0);
              setCurrentTime(0);
            }}
            title="Nghe lại từ đầu"
            disabled={examMode === 'simulation' && isPlaying}
            className="p-2 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Audio Engine Label */}
          <div className="text-xs">
            <span className="font-semibold text-slate-800 block">
              {audioMode === 'stream' ? 'Official Stream Audio' : 'Browser TTS – practice fallback'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {audioMode === 'tts' ? `Đoạn ${activeSentenceIndex + 1} / ${sentences.length}` : `${formatTime(currentTime)} / ${formatTime(duration)}`}
            </span>
          </div>
        </div>

        {/* Playback speed buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-xs">
          {[0.75, 0.9, 1.0, 1.1, 1.25].map(speed => (
            <button
              key={speed}
              type="button"
              onClick={() => handleSpeedChange(speed)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                playbackRate === speed
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Accent Selector & Sound Check */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Accent:</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 cursor-pointer"
            >
              <option value="en-GB">British (en-GB)</option>
              <option value="en-US">North American (en-US)</option>
              <option value="en-AU">Australian (en-AU)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={playSoundTestChime}
            title="Thử âm lượng tai nghe (Sound Test Chime)"
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs cursor-pointer font-medium"
          >
            <Volume2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Test Tai Nghe</span>
          </button>
        </div>
      </div>

      {/* Scrubber Bar (Study mode only) */}
      {audioMode === 'stream' && (
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            disabled={examMode === 'simulation'}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full accent-slate-900 cursor-pointer disabled:cursor-not-allowed h-1.5 bg-slate-200 rounded-lg"
          />
        </div>
      )}

      {/* Hidden HTML Audio element for stream mode */}
      {primaryStreamSource && (
        <audio
          ref={audioRef}
          src={primaryStreamSource.url}
          onTimeUpdate={() => {
            if (audioRef.current) {
              const cur = audioRef.current.currentTime;
              setCurrentTime(cur);
              onTimeUpdate?.(cur);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};
