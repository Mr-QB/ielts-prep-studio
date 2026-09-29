import React, { useEffect, useMemo, useState } from 'react';
import type { AppTab, CambridgeWritingWork, LearningPosition, StudyPlanSettings, TestAttempt, UserProfile, VocabDeck, RecordedMistake } from '../types';
import { buildWeeklySkillStats, getLearnerVocabDecks, getTodayDateString, loadAttemptsFromStorage, loadDecksFromStorage, loadLearningPosition, loadMistakes, loadStudyPlanSettings, loadCambridgeWritingWork, loadGrammarProgress, saveGrammarProgress, saveLearningPosition, saveStudyPlanSettings } from '../utils/db';
import { isMistakeDue } from '../utils/mistakeReview';
import { createWeeklyStudyPlan, getPlannedCambridgeTest, getStudyWeekStart, isCambridgeTaskAvailable, prioritizeCourseTasks, type CoursePlanTask } from '../utils/studyPlanner';
import { buildStudyCalendarEvents, buildStudyCalendarIcs } from '../utils/calendarExport';
import { loadCambridgeManifest } from '../utils/bookPractice';
import type { PrivateBookManifest } from '../types/bookPractice';
import { GRAMMAR_TOPICS } from '../data/grammarData';

const weekdays = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const taskDuration = { reading: 35, listening: 30, writing: 35 } as const;
const taskName = (position: LearningPosition) => `Test ${position.testNumber} · ${position.module === 'reading' ? 'Reading Section' : position.module === 'listening' ? 'Listening Part' : 'Writing Task'} ${position.sectionNumber}`;

function newSettings(): StudyPlanSettings {
  return { id: 'current', weeklyAvailability: [], intensity: 'normal', planStartDate: getTodayDateString(), updatedAt: new Date().toISOString() };
}

function tasksForCurrentTest(manifest: PrivateBookManifest | null, testNumber: number, attempts: TestAttempt[], writing: Record<string, CambridgeWritingWork>, position: LearningPosition | null, weakSkills: LearningPosition['module'][]): CoursePlanTask[] {
  if (!manifest) return [];
  const modules = ['reading', 'listening', 'writing'] as const;
  const availableModules = modules.filter(module => isCambridgeTaskAvailable(module, manifest.audioStatus));
  const tasks = availableModules.flatMap(module => {
    const count = module === 'writing' ? 2 : Math.max(0, ...manifest.importedSections.filter(item => item.testNumber === testNumber && item.skill === module).map(item => item.sectionNumber));
    return Array.from({ length: count }, (_, index) => {
      const sectionNumber = index + 1;
      const taskPosition: LearningPosition = { sourcePackId: 'cambridge12-gt', testNumber, module, sectionNumber, updatedAt: '' };
      const title = taskName(taskPosition);
      const durationMin = module === 'writing' ? 35 : taskDuration[module];
      const latestAttempt = attempts.filter(attempt => attempt.sourcePackId === 'cambridge12-gt' && attempt.testNumber === testNumber && attempt.module === module && attempt.sectionNumber === sectionNumber).sort((a, b) => b.date.localeCompare(a.date))[0];
      const complete = module === 'writing'
        ? Boolean(writing[`test-${testNumber}-task-${sectionNumber}`]?.reviewedAt)
        : Boolean(latestAttempt && (!latestAttempt.incorrectQuestionNumbers.length || latestAttempt.reviewedAt));
      return { position: taskPosition, title, durationMin, complete };
    });
  });
  const pending = tasks.filter(task => !task.complete);
  return prioritizeCourseTasks(pending.map(({ position: taskPosition, title, durationMin }) => ({ position: taskPosition, title, durationMin })), position, weakSkills);
}

