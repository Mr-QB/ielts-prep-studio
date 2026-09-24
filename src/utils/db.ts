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
  SRSIntervalRating,
  VocabReviewLog,
  VocabLookupResult
} from '../types';
import { calculateNextSRS } from './srsEngine';

const DB_NAME = 'ielts_prep_studio_v2';
const DB_VERSION = 5;

let dbPromise: Promise<IDBDatabase> | null = null;
let currentActiveUser: UserProfile | null = null;

export function getActiveUser(): UserProfile | null {
  return currentActiveUser;
}

export function setActiveUser(user: UserProfile | null): void {
  currentActiveUser = user;
  if (user) {
    try { localStorage.setItem('ielts_prep_offline_profile', JSON.stringify(user)); } catch { /* browser storage may be disabled */ }
  }
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
        if (!db.objectStoreNames.contains('cached_dictionary')) {
          db.createObjectStore('cached_dictionary', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('user_data')) {
          db.createObjectStore('user_data', { keyPath: 'storeId' });
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id' });
        }
      };
    });
  }
  return dbPromise;
}

interface LocalRecord<T> { storeId: string; value: T; updatedAt: number; }
interface SyncChange {
  id: string;
  changeId: string;
  userId: string;
  entity: string;
  recordId: string;
  operation: 'upsert' | 'delete';
  payload: unknown;
  updatedAt: number;
}

async function readLocalData<T>(prefix: string, fallback: T): Promise<T> {
  const storeId = getUserKey(prefix);
  try {
    const db = await getDB();
    const row = await new Promise<LocalRecord<T> | undefined>((resolve, reject) => {
      const request = db.transaction('user_data', 'readonly').objectStore('user_data').get(storeId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (row) return row.value;
  } catch { /* migrate from localStorage or use the supplied default */ }
  try {
    const raw = localStorage.getItem(storeId);
    if (raw) {
      const value = JSON.parse(raw) as T;
      await writeLocalData(prefix, value);
      return value;
    }
  } catch { /* storage may be unavailable */ }
  return fallback;
}

async function writeLocalData<T>(prefix: string, value: T): Promise<void> {
  const storeId = getUserKey(prefix);
  const updatedAt = Date.now();
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('user_data', 'readwrite');
      tx.objectStore('user_data').put({ storeId, value, updatedAt } satisfies LocalRecord<T>);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch { /* localStorage remains a compatibility fallback */ }
  try { localStorage.setItem(storeId, JSON.stringify(value)); } catch { /* quota/private mode */ }
}

async function deleteLocalData(prefix: string): Promise<void> {
  const storeId = getUserKey(prefix);
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('user_data', 'readwrite');
      tx.objectStore('user_data').delete(storeId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch { /* keep localStorage compatibility */ }
  try { localStorage.removeItem(storeId); } catch { /* quota/private mode */ }
}

let syncTimer: number | undefined;
let syncRunning = false;

async function queueSyncChange(entity: string, recordId: string, payload: unknown, operation: 'upsert' | 'delete' = 'upsert'): Promise<void> {
  if (!currentActiveUser) return;
  const change: SyncChange = {
    id: `${currentActiveUser.id}:${entity}:${recordId}`,
    changeId: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    userId: currentActiveUser.id,
    entity,
    recordId,
    operation,
    payload,
    updatedAt: Date.now()
  };
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readwrite');
      tx.objectStore('sync_queue').put(change);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch { /* the local record is retained even if the outbox is unavailable */ }
  if (['decks', 'vocab_progress', 'grammar', 'protocol', 'mistake'].includes(entity)) {
    const versions = await readLocalData<Record<string, number>>('sync_versions', {});
    versions[`${entity}:${recordId}`] = change.updatedAt;
    await writeLocalData('sync_versions', versions);
  }
  if (navigator.onLine) {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => { syncPendingChanges().catch(() => {}); }, 800);
  }
}

async function syncPendingChanges(): Promise<void> {
  if (syncRunning || !currentActiveUser || !navigator.onLine) return;
  syncRunning = true;
  try {
    const db = await getDB();
    const queued = await new Promise<SyncChange[]>((resolve, reject) => {
      const request = db.transaction('sync_queue', 'readonly').objectStore('sync_queue').getAll();
      request.onsuccess = () => resolve(request.result.filter((change: SyncChange) => change.userId === currentActiveUser?.id));
      request.onerror = () => reject(request.error);
    });
    if (queued.length) {
      const response = await fetch('/api/sync/push', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes: queued.slice(0, 200) })
      });
      if (response.ok) {
        const { acceptedIds = [] } = await response.json();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction('sync_queue', 'readwrite');
          acceptedIds.forEach((id: string) => tx.objectStore('sync_queue').delete(id));
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      }
    }
    const cursorKey = `sync_cursor:${currentActiveUser.id}`;
    let cursor = await readLocalData<number>(cursorKey, 0);
    for (let page = 0; page < 20; page += 1) {
      const pulled = await fetch(`/api/sync/pull?cursor=${cursor}`, { signal: AbortSignal.timeout(5000) });
      if (!pulled.ok) break;
      const data = await pulled.json();
      const changes = data.changes as SyncChange[];
      for (const change of changes) await applyRemoteChange(change);
      if (!Number.isFinite(data.cursor) || data.cursor <= cursor) break;
      cursor = data.cursor;
      await writeLocalData(cursorKey, cursor);
      if (changes.length < 500) break;
    }
  } catch { /* retry on the next local change or online event */ }
  finally { syncRunning = false; }
}

