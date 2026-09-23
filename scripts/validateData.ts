/**
 * IELTS Prep Studio - Data Validation Script
 * Run with: npm run validate:data (offline) or npm run validate:data:online
 */
import { LISTENING_SECTIONS, LISTENING_SOURCES } from '../src/data/listeningData';
import { READING_PASSAGES, READING_SOURCES } from '../src/data/readingData';
import { GRAMMAR_TOPICS } from '../src/data/grammarData';
import { INITIAL_VOCAB_DECKS } from '../src/data/vocabData';

const isOnline = process.argv.includes('--online');

console.log(`[DATA VALIDATOR] Starting validation (Mode: ${isOnline ? 'ONLINE' : 'OFFLINE'})...\n`);

const errors: string[] = [];
const warnings: string[] = [];
const seenIds = new Set<string>();

function checkUniqueId(id: string, context: string) {
  if (!id || id.trim() === '') {
    errors.push(`[${context}] Empty or missing ID.`);
    return;
  }
  if (seenIds.has(id)) {
    errors.push(`[${context}] Duplicate ID found: "${id}".`);
  } else {
    seenIds.add(id);
  }
}

// ==========================================
// 1. VALIDATE LISTENING
// ==========================================
console.log('--- Validating Listening Data ---');
const validSourceIds = new Set(LISTENING_SOURCES.map(s => s.id));

LISTENING_SOURCES.forEach(src => {
  checkUniqueId(src.id, `ListeningSource:${src.title}`);
  if (!src.provider || !src.title) {
    errors.push(`[ListeningSource] Source "${src.id}" missing provider or title.`);
  }
});

LISTENING_SECTIONS.forEach(section => {
  checkUniqueId(section.id, `ListeningSection:${section.title}`);

  if (!validSourceIds.has(section.sourceId)) {
    errors.push(`[ListeningSection:${section.id}] Invalid sourceId: "${section.sourceId}".`);
  }

  if (section.sectionNumber < 1 || section.sectionNumber > 4) {
    errors.push(`[ListeningSection:${section.id}] Section number must be between 1 and 4, got: ${section.sectionNumber}.`);
  }

  if (!section.transcript || section.transcript.trim() === '') {
    errors.push(`[ListeningSection:${section.id}] Transcript is empty.`);
  }

  if (!section.questions || section.questions.length === 0) {
    errors.push(`[ListeningSection:${section.id}] Has no questions.`);
  }

  const seenQNumbers = new Set<number>();
  section.questions.forEach(q => {
    checkUniqueId(q.id, `ListeningQuestion:${section.id}:Q${q.number}`);

    if (seenQNumbers.has(q.number)) {
      errors.push(`[ListeningSection:${section.id}] Duplicate question number ${q.number}.`);
    } else {
      seenQNumbers.add(q.number);
    }

    if (!q.correctAnswer || q.correctAnswer.trim() === '') {
      errors.push(`[ListeningSection:${section.id}:Q${q.number}] Missing correctAnswer.`);
    }

    if (q.type === 'multiple-choice' && (!q.options || q.options.length < 2)) {
      errors.push(`[ListeningSection:${section.id}:Q${q.number}] Multiple choice question has fewer than 2 options.`);
    }
  });
});

// ==========================================
// 2. VALIDATE READING
// ==========================================
console.log('--- Validating Reading Data ---');
const validReadingSourceIds = new Set(READING_SOURCES.map(s => s.id));

READING_SOURCES.forEach(src => {
  checkUniqueId(src.id, `ReadingSource:${src.title}`);
  if (!src.provider || !src.title) {
    errors.push(`[ReadingSource] Source "${src.id}" missing provider or title.`);
  }
});

