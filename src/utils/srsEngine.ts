import { SRSIntervalRating, VocabCard, ParsePreviewResult, VocabReviewMode, VocabErrorType } from '../types';

/**
 * Calculates next SuperMemo SM-2 interval parameters.
 */
export function calculateNextSRS(card: VocabCard, rating: SRSIntervalRating): VocabCard {
  let { repetition, intervalDays, easeFactor } = card;
  const now = new Date();

  switch (rating) {
    case 1: // Again (Forgot)
      repetition = 0;
      intervalDays = 0.007; // ~10 minutes
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;

    case 2: // Hard
      if (repetition === 0) {
        intervalDays = 0.5; // 12 hours
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
      }
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      repetition += 1;
      break;

    case 3: // Good
      if (repetition === 0) {
        intervalDays = 1;
      } else if (repetition === 1) {
        intervalDays = 3;
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
      }
      repetition += 1;
      break;

    case 4: // Easy
      if (repetition === 0) {
        intervalDays = 3;
      } else if (repetition === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * easeFactor * 1.35));
      }
      easeFactor = Math.min(3.0, easeFactor + 0.15);
      repetition += 1;
      break;
  }

  const dueTimestamp = now.getTime() + intervalDays * 24 * 60 * 60 * 1000;
  const dueDate = new Date(dueTimestamp).toISOString();

  let state: VocabCard['state'] = 'learning';
  if (repetition === 0) {
    state = 'learning';
  } else if (intervalDays >= 21) {
    state = 'mastered';
  } else {
    state = 'review';
  }

  // Conservative FSRS metrics mapped from active review
  const difficulty = Number(Math.max(0.1, Math.min(1.0, (3.0 - easeFactor) / 1.7)).toFixed(2));
  const stability = Number(Math.max(0.1, intervalDays).toFixed(2));
  const retrievability = 1.0;

  let masteryState: VocabCard['masteryState'] = 'learning';
  if (rating === 1) {
    masteryState = 'weak_again';
  } else if (intervalDays >= 21) {
    masteryState = 'stable';
  } else if (repetition >= 2) {
    masteryState = 'recalling';
  } else {
    masteryState = 'learning';
  }

  return {
    ...card,
    repetition,
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    dueDate,
    lastReviewed: now.toISOString(),
    state,
    difficulty,
    stability,
    retrievability,
    masteryState
  };
}

/**
 * Calculates human-readable preview of the next interval based on card state and selected rating.
 * Used directly on rating buttons [1], [2], [3], [4] so labels match actual scheduler logic.
 */
export function previewNextInterval(card: VocabCard, rating: SRSIntervalRating): string {
  const { repetition, intervalDays, easeFactor } = card;

  switch (rating) {
    case 1:
      return '< 10m';

    case 2:
      if (repetition === 0) return '12h';
      return `${Math.max(1, Math.round(intervalDays * 1.2))}d`;

    case 3:
      if (repetition === 0) return '1d';
      if (repetition === 1) return '3d';
      return `${Math.max(1, Math.round(intervalDays * easeFactor))}d`;

    case 4:
      if (repetition === 0) return '3d';
      if (repetition === 1) return '6d';
      return `${Math.max(1, Math.round(intervalDays * easeFactor * 1.35))}d`;
  }
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === '"' && line[i + 1] === '"' && quoted) { value += '"'; i += 1; }
    else if (line[i] === '"') quoted = !quoted;
    else if (line[i] === ',' && !quoted) { cells.push(value.trim()); value = ''; }
    else value += line[i];
  }
  cells.push(value.trim());
  return cells;
}