async function applyRemoteChange(change: SyncChange): Promise<void> {
  if (!currentActiveUser || change.userId !== currentActiveUser.id) return;
  if (['decks', 'vocab_progress', 'grammar', 'protocol', 'mistake'].includes(change.entity)) {
    const versions = await readLocalData<Record<string, number>>('sync_versions', {});
    const versionKey = `${change.entity}:${change.recordId}`;
    if ((versions[versionKey] || 0) > change.updatedAt) return;
    versions[versionKey] = change.updatedAt;
    await writeLocalData('sync_versions', versions);
  }
  if (change.operation === 'delete') {
    if (change.entity === 'attempt') await writeLocalData('attempts', (await readLocalData<TestAttempt[]>('attempts', [])).filter(item => item.id !== change.recordId));
    if (change.entity === 'mistake') await writeLocalData('mistakes', (await readLocalData<RecordedMistake[]>('mistakes', [])).filter(item => item.id !== change.recordId));
    if (change.entity === 'vocab_review') await writeLocalData('vocab_review_logs', (await readLocalData<VocabReviewLog[]>('vocab_review_logs', [])).filter(item => item.id !== change.recordId));
    if (change.entity === 'protocol') await deleteLocalData(`protocol_${change.recordId}`);
    if (change.entity === 'grammar') {
      const progress = await readLocalData<Record<string, GrammarProgressStatus>>('grammar', {});
      delete progress[change.recordId];
      await writeLocalData('grammar', progress);
    }
    return;
  }
  const mergeById = <T extends { id: string }>(current: T[], incoming: T): T[] => [incoming, ...current.filter(item => item.id !== incoming.id)];
  switch (change.entity) {
    case 'decks':
      await writeLocalData('decks', change.payload as VocabDeck[]);
      break;
    case 'vocab_progress': {
      const decks = await readLocalData<VocabDeck[]>('decks', []);
      const card = change.payload as VocabCard;
      await writeLocalData('decks', decks.map(deck => ({ ...deck, cards: deck.cards.map(item => item.id === card.id ? card : item) })));
      break;
    }
    case 'attempt': {
      const attempts = await readLocalData<TestAttempt[]>('attempts', []);
      await writeLocalData('attempts', mergeById(attempts, change.payload as TestAttempt).slice(0, 100));
      break;
    }
    case 'mistake': {
      const mistakes = await readLocalData<RecordedMistake[]>('mistakes', []);
      await writeLocalData('mistakes', mergeById(mistakes, change.payload as RecordedMistake).slice(0, 200));
      break;
    }
    case 'grammar': {
      const progress = await readLocalData<Record<string, GrammarProgressStatus>>('grammar', {});
      await writeLocalData('grammar', { ...progress, [change.recordId]: change.payload as GrammarProgressStatus });
      break;
    }
    case 'protocol':
      await writeLocalData(`protocol_${change.recordId}`, change.payload as DailyProtocolRecord);
      break;
    case 'vocab_review': {
      const logs = await readLocalData<VocabReviewLog[]>('vocab_review_logs', []);
      await writeLocalData('vocab_review_logs', mergeById(logs, change.payload as VocabReviewLog).slice(0, 500));
      break;
    }
  }
}

