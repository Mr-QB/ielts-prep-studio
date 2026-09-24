import React, { useState, useEffect, useRef } from 'react';
import {
  VocabCard,
  VocabDeck,
  SRSIntervalRating,
  ParsePreviewResult,
  VocabReviewMode,
  VocabErrorType,
  VocabLookupResult,
  VocabLookupSense
} from '../types';
import { INITIAL_VOCAB_DECKS, TOPIC_VOCABULARIES, PARAPHRASE_BANK, TopicVocabulary } from '../data/vocabData';
import {
  calculateNextSRS,
  previewNextInterval,
  parseVocabText,
  analyzeVocabImport,
  playPronunciation,
  classifyVocabError,
  selectVocabReviewMode,
  buildSessionReviewQueue,
  reinsertCardIntoSessionQueue,
  suggestVocabCorrection,
  SessionReviewItem,
  VocabErrorClassification
} from '../utils/srsEngine';
import {
  loadDecksFromStorage,
  saveDecksToStorage,
  lookupVocabularyApi,
  checkDuplicateWordApi,
  logVocabReviewAction,
  reviewCardSRS,
  saveCustomCard
} from '../utils/db';

interface EnrichedImportItem {
  card: VocabCard;
  result: VocabLookupResult;
  senseIndex: number;
  meaningVi: string;
}

