/**
 * Local-First IndexedDB Persistence with localStorage Fallback
 * Privacy-friendly, offline-ready storage for IELTS Prep Studio
 */
import { VocabDeck, TestAttempt, GrammarProgressStatus } from '../types';

const DB_NAME = 'ielts_prep_studio_v1';
const DB_VERSION = 1;

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
      };
    });
  }
  return dbPromise;
}

// Fallback keys for localStorage
const LS_DECKS_KEY = 'ielts_decks_v2';
const LS_ATTEMPTS_KEY = 'ielts_attempts_v1';
const LS_GRAMMAR_KEY = 'ielts_grammar_progress_v1';

// --- Decks ---
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
  // Always mirror in localStorage for immediate sync
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
    // safe fallback to localStorage
  }
}

// --- Attempts ---
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
}

// --- Grammar Progress ---
export interface GrammarProgressEntry {
  topicId: string;
  status: GrammarProgressStatus;
  lastStudied: string;
}

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
