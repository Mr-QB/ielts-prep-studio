import { SRSIntervalRating, VocabCard } from '../types';

export function calculateNextSRS(card: VocabCard, rating: SRSIntervalRating): VocabCard {
  let { repetition, intervalDays, easeFactor } = card;
  const now = new Date();

  // SM-2 modified for fast language learning intervals
  switch (rating) {
    case 1: // Again (Forgotten)
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
        intervalDays = Math.round(intervalDays * easeFactor);
      }
      repetition += 1;
      break;

    case 4: // Easy
      if (repetition === 0) {
        intervalDays = 3;
      } else if (repetition === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor * 1.35);
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
    easeFactor,
    dueDate,
    lastReviewed: now.toISOString(),
    state
  };
}

/**
 * Parses user-uploaded .txt text into VocabCard items
 * Formats supported:
 * 1. word - definitionVi - example
 * 2. word : definitionVi
 * 3. word | phonetic | definitionVi | example
 * 4. word \t definitionVi
 * 5. CSV format: word, definitionVi, example
 */
export function parseVocabText(rawText: string, deckName = 'Uploaded Deck'): VocabCard[] {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('#'));
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
    } else if (line.includes(' - ')) {
      const parts = line.split(' - ').map(s => s.trim());
      word = parts[0] || '';
      definitionVi = parts[1] || '';
      example = parts[2] || '';
    } else if (line.includes('\t')) {
      const parts = line.split('\t').map(s => s.trim());
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
      // Just a single word
      word = line;
      definitionVi = 'Đang chờ nghĩa bổ sung';
    }

    if (word) {
      cards.push({
        id: `user-v-${Date.now()}-${index}`,
        word,
        phonetic: phonetic || `/.../`,
        partOfSpeech: 'vocabulary',
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
 * Text-to-speech helper with native accents
 */
export function playPronunciation(text: string, voiceAccent: 'en-GB' | 'en-US' = 'en-GB') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voiceAccent;
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(voiceAccent) || (voiceAccent === 'en-GB' && v.name.includes('UK') || v.name.includes('British')));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}
