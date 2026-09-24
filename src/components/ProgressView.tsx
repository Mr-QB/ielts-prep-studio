import React, { useEffect, useState } from 'react';
import { AppTab, TestAttempt, VocabDeck, GrammarProgressStatus, WeakAreaStat, UserProfile, VocabReviewLog } from '../types';
import { getWeakAreaStats, loadAttemptsFromStorage, loadDecksFromStorage, loadGrammarProgress, loadVocabReviewLogs } from '../utils/db';
import { INITIAL_VOCAB_DECKS } from '../data/vocabData';

interface ProgressViewProps {
  onNavigateTab: (tab: AppTab) => void;
  user?: UserProfile;
}

const Stat = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div className="border-t border-line pt-4">
    <p className="text-sm text-muted">{label}</p>
    <p className="mt-2 font-display text-3xl text-ink">{value}</p>
    <p className="mt-1 text-sm text-muted">{detail}</p>
  </div>
);

const Accuracy = ({ label, attempts, onNavigate }: { label: string; attempts: TestAttempt[]; onNavigate: () => void }) => {
  const total = attempts.reduce((sum, item) => sum + item.total, 0);
  const correct = attempts.reduce((sum, item) => sum + item.score, 0);
  const accuracy = total ? Math.round(correct / total * 100) : null;
  return (
    <div className="py-4 border-b border-line last:border-0">
      <div className="flex justify-between items-baseline gap-4">
        <h3 className="font-medium text-ink">{label}</h3>
        <span className="font-mono text-sm text-ink">{accuracy === null ? 'Chưa có dữ liệu' : `${accuracy}%`}</span>
      </div>
      {accuracy !== null && <div className="mt-3 h-1.5 bg-paper-deep rounded-full"><div className="h-full bg-accent rounded-full" style={{ width: `${accuracy}%` }} /></div>}
      <div className="mt-2 flex justify-between text-xs text-muted"><span>{total ? `${correct}/${total} câu đúng · ${attempts.length} lượt` : 'Hoàn thành bài luyện để ghi nhận độ chính xác'}</span><button type="button" onClick={onNavigate} className="text-accent hover:underline">Luyện {label} →</button></div>
    </div>
  );
};

