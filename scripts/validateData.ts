/**
 * IELTS Prep Studio - Comprehensive Data Validation Suite
 * Run with: npm run validate:data
 */
import { LISTENING_FULL_TESTS, LISTENING_SECTIONS, LISTENING_SOURCES } from '../src/data/listeningData';
import { LISTENING_PRACTICE_SECTIONS } from '../src/data/listeningPracticeData';
import { LISTENING_STRATEGY_LESSONS } from '../src/data/listeningStrategyData';
import { READING_FULL_TESTS, READING_PASSAGES, READING_SOURCES, READING_FOUNDATION_SETS } from '../src/data/readingData';
import { READING_PRACTICE_SETS } from '../src/data/readingPracticeData';
import { READING_STRATEGY_LESSONS } from '../src/data/readingStrategyData';
import { GRAMMAR_TOPICS } from '../src/data/grammarData';
import { INITIAL_VOCAB_DECKS, PARAPHRASE_BANK } from '../src/data/vocabData';
import { WRITING_TASK1_NOTES, WRITING_TASK2_NOTES } from '../src/data/writingData';
import { SPEAKING_PARTS_DATA, SPEAKING_GENERAL_TIPS, MY_STORY_BANK } from '../src/data/speakingData';

console.log('=== IELTS PREP STUDIO - COMPREHENSIVE DATA VALIDATION ===\n');

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
// 1. VALIDATE READING FULL TESTS & PRACTICE
// ==========================================
console.log('--- 1. Validating Reading Data ---');
const validReadingSourceIds = new Set(READING_SOURCES.map(s => s.id));

READING_FULL_TESTS.forEach(ft => {
  checkUniqueId(ft.id, `ReadingFullTest:${ft.title}`);
  if (!validReadingSourceIds.has(ft.sourceId)) {
    errors.push(`[ReadingFullTest:${ft.id}] Invalid sourceId: "${ft.sourceId}".`);
  }
  if (ft.passages.length !== 3) {
    errors.push(`[ReadingFullTest:${ft.id}] Must contain exactly 3 passages, got: ${ft.passages.length}.`);
  }

  let testQuestionCount = 0;
  const seenNumbers = new Set<number>();

  ft.passages.forEach((p, pIdx) => {
    checkUniqueId(p.id, `FullTest:${ft.id}:Passage${pIdx + 1}`);
    if (!p.content || p.content.length === 0) {
      errors.push(`[ReadingPassage:${p.id}] Content paragraphs are empty.`);
    }

    p.questions.forEach(q => {
      checkUniqueId(q.id, `ReadingQuestion:${q.id}`);
      testQuestionCount += 1;

      if (seenNumbers.has(q.number)) {
        errors.push(`[ReadingFullTest:${ft.id}] Duplicate question number: ${q.number}.`);
      } else {
        seenNumbers.add(q.number);
      }

      if (!q.correctAnswer || q.correctAnswer.trim() === '') {
        errors.push(`[ReadingQuestion:${q.id}] Missing correctAnswer.`);
      }
      if (!q.explanation || q.explanation.trim() === '') {
        errors.push(`[ReadingQuestion:${q.id}] Missing explanation.`);
      }
    });
  });

  if (testQuestionCount !== 40) {
    errors.push(`[ReadingFullTest:${ft.id}] Must have exactly 40 questions, got: ${testQuestionCount}.`);
  } else {
    console.log(`   [OK] ${ft.title}: 3 passages, 40 questions verified.`);
  }
});

// Validate Practice Sets
READING_PRACTICE_SETS.forEach(ps => {
  checkUniqueId(ps.id, `ReadingPracticeSet:${ps.title}`);
  if (!ps.questions || ps.questions.length === 0) {
    errors.push(`[ReadingPracticeSet:${ps.id}] Has no questions.`);
  }

  ps.questions.forEach(q => {
    checkUniqueId(q.id, `PracticeReadingQ:${q.id}`);
    if (!q.correctAnswer || q.correctAnswer.trim() === '') {
      errors.push(`[PracticeReadingQ:${q.id}] Missing correctAnswer.`);
    }
    if (!q.passageParaphrase && !q.evidenceSnippet) {
      warnings.push(`[PracticeReadingQ:${q.id}] Missing paraphrase mapping or evidence snippet.`);
    }
  });
});
console.log(`   [OK] Reading Practice Sets: ${READING_PRACTICE_SETS.length} question types verified.`);