if (typeof window !== 'undefined') window.addEventListener('online', () => { syncPendingChanges().catch(() => {}); });

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
        await syncPendingChanges();
        return data.user;
      }
    }
    if (res.status === 401) {
      try { localStorage.removeItem('ielts_prep_offline_profile'); } catch { /* browser storage may be disabled */ }
      setActiveUser(null);
      return null;
    }
  } catch {
    try {
      const cached = localStorage.getItem('ielts_prep_offline_profile');
      if (cached) {
        const profile = JSON.parse(cached) as UserProfile;
        setActiveUser(profile);
        return profile;
      }
    } catch { /* invalid or unavailable offline profile */ }
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
      syncPendingChanges().catch(() => {});
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
  try { localStorage.removeItem('ielts_prep_offline_profile'); } catch { /* browser storage may be disabled */ }
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

  const cached = await readLocalData<VocabDeck[]>('decks', []);
  if (cached.length > 0) return cached;

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
  writeLocalData('decks', decks).catch(() => {});
}

export async function saveDecksToStorage(decks: VocabDeck[]): Promise<void> {
  await writeLocalData('decks', decks);
  await queueSyncChange('decks', 'all', decks);
}

export interface AddWordCardData {
  word: string;
  definitionVi: string;
  definitionEn?: string;
  example?: string;
  collocations?: string[];
  paraphrases?: string[];
  category?: string;
  sourceContext?: string;
  source?: string;
  sourceType?: 'reading' | 'listening' | 'manual' | 'starter';
  sourceId?: string;
  phonetic?: string;
  partOfSpeech?: string;
  audio?: string;
  audioSource?: 'dictionary' | 'tts';
  lemma?: string;
  priority?: number;
  updateExisting?: boolean;
}

/**
 * Add a new user-captured card (Personal)
 */
