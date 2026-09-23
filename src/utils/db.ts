/**
 * Hybrid Multi-User Cloudflare D1 & Namespaced Local Storage Data Layer
 * Primary: Cloudflare D1 via Backend API
 * Fallback / Cache: IndexedDB & localStorage strictly partitioned by user ID.
 */
import {
  VocabDeck,
  TestAttempt,
  GrammarProgressStatus,
  RecordedMistake,
  WeakAreaStat,
  DailyProtocolRecord,
  DailyTaskItem,
  VocabCard,
  UserProfile,
  SRSIntervalRating
} from '../types';
import { calculateNextSRS } from './srsEngine';

const DB_NAME = 'ielts_prep_studio_v2';
const DB_VERSION = 3;

let dbPromise: Promise<IDBDatabase> | null = null;
let currentActiveUser: UserProfile | null = null;

export function getActiveUser(): UserProfile | null {
  return currentActiveUser;
}

export function setActiveUser(user: UserProfile | null): void {
  currentActiveUser = user;
}

function getUserKey(prefix: string): string {
  const uid = currentActiveUser?.id || 'anonymous';
  return `user:${uid}:${prefix}`;
}

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
        // Namespaced object stores with compound keys or user partition
        if (!db.objectStoreNames.contains('user_decks')) {
          db.createObjectStore('user_decks', { keyPath: 'storeId' });
        }
        if (!db.objectStoreNames.contains('user_attempts')) {
          db.createObjectStore('user_attempts', { keyPath: 'storeId' });
        }
        if (!db.objectStoreNames.contains('user_grammar')) {
          db.createObjectStore('user_grammar', { keyPath: 'storeId' });
        }
        if (!db.objectStoreNames.contains('user_mistakes')) {
          db.createObjectStore('user_mistakes', { keyPath: 'storeId' });
        }
        if (!db.objectStoreNames.contains('user_protocol')) {
          db.createObjectStore('user_protocol', { keyPath: 'storeId' });
        }
      };
    });
  }
  return dbPromise;
}

/**
 * Health & Connection check for Cloudflare D1
 */
export async function checkD1Status(): Promise<{ connected: boolean; latencyMs?: number }> {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return {
        connected: Boolean(data?.d1?.connected),
        latencyMs: data?.d1?.latencyMs
      };
    }
  } catch {
    // Offline or API unreachable
  }
  return { connected: false };
}

// ==========================================
// 0. AUTHENTICATION & PROFILE APIS
// ==========================================

export async function fetchCurrentUser(): Promise<UserProfile | null> {
  try {
    const res = await fetch('/api/auth/me', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        setActiveUser(data.user);
        return data.user;
      }
    }
  } catch {
    // Offline or unauthenticated
  }
  setActiveUser(null);
  return null;
}

export async function loginUser(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      setActiveUser(data.user);
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error || 'Login failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during login' };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // ignore
  }
  setActiveUser(null);
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      setActiveUser(data.user);
      return data.user;
    }
  } catch {
    // ignore
  }
  return null;
}

// ==========================================
// 1. DECKS & VOCABULARY STORAGE (USER-ISOLATED)
// ==========================================

export async function loadDecksFromStorage(defaultDecks: VocabDeck[]): Promise<VocabDeck[]> {
  const lsKey = getUserKey('decks');

  // 1. Try to fetch from Cloudflare D1 via /api/decks
  try {
    const res = await fetch('/api/decks', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.decks) && data.decks.length > 0) {
        saveDecksToLocalCache(data.decks);
        return data.decks;
      }
    }
  } catch {
    // Offline fallback
  }

  // 2. Fallback to namespaced localStorage
  try {
    const ls = localStorage.getItem(lsKey);
    if (ls) {
      const parsed = JSON.parse(ls);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  return defaultDecks;
}

function saveDecksToLocalCache(decks: VocabDeck[]): void {
  try {
    const lsKey = getUserKey('decks');
    localStorage.setItem(lsKey, JSON.stringify(decks));
  } catch {
    // safe fallback
  }
}

export async function saveDecksToStorage(decks: VocabDeck[]): Promise<void> {
  saveDecksToLocalCache(decks);

  try {
    fetch('/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decks })
    }).catch(() => {});
  } catch {
    // Offline safe
  }
}

/**
 * Add a new user-captured card (Personal)
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
    saveDecksToLocalCache(decks);

    // Sync to /api/vocab/card
    fetch('/api/vocab/card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card: newCard, deckId: targetDeck.id })
    }).catch(() => {});

    return { success: true, message: `Đã thêm "${cleanWord}" vào bộ "${targetDeck.name}".` };
  } catch {
    return { success: false, message: 'Lỗi khi lưu thẻ từ vựng.' };
  }
}

/**
 * Review a card using SuperMemo SM-2 and sync user_vocab_progress to D1
 */
export async function reviewCardSRS(
  cardId: string,
  rating: SRSIntervalRating,
  card: VocabCard
): Promise<VocabCard> {
  const next = calculateNextSRS(card, rating);
  const updatedCard: VocabCard = {
    ...card,
    repetition: next.repetition,
    intervalDays: next.intervalDays,
    easeFactor: next.easeFactor,
    dueDate: next.dueDate,
    lastReviewed: new Date().toISOString(),
    state: next.state
  };

  // Sync to Cloudflare D1
  fetch('/api/vocab/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cardId,
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      repetitions: next.repetition,
      nextReview: next.dueDate,
      learningStatus: next.state
    })
  }).catch(() => {});

  return updatedCard;
}

// ==========================================
// 2. ATTEMPTS & TEST HISTORY (USER-ISOLATED)
// ==========================================

