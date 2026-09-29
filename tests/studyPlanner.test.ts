import test from 'node:test';
import assert from 'node:assert/strict';
import type { LearningPosition, StudyPlanSettings } from '../src/types';
import { createWeeklyStudyPlan, getPlannedCambridgeTest, getPlannedStudyMinutes, isCambridgeTaskAvailable, prioritizeCourseTasks } from '../src/utils/studyPlanner';

const settings: StudyPlanSettings = {
  id: 'current', planStartDate: '2026-09-01', intensity: 'normal', updatedAt: '',
  weeklyAvailability: Array.from({ length: 7 }, (_, weekday) => ({ weekday, start: '19:00', end: '21:30' })),
};

test('planner prioritizes due reviews, follows Cambridge sequence, and leaves a time buffer', () => {
  const position: LearningPosition = { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading', sectionNumber: 1, updatedAt: '' };
  const plan = createWeeklyStudyPlan({
    settings, today: '2026-09-29', dailyStudyMinutes: 150, dueWords: 12, dueMistakes: 4,
    courseTasks: [
      { position, title: 'Test 5 · Reading Section 1', durationMin: 35 },
      { position: { ...position, sectionNumber: 2 }, title: 'Test 5 · Reading Section 2', durationMin: 35 },
    ],
  });
  assert.deepEqual(plan.slice(0, 3).map(item => item.tabTarget), ['vocab', 'mistakes', 'cambridge']);
  assert.equal(plan[0].date, '2026-09-29');
  const firstDayMinutes = plan.filter(item => item.date === '2026-09-29').reduce((sum, item) => sum + item.durationMin, 0);
  assert.ok(firstDayMinutes <= 108, 'normal intensity reserves at least 20% of the 135 minute cap');
  assert.ok(plan.every(item => item.start >= '19:00' && item.date <= '2026-10-05'));
});

test('planner uses four-week Cambridge stages and compresses them toward an exam date', () => {
  assert.equal(getPlannedCambridgeTest(settings, '2026-09-01'), 5);
  assert.equal(getPlannedCambridgeTest(settings, '2026-09-29'), 6);
  assert.equal(getPlannedCambridgeTest({ ...settings, planStartDate: '2026-01-01' }, '2026-01-29'), 6);
  assert.equal(getPlannedCambridgeTest({ ...settings, planStartDate: '2026-01-01', examDate: '2026-02-26' }, '2026-01-29'), 7);
});

test('planned study minutes follow saved availability, daily intensity caps, and the planner break buffer', () => {
  assert.equal(getPlannedStudyMinutes(settings, 150, '2026-09-29'), 756);
  assert.equal(getPlannedStudyMinutes({ ...settings, intensity: 'minimum' }, 150, '2026-09-29'), 252);
  assert.equal(getPlannedStudyMinutes({ ...settings, weeklyAvailability: [{ weekday: 2, start: '19:00', end: '21:30' }] }, 150, '2026-09-29'), 108);
});

test('course planning prioritizes a measured weak skill while preserving section order and the saved position', () => {
  const tasks = [
    { position: { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading' as const, sectionNumber: 1, updatedAt: '' }, title: 'Reading 1', durationMin: 35 },
    { position: { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading' as const, sectionNumber: 2, updatedAt: '' }, title: 'Reading 2', durationMin: 35 },
    { position: { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'listening' as const, sectionNumber: 1, updatedAt: '' }, title: 'Listening 1', durationMin: 30 },
    { position: { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'writing' as const, sectionNumber: 1, updatedAt: '' }, title: 'Writing 1', durationMin: 35 },
  ];
  assert.deepEqual(prioritizeCourseTasks(tasks, null, ['listening', 'reading']).map(task => task.title), ['Listening 1', 'Reading 1', 'Reading 2', 'Writing 1']);
  assert.deepEqual(prioritizeCourseTasks(tasks, { ...tasks[1].position }, ['listening', 'reading']).map(task => task.title), ['Reading 2', 'Reading 1', 'Listening 1', 'Writing 1']);
});

test('planner schedules nothing outside configured availability or after the seven-day window', () => {
  const plan = createWeeklyStudyPlan({
    settings: { ...settings, weeklyAvailability: [{ weekday: 1, start: '20:00', end: '21:00' }] },
    today: '2026-09-29', dailyStudyMinutes: 180, dueWords: 0, dueMistakes: 0,
    courseTasks: Array.from({ length: 10 }, (_, sectionNumber) => ({
      position: { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading' as const, sectionNumber: sectionNumber + 1, updatedAt: '' },
      title: `Section ${sectionNumber + 1}`, durationMin: 35,
    })),
  });
  assert.equal(plan.length, 1);
  assert.equal(plan[0].date, '2026-10-05');
  assert.equal(plan[0].start, '20:00');
});

test('foundation phase schedules real grammar lessons before Cambridge and skips elapsed time slots', () => {
  const foundationSettings = { ...settings, planStartDate: '2026-09-29', weeklyAvailability: [{ weekday: 2, start: '19:00', end: '21:00' }] };
  const position: LearningPosition = { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading', sectionNumber: 1, updatedAt: '' };
  const plan = createWeeklyStudyPlan({
    settings: foundationSettings, today: '2026-09-29', dailyStudyMinutes: 180, dueWords: 0, dueMistakes: 0,
    grammarTasks: [{ id: 'g01', title: 'Grammar · G01 Sentence Structure', durationMin: 20 }],
    courseTasks: [{ position, title: 'Test 5 · Reading Section 1', durationMin: 35 }],
  });
  assert.deepEqual(plan.map(item => item.tabTarget), ['grammar', 'cambridge']);
  const missed = createWeeklyStudyPlan({
    settings: foundationSettings, today: '2026-09-29', nowMinutes: 22 * 60, dailyStudyMinutes: 180, dueWords: 0, dueMistakes: 0,
    courseTasks: [{ position, title: 'Test 5 · Reading Section 1', durationMin: 35 }],
  });
  assert.equal(missed.length, 0, 'does not plan an evening session in the past');
});

test('planner marks Listening unavailable until authentic audio is packaged', () => {
  assert.equal(isCambridgeTaskAvailable('reading', 'AUDIO_IMPORT_READY'), true);
  assert.equal(isCambridgeTaskAvailable('writing', 'unavailable'), true);
  assert.equal(isCambridgeTaskAvailable('listening', 'AUDIO_IMPORT_READY'), false);
  assert.equal(isCambridgeTaskAvailable('listening', 'available'), true);
});
