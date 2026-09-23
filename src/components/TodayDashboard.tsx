import React, { useState, useEffect } from 'react';
import { AppTab, TestAttempt, VocabDeck, GrammarProgressStatus, WeakAreaStat, DailyProtocolRecord } from '../types';
import {
  loadAttemptsFromStorage,
  loadDecksFromStorage,
  loadGrammarProgress,
  getWeakAreaStats,
  loadTodayProtocol,
  saveTodayProtocol
} from '../utils/db';
import { INITIAL_VOCAB_DECKS } from '../data/vocabData';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import {
  ArrowRight, CheckCircle2, RotateCcw, BookOpen, Headphones,
  PenTool, Sparkles, Layers, Clock, AlertTriangle, Flame, Compass, Target
} from 'lucide-react';

interface TodayDashboardProps {
  onNavigateTab: (tab: AppTab) => void;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({ onNavigateTab }) => {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [decks, setDecks] = useState<VocabDeck[]>([]);
  const [grammarProgress, setGrammarProgress] = useState<Record<string, GrammarProgressStatus>>({});
  const [weakAreas, setWeakAreas] = useState<WeakAreaStat[]>([]);
  const [protocol, setProtocol] = useState<DailyProtocolRecord | null>(null);
  const [activeRoadmapPhase, setActiveRoadmapPhase] = useState<1 | 2 | 3>(1);

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

  // Weekly stats
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekAttempts = attempts.filter(a => new Date(a.date) >= oneWeekAgo);
  const weekListeningCount = weekAttempts.filter(a => a.skill === 'listening').length;
  const weekReadingCount = weekAttempts.filter(a => a.skill === 'reading').length;
  const completedGrammarCount = Object.values(grammarProgress).filter(s => s === 'completed').length;

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

  const totalPlannedMinutes = protocol ? protocol.tasks.reduce((acc, t) => acc + t.durationMin, 0) : 180;
  const completedMinutes = protocol ? protocol.tasks.filter(t => t.completed).reduce((acc, t) => acc + t.durationMin, 0) : 0;
  const progressPercent = Math.round((completedMinutes / totalPlannedMinutes) * 100);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner: Day X / 180 & Goal */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                180-DAY IELTS ACADEMIC PROTOCOL
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold font-mono">
                Mục tiêu: Band 6.5 (6 tháng) → 7.0 (1 năm)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <span>Ngày {protocol ? protocol.dayNumber : 1} / 180</span>
              <span className="text-sm font-normal text-slate-500 font-mono">
                • Hôm nay bạn học gì?
              </span>
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Lộ trình ~3 giờ/ngày (180 phút) tập trung vào: Reading • Listening • Grammar • Vocabulary (SRS) • Mistake Review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-md font-mono text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Chuỗi học: {protocol ? protocol.streakDays : 1} ngày</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-900 text-white rounded-md font-mono text-xs font-bold">
              {completedMinutes} / {totalPlannedMinutes} phút
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>Tiến độ ngày hôm nay ({progressPercent}%)</span>
            <span>{protocol?.tasks.filter(t => t.completed).length} / {protocol?.tasks.length} mục hoàn thành</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-slate-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. TODAY STUDY PROTOCOL CHECKLIST (~180 MINS) */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase font-mono tracking-wide">
              LỊCH TRÌNH TỰ HỌC HÔM NAY (TODAY PROTOCOL)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đánh dấu các mục sau khi hoàn tất. Có thể bấm trực tiếp vào từng mục để chuyển sang bài học.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
            Tổng ~180 phút
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {protocol && protocol.tasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                task.completed
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="mt-1 w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {task.durationMin} phút
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{task.subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab(task.tabTarget)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                title={`Mở tab ${task.tabTarget}`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WEAK AREAS ANALYTICS & SMART RECOMMENDATIONS */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase font-mono tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>PHÂN TÍCH ĐIỂM YẾU (WEAK AREAS ANALYTICS)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống tự động theo dõi tỷ lệ chính xác theo từng dạng câu hỏi và đề xuất luyện tập đúng trọng tâm.
            </p>
          </div>
        </div>

        {weakAreas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakAreas.slice(0, 4).map((wa, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 capitalize font-mono">
                    {wa.skill === 'reading' ? 'Reading' : 'Listening'}: {wa.questionType.replace(/-/g, ' ')}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                    wa.accuracyRate < 60 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Độ chính xác: {wa.accuracyRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${wa.accuracyRate < 60 ? 'bg-rose-600' : 'bg-amber-500'}`}
                    style={{ width: `${wa.accuracyRate}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-600">
                  <strong>Khuyến nghị:</strong> {wa.recommendation}
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigateTab(wa.skill)}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Luyện dạng bài này ngay</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Chưa có đủ dữ liệu lỗi sai để phân tích.</p>
            <p>Sau khi bạn làm khoảng 10–20 câu hỏi Reading hoặc Listening, biểu đồ dạng bài yếu và gợi ý luyện tập sẽ tự động kích hoạt tại đây.</p>
          </div>
        )}
      </div>

      {/* 4. 6-MONTH ROADMAP (PHASE 1 - 3) */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase font-mono tracking-wide flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>LỘ TRÌNH 6 THÁNG: BAND 4.0 → 6.5 → 7.0</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              3 giai đoạn học tập tuần tự giúp bạn phân bổ thời gian hiệu quả, không bị quá tải.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            {[
              { id: 1, label: 'Giai đoạn 1 (Tuần 1–8)' },
              { id: 2, label: 'Giai đoạn 2 (Tuần 9–16)' },
              { id: 3, label: 'Giai đoạn 3 (Tuần 17–24)' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveRoadmapPhase(p.id as any)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeRoadmapPhase === p.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Phase Details Card */}
        {activeRoadmapPhase === 1 && (
          <div className="p-5 bg-blue-50/40 border border-blue-100 rounded-lg space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 text-sm">PHASE 1: NỀN TẢNG (WEEKS 1–8) • BAND 4.0 → 5.5</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono font-semibold">Tập trung nền</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Mục tiêu giai đoạn này là củng cố ngữ pháp câu và vốn từ học thuật cốt lõi (AWL Sublist 1–2), làm quen với từng dạng câu hỏi Reading/Listening đơn lẻ trước khi ghép thành bài thi dài.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white rounded border border-blue-100 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">Trọng tâm học:</strong>
                <ul className="space-y-1 text-slate-700 list-disc pl-4">
                  <li>20 chủ điểm Ngữ pháp Essential (G01–G20).</li>
                  <li>Luyện nghe Listening Part 1 & Part 2 (chú ý số, tên, ngày tháng).</li>
                  <li>Luyện Reading Passage 1 (T/F/NG, Summary Completion).</li>
                  <li>Ôn 20–30 thẻ từ vựng mỗi ngày trên SRS.</li>
                </ul>
              </div>
              <div className="p-3 bg-white rounded border border-blue-100 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">Lưu ý quan trọng:</strong>
                <p className="text-slate-600">
                  Chưa cần canh thời gian 60 phút quá nghiêm ngặt. Ưu tiên độ chính xác và hiểu rõ lý do vì sao mình làm sai.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeRoadmapPhase === 2 && (
          <div className="p-5 bg-emerald-50/40 border border-emerald-100 rounded-lg space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 text-sm">PHASE 2: KỸ NĂNG & PARAPHRASE (WEEKS 9–16) • BAND 5.5 → 6.5</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-semibold">Tăng tốc kỹ năng</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Chuyển sang đọc hiểu các bài đọc dài học thuật (Passage 2 & 3) và nghe các bài thảo luận học thuật (Part 3 & 4). Chú trọng phân tích từ đồng nghĩa (Paraphrase) và nhận diện các bẫy đổi ý kiến (Distractors).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white rounded border border-emerald-100 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">Trọng tâm học:</strong>
                <ul className="space-y-1 text-slate-700 list-disc pl-4">
                  <li>Luyện dạng bài khó: Matching Headings, Yes/No/Not Given.</li>
                  <li>Luyện nghe Part 3 (tranh luận nhóm) và Part 4 (bài giảng độc thoại).</li>
                  <li>Nắm vững cấu trúc bài Writing Task 1 & Task 2 (tham khảo tab Writing Notes).</li>
                  <li>Thực hành phản xạ Speaking Part 1 & Part 2 cùng ChatGPT.</li>
                </ul>
              </div>
              <div className="p-3 bg-white rounded border border-emerald-100 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">Quản lý thời gian:</strong>
                <p className="text-slate-600">
                  Tập đọc mỗi Passage trong vòng 18–20 phút. Ghi chép toàn bộ từ vựng lạ vào bộ thẻ SRS.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeRoadmapPhase === 3 && (
          <div className="p-5 bg-purple-50/40 border border-purple-100 rounded-lg space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900 text-sm">PHASE 3: THI THỬ & CHINH PHỤC (WEEKS 17–24) • BAND 6.5 → 7.0+</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-mono font-semibold">Thi thử thực tế</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Luyện Full Test cả Reading (60 phút / 40 câu) và Listening (40 câu liên tục) trong điều kiện phòng thi thật. Khắc phục triệt để các dạng bài trong danh sách Weak Areas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white rounded border border-purple-100 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">Trọng tâm học:</strong>
                <ul className="space-y-1 text-slate-700 list-disc pl-4">
                  <li>Làm 2 Full Test mỗi tuần, bấm giờ nghiêm ngặt.</li>
                  <li>Học các cấu trúc ngữ pháp nâng cao (G21–G26 Advanced).</li>
                  <li>Luyện đề Speaking Part 3 với các câu hỏi triết lý, xã hội.</li>
                  <li>Tập trung vào tính nhất quán và duy trì tâm lý thi đấu.</li>
                </ul>
              </div>
              <div className="p-3 bg-white rounded border border-purple-100 space-y-1">
                <strong className="text-slate-900 block font-mono text-[11px] uppercase">Mục tiêu điểm số:</strong>
                <p className="text-slate-600">
                  Đạt ổn định 27–30/40 câu đúng (Band 6.5 – 7.0) trong cả Reading và Listening.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Weekly Metrics Quick Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block text-[11px]">Tuần này: Listening</span>
          <strong className="text-xl font-bold text-slate-900 font-mono">{weekListeningCount}</strong>
          <span className="text-slate-400 text-[10px] ml-1">bài đã làm</span>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block text-[11px]">Tuần này: Reading</span>
          <strong className="text-xl font-bold text-slate-900 font-mono">{weekReadingCount}</strong>
          <span className="text-slate-400 text-[10px] ml-1">passages</span>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block text-[11px]">Ngữ pháp hoàn thành</span>
          <strong className="text-xl font-bold text-slate-900 font-mono">{completedGrammarCount} / 26</strong>
          <span className="text-slate-400 text-[10px] ml-1">chủ điểm</span>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block text-[11px]">Thẻ từ vựng cần ôn hôm nay</span>
          <strong className="text-xl font-bold text-slate-900 font-mono text-amber-600">{dueCardsCount}</strong>
          <span className="text-slate-400 text-[10px] ml-1">thẻ SRS</span>
        </div>
      </div>
    </div>
  );
};
