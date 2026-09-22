import React, { useState, useEffect, useRef } from 'react';
import { VocabCard, VocabDeck, SRSIntervalRating } from '../types';
import { INITIAL_VOCAB_DECKS } from '../data/vocabData';
import { calculateNextSRS, parseVocabText, playPronunciation } from '../utils/srsEngine';
import {
  Upload, FileText, Volume2, CheckCircle2, XCircle,
  RotateCcw, Keyboard, Download, Plus, Check, Trash2,
  HelpCircle, ArrowRight, BookOpen, Layers
} from 'lucide-react';

export const VocabSRSView: React.FC = () => {
  // Load decks from localStorage or initial Cambridge decks
  const [decks, setDecks] = useState<VocabDeck[]>(() => {
    try {
      const saved = localStorage.getItem('ielts_vocab_decks_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_VOCAB_DECKS;
  });

  const [activeDeckId, setActiveDeckId] = useState<string>(decks[0]?.id || 'cambridge12-core');
  const [studyMode, setStudyMode] = useState<'flashcard' | 'typing'>('flashcard');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Typing mode states
  const [typedInput, setTypedInput] = useState<string>('');
  const [typingChecked, setTypingChecked] = useState<boolean>(false);
  const [isTypingCorrect, setIsTypingCorrect] = useState<boolean>(false);
  const typingInputRef = useRef<HTMLInputElement | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadText, setUploadText] = useState<string>('');
  const [newDeckName, setNewDeckName] = useState<string>('');
  const [uploadNotification, setUploadNotification] = useState<string | null>(null);

  // Voice Accent selector
  const [voiceAccent, setVoiceAccent] = useState<'en-GB' | 'en-US'>('en-GB');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ielts_vocab_decks_v2', JSON.stringify(decks));
    } catch {
      // safe fallback
    }
  }, [decks]);

  const currentDeck = decks.find(d => d.id === activeDeckId) || decks[0];
  const cards = currentDeck?.cards || [];
  const currentCard = cards[currentCardIndex] || cards[0];

  // Reset states on card index change
  useEffect(() => {
    if (studyMode === 'typing') {
      setTypedInput('');
      setTypingChecked(false);
      setIsTypingCorrect(false);
      setTimeout(() => {
        typingInputRef.current?.focus();
      }, 100);
    } else {
      setIsFlipped(false);
    }
  }, [currentCardIndex, studyMode, activeDeckId]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (studyMode === 'flashcard') {
        if (e.code === 'Space') {
          e.preventDefault();
          setIsFlipped(prev => !prev);
        } else if (e.key === '1') {
          handleRateCard(1);
        } else if (e.key === '2') {
          handleRateCard(2);
        } else if (e.key === '3') {
          handleRateCard(3);
        } else if (e.key === '4') {
          handleRateCard(4);
        } else if (e.key.toLowerCase() === 'r') {
          if (currentCard) playPronunciation(currentCard.word, voiceAccent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studyMode, isFlipped, currentCard, voiceAccent]);

  // Rate card with SM-2 Spaced Repetition
  const handleRateCard = (rating: SRSIntervalRating) => {
    if (!currentCard) return;

    const updatedCard = calculateNextSRS(currentCard, rating);
    const updatedCards = [...cards];
    updatedCards[currentCardIndex] = updatedCard;

    const updatedDecks = decks.map(d => {
      if (d.id === activeDeckId) {
        return { ...d, cards: updatedCards };
      }
      return d;
    });

    setDecks(updatedDecks);

    // Advance to next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  // Check typed spelling
  const handleCheckTyping = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentCard || !typedInput.trim()) return;

    const targetWord = currentCard.word.trim().toLowerCase();
    const userWord = typedInput.trim().toLowerCase();
    const correct = targetWord === userWord;

    setIsTypingCorrect(correct);
    setTypingChecked(true);

    if (correct) {
      playPronunciation(currentCard.word, voiceAccent);
    }
  };

  const handleNextTypingCard = (rating: SRSIntervalRating = 3) => {
    handleRateCard(rating);
  };

  // Upload custom file / text
  const handleProcessUpload = () => {
    if (!uploadText.trim()) return;

    const parsedCards = parseVocabText(uploadText);
    if (parsedCards.length === 0) {
      setUploadNotification('Không phát hiện từ vựng hợp lệ. Vui lòng kiểm tra lại định dạng.');
      return;
    }

    const deckTitle = newDeckName.trim() || `Bộ từ ${new Date().toLocaleDateString('vi-VN')}`;
    const newDeck: VocabDeck = {
      id: `deck-${Date.now()}`,
      name: deckTitle,
      description: `Nhập từ file cá nhân (${parsedCards.length} từ vựng)`,
      cards: parsedCards
    };

    setDecks([...decks, newDeck]);
    setActiveDeckId(newDeck.id);
    setCurrentCardIndex(0);
    setShowUploadModal(false);
    setUploadText('');
    setNewDeckName('');
    setUploadNotification(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setUploadText(content);
        if (!newDeckName) {
          setNewDeckName(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsText(file);
  };

  // Stats calculation
  const masteredCount = cards.filter(c => c.state === 'mastered').length;
  const learningCount = cards.filter(c => c.state === 'learning' || c.state === 'new').length;
  const reviewCount = cards.filter(c => c.state === 'review').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Deck Switcher Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                LEXICAL RESOURCE • SUPERMEMO SM-2 ENGINE
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">Lặp Ngắt Quãng Chuyên Nghiệp</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Ôn Luyện Từ Vựng Học Thuật & Đề Thi Cambridge 12
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ học Flashcard 2 mặt, gõ chính tả (Typing), phát âm chuẩn bản ngữ và nhập file cá nhân.
            </p>
          </div>

          {/* Action buttons: Upload and Mode toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex items-center border border-slate-300 rounded p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setStudyMode('flashcard')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  studyMode === 'flashcard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flashcard
              </button>
              <button
                onClick={() => setStudyMode('typing')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  studyMode === 'typing'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gõ chính tả (Typing)
              </button>
            </div>

            {/* Upload custom deck button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Nhập File .txt/.csv</span>
            </button>
          </div>
        </div>

        {/* Deck Selector and Stats */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Bộ thẻ:</span>
            <select
              value={activeDeckId}
              onChange={(e) => {
                setActiveDeckId(e.target.value);
                setCurrentCardIndex(0);
              }}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 font-semibold text-slate-800 focus:outline-none focus:border-slate-800 cursor-pointer"
            >
              {decks.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.cards.length} từ)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>Đang học: <strong className="font-mono text-slate-900">{learningCount}</strong></span>
            <span>•</span>
            <span>Cần ôn lại: <strong className="font-mono text-slate-900">{reviewCount}</strong></span>
            <span>•</span>
            <span>Đã làm chủ: <strong className="font-mono text-emerald-700">{masteredCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Flashcard / Typing Workbench */}
      <div className="max-w-2xl mx-auto space-y-4">
        {cards.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-xs text-slate-500 space-y-3">
            <p>Bộ thẻ này hiện chưa có từ vựng nào.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-slate-900 text-white font-bold rounded cursor-pointer"
            >
              Nhập từ vựng ngay
            </button>
          </div>
        ) : studyMode === 'flashcard' ? (
          /* Flashcard View */
          <div className="space-y-4">
            {/* Card Surface */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-8 sm:p-10 shadow-xs cursor-pointer min-h-[300px] flex flex-col justify-between transition-all select-none"
            >
              {/* Card Header: Progress & Audio */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">
                  {currentCardIndex + 1} / {cards.length}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {currentCard?.category || 'Cambridge 12'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentCard) playPronunciation(currentCard.word, voiceAccent);
                    }}
                    title="Phát âm từ này (Phím R)"
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Front or Back Presentation */}
              {!isFlipped ? (
                /* Front side */
                <div className="text-center py-8 space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                    {currentCard?.word}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-slate-500 font-serif-reading text-base">
                    <span>{currentCard?.phonetic}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-xs text-slate-600 font-medium">{currentCard?.partOfSpeech}</span>
                  </div>
                  <p className="text-xs text-slate-400 pt-3">
                    [ Bấm chuột hoặc nhấn <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">Space</kbd> để lật mặt nghĩa ]
                  </p>
                </div>
              ) : (
                /* Back side */
                <div className="text-center py-4 space-y-4 animate-in fade-in">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {currentCard?.word}
                    </h2>
                    <span className="text-xs font-serif-reading text-slate-500">{currentCard?.phonetic}</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 space-y-1">
                    <p className="font-bold text-sm text-slate-900">{currentCard?.definitionVi}</p>
                    <p className="text-slate-600">{currentCard?.definitionEn}</p>
                  </div>

                  {currentCard?.example && (
                    <div className="text-left p-3 rounded bg-slate-50/50 border border-slate-100 text-xs text-slate-700 font-serif-reading">
                      <span className="font-sans font-bold text-slate-500 block text-[11px] mb-0.5">Ví dụ ngữ cảnh Cambridge:</span>
                      <p className="italic">"{currentCard.example}"</p>
                      {currentCard.exampleVi && <p className="text-slate-500 font-sans text-[11px] mt-1">{currentCard.exampleVi}</p>}
                    </div>
                  )}

                  {currentCard?.collocations && currentCard.collocations.length > 0 && (
                    <div className="text-left text-xs">
                      <span className="font-bold text-slate-500 text-[11px] block mb-1">Collocations trọng điểm:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentCard.collocations.map((col, cIdx) => (
                          <span key={cIdx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded font-mono text-[11px]">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Footer State */}
              <div className="text-center text-[11px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
                Chu kỳ: {currentCard?.intervalDays < 1 ? 'Học mới' : `${currentCard?.intervalDays} ngày`} • Trạng thái: {currentCard?.state}
              </div>
            </div>

            {/* SRS Rating Buttons (SM-2 Algorithm) */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleRateCard(1)}
                className="p-2.5 bg-white border border-slate-300 hover:border-slate-800 rounded text-center cursor-pointer transition-all hover:bg-slate-50"
              >
                <span className="block text-xs font-bold text-slate-900">[1] Quên</span>
                <span className="text-[10px] text-slate-400 font-mono">&lt; 10 phút</span>
              </button>

              <button
                onClick={() => handleRateCard(2)}
                className="p-2.5 bg-white border border-slate-300 hover:border-slate-800 rounded text-center cursor-pointer transition-all hover:bg-slate-50"
              >
                <span className="block text-xs font-bold text-slate-900">[2] Khó</span>
                <span className="text-[10px] text-slate-400 font-mono">1 ngày</span>
              </button>

              <button
                onClick={() => handleRateCard(3)}
                className="p-2.5 bg-white border border-slate-300 hover:border-slate-800 rounded text-center cursor-pointer transition-all hover:bg-slate-50"
              >
                <span className="block text-xs font-bold text-slate-900">[3] Nhớ tốt</span>
                <span className="text-[10px] text-slate-400 font-mono">3 ngày</span>
              </button>

              <button
                onClick={() => handleRateCard(4)}
                className="p-2.5 bg-white border border-slate-300 hover:border-slate-800 rounded text-center cursor-pointer transition-all hover:bg-slate-50"
              >
                <span className="block text-xs font-bold text-slate-900">[4] Rất dễ</span>
                <span className="text-[10px] text-slate-400 font-mono">6 ngày</span>
              </button>
            </div>
          </div>
        ) : (
          /* Typing Practice Mode */
          <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-3">
              <span className="font-mono">Từ {currentCardIndex + 1} / {cards.length}</span>
              <button
                type="button"
                onClick={() => currentCard && playPronunciation(currentCard.word, voiceAccent)}
                className="flex items-center gap-1 text-slate-700 hover:text-slate-950 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe phát âm</span>
              </button>
            </div>

            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-slate-500 uppercase">{currentCard?.partOfSpeech}</span>
              <p className="text-lg font-bold text-slate-900">{currentCard?.definitionVi}</p>
              <p className="text-xs text-slate-500 font-serif-reading italic">{currentCard?.definitionEn}</p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleCheckTyping} className="space-y-4">
              <div>
                <input
                  ref={typingInputRef}
                  type="text"
                  value={typedInput}
                  disabled={typingChecked}
                  onChange={(e) => setTypedInput(e.target.value)}
                  placeholder="Gõ từ tiếng Anh tương ứng..."
                  className={`w-full p-3 text-center text-lg font-mono rounded border transition-all focus:outline-none ${
                    typingChecked
                      ? isTypingCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-rose-50 border-rose-400 text-rose-900 line-through'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                  autoFocus
                />
              </div>

              {!typingChecked ? (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Kiểm tra chính tả (Enter)
                </button>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <div className="p-3 rounded bg-slate-50 border border-slate-200 text-center text-xs space-y-1">
                    <span className="text-slate-500">Từ chính xác:</span>
                    <p className="text-base font-mono font-bold text-slate-900">{currentCard?.word}</p>
                    <p className="text-slate-600 font-serif-reading">{currentCard?.phonetic}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleNextTypingCard(isTypingCorrect ? 3 : 1)}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded cursor-pointer"
                    >
                      Tiếp tục từ tiếp theo (Space / Enter)
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Keyboard Shortcuts Hint Bar */}
        <div className="p-3 bg-slate-100 border border-slate-200 rounded text-center text-[11px] text-slate-600 font-mono">
          Phím tắt: <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-900">Space</kbd> Lật thẻ • <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-900">1-4</kbd> Đánh giá nhớ • <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-900">R</kbd> Phát âm
        </div>
      </div>

      {/* Upload Custom Deck Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">
                Nhập danh sách từ vựng cá nhân
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {uploadNotification && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs">
                {uploadNotification}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên bộ thẻ:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Từ vựng Reading Cam 12 Test 5"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn file từ máy (.txt, .csv):</label>
                <input
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hoặc dán trực tiếp nội dung:</label>
                <textarea
                  rows={6}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder={`Định dạng hỗ trợ:\nword - definitionVi - example\nhoặc: word : definitionVi\nVí dụ:\nmitigate - giảm thiểu tác hại - We must mitigate climate risks.\ncurb - hạn chế, kiềm chế - Strict laws curb traffic violations.`}
                  className="w-full p-2 font-mono text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleProcessUpload}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded cursor-pointer transition-colors"
              >
                Tạo bộ thẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