export async function addWordToVocabDeck(
  cardData: AddWordCardData,
  deckId?: string
): Promise<{ success: boolean; message: string; isDuplicate?: boolean; existingCard?: VocabCard }> {
  try {
    const decks = await loadDecksFromStorage([]);
    if (!decks || decks.length === 0) {
      return { success: false, message: 'Chưa có bộ thẻ nào để thêm.' };
    }

    const targetDeck = deckId ? decks.find(d => d.id === deckId) || decks[0] : decks[0];
    const cleanWord = cardData.word.trim();
    if (!cleanWord || !cardData.definitionVi.trim() || !cardData.definitionEn?.trim() || /^(meaning of|ielts target vocabulary item)/i.test(cardData.definitionEn.trim())) {
      return { success: false, message: 'Cần có từ, định nghĩa tiếng Anh và nghĩa tiếng Việt đã xác nhận trước khi lưu.' };
    }

    // Check duplicate in all decks
    let existingCard: VocabCard | undefined;
    let existingDeck: VocabDeck | undefined;
    for (const d of decks) {
      const match = d.cards.find(c => c.word.toLowerCase() === cleanWord.toLowerCase());
      if (match) {
        existingCard = match;
        existingDeck = d;
        break;
      }
    }

    if (existingCard && !cardData.updateExisting) {
      return {
        success: false,
        isDuplicate: true,
        existingCard,
        message: `Từ "${cleanWord}" đã có trong bộ "${existingDeck?.name || 'Từ vựng'}".`
      };
    }

    if (existingCard && cardData.updateExisting) {
      // Append context or update definition
      if (cardData.sourceContext && !existingCard.sourceContext?.includes(cardData.sourceContext)) {
        existingCard.sourceContext = existingCard.sourceContext
          ? `${existingCard.sourceContext}\n• ${cardData.sourceContext}`
          : cardData.sourceContext;
      }
      if (cardData.definitionVi) {
        existingCard.definitionVi = cardData.definitionVi;
      }
      if (cardData.definitionEn) {
        existingCard.definitionEn = cardData.definitionEn;
      }
      await saveDecksToStorage(decks);

      return { success: true, message: `Đã cập nhật ngữ cảnh cho từ "${cleanWord}".` };
    }

    const newCard: VocabCard = {
      id: `vocab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      word: cleanWord,
      phonetic: cardData.phonetic || '',
      partOfSpeech: cardData.partOfSpeech || 'academic',
      definitionVi: cardData.definitionVi,
      definitionEn: cardData.definitionEn || cardData.definitionVi,
      example: cardData.example || cardData.sourceContext || '',
      collocations: cardData.collocations || [],
      paraphrases: cardData.paraphrases || [],
      category: cardData.category || 'Personal Vocabulary',
      source: cardData.source || 'IELTS Context Practice',
      sourceType: cardData.sourceType || 'manual',
      sourceId: cardData.sourceId,
      sourceContext: cardData.sourceContext || cardData.example || '',
      audio: cardData.audio,
      audioSource: cardData.audioSource || 'tts',
      lemma: cardData.lemma || cleanWord.toLowerCase(),
      priority: cardData.priority ?? (cardData.sourceType === 'reading' || cardData.sourceType === 'listening' ? 10 : 1),
      repetition: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
      state: 'new'
    };

    targetDeck.cards.unshift(newCard);
    await saveDecksToStorage(decks);

    return { success: true, message: `Đã thêm "${cleanWord}" vào bộ "${targetDeck.name}".` };
  } catch {
    return { success: false, message: 'Lỗi khi lưu thẻ từ vựng.' };
  }
}

export const saveCustomCard = addWordToVocabDeck;

/**
 * Check if word already exists in D1 or local cache
 */
export async function checkDuplicateWordApi(word: string): Promise<{ exists: boolean; card?: any }> {
  const cleanWord = word.trim().toLowerCase();
  try {
    const res = await fetch(`/api/vocab/check-duplicate?word=${encodeURIComponent(cleanWord)}`, {
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  // Fallback check against local cache
  try {
    const decks = await loadDecksFromStorage([]);
    for (const d of decks) {
      const match = d.cards.find(c => c.word.toLowerCase() === cleanWord);
      if (match) return { exists: true, card: match };
    }
  } catch {}

  return { exists: false };
}

/**
 * Vocab lookup with dictionary definitions, IPA, context relevance and Vietnamese suggestions
 */
export async function lookupVocabularyApi(word: string, context?: string): Promise<VocabLookupResult> {
  const cleanWord = word.trim();
  const cacheKey = `${cleanWord.toLowerCase()}|${context?.trim().toLowerCase() || ''}`;
  try {
    const url = `/api/vocab/lookup?word=${encodeURIComponent(cleanWord)}${context ? `&context=${encodeURIComponent(context)}` : ''}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.senses)) {
        try {
          const db = await getDB();
          const tx = db.transaction('cached_dictionary', 'readwrite');
          tx.objectStore('cached_dictionary').put({ key: cacheKey, value: data, cachedAt: Date.now() });
        } catch { /* browser storage may be unavailable */ }
        return data;
      }
    }
  } catch {}

  try {
    const db = await getDB();
    const cached = await new Promise<{ value: VocabLookupResult } | undefined>((resolve, reject) => {
      const request = db.transaction('cached_dictionary', 'readonly').objectStore('cached_dictionary').get(cacheKey);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (cached?.value) return cached.value;
  } catch { /* continue with an explicit unavailable result */ }

  return {
    word: cleanWord,
    lemma: cleanWord.toLowerCase(),
    phonetic: '',
    partOfSpeech: '',
    audioSource: 'tts',
    senses: []
  };
}

/**
 * Record a single active retrieval log item (local fallback + sync to D1)
 */
export async function logVocabReviewAction(log: VocabReviewLog): Promise<void> {
  const existing = await readLocalData<VocabReviewLog[]>('vocab_review_logs', []);
  await writeLocalData('vocab_review_logs', [log, ...existing.filter(item => item.id !== log.id)].slice(0, 500));
  await queueSyncChange('vocab_review', log.id, log);
}

export async function loadVocabReviewLogs(): Promise<VocabReviewLog[]> {
  return readLocalData<VocabReviewLog[]>('vocab_review_logs', []);
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
    state: next.state,
    difficulty: next.difficulty,
    stability: next.stability,
    retrievability: next.retrievability,
    masteryState: next.masteryState
  };

  await queueSyncChange('vocab_progress', cardId, updatedCard);

  return updatedCard;
}

