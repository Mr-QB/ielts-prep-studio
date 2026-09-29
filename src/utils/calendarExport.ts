import type { PlannedStudyTask } from './studyPlanner';

export interface StudyCalendarEvent {
  date: string;
  start: string;
  end: string;
  summary: string;
  description: string;
  url: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

function escapeIcs(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const folded: string[] = [];
  let current = '';
  for (const character of line) {
    if (encoder.encode(current + character).length > 75) {
      folded.push(current);
      current = ` ${character}`;
    } else current += character;
  }
  folded.push(current);
  return folded.join('\r\n');
}

function dateTime(date: string, minutes: number): string {
  const day = date.replaceAll('-', '');
  return `${day}T${pad(Math.floor(minutes / 60))}${pad(minutes % 60)}00`;
}

function parseStart(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function titleFor(tasks: PlannedStudyTask[]): string {
  const onlyCourseTasks = tasks.every(task => task.tabTarget === 'cambridge' && task.position);
  const modules = new Set(tasks.map(task => task.position?.module).filter(Boolean));
  if (onlyCourseTasks && modules.size === 1) {
    const module = [...modules][0];
    if (module === 'reading') return 'IELTS — Reading Focus';
    if (module === 'listening') return 'IELTS — Listening Focus';
    if (module === 'writing') return 'IELTS — Writing Focus';
  }
  const targets = new Set(tasks.map(task => task.tabTarget));
  if (targets.size === 1 && targets.has('vocab')) return 'IELTS — Vocabulary Review';
  if (targets.size === 1 && targets.has('mistakes')) return 'IELTS — Mistake Review';
  if (targets.size === 1 && targets.has('grammar')) return 'IELTS — Grammar Focus';
  return 'IELTS — Study Block';
}

export function buildStudyCalendarEvents(tasks: PlannedStudyTask[], studioUrl: string): StudyCalendarEvent[] {
  const byDate = new Map<string, PlannedStudyTask[]>();
  for (const task of tasks) byDate.set(task.date, [...(byDate.get(task.date) ?? []), task]);

  return [...byDate.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([date, dayTasks]) => {
    const ordered = [...dayTasks].sort((left, right) => left.start.localeCompare(right.start));
    const start = Math.min(...ordered.map(task => parseStart(task.start)));
    const end = Math.max(...ordered.map(task => parseStart(task.start) + task.durationMin));
    return {
      date,
      start: `${pad(Math.floor(start / 60))}:${pad(start % 60)}`,
      end: `${pad(Math.floor(end / 60) % 24)}:${pad(end % 60)}`,
      summary: titleFor(ordered),
      description: [
        ...ordered.map(task => `${task.title} — ${task.durationMin} minutes`),
        '',
        `Open IELTS Prep Studio: ${studioUrl}`,
      ].join('\n'),
      url: studioUrl,
    };
  });
}

export function buildStudyCalendarIcs(tasks: PlannedStudyTask[], studioUrl: string, generatedAt = new Date()): string {
  const stamp = generatedAt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//IELTS Prep Studio//Study Plan//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const event of buildStudyCalendarEvents(tasks, studioUrl)) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:ielts-study-${event.date.replaceAll('-', '')}@ielts-prep-studio`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${dateTime(event.date, parseStart(event.start))}`,
      `DTEND:${dateTime(event.date, parseStart(event.end))}`,
      `SUMMARY:${escapeIcs(event.summary)}`,
      `DESCRIPTION:${escapeIcs(event.description)}`,
      `URL:${escapeIcs(event.url)}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT10M',
      'ACTION:DISPLAY',
      'DESCRIPTION:IELTS study block starts in 10 minutes.',
      'END:VALARM',
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}