export const VocabSRSView: React.FC = () => {
  // 3 Primary Tabs
  const [activeTab, setActiveTab] = useState<'spaced-review' | 'topic-vocab' | 'paraphrase-bank'>('spaced-review');

  // Decks state
  const [decks, setDecks] = useState<VocabDeck[]>(INITIAL_VOCAB_DECKS);
  const [activeDeckId, setActiveDeckId] = useState<string>('all');
  const [voiceAccent, setVoiceAccent] = useState<'en-GB' | 'en-US'>('en-GB');

  // ==========================================
  // ACTIVE RETRIEVAL SESSION STATES
  // ==========================================
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [sessionQueue, setSessionQueue] = useState<SessionReviewItem[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);

  // Review interaction states
  const [isMeaningRevealed, setIsMeaningRevealed] = useState<boolean>(false);
  const [typedInput, setTypedInput] = useState<string>('');
  const [evalResult, setEvalResult] = useState<VocabErrorClassification | null>(null);
  const [selectedMcqOption, setSelectedMcqOption] = useState<string | null>(null);
  const [mcqChecked, setMcqChecked] = useState<boolean>(false);
  const [sessionCardStartTime, setSessionCardStartTime] = useState<number>(Date.now());
  const [hintRevealed, setHintRevealed] = useState<boolean>(false);
  const typingInputRef = useRef<HTMLInputElement | null>(null);

  // Session summary counters
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    remembered: 0,
    spellingErrors: 0,
    morphologyErrors: 0,
    forgot: 0,
    newWords: 0,
    needsAnotherRound: 0,
    failedCardIds: new Set<string>()
  });

  // ==========================================
  // SIMPLIFIED ADD WORD & LOOKUP MODAL
  // ==========================================
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [lookupWordInput, setLookupWordInput] = useState<string>('');
  const [lookupContextInput, setLookupContextInput] = useState<string>('');
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  const [lookupResult, setLookupResult] = useState<VocabLookupResult | null>(null);
  const [selectedSenseIndex, setSelectedSenseIndex] = useState<number>(0);
  const [customMeaningVi, setCustomMeaningVi] = useState<string>('');
  const [duplicateWarning, setDuplicateWarning] = useState<{
    exists: boolean;
    card?: any;
    message?: string;
  } | null>(null);
  const [addFeedbackMsg, setAddFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ==========================================
  // PARAPHRASE & DISCRIMINATION PRACTICE
  // ==========================================
  const [paraphraseSearch, setParaphraseSearch] = useState<string>('');
  const [paraphraseCategory, setParaphraseCategory] = useState<string>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPIC_VOCABULARIES[0].id);
  const [discriminationAnswers, setDiscriminationAnswers] = useState<Record<string, string>>({});

  // Import TXT/CSV Modal & Preview States
  const [importText, setImportText] = useState<string>('');
  const importDeckName = 'Từ của tôi';
  const [importAnalysis, setImportAnalysis] = useState<ParsePreviewResult | null>(null);
  const [importFormat, setImportFormat] = useState<'text' | 'csv'>('text');
  const [enrichedImport, setEnrichedImport] = useState<EnrichedImportItem[]>([]);
  const [isEnrichingImport, setIsEnrichingImport] = useState(false);
  const [importError, setImportError] = useState('');
  const [importCorrections, setImportCorrections] = useState<Record<string, string>>({});

  // Load decks on mount
  useEffect(() => {
    loadDecksFromStorage(INITIAL_VOCAB_DECKS).then(loaded => {
      if (loaded && loaded.length > 0) {
        setDecks(loaded);
      }
    });
  }, []);

  const updateDecks = (newDecks: VocabDeck[]) => {
    setDecks(newDecks);
    saveDecksToStorage(newDecks);
  };

  // Aggregate cards across active deck or all decks
  const allCards = decks.flatMap(d => d.cards);
  const targetCards = activeDeckId === 'all'
    ? allCards
    : (decks.find(d => d.id === activeDeckId)?.cards || []);

  const nowTime = new Date().getTime();
  const dueCards = targetCards.filter(c => {
    if (!c.dueDate) return true;
    return new Date(c.dueDate).getTime() <= nowTime;
  });

  const newCardsCount = targetCards.filter(c => c.state === 'new' || c.repetition === 0).length;
  const learningCardsCount = targetCards.filter(c => c.state === 'learning').length;
  const personalCardsCount = targetCards.filter(c => c.sourceType === 'reading' || c.sourceType === 'listening' || c.sourceType === 'manual').length;

  const currentItem: SessionReviewItem | undefined = sessionQueue[queueIndex];
  const currentCard = currentItem?.card;
  const currentMode = currentItem?.mode || 'recall';

  // Auto-focus input when moving to a typing/cloze/audio card
  useEffect(() => {
    if (isSessionActive && currentItem) {
      setIsMeaningRevealed(false);
      setTypedInput('');
      setEvalResult(null);
      setSelectedMcqOption(null);
      setMcqChecked(false);
      setHintRevealed(false);
      setSessionCardStartTime(Date.now());

      if (['typing_vi_en', 'cloze', 'audio_spelling'].includes(currentItem.mode)) {
        setTimeout(() => typingInputRef.current?.focus(), 80);
      }

      // Auto-play audio if in audio_spelling mode
      if (currentItem.mode === 'audio_spelling' && currentItem.card) {
        playPronunciation(currentItem.card.word, voiceAccent);
      }
    }
  }, [queueIndex, isSessionActive, currentItem?.queueId]);

  // Start continuous review session
  const startReviewSession = (forcedCards?: VocabCard[]) => {
    const cardsToReview = forcedCards || (dueCards.length > 0 ? dueCards : targetCards.slice(0, 10));
    if (cardsToReview.length === 0) return;

    // Prioritize personal words from Reading/Listening
    const sorted = [...cardsToReview].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const queue = buildSessionReviewQueue(sorted);

    setSessionQueue(queue);
    setQueueIndex(0);
    setIsSessionActive(true);
    setSessionFinished(false);
    setSessionStats({
      reviewed: 0,
      remembered: 0,
      spellingErrors: 0,
      morphologyErrors: 0,
      forgot: 0,
      newWords: 0,
      needsAnotherRound: 0,
      failedCardIds: new Set()
    });
  };

  // Keyboard shortcut listener during active session
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (!isSessionActive || !currentItem) return;

      if (currentMode === 'recall' && !isInput) {
        if (e.code === 'Space') {
          e.preventDefault();
          setIsMeaningRevealed(prev => !prev);
        } else if (isMeaningRevealed) {
          if (e.key === '1') handleRecallRating(1);
          else if (e.key === '2') handleRecallRating(2);
          else if (e.key === '3') handleRecallRating(3);
          else if (e.key === '4') handleRecallRating(4);
        }
      } else if (['typing_vi_en', 'cloze', 'audio_spelling'].includes(currentMode)) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!evalResult) {
            handleCheckTypingAnswer();
          } else {
            handleProceedNextItem();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSessionActive, currentItem, currentMode, isMeaningRevealed, evalResult, typedInput]);

  // Handle Mode A (Recall Meaning) rating
  const handleRecallRating = async (rating: SRSIntervalRating) => {
    if (!currentCard || !currentItem) return;

    const responseTimeMs = Date.now() - sessionCardStartTime;
    const isSuccess = rating >= 3;

    // SM-2 calculation
    const updated = await reviewCardSRS(currentCard.id, rating, currentCard);
    syncCardToLocalDecks(updated);

    // Audit log
    await logVocabReviewAction({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: 'local-user',
      cardId: currentCard.id,
      reviewMode: 'recall',
      correct: isSuccess,
      rating,
      responseTimeMs,
      hintUsed: hintRevealed,
      errorType: isSuccess ? 'NONE' : 'RECALL_FAILURE',
      createdAt: Date.now()
    });

    // Update session statistics
    setSessionStats(prev => {
      const failed = new Set(prev.failedCardIds);
      if (!isSuccess) failed.add(currentCard.id);
      return {
        ...prev,
        reviewed: prev.reviewed + 1,
        remembered: prev.remembered + (isSuccess ? 1 : 0),
        forgot: prev.forgot + (!isSuccess ? 1 : 0),
        newWords: prev.newWords + (currentCard.repetition === 0 ? 1 : 0),
        needsAnotherRound: failed.size,
        failedCardIds: failed
      };
    });

    // Same-session relearning: If user forgot (Rating 1 - Again), insert back into queue after 3–6 cards!
    if (rating === 1) {
      const reinserted = reinsertCardIntoSessionQueue(sessionQueue, queueIndex, currentCard, 'typing_vi_en');
      setSessionQueue(reinserted);
    }

    advanceSession();
  };

  // Handle Typing / Cloze / Audio submission check
  const handleCheckTypingAnswer = async () => {
    if (!currentCard || !currentItem) return;

    const evaluation = classifyVocabError(typedInput, currentCard.word, currentCard.lemma);
    setEvalResult(evaluation);
    const responseTimeMs = Date.now() - sessionCardStartTime;

    // Log review
    await logVocabReviewAction({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: 'local-user',
      cardId: currentCard.id,
      reviewMode: currentItem.mode,
      correct: evaluation.isCorrect,
      rating: evaluation.isCorrect ? 3 : 1,
      responseTimeMs,
      hintUsed: hintRevealed,
      typedAnswer: typedInput,
      errorType: evaluation.errorType,
      createdAt: Date.now()
    });

    if (evaluation.isCorrect) {
      // Update card SRS (Good = 3)
      const updated = await reviewCardSRS(currentCard.id, 3, currentCard);
      syncCardToLocalDecks(updated);

      setSessionStats(prev => ({
        ...prev,
        reviewed: prev.reviewed + 1,
        remembered: prev.remembered + 1,
        newWords: prev.newWords + (currentCard.repetition === 0 ? 1 : 0)
      }));
    } else {
      // Failed or Typo: Reinsert card into session queue 3-6 items later
      const reinserted = reinsertCardIntoSessionQueue(
        sessionQueue,
        queueIndex,
        currentCard,
        evaluation.errorType === 'SPELLING_ERROR' ? 'audio_spelling' : 'typing_vi_en'
      );
      setSessionQueue(reinserted);

      // Card failed in SM-2 (Again = 1)
      const updated = await reviewCardSRS(currentCard.id, 1, currentCard);
      syncCardToLocalDecks(updated);

      setSessionStats(prev => {
        const failed = new Set(prev.failedCardIds);
        failed.add(currentCard.id);
        return {
          ...prev,
          reviewed: prev.reviewed + 1,
          spellingErrors: prev.spellingErrors + (evaluation.errorType === 'SPELLING_ERROR' ? 1 : 0),
          morphologyErrors: prev.morphologyErrors + (evaluation.errorType === 'MORPHOLOGY_ERROR' ? 1 : 0),
          forgot: prev.forgot + (evaluation.errorType === 'RECALL_FAILURE' ? 1 : 0),
          needsAnotherRound: failed.size,
          failedCardIds: failed
        };
      });
    }
  };

  const handleProceedNextItem = () => {
    setEvalResult(null);
    advanceSession();
  };

  // Handle MCQ Collocation / Paraphrase
  const handleSelectMcq = async (option: string, isCorrect: boolean, mode: VocabReviewMode) => {
    if (!currentCard || mcqChecked) return;

    setSelectedMcqOption(option);
    setMcqChecked(true);
    const responseTimeMs = Date.now() - sessionCardStartTime;

    await logVocabReviewAction({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: 'local-user',
      cardId: currentCard.id,
      reviewMode: mode,
      correct: isCorrect,
      rating: isCorrect ? 3 : 1,
      responseTimeMs,
      hintUsed: hintRevealed,
      typedAnswer: option,
      errorType: isCorrect ? 'NONE' : 'COLLOCATION_ERROR',
      createdAt: Date.now()
    });

    if (isCorrect) {
      const updated = await reviewCardSRS(currentCard.id, 3, currentCard);
      syncCardToLocalDecks(updated);
      setSessionStats(prev => ({ ...prev, reviewed: prev.reviewed + 1, remembered: prev.remembered + 1 }));
    } else {
      const updated = await reviewCardSRS(currentCard.id, 1, currentCard);
      syncCardToLocalDecks(updated);
      const reinserted = reinsertCardIntoSessionQueue(sessionQueue, queueIndex, currentCard, 'typing_vi_en');
      setSessionQueue(reinserted);

      setSessionStats(prev => {
        const failed = new Set(prev.failedCardIds);
        failed.add(currentCard.id);
        return {
          ...prev,
          reviewed: prev.reviewed + 1,
          forgot: prev.forgot + 1,
          needsAnotherRound: failed.size,
          failedCardIds: failed
        };
      });
    }
  };

  const advanceSession = () => {
    if (queueIndex + 1 < sessionQueue.length) {
      setQueueIndex(prev => prev + 1);
    } else {
      setSessionFinished(true);
      setIsSessionActive(false);
    }
  };

  const syncCardToLocalDecks = (updatedCard: VocabCard) => {
    const nextDecks = decks.map(d => ({
      ...d,
      cards: d.cards.map(c => (c.id === updatedCard.id ? updatedCard : c))
    }));
    updateDecks(nextDecks);
  };

  // ==========================================
  // SIMPLIFIED ADD WORD LOGIC
  // ==========================================
  const handleTriggerLookup = async () => {
    const rawWord = lookupWordInput.trim();
    if (!rawWord) return;

    setIsLookingUp(true);
    setLookupResult(null);
    setDuplicateWarning(null);
    setAddFeedbackMsg(null);

    // 1. Check duplicate
    try {
      const dupCheck = await checkDuplicateWordApi(rawWord);
      if (dupCheck.exists && dupCheck.card) {
        setDuplicateWarning({
          exists: true,
          card: dupCheck.card,
          message: `Từ "${rawWord}" đã có trong danh sách từ vựng của bạn.`
        });
      }

      const res = await lookupVocabularyApi(rawWord, lookupContextInput.trim());
      setLookupResult(res);
      setSelectedSenseIndex(0);
      setCustomMeaningVi(res.senses[0]?.viSuggestion || '');
      if (!res.senses.length) setAddFeedbackMsg({ type: 'error', text: 'Chưa tra được nghĩa đáng tin cậy. Có thể thử lại khi có mạng hoặc nhập từ khác.' });
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSaveLookedUpWord = async (updateExisting = false) => {
    if (!lookupResult || !lookupWordInput.trim()) return;

    const chosenSense = lookupResult.senses[selectedSenseIndex] || lookupResult.senses[0];
    const finalVi = customMeaningVi.trim();
    if (!chosenSense?.definitionEn?.trim() || !finalVi) {
      setAddFeedbackMsg({ type: 'error', text: 'Hãy chọn một nghĩa tiếng Anh và xác nhận nghĩa tiếng Việt trước khi lưu.' });
      return;
    }

    const saveResult = await saveCustomCard({
      word: lookupResult.word,
      lemma: lookupResult.lemma,
      phonetic: lookupResult.phonetic,
      partOfSpeech: lookupResult.partOfSpeech,
      definitionVi: finalVi,
      definitionEn: chosenSense.definitionEn,
      example: lookupContextInput.trim() || (chosenSense.examples && chosenSense.examples[0]) || '',
      sourceContext: lookupContextInput.trim(),
      collocations: lookupResult.collocations || [],
      sourceType: 'manual',
      source: 'Tra từ thủ công',
      audio: lookupResult.audio,
      audioSource: lookupResult.audioSource,
      updateExisting
    });

    if (saveResult.success) {
      setAddFeedbackMsg({ type: 'success', text: saveResult.message });
      // Reload decks
      loadDecksFromStorage(INITIAL_VOCAB_DECKS).then(loaded => {
        if (loaded) setDecks(loaded);
      });
      setTimeout(() => {
        setShowAddModal(false);
        setLookupWordInput('');
        setLookupContextInput('');
        setLookupResult(null);
        setDuplicateWarning(null);
        setAddFeedbackMsg(null);
      }, 1200);
    } else {
      setAddFeedbackMsg({ type: 'error', text: saveResult.message });
    }
  };

  const analyzeBulkInput = (text: string, format = importFormat) => {
    setImportText(text);
    setImportFormat(format);
    setEnrichedImport([]);
    setImportError('');
    setImportCorrections({});
    setImportAnalysis(analyzeVocabImport(text, new Set(allCards.map(card => card.word.toLowerCase())), importDeckName || 'Từ của tôi', format));
  };

  const handleEnrichBulkImport = async () => {
    if (!importAnalysis) return;
    const seen = new Set<string>();
    const candidates = importAnalysis.parsed.map(card => ({ ...card, word: importCorrections[card.word] || card.word })).filter(card => {
      const word = card.word.trim().toLowerCase();
      if (!word || seen.has(word) || allCards.some(existing => existing.word.trim().toLowerCase() === word)) return false;
      seen.add(word);
      return true;
    }).slice(0, 50);
    if (candidates.length === 0) {
      setImportError('Không có mục mới để tra. Từ trùng đã được bỏ qua.');
      return;
    }
    if (importAnalysis.parsed.length > 50) setImportError('Mỗi lượt tra tối đa 50 mục; các mục đầu tiên sẽ được xử lý trước.');
    setIsEnrichingImport(true);
    const results = await Promise.all(candidates.map(async card => {
      try {
        const result = await lookupVocabularyApi(card.word, card.example || card.sourceContext);
        if (!result.senses.some(sense => sense.definitionEn.trim() && !/^(meaning of|ielts target vocabulary item)/i.test(sense.definitionEn))) return null;
        return { card, result, senseIndex: 0, meaningVi: card.definitionVi || result.senses[0]?.viSuggestion || '' };
      } catch {
        return null;
      }
    }));
    const enriched = results.filter((item): item is EnrichedImportItem => item !== null);
    setEnrichedImport(enriched);
    if (enriched.length < candidates.length) setImportError(`${candidates.length - enriched.length} mục chưa tra được nghĩa tin cậy nên không thể lưu. Thử lại khi có mạng hoặc bỏ các mục đó.`);
    setIsEnrichingImport(false);
  };

  const handleSaveBulkImport = () => {
    if (!enrichedImport.length || enrichedImport.some(item => !item.result.senses[item.senseIndex]?.definitionEn.trim() || !item.meaningVi.trim())) return;
    const cards = enrichedImport.map(({ card, result, senseIndex, meaningVi }) => {
      const sense = result.senses[senseIndex];
      return {
        ...card,
        word: result.word,
        lemma: result.lemma,
        phonetic: result.phonetic,
        partOfSpeech: sense.partOfSpeech || result.partOfSpeech,
        definitionVi: meaningVi.trim(),
        definitionEn: sense.definitionEn,
        example: card.example || sense.examples?.[0] || '',
        sourceContext: card.example || card.sourceContext || '',
        collocations: result.collocations || [],
        sourceType: 'manual' as const,
        source: 'Nhập từ cá nhân',
        audio: result.audio,
        audioSource: result.audioSource
      };
    });
    const nextDecks = decks.length
      ? decks.map((deck, index) => index === 0 ? { ...deck, cards: [...cards, ...deck.cards] } : deck)
      : [{ id: `personal-${Date.now()}`, name: importDeckName || 'Từ của tôi', description: '', createdAt: new Date().toISOString(), source: 'personal', cards }];
    updateDecks(nextDecks);
    setShowAddModal(false);
    setImportText('');
    setImportAnalysis(null);
    setEnrichedImport([]);
  };

  // Helper for cloze sentences
  const getClozeSentence = (card: VocabCard): { before: string; after: string; full: string } => {
    const raw = card.sourceContext || card.example || `The concept of ${card.word} is important.`;
    const regex = new RegExp(`\\b${card.word}\\b`, 'i');
    const match = raw.match(regex);
    if (match && match.index !== undefined) {
      const before = raw.slice(0, match.index);
      const after = raw.slice(match.index + match[0].length);
      return { before, after, full: raw };
    }
    return { before: 'There was a ______ aspect to ', after: ' this topic.', full: raw };
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header & 3 Main Tabs */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              Hệ thống học từ chủ động • Active Retrieval Spaced Learning
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sổ Tay Từ Vựng & Luyện Tập Chủ Động
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Học từ vựng qua 6 dạng truy xuất thực tế: Nhớ nghĩa, Gõ từ ngữ cảnh, Điền từ Cloze, Nghe chính tả, Collocation và Paraphrase.
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setActiveTab('spaced-review'); setIsSessionActive(false); }}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'spaced-review'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Ôn tập chủ động
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('topic-vocab'); setIsSessionActive(false); }}
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
              onClick={() => { setActiveTab('paraphrase-bank'); setIsSessionActive(false); }}
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
      {/* 1. SỔ TAY ÔN TẬP CHỦ ĐỘNG (SPACED ACTIVE RETRIEVAL REVIEW - DEFAULT)        */}
      {/* ========================================================================= */}
      {activeTab === 'spaced-review' && (
        <div className="space-y-6">
          {/* VOCABULARY OVERVIEW STATS ROW (When not reviewing) */}
          {!isSessionActive && !sessionFinished && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Ôn hôm nay */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ÔN HÔM NAY</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                        dueCards.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {dueCards.length > 0 ? 'Đến hạn' : 'Đã hoàn thành'}
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                      {dueCards.length} <span className="text-sm font-normal text-slate-500">từ</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {dueCards.length > 0
                        ? 'Cần hoàn thành phiên ôn để duy trì trí nhớ dài hạn.'
                        : 'Không có từ đến hạn hôm nay. Bạn có thể học thêm từ mới.'}
                    </p>
                  </div>
                  <div className="mt-4">
                    {dueCards.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => startReviewSession(dueCards)}
                        className="w-full py-2 px-3 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs transition-colors"
                      >
                        Bắt đầu ôn ({dueCards.length} từ)
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startReviewSession(targetCards.slice(0, 10))}
                        className="w-full py-2 px-3 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-200 cursor-pointer transition-colors"
                      >
                        Ôn luyện thêm (10 từ)
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Từ mới đang học */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">TỪ MỚI & ĐANG HỌC</span>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                      {newCardsCount + learningCardsCount} <span className="text-sm font-normal text-slate-500">từ</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {newCardsCount} từ mới chưa ôn • {learningCardsCount} từ đang trong chu kỳ lặp ngắn.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <span>Mục tiêu ngày:</span>
                    <span className="font-semibold text-slate-900">5 – 10 từ</span>
                  </div>
                </div>

                {/* 3. Cần học (Lộ trình) */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CẦN HỌC (LỘ TRÌNH)</span>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Core 4.0 → 5.5</span>
                        <span className="text-slate-500 text-[11px]">Ưu tiên #1</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>IELTS Core 5.5 → 6.5</span>
                        <span className="text-slate-400 text-[11px]">Giai đoạn 2</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Upgrade 6.5 → 7.0+</span>
                        <span className="text-slate-400 text-[11px]">Mở rộng</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                    Tập trung 100% vào từ vựng chức năng tần suất cao.
                  </div>
                </div>

                {/* 4. Từ của tôi */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">TỪ CỦA TÔI</span>
                      <span className="text-[11px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded">
                        Ưu tiên cao nhất
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                      {personalCardsCount} <span className="text-sm font-normal text-slate-500">từ</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Từ lưu trực tiếp từ bài đọc Reading, transcript Listening và tra cứu cá nhân.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="w-full py-2 px-3 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-xs transition-colors"
                    >
                      + Thêm từ mới
                    </button>
                  </div>
                </div>
              </div>

              {/* Action & Filter Bar */}
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Lọc theo bộ từ:</span>
                  <select
                    value={activeDeckId}
                    onChange={(e) => setActiveDeckId(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-900 focus:outline-hidden"
                  >
                    <option value="all">Toàn bộ từ vựng ({allCards.length} từ)</option>
                    {decks.map(deck => (
                      <option key={deck.id} value={deck.id}>
                        {deck.name} ({deck.cards.length} từ)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVoiceAccent(prev => prev === 'en-GB' ? 'en-US' : 'en-GB')}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-700 cursor-pointer hover:bg-slate-50"
                  >
                    Giọng phát âm: {voiceAccent}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setBulkMode(true); setShowAddModal(true); }}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium cursor-pointer hover:bg-slate-50"
                  >
                    Nhập TXT / CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => { setBulkMode(false); setShowAddModal(true); }}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer hover:bg-slate-800"
                  >
                    + Tra từ & Thêm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTIVE MULTI-MODE REVIEW SESSION CONTAINER                                */}
          {/* ========================================================================= */}
          {isSessionActive && currentCard && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
              {/* Top Progress & Mode Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">
                    Câu {queueIndex + 1} / {sessionQueue.length}
                  </span>

                  {/* Mode Badge */}
                  {currentMode === 'recall' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      Mode A: Nhớ nghĩa
                    </span>
                  )}
                  {currentMode === 'typing_vi_en' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Mode B: Dịch & Gõ từ
                    </span>
                  )}
                  {currentMode === 'cloze' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      Mode C: Điền từ vào câu
                    </span>
                  )}
                  {currentMode === 'audio_spelling' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Mode D: Nghe & Gõ chính tả
                    </span>
                  )}
                  {currentMode === 'collocation' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Mode E: Cụm từ Collocation
                    </span>
                  )}
                  {currentMode === 'paraphrase_context' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      Mode F: Paraphrase ngữ cảnh
                    </span>
                  )}

                  {currentItem.isRetry && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-100 text-red-700">
                      Luyện lại trong phiên
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span>{currentCard.partOfSpeech}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Dừng phiên ôn tập hiện tại?')) {
                        setIsSessionActive(false);
                      }
                    }}
                    className="hover:text-slate-600 cursor-pointer"
                  >
                    Dừng ôn
                  </button>
                </div>
              </div>

              {/* MODE A: RECALL MEANING */}
              {currentMode === 'recall' && (
                <div className="space-y-6 text-center py-2">
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {currentCard.word}
                    </h2>
                    {currentCard.phonetic && (
                      <div className="text-sm font-mono text-slate-500 flex items-center justify-center gap-2">
                        <span>{currentCard.phonetic}</span>
                        <button
                          type="button"
                          onClick={() => playPronunciation(currentCard.word, voiceAccent)}
                          className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                          title="Phát âm"
                        >
                          🔊
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-slate-500 pt-2">
                      Bạn có nhớ nghĩa và cách dùng của từ này không?
                    </p>
                  </div>

                  {!isMeaningRevealed ? (
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => setIsMeaningRevealed(true)}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 cursor-pointer shadow-xs transition-all"
                      >
                        Hiện nghĩa (Phím Space)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5 text-left bg-slate-50 border border-slate-200 rounded-lg p-5">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nghĩa tiếng Việt</span>
                        <div className="text-lg font-bold text-slate-900 mt-0.5">{currentCard.definitionVi}</div>
                        {currentCard.definitionEn && (
                          <div className="text-xs text-slate-600 mt-1 italic">{currentCard.definitionEn}</div>
                        )}
                      </div>

                      {(currentCard.example || currentCard.sourceContext) && (
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ví dụ ngữ cảnh</span>
                          <div className="text-sm text-slate-800 mt-0.5 bg-white p-3 rounded border border-slate-200">
                            {currentCard.sourceContext || currentCard.example}
                          </div>
                        </div>
                      )}

                      {currentCard.collocations && currentCard.collocations.length > 0 && (
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cụm từ Collocation</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {currentCard.collocations.map((col, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-700 font-medium">
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4 Real Interval Rating Buttons */}
                      <div className="pt-3 border-t border-slate-200">
                        <div className="text-xs text-slate-500 mb-2 font-medium">
                          Đánh giá mức độ ghi nhớ (Lên lịch tiếp theo):
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() => handleRecallRating(1)}
                            className="py-2 px-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-center hover:bg-rose-100 cursor-pointer transition-colors"
                          >
                            <div className="text-xs font-bold">1. Quên</div>
                            <div className="text-[10px] font-mono text-rose-600">{previewNextInterval(currentCard, 1)}</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRecallRating(2)}
                            className="py-2 px-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-center hover:bg-amber-100 cursor-pointer transition-colors"
                          >
                            <div className="text-xs font-bold">2. Khó</div>
                            <div className="text-[10px] font-mono text-amber-600">{previewNextInterval(currentCard, 2)}</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRecallRating(3)}
                            className="py-2 px-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-center hover:bg-blue-100 cursor-pointer transition-colors"
                          >
                            <div className="text-xs font-bold">3. Nhớ</div>
                            <div className="text-[10px] font-mono text-blue-600">{previewNextInterval(currentCard, 3)}</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRecallRating(4)}
                            className="py-2 px-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-center hover:bg-emerald-100 cursor-pointer transition-colors"
                          >
                            <div className="text-xs font-bold">4. Dễ</div>
                            <div className="text-[10px] font-mono text-emerald-600">{previewNextInterval(currentCard, 4)}</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE B: VIETNAMESE -> ENGLISH TYPING */}
              {currentMode === 'typing_vi_en' && (
                <div className="space-y-5 py-2">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Nghĩa tiếng Việt</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">{currentCard.definitionVi}</div>
                    {currentCard.definitionEn && (
                      <div className="text-xs text-slate-500 mt-0.5">{currentCard.definitionEn}</div>
                    )}
                  </div>

                  {(currentCard.example || currentCard.sourceContext) && (
                    <div className="text-sm text-slate-800 bg-white p-3.5 rounded border border-slate-200 font-serif leading-relaxed">
                      {(() => {
                        const cloze = getClozeSentence(currentCard);
                        return (
                          <span>
                            {cloze.before}
                            <span className="underline font-bold text-blue-600"> [ _______ ] </span>
                            {cloze.after}
                          </span>
                        );
                      })()}
                    </div>
                  )}

                  {/* Typing input */}
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-slate-600">Gõ từ tiếng Anh tương ứng:</label>
                    <div className="flex gap-2">
                      <input
                        ref={typingInputRef}
                        type="text"
                        disabled={Boolean(evalResult)}
                        value={typedInput}
                        onChange={(e) => setTypedInput(e.target.value)}
                        placeholder="Gõ từ tiếng Anh..."
                        className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                      {!evalResult ? (
                        <button
                          type="button"
                          onClick={handleCheckTypingAnswer}
                          className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
                        >
                          Kiểm tra (Enter)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleProceedNextItem}
                          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
                        >
                          Tiếp tục (Enter)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Feedback on Check */}
                  {evalResult && (
                    <div className={`p-4 rounded-lg border text-sm ${
                      evalResult.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : evalResult.errorType === 'SPELLING_ERROR'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : evalResult.errorType === 'MORPHOLOGY_ERROR'
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}>
                      <div className="font-bold">{evalResult.messageVi}</div>
                      {!evalResult.isCorrect && (
                        <div className="mt-2 space-y-1 text-xs">
                          {evalResult.diffHighlight && (
                            <div>
                              Bạn gõ: <span className="font-mono bg-white px-1.5 py-0.5 rounded border">{evalResult.diffHighlight.user}</span>
                              {' '}&rarr;{' '}
                              Đáp án đúng: <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border text-emerald-800">{currentCard.word}</span>
                            </div>
                          )}
                          <div className="text-[11px] text-slate-600 pt-1">
                            ℹ Thẻ này sẽ tự động xuất hiện lại sau 3–6 câu trong phiên để bạn gõ lại chính xác.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* MODE C: ENGLISH CLOZE */}
              {currentMode === 'cloze' && (
                <div className="space-y-5 py-2">
                  <div className="text-xs text-slate-500 font-medium">
                    Đọc câu ngữ cảnh và điền từ vựng còn thiếu:
                  </div>

                  <div className="text-base text-slate-900 bg-slate-50 p-4 rounded-lg border border-slate-200 font-serif leading-relaxed">
                    {(() => {
                      const cloze = getClozeSentence(currentCard);
                      return (
                        <span>
                          {cloze.before}
                          <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                            [ ______ ]
                          </span>
                          {cloze.after}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Optional Hint */}
                  <div className="flex items-center justify-between text-xs">
                    {hintRevealed ? (
                      <span className="text-slate-600 font-medium bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        💡 Gợi ý nghĩa: {currentCard.definitionVi}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setHintRevealed(true)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        💡 Hiện gợi ý nghĩa
                      </button>
                    )}
                    <span className="text-slate-400">Từ loại: {currentCard.partOfSpeech}</span>
                  </div>

                  {/* Input field */}
                  <div className="flex gap-2">
                    <input
                      ref={typingInputRef}
                      type="text"
                      disabled={Boolean(evalResult)}
                      value={typedInput}
                      onChange={(e) => setTypedInput(e.target.value)}
                      placeholder="Gõ từ điền vào chỗ trống..."
                      className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                    />
                    {!evalResult ? (
                      <button
                        type="button"
                        onClick={handleCheckTypingAnswer}
                        className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
                      >
                        Kiểm tra (Enter)
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleProceedNextItem}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
                      >
                        Tiếp tục (Enter)
                      </button>
                    )}
                  </div>

                  {evalResult && (
                    <div className={`p-4 rounded-lg border text-sm ${
                      evalResult.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}>
                      <div className="font-bold">{evalResult.messageVi}</div>
                      {!evalResult.isCorrect && (
                        <div className="mt-1 text-xs">
                          Đáp án đúng: <span className="font-mono font-bold">{currentCard.word}</span>
                          {' '}({currentCard.definitionVi})
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* MODE D: AUDIO -> SPELLING */}
              {currentMode === 'audio_spelling' && (
                <div className="space-y-6 text-center py-4">
                  <div className="space-y-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-700">
                      {currentCard.audio ? 'Dictionary Audio' : 'TTS Practice'}
                    </span>

                    <div>
                      <button
                        type="button"
                        onClick={() => playPronunciation(currentCard.word, voiceAccent)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-bold shadow-md hover:bg-amber-600 cursor-pointer transition-transform active:scale-95"
                      >
                        <span>🔊</span> Nghe lại phát âm
                      </button>
                    </div>

                    {currentCard.phonetic && (
                      <div className="text-sm font-mono text-slate-500">{currentCard.phonetic}</div>
                    )}
                    <p className="text-xs text-slate-500">
                      Nghe kỹ âm thanh và gõ lại đúng chính tả từ tiếng Anh.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-3">
                    <div className="flex gap-2">
                      <input
                        ref={typingInputRef}
                        type="text"
                        disabled={Boolean(evalResult)}
                        value={typedInput}
                        onChange={(e) => setTypedInput(e.target.value)}
                        placeholder="Gõ chính tả từ vừa nghe..."
                        className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-amber-600 text-center"
                      />
                      {!evalResult ? (
                        <button
                          type="button"
                          onClick={handleCheckTypingAnswer}
                          className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
                        >
                          Kiểm tra
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleProceedNextItem}
                          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
                        >
                          Tiếp tục
                        </button>
                      )}
                    </div>

                    {evalResult && (
                      <div className={`p-3.5 rounded-lg border text-sm text-left ${
                        evalResult.isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-300 text-amber-900'
                      }`}>
                        <div className="font-bold">{evalResult.messageVi}</div>
                        {!evalResult.isCorrect && (
                          <div className="mt-1 text-xs">
                            Đáp án đúng: <span className="font-mono font-bold text-slate-900">{currentCard.word}</span>
                            {' '}— {currentCard.definitionVi}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODE E: COLLOCATION DISCRIMINATION */}
              {currentMode === 'collocation' && (
                <div className="space-y-5 py-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">IELTS Collocation Drill</span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Chọn cụm từ tự nhiên và chuẩn xác nhất trong IELTS:
                    </h3>
                  </div>

                  {(() => {
                    const primaryCol = (currentCard.collocations && currentCard.collocations[0]) || `${currentCard.word} significantly`;
                    // Generate 3 plausible distractors
                    const distractors = [
                      primaryCol.replace(new RegExp(`\\b${currentCard.word}\\b`, 'i'), 'heavy'),
                      primaryCol.replace(new RegExp(`\\b${currentCard.word}\\b`, 'i'), 'hard'),
                      primaryCol.replace(new RegExp(`\\b${currentCard.word}\\b`, 'i'), 'strong')
                    ].filter(d => d.toLowerCase() !== primaryCol.toLowerCase());

                    const options = [primaryCol, ...distractors.slice(0, 3)].sort(() => 0.5 - Math.random());

                    return (
                      <div className="space-y-2.5">
                        {options.map((opt, idx) => {
                          const isOptionCorrect = opt.toLowerCase() === primaryCol.toLowerCase();
                          const isSelected = selectedMcqOption === opt;

                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={mcqChecked}
                              onClick={() => handleSelectMcq(opt, isOptionCorrect, 'collocation')}
                              className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all cursor-pointer ${
                                !mcqChecked
                                  ? 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                  : isOptionCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                  : isSelected
                                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                                  : 'bg-white border-slate-200 text-slate-500 opacity-60'
                              }`}
                            >
                              <span className="font-mono text-xs text-slate-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                              {opt}
                            </button>
                          );
                        })}

                        {mcqChecked && (
                          <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                            <div>
                              <strong>Đáp án đúng:</strong> <span className="font-semibold text-emerald-800">{primaryCol}</span>
                              <div className="text-slate-500 mt-0.5">Cụm từ cố định tự nhiên thường dùng trong văn cảnh học thuật.</div>
                            </div>
                            <button
                              type="button"
                              onClick={advanceSession}
                              className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer hover:bg-slate-800 shrink-0"
                            >
                              Tiếp theo &rarr;
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* MODE F: PARAPHRASE IN CONTEXT */}
              {currentMode === 'paraphrase_context' && (
                <div className="space-y-5 py-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paraphrase In Context</span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Từ nào thay thế phù hợp nhất với ngữ cảnh câu sau?
                    </h3>
                  </div>

                  <div className="text-sm text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200 font-serif leading-relaxed">
                    {currentCard.sourceContext || currentCard.example || `The numbers showed a ${currentCard.word} pattern.`}
                  </div>

                  {(() => {
                    const correctPara = (currentCard.paraphrases && currentCard.paraphrases[0]) || 'notable';
                    const options = [correctPara, 'lifted strongly', 'exploded badly', 'hardly changed'].sort(() => 0.5 - Math.random());

                    return (
                      <div className="space-y-2.5">
                        {options.map((opt, idx) => {
                          const isOptionCorrect = opt === correctPara;
                          const isSelected = selectedMcqOption === opt;

                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={mcqChecked}
                              onClick={() => handleSelectMcq(opt, isOptionCorrect, 'paraphrase_context')}
                              className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all cursor-pointer ${
                                !mcqChecked
                                  ? 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                  : isOptionCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                  : isSelected
                                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                                  : 'bg-white border-slate-200 text-slate-500 opacity-60'
                              }`}
                            >
                              <span className="font-mono text-xs text-slate-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                              {opt}
                            </button>
                          );
                        })}

                        {mcqChecked && (
                          <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                            <div>
                              <strong>Đáp án đúng:</strong> <span className="font-semibold text-emerald-800">{correctPara}</span>
                              <div className="text-slate-500 mt-0.5">Giữ nguyên nghĩa tự nhiên mà không thay đổi sắc thái ngữ pháp.</div>
                            </div>
                            <button
                              type="button"
                              onClick={advanceSession}
                              className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer hover:bg-slate-800 shrink-0"
                            >
                              Tiếp theo &rarr;
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SESSION SUMMARY REPORT (WHEN SESSION FINISHES)                            */}
          {/* ========================================================================= */}
          {sessionFinished && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-xl mx-auto space-y-6 text-center">
              <div className="inline-flex p-3 bg-emerald-100 text-emerald-800 rounded-full text-2xl mb-1">
                ✓
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Hoàn Thành Phiên Ôn Tập Hôm Nay</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Đã ghi nhận toàn bộ lịch sử ôn tập và cập nhật chu kỳ Spaced Repetition.
                </p>
              </div>

              {/* Clean Summary Table (Section 37 requirement) */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-left space-y-3">
                <div className="flex items-center justify-between text-sm py-1 border-b border-slate-200">
                  <span className="text-slate-600">Đã ôn (Reviewed):</span>
                  <span className="font-mono font-bold text-slate-900">{sessionStats.reviewed}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-slate-200">
                  <span className="text-slate-600">Nhớ tốt (Remembered):</span>
                  <span className="font-mono font-bold text-emerald-700">{sessionStats.remembered}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-slate-200">
                  <span className="text-slate-600">Lỗi chính tả (Spelling errors):</span>
                  <span className="font-mono font-bold text-amber-700">{sessionStats.spellingErrors}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-slate-200">
                  <span className="text-slate-600">Chưa nhớ (Forgot):</span>
                  <span className="font-mono font-bold text-rose-700">{sessionStats.forgot}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-slate-200">
                  <span className="text-slate-600">Từ mới học (New words):</span>
                  <span className="font-mono font-bold text-blue-700">{sessionStats.newWords}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1 font-semibold">
                  <span className="text-slate-700">Cần ôn lại thêm hôm nay:</span>
                  <span className="font-mono font-bold text-slate-900">{sessionStats.needsAnotherRound} từ</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                {sessionStats.needsAnotherRound > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const failedCards = allCards.filter(c => sessionStats.failedCardIds.has(c.id));
                      startReviewSession(failedCards);
                    }}
                    className="px-5 py-2.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 cursor-pointer shadow-xs"
                  >
                    Ôn lại {sessionStats.needsAnotherRound} từ chưa vững
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setSessionFinished(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
                >
                  Về bảng điều khiển từ vựng
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CHỦ ĐỀ IELTS (TOPIC VOCABULARIES)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'topic-vocab' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
            {TOPIC_VOCABULARIES.map(topic => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  selectedTopicId === topic.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {topic.name} ({topic.nameVi})
              </button>
            ))}
          </div>

          {(() => {
            const topic = TOPIC_VOCABULARIES.find(t => t.id === selectedTopicId) || TOPIC_VOCABULARIES[0];
            return (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Chủ đề từ vựng IELTS chuyên sâu</div>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">{topic.name} — {topic.nameVi}</h2>
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2 font-serif italic">
                    &ldquo;{topic.exampleSentence}&rdquo;
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Core Words */}
                  <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Từ vựng cốt lõi (Core Words)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {topic.coreWords.map((w, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-900 font-semibold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verbs & Adjectives */}
                  <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Động từ & Tính từ hữu ích</span>
                    <div className="text-xs space-y-1">
                      <div><strong className="text-slate-700">Verbs:</strong> {topic.usefulVerbs.join(', ')}</div>
                      <div><strong className="text-slate-700">Adjectives:</strong> {topic.usefulAdjectives.join(', ')}</div>
                    </div>
                  </div>

                  {/* Collocations */}
                  <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cụm từ cố định (Collocations)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {topic.collocations.map((col, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs font-medium">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Paraphrases */}
                  <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cặp từ Paraphrase thường gặp</span>
                    <div className="space-y-1 text-xs">
                      {topic.paraphrases.map((p, idx) => (
                        <div key={idx}>
                          <span className="font-semibold text-slate-900">{p.word}:</span>{' '}
                          <span className="text-slate-600">{p.alternatives.join(' / ')}</span>
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
      {/* 3. NGÂN HÀNG PARAPHRASE & DISCRIMINATION EXERCISES                       */}
      {/* ========================================================================= */}
      {activeTab === 'paraphrase-bank' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-xs">
            <input
              type="text"
              value={paraphraseSearch}
              onChange={(e) => setParaphraseSearch(e.target.value)}
              placeholder="Tìm từ gốc hoặc từ đồng nghĩa (VD: increase, important, reason)..."
              className="w-full sm:w-80 px-3.5 py-1.5 border border-slate-300 rounded text-xs text-slate-900 focus:outline-hidden"
            />

            <div className="flex flex-wrap gap-1 text-xs">
              {['all', 'trend', 'importance', 'cause-effect', 'problem-solution', 'opinion'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setParaphraseCategory(cat)}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    paraphraseCategory === cat
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Paraphrase Cards with Discrimination Nuances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARAPHRASE_BANK.filter(item => {
              const matchesCat = paraphraseCategory === 'all' || item.category === paraphraseCategory;
              const matchesSearch = !paraphraseSearch.trim() ||
                item.word.toLowerCase().includes(paraphraseSearch.toLowerCase()) ||
                item.meaningVi.toLowerCase().includes(paraphraseSearch.toLowerCase()) ||
                item.synonyms.some(s => s.word.toLowerCase().includes(paraphraseSearch.toLowerCase()));
              return matchesCat && matchesSearch;
            }).map(item => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.word}</h3>
                    <div className="text-xs text-slate-500">{item.meaningVi}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 font-semibold">
                    {item.category}
                  </span>
                </div>

                {/* Synonyms & Nuances */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Từ đồng nghĩa & Sắc thái:</span>
                  <div className="space-y-1.5">
                    {item.synonyms.map((syn, sIdx) => (
                      <div key={sIdx} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-100">
                        <div className="flex items-center justify-between font-semibold text-slate-900">
                          <span>{syn.word}</span>
                          {syn.register && (
                            <span className="text-[10px] font-mono text-slate-500 font-normal px-1.5 bg-white rounded border">
                              {syn.register}
                            </span>
                          )}
                        </div>
                        {syn.nuance && <div className="text-[11px] text-blue-700 mt-0.5">{syn.nuance}</div>}
                        {syn.example && <div className="text-[11px] text-slate-500 font-serif italic mt-0.5">{syn.example}</div>}
                        {syn.collocation && (
                          <div className="text-[10px] text-slate-600 mt-0.5">
                            <strong>Collocation:</strong> {syn.collocation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discrimination Exercise if available */}
                {item.discriminationExercise && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 space-y-2 text-xs">
                    <span className="font-bold text-blue-900">Bài tập phân biệt ngữ cảnh:</span>
                    <div className="font-serif text-slate-800">{item.discriminationExercise.sentence}</div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {item.discriminationExercise.options.map((opt, oIdx) => {
                        const isChosen = discriminationAnswers[item.id] === opt;
                        const isCorrectOpt = opt === item.discriminationExercise?.correctAnswer;
                        const hasAnswered = Boolean(discriminationAnswers[item.id]);

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={hasAnswered}
                            onClick={() => setDiscriminationAnswers(prev => ({ ...prev, [item.id]: opt }))}
                            className={`p-1.5 rounded border text-left cursor-pointer transition-colors ${
                              !hasAnswered
                                ? 'bg-white border-blue-200 hover:bg-blue-100 text-slate-800'
                                : isCorrectOpt
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                                : isChosen
                                ? 'bg-rose-100 border-rose-300 text-rose-900'
                                : 'bg-white border-slate-200 text-slate-400 opacity-60'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {discriminationAnswers[item.id] && (
                      <div className="text-[11px] text-slate-600 pt-1 border-t border-blue-100">
                        <strong>Giải thích:</strong> {item.discriminationExercise.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMPLIFIED ADD WORD & DICTIONARY LOOKUP MODAL (P1 Requirement)             */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{bulkMode ? 'Thêm từ và cụm từ' : 'Tra từ và thêm vào sổ tay'}</h3>
                <p className="text-xs text-slate-500">Nhập từ vựng, hệ thống sẽ tự động lấy phát âm, nghĩa tiếng Anh và gợi ý tiếng Việt.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
              <button type="button" onClick={() => setBulkMode(false)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${!bulkMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}>Một từ</button>
              <button type="button" onClick={() => setBulkMode(true)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${bulkMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}>Danh sách / file</button>
            </div>

            {bulkMode && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Dán danh sách. Mỗi dòng là một từ hoặc cụm từ.
                  <textarea
                    rows={6}
                    value={importText}
                    onChange={event => analyzeBulkInput(event.target.value)}
                    placeholder={'1. consistency\n2. angular pattern\n3. environment'}
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm leading-relaxed"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Chọn TXT / CSV
                    <input type="file" accept=".txt,.csv,text/plain,text/csv" className="sr-only" onChange={async event => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const format = file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'text';
                      analyzeBulkInput(await file.text(), format);
                      event.currentTarget.value = '';
                    }} />
                  </label>
                  <button type="button" disabled={!importAnalysis?.parsed.length || isEnrichingImport} onClick={handleEnrichBulkImport} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
                    {isEnrichingImport ? 'Đang tra nghĩa…' : 'Tra nghĩa các mục mới'}
                  </button>
                  {importAnalysis && <span className="text-sm text-slate-500">{importAnalysis.parsed.length} mục · {importAnalysis.duplicateCount} mục trùng sẽ bỏ qua</span>}
                </div>
                {importAnalysis && enrichedImport.length === 0 && (
                  <div className="max-h-52 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 px-3">
                    {importAnalysis.previewCards.map(card => {
                      const suggestion = suggestVocabCorrection(card.word, [
                        ...allCards.map(existing => existing.word),
                        'independent', 'environment', 'significant', 'development', 'government', 'education'
                      ]);
                      const isDuplicate = allCards.some(existing => existing.word.trim().toLowerCase() === card.word.trim().toLowerCase());
                      return (
                        <div key={card.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2 text-sm">
                          <strong className="text-slate-800">{card.word}</strong>
                          <span className="text-xs text-slate-500">{card.word.includes(' ') ? 'Cụm từ' : 'Từ'}{isDuplicate ? ' · Đã có, sẽ bỏ qua' : ''}</span>
                          {suggestion && !isDuplicate && <>
                            <span className="text-xs text-amber-800">Có thể là {suggestion}</span>
                            <button type="button" onClick={() => setImportCorrections(current => ({ ...current, [card.word]: suggestion }))} className="text-xs font-semibold text-emerald-800 underline">Dùng gợi ý</button>
                            {importCorrections[card.word] && <button type="button" onClick={() => setImportCorrections(current => { const next = { ...current }; delete next[card.word]; return next; })} className="text-xs text-slate-500 underline">Giữ nguyên</button>}
                          </>}
                        </div>
                      );
                    })}
                    {importAnalysis.parsed.length > importAnalysis.previewCards.length && <p className="py-2 text-xs text-slate-500">Đang xem {importAnalysis.previewCards.length} mục đầu tiên.</p>}
                  </div>
                )}
                {importError && <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">{importError}</p>}
                {enrichedImport.length > 0 && (
                  <div className="max-h-72 space-y-3 overflow-y-auto rounded-xl border border-slate-200 p-3">
                    {enrichedImport.map((item, index) => (
                      <div key={item.card.id} className="grid gap-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <strong className="text-base text-slate-900">{item.card.word}</strong>
                          <span className="text-sm text-slate-500">{item.result.partOfSpeech}{item.result.phonetic ? ` · ${item.result.phonetic}` : ''}</span>
                        </div>
                        <select aria-label={`Nghĩa tiếng Anh của ${item.card.word}`} value={item.senseIndex} onChange={event => setEnrichedImport(current => current.map((entry, i) => i === index ? { ...entry, senseIndex: Number(event.target.value), meaningVi: entry.result.senses[Number(event.target.value)]?.viSuggestion || '' } : entry))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                          {item.result.senses.map((sense, senseIndex) => <option key={senseIndex} value={senseIndex}>{sense.partOfSpeech || item.result.partOfSpeech}: {sense.definitionEn}</option>)}
                        </select>
                        <input aria-label={`Xác nhận nghĩa tiếng Việt của ${item.card.word}`} value={item.meaningVi} onChange={event => setEnrichedImport(current => current.map((entry, i) => i === index ? { ...entry, meaningVi: event.target.value } : entry))} placeholder="Xác nhận nghĩa tiếng Việt" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                        {(item.card.example || item.card.sourceContext) && <p className="font-serif-reading text-base italic text-slate-600">{item.card.example || item.card.sourceContext}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Input Form */}
            {!bulkMode && <>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Từ tiếng Anh (Word):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={lookupWordInput}
                    onChange={(e) => setLookupWordInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleTriggerLookup(); }}
                    placeholder="VD: mitigate, significant, unprecedented..."
                    className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                  <button
                    type="button"
                    disabled={isLookingUp || !lookupWordInput.trim()}
                    onClick={handleTriggerLookup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isLookingUp ? 'Đang tra...' : 'Tra từ'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Câu ngữ cảnh (Tùy chọn - Giúp gợi ý đúng nét nghĩa):
                </label>
                <textarea
                  rows={2}
                  value={lookupContextInput}
                  onChange={(e) => setLookupContextInput(e.target.value)}
                  placeholder="VD: Governments should take measures to mitigate the effects of climate change."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Duplicate Word Warning */}
            {duplicateWarning && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 space-y-2">
                <div className="font-bold">⚠️ {duplicateWarning.message}</div>
                <div className="text-[11px] text-amber-800">
                  Thẻ hiện có: <strong>{duplicateWarning.card?.word}</strong> ({duplicateWarning.card?.definitionVi || 'Đang học'})
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSaveLookedUpWord(true)}
                    className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold cursor-pointer hover:bg-amber-700"
                  >
                    Thêm ngữ cảnh này vào thẻ hiện có
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1 bg-white border border-amber-300 text-amber-900 rounded text-xs cursor-pointer hover:bg-amber-100"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Lookup Result Display */}
            {lookupResult && (
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{lookupResult.word}</span>
                    <span className="text-xs font-mono text-slate-500">{lookupResult.phonetic}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-700">
                      {lookupResult.partOfSpeech}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => playPronunciation(lookupResult.word, voiceAccent)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-xs hover:bg-slate-100 cursor-pointer"
                  >
                    🔊 Nghe
                  </button>
                </div>

                {/* Senses selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Chọn nét nghĩa phù hợp với ngữ cảnh:
                  </label>
                  <div className="space-y-1.5">
                    {lookupResult.senses.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedSenseIndex(idx);
                          if (s.viSuggestion) setCustomMeaningVi(s.viSuggestion);
                        }}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedSenseIndex === idx
                            ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{s.definitionEn}</div>
                        {s.viSuggestion && (
                          <div className="text-blue-700 font-medium mt-0.5">
                            Gợi ý tiếng Việt: {s.viSuggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom meaning Vietnamese input */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nghĩa tiếng Việt xác nhận:
                  </label>
                  <input
                    type="text"
                    value={customMeaningVi}
                    onChange={(e) => setCustomMeaningVi(e.target.value)}
                    placeholder="VD: giảm nhẹ, làm dịu bớt..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-900 bg-white focus:outline-hidden"
                  />
                </div>

                {/* Collocations preview */}
                {lookupResult.collocations && lookupResult.collocations.length > 0 && (
                  <div className="text-[11px] text-slate-600">
                    <strong>Collocations:</strong> {lookupResult.collocations.join(', ')}
                  </div>
                )}
              </div>
            )}
            </>}

            {addFeedbackMsg && (
              <div className={`p-3 rounded text-xs font-semibold ${
                addFeedbackMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {addFeedbackMsg.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Đóng
              </button>
              {!bulkMode && lookupResult && lookupResult.senses.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleSaveLookedUpWord(false)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
                >
                  Xác nhận & Lưu thẻ
                </button>
              )}
              {bulkMode && (
                <button type="button" onClick={handleSaveBulkImport} disabled={!enrichedImport.length || enrichedImport.some(item => !item.result.senses[item.senseIndex]?.definitionEn.trim() || !item.meaningVi.trim())} className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40">
                  Xác nhận và lưu {enrichedImport.length} mục
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}

    </div>
  );
};
