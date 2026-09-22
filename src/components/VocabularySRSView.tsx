import React, { useState, useEffect, useRef } from 'react';
import { VocabCard, SRSIntervalRating } from '../types';
import { INITIAL_VOCAB_CARDS } from '../data/vocabData';
import { calculateNextSRS, parseVocabText, playPronunciation } from '../utils/srsEngine';
import {
  Brain,
  Upload,
  Keyboard,
  RotateCw,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Flame,
  Clock,
  Layers,
  HelpCircle,
  FileText,
  Settings2,
  RefreshCw
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ielts_prep_vocab_cards_v1';

export const VocabularySRSView: React.FC = () => {
  // Load saved cards or default to curated initial deck
  const [cards, setCards] = useState<VocabCard[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_VOCAB_CARDS;
  });

  // Save to localStorage whenever cards change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
    } catch {
      // ignore
    }
  }, [cards]);

  // Practice Modes: 'flashcard' (Flip & Rate) or 'typing' (Gõ phím kiểm tra)
  const [studyMode, setStudyMode] = useState<'flashcard' | 'typing'>('flashcard');
  const [voiceAccent, setVoiceAccent] = useState<'en-GB' | 'en-US'>('en-GB');

  // Active Card Queue
  const now = new Date();
  const dueCards = cards.filter((c) => !c.dueDate || new Date(c.dueDate) <= now);
  const activeQueue = dueCards.length > 0 ? dueCards : cards;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentCard: VocabCard | undefined = activeQueue[currentIndex % Math.max(1, activeQueue.length)];

  // Flashcard state
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Typing state
  const [typedInput, setTypedInput] = useState<string>('');
  const [typingResult, setTypingResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const typingInputRef = useRef<HTMLInputElement | null>(null);

  // Upload & Modal states
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [pastedText, setPastedText] = useState<string>('');
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [newWord, setNewWord] = useState({ word: '', phonetic: '', definitionVi: '', example: '' });

  // Focus input when moving to next card in typing mode
  useEffect(() => {
    setIsFlipped(false);
    setTypedInput('');
    setTypingResult('idle');
    if (studyMode === 'typing' && typingInputRef.current) {
      setTimeout(() => typingInputRef.current?.focus(), 80);
    }
  }, [currentIndex, studyMode, currentCard?.id]);

  // Global Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in a modal or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && target !== typingInputRef.current))) {
        return;
      }

      if (studyMode === 'flashcard') {
        if (e.code === 'Space') {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        } else if (e.key === '1') {
          handleRateCard(1);
        } else if (e.key === '2') {
          handleRateCard(2);
        } else if (e.key === '3') {
          handleRateCard(3);
        } else if (e.key === '4') {
          handleRateCard(4);
        } else if (e.key.toLowerCase() === 'r' && currentCard) {
          playPronunciation(currentCard.word, voiceAccent);
        }
      } else if (studyMode === 'typing') {
        if (e.key === 'Enter' && typingResult !== 'idle') {
          // If already checked, Enter moves to next with Good or Again
          if (typingResult === 'correct') {
            handleRateCard(3);
          } else {
            handleRateCard(1);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studyMode, isFlipped, currentCard, typingResult, voiceAccent]);

  // SRS Rating Action
  const handleRateCard = (rating: SRSIntervalRating) => {
    if (!currentCard) return;

    const updatedCard = calculateNextSRS(currentCard, rating);
    setCards((prev) => prev.map((c) => (c.id === currentCard.id ? updatedCard : c)));

    // Advance queue
    setIsFlipped(false);
    setTypedInput('');
    setTypingResult('idle');
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, activeQueue.length));
  };

  // Check Typing Submission
  const handleCheckTyping = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentCard) return;

    const normalizedInput = typedInput.trim().toLowerCase();
    const normalizedTarget = currentCard.word.trim().toLowerCase();

    if (normalizedInput === normalizedTarget) {
      setTypingResult('correct');
      playPronunciation(currentCard.word, voiceAccent);
    } else {
      setTypingResult('incorrect');
    }
  };

  // File Upload Handler (.txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseVocabText(content, file.name.replace('.txt', ''));
        if (parsed.length > 0) {
          setCards((prev) => [...parsed, ...prev]);
          alert(`Đã nhập thành công ${parsed.length} từ vựng mới vào hệ thống SRS!`);
          setShowUploadModal(false);
        } else {
          alert('Không tìm thấy từ vựng hợp lệ. Vui lòng kiểm tra định dạng file .txt!');
        }
      }
    };
    reader.readAsText(file);
  };

  // Paste Text Parser
  const handleParsePastedText = () => {
    if (!pastedText.trim()) return;
    const parsed = parseVocabText(pastedText, 'Danh sách tự dán');
    if (parsed.length > 0) {
      setCards((prev) => [...parsed, ...prev]);
      setPastedText('');
      setShowUploadModal(false);
      alert(`Đã nhập thành công ${parsed.length} từ vựng mới!`);
    } else {
      alert('Không phân tích được từ vựng. Hãy thử định dạng "word - meaning - example".');
    }
  };

  // Export Deck to .txt
  const exportDeckToTxt = () => {
    const textContent = cards
      .map((c) => `${c.word} | ${c.phonetic} | ${c.definitionVi} | ${c.example}`)
      .join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ielts_vocab_deck_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Stats calculation
  const masteredCount = cards.filter((c) => c.state === 'mastered').length;
  const learningCount = cards.filter((c) => c.state === 'learning').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-violet-100 text-violet-800">
                SPACED REPETITION SYSTEM (SM-2)
              </span>
              <span className="text-xs text-slate-500 font-medium">Lặp ngắt quãng & Gõ phím phản xạ</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Luyện Từ Vựng Học Thuật IELTS Band 7.0 - 8.5
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Ôn luyện định kỳ theo thuật toán trí nhớ: kết hợp bấm click chuyển thẻ và gõ phím chuẩn xác chính tả.
            </p>
          </div>

          {/* Action buttons: Upload .txt & Export */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              id="upload-txt-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Tải file .txt lên</span>
            </button>

            <button
              onClick={exportDeckToTxt}
              title="Xuất danh sách từ ra file .txt"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (confirm('Khôi phục bộ từ vựng Academic chuẩn mặc định?')) {
                  setCards(INITIAL_VOCAB_CARDS);
                }
              }}
              title="Khôi phục bộ từ gốc"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SRS Stats Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center justify-between text-indigo-700 font-bold mb-1">
              <span>Cần ôn hôm nay</span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-extrabold text-indigo-900">{dueCards.length} từ</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
            <div className="flex items-center justify-between text-amber-700 font-bold mb-1">
              <span>Đang học ghi nhớ</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-extrabold text-amber-900">{learningCount} từ</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <div className="flex items-center justify-between text-emerald-700 font-bold mb-1">
              <span>Đã thành thạo (Mastered)</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-extrabold text-emerald-900">{masteredCount} từ</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-600 font-bold mb-1">
              <span>Tổng số thẻ trong kho</span>
              <Brain className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-extrabold text-slate-800">{cards.length} từ</div>
          </div>
        </div>
      </div>

      {/* Mode Switcher & Voice Accent Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Chế độ luyện:</span>
          <button
            onClick={() => setStudyMode('flashcard')}
            id="mode-flashcard-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              studyMode === 'flashcard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Thẻ lật (Flashcard + Phím 1-4)</span>
          </button>

          <button
            onClick={() => setStudyMode('typing')}
            id="mode-typing-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              studyMode === 'typing'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Gõ phím kiểm tra (Typing Trainer)</span>
          </button>
        </div>

        {/* Voice Accent Selector */}
        <div className="flex items-center gap-2 text-slate-600">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Giọng đọc:</span>
          <button
            onClick={() => setVoiceAccent('en-GB')}
            className={`px-2 py-1 rounded font-semibold ${
              voiceAccent === 'en-GB' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-slate-100'
            }`}
          >
            Anh-Anh (UK)
          </button>
          <button
            onClick={() => setVoiceAccent('en-US')}
            className={`px-2 py-1 rounded font-semibold ${
              voiceAccent === 'en-US' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-slate-100'
            }`}
          >
            Anh-Mỹ (US)
          </button>
        </div>
      </div>

      {/* Main Practice Container */}
      {currentCard ? (
        <div className="space-y-4">
          {/* MODE 1: Flashcard View */}
          {studyMode === 'flashcard' ? (
            <div
              id="flashcard-interactive-card"
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer select-none min-h-[360px] bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              {/* Card Header info */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-indigo-600 uppercase tracking-wider">
                  {currentCard.category}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-mono">
                  Thẻ {currentIndex + 1} / {activeQueue.length}
                </span>
              </div>

              {/* Card Center Content */}
              {!isFlipped ? (
                /* Mặt trước: Word & Phonetic */
                <div className="my-auto text-center space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                      {currentCard.word}
                    </h2>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPronunciation(currentCard.word, voiceAccent);
                      }}
                      className="p-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title="Nghe phát âm (Phím R)"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="font-mono text-base text-slate-500">{currentCard.phonetic}</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    {currentCard.partOfSpeech}
                  </span>
                  <p className="text-xs text-slate-400 italic pt-2">
                    (Click vào thẻ hoặc nhấn <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono text-[11px]">Space</kbd> để lật xem nghĩa)
                  </p>
                </div>
              ) : (
                /* Mặt sau: Meaning, Collocations & IELTS Band 8 Example */
                <div className="my-auto space-y-5 text-left">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-400">Định nghĩa Tiếng Việt:</span>
                    <h3 className="text-2xl font-bold text-indigo-900 mt-0.5">{currentCard.definitionVi}</h3>
                    {currentCard.definitionEn && (
                      <p className="text-sm text-slate-600 mt-1 italic font-sans">{currentCard.definitionEn}</p>
                    )}
                  </div>

                  {/* Collocations */}
                  {currentCard.collocations && currentCard.collocations.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-bold uppercase text-slate-400">Collocations thường gặp:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {currentCard.collocations.map((col) => (
                          <span
                            key={col}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IELTS Example */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm">
                    <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                      Ví dụ học thuật Band 8.0+:
                    </span>
                    <p className="font-serif-reading text-slate-900 leading-relaxed font-medium">
                      "{currentCard.example}"
                    </p>
                    {currentCard.exampleVi && (
                      <p className="text-xs text-slate-500 mt-1.5 italic font-sans">{currentCard.exampleVi}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Card Footer: SRS Next Interval Guide */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Số lần lặp: {currentCard.repetition}</span>
                <span className="font-mono">Khoảng cách hiện tại: {currentCard.intervalDays} ngày</span>
              </div>
            </div>
          ) : (
            /* MODE 2: Typing Trainer View (Gõ phím kiểm tra chính tả) */
            <div className="min-h-[360px] bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-indigo-600 uppercase tracking-wider">
                  LUYỆN GÕ PHÍM CHÍNH TẢ • {currentCard.category}
                </span>
                <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-mono">
                  Thẻ {currentIndex + 1} / {activeQueue.length}
                </span>
              </div>

              {/* Typing Exercise Body */}
              <div className="my-auto space-y-6 max-w-xl mx-auto w-full text-center">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 mb-2">
                    {currentCard.partOfSpeech}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{currentCard.definitionVi}</h3>
                  <p className="font-mono text-sm text-slate-400 mt-1">{currentCard.phonetic}</p>
                </div>

                {/* Masked sentence with blank */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm font-serif-reading text-slate-800 leading-relaxed">
                  {currentCard.example.replace(
                    new RegExp(currentCard.word, 'gi'),
                    '________'
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleCheckTyping} className="space-y-3">
                  <div className="relative">
                    <input
                      ref={typingInputRef}
                      type="text"
                      id="typing-input-field"
                      autoComplete="off"
                      spellCheck="false"
                      placeholder="Gõ từ tiếng Anh rồi nhấn Enter..."
                      value={typedInput}
                      onChange={(e) => setTypedInput(e.target.value)}
                      className={`w-full px-5 py-3.5 text-center text-lg font-bold rounded-2xl border-2 outline-none transition-all ${
                        typingResult === 'correct'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : typingResult === 'incorrect'
                          ? 'border-rose-500 bg-rose-50 text-rose-900'
                          : 'border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100'
                      }`}
                    />
                  </div>

                  {/* Feedback comparison if incorrect or correct */}
                  {typingResult === 'correct' && (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Chính xác tuyệt đối! Nhấn Enter hoặc nút bên dưới để tính điểm lặp lại.</span>
                    </div>
                  )}

                  {typingResult === 'incorrect' && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs space-y-1">
                      <div className="flex items-center justify-center gap-1 font-bold">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Chưa đúng chính tả:</span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900 font-mono">
                        Từ chuẩn: <span className="text-indigo-600 underline">{currentCard.word}</span>
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Help tip */}
              <div className="text-center text-xs text-slate-400">
                Gõ đúng từng ký tự giúp bạn không bị trừ điểm chính tả trong bài thi IELTS Listening & Writing.
              </div>
            </div>
          )}

          {/* Bottom SRS Rating Buttons (Click OR Keyboard 1, 2, 3, 4) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center justify-between">
              <span>Đánh giá mức độ nhớ (Thuật toán SM-2 Interval):</span>
              <span className="hidden sm:inline text-slate-400">Phím tắt: [ 1 ] Quên • [ 2 ] Khó • [ 3 ] Tốt • [ 4 ] Dễ</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                id="rate-btn-again"
                onClick={() => handleRateCard(1)}
                className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs sm:text-sm border border-rose-200/80 transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span>[ 1 ] Quên (Again)</span>
                <span className="text-[11px] font-normal text-rose-600">Ôn lại sau 10p</span>
              </button>

              <button
                type="button"
                id="rate-btn-hard"
                onClick={() => handleRateCard(2)}
                className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm border border-amber-200/80 transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span>[ 2 ] Khó (Hard)</span>
                <span className="text-[11px] font-normal text-amber-700">Ôn lại sau 12h</span>
              </button>

              <button
                type="button"
                id="rate-btn-good"
                onClick={() => handleRateCard(3)}
                className="py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs sm:text-sm border border-blue-200/80 transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span>[ 3 ] Tốt (Good)</span>
                <span className="text-[11px] font-normal text-blue-700">Ôn sau 1-3 ngày</span>
              </button>

              <button
                type="button"
                id="rate-btn-easy"
                onClick={() => handleRateCard(4)}
                className="py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-200/80 transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span>[ 4 ] Dễ (Easy)</span>
                <span className="text-[11px] font-normal text-emerald-700">Ôn sau 4-6 ngày</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Chúc mừng bạn đã hoàn thành phiên ôn tập!</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Tất cả các từ vựng cần ôn hôm nay đã được lên lịch thành công theo chu kỳ lặp ngắt quãng.
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs hover:bg-indigo-500 transition-colors"
          >
            Tiếp tục ôn tập toàn bộ kho từ
          </button>
        </div>
      )}

      {/* Upload File / Paste Text Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Tải Từ Vựng File .txt hoặc Dán Chữ</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Drag & Drop File Input */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors">
              <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">Kéo thả file .txt của bạn vào đây</p>
              <p className="text-xs text-slate-400 mt-1">Hỗ trợ các file ghi chú từ vựng, tài liệu PDF chuyển sang text</p>
              <label className="mt-3 inline-block px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold cursor-pointer hover:bg-indigo-100 transition-colors">
                Chọn file .txt từ máy tính
                <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Direct Paste Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Hoặc dán trực tiếp danh sách từ (Mỗi từ 1 dòng):
              </label>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Ví dụ định dạng hỗ trợ:
ubiquitous - phổ biến khắp nơi - Smartphones are ubiquitous.
mitigate : giảm nhẹ rủi ro
exacerbate | /ɪɡˈzæs.ə.beɪt/ | làm trầm trọng thêm | Deforestation exacerbates climate change."
                className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Hệ thống tự động nhận diện các dấu phân tách như dấu gạch ngang (-), hai chấm (:), dấu phẩy hoặc tab.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleParsePastedText}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
              >
                Nhập từ vựng vào SRS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