/** Parses user text as one item per line; CSV columns are used only for explicit CSV input. */
export function parseVocabText(rawText: string, deckName = 'Uploaded Deck', format: 'text' | 'csv' = 'text'): VocabCard[] {
  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'))
    .flatMap(line => format !== 'csv' && line.includes(';') && !/[|\t]|\s-\s|:/.test(line) ? line.split(';').map(part => part.trim()) : [line])
    .map(line => line.replace(/^(?:[-*•]\s+|\d+[.)]\s+)/, ''));

  const cards: VocabCard[] = [];

  lines.forEach((line, index) => {
    if (format === 'csv' && index === 0 && /^(?:word|term|vocabulary)\s*,/i.test(line)) return;
    let word = '';
    let phonetic = '';
    let definitionVi = '';
    let example = '';

    if (format === 'csv' && line.includes(',')) {
      const parts = parseCsvLine(line);
      word = parts[0] || '';
      definitionVi = parts[1] || '';
      example = parts[2] || '';
    } else if (line.includes('|')) {
      const parts = line.split('|').map(s => s.trim());
      word = parts[0] || '';
      phonetic = parts[1] || '';
      definitionVi = parts[2] || '';
      example = parts[3] || '';
    } else if (line.includes('\t')) {
      const parts = line.split('\t').map(s => s.trim());
      word = parts[0] || '';
      definitionVi = parts[1] || '';
      example = parts[2] || '';
    } else if (line.includes(' - ')) {
      const parts = line.split(' - ').map(s => s.trim());
      word = parts[0] || '';
      definitionVi = parts[1] || '';
      example = parts[2] || '';
    } else if (line.includes(':')) {
      const idx = line.indexOf(':');
      word = line.substring(0, idx).trim();
      const rest = line.substring(idx + 1).trim();
      if (rest.includes(' - ')) {
        const parts = rest.split(' - ').map(s => s.trim());
        definitionVi = parts[0] || '';
        example = parts[1] || '';
      } else {
        definitionVi = rest;
      }
    } else {
      word = line;
    }

    if (word && word.length > 0) {
      cards.push({
        id: `v-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        word,
        phonetic,
        partOfSpeech: '',
        definitionVi,
        definitionEn: '',
        example,
        category: deckName,
        repetition: 0,
        intervalDays: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'new'
      });
    }
  });

  return cards;
}

/**
 * Analyzes import data, returns stats, duplicates, and 10 preview cards before saving.
 */
export function analyzeVocabImport(
  rawText: string,
  existingWords: Set<string>,
  deckName = 'Uploaded Deck',
  format: 'text' | 'csv' = 'text'
): ParsePreviewResult {
  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

  const parsed = parseVocabText(rawText, deckName, format);
  const invalidLinesCount = Math.max(0, lines.length - parsed.length);

  const seenInUpload = new Set<string>();
  const duplicatesInUpload: string[] = [];
  const duplicatesWithExisting: string[] = [];

  parsed.forEach(c => {
    const lower = c.word.toLowerCase();
    if (seenInUpload.has(lower)) {
      duplicatesInUpload.push(c.word);
    } else {
      seenInUpload.add(lower);
    }
    if (existingWords.has(lower)) {
      duplicatesWithExisting.push(c.word);
    }
  });

  const allDupWords = Array.from(new Set([...duplicatesInUpload, ...duplicatesWithExisting]));

  return {
    parsed,
    previewCards: parsed.slice(0, 10),
    invalidLinesCount,
    duplicateCount: allDupWords.length,
    existingDuplicateWords: allDupWords
  };
}

/**
 * Text-to-speech helper with native browser voice
 * Clearly documented as Browser TTS practice fallback
 */
export function playPronunciation(text: string, voiceAccent: 'en-GB' | 'en-US' = 'en-GB') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voiceAccent;
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    v =>
      v.lang.startsWith(voiceAccent) ||
      (voiceAccent === 'en-GB' && (v.name.includes('UK') || v.name.includes('British'))) ||
      (voiceAccent === 'en-US' && (v.name.includes('US') || v.name.includes('United States')))
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// ==========================================
// ACTIVE RETRIEVAL ENGINE & ERROR CLASSIFICATION
// ==========================================

/**
 * Optimal Damerau-Levenshtein distance (insertions, deletions, substitutions, transpositions)
 */
export function damerauLevenshteinDistance(source: string, target: string): number {
  const s = source.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  if (s === t) return 0;
  if (!s.length) return t.length;
  if (!t.length) return s.length;

  const d: number[][] = [];
  for (let i = 0; i <= s.length; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= t.length; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );
      // transposition check
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[s.length][t.length];
}

export function suggestVocabCorrection(word: string, candidates: string[]): string | undefined {
  const normalized = word.trim().toLowerCase();
  if (normalized.length < 5) return undefined;
  const maxDistance = normalized.length >= 8 ? 2 : 1;
  return candidates
    .map(candidate => ({ candidate, distance: damerauLevenshteinDistance(normalized, candidate) }))
    .filter(item => item.distance > 0 && item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance || a.candidate.length - b.candidate.length)[0]?.candidate;
}

function getCommonPrefixLength(a: string, b: string): number {
  let len = 0;
  const max = Math.min(a.length, b.length);
  while (len < max && a[len] === b[len]) {
    len++;
  }
  return len;
}

export interface VocabErrorClassification {
  errorType: VocabErrorType;
  isCorrect: boolean;
  messageVi: string;
  diffHighlight?: {
    user: string;
    expected: string;
  };
}

/**
 * Strict error classification:
 * - Distinguishes between near-miss spelling vs. complete recall failure vs morphology.
 * - IELTS requires accurate spelling, so typos are never silently marked correct,
 *   but are flagged as SPELLING_ERROR with high pedagogical encouragement.
 */
export function classifyVocabError(
  userInput: string,
  targetWord: string,
  targetLemma?: string
): VocabErrorClassification {
  const user = userInput.trim().toLowerCase();
  const target = targetWord.trim().toLowerCase();
  const lemma = (targetLemma || '').trim().toLowerCase();

  // Exactly correct
  if (user === target) {
    return {
      errorType: 'NONE',
      isCorrect: true,
      messageVi: 'Chính xác!'
    };
  }

  // Blank or whitespace only
  if (!user) {
    return {
      errorType: 'RECALL_FAILURE',
      isCorrect: false,
      messageVi: 'Chưa nhớ từ / Bỏ trống',
      diffHighlight: { user: '(bỏ trống)', expected: target }
    };
  }

  // Calculate common prefix and distance
  const commonPrefix = getCommonPrefixLength(user, target);
  const dist = damerauLevenshteinDistance(user, target);

  // Morphology error: shared root (>= 4 chars) but differing grammatical suffix (e.g. significance vs significant)
  const isMorphologySuffix =
    (user.endsWith('ce') && target.endsWith('t')) ||
    (user.endsWith('t') && target.endsWith('ce')) ||
    (user.endsWith('ance') && target.endsWith('ant')) ||
    (user.endsWith('ant') && target.endsWith('ance')) ||
    (user.endsWith('ence') && target.endsWith('ent')) ||
    (user.endsWith('ent') && target.endsWith('ence')) ||
    (user.endsWith('tion') || target.endsWith('tion')) ||
    (user.endsWith('sion') || target.endsWith('sion')) ||
    (user.endsWith('ly') || target.endsWith('ly')) ||
    (user.endsWith('al') || target.endsWith('al')) ||
    (user.endsWith('ity') || target.endsWith('ity')) ||
    (user.endsWith('ing') || target.endsWith('ing')) ||
    (user.endsWith('ed') || target.endsWith('ed'));

  if (commonPrefix >= 5 && isMorphologySuffix) {
    return {
      errorType: 'MORPHOLOGY_ERROR',
      isCorrect: false,
      messageVi: 'Đúng gốc từ nhưng sai từ loại / hậu tố ngữ pháp',
      diffHighlight: { user, expected: target }
    };
  }

  // Spelling error: distance <= 2 for words >= 6 chars, or distance === 1 for words >= 4 chars
  const isSpelling = (target.length >= 6 && dist <= 2) || (target.length >= 4 && dist === 1);
  if (isSpelling) {
    return {
      errorType: 'SPELLING_ERROR',
      isCorrect: false,
      messageVi: `Gần đúng — Lỗi chính tả (Sai khác ${dist} ký tự)`,
      diffHighlight: { user, expected: target }
    };
  }

  // General morphology fallback if lemma matches
  if (lemma && (user.startsWith(lemma) || target.startsWith(lemma)) && commonPrefix >= 4) {
    return {
      errorType: 'MORPHOLOGY_ERROR',
      isCorrect: false,
      messageVi: 'Đúng gốc từ nhưng sai từ loại / hậu tố ngữ pháp',
      diffHighlight: { user, expected: target }
    };
  }

  // Complete recall failure
  return {
    errorType: 'RECALL_FAILURE',
    isCorrect: false,
    messageVi: 'Chưa nhớ từ / Quên nghĩa',
    diffHighlight: { user, expected: target }
  };
}

/**
 * Intelligent exercise mode selector based on card maturity & IELTS progression:
 * - New: ~40% Recall, ~30% VN->EN Typing, ~20% Cloze, ~10% Collocation
 * - Learning: ~15% Recall, ~45% VN->EN Typing, ~25% Cloze, ~15% Collocation/Audio
 * - Mature: ~10% Recall, ~40% VN->EN Typing, ~25% Paraphrase/Cloze, ~15% Collocation, ~10% Audio
 */
export function selectVocabReviewMode(card: VocabCard, lastMode?: VocabReviewMode): VocabReviewMode {
  const isNew = card.repetition === 0 || card.state === 'new';
  const isMature = card.repetition >= 3 || card.intervalDays >= 7 || card.state === 'mastered';

  const hasCollocations = Boolean(card.collocations && card.collocations.length > 0);
  const hasClozeSentence = Boolean(
    (card.sourceContext && card.sourceContext.toLowerCase().includes(card.word.toLowerCase())) ||
    (card.example && card.example.toLowerCase().includes(card.word.toLowerCase()))
  );
  const hasParaphrases = Boolean(card.paraphrases && card.paraphrases.length > 0);

  const roll = Math.random();

  let candidate: VocabReviewMode;
  if (isNew) {
    if (roll < 0.40) candidate = 'recall';
    else if (roll < 0.70) candidate = 'typing_vi_en';
    else if (roll < 0.90 && hasClozeSentence) candidate = 'cloze';
    else if (hasCollocations) candidate = 'collocation';
    else candidate = 'typing_vi_en';
  } else if (!isMature) {
    if (roll < 0.15) candidate = 'recall';
    else if (roll < 0.60) candidate = 'typing_vi_en';
    else if (roll < 0.85 && hasClozeSentence) candidate = 'cloze';
    else if (hasCollocations) candidate = 'collocation';
    else candidate = 'audio_spelling';
  } else {
    // Mature word: heavily active retrieval
    if (roll < 0.10) candidate = 'recall';
    else if (roll < 0.50) candidate = 'typing_vi_en';
    else if (roll < 0.75 && hasParaphrases) candidate = 'paraphrase_context';
    else if (roll < 0.75 && hasClozeSentence) candidate = 'cloze';
    else if (roll < 0.90 && hasCollocations) candidate = 'collocation';
    else candidate = 'audio_spelling';
  }

  // Avoid identical mode back-to-back if possible
  if (candidate === lastMode) {
    if (candidate !== 'typing_vi_en') return 'typing_vi_en';
    return hasClozeSentence ? 'cloze' : 'recall';
  }

  return candidate;
}

export interface SessionReviewItem {
  queueId: string;
  card: VocabCard;
  mode: VocabReviewMode;
  isRetry?: boolean;
  retryCount?: number;
  recovered?: boolean;
}

/**
 * Builds the initial mixed review session queue from due cards
 */
export function buildSessionReviewQueue(cards: VocabCard[]): SessionReviewItem[] {
  return cards.map((card, idx) => ({
    queueId: `queue-${card.id}-${idx}-${Date.now()}`,
    card,
    mode: selectVocabReviewMode(card),
    isRetry: false,
    retryCount: 0
  }));
}

/**
 * Reinserts a card back into the current session queue after 3–7 other cards.
 * If near the end of session, appends near the tail.
 */
export function reinsertCardIntoSessionQueue(
  queue: SessionReviewItem[],
  currentIndex: number,
  card: VocabCard,
  preferredMode?: VocabReviewMode
): SessionReviewItem[] {
  const newQueue = [...queue];
  const offset = Math.floor(Math.random() * 4) + 3; // 3 to 6 cards later
  const targetIndex = Math.min(newQueue.length, currentIndex + offset);

  // If wrong in recall/cloze/audio, next retry is usually typing_vi_en for active recall
  const nextMode = preferredMode || 'typing_vi_en';

  const retryItem: SessionReviewItem = {
    queueId: `retry-${card.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    card,
    mode: nextMode,
    isRetry: true,
    retryCount: 1
  };

  newQueue.splice(targetIndex, 0, retryItem);
  return newQueue;
}
