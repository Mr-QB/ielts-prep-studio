/**
 * Local-First IndexedDB Persistence with localStorage Fallback
 * Privacy-friendly, offline-ready storage for IELTS Prep Studio
 */
import {
  VocabDeck,
  TestAttempt,
  GrammarProgressStatus,
  RecordedMistake,
  WeakAreaStat,
  DailyProtocolRecord,
  DailyTaskItem,
  VocabCard
} from '../types';

const DB_NAME = 'ielts_prep_studio_v2';
const DB_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in environment'));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('decks')) {
          db.createObjectStore('decks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('attempts')) {
          db.createObjectStore('attempts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('grammar_progress')) {
          db.createObjectStore('grammar_progress', { keyPath: 'topicId' });
        }
        if (!db.objectStoreNames.contains('mistakes')) {
          db.createObjectStore('mistakes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('daily_protocol')) {
          db.createObjectStore('daily_protocol', { keyPath: 'date' });
        }
      };
    });
  }
  return dbPromise;
}

// Fallback keys for localStorage
const LS_DECKS_KEY = 'ielts_decks_v2';
const LS_ATTEMPTS_KEY = 'ielts_attempts_v2';
const LS_GRAMMAR_KEY = 'ielts_grammar_progress_v2';
const LS_MISTAKES_KEY = 'ielts_mistakes_v2';
const LS_PROTOCOL_KEY = 'ielts_protocol_v2';
const LS_START_DATE_KEY = 'ielts_study_start_date_v2';

// ==========================================
// 1. DECKS & VOCABULARY STORAGE
// ==========================================
export async function loadDecksFromStorage(defaultDecks: VocabDeck[]): Promise<VocabDeck[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('decks', 'readonly');
      const store = tx.objectStore('decks');
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result as VocabDeck[];
        if (results && results.length > 0) {
          resolve(results);
        } else {
          // Check localStorage migration
          const ls = localStorage.getItem(LS_DECKS_KEY);
          if (ls) {
            try {
              const parsed = JSON.parse(ls);
              if (Array.isArray(parsed) && parsed.length > 0) {
                saveDecksToStorage(parsed);
                return resolve(parsed);
              }
            } catch {
              // ignore
            }
          }
          saveDecksToStorage(defaultDecks);
          resolve(defaultDecks);
        }
      };
      req.onerror = () => resolve(defaultDecks);
    });
  } catch {
    try {
      const ls = localStorage.getItem(LS_DECKS_KEY);
      if (ls) return JSON.parse(ls);
    } catch {
      // fallback
    }
    return defaultDecks;
  }
}

export async function saveDecksToStorage(decks: VocabDeck[]): Promise<void> {
  try {
    localStorage.setItem(LS_DECKS_KEY, JSON.stringify(decks));
  } catch {
    // ignore
  }

  try {
    const db = await getDB();
    const tx = db.transaction('decks', 'readwrite');
    const store = tx.objectStore('decks');
    store.clear();
    decks.forEach(d => store.put(d));
  } catch {
    // safe fallback
  }
}

/**
 * Add a new vocabulary card directly to a deck (e.g. from Reading or Listening)
 */
