import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CambridgeWritingWork, LearningPosition, TestAttempt } from '../types';
import type { PrivateBookManifest, PrivateWritingSection } from '../types/bookPractice';
import { loadCambridgeManifest, loadCambridgeWritingTest } from '../utils/bookPractice';
import { Cambridge12ListeningPilot } from './Cambridge12ListeningPilot';
import { Cambridge12ReadingPilot } from './Cambridge12ReadingPilot';
import { clearLearningPosition, loadAttemptsFromStorage, loadCambridgeWritingWork, loadLearningPosition, saveCambridgeWritingWork, saveLearningPosition } from '../utils/db';
import { isCambridgeTaskAvailable } from '../utils/studyPlanner';

type Module = LearningPosition['module'];
type TaskState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVIEW';
type CourseTask = { testNumber: number; module: Module; sectionNumber: number; title: string };
const moduleOrder: Module[] = ['reading', 'listening', 'writing'];
const statusLabel: Record<TaskState, string> = { NOT_STARTED: 'Chưa bắt đầu', IN_PROGRESS: 'Đang học', COMPLETED: 'Hoàn thành', NEEDS_REVIEW: 'Cần ôn lại' };

function taskList(manifest: PrivateBookManifest, testNumber: number): CourseTask[] {
  return moduleOrder.flatMap(module => {
    const entries = manifest.importedSections.filter(item => item.testNumber === testNumber && item.skill === module);
    const count = module === 'writing' ? 2 : Math.max(0, ...entries.map(item => item.sectionNumber));
    return Array.from({ length: count }, (_, index) => ({
      testNumber, module, sectionNumber: index + 1,
      title: module === 'reading' ? `Phần ${index + 1}` : module === 'listening' ? `Part ${index + 1}` : `Task ${index + 1}`
    }));
  });
}