export async function loadAttemptsFromStorage(): Promise<TestAttempt[]> {
  const lsKey = getUserKey('attempts');

  try {
    const res = await fetch('/api/attempts', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.attempts)) {
        localStorage.setItem(lsKey, JSON.stringify(data.attempts));
        return data.attempts;
      }
    }
  } catch {
    // fallback to local
  }

  try {
    const ls = localStorage.getItem(lsKey);
    return ls ? JSON.parse(ls) : [];
  } catch {
    return [];
  }
}

export async function recordAttempt(attempt: TestAttempt): Promise<void> {
  const lsKey = getUserKey('attempts');
  try {
    const attempts = await loadAttemptsFromStorage();
    const updated = [attempt, ...attempts].slice(0, 100);
    localStorage.setItem(lsKey, JSON.stringify(updated));
  } catch {
    // safe fallback
  }

  // Sync to Cloudflare D1
  fetch('/api/attempts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attempt)
  }).catch(() => {});

  // Also automatically record any mistakes to the local mistakes store
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
// 3. MISTAKE TRACKER & WEAK-AREA ANALYTICS (USER-ISOLATED)
// ==========================================

export async function loadMistakes(): Promise<RecordedMistake[]> {
  const lsKey = getUserKey('mistakes');

  try {
    const res = await fetch('/api/mistakes', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.mistakes)) {
        localStorage.setItem(lsKey, JSON.stringify(data.mistakes));
        return data.mistakes;
      }
    }
  } catch {
    // fallback
  }

  try {
    const ls = localStorage.getItem(lsKey);
    return ls ? JSON.parse(ls) : [];
  } catch {
    return [];
  }
}

export async function recordDetailedMistake(mistake: RecordedMistake): Promise<void> {
  const lsKey = getUserKey('mistakes');
  try {
    const current = await loadMistakes();
    const updated = [mistake, ...current].slice(0, 200);
    localStorage.setItem(lsKey, JSON.stringify(updated));
  } catch {
    // safe fallback
  }

  fetch('/api/mistakes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mistake)
  }).catch(() => {});
}

export async function getWeakAreaStats(): Promise<WeakAreaStat[]> {
  const attempts = await loadAttemptsFromStorage();
  const typeMap: Record<string, { skill: 'reading' | 'listening'; total: number; incorrect: number }> = {};

  attempts.forEach(att => {
    if (att.questionTypeStats) {
      Object.entries(att.questionTypeStats).forEach(([type, stat]) => {
        if (!typeMap[type]) {
          typeMap[type] = { skill: att.skill, total: 0, incorrect: 0 };
        }
        typeMap[type].total += stat.total;
        typeMap[type].incorrect += (stat.total - stat.correct);
      });
    } else if (att.mistakeTags) {
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

  return stats.sort((a, b) => a.accuracyRate - b.accuracyRate);
}

// ==========================================
// 4. GRAMMAR PROGRESS (USER-ISOLATED)
// ==========================================

export async function loadGrammarProgress(): Promise<Record<string, GrammarProgressStatus>> {
  const lsKey = getUserKey('grammar');

  try {
    const res = await fetch('/api/grammar', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.progress) {
        localStorage.setItem(lsKey, JSON.stringify(data.progress));
        return data.progress;
      }
    }
  } catch {
    // fallback
  }

  try {
    const ls = localStorage.getItem(lsKey);
    if (ls) return JSON.parse(ls);
  } catch {
    // ignore
  }
  return {};
}

export async function saveGrammarProgress(topicId: string, status: GrammarProgressStatus): Promise<void> {
  const lsKey = getUserKey('grammar');
  try {
    const current = await loadGrammarProgress();
    current[topicId] = status;
    localStorage.setItem(lsKey, JSON.stringify(current));
  } catch {
    // ignore
  }

  fetch('/api/grammar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topicId, status })
  }).catch(() => {});
}

// ==========================================
// 5. DAILY STUDY PROTOCOL & 180-DAY TRACKER (USER-ISOLATED)
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
  if (currentActiveUser?.roadmapStartDate) {
    return currentActiveUser.roadmapStartDate;
  }
  const lsKey = getUserKey('startDate');
  try {
    let start = localStorage.getItem(lsKey);
    if (!start) {
      start = getTodayDateString();
      localStorage.setItem(lsKey, start);
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
  const lsKey = getUserKey(`protocol_${todayStr}`);

  // 1. Try to fetch from Cloudflare D1
  try {
    const res = await fetch(`/api/protocol?date=${todayStr}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.record) {
        localStorage.setItem(lsKey, JSON.stringify(data.record));
        return data.record;
      }
    }
  } catch {
    // fallback
  }

  // 2. Fallback to namespaced localStorage
  try {
    const ls = localStorage.getItem(lsKey);
    if (ls) {
      return JSON.parse(ls);
    }
  } catch {
    // ignore
  }

  // Scale tasks duration to match user's daily study minutes if customized
  const totalMins = currentActiveUser?.dailyStudyMinutes || 180;
  const scale = totalMins / 180;
  const scaledTasks = DEFAULT_DAILY_TASKS.map(t => ({
    ...t,
    durationMin: Math.max(5, Math.round(t.durationMin * scale))
  }));

  return {
    date: todayStr,
    dayNumber: dayNum,
    tasks: scaledTasks,
    streakDays: 1
  };
}

export async function saveTodayProtocol(record: DailyProtocolRecord): Promise<void> {
  const lsKey = getUserKey(`protocol_${record.date}`);
  try {
    localStorage.setItem(lsKey, JSON.stringify(record));
  } catch {
    // ignore
  }

  fetch('/api/protocol', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  }).catch(() => {});
}
