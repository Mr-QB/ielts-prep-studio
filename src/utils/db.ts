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
  VocabCard,
  UserProfile,
  SRSIntervalRating,
  VocabReviewLog,
  VocabLookupResult,
  LearningPosition,
  CambridgeWritingWork,
  CambridgePracticeDraft,
  StudyPlanSettings
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

function getUserKey(prefix: string, userId = currentActiveUser?.id || 'anonymous'): string {
  const uid = userId;
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

async function readLocalData<T>(prefix: string, fallback: T, userId?: string): Promise<T> {
  const storeId = getUserKey(prefix, userId);
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
      await writeLocalData(prefix, value, userId);
      return value;
    }
  } catch { /* storage may be unavailable */ }
  return fallback;
}

async function writeLocalData<T>(prefix: string, value: T, userId?: string): Promise<void> {
  const storeId = getUserKey(prefix, userId);
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

export async function loadPrivateBookCache<T>(key: string): Promise<T | null> {
  return readLocalData<T | null>(`private_book_cache:${key}`, null);
}

export async function savePrivateBookCache<T>(key: string, value: T): Promise<void> {
  await writeLocalData(`private_book_cache:${key}`, value);
}

export const loadVocabularyLearningSession = <T>() => readLocalData<T | null>('vocab_learning_session', null);
export const saveVocabularyLearningSession = <T>(session: T) => writeLocalData('vocab_learning_session', session);
export const clearVocabularyLearningSession = () => deleteLocalData('vocab_learning_session');

async function deleteLocalData(prefix: string, userId?: string): Promise<void> {
  const storeId = getUserKey(prefix, userId);
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
let syncRunning = false; // ponytail: serializes accounts in one tab; key by user only if sync becomes parallel.

async function queueSyncChange(entity: string, recordId: string, payload: unknown, operation: 'upsert' | 'delete' = 'upsert'): Promise<void> {
  if (!currentActiveUser) return;
  const userId = currentActiveUser.id;
  const change: SyncChange = {
    id: `${userId}:${entity}:${recordId}`,
    changeId: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    userId,
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
  if (['decks', 'vocab_progress', 'grammar', 'protocol', 'mistake', 'learning_position', 'cambridge_writing', 'cambridge_practice', 'planner_settings'].includes(entity)) {
    const versions = await readLocalData<Record<string, number>>('sync_versions', {}, userId);
    versions[`${entity}:${recordId}`] = change.updatedAt;
    await writeLocalData('sync_versions', versions, userId);
  }
  if (navigator.onLine) {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => { syncPendingChanges().catch(() => {}); }, 800);
  }
}

async function syncPendingChanges(): Promise<void> {
  if (syncRunning || !currentActiveUser || !navigator.onLine) return;
  const syncUserId = currentActiveUser.id;
  syncRunning = true;
  try {
    const db = await getDB();
    const queued = await new Promise<SyncChange[]>((resolve, reject) => {
      const request = db.transaction('sync_queue', 'readonly').objectStore('sync_queue').getAll();
      request.onsuccess = () => resolve(request.result.filter((change: SyncChange) => change.userId === syncUserId));
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
    const cursorKey = `sync_cursor:${syncUserId}`;
    let cursor = await readLocalData<number>(cursorKey, 0, syncUserId);
    for (let page = 0; page < 20; page += 1) {
      const pulled = await fetch(`/api/sync/pull?cursor=${cursor}`, { signal: AbortSignal.timeout(5000) });
      if (!pulled.ok) break;
      const data = await pulled.json();
      const changes = data.changes as SyncChange[];
      for (const change of changes) await applyRemoteChange(change, syncUserId);
      if (!Number.isFinite(data.cursor) || data.cursor <= cursor) break;
      cursor = data.cursor;
      await writeLocalData(cursorKey, cursor, syncUserId);
      if (changes.length < 500) break;
    }
  } catch { /* retry on the next local change or online event */ }
  finally {
    syncRunning = false;
    if (currentActiveUser && currentActiveUser.id !== syncUserId) void syncPendingChanges();
  }
}

async function applyRemoteChange(change: SyncChange, userId: string): Promise<void> {
  if (change.userId !== userId) return;
  if (['decks', 'vocab_progress', 'grammar', 'protocol', 'mistake', 'learning_position', 'cambridge_writing', 'cambridge_practice', 'planner_settings'].includes(change.entity)) {
    const versions = await readLocalData<Record<string, number>>('sync_versions', {}, userId);
    const versionKey = `${change.entity}:${change.recordId}`;
    if ((versions[versionKey] || 0) > change.updatedAt) return;
    versions[versionKey] = change.updatedAt;
    await writeLocalData('sync_versions', versions, userId);
  }
  if (change.operation === 'delete') {
    if (change.entity === 'attempt') await writeLocalData('attempts', (await readLocalData<TestAttempt[]>('attempts', [], userId)).filter(item => item.id !== change.recordId), userId);
    if (change.entity === 'mistake') await writeLocalData('mistakes', (await readLocalData<RecordedMistake[]>('mistakes', [], userId)).filter(item => item.id !== change.recordId), userId);
    if (change.entity === 'vocab_review') await writeLocalData('vocab_review_logs', (await readLocalData<VocabReviewLog[]>('vocab_review_logs', [], userId)).filter(item => item.id !== change.recordId), userId);
    if (change.entity === 'protocol') await deleteLocalData(`protocol_${change.recordId}`, userId);
    if (change.entity === 'learning_position') await deleteLocalData('learning_position', userId);
    if (change.entity === 'planner_settings') await deleteLocalData('study_plan_settings', userId);
    if (change.entity === 'cambridge_writing') {
      const work = await readLocalData<Record<string, CambridgeWritingWork>>('cambridge_writing', {}, userId);
      delete work[change.recordId];
      await writeLocalData('cambridge_writing', work, userId);
    }
    if (change.entity === 'cambridge_practice') {
      const drafts = await readLocalData<Record<string, CambridgePracticeDraft>>('cambridge_practice', {}, userId);
      delete drafts[change.recordId];
      await writeLocalData('cambridge_practice', drafts, userId);
    }
    if (change.entity === 'grammar') {
      const progress = await readLocalData<Record<string, GrammarProgressStatus>>('grammar', {}, userId);
      delete progress[change.recordId];
      await writeLocalData('grammar', progress, userId);
    }
    return;
  }
  const mergeById = <T extends { id: string }>(current: T[], incoming: T): T[] => [incoming, ...current.filter(item => item.id !== incoming.id)];
  switch (change.entity) {
    case 'decks':
      await writeLocalData('decks', change.payload as VocabDeck[], userId);
      break;
    case 'vocab_progress': {
      const decks = await readLocalData<VocabDeck[]>('decks', [], userId);
      const card = change.payload as VocabCard;
      await writeLocalData('decks', decks.map(deck => ({ ...deck, cards: deck.cards.map(item => item.id === card.id ? card : item) })), userId);
      break;
    }
    case 'attempt': {
      const attempts = await readLocalData<TestAttempt[]>('attempts', [], userId);
      await writeLocalData('attempts', mergeById(attempts, change.payload as TestAttempt).slice(0, 100), userId);
      break;
    }
    case 'mistake': {
      const mistakes = await readLocalData<RecordedMistake[]>('mistakes', [], userId);
      await writeLocalData('mistakes', mergeById(mistakes, change.payload as RecordedMistake).slice(0, 200), userId);
      break;
    }
    case 'grammar': {
      const progress = await readLocalData<Record<string, GrammarProgressStatus>>('grammar', {}, userId);
      await writeLocalData('grammar', { ...progress, [change.recordId]: change.payload as GrammarProgressStatus }, userId);
      break;
    }
    case 'protocol':
      await writeLocalData(`protocol_${change.recordId}`, change.payload as DailyProtocolRecord, userId);
      break;
    case 'learning_position':
      await writeLocalData('learning_position', change.payload as LearningPosition, userId);
      break;
    case 'planner_settings':
      await writeLocalData('study_plan_settings', change.payload as StudyPlanSettings, userId);
      break;
    case 'cambridge_writing': {
      const work = await readLocalData<Record<string, CambridgeWritingWork>>('cambridge_writing', {}, userId);
      await writeLocalData('cambridge_writing', { ...work, [change.recordId]: change.payload as CambridgeWritingWork }, userId);
      break;
    }
    case 'cambridge_practice': {
      const drafts = await readLocalData<Record<string, CambridgePracticeDraft>>('cambridge_practice', {}, userId);
      await writeLocalData('cambridge_practice', { ...drafts, [change.recordId]: change.payload as CambridgePracticeDraft }, userId);
      break;
    }
    case 'vocab_review': {
      const logs = await readLocalData<VocabReviewLog[]>('vocab_review_logs', [], userId);
      await writeLocalData('vocab_review_logs', mergeById(logs, change.payload as VocabReviewLog).slice(0, 500), userId);
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
  sourcePackId?: string;
  sourceTestNumber?: number;
  sourceSectionNumber?: number;
  phonetic?: string;
  partOfSpeech?: string;
  audio?: string;
  audioSource?: 'dictionary' | 'tts';
  lemma?: string;
  priority?: number;
  updateExisting?: boolean;
}

const starterDeckIds = new Set(['core-band-4-5', 'starter-academic-core', 'starter-upgrade-band-7']);
const starterCardIdPrefixes = ['v-core-', 'v-acad-', 'v-upg-'];

/** Hide built-in placeholder cards while keeping learner cards saved in those decks visible. */
export function getLearnerVocabDecks(decks: VocabDeck[]): VocabDeck[] {
  const learnerDecks = decks.filter(deck => !starterDeckIds.has(deck.id));
  const legacyCards = decks.filter(deck => starterDeckIds.has(deck.id))
    .flatMap(deck => deck.cards.filter(card => !starterCardIdPrefixes.some(prefix => card.id.startsWith(prefix))));

  if (!legacyCards.length) return learnerDecks;
  const legacyDeckId = 'personal-vocab-legacy';
  const existing = learnerDecks.find(deck => deck.id === legacyDeckId);
  if (existing) {
    return learnerDecks.map(deck => deck.id === legacyDeckId
      ? { ...deck, cards: [...deck.cards, ...legacyCards.filter(card => !deck.cards.some(existingCard => existingCard.id === card.id))] }
      : deck);
  }
  return [...learnerDecks, {
    id: legacyDeckId,
    name: 'My vocabulary',
    description: 'Words you previously saved.',
    createdAt: new Date().toISOString(),
    source: 'user_created',
    cards: legacyCards,
  }];
}

/**
 * Add a new user-captured card (Personal)
 */
export async function addWordToVocabDeck(
  cardData: AddWordCardData,
  deckId?: string
): Promise<{ success: boolean; message: string; isDuplicate?: boolean; existingCard?: VocabCard }> {
  try {
    let decks = await loadDecksFromStorage([]);
    let targetDeck = deckId && !starterDeckIds.has(deckId) ? decks.find(deck => deck.id === deckId) : undefined;
    targetDeck ||= decks.find(deck => !starterDeckIds.has(deck.id));
    const cleanWord = cardData.word.trim();
    if (!cleanWord || !cardData.definitionVi.trim() || !cardData.definitionEn?.trim() || /^(meaning of|ielts target vocabulary item)/i.test(cardData.definitionEn.trim())) {
      return { success: false, message: 'Cần có từ, định nghĩa tiếng Anh và nghĩa tiếng Việt đã xác nhận trước khi lưu.' };
    }

    if (!targetDeck) {
      const owner = currentActiveUser?.id || 'local';
      targetDeck = { id: `personal-vocab-${owner}`, name: 'My vocabulary', description: 'Words saved from Cambridge or added by you.', createdAt: new Date().toISOString(), source: 'user_created', cards: [] };
      decks = [...decks, targetDeck];
      await saveDecksToStorage(decks);
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
      sourcePackId: cardData.sourcePackId,
      sourceTestNumber: cardData.sourceTestNumber,
      sourceSectionNumber: cardData.sourceSectionNumber,
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
        questionPrompt: m.questionPrompt,
        options: m.options,
        note: m.distractorNote || m.paraphraseNote,
        timestamp: attempt.date,
        status: 'new',
        retryCount: 0,
        consecutiveCorrect: 0,
        source: attempt.source,
        sourcePackId: attempt.sourcePackId,
        module: attempt.module,
        bookId: attempt.bookId,
        testNumber: attempt.testNumber,
        sectionNumber: m.sectionNumber ?? attempt.sectionNumber,
        sourcePage: m.sourcePage,
        sourcePdfPage: m.sourcePdfPage
      });
    }
  }
}

export async function markAttemptReviewed(attemptId: string): Promise<void> {
  const attempts = await loadAttemptsFromStorage();
  const updated = attempts.map(attempt => attempt.id === attemptId ? { ...attempt, reviewedAt: new Date().toISOString() } : attempt);
  await writeLocalData('attempts', updated);
  const reviewed = updated.find(attempt => attempt.id === attemptId);
  if (reviewed) await queueSyncChange('attempt', reviewed.id, reviewed);
}

export const loadLearningPosition = () => readLocalData<LearningPosition | null>('learning_position', null);

export const loadStudyPlanSettings = () => readLocalData<StudyPlanSettings | null>('study_plan_settings', null);

export async function saveStudyPlanSettings(settings: StudyPlanSettings): Promise<void> {
  await writeLocalData('study_plan_settings', settings);
  await queueSyncChange('planner_settings', settings.id, settings);
}

export async function saveLearningPosition(position: LearningPosition): Promise<void> {
  await writeLocalData('learning_position', position);
  await queueSyncChange('learning_position', 'current', position);
}

export async function clearLearningPosition(): Promise<void> {
  await deleteLocalData('learning_position');
  await queueSyncChange('learning_position', 'current', null, 'delete');
}

export const loadCambridgeWritingWork = () => readLocalData<Record<string, CambridgeWritingWork>>('cambridge_writing', {});

export async function saveCambridgeWritingWork(work: CambridgeWritingWork): Promise<void> {
  const all = await loadCambridgeWritingWork();
  all[work.id] = work;
  await writeLocalData('cambridge_writing', all);
  await queueSyncChange('cambridge_writing', work.id, work);
}

export const loadCambridgePracticeDraft = async (id: string) => (await readLocalData<Record<string, CambridgePracticeDraft>>('cambridge_practice', {}))[id] ?? null;

export async function saveCambridgePracticeDraft(draft: CambridgePracticeDraft): Promise<void> {
  const drafts = await readLocalData<Record<string, CambridgePracticeDraft>>('cambridge_practice', {});
  drafts[draft.id] = draft;
  await writeLocalData('cambridge_practice', drafts);
  await queueSyncChange('cambridge_practice', draft.id, draft);
}

export async function clearCambridgePracticeDraft(id: string): Promise<void> {
  const drafts = await readLocalData<Record<string, CambridgePracticeDraft>>('cambridge_practice', {});
  delete drafts[id];
  await writeLocalData('cambridge_practice', drafts);
  await queueSyncChange('cambridge_practice', id, null, 'delete');
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

export function buildWeakAreaStats(attempts: TestAttempt[]): WeakAreaStat[] {
  const typeMap: Record<string, { questionType: string; skill: 'reading' | 'listening'; total: number; incorrect: number }> = {};

  attempts.filter(att => att.sourcePackId === 'cambridge12-gt' && att.questionTypeStats).forEach(att => {
    if (att.questionTypeStats) {
      Object.entries(att.questionTypeStats).forEach(([type, stat]) => {
        const key = `${att.skill}:${type}`;
        if (!typeMap[key]) {
          typeMap[key] = { questionType: type, skill: att.skill, total: 0, incorrect: 0 };
        }
        typeMap[key].total += stat.total;
        typeMap[key].incorrect += (stat.total - stat.correct);
      });
    }
  });

  const stats: WeakAreaStat[] = Object.values(typeMap).map(data => {
    const correct = Math.max(0, data.total - data.incorrect);
    const rate = data.total > 0 ? Math.round((correct / data.total) * 100) : 100;

    let recommendation = `Tiếp tục duy trì dạng bài ${data.questionType}.`;
    if (rate < 60) {
      recommendation = `Độ chính xác thấp (${rate}%). Nên ưu tiên luyện thêm 1–2 set dạng ${data.questionType}.`;
    } else if (rate < 75) {
      recommendation = `Cần chú ý bẫy từ đồng nghĩa và từ gây nhiễu trong dạng ${data.questionType}.`;
    }

    return {
      questionType: data.questionType,
      skill: data.skill,
      totalQuestions: data.total,
      incorrectCount: data.incorrect,
      accuracyRate: rate,
      recommendation
    };
  });

  return stats.sort((a, b) => a.accuracyRate - b.accuracyRate);
}

export function buildWeeklySkillStats(attempts: TestAttempt[], fromDate: string, throughDate: string) {
  const start = new Date(`${fromDate}T00:00:00`).getTime();
  const end = new Date(`${throughDate}T23:59:59.999`).getTime();
  const totals = new Map<TestAttempt['skill'], { correct: number; total: number }>();
  attempts.filter(attempt => attempt.sourcePackId === 'cambridge12-gt').forEach(attempt => {
    const timestamp = new Date(attempt.date).getTime();
    if (!Number.isFinite(timestamp) || timestamp < start || timestamp > end) return;
    const current = totals.get(attempt.skill) || { correct: 0, total: 0 };
    if (attempt.questionTypeStats && Object.keys(attempt.questionTypeStats).length) {
      Object.values(attempt.questionTypeStats).forEach(stat => { current.correct += stat.correct; current.total += stat.total; });
    } else {
      current.correct += attempt.score;
      current.total += attempt.total;
    }
    totals.set(attempt.skill, current);
  });
  return [...totals.entries()].map(([skill, data]) => ({
    skill,
    correctQuestions: data.correct,
    totalQuestions: data.total,
    accuracyRate: data.total ? Math.round(data.correct / data.total * 100) : 0,
  })).sort((a, b) => a.accuracyRate - b.accuracyRate);
}

export async function getWeakAreaStats(): Promise<WeakAreaStat[]> {
  return buildWeakAreaStats(await loadAttemptsFromStorage());
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

  return {
    date: todayStr,
    dayNumber: dayNum,
    tasks: [],
    streakDays: 0
  };
}

export async function saveTodayProtocol(record: DailyProtocolRecord): Promise<void> {
  await writeLocalData(`protocol_${record.date}`, record);
  await queueSyncChange('protocol', record.date, record);
}