function latestAttempt(attempts: TestAttempt[], testNumber: number, module: Module, sectionNumber: number) {
  return attempts.filter(item => item.sourcePackId === 'cambridge12-gt' && item.testNumber === testNumber && item.module === module && item.sectionNumber === sectionNumber)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

export const CambridgeCourseView: React.FC = () => {
  const [manifest, setManifest] = useState<PrivateBookManifest | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [position, setPosition] = useState<LearningPosition | null>(null);
  const [writingWork, setWritingWork] = useState<Record<string, CambridgeWritingWork>>({});
  const [testNumber, setTestNumber] = useState(5);
  const [task, setTask] = useState<CourseTask | null>(null);
  const [page, setPage] = useState<'book' | 'test' | 'practice'>('book');
  const [writing, setWriting] = useState<PrivateWritingSection | null>(null);
  const [draft, setDraft] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const autoResumePosition = useRef('');

  const refresh = async () => {
    const [book, savedAttempts, savedPosition, savedWriting] = await Promise.all([
      loadCambridgeManifest(), loadAttemptsFromStorage(), loadLearningPosition(), loadCambridgeWritingWork()
    ]);
    setManifest(book);
    setAttempts(savedAttempts);
    setPosition(savedPosition);
    setWritingWork(savedWriting);
  };

  useEffect(() => {
    let active = true;
    Promise.all([loadCambridgeManifest(), loadAttemptsFromStorage(), loadLearningPosition(), loadCambridgeWritingWork()])
      .then(([book, savedAttempts, savedPosition, savedWriting]) => {
        if (!active) return;
        setManifest(book); setAttempts(savedAttempts); setPosition(savedPosition); setWritingWork(savedWriting);
      })
    .catch(reason => active && setError(reason instanceof Error ? reason.message : 'Không tải được nội dung Cambridge.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (page !== 'practice' || task?.module !== 'writing' || !writing) return;
    const timeout = window.setTimeout(() => {
      const id = `test-${task.testNumber}-task-${task.sectionNumber}`;
      const work = { id, testNumber: task.testNumber, taskNumber: task.sectionNumber as 1 | 2, draft, updatedAt: new Date().toISOString() } satisfies CambridgeWritingWork;
      void saveCambridgeWritingWork(work).then(() => setWritingWork(previous => ({ ...previous, [id]: work })));
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [draft, page, task, writing]);

  const testTasks = useMemo(() => manifest ? taskList(manifest, testNumber) : [], [manifest, testNumber]);
  const getState = (item: CourseTask): TaskState => {
    if (item.module === 'writing') {
      const work = writingWork[`test-${item.testNumber}-task-${item.sectionNumber}`];
      if (work?.reviewedAt) return 'COMPLETED';
      if (work?.draft.trim()) return 'IN_PROGRESS';
    } else {
      const attempt = latestAttempt(attempts, item.testNumber, item.module, item.sectionNumber);
      if (attempt) return attempt.incorrectQuestionNumbers.length && !attempt.reviewedAt ? 'NEEDS_REVIEW' : 'COMPLETED';
    }
    return position?.testNumber === item.testNumber && position.module === item.module && position.sectionNumber === item.sectionNumber ? 'IN_PROGRESS' : 'NOT_STARTED';
  };

  const taskAvailable = (item: CourseTask) => isCambridgeTaskAvailable(item.module, manifest?.audioStatus || 'unavailable');
  const nextTask = (items: CourseTask[]) => {
    const available = items.filter(taskAvailable);
    return available.find(item => getState(item) === 'NEEDS_REVIEW') ?? available.find(item => getState(item) === 'IN_PROGRESS') ?? available.find(item => getState(item) === 'NOT_STARTED');
  };

  const openTask = async (item: CourseTask) => {
    const nextPosition = { sourcePackId: 'cambridge12-gt', testNumber: item.testNumber, module: item.module, sectionNumber: item.sectionNumber, updatedAt: new Date().toISOString() } satisfies LearningPosition;
    await saveLearningPosition(nextPosition);
    setPosition(nextPosition); setTask(item); setTestNumber(item.testNumber); setPage('practice'); setShowSample(false); setError('');
    if (item.module === 'writing') {
      const content = await loadCambridgeWritingTest(item.testNumber);
      const saved = (await loadCambridgeWritingWork())[ `test-${item.testNumber}-task-${item.sectionNumber}` ];
      setWriting(content); setDraft(saved?.draft ?? '');
    } else { setWriting(null); setDraft(''); }
  };

  useEffect(() => {
    if (loading || page !== 'book' || !manifest || !position) return;
    const key = `${position.testNumber}-${position.module}-${position.sectionNumber}`;
    if (autoResumePosition.current === key) return;
    const target = taskList(manifest, position.testNumber).find(item => item.module === position.module && item.sectionNumber === position.sectionNumber);
    if (!target || !taskAvailable(target) || getState(target) === 'COMPLETED') return;
    autoResumePosition.current = key;
    void openTask(target);
  }, [loading, page, manifest, position, attempts, writingWork]);

  const openResume = () => {
    if (!manifest) return;
    const items = taskList(manifest, position?.testNumber ?? 5);
    const target = position && items.find(item => item.module === position.module && item.sectionNumber === position.sectionNumber);
    const next = target && taskAvailable(target) ? target : nextTask(items);
    if (next) void openTask(next);
    else setPage('test');
  };

  const completeAndNext = async () => {
    if (!manifest || !task) return;
    await refresh();
    const index = testTasks.findIndex(item => item.module === task.module && item.sectionNumber === task.sectionNumber);
    const remaining = testTasks.slice(index + 1);
    const next = nextTask(remaining);
    if (next) { await openTask(next); return; }
    for (const nextTestNumber of manifest.tests.filter(number => number > task.testNumber)) {
      const nextTestTask = nextTask(taskList(manifest, nextTestNumber));
      if (nextTestTask) { await openTask(nextTestTask); return; }
    }
    await clearLearningPosition(); setPosition(null); setTask(null); setPage('test');
  };

  const saveDraft = async () => {
    if (!task || task.module !== 'writing') return;
    const id = `test-${task.testNumber}-task-${task.sectionNumber}`;
    const work = { id, testNumber: task.testNumber, taskNumber: task.sectionNumber as 1 | 2, draft, updatedAt: new Date().toISOString() } satisfies CambridgeWritingWork;
    await saveCambridgeWritingWork(work);
    setWritingWork(previous => ({ ...previous, [id]: work }));
  };

  const markWritingReviewed = async () => {
    if (!task || task.module !== 'writing') return;
    const id = `test-${task.testNumber}-task-${task.sectionNumber}`;
    const work = { id, testNumber: task.testNumber, taskNumber: task.sectionNumber as 1 | 2, draft, reviewedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } satisfies CambridgeWritingWork;
    await saveCambridgeWritingWork(work);
    setWritingWork(previous => ({ ...previous, [id]: work }));
    await completeAndNext();
  };

  if (loading) return <p className="p-6 text-sm text-slate-600">Đang tải Cambridge 12 GT…</p>;
  if (error && !manifest) return <div role="alert" className="rounded border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">{error}</div>;
  if (!manifest) return null;

  if (page === 'practice' && task) {
    const back = async () => {
      if (task.module === 'writing') {
        const id = `test-${task.testNumber}-task-${task.sectionNumber}`;
        const work = { id, testNumber: task.testNumber, taskNumber: task.sectionNumber as 1 | 2, draft, updatedAt: new Date().toISOString() } satisfies CambridgeWritingWork;
        await saveCambridgeWritingWork(work);
        setWritingWork(previous => ({ ...previous, [id]: work }));
      }
      await refresh(); setPage('test'); setTask(null);
    };
    if (task.module === 'reading') return <Cambridge12ReadingPilot key={`${task.testNumber}-r-${task.sectionNumber}`} testNumber={task.testNumber} sectionNumber={task.sectionNumber} onBack={back} onNext={() => void completeAndNext()} />;
    if (task.module === 'listening') return <Cambridge12ListeningPilot key={`${task.testNumber}-l-${task.sectionNumber}`} testNumber={task.testNumber} partNumber={task.sectionNumber} onBack={back} onNext={() => void completeAndNext()} />;
    const writingTask = writing?.tasks.find(item => item.taskNumber === task.sectionNumber);
    if (!writingTask) return <p className="p-6">Đang tải đề Writing…</p>;
    const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
    return <div className="mx-auto max-w-3xl space-y-5">
      <nav aria-label="Đường dẫn" className="text-sm text-slate-500"><button onClick={() => void back()} className="underline">Cambridge 12</button> › <button onClick={() => void back()} className="underline">Test {task.testNumber}</button> › Writing › Task {task.sectionNumber}</nav>
      <section className="rounded border border-slate-200 bg-white p-6">
        <h1 className="font-serif text-2xl">Test {task.testNumber} · Writing · Task {task.sectionNumber}</h1>
        <p className="mt-4 whitespace-pre-line leading-7">{writingTask.prompt}</p>
        <p className="mt-3 text-sm text-slate-500">Trang {writingTask.printedPage} trong sách · Viết bài rồi đối chiếu với bài mẫu.</p>
      </section>
      <section className="rounded border border-slate-200 bg-white p-6">
        <label htmlFor="cambridge-writing-draft" className="block font-medium">Bài viết của bạn</label>
        <textarea id="cambridge-writing-draft" value={draft} onChange={event => setDraft(event.target.value)} onBlur={() => void saveDraft()} rows={14} className="mt-3 w-full rounded border border-slate-300 p-3 leading-6" />
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500"><span>{wordCount} từ</span><button type="button" onClick={() => void saveDraft()} className="rounded border border-slate-300 px-3 py-2 text-slate-800">Lưu nháp</button></div>
      </section>
      <section className="rounded border border-slate-200 bg-white p-6">
        <button type="button" onClick={() => setShowSample(value => !value)} aria-expanded={showSample} className="font-medium underline underline-offset-4">{showSample ? 'Ẩn bài mẫu' : 'Đối chiếu với bài mẫu trong sách'}</button>
        {showSample && <div className="mt-4 space-y-2"><p className="text-sm text-slate-600">Trang in {writingTask.sampleAnswerPrintedPage} · Band {writingTask.sampleAnswerBand?.toFixed(1)} · Đây là phần tự đối chiếu, ứng dụng không chấm điểm bài viết.</p>{writingTask.sampleAnswerAsset && <img src={writingTask.sampleAnswerAsset} alt={`Bài mẫu Writing Test ${task.testNumber}, Task ${task.sectionNumber}`} className="h-auto w-full" loading="lazy" />}</div>}
      </section>
      {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
      <div className="flex justify-end">{writingWork[`test-${task.testNumber}-task-${task.sectionNumber}`]?.reviewedAt ? <button type="button" onClick={() => void completeAndNext()} className="rounded bg-slate-900 px-4 py-3 text-sm font-medium text-white">Việc tiếp theo</button> : <button type="button" disabled={!draft.trim() || !showSample} onClick={() => void markWritingReviewed()} className="rounded bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-40">Tôi đã đối chiếu bài viết</button>}</div>
    </div>;
  }

  if (page === 'test') {
    const state = (item: CourseTask) => getState(item);
    const upcoming = nextTask(testTasks);
    return <div className="mx-auto max-w-3xl space-y-5">
      <nav aria-label="Đường dẫn" className="text-sm text-slate-500"><button onClick={() => setPage('book')} className="underline">Cambridge 12 GT</button> › Test {testNumber}</nav>
      <header><p className="text-xs uppercase tracking-wide text-slate-500">IELTS General Training</p><h1 className="mt-1 font-serif text-3xl">Test {testNumber}</h1></header>
      {moduleOrder.map(module => <section key={module} className="rounded border border-slate-200 bg-white p-5"><h2 className="mb-3 font-semibold capitalize">{module}</h2><div className="divide-y divide-slate-100">{testTasks.filter(item => item.module === module).map(item => {
        const unavailable = !taskAvailable(item);
        const attempt = latestAttempt(attempts, testNumber, module, item.sectionNumber);
              return <button key={`${item.module}-${item.sectionNumber}`} type="button" disabled={unavailable} onClick={() => void openTask(item)} className="flex w-full items-center justify-between gap-4 py-3 text-left hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"><span>{item.title}</span><span className="text-sm text-slate-500">{unavailable ? 'Chưa có audio Cambridge gốc' : state(item) === 'COMPLETED' ? `${attempt?.score ?? ''}/${attempt?.total ?? ''} đúng · ${statusLabel[state(item)]}` : statusLabel[state(item)]}</span></button>;
      })}</div></section>)}
      {upcoming && <button type="button" onClick={() => void openTask(upcoming)} className="rounded bg-slate-900 px-5 py-3 text-sm font-medium text-white">Tiếp tục · {upcoming.title}</button>}
    </div>;
  }

  return <div className="mx-auto max-w-3xl space-y-5">
    <header><p className="text-xs uppercase tracking-wide text-slate-500">Học liệu cá nhân</p><h1 className="mt-1 font-serif text-3xl">Cambridge IELTS 12 GT</h1><p className="mt-2 text-sm text-slate-600">Tiến độ học của bạn</p></header>
    {position && <section className="rounded border border-emerald-200 bg-emerald-50 p-5"><p className="text-xs uppercase tracking-wide text-emerald-900">Học tiếp</p><p className="mt-1 font-medium">Test {position.testNumber} · {position.module === 'reading' ? 'Reading · Phần' : position.module === 'listening' ? 'Listening · Part' : 'Writing · Task'} {position.sectionNumber}</p><button type="button" onClick={openResume} className="mt-3 rounded bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Tiếp tục</button></section>}
    <div className="divide-y divide-slate-200 rounded border border-slate-200 bg-white">{manifest.tests.map(number => {
      const items = taskList(manifest, number);
      const availableItems = items.filter(taskAvailable);
      const completed = availableItems.filter(item => getState(item) === 'COMPLETED').length;
      const percentage = availableItems.length ? Math.round(completed * 100 / availableItems.length) : 0;
      const next = nextTask(items);
      return <section key={number} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-serif text-xl">Test {number}</h2><p className="mt-1 text-sm text-slate-600">{availableItems.length ? `Hoàn thành ${percentage}% · ${completed}/${availableItems.length} bước khả dụng` : 'Chưa bắt đầu'}</p></div><button type="button" onClick={() => { setTestNumber(number); setPage('test'); }} className="rounded border border-slate-300 px-4 py-2 text-sm">{next ? (['IN_PROGRESS', 'NEEDS_REVIEW'].includes(getState(next)) ? `Tiếp tục Test ${number}` : `Bắt đầu Test ${number}`) : 'Xem lại Test'}</button></section>;
    })}</div>
  </div>;
};
