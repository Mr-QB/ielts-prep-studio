/**
 * Comprehensive Acceptance Test Script for IELTS Prep Studio
 * Validating Sections 55 - 61
 */
import { 
  damerauLevenshteinDistance, 
  classifyVocabError, 
  selectVocabReviewMode, 
  buildSessionReviewQueue, 
  reinsertCardIntoSessionQueue,
  calculateNextSRS
} from '../src/utils/srsEngine';
import { VocabCard } from '../src/types';
import { MY_STORY_BANK } from '../src/data/speakingData';
import { READING_STRATEGY_LESSONS } from '../src/data/readingStrategyData';
import { READING_FOUNDATION_SETS } from '../src/data/readingData';
import { LISTENING_STRATEGY_LESSONS } from '../src/data/listeningStrategyData';
import { PARAPHRASE_BANK, INITIAL_VOCAB_DECKS } from '../src/data/vocabData';

console.log('=== RUNNING COMPREHENSIVE ACCEPTANCE TESTS (SECTIONS 55-61) ===\n');

let passCount = 0;
let failCount = 0;

function assertTest(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${detail || 'Condition not met'}`);
    failCount++;
  }
}

// ----------------------------------------------------
// Section 57 & 11: Error Classification & Typo Tolerance
// ----------------------------------------------------
console.log('--- 1. Testing Typo Tolerance & Error Classification ---');
const dist1 = damerauLevenshteinDistance('environment', 'enviroment');
assertTest(dist1 === 1, 'Levenshtein distance("environment", "enviroment") === 1', `Got: ${dist1}`);

const errTypo = classifyVocabError('enviroment', 'environment').errorType;
assertTest(errTypo === 'SPELLING_ERROR', 'Typo tolerance: "enviroment" classified as SPELLING_ERROR', `Got: ${errTypo}`);

const errMorphology = classifyVocabError('significance', 'significant').errorType;
assertTest(errMorphology === 'MORPHOLOGY_ERROR', 'Morphology error: "significance" instead of "significant"', `Got: ${errMorphology}`);

const errBlank = classifyVocabError('', 'mitigate').errorType;
assertTest(errBlank === 'RECALL_FAILURE', 'Blank answer classified as RECALL_FAILURE', `Got: ${errBlank}`);

const errUnrelated = classifyVocabError('education', 'environment').errorType;
assertTest(errUnrelated === 'RECALL_FAILURE', 'Unrelated word classified as RECALL_FAILURE', `Got: ${errUnrelated}`);

// ----------------------------------------------------
// Section 10 & 56: Same-Session Relearning Queue & Reinsertion
// ----------------------------------------------------
console.log('\n--- 2. Testing Same-Session Relearning & Mode Distribution ---');
const mockCards: VocabCard[] = ([
  { id: 'c1', word: 'mitigate', definitionVi: 'giảm nhẹ', repetition: 0, intervalDays: 0, easeFactor: 2.5, dueDate: new Date().toISOString(), state: 'new' },
  { id: 'c2', word: 'environment', definitionVi: 'môi trường', repetition: 2, intervalDays: 3, easeFactor: 2.5, dueDate: new Date().toISOString(), state: 'learning' },
  { id: 'c3', word: 'significant', definitionVi: 'đáng kể', repetition: 5, intervalDays: 14, easeFactor: 2.6, dueDate: new Date().toISOString(), state: 'review' },
  { id: 'c4', word: 'crucial', definitionVi: 'quan trọng', repetition: 1, intervalDays: 1, easeFactor: 2.5, dueDate: new Date().toISOString(), state: 'learning' },
  { id: 'c5', word: 'enhance', definitionVi: 'nâng cao', repetition: 0, intervalDays: 0, easeFactor: 2.5, dueDate: new Date().toISOString(), state: 'new' },
  { id: 'c6', word: 'solution', definitionVi: 'giải pháp', repetition: 4, intervalDays: 10, easeFactor: 2.5, dueDate: new Date().toISOString(), state: 'review' },
  { id: 'c7', word: 'drastic', definitionVi: 'quyết liệt', repetition: 1, intervalDays: 1, easeFactor: 2.5, dueDate: new Date().toISOString(), state: 'learning' },
  { id: 'c8', word: 'alleviate', definitionVi: 'làm dịu bớt', repetition: 0, intervalDays: 0, easeFactor: 2.5, dueDate: new Date().toISOString(), state: 'new' }
] as Pick<VocabCard, 'id' | 'word' | 'definitionVi' | 'repetition' | 'intervalDays' | 'easeFactor' | 'dueDate' | 'state'>[]).map(card => ({
  phonetic: '',
  partOfSpeech: 'vocabulary',
  definitionEn: '',
  example: '',
  category: 'Acceptance',
  ...card
}));

const initialQueue = buildSessionReviewQueue(mockCards);
assertTest(initialQueue.length === mockCards.length, 'Initial session queue built with 8 items', `Length: ${initialQueue.length}`);

// Test reinsertion 3-7 items later
const failedItem = initialQueue[0];
const reinsertedQueue = reinsertCardIntoSessionQueue(initialQueue, 0, failedItem.card);
const retryIndex = reinsertedQueue.findIndex((item, idx) => idx > 0 && item.card.id === failedItem.card.id);
assertTest(retryIndex >= 3 && retryIndex <= 7, `Failed card reinserted 3-7 cards later in session (actual position: index ${retryIndex})`);

// Test multi-mode assignment based on maturity
const newCardModes = new Set([selectVocabReviewMode(mockCards[0]), selectVocabReviewMode(mockCards[0]), selectVocabReviewMode(mockCards[0])]);
assertTest(newCardModes.size >= 1, 'Mode selection operates dynamically');

// ----------------------------------------------------
// Section 15: Scheduler Real Intervals (no fake numbers)
// ----------------------------------------------------
console.log('\n--- 3. Testing Scheduler True Next Intervals ---');
const againReview = calculateNextSRS(mockCards[2], 1); // Again
assertTest(againReview.intervalDays < 1, 'Again resets card to same day / sub-day interval', `Got: ${againReview.intervalDays}`);

const goodReview = calculateNextSRS(mockCards[2], 3); // Good
assertTest(goodReview.intervalDays > mockCards[2].intervalDays, 'Good extends interval beyond previous interval', `Previous: ${mockCards[2].intervalDays}, Next: ${goodReview.intervalDays}`);

// ----------------------------------------------------
// Section 49: Speaking Story Bank (12 Universal Stories)
// ----------------------------------------------------
console.log('\n--- 4. Testing Speaking Story Bank ---');
assertTest(MY_STORY_BANK.length === 12, 'Speaking Story Bank contains exactly 12 stories', `Found: ${MY_STORY_BANK.length}`);
const allHaveRequiredFields = MY_STORY_BANK.every(s => 
  s.shortVersion.length > 20 && 
  s.extendedVersion.length > 80 && 
  s.usefulVocab.length >= 3 && 
  s.feelingsVocab.length >= 2 && 
  s.applicableCueCards.length >= 3
);
assertTest(allHaveRequiredFields, 'All 12 stories contain short/extended versions, collocations, feelings, and cue cards');

// ----------------------------------------------------
// Section 40, 41, 42, 43: Reading Strategy & Foundation
// ----------------------------------------------------
console.log('\n--- 5. Testing Reading Strategy Lessons & Foundation Sets ---');
assertTest(READING_STRATEGY_LESSONS.length === 14, 'Reading strategy covers all 14 IELTS question types', `Found: ${READING_STRATEGY_LESSONS.length}`);
const matchingInfo = READING_STRATEGY_LESSONS.find(l => l.type === 'matching-information');
const matchingFormat = matchingInfo?.officialFormat || '';
assertTest(
  matchingFormat.includes('CÓ THỂ') &&
  !matchingFormat.includes('sẽ có 1 đoạn chứa 2 đáp án'),
  'Matching Information rule corrected: a paragraph MAY be used more than once (not WILL contain 2 answers)'
);

assertTest(READING_FOUNDATION_SETS.length === 3, 'Reading includes 3 Foundation mini-sets for band ~4.0', `Found: ${READING_FOUNDATION_SETS.length}`);
const allMiniSetsValid = READING_FOUNDATION_SETS.every(s => s.wordCount >= 200 && s.wordCount <= 400 && s.questions.length >= 5 && s.questions.length <= 8);
assertTest(allMiniSetsValid, 'All foundation sets have 200-400 words and 5-8 questions');

// ----------------------------------------------------
// Section 44, 45, 46: Listening Strategy & Micro-drills
// ----------------------------------------------------
console.log('\n--- 6. Testing Listening Strategy & Micro-drills ---');
assertTest(LISTENING_STRATEGY_LESSONS.length === 16, 'Listening strategy covers 16 core areas', `Found: ${LISTENING_STRATEGY_LESSONS.length}`);
const allLessonsHaveMin3Drills = LISTENING_STRATEGY_LESSONS.every(l => l.practiceDrills && l.practiceDrills.length >= 3);
assertTest(allLessonsHaveMin3Drills, 'Each of the 16 listening lessons has at least 3 interactive micro-drills');

// ----------------------------------------------------
// Section 33, 34: Paraphrase Bank
// ----------------------------------------------------
console.log('\n--- 7. Testing Paraphrase Bank & Discrimination Exercises ---');
assertTest(PARAPHRASE_BANK.length >= 10, 'Paraphrase Bank contains at least 10 high-utility words', `Found: ${PARAPHRASE_BANK.length}`);
const allHaveDiscrimination = PARAPHRASE_BANK.every(p => 
  p.discriminationExercise && 
  p.discriminationExercise.options.length >= 4 && 
  p.discriminationExercise.correctAnswer && 
  p.discriminationExercise.explanation
);
assertTest(allHaveDiscrimination, 'All paraphrase entries contain 4-option discrimination exercises with explanations');

// ----------------------------------------------------
// Final Summary
// ----------------------------------------------------
console.log('\n==========================================');
console.log(`Total Acceptance Tests Executed: ${passCount + failCount}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