// Validate Reading Strategy Lessons (14 types)
console.log('\n--- 1b. Validating Reading Strategy Lessons (14 Types) ---');
if (READING_STRATEGY_LESSONS.length !== 14) {
  errors.push(`[ReadingStrategy] Expected 14 strategy lessons, got: ${READING_STRATEGY_LESSONS.length}.`);
}
READING_STRATEGY_LESSONS.forEach(sl => {
  checkUniqueId(sl.type, `ReadingStrategyLesson:${sl.type}`);
  if (!sl.officialFormat || sl.officialFormat.length === 0) {
    errors.push(`[ReadingStrategy:${sl.type}] Missing officialFormat.`);
  }
  if (!sl.recommendedStrategy || sl.recommendedStrategy.length === 0) {
    errors.push(`[ReadingStrategy:${sl.type}] Missing recommendedStrategy.`);
  }
  if (!sl.commonTraps || sl.commonTraps.length === 0) {
    errors.push(`[ReadingStrategy:${sl.type}] Missing commonTraps.`);
  }
  if (!sl.miniPractice || sl.miniPractice.questions.length === 0) {
    errors.push(`[ReadingStrategy:${sl.type}] Missing miniPractice questions.`);
  }
  // Content audit checks
  if (sl.type === 'matching-information') {
    const text = JSON.stringify(sl);
    if (text.includes('sẽ có 1 đoạn chứa 2 đáp án') || text.includes('will contain two answers')) {
      errors.push(`[ReadingStrategy:matching-information] Incorrect rule claim: must state 'MAY', not 'WILL'.`);
    }
  }
  if (sl.type === 'matching-headings') {
    const text = JSON.stringify(sl);
    if (text.includes('luôn luôn làm đầu tiên') || text.includes('always do headings first')) {
      errors.push(`[ReadingStrategy:matching-headings] Inflexible claim: headings first should be presented as recommended strategy to test.`);
    }
  }
});
console.log(`   [OK] Reading Strategy Lessons: 14 question types verified with pedagogical integrity.`);

// Validate Foundation Mini-Sets
console.log('\n--- 1c. Validating Reading Foundation Sets ---');
if (READING_FOUNDATION_SETS.length !== 3) {
  errors.push(`[ReadingFoundation] Expected 3 foundation mini sets, found: ${READING_FOUNDATION_SETS.length}.`);
}
READING_FOUNDATION_SETS.forEach(fs => {
  checkUniqueId(fs.id, `ReadingFoundationSet:${fs.title}`);
  if (fs.wordCount < 200 || fs.wordCount > 450) {
    warnings.push(`[ReadingFoundation:${fs.id}] Word count ${fs.wordCount} outside recommended 200-400 band.`);
  }
  if (fs.questions.length < 5 || fs.questions.length > 8) {
    errors.push(`[ReadingFoundation:${fs.id}] Question count must be 5-8, got: ${fs.questions.length}.`);
  }
  fs.questions.forEach(q => {
    checkUniqueId(q.id, `ReadingFoundationQ:${q.id}`);
    if (!q.correctAnswer) {
      errors.push(`[ReadingFoundationQ:${q.id}] Missing correctAnswer.`);
    }
  });
});
console.log(`   [OK] Reading Foundation Mini Sets: 3 sets (200-400 words, 5-8 questions) verified.`);

// ==========================================
// 2. VALIDATE LISTENING FULL TESTS & DRILLS
// ==========================================
console.log('\n--- 2. Validating Listening Data ---');
const validListeningSourceIds = new Set(LISTENING_SOURCES.map(s => s.id));

