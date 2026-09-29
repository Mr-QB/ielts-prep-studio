import test from 'node:test';
import assert from 'node:assert/strict';
import type { BookAnswerKey, PrivateReadingSection } from '../src/types/bookPractice';
import { flattenBookReadingQuestions, gradePrivateAnswers, selectBookAnswerKeyQuestions, validatePrivateReadingSection } from '../src/utils/bookPractice';
import { readingChoiceValue } from '../src/utils/bookPracticeGrade';

function syntheticSection(): PrivateReadingSection {
  return {
    schemaVersion: 1, bookId: 'synthetic-book', testNumber: 1, sectionNumber: 1, title: 'Synthetic section',
    passages: [{ id: 'p1', title: 'Synthetic passage', text: 'Text created only for automated tests.', sourcePdfPage: 1, printedPage: 1, questionRange: [1, 2] }],
    questionGroups: [{ id: 'g1', type: 'matching-features', instructions: 'Select a feature.', questionStart: 1, questionEnd: 2, options: ['A', 'B'], sourcePdfPage: 1, printedPage: 1, questions: [
      { id: 'q1', number: 1, type: 'matching-features', prompt: 'Choose a feature.', sourcePdfPage: 1, printedPage: 1 },
      { id: 'q2', number: 2, type: 'matching-features', prompt: 'Choose a feature.', sourcePdfPage: 1, printedPage: 1 }
    ] }]
  };
}

test('radio option values preserve semantic multiword answers', () => {
  assert.equal(readingChoiceValue('A. Bristol'), 'A');
  assert.equal(readingChoiceValue('B) Oxford'), 'B');
  assert.equal(readingChoiceValue('NOT GIVEN'), 'NOT GIVEN');
  assert.equal(readingChoiceValue('TRUE'), 'TRUE');
});

test('validates synthetic book practice schemas and keeps answer keys separate', () => {
  const section = syntheticSection();
  const key: BookAnswerKey = { schemaVersion: 1, testNumber: 1, module: 'reading', sourcePdfPage: 1, printedPage: 1, answers: { '1': 'A', '2': 'TRUE' } };
  assert.deepEqual(validatePrivateReadingSection(section, key), []);
  assert.equal(flattenBookReadingQuestions(section).some(question => 'correctAnswer' in question), false);
});

test('flags duplicate numbers, missing answer keys, and unsupported layouts', () => {
  const section = syntheticSection();
  section.questionGroups[0].questions[1] = { ...section.questionGroups[0].questions[1], number: 1, type: 'unsupported-layout' as PrivateReadingSection['questionGroups'][number]['questions'][number]['type'] };
  section.questionGroups[0].questionEnd = 1;
  const errors = validatePrivateReadingSection(section, { schemaVersion: 1, testNumber: 1, module: 'reading', sourcePdfPage: 1, printedPage: 1, answers: { '3': 'C' } });
  assert.ok(errors.some(error => error.includes('duplicated')));
  assert.ok(errors.some(error => error.includes('unsupported type')));
  assert.ok(errors.some(error => error.includes('Missing answer for question 1')));
  assert.ok(errors.some(error => error.includes('without questions')));
});

test('grades normalized answers and treats missing answers as incorrect', () => {
  const key: BookAnswerKey = { schemaVersion: 1, testNumber: 1, module: 'reading', sourcePdfPage: 1, printedPage: 1, answers: { '1': 'A', '2': 'TRUE' } };
  assert.deepEqual(gradePrivateAnswers(key, { '1': ' a ', '2': 'false' }), { score: 1, total: 2, answers: { '1': 'A', '2': 'TRUE' }, correctByQuestion: { '1': true, '2': false } });
  assert.deepEqual(gradePrivateAnswers(key, {}), { score: 0, total: 2, answers: { '1': 'A', '2': 'TRUE' }, correctByQuestion: { '1': false, '2': false } });
});

test('grades either-order paired answers without accepting a duplicate choice twice', () => {
  const key: BookAnswerKey = {
    schemaVersion: 1, testNumber: 1, module: 'listening', sourcePdfPage: 1, printedPage: 1,
    answers: { '11': ['D', 'E'], '12': ['D', 'E'] },
    constraints: [{ questionNumbers: [11, 12], acceptableAssignments: [['D', 'E'], ['E', 'D']] }]
  };
  assert.equal(gradePrivateAnswers(key, { '11': 'E', '12': 'D' }).score, 2);
  assert.equal(gradePrivateAnswers(key, { '11': 'D', '12': 'D' }).score, 1);
});

test('selects one section answer key without breaking paired answer constraints', () => {
  const key: BookAnswerKey = {
    schemaVersion: 1, testNumber: 1, module: 'listening', sourcePdfPage: 1, printedPage: 1,
    answers: { '1': 'A', '2': ['B', 'C'], '3': ['B', 'C'], '4': 'D' },
    constraints: [{ questionNumbers: [2, 3], acceptableAssignments: [['B', 'C'], ['C', 'B']] }]
  };
  const section = selectBookAnswerKeyQuestions(key, [2, 3]);
  assert.deepEqual(Object.keys(section.answers), ['2', '3']);
  assert.equal(section.constraints?.length, 1);
  assert.equal(gradePrivateAnswers(section, { '2': 'C', '3': 'B' }).score, 2);
});