export async function addWordToVocabDeck(
  cardData: {
    word: string;
    definitionVi: string;
    definitionEn?: string;
    example?: string;
    collocations?: string[];
    category?: string;
    sourceContext?: string;
    source?: string;
  },
  deckId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const decks = await loadDecksFromStorage([]);
    if (!decks || decks.length === 0) {
      return { success: false, message: 'Chưa có bộ thẻ nào để thêm.' };
    }

    const targetDeck = deckId ? decks.find(d => d.id === deckId) || decks[0] : decks[0];
    const cleanWord = cardData.word.trim();

    // Check if card already exists in target deck
    const existing = targetDeck.cards.find(c => c.word.toLowerCase() === cleanWord.toLowerCase());
    if (existing) {
      return { success: false, message: `Từ "${cleanWord}" đã có trong bộ "${targetDeck.name}".` };
    }

    const newCard: VocabCard = {
      id: `vocab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      word: cleanWord,
      phonetic: '',
      partOfSpeech: 'academic',
      definitionVi: cardData.definitionVi,
      definitionEn: cardData.definitionEn || cardData.definitionVi,
      example: cardData.example || cardData.sourceContext || '',
      collocations: cardData.collocations || [],
      category: cardData.category || 'Reading/Listening Capture',
      source: cardData.source || 'IELTS Context Practice',
      sourceContext: cardData.sourceContext || cardData.example || '',
      repetition: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
      state: 'new'
    };

    targetDeck.cards.unshift(newCard);
    await saveDecksToStorage(decks);
    return { success: true, message: `Đã thêm "${cleanWord}" vào bộ "${targetDeck.name}".` };
  } catch (err) {
    return { success: false, message: 'Lỗi khi lưu thẻ từ vựng.' };
  }
}

// ==========================================
// 2. ATTEMPTS & TEST HISTORY
// ==========================================
export async function loadAttemptsFromStorage(): Promise<TestAttempt[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('attempts', 'readonly');
      const store = tx.objectStore('attempts');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as TestAttempt[] || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    try {
      const ls = localStorage.getItem(LS_ATTEMPTS_KEY);
      return ls ? JSON.parse(ls) : [];
    } catch {
      return [];
    }
  }
}

export async function recordAttempt(attempt: TestAttempt): Promise<void> {
  try {
    const attempts = await loadAttemptsFromStorage();
    const updated = [attempt, ...attempts].slice(0, 100);
    localStorage.setItem(LS_ATTEMPTS_KEY, JSON.stringify(updated));

    const db = await getDB();
    const tx = db.transaction('attempts', 'readwrite');
    const store = tx.objectStore('attempts');
    store.put(attempt);
  } catch {
    // safe fallback
  }

  // Also automatically record any mistakes to the mistakes store
  if (attempt.mistakeTags && attempt.mistakeTags.length > 0) {
    for (const m of attempt.mistakeTags) {
      await recordDetailedMistake({
        id: `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        skill: attempt.skill,
        testId: attempt.sectionId,
        testTitle: attempt.sectionTitle,
        questionId: `${attempt.sectionId}-q${m.questionNumber}`,
        questionNumber: m.questionNumber,
        questionType: m.type,
        errorType: m.errorType,
        userAnswer: m.userAnswer,
        correctAnswer: m.correctAnswer,
        note: m.distractorNote || m.paraphraseNote,
        timestamp: attempt.date
      });
    }
  }
}

// ==========================================
// 3. MISTAKE TRACKER & WEAK-AREA ANALYTICS
// ==========================================
export async function loadMistakes(): Promise<RecordedMistake[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('mistakes', 'readonly');
      const store = tx.objectStore('mistakes');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as RecordedMistake[] || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    try {
      const ls = localStorage.getItem(LS_MISTAKES_KEY);
      return ls ? JSON.parse(ls) : [];
    } catch {
      return [];
    }
  }
}

export async function recordDetailedMistake(mistake: RecordedMistake): Promise<void> {
  try {
    const current = await loadMistakes();
    const updated = [mistake, ...current].slice(0, 200);
    localStorage.setItem(LS_MISTAKES_KEY, JSON.stringify(updated));

    const db = await getDB();
    const tx = db.transaction('mistakes', 'readwrite');
    const store = tx.objectStore('mistakes');
    store.put(mistake);
  } catch {
    // safe fallback
  }
}

export async function getWeakAreaStats(): Promise<WeakAreaStat[]> {
  const attempts = await loadAttemptsFromStorage();
  const typeMap: Record<string, { skill: 'reading' | 'listening'; total: number; incorrect: number }> = {};

  attempts.forEach(att => {
    // If attempt has questionTypeStats
    if (att.questionTypeStats) {
      Object.entries(att.questionTypeStats).forEach(([type, stat]) => {
        if (!typeMap[type]) {
          typeMap[type] = { skill: att.skill, total: 0, incorrect: 0 };
        }
        typeMap[type].total += stat.total;
        typeMap[type].incorrect += (stat.total - stat.correct);
      });
    } else if (att.mistakeTags) {
      // Estimate from mistake tags
      att.mistakeTags.forEach(m => {
        if (!typeMap[m.type]) {
          typeMap[m.type] = { skill: att.skill, total: 0, incorrect: 0 };
        }
        typeMap[m.type].incorrect += 1;
        typeMap[m.type].total = Math.max(typeMap[m.type].total + 1, typeMap[m.type].incorrect + 1);
      });
    }
  });

  const stats: WeakAreaStat[] = Object.entries(typeMap).map(([type, data]) => {
    const correct = Math.max(0, data.total - data.incorrect);
    const rate = data.total > 0 ? Math.round((correct / data.total) * 100) : 100;

    let recommendation = `Tiếp tục duy trì dạng bài ${type}.`;
    if (rate < 60) {
      recommendation = `Độ chính xác thấp (${rate}%). Nên ưu tiên luyện thêm 1–2 set dạng ${type}.`;
    } else if (rate < 75) {
      recommendation = `Cần chú ý bẫy từ đồng nghĩa và từ gây nhiễu trong dạng ${type}.`;
    }

    return {
      questionType: type,
      skill: data.skill,
      totalQuestions: data.total,
      incorrectCount: data.incorrect,
      accuracyRate: rate,
      recommendation
    };
  });

  // Sort lowest accuracy first
  return stats.sort((a, b) => a.accuracyRate - b.accuracyRate);
}