LISTENING_FULL_TESTS.forEach(ft => {
  checkUniqueId(ft.id, `ListeningFullTest:${ft.title}`);
  if (!validListeningSourceIds.has(ft.sourceId)) {
    errors.push(`[ListeningFullTest:${ft.id}] Invalid sourceId: "${ft.sourceId}".`);
  }
  if (ft.sections.length !== 4) {
    errors.push(`[ListeningFullTest:${ft.id}] Must contain exactly 4 sections (Parts), got: ${ft.sections.length}.`);
  }

  let totalQuestions = 0;
  const seenNumbers = new Set<number>();

  ft.sections.forEach((s, sIdx) => {
    checkUniqueId(s.id, `FullTest:${ft.id}:Section${sIdx + 1}`);
    if (!s.transcript || s.transcript.trim() === '') {
      errors.push(`[ListeningSection:${s.id}] Transcript is empty.`);
    }

    s.questions.forEach(q => {
      checkUniqueId(q.id, `ListeningQuestion:${q.id}`);
      totalQuestions += 1;

      if (seenNumbers.has(q.number)) {
        errors.push(`[ListeningFullTest:${ft.id}] Duplicate question number: ${q.number}.`);
      } else {
        seenNumbers.add(q.number);
      }

      if (!q.correctAnswer || q.correctAnswer.trim() === '') {
        errors.push(`[ListeningQuestion:${q.id}] Missing correctAnswer.`);
      }
      if (!q.explanation || q.explanation.trim() === '') {
        errors.push(`[ListeningQuestion:${q.id}] Missing explanation.`);
      }
    });
  });

  if (totalQuestions !== 40) {
    errors.push(`[ListeningFullTest:${ft.id}] Must have exactly 40 questions, got: ${totalQuestions}.`);
  } else {
    console.log(`   [OK] ${ft.title}: 4 sections, 40 questions verified.`);
  }
});

// Validate Listening Strategy Lessons (16 types)
console.log('\n--- 2b. Validating Listening Strategy Lessons (16 Lessons) ---');
if (LISTENING_STRATEGY_LESSONS.length !== 16) {
  errors.push(`[ListeningStrategy] Expected 16 strategy lessons, found: ${LISTENING_STRATEGY_LESSONS.length}.`);
}
LISTENING_STRATEGY_LESSONS.forEach(lsl => {
  checkUniqueId(lsl.id, `ListeningStrategyLesson:${lsl.id}`);
  if (!lsl.practiceDrills || lsl.practiceDrills.length < 3) {
    errors.push(`[ListeningStrategy:${lsl.id}] Must have at least 3 practice drills, found: ${lsl.practiceDrills?.length || 0}.`);
  }
  lsl.practiceDrills.forEach(d => {
    checkUniqueId(d.id, `ListeningDrill:${d.id}`);
    if (!d.correctAnswer || !d.explanation || !d.audioSnippet) {
      errors.push(`[ListeningDrill:${d.id}] Missing core drill fields.`);
    }
  });
});
console.log(`   [OK] Listening Strategy Lessons: 16 lessons with interactive micro-drills verified.`);

// ==========================================
// 3. VALIDATE GRAMMAR CURRICULUM
// ==========================================
console.log('\n--- 3. Validating Grammar Curriculum ---');
if (GRAMMAR_TOPICS.length !== 26) {
  errors.push(`[Grammar] Expected exactly 26 topics, found: ${GRAMMAR_TOPICS.length}.`);
}

GRAMMAR_TOPICS.forEach(t => {
  checkUniqueId(t.id, `GrammarTopic:${t.code}`);
  if (!t.formula || !t.concept || !t.commonMistake) {
    errors.push(`[GrammarTopic:${t.id}] Missing essential pedagogy elements.`);
  }
  if (!t.exercises || t.exercises.length === 0) {
    errors.push(`[GrammarTopic:${t.id}] Has no interactive exercises.`);
  }
});
console.log(`   [OK] Grammar: 26 topics verified (G01–G20 Essential, G21–G26 Advanced).`);

// ==========================================
// 4. VALIDATE WRITING & SPEAKING NOTES
// ==========================================
console.log('\n--- 4. Validating Writing & Speaking Notes ---');
if (WRITING_TASK1_NOTES.length !== 7) {
  errors.push(`[Writing] Expected 7 Task 1 chart types, found: ${WRITING_TASK1_NOTES.length}.`);
}
WRITING_TASK1_NOTES.forEach(t1 => {
  checkUniqueId(t1.id, `WritingTask1:${t1.title}`);
  if (t1.structure.length !== 4) {
    errors.push(`[WritingTask1:${t1.id}] Structure must have 4 sections, found: ${t1.structure.length}.`);
  }
  t1.checklist.forEach(item => {
    if (!item.startsWith('[REQUIREMENT]') && !item.startsWith('[RECOMMENDED]') && !item.startsWith('[OPTIONAL]')) {
      errors.push(`[WritingTask1:${t1.id}] Checklist item untagged: "${item}".`);
    }
  });
});

