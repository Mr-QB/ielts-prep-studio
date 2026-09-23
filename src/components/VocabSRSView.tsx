import React, { useState, useEffect, useRef } from 'react';
import { VocabCard, VocabDeck, SRSIntervalRating, ParsePreviewResult } from '../types';
import { INITIAL_VOCAB_DECKS, TOPIC_VOCABULARIES, PARAPHRASE_BANK, TopicVocabulary } from '../data/vocabData';
import {
  calculateNextSRS,
  previewNextInterval,
  parseVocabText,
  analyzeVocabImport,
  playPronunciation
} from '../utils/srsEngine';
import { loadDecksFromStorage, saveDecksToStorage } from '../utils/db';

export const VocabSRSView: React.FC = () => {
  // 3 Primary Tabs
  const [activeTab, setActiveTab] = useState<'spaced-review' | 'topic-vocab' | 'paraphrase-bank'>('spaced-review');

  // Decks state
  const [decks, setDecks] = useState<VocabDeck[]>(INITIAL_VOCAB_DECKS);
  // Default to the first deck (Core 4.0 -> 5.5)
  const [activeDeckId, setActiveDeckId] = useState<string>(INITIAL_VOCAB_DECKS[0]?.id || 'starter-core-foundation');
  const [studyMode, setStudyMode] = useState<'flashcard' | 'typing'>('flashcard');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [voiceAccent, setVoiceAccent] = useState<'en-GB' | 'en-US'>('en-GB');

  // Paraphrase bank search and category filter
  const [paraphraseSearch, setParaphraseSearch] = useState<string>('');
  const [paraphraseCategory, setParaphraseCategory] = useState<string>('all');

  // Topic vocabulary selected topic
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPIC_VOCABULARIES[0].id);

  // Typing Mode States
  const [typedInput, setTypedInput] = useState<string>('');
  const [typingChecked, setTypingChecked] = useState<boolean>(false);
  const [isTypingCorrect, setIsTypingCorrect] = useState<boolean>(false);
  const typingInputRef = useRef<HTMLInputElement | null>(null);

  // Import TXT/CSV Modal & Preview States
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');
  const [importDeckName, setImportDeckName] = useState<string>('');
  const [importAnalysis, setImportAnalysis] = useState<ParsePreviewResult | null>(null);

  // Add Card Modal
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [newCardWord, setNewCardWord] = useState<string>('');
  const [newCardDefVi, setNewCardDefVi] = useState<string>('');
  const [newCardExample, setNewCardExample] = useState<string>('');

  // Load from storage on mount
  useEffect(() => {
    loadDecksFromStorage(INITIAL_VOCAB_DECKS).then(loaded => {
      if (loaded && loaded.length > 0) {
        setDecks(loaded);
        if (!loaded.some(d => d.id === activeDeckId)) {
          setActiveDeckId(loaded[0].id);
        }
      }
    });
  }, []);

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

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

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

      if (studyMode === 'flashcard' && !isInput && activeTab === 'spaced-review') {
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
  }, [studyMode, isFlipped, currentCard, voiceAccent, typingChecked, isTypingCorrect, typedInput, activeTab]);

  const advanceNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handleRateCard = (rating: SRSIntervalRating) => {
    if (!currentCard) return;

    const nextCardState = calculateNextSRS(currentCard, rating);
    const updatedCards = cards.map(c => (c.id === currentCard.id ? nextCardState : c));
    const updatedDecks = decks.map(d => (d.id === currentDeck.id ? { ...d, cards: updatedCards } : d));

    updateDecks(updatedDecks);
    advanceNextCard();
  };

  const handleCheckTyping = () => {
    if (!currentCard) return;
    const isMatch = typedInput.trim().toLowerCase() === currentCard.word.trim().toLowerCase();
    setIsTypingCorrect(isMatch);
    setTypingChecked(true);
  };

  // Add new card
  const handleAddNewCard = () => {
    if (!newCardWord.trim() || !newCardDefVi.trim()) return;

    const newCard: VocabCard = {
      id: `custom-card-${Date.now()}`,
      word: newCardWord.trim(),
      phonetic: '',
      partOfSpeech: 'noun',
      category: 'General',
      definitionVi: newCardDefVi.trim(),
      definitionEn: '',
      example: newCardExample.trim(),
      repetition: 0,
      intervalDays: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
      state: 'new'
    };

    const updatedDecks = decks.map(d => {
      if (d.id === currentDeck.id) {
        return { ...d, cards: [newCard, ...d.cards] };
      }
      return d;
    });

    updateDecks(updatedDecks);
    setShowAddCardModal(false);
    setNewCardWord('');
    setNewCardDefVi('');
    setNewCardExample('');
  };

  // Filter paraphrase bank
  const filteredParaphrases = PARAPHRASE_BANK.filter(item => {
    const matchesCategory = paraphraseCategory === 'all' || item.category === paraphraseCategory;
    const matchesSearch = !paraphraseSearch.trim() ||
      item.word.toLowerCase().includes(paraphraseSearch.toLowerCase()) ||
      item.meaningVi.toLowerCase().includes(paraphraseSearch.toLowerCase()) ||
      item.synonyms.some(s => s.word.toLowerCase().includes(paraphraseSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header & 3 Primary Sub-tabs */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              Sổ tay từ vựng & Paraphrase • Lộ trình Band 4.0 → 6.5
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Từ Vựng & Ngân Hàng Paraphrase
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Học ngắt quãng (Spaced Repetition) với bộ từ cốt lõi, nắm từ vựng theo 5 chủ đề lớn và tra cứu nhanh các cặp paraphrase chuẩn IELTS.
            </p>
          </div>

          {/* 3 Main Tabs Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('spaced-review')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'spaced-review'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Sổ tay ôn tập
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('topic-vocab')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'topic-vocab'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Chủ đề IELTS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paraphrase-bank')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'paraphrase-bank'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Ngân hàng Paraphrase
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SỔ TAY ÔN TẬP (SPACED REPETITION REVIEW - DEFAULT)                      */}
      {/* ========================================================================= */}
      {activeTab === 'spaced-review' && (
        <div className="space-y-6">
          {/* Deck Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Bộ thẻ:</span>
              <select
                value={activeDeckId}
                onChange={(e) => {
                  setActiveDeckId(e.target.value);
                  setCurrentCardIndex(0);
                }}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-hidden"
              >
                {decks.map(deck => (
                  <option key={deck.id} value={deck.id}>
                    {deck.name} ({deck.cards.length} từ)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {/* Study Mode Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setStudyMode('flashcard')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    studyMode === 'flashcard' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Thẻ lật (Flashcard)
                </button>
                <button
                  type="button"
                  onClick={() => setStudyMode('typing')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    studyMode === 'typing' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Gõ từ (Spelling)
                </button>
              </div>

              {/* Accent Voice Switcher */}
              <button
                type="button"
                onClick={() => setVoiceAccent(prev => prev === 'en-GB' ? 'en-US' : 'en-GB')}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-700 cursor-pointer"
              >
                Giọng: {voiceAccent}
              </button>

              {/* Add Custom Card */}
              <button
                type="button"
                onClick={() => setShowAddCardModal(true)}
                className="px-2.5 py-1 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer hover:bg-slate-800"
              >
                + Thêm từ
              </button>
            </div>
          </div>

          {/* Flashcard / Typing Card Container */}
          {cards.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs max-w-2xl mx-auto space-y-6">
              {/* Card Header & Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-700 font-semibold">
                    Thẻ {currentCardIndex + 1} / {cards.length}
                  </span>
                  {currentCard?.partOfSpeech && (
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700">
                      {currentCard.partOfSpeech}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  Phím tắt: Space để lật • 1..4 để đánh giá • R để phát âm
                </div>
              </div>

              {/* FLASHCARD MODE */}
              {studyMode === 'flashcard' && (
                <div className="space-y-6 text-center py-4">
                  {/* Word & Pronunciation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {currentCard.word}
                      </h2>
                      <button
                        type="button"
                        onClick={() => playPronunciation(currentCard.word, voiceAccent)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-mono cursor-pointer"
                        title="Phát âm"
                      >
                        🔊 Nghe
                      </button>
                    </div>
                    {currentCard.phonetic && (
                      <div className="text-slate-500 font-mono text-sm">
                        {currentCard.phonetic}
                      </div>
                    )}
                  </div>

                  {/* Flipped Content */}
                  {!isFlipped ? (
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => setIsFlipped(true)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold text-slate-800 cursor-pointer"
                      >
                        Hiện nghĩa & Ví dụ (Phím Space)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                      {/* Vietnamese Definition */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                        <div className="text-xs text-slate-400 font-medium">Định nghĩa tiếng Việt:</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">
                          {currentCard.definitionVi}
                        </div>
                      </div>

                      {/* English Definition if available */}
                      {currentCard.definitionEn && (
                        <div className="text-xs text-slate-600">
                          <strong className="text-slate-700">English:</strong> {currentCard.definitionEn}
                        </div>
                      )}

                      {/* Example Sentence */}
                      {currentCard.example && (
                        <div className="p-3 bg-blue-50/50 border border-blue-100 rounded text-xs space-y-1">
                          <div className="text-blue-900 font-serif italic text-sm">
                            "{currentCard.example}"
                          </div>
                          {currentCard.exampleVi && (
                            <div className="text-slate-600 text-[11px]">
                              {currentCard.exampleVi}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Collocations */}
                      {currentCard.collocations && currentCard.collocations.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-700 uppercase font-mono">
                            Cụm từ đi kèm (Collocations):
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {currentCard.collocations.map((col, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-xs">
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4 Spaced Repetition Rating Buttons */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleRateCard(1)}
                        className="p-2.5 rounded border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-900 text-center cursor-pointer"
                      >
                        <div className="font-bold">1. Học lại</div>
                        <div className="text-[10px] text-rose-700 mt-0.5">+1 ngày</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRateCard(2)}
                        className="p-2.5 rounded border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-center cursor-pointer"
                      >
                        <div className="font-bold">2. Khó</div>
                        <div className="text-[10px] text-amber-700 mt-0.5">+3 ngày</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRateCard(3)}
                        className="p-2.5 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 text-center cursor-pointer"
                      >
                        <div className="font-bold">3. Nhớ</div>
                        <div className="text-[10px] text-blue-700 mt-0.5">+7 ngày</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRateCard(4)}
                        className="p-2.5 rounded border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-center cursor-pointer"
                      >
                        <div className="font-bold">4. Dễ</div>
                        <div className="text-[10px] text-emerald-700 mt-0.5">+14 ngày</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TYPING MODE */}
              {studyMode === 'typing' && (
                <div className="space-y-5 text-center py-4">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-500">Nghĩa tiếng Việt:</div>
                    <div className="text-xl font-bold text-slate-900">
                      {currentCard.definitionVi}
                    </div>
                  </div>

                  {currentCard.example && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 italic">
                      "{currentCard.example.replace(new RegExp(currentCard.word, 'gi'), '_____')}"
                    </div>
                  )}

                  <div className="space-y-3 max-w-md mx-auto">
                    <input
                      ref={typingInputRef}
                      type="text"
                      value={typedInput}
                      onChange={(e) => setTypedInput(e.target.value)}
                      placeholder="Gõ từ tiếng Anh vào đây..."
                      disabled={typingChecked}
                      className="w-full px-4 py-2 border border-slate-300 rounded text-center text-lg font-bold text-slate-900 focus:outline-hidden focus:border-slate-900"
                    />

                    {!typingChecked ? (
                      <button
                        type="button"
                        onClick={handleCheckTyping}
                        disabled={!typedInput.trim()}
                        className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer disabled:opacity-40"
                      >
                        Kiểm tra chính tả (Enter)
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className={`p-3 rounded border text-xs ${
                          isTypingCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                        }`}>
                          <div className="font-bold text-sm">
                            {isTypingCorrect ? '✓ Đúng chính tả!' : `✗ Chưa chính xác. Từ đúng: ${currentCard.word}`}
                          </div>
                          {currentCard.phonetic && (
                            <div className="font-mono text-slate-600 mt-1">{currentCard.phonetic}</div>
                          )}
                        </div>

                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRateCard(isTypingCorrect ? 3 : 1)}
                            className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Tiếp tục thẻ sau (Enter)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2">
              <div className="text-slate-500 text-sm">Bộ thẻ này hiện chưa có từ vựng.</div>
              <button
                type="button"
                onClick={() => setShowAddCardModal(true)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer"
              >
                + Thêm từ vựng đầu tiên
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CHỦ ĐỀ IELTS (TOPIC VOCABULARY VIEW)                                    */}
      {/* ========================================================================= */}
      {activeTab === 'topic-vocab' && (
        <div className="space-y-6">
          {/* 5 Topic Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {TOPIC_VOCABULARIES.map((topic: TopicVocabulary) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                className={`px-3 py-2 rounded text-xs text-left shrink-0 border cursor-pointer ${
                  selectedTopicId === topic.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>{topic.nameVi}</div>
                <div className="text-[11px] opacity-75">{topic.name}</div>
              </button>
            ))}
          </div>

          {/* Active Topic Content */}
          {(() => {
            const topic: TopicVocabulary = TOPIC_VOCABULARIES.find((t: TopicVocabulary) => t.id === selectedTopicId) || TOPIC_VOCABULARIES[0];
            return (
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <span className="font-mono text-xs text-slate-500 uppercase">CHỦ ĐỀ IELTS TRỌNG ĐIỂM</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {topic.nameVi} ({topic.name})
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 italic font-serif">
                    Ví dụ câu tiêu biểu: "{topic.exampleSentence}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Core Nouns */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Danh từ cốt lõi (Core Nouns)
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {topic.coreWords.map((w: string) => (
                        <span key={w} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-medium text-slate-800">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Useful Verbs */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Động từ tác động mạnh (Action Verbs)
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {topic.usefulVerbs.map((v: string) => (
                        <span key={v} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-medium text-blue-900">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Collocations */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Cụm từ tự nhiên (Academic Collocations)
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {topic.collocations.map((c: string) => (
                        <span key={c} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Paraphrase in this topic */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Cặp Paraphrase hay gặp
                    </h3>
                    <div className="space-y-2 text-xs">
                      {topic.paraphrases.map((p: { word: string; alternatives: string[] }, idx: number) => (
                        <div key={idx} className="p-2 bg-white rounded border border-slate-200">
                          <span className="font-bold text-slate-900">"{p.word}"</span>
                          <span className="text-slate-500"> → </span>
                          <span className="text-emerald-800 font-medium">{p.alternatives.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. NGÂN HÀNG PARAPHRASE (PARAPHRASE BANK VIEW)                             */}
      {/* ========================================================================= */}
      {activeTab === 'paraphrase-bank' && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={paraphraseSearch}
                onChange={(e) => setParaphraseSearch(e.target.value)}
                placeholder="Tìm từ gốc, nghĩa tiếng Việt, hoặc từ đồng nghĩa..."
                className="w-full max-w-md px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-hidden"
              />

              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'trend', label: 'Xu hướng (Trend)' },
                  { id: 'importance', label: 'Tầm quan trọng' },
                  { id: 'cause-effect', label: 'Nguyên nhân - Hệ quả' },
                  { id: 'problem-solution', label: 'Vấn đề & Giải pháp' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setParaphraseCategory(cat.id)}
                    className={`px-2.5 py-1 rounded text-xs whitespace-nowrap cursor-pointer border ${
                      paraphraseCategory === cat.id
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Paraphrase Cards List */}
          <div className="space-y-4">
            {filteredParaphrases.map(item => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 font-mono">
                      "{item.word}"
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      ({item.meaningVi})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {item.synonyms.map((syn, sIdx) => (
                    <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900 font-mono text-sm">
                          {syn.word}
                        </span>
                        <span className="text-[11px] text-slate-500 italic">{syn.nuance}</span>
                      </div>
                      <p className="font-serif text-slate-700 italic pt-1 text-[11px]">
                        "{syn.example}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg space-y-4">
            <h3 className="font-bold text-base text-slate-900">Thêm từ vựng mới vào sổ tay</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Từ tiếng Anh (Word):</label>
                <input
                  type="text"
                  value={newCardWord}
                  onChange={(e) => setNewCardWord(e.target.value)}
                  placeholder="e.g. indispensable"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Nghĩa tiếng Việt:</label>
                <input
                  type="text"
                  value={newCardDefVi}
                  onChange={(e) => setNewCardDefVi(e.target.value)}
                  placeholder="e.g. không thể thiếu"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Câu ví dụ trong ngữ cảnh:</label>
                <textarea
                  value={newCardExample}
                  onChange={(e) => setNewCardExample(e.target.value)}
                  placeholder="e.g. Water is indispensable for human survival."
                  rows={2}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCardModal(false)}
                className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddNewCard}
                disabled={!newCardWord.trim() || !newCardDefVi.trim()}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-bold cursor-pointer disabled:opacity-40"
              >
                Lưu vào bộ thẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