// ==========================================
// 4. GRAMMAR PROGRESS
// ==========================================
export async function loadGrammarProgress(): Promise<Record<string, GrammarProgressStatus>> {
  try {
    const ls = localStorage.getItem(LS_GRAMMAR_KEY);
    if (ls) return JSON.parse(ls);
  } catch {
    // ignore
  }
  return {};
}

export async function saveGrammarProgress(topicId: string, status: GrammarProgressStatus): Promise<void> {
  try {
    const current = await loadGrammarProgress();
    current[topicId] = status;
    localStorage.setItem(LS_GRAMMAR_KEY, JSON.stringify(current));

    const db = await getDB();
    const tx = db.transaction('grammar_progress', 'readwrite');
    tx.objectStore('grammar_progress').put({ topicId, status, lastStudied: new Date().toISOString() });
  } catch {
    // ignore
  }
}

// ==========================================
// 5. DAILY STUDY PROTOCOL & 180-DAY TRACKER
// ==========================================
export const DEFAULT_DAILY_TASKS: DailyTaskItem[] = [
  {
    id: 'task-vocab',
    title: 'Vocabulary SRS Review',
    subtitle: 'Ôn thẻ đến hạn & ghi nhớ từ học thuật',
    durationMin: 20,
    completed: false,
    tabTarget: 'vocab'
  },
  {
    id: 'task-grammar',
    title: 'Grammar Concept & Exercise',
    subtitle: 'Học 1 chủ điểm Essential & làm mini-test',
    durationMin: 25,
    completed: false,
    tabTarget: 'grammar'
  },
  {
    id: 'task-reading',
    title: 'Reading Practice / Passage',
    subtitle: 'Luyện 1 dạng bài hoặc 1 full passage chuẩn',
    durationMin: 50,
    completed: false,
    tabTarget: 'reading'
  },
  {
    id: 'task-listening',
    title: 'Listening Practice / Section',
    subtitle: 'Luyện nghe bẫy distractor & phân tích transcript',
    durationMin: 50,
    completed: false,
    tabTarget: 'listening'
  },
  {
    id: 'task-mistake',
    title: 'Mistake Review & Paraphrase',
    subtitle: 'Xem lại các câu làm sai & lưu từ mới vào SRS',
    durationMin: 20,
    completed: false,
    tabTarget: 'today'
  },
  {
    id: 'task-academic-read',
    title: 'Scientific / Academic Reading',
    subtitle: 'Đọc bài báo khoa học ngắn để tăng tốc độ đọc',
    durationMin: 15,
    completed: false,
    tabTarget: 'reading'
  }
];

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getStudyStartDate(): string {
  try {
    let start = localStorage.getItem(LS_START_DATE_KEY);
    if (!start) {
      start = getTodayDateString();
      localStorage.setItem(LS_START_DATE_KEY, start);
    }
    return start;
  } catch {
    return getTodayDateString();
  }
}

export function calculateDayNumber(): number {
  const start = new Date(getStudyStartDate());
  const now = new Date(getTodayDateString());
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(180, Math.max(1, diffDays));
}

export async function loadTodayProtocol(): Promise<DailyProtocolRecord> {
  const todayStr = getTodayDateString();
  const dayNum = calculateDayNumber();

  try {
    const ls = localStorage.getItem(`${LS_PROTOCOL_KEY}_${todayStr}`);
    if (ls) {
      return JSON.parse(ls);
    }
  } catch {
    // ignore
  }

  return {
    date: todayStr,
    dayNumber: dayNum,
    tasks: DEFAULT_DAILY_TASKS,
    streakDays: 1
  };
}

export async function saveTodayProtocol(record: DailyProtocolRecord): Promise<void> {
  try {
    localStorage.setItem(`${LS_PROTOCOL_KEY}_${record.date}`, JSON.stringify(record));
    const db = await getDB();
    const tx = db.transaction('daily_protocol', 'readwrite');
    tx.objectStore('daily_protocol').put(record);
  } catch {
    // ignore
  }
}
