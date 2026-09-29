import assert from 'node:assert/strict';
import test from 'node:test';
import type { PlannedStudyTask } from '../src/utils/studyPlanner';
import { buildStudyCalendarEvents, buildStudyCalendarIcs } from '../src/utils/calendarExport';

const task = (overrides: Partial<PlannedStudyTask> = {}): PlannedStudyTask => ({
  id: 'reading-1', date: '2026-10-01', start: '20:00', durationMin: 35,
  title: 'Cambridge Test 5 · Reading Section 1', tabTarget: 'cambridge',
  position: { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading', sectionNumber: 1, updatedAt: '' },
  ...overrides,
});

test('exports one high-level Google Calendar block per day with tasks in its description', () => {
  const tasks = [
    task(), task({ id: 'vocab', start: '20:35', durationMin: 20, title: 'Ôn 8 từ đến hạn', tabTarget: 'vocab', position: undefined }),
    task({ id: 'tomorrow', date: '2026-10-02', start: '19:00', title: 'Cambridge Test 5 · Reading Section 2', position: { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading', sectionNumber: 2, updatedAt: '' } }),
  ];
  const events = buildStudyCalendarEvents(tasks, 'https://study.example.test');
  const ics = buildStudyCalendarIcs(tasks, 'https://study.example.test', new Date('2026-09-29T12:00:00.000Z'));
  const unfolded = ics.replace(/\r\n[ \t]/g, '');

  assert.equal(events.length, 2);
  assert.equal(events[0].date, '2026-10-01');
  assert.equal(events[0].start, '20:00');
  assert.equal(events[0].end, '20:55');
  assert.match(events[0].description, /Reading Section 1.*35 minutes/);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 2);
  assert.match(unfolded, /SUMMARY:IELTS — Study Block/);
  assert.match(unfolded, /DTSTART:20261001T200000/);
  assert.match(unfolded, /DTEND:20261001T205500/);
  assert.ok(unfolded.includes('DESCRIPTION:Cambridge Test 5 · Reading Section 1 — 35 minutes\\nÔn 8 từ đến hạn — 20 minutes\\n\\nOpen IELTS Prep Studio: https://study.example.test'));
  assert.match(unfolded, /TRIGGER:-PT10M/);
  assert.ok(unfolded.includes('UID:ielts-study-20261001@ielts-prep-studio'));
});

test('uses a skill-specific title and folds long Unicode content on UTF-8 boundaries', () => {
  const longTask = task({ title: 'Reading · ' + 'từ vựng '.repeat(24) });
  const ics = buildStudyCalendarIcs([longTask], 'https://study.example.test');
  assert.match(ics, /SUMMARY:IELTS — Reading Focus/);
  assert.ok(ics.split('\r\n').every(line => new TextEncoder().encode(line).length <= 75));
});

test('an empty plan exports a valid calendar without invented events', () => {
  const ics = buildStudyCalendarIcs([], 'https://study.example.test');
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /END:VCALENDAR/);
  assert.ok(!ics.includes('BEGIN:VEVENT'));
});
