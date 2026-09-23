import { SRSIntervalRating, VocabCard, ParsePreviewResult } from '../types';

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

  return {
    ...card,
    repetition,
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    dueDate,
    lastReviewed: now.toISOString(),
    state
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

/**
 * Parses user-uploaded .txt / .csv into VocabCard items.
 */
export function parseVocabText(rawText: string, deckName = 'Uploaded Deck'): VocabCard[] {
  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

  const cards: VocabCard[] = [];

  lines.forEach((line, index) => {
    let word = '';
    let phonetic = '';
    let definitionVi = '';
    let example = '';

    if (line.includes('|')) {
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
    } else if (line.includes(',')) {
      const parts = line.split(',').map(s => s.trim());
      word = parts[0] || '';
      definitionVi = parts[1] || '';
      example = parts[2] || '';
    } else {
      // Single word line
      word = line;
      definitionVi = 'Chờ cập nhật nghĩa tiếng Việt';
    }

    if (word && word.length > 0) {
      cards.push({
        id: `v-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        word,
        phonetic: phonetic || `/.../`,
        partOfSpeech: 'lexical',
        definitionVi: definitionVi || 'Từ vựng đã nhập',
        definitionEn: '',
        example: example || `Using "${word}" in an academic IELTS context.`,
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
  deckName = 'Uploaded Deck'
): ParsePreviewResult {
  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

  const parsed = parseVocabText(rawText, deckName);
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
