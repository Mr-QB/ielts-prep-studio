import type { LearningPosition, StudyPlanSettings } from '../types';

export function isCambridgeTaskAvailable(module: LearningPosition['module'], audioStatus: string): boolean {
  return module !== 'listening' || audioStatus === 'available';
}

export interface CoursePlanTask { position: LearningPosition; title: string; durationMin: number }
export interface PlannedStudyTask { id: string; date: string; start: string; durationMin: number; title: string; tabTarget: 'vocab' | 'mistakes' | 'cambridge' | 'grammar'; position?: LearningPosition; targetId?: string }

export function prioritizeCourseTasks(tasks: CoursePlanTask[], position: LearningPosition | null, weakSkills: LearningPosition['module'][] = []): CoursePlanTask[] {
  const moduleOrder: LearningPosition['module'][] = ['reading', 'listening', 'writing'];
  const orderedModules = [...new Set([...(position ? [position.module] : []), ...weakSkills, ...moduleOrder])];
  return orderedModules.flatMap(module => {
    const group = tasks.filter(task => task.position.module === module);
    if (position?.module !== module) return group;
    const index = group.findIndex(task => task.position.testNumber === position.testNumber && task.position.sectionNumber === position.sectionNumber);
    return index > 0 ? [...group.slice(index), ...group.slice(0, index)] : group;
  });
}

function addDays(date: string, amount: number): string {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + amount);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

export function getStudyWeekStart(today: string): string {
  return addDays(today, -6);
}

function minutes(value: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return NaN;
  const hours = Number(match[1]); const mins = Number(match[2]);
  return hours <= 23 && mins <= 59 ? hours * 60 + mins : NaN;
}

function timeLabel(value: number): string {
  return `${String(Math.floor(value / 60) % 24).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

export function getPlannedCambridgeTest(settings: StudyPlanSettings, today: string): number {
  const start = new Date(`${settings.planStartDate}T12:00:00`).getTime();
  const current = new Date(`${today}T12:00:00`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(current)) return 5;
  const weeksElapsed = Math.max(0, (current - start) / (7 * 24 * 60 * 60 * 1000));
  const totalWeeks = settings.examDate ? Math.max(1, (new Date(`${settings.examDate}T12:00:00`).getTime() - start) / (7 * 24 * 60 * 60 * 1000)) : 16;
  const phase = Math.min(3, Math.floor((weeksElapsed / totalWeeks) * 4));
  return 5 + phase;
}

export function getPlannedStudyMinutes(settings: StudyPlanSettings, dailyStudyMinutes: number, fromDate: string, dayCount = 7): number {
  const intensityCap = settings.intensity === 'minimum' ? 45 : settings.intensity === 'intensive' ? 180 : 135;
  let plannedMinutes = 0;
  for (let offset = 0; offset < dayCount; offset += 1) {
    const date = addDays(fromDate, offset);
    const slot = settings.weeklyAvailability.find(item => item.weekday === new Date(`${date}T12:00:00`).getDay());
    if (!slot) continue;
    const start = minutes(slot.start);
    const end = minutes(slot.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) continue;
    plannedMinutes += Math.floor(Math.min(end - start, dailyStudyMinutes, intensityCap) * 0.8);
  }
  return plannedMinutes;
}

export function createWeeklyStudyPlan(input: {
  settings: StudyPlanSettings;
  today: string;
  nowMinutes?: number;
  dailyStudyMinutes: number;
  dueWords: number;
  dueMistakes: number;
  courseTasks: CoursePlanTask[];
  grammarTasks?: { id: string; title: string; durationMin: number }[];
}): PlannedStudyTask[] {
  const { settings, today } = input;
  const intensityCap = settings.intensity === 'minimum' ? 45 : settings.intensity === 'intensive' ? 180 : 135;
  const queue: Omit<PlannedStudyTask, 'date' | 'start'>[] = [];
  if (input.dueWords > 0) queue.push({ id: 'due-vocabulary', title: `Ôn ${input.dueWords} từ đến hạn`, durationMin: 20, tabTarget: 'vocab' });
  if (input.dueMistakes > 0) queue.push({ id: 'due-mistakes', title: `Làm lại ${input.dueMistakes} câu sai đến hạn`, durationMin: Math.min(25, Math.max(15, input.dueMistakes * 3)), tabTarget: 'mistakes' });
  const grammarQueue = (input.grammarTasks || []).map(task => ({ ...task, targetId: task.id, tabTarget: 'grammar' as const }));
  const courseQueue = input.courseTasks.map((task, index) => ({
    id: `cambridge-${task.position.testNumber}-${task.position.module}-${task.position.sectionNumber}-${index}`,
    title: task.title,
    durationMin: task.durationMin,
    tabTarget: 'cambridge' as const,
    position: task.position,
  }));
  if (getPlannedCambridgeTest(settings, today) === 5) queue.push(...grammarQueue, ...courseQueue);
  else queue.push(...courseQueue, ...grammarQueue);

  const plan: PlannedStudyTask[] = [];
  for (let dayOffset = 0; dayOffset < 7 && queue.length; dayOffset += 1) {
    const date = addDays(today, dayOffset);
    const weekday = new Date(`${date}T12:00:00`).getDay();
    const slot = settings.weeklyAvailability.find(item => item.weekday === weekday);
    if (!slot) continue;
    const start = minutes(slot.start); const end = minutes(slot.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) continue;
    const sessionStart = dayOffset === 0 && input.nowMinutes !== undefined ? Math.max(start, input.nowMinutes) : start;
    if (sessionStart >= end) continue;
    const available = Math.min(end - sessionStart, input.dailyStudyMinutes, intensityCap);
    const budget = Math.floor(available * 0.8); // leave a buffer for breaks and overruns
    let used = 0; let count = 0;
    while (queue.length && count < 3 && used + queue[0].durationMin <= budget) {
      const task = queue.shift()!;
      plan.push({ ...task, date, start: timeLabel(sessionStart + used) });
      used += task.durationMin;
      count += 1;
    }
  }
  return plan;
}
