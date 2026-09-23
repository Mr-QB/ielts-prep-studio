import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateNextSRS, previewNextInterval, parseVocabText, analyzeVocabImport } from '../src/utils/srsEngine';
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
