import React, { useState, useEffect } from 'react';
import { AppTab, TestAttempt, VocabDeck, GrammarProgressStatus } from '../types';
import { loadAttemptsFromStorage, loadDecksFromStorage, loadGrammarProgress } from '../utils/db';
import { INITIAL_VOCAB_DECKS } from '../data/vocabData';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import { LISTENING_SECTIONS } from '../data/listeningData';
import { READING_PASSAGES } from '../data/readingData';
import { ArrowRight, CheckCircle2, RotateCcw, BookOpen, Headphones, PenTool, Sparkles, Layers } from 'lucide-react';

interface TodayDashboardProps {
  onNavigateTab: (tab: AppTab) => void;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({ onNavigateTab }) => {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [decks, setDecks] = useState<VocabDeck[]>([]);
  const [grammarProgress, setGrammarProgress] = useState<Record<string, GrammarProgressStatus>>({});

  useEffect(() => {
    loadAttemptsFromStorage().then(setAttempts);
    loadDecksFromStorage(INITIAL_VOCAB_DECKS).then(setDecks);
    loadGrammarProgress().then(setGrammarProgress);
  }, []);

  // Calculate cards due today across all decks
  const now = new Date();
  const allCards = decks.flatMap(d => d.cards);
  const dueCardsCount = allCards.filter(c => !c.dueDate || new Date(c.dueDate) <= now).length;

  // Last activities
  const lastListening = attempts.find(a => a.skill === 'listening');
  const lastReading = attempts.find(a => a.skill === 'reading');

  // Grammar next topic
  const nextGrammarTopic = GRAMMAR_TOPICS.find(t => grammarProgress[t.id] !== 'completed') || GRAMMAR_TOPICS[0];
  const completedGrammarCount = Object.values(grammarProgress).filter(s => s === 'completed').length;

  // Weekly stats
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekAttempts = attempts.filter(a => new Date(a.date) >= oneWeekAgo);
  const weekListeningCount = weekAttempts.filter(a => a.skill === 'listening').length;
  const weekReadingCount = weekAttempts.filter(a => a.skill === 'reading').length;
  const weekVocabReviews = allCards.filter(c => c.lastReviewed && new Date(c.lastReviewed) >= oneWeekAgo).length;

  // Recent mistakes from latest attempts
  const recentMistakes = attempts.flatMap(a =>
    (a.mistakeTags || []).map(m => ({
      ...m,
      sectionTitle: a.sectionTitle,
      skill: a.skill,
      date: a.date
    }))
  ).slice(0, 8);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Welcome & Daily Mission Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              DAILY ACADEMIC STUDY PROTOCOL
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Kế Hoạch Tự Học IELTS Hôm Nay
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Tập trung 4 module: Nghe (Listening) • Đọc (Reading) • Ngữ pháp (Grammar) • Lặp ngắt quãng (SRS).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs font-semibold">
              Mục tiêu: Band 6.5 → 7.0
            </span>
          </div>
        </div>

        {/* Weekly Progress Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Tuần này: Listening</span>
            <strong className="text-lg font-bold text-slate-900 font-mono">{weekListeningCount}</strong>
            <span className="text-slate-400 text-[10px] ml-1">bài đã làm</span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Tuần này: Reading</span>
            <strong className="text-lg font-bold text-slate-900 font-mono">{weekReadingCount}</strong>
            <span className="text-slate-400 text-[10px] ml-1">passages</span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Ngữ pháp hoàn thành</span>
            <strong className="text-lg font-bold text-slate-900 font-mono">{completedGrammarCount} / 26</strong>
            <span className="text-slate-400 text-[10px] ml-1">chủ điểm</span>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Từ vựng đã ôn (7 ngày)</span>
            <strong className="text-lg font-bold text-slate-900 font-mono">{weekVocabReviews}</strong>
            <span className="text-slate-400 text-[10px] ml-1">lượt lặp</span>
          </div>
        </div>
      </div>

      {/* 4 Core Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Listening */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider">MODULE 1 • LISTENING</span>
              <span>4 Parts Format</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {lastListening ? lastListening.sectionTitle : LISTENING_SECTIONS[0].title}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lastListening
                ? `Lần làm gần nhất: ${new Date(lastListening.date).toLocaleDateString('vi-VN')} • Điểm: ${lastListening.score}/${lastListening.total}`
                : 'Bắt đầu luyện tập bài nghe mẫu chính thức IELTS Part 1.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('listening')}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>{lastListening ? 'Tiếp Tục Luyện Nghe' : 'Bắt Đầu Luyện Nghe'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 2: Reading */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider">MODULE 2 • READING</span>
              <span>Academic Passages</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {lastReading ? lastReading.sectionTitle : READING_PASSAGES[0].title}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lastReading
                ? `Lần làm gần nhất: ${new Date(lastReading.date).toLocaleDateString('vi-VN')} • Điểm: ${lastReading.score}/${lastReading.total}`
                : 'Đọc bài học thuật Marie Curie (IELTS Academic Sample Task 1).'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('reading')}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>{lastReading ? 'Tiếp Tục Luyện Đọc' : 'Bắt Đầu Luyện Đọc'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 3: Grammar */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider">MODULE 3 • GRAMMAR</span>
              <span className="uppercase">{nextGrammarTopic.category}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {nextGrammarTopic.code}: {nextGrammarTopic.title}
            </h2>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {nextGrammarTopic.whyItMatters}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('grammar')}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Học Bài Ngữ Pháp Này</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 4: Vocabulary SRS */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider">MODULE 4 • VOCABULARY SRS</span>
              <span>SuperMemo SM-2</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {dueCardsCount > 0 ? `${dueCardsCount} từ vựng cần ôn hôm nay` : 'Đã hoàn thành toàn bộ thẻ hôm nay'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Luyện tập Flashcard hoặc Gõ chính tả (Typing mode) bằng bàn phím.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('vocab')}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Ôn Luyện Từ Vựng [Space/1-4]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Mistakes Review Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
            NHỮNG CÂU LÀM SAI GẦN ĐÂY (RECENT MISTAKES LOG)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {recentMistakes.length} câu cần lưu ý
          </span>
        </div>

        {recentMistakes.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 italic">
            Chưa có ghi nhận câu sai nào. Hãy làm các bài test Listening và Reading để hệ thống tổng hợp câu sai tại đây.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {recentMistakes.map((m, idx) => (
              <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[10px] uppercase">
                      {m.skill} • Câu {m.questionNumber}
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-sm">{m.sectionTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-rose-600 line-through">Bạn điền: "{m.userAnswer}"</span>
                    <span className="text-emerald-700 font-semibold">Đáp án đúng: "{m.correctAnswer}"</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(m.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
