import test from 'node:test';
import assert from 'node:assert/strict';
import { countMistakesMasteredBetween, isMistakeAnswerCorrect, isMistakeDue, mistakeOptionValue, nextMistakeRetryDays } from '../src/utils/mistakeReview';

test('mistake retry accepts alternate spellings and harmless punctuation without accepting partial answers', () => {
  assert.equal(isMistakeAnswerCorrect(' SELF-employed! ', 'employed / self-employed'), true);
  assert.equal(isMistakeAnswerCorrect('FALSE.', 'false'), true);
  assert.equal(isMistakeAnswerCorrect('self', 'self-employed / employed'), false);
});

test('mistake retry submits the same answer code used by Cambridge multiple-choice exercises', () => {
  for (const option of ['A. The first answer', 'B) The second answer', 'C The third answer', 'D']) {
    const value = mistakeOptionValue(option);
    assert.equal(isMistakeAnswerCorrect(value, 'B'), value === 'B');
  }
  assert.equal(mistakeOptionValue('environment'), 'environment');
});

test('mistake retry spaces incorrect answers and requires two consecutive successful retries', () => {
  assert.equal(nextMistakeRetryDays(1, false, 0), 1);
  assert.equal(nextMistakeRetryDays(2, false, 0), 3);
  assert.equal(nextMistakeRetryDays(3, false, 0), 7);
  assert.equal(nextMistakeRetryDays(1, true, 1), 3);
  assert.equal(nextMistakeRetryDays(2, true, 2), null);
});

test('only mistakes due today or earlier appear in today review actions', () => {
  assert.equal(isMistakeDue('retry', '2026-09-28', '2026-09-29'), true);
  assert.equal(isMistakeDue('learning', '2026-09-29', '2026-09-29'), true);
  assert.equal(isMistakeDue('learning', '2026-09-30', '2026-09-29'), false);
  assert.equal(isMistakeDue('mastered', undefined, '2026-09-29'), false);
});

test('weekly cleared-mistake count uses explicit mastery timestamps in the report window', () => {
  assert.equal(countMistakesMasteredBetween([
    { masteredAt: '2026-09-23T12:00:00.000Z' },
    { masteredAt: '2026-09-29T12:00:00.000Z' },
    { masteredAt: '2026-09-22T00:00:00.000Z' },
    { masteredAt: undefined },
  ], '2026-09-23', '2026-09-29'), 2);
});
