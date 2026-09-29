import React, { useEffect, useState } from 'react';
import type { AppTab, CambridgeWritingWork, LearningPosition, RecordedMistake, TestAttempt, UserProfile, VocabDeck } from '../types';
import { getLearnerVocabDecks, getTodayDateString, loadAttemptsFromStorage, loadCambridgeWritingWork, loadDecksFromStorage, loadLearningPosition, loadMistakes, saveLearningPosition } from '../utils/db';
import { isMistakeDue } from '../utils/mistakeReview';
import { loadCambridgeManifest } from '../utils/bookPractice';
import type { PrivateBookManifest } from '../types/bookPractice';
import { isCambridgeTaskAvailable } from '../utils/studyPlanner';

interface TodayDashboardProps { onNavigateTab: (tab: AppTab) => void; user?: UserProfile }

const modules: LearningPosition['module'][] = ['reading', 'listening', 'writing'];
function location(position: LearningPosition | null) {
  if (!position) return 'Test 5 · Reading · Phần 1';
  const module = position.module === 'reading' ? 'Reading' : position.module === 'listening' ? 'Listening' : 'Writing';
  const unit = position.module === 'reading' ? 'Phần' : position.module === 'listening' ? 'Part' : 'Task';
  return `Test ${position.testNumber} · ${module} · ${unit} ${position.sectionNumber}`;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({ onNavigateTab, user }) => {
  const [position, setPosition] = useState<LearningPosition | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [decks, setDecks] = useState<VocabDeck[]>([]);
  const [mistakes, setMistakes] = useState<RecordedMistake[]>([]);
  const [writingWork, setWritingWork] = useState<Record<string, CambridgeWritingWork>>({});
  const [manifest, setManifest] = useState<PrivateBookManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    Promise.all([loadLearningPosition(), loadAttemptsFromStorage(), loadDecksFromStorage([]), loadMistakes(), loadCambridgeWritingWork(), loadCambridgeManifest().catch(() => null)])
      .then(([savedPosition, savedAttempts, savedDecks, savedMistakes, savedWriting, book]) => {
        setPosition(savedPosition); setAttempts(savedAttempts); setDecks(savedDecks); setMistakes(savedMistakes);
        setWritingWork(savedWriting); setManifest(book);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const dueWords = getLearnerVocabDecks(decks).flatMap(deck => deck.cards).filter(card => !card.dueDate || new Date(card.dueDate) <= new Date()).length;
  const reviewMistakes = mistakes.filter(item => isMistakeDue(item.status, item.nextRetryDate, getTodayDateString())).length;
  const latestAttempt = attempts.filter(item => item.sourcePackId === 'cambridge12-gt').sort((a, b) => b.date.localeCompare(a.date))[0];
  const courseTasks = manifest?.tests.flatMap(testNumber => modules.flatMap(module => {
    const imported = manifest.importedSections.filter(item => item.testNumber === testNumber && item.skill === module);
    const count = module === 'writing' ? 2 : Math.max(0, ...imported.map(item => item.sectionNumber));
    return Array.from({ length: count }, (_, index) => ({ testNumber, module, sectionNumber: index + 1 }));
  })) ?? [];
  const isComplete = (item: { testNumber: number; module: LearningPosition['module']; sectionNumber: number }) => {
    if (item.module === 'writing') return Boolean(writingWork[`test-${item.testNumber}-task-${item.sectionNumber}`]?.reviewedAt);
    const latest = attempts.filter(attempt => attempt.sourcePackId === 'cambridge12-gt' && attempt.testNumber === item.testNumber && attempt.module === item.module && attempt.sectionNumber === item.sectionNumber).sort((a, b) => b.date.localeCompare(a.date))[0];
    return Boolean(latest && (!latest.incorrectQuestionNumbers.length || latest.reviewedAt));
  };
  const availableTasks = courseTasks.filter(item => isCambridgeTaskAvailable(item.module, manifest?.audioStatus ?? 'unavailable'));
  const savedTask = position && availableTasks.find(item => item.testNumber === position.testNumber && item.module === position.module && item.sectionNumber === position.sectionNumber);
  const nextTask = savedTask && !isComplete(savedTask) ? savedTask : availableTasks.find(item => !isComplete(item));
  const activePosition: LearningPosition | null = nextTask ? { ...nextTask, sourcePackId: 'cambridge12-gt', updatedAt: position?.updatedAt ?? new Date().toISOString() } : null;
  const courseComplete = availableTasks.length > 0 && availableTasks.every(isComplete);
  const continueLearning = async () => {
    if (!manifest) return;
    if (courseComplete) { onNavigateTab('cambridge'); return; }
    const target = activePosition ?? { sourcePackId: 'cambridge12-gt', testNumber: 5, module: 'reading' as const, sectionNumber: 1, updatedAt: new Date().toISOString() };
    if (!position || target.testNumber !== position.testNumber || target.module !== position.module || target.sectionNumber !== position.sectionNumber) {
      await saveLearningPosition({ ...target, updatedAt: new Date().toISOString() });
      setPosition({ ...target, updatedAt: new Date().toISOString() });
    }
    onNavigateTab('cambridge');
  };

  return <div className="mx-auto max-w-3xl space-y-5 pb-16">
    <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
      <div>
      <p className="text-sm text-slate-500">{new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</p>
      <h1 className="mt-1 font-serif text-3xl text-slate-950">Hôm nay{user?.displayName ? `, ${user.displayName}` : ''}</h1>
      </div>
      <button type="button" onClick={() => onNavigateTab('plan')} className="rounded border border-slate-300 px-3 py-2 text-sm font-medium">Kế hoạch tuần</button>
    </header>

    <section className="rounded border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Tiếp tục học</p>
      <h2 className="mt-2 font-serif text-2xl">Cambridge IELTS 12 GT</h2>
      <p className="mt-1 text-slate-600">{loading ? 'Đang tải vị trí học…' : loadError ? 'Không tải được vị trí học.' : !manifest ? 'Chưa cài gói Cambridge riêng trên máy chủ.' : courseComplete ? 'Đã hoàn thành các bước học khả dụng trong Tests 5–8.' : location(activePosition)}</p>
      <button type="button" disabled={loading || loadError || !manifest} onClick={() => void continueLearning()} className="mt-5 rounded bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-50">{loading ? 'Đang tải…' : !manifest ? 'Cambridge chưa sẵn sàng' : courseComplete ? 'Xem tiến độ Cambridge' : activePosition && position ? 'Tiếp tục' : latestAttempt ? 'Tiếp tục lộ trình' : 'Bắt đầu Test 5'}</button>
    </section>

    <div className="grid gap-4 sm:grid-cols-2">
      <section className="rounded border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Từ vựng</h2>
        {loading ? <p className="mt-2 text-slate-500">Đang tải dữ liệu…</p> : loadError ? <p role="alert" className="mt-2 text-rose-700">Không tải được dữ liệu từ vựng.</p> : dueWords ? <p className="mt-2 text-slate-600">{dueWords} từ đã lưu đến hạn ôn.</p> : <p className="mt-2 text-slate-600">Không có từ nào đến hạn ôn.</p>}
        <button type="button" onClick={() => onNavigateTab('vocab')} className="mt-4 text-sm font-medium underline underline-offset-4">{dueWords ? 'Ôn từ vựng' : 'Mở sổ từ vựng'}</button>
      </section>
      <section className="rounded border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Ôn lỗi sai</h2>
        {loading ? <p className="mt-2 text-slate-500">Đang tải dữ liệu…</p> : loadError ? <p role="alert" className="mt-2 text-rose-700">Không tải được nhật ký lỗi sai.</p> : reviewMistakes ? <p className="mt-2 text-slate-600">{reviewMistakes} câu đã đến hạn làm lại.</p> : <p className="mt-2 text-slate-600">Không có câu sai nào đến hạn ôn lại.</p>}
        <button type="button" onClick={() => onNavigateTab('mistakes')} className="mt-4 text-sm font-medium underline underline-offset-4">Mở sổ lỗi sai</button>
      </section>
    </div>

    {loading ? <p className="text-sm text-slate-500">Đang tải tiến độ…</p> : loadError ? <p role="alert" className="text-sm text-rose-700">Không tải được tiến độ học.</p> : latestAttempt ? <p className="text-sm text-slate-500">Kết quả Cambridge gần nhất: {latestAttempt.score}/{latestAttempt.total} · {new Date(latestAttempt.date).toLocaleDateString('vi-VN')}</p> : <p className="text-sm text-slate-500">Chưa đủ dữ liệu học để đề xuất kỹ năng cần tập trung.</p>}
  </div>;
};
