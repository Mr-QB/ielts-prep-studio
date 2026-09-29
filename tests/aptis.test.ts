import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { AptisGradeInput, gradeAptisSample } from '../src/utils/aptis';
import aptisSamples from '../src/data/aptisSamples.json';

test('Aptis Reading part 1 checks keyed answers and unanswered gaps', () => {
  const sample = { skill: 'reading' as const, part: '1', content: { questions: [{ id: 'a', correctAnswer: 'train' }, { id: 'b', options: ['tea', 'coffee'] }] }, answers: { b: 'coffee' } };
  assert.deepEqual(gradeAptisSample(sample, { a: 'train', b: 'coffee' }), { score: 2, total: 2 });
  assert.deepEqual(gradeAptisSample(sample, { a: 'bus' }), { score: 0, total: 2 });
});

test('Aptis Reading parts 2–3 grades the complete sentence order', () => {
  const sample = { skill: 'reading' as const, part: '2-3', content: { sentences_original: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] }, answers: { correct_order: [0, 1, 2] } };
  assert.deepEqual(gradeAptisSample(sample, { a: '1', b: '2', c: '3' }), { score: 1, total: 1 });
  assert.deepEqual(gradeAptisSample(sample, { a: '2', b: '1', c: '3' }), { score: 0, total: 1 });
});

test('Aptis Listening compares selected option indexes', () => {
  const sample = { skill: 'listening' as const, part: '1', content: { items: [{ id: 'q', answerIndex: 1, options: ['A', 'B'] }] }, answers: {} };
  assert.deepEqual(gradeAptisSample(sample, { q: '1' }), { score: 1, total: 1 });
  assert.deepEqual(gradeAptisSample(sample, { q: '0' }), { score: 0, total: 1 });
});

test('Aptis Speaking and Writing are not machine-scored', () => {
  for (const skill of ['speaking', 'writing'] as const) {
    assert.equal(gradeAptisSample({ skill, part: '1', content: {}, answers: {} }, {}), null);
  }
});

test('packaged samples include only the four requested skills', () => {
  const counts = Object.fromEntries(['reading', 'listening', 'speaking', 'writing'].map(skill => [skill, aptisSamples.filter(sample => sample.skill === skill).length]));
  assert.deepEqual(counts, { reading: 178, listening: 424, speaking: 188, writing: 140 });
  assert.equal(aptisSamples.length, 930);
  assert.ok(aptisSamples.every(sample => !('source_url' in sample) && !('retrieved_at' in sample)));
  const media = aptisSamples.flatMap(sample => sample.media);
  assert.equal(new Set(media.map(item => item.path)).size, 580);
  assert.ok(media.every(item => fs.existsSync(path.join('public', item.path.slice(1).replace('/', path.sep)))));
});

test('every packaged Reading and Listening sample has a gradeable question set', () => {
  const objectiveSamples = aptisSamples.filter(sample => sample.skill === 'reading' || sample.skill === 'listening');
  assert.ok(objectiveSamples.every(sample => {
    const result = gradeAptisSample(sample as unknown as AptisGradeInput, {});
    return result !== null && result.total > 0 && result.score === 0;
  }));
});