interface StudyPlanViewProps { user: UserProfile; onNavigateTab: (tab: AppTab) => void }

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ user, onNavigateTab }) => {
  const [settings, setSettings] = useState<StudyPlanSettings>(newSettings);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [decks, setDecks] = useState<VocabDeck[]>([]);
  const [mistakes, setMistakes] = useState<RecordedMistake[]>([]);
  const [writing, setWriting] = useState<Record<string, CambridgeWritingWork>>({});
  const [grammarProgress, setGrammarProgress] = useState<Record<string, string>>({});
  const [position, setPosition] = useState<LearningPosition | null>(null);
  const [manifest, setManifest] = useState<PrivateBookManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [calendarConfigured, setCalendarConfigured] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarBusy, setCalendarBusy] = useState(false);
  const [calendarMessage, setCalendarMessage] = useState('');
  const today = getTodayDateString();

  useEffect(() => {
    let active = true;
    Promise.all([loadStudyPlanSettings(), loadAttemptsFromStorage(), loadDecksFromStorage([]), loadMistakes(), loadCambridgeWritingWork(), loadLearningPosition(), loadCambridgeManifest(), loadGrammarProgress()])
      .then(([savedSettings, savedAttempts, savedDecks, savedMistakes, savedWriting, savedPosition, book, savedGrammar]) => {
        if (!active) return;
        setSettings(savedSettings || newSettings()); setAttempts(savedAttempts); setDecks(savedDecks); setMistakes(savedMistakes);
        setWriting(savedWriting); setPosition(savedPosition); setManifest(book); setGrammarProgress(savedGrammar);
      })
      .catch(reason => active && setError(reason instanceof Error ? reason.message : 'Không tải được kế hoạch học.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    if (params.has('calendar')) {
      const result = params.get('calendar');
      setCalendarMessage(result === 'connected' ? 'Đã kết nối Google Calendar.' : 'Không thể kết nối Google Calendar. Hãy thử lại.');
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`);
    }
    fetch('/api/calendar/status', { cache: 'no-store' })
      .then(response => response.ok ? response.json() : null)
      .then(status => {
        if (active && status?.success) {
          setCalendarConfigured(Boolean(status.configured));
          setCalendarConnected(Boolean(status.connected));
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [user.id]);

  const dueWords = useMemo(() => {
    const now = Date.now();
    return getLearnerVocabDecks(decks).flatMap(deck => deck.cards).filter(card => !card.dueDate || new Date(card.dueDate).getTime() <= now).length;
  }, [decks]);
  const dueMistakes = mistakes.filter(item => isMistakeDue(item.status, item.nextRetryDate, today)).length;
  const currentTest = position?.testNumber ?? getPlannedCambridgeTest(settings, today);
  const weakSkills = useMemo(() => {
    return buildWeeklySkillStats(attempts, getStudyWeekStart(today), today)
      .filter(stat => stat.totalQuestions >= 10 && isCambridgeTaskAvailable(stat.skill, manifest?.audioStatus ?? 'unavailable'))
      .map(stat => stat.skill);
  }, [attempts, manifest?.audioStatus, today]);
  const courseTasks = tasksForCurrentTest(manifest, currentTest, attempts, writing, position, weakSkills);
  const grammarTasks = GRAMMAR_TOPICS.slice(0, 20).filter(topic => grammarProgress[topic.id] !== 'mastered').map(topic => ({ id: topic.id, title: `Grammar · ${topic.code} ${topic.title}`, durationMin: 20 }));
  const currentMinute = new Date().getHours() * 60 + new Date().getMinutes();
  const plan = createWeeklyStudyPlan({ settings, today, nowMinutes: currentMinute, dailyStudyMinutes: user.dailyStudyMinutes, dueWords, dueMistakes, courseTasks, grammarTasks });

  const updateSettings = (update: Partial<StudyPlanSettings>) => { setSettings(current => ({ ...current, ...update })); setSaved(false); };
  const toggleWeekday = (weekday: number) => {
    const existing = settings.weeklyAvailability.find(item => item.weekday === weekday);
    const availability = existing
      ? settings.weeklyAvailability.filter(item => item.weekday !== weekday)
      : [...settings.weeklyAvailability, { weekday, start: '19:00', end: '21:00' }];
    updateSettings({ weeklyAvailability: availability });
  };
  const setTime = (weekday: number, key: 'start' | 'end', value: string) => updateSettings({
    weeklyAvailability: settings.weeklyAvailability.map(item => item.weekday === weekday ? { ...item, [key]: value } : item)
  });
  const saveSettings = async () => {
    if (!settings.weeklyAvailability.length) { setError('Chọn ít nhất một ngày và khoảng thời gian có thể học.'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(settings.planStartDate)) { setError('Chọn ngày bắt đầu lộ trình 16 tuần.'); return; }
    if (settings.weeklyAvailability.some(item => item.end <= item.start)) { setError('Giờ kết thúc phải sau giờ bắt đầu.'); return; }
    const next = { ...settings, updatedAt: new Date().toISOString() };
    try {
      await saveStudyPlanSettings(next);
      setSettings(next); setError(''); setSaved(true);
    } catch { setError('Không lưu được lịch. Thiết lập trên thiết bị vẫn được giữ lại nếu đã ghi cục bộ.'); }
  };
  const openTask = async (tab: 'vocab' | 'mistakes' | 'cambridge' | 'grammar', target?: LearningPosition, targetId?: string) => {
    if (tab === 'cambridge' && target) await saveLearningPosition({ ...target, updatedAt: new Date().toISOString() });
    if (tab === 'grammar' && targetId) { await saveGrammarProgress(targetId, 'studying'); setGrammarProgress(current => ({ ...current, [targetId]: 'studying' })); }
    onNavigateTab(tab);
  };
  const downloadCalendar = () => {
    const file = new Blob([buildStudyCalendarIcs(plan, window.location.origin)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ielts-study-plan.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const connectCalendar = async () => {
    setCalendarBusy(true); setCalendarMessage('');
    try {
      const response = await fetch('/api/calendar/connect', { method: 'POST' });
      const result = await response.json();
      if (!response.ok || !result.authorizationUrl) throw new Error(result.error || 'Không mở được kết nối Google Calendar.');
      window.location.assign(result.authorizationUrl);
    } catch (reason) {
      setCalendarMessage(reason instanceof Error ? reason.message : 'Không mở được kết nối Google Calendar.');
      setCalendarBusy(false);
    }
  };
  const syncCalendar = async () => {
    setCalendarBusy(true); setCalendarMessage('');
    try {
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: buildStudyCalendarEvents(plan, window.location.origin),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Không đồng bộ được lịch.');
      setCalendarMessage(result.removed
        ? `Đã cập nhật ${result.synced} khối học và xóa ${result.removed} lịch cũ trong 7 ngày tới.`
        : result.synced ? `Đã đồng bộ ${result.synced} khối học lên Google Calendar.` : 'Không có khối học cần cập nhật; lịch Google đã khớp với kế hoạch.');
    } catch (reason) {
      setCalendarMessage(reason instanceof Error ? reason.message : 'Không đồng bộ được lịch.');
    } finally { setCalendarBusy(false); }
  };
  const disconnectCalendar = async () => {
    setCalendarBusy(true); setCalendarMessage('');
    try {
      const response = await fetch('/api/calendar/disconnect', { method: 'POST' });
      if (!response.ok) throw new Error('Không thể ngắt kết nối Google Calendar.');
      setCalendarConnected(false); setCalendarMessage('Đã ngắt kết nối Google Calendar.');
    } catch (reason) {
      setCalendarMessage(reason instanceof Error ? reason.message : 'Không thể ngắt kết nối Google Calendar.');
    } finally { setCalendarBusy(false); }
  };

  if (loading) return <p className="p-6 text-sm text-slate-600">Đang tạo kế hoạch…</p>;
  const weekTasks = new Map<string, typeof plan>();
  for (const task of plan) weekTasks.set(task.date, [...(weekTasks.get(task.date) || []), task]);
  const dates = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(`${today}T12:00:00`); date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  });

  return <div className="mx-auto max-w-4xl space-y-6 pb-16">
    <header className="max-w-2xl"><p className="text-sm text-slate-500">IELTS · 16-week learning plan</p><h1 className="mt-1 font-serif text-3xl text-slate-950">Kế hoạch học</h1><p className="mt-2 text-sm text-slate-600">Lịch tự xếp theo thời gian bạn chọn, việc ôn đến hạn và bước Cambridge đang học. Kế hoạch giữ lại khoảng nghỉ mỗi buổi.</p></header>

    <section className="rounded border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="font-semibold">Thời gian học mỗi tuần</h2>
      <p className="mt-1 text-sm text-slate-600">Mỗi ngày chọn một khung giờ. Bạn có thể đổi giờ bất cứ lúc nào.</p>
      <div className="mt-4 divide-y divide-slate-100">
        {weekdays.map((label, weekday) => {
          const slot = settings.weeklyAvailability.find(item => item.weekday === weekday);
          return <div key={weekday} className="flex flex-wrap items-center gap-3 py-3">
            <label className="flex w-32 items-center gap-2"><input type="checkbox" checked={Boolean(slot)} onChange={() => toggleWeekday(weekday)} /><span>{label}</span></label>
            {slot ? <><label className="text-xs text-slate-500">Từ <input type="time" value={slot.start} onChange={event => setTime(weekday, 'start', event.target.value)} className="ml-1 rounded border border-slate-300 px-2 py-1 text-sm text-slate-800" /></label><label className="text-xs text-slate-500">đến <input type="time" value={slot.end} onChange={event => setTime(weekday, 'end', event.target.value)} className="ml-1 rounded border border-slate-300 px-2 py-1 text-sm text-slate-800" /></label></> : <span className="text-sm text-slate-400">Không xếp lịch</span>}
          </div>;
        })}
      </div>
      <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
        <label className="text-sm">Cường độ<select value={settings.intensity} onChange={event => updateSettings({ intensity: event.target.value as StudyPlanSettings['intensity'] })} className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2"><option value="minimum">Tối thiểu · 45 phút</option><option value="normal">Thông thường · tối đa 135 phút</option><option value="intensive">Tăng cường · tối đa 180 phút</option></select></label>
        <label className="text-sm">Bắt đầu lộ trình 16 tuần<input type="date" value={settings.planStartDate} onChange={event => updateSettings({ planStartDate: event.target.value })} className="mt-1 block w-full rounded border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm">Ngày thi (nếu đã biết)<input type="date" value={settings.examDate || ''} onChange={event => updateSettings({ examDate: event.target.value || undefined })} className="mt-1 block w-full rounded border border-slate-300 px-3 py-2" /></label>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={() => void saveSettings()} className="rounded bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Lưu thời gian</button>{saved && <span role="status" className="text-sm text-emerald-800">Đã lưu trên tài khoản này</span>}<span className="text-sm text-slate-500">Band {user.currentBand.toFixed(1)} → mục tiêu {user.targetBand.toFixed(1)}</span></div>
    </section>

    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">7 ngày tới <span className="font-normal text-slate-500">· Test {currentTest}</span></h2><div className="flex flex-wrap gap-2">{calendarConnected ? <><button type="button" onClick={() => void syncCalendar()} disabled={calendarBusy} className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-45">{calendarBusy ? 'Đang đồng bộ…' : 'Đồng bộ Google Calendar'}</button><button type="button" onClick={() => void disconnectCalendar()} disabled={calendarBusy} className="rounded border border-slate-300 px-3 py-2 text-sm font-medium disabled:opacity-45">Ngắt kết nối</button></> : <button type="button" onClick={() => void connectCalendar()} disabled={!calendarConfigured || calendarBusy} className="rounded border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45">{calendarConfigured ? 'Kết nối Google Calendar' : 'Google Calendar chưa cấu hình'}</button>}<button type="button" onClick={downloadCalendar} disabled={!plan.length} className="rounded border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45">Tải lịch 7 ngày (.ics)</button></div></div>
      <p className="text-sm text-slate-500">Mỗi ngày được gom thành một khối giờ, các nhiệm vụ nằm trong mô tả. Bạn có thể đồng bộ trực tiếp hoặc tải tệp để nhập thủ công.</p>
      {!calendarConfigured && <p className="text-sm text-slate-500">Để bật kết nối trực tiếp, quản trị viên cần đặt GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI và GOOGLE_TOKEN_ENCRYPTION_KEY trong môi trường máy chủ.</p>}
      {calendarMessage && <p role="status" className="text-sm text-slate-700">{calendarMessage}</p>}
      {!settings.weeklyAvailability.length ? <p className="rounded border border-slate-200 bg-white p-5 text-sm text-slate-600">Chọn ngày và giờ học để tạo kế hoạch tuần. Chưa có giờ học nào được cài.</p> : plan.length === 0 ? <p className="rounded border border-slate-200 bg-white p-5 text-sm text-slate-600">Chưa có việc đến hạn hoặc bước Cambridge trong giai đoạn này. Khi dữ liệu học thay đổi, kế hoạch sẽ được xếp lại.</p> : dates.map(date => {
        const dateObj = new Date(`${date}T12:00:00`); const tasks = weekTasks.get(date) || [];
        return <section key={date} className="rounded border border-slate-200 bg-white p-4 sm:p-5"><div className="flex items-baseline justify-between gap-3"><h3 className="font-medium">{weekdays[dateObj.getDay()]}</h3><span className="text-sm text-slate-500">{dateObj.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' })}</span></div>{tasks.length ? <ol className="mt-3 space-y-3">{tasks.map(task => <li key={task.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3"><div><p className="font-medium">{task.title}</p><p className="text-sm text-slate-500">{task.start} · {task.durationMin} phút</p></div><button type="button" onClick={() => void openTask(task.tabTarget, task.position, task.targetId)} className="rounded border border-slate-300 px-3 py-2 text-sm font-medium">Bắt đầu</button></li>)}</ol> : <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-400">Không xếp buổi học</p>}</section>;
      })}
    </section>
    <p className="text-xs leading-5 text-slate-500">Kế hoạch được tính lại từ các lượt làm, từ đến hạn và lỗi sai đang đến hạn. Nếu bỏ lỡ một buổi, việc chưa hoàn thành sẽ chuyển sang khung trống kế tiếp, không cộng dồn quá giới hạn mỗi ngày.</p>
  </div>;
};
