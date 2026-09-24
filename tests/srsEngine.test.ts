import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateNextSRS,
  previewNextInterval,
  parseVocabText,
  analyzeVocabImport,
  suggestVocabCorrection,
  damerauLevenshteinDistance,
  classifyVocabError,
  selectVocabReviewMode,
  buildSessionReviewQueue,
  reinsertCardIntoSessionQueue
} from '../src/utils/srsEngine';
import { VocabCard } from '../src/types';

const mockNewCard: VocabCard = {
  id: 'test-1',
  word: 'proliferation',
  phonetic: '/prəˌlɪf.əˈreɪ.ʃən/',
  partOfSpeech: 'noun',
  definitionVi: 'sự tăng nhanh',
  definitionEn: 'rapid increase',
  example: 'The proliferation of devices.',
  category: 'Tech',
  repetition: 0,
  intervalDays: 0,
  easeFactor: 2.5,
  dueDate: new Date().toISOString(),
  state: 'new'
};

describe('SM-2 SRS Engine & Interval Preview', () => {
  it('resets repetition and sets ~10 min interval on Again (1)', () => {
    const card: VocabCard = { ...mockNewCard, repetition: 3, intervalDays: 14 };
    const next = calculateNextSRS(card, 1);
    assert.strictEqual(next.repetition, 0);
    assert.strictEqual(next.intervalDays, 0.007);
    assert.strictEqual(next.state, 'learning');
    assert.strictEqual(previewNextInterval(card, 1), '< 10m');
  });

  it('sets 12 hours interval for new card on Hard (2)', () => {
    const next = calculateNextSRS(mockNewCard, 2);
    assert.strictEqual(next.repetition, 1);
    assert.strictEqual(next.intervalDays, 0.5);
    // Verified: previewNextInterval matches actual 12h calculation
    assert.strictEqual(previewNextInterval(mockNewCard, 2), '12h');
  });

  it('schedules Good (3) intervals properly across repetitions', () => {
    // Rep 0 -> 1 day
    const step1 = calculateNextSRS(mockNewCard, 3);
    assert.strictEqual(step1.repetition, 1);
    assert.strictEqual(step1.intervalDays, 1);
    assert.strictEqual(previewNextInterval(mockNewCard, 3), '1d');

    // Rep 1 -> 3 days
    const step2 = calculateNextSRS(step1, 3);
    assert.strictEqual(step2.repetition, 2);
    assert.strictEqual(step2.intervalDays, 3);
    assert.strictEqual(previewNextInterval(step1, 3), '3d');

    // Rep 2 -> round(3 * 2.5) = 8 days
    const step3 = calculateNextSRS(step2, 3);
    assert.strictEqual(step3.repetition, 3);
    assert.strictEqual(step3.intervalDays, 8);
    assert.strictEqual(previewNextInterval(step2, 3), '8d');
  });

  it('schedules Easy (4) intervals and boosts ease factor', () => {
    const step1 = calculateNextSRS(mockNewCard, 4);
    assert.strictEqual(step1.repetition, 1);
    assert.strictEqual(step1.intervalDays, 3);
    assert.strictEqual(step1.easeFactor, 2.65);
    assert.strictEqual(previewNextInterval(mockNewCard, 4), '3d');

    const step2 = calculateNextSRS(step1, 4);
    assert.strictEqual(step2.repetition, 2);
    assert.strictEqual(step2.intervalDays, 6);
    assert.strictEqual(previewNextInterval(step1, 4), '6d');
  });
});

describe('Vocab Text Parser', () => {
  it('parses hyphen delimited format (word - vi - example)', () => {
    const text = 'mitigate - giảm nhẹ tác hại - Subsidies mitigate emissions.';
    const parsed = parseVocabText(text);
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].word, 'mitigate');
    assert.strictEqual(parsed[0].definitionVi, 'giảm nhẹ tác hại');
    assert.strictEqual(parsed[0].example, 'Subsidies mitigate emissions.');
  });

  it('parses pipe delimited format (word | ipa | vi | example)', () => {
    const text = 'deplete | /dɪˈpliːt/ | làm cạn kiệt | Overfishing depletes stock.';
    const parsed = parseVocabText(text);
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].word, 'deplete');
    assert.strictEqual(parsed[0].phonetic, '/dɪˈpliːt/');
    assert.strictEqual(parsed[0].definitionVi, 'làm cạn kiệt');
    assert.strictEqual(parsed[0].example, 'Overfishing depletes stock.');
  });

  it('parses tab separated format', () => {
    const text = "discrepancy\tsự chênh lệch\tA large discrepancy was noted.";
    const parsed = parseVocabText(text);
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].word, 'discrepancy');
    assert.strictEqual(parsed[0].definitionVi, 'sự chênh lệch');
  });

  it('parses plain lists and bullet prefixes without splitting contextual commas or saving placeholders', () => {
    const parsed = parseVocabText('consistency\n2. candidate\n- angular pattern\nreliable, consistent and robust');
    assert.deepStrictEqual(parsed.map(card => card.word), [
      'consistency', 'candidate', 'angular pattern', 'reliable, consistent and robust'
    ]);
    assert(parsed.every(card => !card.definitionVi && !card.definitionEn && !card.example));
  });

  it('uses explicit CSV parsing and preserves quoted commas', () => {
    const parsed = parseVocabText('word,meaning,example\n"well-being",sức khỏe,"Health, education and safety matter."', 'Import', 'csv');
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].word, 'well-being');
    assert.strictEqual(parsed[0].definitionVi, 'sức khỏe');
    assert.strictEqual(parsed[0].example, 'Health, education and safety matter.');
  });

  it('analyzes import and accurately detects duplicates and invalid lines', () => {
    const raw = `
# Comment line should be ignored
mitigate - làm dịu bớt
deplete - cạn kiệt
mitigate - từ lặp lại
unprecedented - chưa từng có
`;
    const existingWords = new Set(['unprecedented']);
    const result = analyzeVocabImport(raw, existingWords);

    assert.strictEqual(result.parsed.length, 4);
    assert.strictEqual(result.previewCards.length, 4);
    // 'mitigate' is duplicated within upload, 'unprecedented' exists in deck
    assert.strictEqual(result.duplicateCount, 2);
    assert(result.existingDuplicateWords.includes('mitigate'));
    assert(result.existingDuplicateWords.includes('unprecedented'));
  });
});