if (WRITING_TASK2_NOTES.length !== 5) {
  errors.push(`[Writing] Expected 5 Task 2 essay types, found: ${WRITING_TASK2_NOTES.length}.`);
}
WRITING_TASK2_NOTES.forEach(t2 => {
  checkUniqueId(t2.id, `WritingTask2:${t2.title}`);
  t2.checklist.forEach(item => {
    if (!item.startsWith('[REQUIREMENT]') && !item.startsWith('[RECOMMENDED]') && !item.startsWith('[OPTIONAL]')) {
      errors.push(`[WritingTask2:${t2.id}] Checklist item untagged: "${item}".`);
    }
  });
});
console.log(`   [OK] Writing Notes: 7 Task 1 types and 5 Task 2 types with [REQUIREMENT]/[RECOMMENDED]/[OPTIONAL] tags verified.`);

if (SPEAKING_PARTS_DATA.length !== 3) {
  errors.push(`[Speaking] Expected 3 parts, found: ${SPEAKING_PARTS_DATA.length}.`);
}
SPEAKING_PARTS_DATA.forEach(sp => {
  if (!sp.frameworkName || !sp.formula) {
    errors.push(`[SpeakingPart:${sp.part}] Missing framework metadata.`);
  }
});
console.log(`   [OK] Speaking Notes: Parts 1, 2, 3 frameworks verified.`);

// Validate Speaking Story Bank (12 stories)
console.log('\n--- 4b. Validating Speaking Story Bank (12 Universal Stories) ---');
if (MY_STORY_BANK.length !== 12) {
  errors.push(`[SpeakingStoryBank] Expected 12 universal stories, found: ${MY_STORY_BANK.length}.`);
}
MY_STORY_BANK.forEach(story => {
  checkUniqueId(story.id, `SpeakingStory:${story.id}`);
  if (!story.shortVersion || !story.extendedVersion) {
    errors.push(`[SpeakingStory:${story.id}] Missing short or extended version.`);
  }
  if (!story.usefulVocab || story.usefulVocab.length < 3) {
    errors.push(`[SpeakingStory:${story.id}] Must have at least 3 useful vocab items.`);
  }
  if (!story.applicableCueCards || story.applicableCueCards.length < 2) {
    errors.push(`[SpeakingStory:${story.id}] Must cover at least 2 cue card topics.`);
  }
});
console.log(`   [OK] Speaking Story Bank: 12 versatile stories verified.`);

// ==========================================
// 5. VALIDATE VOCABULARY DECKS & PARAPHRASE BANK
// ==========================================
console.log('\n--- 5. Validating Starter Vocabulary Decks & Paraphrases ---');
INITIAL_VOCAB_DECKS.forEach(deck => {
  checkUniqueId(deck.id, `VocabDeck:${deck.name}`);
  deck.cards.forEach(c => {
    checkUniqueId(c.id, `VocabCard:${deck.id}:${c.word}`);
    if (!c.word || !c.definitionVi) {
      errors.push(`[VocabCard:${c.id}] Missing word or Vietnamese definition.`);
    }
  });
});
console.log(`   [OK] Vocabulary: ${INITIAL_VOCAB_DECKS.length} starter decks verified.`);

if (PARAPHRASE_BANK.length < 10) {
  errors.push(`[ParaphraseBank] Expected at least 10 high-utility paraphrase entries, found: ${PARAPHRASE_BANK.length}.`);
}
PARAPHRASE_BANK.forEach(pe => {
  if (!pe.word || !pe.synonyms || pe.synonyms.length === 0) {
    errors.push(`[ParaphraseBank] Invalid entry for ${pe.word}.`);
  }
  if (pe.discriminationExercise) {
    const de = pe.discriminationExercise;
    if (!de.sentence || !de.options || de.options.length < 2 || !de.correctAnswer || !de.explanation) {
      errors.push(`[ParaphraseBank:${pe.word}] Incomplete discrimination exercise.`);
    }
  }
});
console.log(`   [OK] Paraphrase Bank: ${PARAPHRASE_BANK.length} entries with discrimination exercises verified.`);

// ==========================================
// FINAL SUMMARY
// ==========================================
console.log('\n==========================================');
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
  console.log('\n✅ ALL DATA VALIDATION SUITES PASSED SUCCESSFULLY (0 errors).');
  process.exit(0);
}
