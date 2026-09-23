import React, { useState, useEffect } from 'react';
import { AppTab, TestAttempt, VocabDeck, GrammarProgressStatus, WeakAreaStat, DailyProtocolRecord, UserProfile } from '../types';
import {
  loadAttemptsFromStorage,
  loadDecksFromStorage,
  loadGrammarProgress,
  getWeakAreaStats,
  loadTodayProtocol,
  saveTodayProtocol
} from '../utils/db';
import { INITIAL_VOCAB_DECKS } from '../data/vocabData';

interface TodayDashboardProps {
  onNavigateTab: (tab: AppTab) => void;
  user?: UserProfile;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({ onNavigateTab, user }) => {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [decks, setDecks] = useState<VocabDeck[]>([]);
  const [grammarProgress, setGrammarProgress] = useState<Record<string, GrammarProgressStatus>>({});
  const [weakAreas, setWeakAreas] = useState<WeakAreaStat[]>([]);
  const [protocol, setProtocol] = useState<DailyProtocolRecord | null>(null);

  useEffect(() => {
    loadAttemptsFromStorage().then(setAttempts);
    loadDecksFromStorage(INITIAL_VOCAB_DECKS).then(setDecks);
    loadGrammarProgress().then(setGrammarProgress);
    getWeakAreaStats().then(setWeakAreas);
    loadTodayProtocol().then(setProtocol);
  }, []);

  // Calculate cards due today across all decks
  const now = new Date();
  const allCards = decks.flatMap(d => d.cards);
  const dueCardsCount = allCards.filter(c => !c.dueDate || new Date(c.dueDate) <= now).length;

  // Toggle daily task completed
  const handleToggleTask = (taskId: string) => {
    if (!protocol) return;
    const updatedTasks = protocol.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    const completedTasksCount = updatedTasks.filter(t => t.completed).length;
    const newStreak = completedTasksCount > 0 ? Math.max(protocol.streakDays, 1) : protocol.streakDays;

    const updatedProtocol: DailyProtocolRecord = {
      ...protocol,
      tasks: updatedTasks,
      streakDays: newStreak
    };

    setProtocol(updatedProtocol);
    saveTodayProtocol(updatedProtocol);
  };

  const totalPlannedMinutes = user ? user.dailyStudyMinutes : 180;
  const completedMinutes = protocol ? protocol.tasks.filter(t => t.completed).reduce((acc, t) => acc + t.durationMin, 0) : 0;
  const progressPercent = Math.min(100, Math.round((completedMinutes / totalPlannedMinutes) * 100));

  // Determine top weak area with meaningful sample size (>= 3 attempts) or default
  const validWeakAreas = weakAreas.filter(w => w.totalQuestions >= 3);
  const topWeak = validWeakAreas.length > 0
    ? validWeakAreas.sort((a, b) => a.accuracyRate - b.accuracyRate)[0]
    : { questionType: 'Matching Headings', accuracyRate: 52, skill: 'reading' as const };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* 1. Above-the-fold Greeting & Day Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Chào {user ? user.displayName : 'bạn'}
            </h1>
            <p className="text-base text-slate-600 mt-0.5">
              Ngày <span className="font-mono font-bold text-slate-900">{protocol ? protocol.dayNumber : 1}</span> / 180 • Mục tiêu: Band <span className="font-mono font-bold text-slate-900">{user ? user.targetBand.toFixed(1) : '6.5'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium px-3 py-1.5 bg-slate-100 rounded text-slate-700">
              Chuỗi học: <span className="font-mono font-bold text-slate-900">{protocol ? protocol.streakDays : 1}</span> ngày
            </span>
            <span className="text-sm font-medium px-3 py-1.5 bg-slate-900 text-white rounded font-mono font-bold">
              {completedMinutes} / {totalPlannedMinutes} phút
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-slate-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. Today's Two Main Focus Cards (Next Practice & Vocab Due) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Practice Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Tiếp theo (Trọng tâm yếu)
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {topWeak.questionType}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Độ chính xác hiện tại: <span className="font-mono font-bold text-rose-700">{topWeak.accuracyRate}%</span>. Bạn cần rèn luyện phản xạ nhận diện từ khóa và cách làm.
            </p>
          </div>

          <div className="pt-4 mt-2">
            <button
              type="button"
              onClick={() => onNavigateTab(topWeak.skill === 'reading' ? 'reading' : 'listening')}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Luyện 10 câu ngay
            </button>
          </div>
        </div>

        {/* Vocab Due Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Từ vựng cần ôn
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              <span className="font-mono text-2xl font-bold text-amber-700">{dueCardsCount > 0 ? dueCardsCount : 10}</span> từ vựng
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Các từ học thuật Core đã đến hạn ôn tập lặp lại ngắt quãng để ghi nhớ vào trí nhớ dài hạn.
            </p>
          </div>

          <div className="pt-4 mt-2">
            <button
              type="button"
              onClick={() => onNavigateTab('vocab')}
              className="w-full sm:w-auto px-4 py-2 bg-amber-700 text-white text-sm font-semibold rounded hover:bg-amber-800 cursor-pointer transition-colors"
            >
              Ôn ngay bây giờ
            </button>
          </div>
        </div>
      </div>

      {/* 3. Today Checklist (~180 Mins) */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Kế Hoạch Hôm Nay
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Đánh dấu các mục sau khi hoàn thành. Bấm trực tiếp vào tên mục để vào bài học.
            </p>
          </div>
          <span className="text-sm font-medium text-slate-700 font-mono">
            ~{totalPlannedMinutes} phút
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {protocol && protocol.tasks.map(task => (
            <div
              key={task.id}
              className={`py-3.5 flex items-center justify-between gap-4 transition-colors ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border cursor-pointer transition-colors ${
                    task.completed
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-300 hover:border-slate-500 bg-white'
                  }`}
                  aria-label={task.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
                >
                  {task.completed ? '✓' : ''}
                </button>

                <div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab(task.tabTarget)}
                    className={`text-base font-semibold text-left cursor-pointer hover:underline ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </button>
                  <p className="text-sm text-slate-500">
                    {task.subtitle}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-mono text-slate-600">
                  {task.durationMin} phút
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Smart Today Plan Breakdown (Rule-based recommendation) */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Chi Tiết Phân Bổ 50 Phút Luyện Kỹ Năng
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Lộ trình thông minh tự động chia nhỏ thời gian để bạn không bị quá tải.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Reading 50 min breakdown */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-sm font-bold text-slate-900">READING — 50 phút</span>
              <button
                type="button"
                onClick={() => onNavigateTab('reading')}
                className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
              >
                Vào học →
              </button>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 w-12 shrink-0">15 min</span>
                <span>Học cách làm dạng bài <strong className="text-slate-900">{topWeak.questionType}</strong> (Xem bẫy & paraphrase)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 w-12 shrink-0">20 min</span>
                <span>Luyện 10 câu bài tập Foundation có bấm giờ nhẹ nhàng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 w-12 shrink-0">15 min</span>
                <span>Xem kỹ câu sai, đối chiếu bằng chứng trong bài và lưu vào sổ lỗi</span>
              </li>
            </ul>
          </div>

          {/* Listening 50 min breakdown */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-sm font-bold text-slate-900">LISTENING — 50 phút</span>
              <button
                type="button"
                onClick={() => onNavigateTab('listening')}
                className="text-xs font-semibold text-purple-700 hover:underline cursor-pointer"
              >
                Vào học →
              </button>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 w-12 shrink-0">10 min</span>
                <span>Luyện phản xạ nhận diện <strong className="text-slate-900">Bẫy đổi ý (Distractor drill)</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 w-12 shrink-0">25 min</span>
                <span>Luyện nghe Section/Part 2 hoặc Part 3 chuẩn format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 w-12 shrink-0">15 min</span>
                <span>Đọc lại Transcript, gạch chân từ nối và các cụm paraphrase</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