describe('Active Retrieval Engine & Typo Tolerance', () => {
  it('correctly calculates Damerau-Levenshtein distance including transpositions', () => {
    assert.strictEqual(damerauLevenshteinDistance('environment', 'environment'), 0);
    // 1 omission (missing 'n')
    assert.strictEqual(damerauLevenshteinDistance('enviroment', 'environment'), 1);
    // 1 transposition (teh -> the)
    assert.strictEqual(damerauLevenshteinDistance('teh', 'the'), 1);
    // 1 substitution
    assert.strictEqual(damerauLevenshteinDistance('cat', 'bat'), 1);
  });

  it('suggests a nearby spelling without changing the entered word', () => {
    assert.strictEqual(suggestVocabCorrection('imdependent', ['independent']), 'independent');
    assert.strictEqual(suggestVocabCorrection('rollout', ['independent']), undefined);
  });

  it('classifies spelling errors vs recall failures vs morphology', () => {
    // Exact match
    const exact = classifyVocabError('significant', 'significant');
    assert.strictEqual(exact.errorType, 'NONE');
    assert.strictEqual(exact.isCorrect, true);

    // Spelling error (enviroment -> environment)
    const typo = classifyVocabError('enviroment', 'environment');
    assert.strictEqual(typo.errorType, 'SPELLING_ERROR');
    assert.strictEqual(typo.isCorrect, false);
    assert(typo.messageVi.includes('chính tả'));

    // Morphology error (significance -> significant)
    const morph = classifyVocabError('significance', 'significant', 'significant');
    assert.strictEqual(morph.errorType, 'MORPHOLOGY_ERROR');
    assert.strictEqual(morph.isCorrect, false);

    // Recall failure (completely different word)
    const fail = classifyVocabError('education', 'environment');
    assert.strictEqual(fail.errorType, 'RECALL_FAILURE');
    assert.strictEqual(fail.isCorrect, false);

    // Blank submission
    const blank = classifyVocabError('', 'environment');
    assert.strictEqual(blank.errorType, 'RECALL_FAILURE');
  });

  it('builds session queue and reinserts failed card 3–7 items later', () => {
    const cards: VocabCard[] = [
      { ...mockNewCard, id: 'c1', word: 'mitigate' },
      { ...mockNewCard, id: 'c2', word: 'significant' },
      { ...mockNewCard, id: 'c3', word: 'environment' },
      { ...mockNewCard, id: 'c4', word: 'education' },
      { ...mockNewCard, id: 'c5', word: 'benefit' },
      { ...mockNewCard, id: 'c6', word: 'solution' },
      { ...mockNewCard, id: 'c7', word: 'challenge' },
      { ...mockNewCard, id: 'c8', word: 'decrease' }
    ];

    const queue = buildSessionReviewQueue(cards);
    assert.strictEqual(queue.length, 8);

    // If user fails card 0 ('mitigate') at currentIndex 0
    const reinsertedQueue = reinsertCardIntoSessionQueue(queue, 0, cards[0], 'typing_vi_en');
    assert.strictEqual(reinsertedQueue.length, 9);
    // Verify mitigate appears again further down the queue
    const retryIndices = reinsertedQueue
      .map((item, idx) => (item.card.word === 'mitigate' ? idx : -1))
      .filter(idx => idx !== -1);
    assert.strictEqual(retryIndices.length, 2);
    assert.strictEqual(retryIndices[0], 0);
    assert(retryIndices[1] >= 3, `Expected retry index >= 3, got ${retryIndices[1]}`);
  });

  it('selects appropriate review modes based on card maturity', () => {
    const newCard: VocabCard = { ...mockNewCard, repetition: 0, state: 'new' };
    const matureCard: VocabCard = {
      ...mockNewCard,
      repetition: 4,
      intervalDays: 28,
      state: 'mastered',
      collocations: ['rapid proliferation']
    };

    const mode1 = selectVocabReviewMode(newCard);
    assert(['recall', 'typing_vi_en', 'cloze', 'collocation'].includes(mode1));

    const mode2 = selectVocabReviewMode(matureCard);
    assert(['recall', 'typing_vi_en', 'cloze', 'collocation', 'audio_spelling', 'paraphrase_context'].includes(mode2));
  });
});