export const ProgressView: React.FC<ProgressViewProps> = ({ onNavigateTab, user }) => {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [decks, setDecks] = useState<VocabDeck[]>([]);
  const [grammarProgress, setGrammarProgress] = useState<Record<string, GrammarProgressStatus>>({});
  const [weakAreas, setWeakAreas] = useState<WeakAreaStat[]>([]);
  const [reviewLogs, setReviewLogs] = useState<VocabReviewLog[]>([]);
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    void Promise.all([
      loadAttemptsFromStorage().then(setAttempts),
      loadDecksFromStorage(INITIAL_VOCAB_DECKS).then(setDecks),
      loadGrammarProgress().then(setGrammarProgress),
      getWeakAreaStats().then(setWeakAreas),
      loadVocabReviewLogs().then(setReviewLogs),
    ]);
  }, []);

  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekAttempts = attempts.filter(item => new Date(item.date).getTime() >= weekStart);
  const minutes = weekAttempts.reduce((sum, item) => sum + Math.round(item.durationSeconds / 60), 0);
  const countQuestions = (skill: 'reading' | 'listening') => weekAttempts.filter(item => item.skill === skill).reduce((sum, item) => sum + item.total, 0);
  const weekReviews = reviewLogs.filter(item => item.createdAt >= weekStart).length;
  const completedGrammar = Object.values(grammarProgress).filter(value => value === 'mastered').length;
  const cards = decks.flatMap(deck => deck.cards);
  const masteredVocab = cards.filter(card => card.state === 'mastered').length;
  const measuredAreas = weakAreas.filter(area => area.totalQuestions >= 10);
  const phaseContent = {
    1: ['Nền tảng', 'Củng cố ngữ pháp cốt lõi, từ vựng thiết yếu và dạng câu hỏi cơ bản.', 'Tập trung vào độ chính xác trước khi tăng tốc.'],
    2: ['Kỹ năng', 'Luyện paraphrase, bài đọc dài hơn và các phần nghe có nhiều người nói.', 'Tăng dần thời lượng làm bài có giới hạn.'],
    3: ['Luyện thi', 'Kết hợp các dạng bài và rà soát lỗi lặp lại trong điều kiện có thời gian.', 'Dùng kết quả bài làm để chọn nội dung cần ôn.'],
  } as const;
  const phase = phaseContent[activePhase];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      <header className="max-w-2xl">
        <p className="eyebrow">Sổ tay học tập</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-ink">Tiến độ</h1>
        <p className="mt-3 text-muted leading-7">Các con số dưới đây đến từ bài làm, lượt ôn và nội dung bạn đã đánh dấu hoàn thành. Mục tiêu hiện tại: band {user?.targetBand.toFixed(1) ?? '6.5'}.</p>
      </header>

      <section aria-labelledby="week-heading">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-3"><div><p className="eyebrow">7 ngày gần nhất</p><h2 id="week-heading" className="mt-1 font-display text-2xl text-ink">Thời gian và nhịp học</h2></div></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7 mt-5">
          <Stat label="Thời gian đã ghi nhận" value={`${minutes}`} detail="phút từ các bài làm" />
          <Stat label="Reading" value={`${countQuestions('reading')}`} detail="câu trong bài đã lưu" />
          <Stat label="Listening" value={`${countQuestions('listening')}`} detail="câu trong bài đã lưu" />
          <Stat label="Lượt ôn từ vựng" value={`${weekReviews}`} detail="lượt đã ghi nhận" />
        </div>
      </section>

      <section aria-labelledby="skills-heading">
        <div className="border-b border-line pb-3"><p className="eyebrow">Từ bài làm đã lưu</p><h2 id="skills-heading" className="mt-1 font-display text-2xl text-ink">Độ chính xác</h2></div>
        <div className="grid md:grid-cols-2 md:gap-10 mt-2">
          <Accuracy label="Reading" attempts={attempts.filter(item => item.skill === 'reading')} onNavigate={() => onNavigateTab('reading')} />
          <Accuracy label="Listening" attempts={attempts.filter(item => item.skill === 'listening')} onNavigate={() => onNavigateTab('listening')} />
        </div>
      </section>

      <section aria-labelledby="foundation-heading">
        <div className="border-b border-line pb-3"><p className="eyebrow">Nội dung đã đánh dấu</p><h2 id="foundation-heading" className="mt-1 font-display text-2xl text-ink">Nền tảng</h2></div>
        <div className="grid sm:grid-cols-2 gap-8 mt-5">
          <div><div className="flex justify-between gap-3"><h3 className="font-medium text-ink">Ngữ pháp cốt lõi</h3><span className="font-mono text-sm">{completedGrammar} / 20</span></div><div className="mt-3 h-1.5 bg-paper-deep rounded-full"><div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, completedGrammar / 20 * 100)}%` }} /></div><p className="mt-2 text-sm text-muted">Chủ điểm đã đánh dấu nắm vững.</p></div>
          <div><div className="flex justify-between gap-3"><h3 className="font-medium text-ink">Từ vựng đã nắm vững</h3><span className="font-mono text-sm">{masteredVocab} / {cards.length}</span></div>{cards.length > 0 && <div className="mt-3 h-1.5 bg-paper-deep rounded-full"><div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, masteredVocab / cards.length * 100)}%` }} /></div>}<p className="mt-2 text-sm text-muted">Thẻ được đánh dấu nắm vững trong bộ từ của bạn.</p></div>
        </div>
      </section>

      <section aria-labelledby="competency-heading">
        <div className="border-b border-line pb-3"><p className="eyebrow">Ít nhất 10 câu đã ghi nhận mỗi dạng</p><h2 id="competency-heading" className="mt-1 font-display text-2xl text-ink">Theo dạng bài</h2></div>
        {measuredAreas.length ? <div className="divide-y divide-line">{measuredAreas.map(area => <div key={`${area.skill}-${area.questionType}`} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><span className="text-xs uppercase tracking-wider text-muted">{area.skill}</span><h3 className="mt-1 font-medium text-ink">{area.questionType}</h3><p className="mt-1 text-sm text-muted">{area.recommendation}</p></div><div className="flex items-center gap-4"><span className="font-mono text-lg">{area.accuracyRate}%</span><button type="button" onClick={() => onNavigateTab(area.skill)} className="text-sm text-accent hover:underline">Luyện →</button></div></div>)}</div> : <p className="py-5 text-sm text-muted">Chưa đủ dữ liệu để ước lượng độ chính xác theo dạng bài. Hãy lưu bài luyện để bắt đầu theo dõi.</p>}
      </section>

      <section aria-labelledby="phase-heading">
        <div className="border-b border-line pb-3"><p className="eyebrow">Khung tham khảo</p><h2 id="phase-heading" className="mt-1 font-display text-2xl text-ink">Lộ trình học</h2></div>
        <div className="flex gap-5 border-b border-line mt-4">{([1, 2, 3] as const).map(number => <button key={number} type="button" aria-pressed={activePhase === number} onClick={() => setActivePhase(number)} className={`pb-3 text-sm ${activePhase === number ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-ink'}`}>Giai đoạn {number}</button>)}</div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-4 py-5"><div><p className="eyebrow">Giai đoạn {activePhase} · {phase[0]}</p><h3 className="mt-2 font-display text-xl text-ink">{phase[1]}</h3><p className="mt-2 text-sm text-muted">{phase[2]}</p></div><p className="text-sm text-muted self-end">Khung học tập, không phải dự báo kết quả thi.</p></div>
      </section>
    </div>
  );
};
