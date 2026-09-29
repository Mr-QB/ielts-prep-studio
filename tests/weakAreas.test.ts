import test from 'node:test';
import assert from 'node:assert/strict';
import type { TestAttempt } from '../src/types';
import { buildWeakAreaStats, buildWeeklySkillStats } from '../src/utils/db';

function attempt(skill: TestAttempt['skill'], correct: number, total: number, sourcePackId = 'cambridge12-gt'): TestAttempt {
  return {
    id: `${skill}-${correct}-${total}`, examFamily: 'ielts', skill, sourcePackId,
    sectionId: 'section', sectionTitle: 'Cambridge', date: '2026-09-29T12:00:00.000Z',
    score: correct, total, durationSeconds: 600, mode: 'study', userAnswers: {},
    incorrectQuestionNumbers: [], mistakeTags: [],
    questionTypeStats: { 'multiple-choice': { correct, total } },
  };
}

test('weak area scores keep the same question type separate by skill and ignore non-Cambridge data', () => {
  const areas = buildWeakAreaStats([
    attempt('reading', 2, 10),
    attempt('listening', 9, 10),
    attempt('reading', 10, 10, 'legacy-demo'),
  ]);

  assert.deepEqual(areas.map(({ questionType, skill, totalQuestions, incorrectCount, accuracyRate }) => ({ questionType, skill, totalQuestions, incorrectCount, accuracyRate })), [
    { questionType: 'multiple-choice', skill: 'reading', totalQuestions: 10, incorrectCount: 8, accuracyRate: 20 },
    { questionType: 'multiple-choice', skill: 'listening', totalQuestions: 10, incorrectCount: 1, accuracyRate: 90 },
  ]);
});

test('weekly skill stats use only Cambridge attempts inside the report window', () => {
  const recentReading = { ...attempt('reading', 6, 10), date: '2026-09-23T12:00:00.000Z' };
  const recentListening = { ...attempt('listening', 9, 10), date: '2026-09-29T12:00:00.000Z' };
  const oldReading = { ...attempt('reading', 0, 10), date: new Date(new Date('2026-09-23T00:00:00').getTime() - 1000).toISOString() };
  const otherSource = { ...attempt('reading', 0, 10, 'legacy-demo'), date: '2026-09-25T12:00:00.000Z' };

  assert.deepEqual(buildWeeklySkillStats([recentReading, recentListening, oldReading, otherSource], '2026-09-23', '2026-09-29'), [
    { skill: 'reading', correctQuestions: 6, totalQuestions: 10, accuracyRate: 60 },
    { skill: 'listening', correctQuestions: 9, totalQuestions: 10, accuracyRate: 90 },
  ]);
});