READING_PASSAGES.forEach(passage => {
  checkUniqueId(passage.id, `ReadingPassage:${passage.title}`);

  if (!validReadingSourceIds.has(passage.sourceId)) {
    errors.push(`[ReadingPassage:${passage.id}] Invalid sourceId: "${passage.sourceId}".`);
  }

  if (passage.passageNumber < 1 || passage.passageNumber > 3) {
    errors.push(`[ReadingPassage:${passage.id}] Passage number must be between 1 and 3, got: ${passage.passageNumber}.`);
  }

  if (!passage.content || passage.content.length === 0) {
    errors.push(`[ReadingPassage:${passage.id}] Passage content paragraphs empty.`);
  }

  if (!passage.questions || passage.questions.length === 0) {
    errors.push(`[ReadingPassage:${passage.id}] Has no questions.`);
  }

  const seenQNumbers = new Set<number>();
  passage.questions.forEach(q => {
    checkUniqueId(q.id, `ReadingQuestion:${passage.id}:Q${q.number}`);

    if (seenQNumbers.has(q.number)) {
      errors.push(`[ReadingPassage:${passage.id}] Duplicate question number ${q.number}.`);
    } else {
      seenQNumbers.add(q.number);
    }

    if (!q.correctAnswer || q.correctAnswer.trim() === '') {
      errors.push(`[ReadingPassage:${passage.id}:Q${q.number}] Missing correctAnswer.`);
    }
  });
});

// ==========================================
// 3. VALIDATE GRAMMAR
// ==========================================
console.log('--- Validating Grammar Curriculum ---');

if (GRAMMAR_TOPICS.length < 20) {
  warnings.push(`[Grammar] Expected full curriculum of 26 topics, found ${GRAMMAR_TOPICS.length}.`);
}

GRAMMAR_TOPICS.forEach(topic => {
  checkUniqueId(topic.id, `GrammarTopic:${topic.code}`);

  if (!topic.code || !topic.title || !topic.whyItMatters || !topic.formula) {
    errors.push(`[GrammarTopic:${topic.id}] Missing core pedagogical attributes.`);
  }

  if (!topic.rules || topic.rules.length === 0) {
    errors.push(`[GrammarTopic:${topic.id}] Missing rules.`);
  }

  if (!topic.exercises || topic.exercises.length === 0) {
    errors.push(`[GrammarTopic:${topic.id}] Missing interactive exercises.`);
  }

  topic.exercises.forEach(ex => {
    checkUniqueId(ex.id, `GrammarExercise:${topic.id}:${ex.id}`);
    if (!ex.correctAnswer || ex.correctAnswer.trim() === '') {
      errors.push(`[GrammarExercise:${ex.id}] Missing correctAnswer.`);
    }
  });
});

// ==========================================
// 4. VALIDATE VOCABULARY DECKS
// ==========================================
console.log('--- Validating Vocabulary Decks ---');

INITIAL_VOCAB_DECKS.forEach(deck => {
  checkUniqueId(deck.id, `VocabDeck:${deck.name}`);

  if (!deck.cards || deck.cards.length === 0) {
    errors.push(`[VocabDeck:${deck.id}] Deck has no cards.`);
  }

  deck.cards.forEach(card => {
    checkUniqueId(card.id, `VocabCard:${deck.id}:${card.word}`);
    if (!card.word || card.word.trim() === '') {
      errors.push(`[VocabCard:${card.id}] Missing word.`);
    }
    if (!card.definitionVi || card.definitionVi.trim() === '') {
      errors.push(`[VocabCard:${card.id}] Missing Vietnamese definition.`);
    }
  });
});

// ==========================================
// SUMMARY REPORT
// ==========================================
console.log('\n==========================================');
console.log('          VALIDATION SUMMARY              ');
console.log('==========================================');
console.log(`Total verified items checked: ${seenIds.size}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (warnings.length > 0) {
  console.log('\n[WARNINGS]:');
  warnings.forEach(w => console.log('  ⚠️ ' + w));
}

if (errors.length > 0) {
  console.error('\n[ERRORS DETECTED]:');
  errors.forEach(err => console.error('  ❌ ' + err));
  process.exit(1);
} else {
  console.log('\n✅ ALL DATA INTEGRITY CHECKS PASSED SUCCESSFULLY.');
  process.exit(0);
}