// ==========================================
// 2. ATTEMPTS & TEST HISTORY (USER-ISOLATED)
// ==========================================

export async function loadAttemptsFromStorage(): Promise<TestAttempt[]> {
  const lsKey = getUserKey('attempts');

  const cached = await readLocalData<TestAttempt[]>('attempts', []);
  if (cached.length) return cached;

  try {
    const res = await fetch('/api/attempts', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.attempts)) {
        await writeLocalData('attempts', data.attempts);
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
  const attempts = await loadAttemptsFromStorage();
  await writeLocalData('attempts', [attempt, ...attempts.filter(item => item.id !== attempt.id)].slice(0, 100));
  await queueSyncChange('attempt', attempt.id, attempt);

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

  const cached = await readLocalData<RecordedMistake[]>('mistakes', []);
  if (cached.length) return cached;

  try {
    const res = await fetch('/api/mistakes', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.mistakes)) {
        await writeLocalData('mistakes', data.mistakes);
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
  const current = await loadMistakes();
  await writeLocalData('mistakes', [mistake, ...current.filter(item => item.id !== mistake.id)].slice(0, 200));
  await queueSyncChange('mistake', mistake.id, mistake);
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

  const cached = await readLocalData<Record<string, GrammarProgressStatus> | null>('grammar', null);
  if (cached) return cached;

  try {
    const res = await fetch('/api/grammar', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.progress) {
        await writeLocalData('grammar', data.progress);
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
  const current = await loadGrammarProgress();
  current[topicId] = status;
  await writeLocalData('grammar', current);
  await queueSyncChange('grammar', topicId, status);
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
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
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
  const diffTime = Math.max(0, now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(180, Math.max(1, diffDays));
}

export async function loadTodayProtocol(): Promise<DailyProtocolRecord> {
  const todayStr = getTodayDateString();
  const dayNum = calculateDayNumber();
  const lsKey = getUserKey(`protocol_${todayStr}`);

  const cached = await readLocalData<DailyProtocolRecord | null>(`protocol_${todayStr}`, null);
  if (cached) return cached;

  // 1. Try to fetch from Cloudflare D1
  try {
    const res = await fetch(`/api/protocol?date=${todayStr}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.record) {
        await writeLocalData(`protocol_${todayStr}`, data.record);
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
    streakDays: 0
  };
}

export async function saveTodayProtocol(record: DailyProtocolRecord): Promise<void> {
  await writeLocalData(`protocol_${record.date}`, record);
  await queueSyncChange('protocol', record.date, record);
}
