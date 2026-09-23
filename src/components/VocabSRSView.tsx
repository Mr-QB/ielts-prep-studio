import React, { useState, useEffect, useRef } from 'react';
import { VocabCard, VocabDeck, SRSIntervalRating, ParsePreviewResult } from '../types';
import { INITIAL_VOCAB_DECKS } from '../data/vocabData';
import {
  calculateNextSRS,
  previewNextInterval,
  parseVocabText,
  analyzeVocabImport,
  playPronunciation
} from '../utils/srsEngine';
import { loadDecksFromStorage, saveDecksToStorage } from '../utils/db';
import {
  Upload, Download, Volume2, Check, X, RotateCcw, Plus, Trash2, Edit3,
  Layers, AlertCircle, FileText
} from 'lucide-react';

export const VocabSRSView: React.FC = () => {
  const [decks, setDecks] = useState<VocabDeck[]>(INITIAL_VOCAB_DECKS);
  const [activeDeckId, setActiveDeckId] = useState<string>(INITIAL_VOCAB_DECKS[0]?.id || 'starter-academic-core');
  const [studyMode, setStudyMode] = useState<'flashcard' | 'typing'>('flashcard');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [voiceAccent, setVoiceAccent] = useState<'en-GB' | 'en-US'>('en-GB');

  // Typing Mode States
  const [typedInput, setTypedInput] = useState<string>('');
  const [typingChecked, setTypingChecked] = useState<boolean>(false);
  const [isTypingCorrect, setIsTypingCorrect] = useState<boolean>(false);
  const typingInputRef = useRef<HTMLInputElement | null>(null);

  // Deck Management States
  const [isCreatingDeck, setIsCreatingDeck] = useState<boolean>(false);
  const [newDeckTitle, setNewDeckTitle] = useState<string>('');
  const [newDeckDesc, setNewDeckDesc] = useState<string>('');

  // Import TXT/CSV Modal & Preview States
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');
  const [importDeckName, setImportDeckName] = useState<string>('');
  const [importAnalysis, setImportAnalysis] = useState<ParsePreviewResult | null>(null);
  const [duplicateHandling, setDuplicateHandling] = useState<'skip' | 'replace' | 'keep-both'>('skip');

  // Load from IndexedDB on mount
  useEffect(() => {
    loadDecksFromStorage(INITIAL_VOCAB_DECKS).then(loaded => {
      if (loaded && loaded.length > 0) {
        setDecks(loaded);
        setActiveDeckId(loaded[0].id);
      }
    });
  }, []);

  // Save to IndexedDB whenever decks change
  const updateDecks = (newDecks: VocabDeck[]) => {
    setDecks(newDecks);
    saveDecksToStorage(newDecks);
  };

  const currentDeck = decks.find(d => d.id === activeDeckId) || decks[0] || INITIAL_VOCAB_DECKS[0];
  const cards = currentDeck?.cards || [];
  const currentCard = cards[currentCardIndex] || cards[0];

  // Auto-focus input in typing mode
  useEffect(() => {
    if (studyMode === 'typing') {
      setTypedInput('');
      setTypingChecked(false);
      setIsTypingCorrect(false);
      setTimeout(() => {
        typingInputRef.current?.focus();
      }, 50);
    } else {
      setIsFlipped(false);
    }
  }, [currentCardIndex, studyMode, activeDeckId]);

  // Analyze import text as user types or pastes
  useEffect(() => {
    if (!showImportModal || !importText.trim()) {
      setImportAnalysis(null);
      return;
    }
    const existingWords = new Set(cards.map(c => c.word.toLowerCase()));
    const analysis = analyzeVocabImport(importText, existingWords, importDeckName || 'Uploaded Deck');
    setImportAnalysis(analysis);
  }, [importText, showImportModal, importDeckName, cards]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // Global typing mode check
      if (studyMode === 'typing') {
        if (e.key === 'Enter') {
          if (!typingChecked) {
            e.preventDefault();
            handleCheckTyping();
          } else {
            e.preventDefault();
            handleRateCard(isTypingCorrect ? 3 : 1);
          }
        }
        return;
      }

      // Flashcard mode shortcuts (only when not typing in any inputs)
      if (studyMode === 'flashcard' && !isInput) {
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
        } else if (e.key === 'ArrowRight') {
          advanceNextCard();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studyMode, isFlipped, currentCard, voiceAccent, typingChecked, isTypingCorrect, typedInput]);

  const advanceNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

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

    updateDecks(updatedDecks);
    advanceNextCard();
  };

  const handleCheckTyping = () => {
    if (!currentCard || !typedInput.trim()) return;

    const target = currentCard.word.trim().toLowerCase();
    const typed = typedInput.trim().toLowerCase();
    const correct = target === typed;

    setIsTypingCorrect(correct);
    setTypingChecked(true);

    if (correct) {
      playPronunciation(currentCard.word, voiceAccent);
    }
  };

  // Import TXT/CSV handler
  const handleExecuteImport = () => {
    if (!importAnalysis || importAnalysis.parsed.length === 0) return;

    let finalNewCards = [...importAnalysis.parsed];
    const targetDeckName = importDeckName.trim() || `Bộ Từ Mới (${new Date().toLocaleDateString('vi-VN')})`;

    const existingMap = new Map(cards.map(c => [c.word.toLowerCase(), c]));

    if (duplicateHandling === 'skip') {
      finalNewCards = finalNewCards.filter(c => !existingMap.has(c.word.toLowerCase()));
    }

    const newDeck: VocabDeck = {
      id: `deck-${Date.now()}`,
      name: targetDeckName,
      description: `Nhập từ file TXT (${finalNewCards.length} thẻ từ)`,
      createdAt: new Date().toISOString(),
      source: 'User TXT Import',
      cards: finalNewCards
    };

    const nextDecks = [...decks, newDeck];
    updateDecks(nextDecks);
    setActiveDeckId(newDeck.id);
    setCurrentCardIndex(0);
    setShowImportModal(false);
    setImportText('');
    setImportDeckName('');
    setImportAnalysis(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
        if (!importDeckName) {
          setImportDeckName(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsText(file);
  };

  // Export deck as JSON (Preserves full SRS state)
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentDeck, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${currentDeck.name.replace(/\s+/g, '_')}_srs.json`;
    a.click();
  };

  // Export deck as TXT (word - vi - example)
  const handleExportTXT = () => {
    const lines = currentDeck.cards.map(c => `${c.word} | ${c.phonetic} | ${c.definitionVi} | ${c.example}`);
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${currentDeck.name.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  const handleDeleteDeck = (deckId: string) => {
    if (decks.length <= 1) return;
    const remaining = decks.filter(d => d.id !== deckId);
    updateDecks(remaining);
    setActiveDeckId(remaining[0].id);
    setCurrentCardIndex(0);
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    const newDeck: VocabDeck = {
      id: `deck-${Date.now()}`,
      name: newDeckTitle.trim(),
      description: newDeckDesc.trim() || 'Bộ từ tự tạo',
      createdAt: new Date().toISOString(),
      source: 'User Deck',
      cards: []
    };

    updateDecks([...decks, newDeck]);
    setActiveDeckId(newDeck.id);
    setNewDeckTitle('');
    setNewDeckDesc('');
    setIsCreatingDeck(false);
  };

  // Stats
  const now = new Date();
  const dueCount = cards.filter(c => !c.dueDate || new Date(c.dueDate) <= now).length;
  const masteredCount = cards.filter(c => c.state === 'mastered').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Deck Switcher Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                LEXICAL RESOURCE • SUPERMEMO SM-2 ENGINE
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">Lặp Ngắt Quãng Keyboard-First</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Ôn Luyện Từ Vựng Học Thuật Academic
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mode Toggle: Flashcard vs Typing */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded text-xs">
              <button
                type="button"
                onClick={() => setStudyMode('flashcard')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer transition-colors ${
                  studyMode === 'flashcard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flashcard (Phím 1-4, Space)
              </button>
              <button
                type="button"
                onClick={() => setStudyMode('typing')}
                className={`px-3 py-1 rounded font-semibold cursor-pointer transition-colors ${
                  studyMode === 'typing'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gõ Chính Tả (Typing)
              </button>
            </div>

            {/* Import TXT button */}
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Nhập File .txt</span>
            </button>

            {/* Export Deck */}
            <button
              type="button"
              onClick={handleExportJSON}
              title="Xuất file JSON (Bảo toàn tiến độ SRS)"
              className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất JSON</span>
            </button>
          </div>
        </div>

        {/* Deck List & Creator */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Bộ từ:</span>
            {decks.map(deck => {
              const isSelected = deck.id === activeDeckId;
              return (
                <button
                  key={deck.id}
                  type="button"
                  onClick={() => {
                    setActiveDeckId(deck.id);
                    setCurrentCardIndex(0);
                  }}
                  className={`px-3 py-1 rounded text-xs cursor-pointer border transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{deck.name}</span>
                  <span className="ml-1.5 text-[10px] font-mono opacity-80">({deck.cards.length})</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsCreatingDeck(prev => !prev)}
              className="p-1 rounded text-slate-500 hover:text-slate-800 border border-dashed border-slate-300 hover:border-slate-500 cursor-pointer"
              title="Tạo bộ từ mới"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span>Cần ôn: <strong className="text-slate-900">{dueCount}</strong></span>
            <span>•</span>
            <span>Thuộc lòng: <strong className="text-slate-900">{masteredCount}</strong></span>
            {decks.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteDeck(activeDeckId)}
                title="Xóa bộ từ hiện tại"
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer ml-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Create Deck Inline Form */}
        {isCreatingDeck && (
          <form onSubmit={handleCreateDeck} className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-wrap items-center gap-2 text-xs">
            <input
              type="text"
              value={newDeckTitle}
              onChange={(e) => setNewDeckTitle(e.target.value)}
              placeholder="Tên bộ từ mới..."
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800"
            />
            <input
              type="text"
              value={newDeckDesc}
              onChange={(e) => setNewDeckDesc(e.target.value)}
              placeholder="Mô tả bộ từ..."
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 flex-1 min-w-[200px]"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-slate-900 text-white rounded font-medium cursor-pointer"
            >
              Lưu Deck
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingDeck(false)}
              className="px-2 py-1 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Hủy
            </button>
          </form>
        )}
      </div>

      {/* Main Flashcard / Typing Viewport */}
      {cards.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-3">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">Bộ từ này hiện chưa có thẻ nào.</p>
          <p className="text-xs text-slate-500">Bấm nút "Nhập File .txt" phía trên để nạp từ vựng vào.</p>
        </div>
      ) : studyMode === 'flashcard' ? (
        /* Flashcard Mode */
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Viewport */}
          <div
            onClick={() => setIsFlipped(prev => !prev)}
            tabIndex={0}
            role="button"
            aria-label="Thẻ từ vựng. Bấm phím Space hoặc click để lật mặt sau."
            className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-8 min-h-[300px] flex flex-col justify-between cursor-pointer transition-all shadow-xs select-none"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-3">
              <span className="font-mono">Từ {currentCardIndex + 1} / {cards.length}</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-[11px] font-mono">
                {currentCard?.category}
              </span>
            </div>

            {/* Front & Back Content */}
            <div className="text-center my-6 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentCard?.word}
                </h2>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentCard) playPronunciation(currentCard.word, voiceAccent);
                  }}
                  title="Phát âm (Phím R)"
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 font-mono text-xs text-slate-500">
                <span>{currentCard?.phonetic}</span>
                <span>•</span>
                <span className="uppercase text-[11px]">{currentCard?.partOfSpeech}</span>
              </div>

              {!isFlipped ? (
                <p className="text-xs text-slate-400 font-mono pt-4">
                  (Bấm [Space] hoặc click vào thẻ để xem nghĩa & ví dụ)
                </p>
              ) : (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-left space-y-1">
                    <p className="font-bold text-sm text-slate-900">{currentCard?.definitionVi}</p>
                    {currentCard?.definitionEn && (
                      <p className="text-xs text-slate-600">{currentCard?.definitionEn}</p>
                    )}
                  </div>

                  {currentCard?.example && (
                    <div className="text-left p-3 rounded bg-slate-50/50 border border-slate-100 text-xs font-serif-reading text-slate-700">
                      <span className="font-sans font-bold text-slate-500 block text-[11px] mb-0.5">Ví dụ ngữ cảnh IELTS:</span>
                      <p className="italic">"{currentCard.example}"</p>
                      {currentCard.exampleVi && (
                        <p className="text-slate-500 font-sans text-[11px] mt-1">{currentCard.exampleVi}</p>
                      )}
                    </div>
                  )}

                  {currentCard?.collocations && currentCard.collocations.length > 0 && (
                    <div className="text-left text-xs">
                      <span className="font-bold text-slate-500 text-[11px] block mb-1">Collocations trọng điểm:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentCard.collocations.map((col, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded font-mono text-[11px]">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer State */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3 font-mono">
              <span>Chu kỳ: {currentCard?.intervalDays < 1 ? 'Học mới' : `${currentCard?.intervalDays} ngày`}</span>
              <span className="capitalize">Trạng thái: {currentCard?.state}</span>
            </div>
          </div>

          {/* Dynamic SRS Rating Buttons (Interval dynamically computed via previewNextInterval) */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleRateCard(1)}
              className="p-3 bg-white border border-slate-300 hover:border-slate-800 rounded-lg text-center cursor-pointer transition-all hover:bg-slate-50 shadow-xs"
            >
              <span className="block text-xs font-bold text-slate-900">[1] Quên</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {currentCard ? previewNextInterval(currentCard, 1) : '< 10m'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleRateCard(2)}
              className="p-3 bg-white border border-slate-300 hover:border-slate-800 rounded-lg text-center cursor-pointer transition-all hover:bg-slate-50 shadow-xs"
            >
              <span className="block text-xs font-bold text-slate-900">[2] Khó</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {currentCard ? previewNextInterval(currentCard, 2) : '12h'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleRateCard(3)}
              className="p-3 bg-white border border-slate-300 hover:border-slate-800 rounded-lg text-center cursor-pointer transition-all hover:bg-slate-50 shadow-xs"
            >
              <span className="block text-xs font-bold text-slate-900">[3] Tốt</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {currentCard ? previewNextInterval(currentCard, 3) : '1d'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleRateCard(4)}
              className="p-3 bg-white border border-slate-300 hover:border-slate-800 rounded-lg text-center cursor-pointer transition-all hover:bg-slate-50 shadow-xs"
            >
              <span className="block text-xs font-bold text-slate-900">[4] Rất Dễ</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {currentCard ? previewNextInterval(currentCard, 4) : '3d'}
              </span>
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400 font-mono">
            Phím tắt: [Space] Lật thẻ • [1-4] Đánh giá • [R] Phát âm • [→] Chuyển tiếp
          </div>
        </div>
      ) : (
        /* Typing Mode */
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6">
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
            <span className="text-[11px] font-mono text-slate-400 uppercase">{currentCard?.partOfSpeech}</span>
            <p className="text-xl font-bold text-slate-900">{currentCard?.definitionVi}</p>
            {currentCard?.definitionEn && (
              <p className="text-xs text-slate-500 italic">{currentCard?.definitionEn}</p>
            )}
          </div>

          {/* Typing Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleCheckTyping(); }} className="space-y-4">
            <div>
              <input
                ref={typingInputRef}
                type="text"
                value={typedInput}
                disabled={typingChecked}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Gõ từ tiếng Anh tương ứng và nhấn Enter..."
                className="w-full bg-white border border-slate-300 rounded px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-blue-600"
              />
            </div>

            {!typingChecked ? (
              <button
                type="submit"
                disabled={!typedInput.trim()}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Kiểm Tra Chính Tả [Enter]
              </button>
            ) : (
              <div className="space-y-3">
                <div className={`p-4 rounded border text-xs ${
                  isTypingCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {isTypingCorrect ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                    <span>{isTypingCorrect ? 'Chính xác!' : 'Chưa đúng chính tả'}</span>
                  </div>
                  <p>Từ chuẩn: <strong className="font-mono text-sm">{currentCard.word}</strong> <span className="font-mono text-slate-500">({currentCard.phonetic})</span></p>
                  {currentCard.example && (
                    <p className="italic mt-1 text-slate-700">"{currentCard.example}"</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRateCard(isTypingCorrect ? 3 : 1)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Tiếp Tục [Enter hoặc Space]
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Import TXT/CSV Modal with 10-Card Preview */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Nhập Từ Vựng Từ File .txt / .csv</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hỗ trợ định dạng: <code>word | IPA | nghĩa | ví dụ</code> hoặc <code>word - nghĩa</code> hoặc Tab/CSV.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input name and file picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên bộ từ:</label>
                <input
                  type="text"
                  value={importDeckName}
                  onChange={(e) => setImportDeckName(e.target.value)}
                  placeholder="Ví dụ: Unit 1 Academic Words"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn file từ máy tính:</label>
                <input
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Textarea Paste */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hoặc dán nội dung văn bản:</label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={6}
                placeholder="mitigate - làm giảm bớt tác hại - Renewable energy mitigates carbon emissions&#10;proliferation | /prəˌlɪf.əˈreɪ.ʃən/ | sự tăng nhanh | Rapid proliferation of smartphones..."
                className="w-full bg-white border border-slate-300 rounded p-3 text-xs font-mono text-slate-800 focus:border-blue-600"
              />
            </div>

            {/* Import Preview Table & Duplicate Handling */}
            {importAnalysis && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span>Đã nhận diện: <strong className="text-emerald-700 font-mono">{importAnalysis.parsed.length}</strong> từ</span>
                    {importAnalysis.duplicateCount > 0 && (
                      <span>Trùng lặp: <strong className="text-amber-700 font-mono">{importAnalysis.duplicateCount}</strong></span>
                    )}
                    {importAnalysis.invalidLinesCount > 0 && (
                      <span className="text-slate-400">Dòng trống/bỏ qua: {importAnalysis.invalidLinesCount}</span>
                    )}
                  </div>

                  {/* Duplicate Choice */}
                  {importAnalysis.duplicateCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span>Xử lý trùng:</span>
                      <select
                        value={duplicateHandling}
                        onChange={(e) => setDuplicateHandling(e.target.value as any)}
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-xs cursor-pointer"
                      >
                        <option value="skip">Bỏ qua từ trùng (Skip)</option>
                        <option value="replace">Ghi đè (Replace)</option>
                        <option value="keep-both">Giữ cả hai (Keep both)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 10 Preview Cards Table */}
                <div className="border border-slate-200 rounded max-h-40 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="p-2">Từ vựng</th>
                        <th className="p-2">Phiên âm</th>
                        <th className="p-2">Nghĩa tiếng Việt</th>
                        <th className="p-2">Ví dụ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {importAnalysis.previewCards.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900">{c.word}</td>
                          <td className="p-2 text-slate-500">{c.phonetic}</td>
                          <td className="p-2 text-slate-800">{c.definitionVi}</td>
                          <td className="p-2 text-slate-600 truncate max-w-xs">{c.example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={!importAnalysis || importAnalysis.parsed.length === 0}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
              >
                Xác Nhận Tạo Bộ Từ ({importAnalysis?.parsed.length || 0} từ)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
