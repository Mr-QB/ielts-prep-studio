import React, { useEffect, useState } from 'react';
import { AppTab, TestAttempt, VocabDeck, GrammarProgressStatus, WeakAreaStat, UserProfile, VocabReviewLog, StudyPlanSettings, RecordedMistake } from '../types';
import { buildWeeklySkillStats, getLearnerVocabDecks, getWeakAreaStats, getTodayDateString, loadAttemptsFromStorage, loadDecksFromStorage, loadGrammarProgress, loadStudyPlanSettings, loadVocabReviewLogs, loadMistakes } from '../utils/db';
import { getPlannedCambridgeTest, getPlannedStudyMinutes, getStudyWeekStart } from '../utils/studyPlanner';
import { loadCambridgeManifest } from '../utils/bookPractice';
import { countMistakesMasteredBetween } from '../utils/mistakeReview';

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
  const [mistakes, setMistakes] = useState<RecordedMistake[]>([]);
  const [planSettings, setPlanSettings] = useState<StudyPlanSettings | null>(null);
  const [audioStatus, setAudioStatus] = useState('unavailable');
  const [activePhase, setActivePhase] = useState<1 | 2 | 3 | 4 | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([
      loadAttemptsFromStorage(), loadDecksFromStorage([]), loadGrammarProgress(), getWeakAreaStats(),
      loadVocabReviewLogs(), loadStudyPlanSettings(), loadCambridgeManifest().catch(() => null), loadMistakes(),
    ])
      .then(([savedAttempts, savedDecks, savedGrammar, savedWeakAreas, savedReviewLogs, savedPlanSettings, manifest, savedMistakes]) => {
        if (!active) return;
        setAttempts(savedAttempts); setDecks(savedDecks); setGrammarProgress(savedGrammar); setWeakAreas(savedWeakAreas);
        setReviewLogs(savedReviewLogs); setPlanSettings(savedPlanSettings); setAudioStatus(manifest?.audioStatus ?? 'unavailable');
        setMistakes(savedMistakes);
      })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const reportDate = getTodayDateString();
  const reportStartDate = getStudyWeekStart(reportDate);
  const weekStart = new Date(`${reportStartDate}T00:00:00`).getTime();
  const ieltsAttempts = attempts.filter(item => item.sourcePackId === 'cambridge12-gt');
  const weekAttempts = ieltsAttempts.filter(item => new Date(item.date).getTime() >= weekStart);
  const weeklySkillStats = buildWeeklySkillStats(ieltsAttempts, reportStartDate, reportDate);
  const measuredWeeklySkills = weeklySkillStats.filter(item => item.totalQuestions >= 10);
  const availableWeeklySkills = measuredWeeklySkills.filter(item => item.skill === 'reading' || audioStatus === 'available');
  const unavailableWeakestSkill = measuredWeeklySkills.find(item => item.skill === 'listening' && audioStatus !== 'available');
  const weakestWeeklySkill = availableWeeklySkills[0];
  const attemptMinutes = weekAttempts.reduce((sum, item) => sum + item.durationSeconds / 60, 0);
  const weekReviews = reviewLogs.filter(item => new Date(item.createdAt).getTime() >= weekStart).length;
  const weeklyReviewLogs = reviewLogs.filter(item => new Date(item.createdAt).getTime() >= weekStart);
  const vocabularyMinutes = weeklyReviewLogs.reduce((sum, item) => sum + item.responseTimeMs / 60_000, 0);
  const reviewedWordCount = new Set(weeklyReviewLogs.map(item => item.cardId)).size;
  const mistakesCleared = countMistakesMasteredBetween(mistakes, reportStartDate, reportDate);
  const minutes = Math.round(attemptMinutes + vocabularyMinutes);
  const weeklyAccuracy = (skill: 'reading' | 'listening') => {
    const stat = weeklySkillStats.find(item => item.skill === skill);
    return stat?.totalQuestions
      ? { value: `${stat.accuracyRate}%`, detail: `${stat.correctQuestions}/${stat.totalQuestions} câu đúng trong 7 ngày` }
      : { value: 'Chưa có dữ liệu', detail: 'Hoàn thành bài Cambridge để ghi nhận độ chính xác' };
  };
  const readingAccuracy = weeklyAccuracy('reading');
  const listeningAccuracy = weeklyAccuracy('listening');
  const plannedMinutes = planSettings?.weeklyAvailability.length && user
    ? getPlannedStudyMinutes(planSettings, user.dailyStudyMinutes, reportStartDate)
    : null;
  const completedGrammar = Object.values(grammarProgress).filter(value => value === 'mastered').length;
  const cards = getLearnerVocabDecks(decks).flatMap(deck => deck.cards);
  const masteredVocab = cards.filter(card => card.state === 'mastered').length;
  const masteredVocabThisWeek = cards.filter(card => card.state === 'mastered' && card.lastReviewed &&
    new Date(card.lastReviewed).getTime() >= weekStart).length;
  const measuredAreas = weakAreas.filter(area => area.totalQuestions >= 10);
  const phaseContent = {
    1: ['Nền tảng', 'Củng cố từ vựng, ngữ pháp cốt lõi và dạng câu hỏi cơ bản bằng bài luyện có hướng dẫn.', 'Ưu tiên độ chính xác và Test 5 trước khi tăng tốc.'],
    2: ['Phát triển kỹ năng', 'Luyện paraphrase, bài đọc dài hơn và cách xử lý từng dạng câu hỏi.', 'Dùng Test 6 làm mốc luyện kỹ năng.'],
    3: ['Luyện có giờ', 'Kết hợp các dạng bài và rà soát lỗi lặp lại trong điều kiện có thời gian.', 'Dùng Test 7 làm mốc luyện có giờ.'],
    4: ['Chuẩn bị kỳ thi', 'Ôn lỗi trọng điểm và kết hợp các kỹ năng theo mục tiêu ngày thi.', 'Dùng Test 8 làm mốc tổng kết; audio nghe chỉ xếp khi có bản gốc.'],
  } as const;
  const plannedTest = planSettings ? getPlannedCambridgeTest(planSettings, reportDate) : 5;
  const currentPhase = (plannedTest - 4) as 1 | 2 | 3 | 4;
  const displayedPhase = activePhase ?? currentPhase;
  const phase = phaseContent[displayedPhase];

  if (loading) return <div className="mx-auto max-w-5xl py-12 text-sm text-muted" role="status">Đang tải tiến độ học…</div>;
  if (loadError) return <div className="mx-auto max-w-5xl py-12 text-sm text-rose-700" role="alert">Không tải được tiến độ. Thử tải lại trang sau.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      <header className="max-w-2xl">
        <p className="eyebrow">Sổ tay học tập</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-ink">Tiến độ</h1>
        <p className="mt-3 text-muted leading-7">Các con số dưới đây đến từ bài làm, lượt ôn và nội dung bạn đã đánh dấu hoàn thành. Mục tiêu hiện tại: band {user?.targetBand.toFixed(1) ?? '6.5'}.</p>
      </header>

      <section aria-labelledby="week-heading">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-3"><div><p className="eyebrow">7 ngày gần nhất</p><h2 id="week-heading" className="mt-1 font-display text-2xl text-ink">Thời gian và nhịp học</h2></div></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7 mt-5">
          <Stat label="Khung giờ học / thời gian ghi nhận" value={plannedMinutes === null ? `— / ${minutes}` : `${plannedMinutes} / ${minutes}`} detail={planSettings?.weeklyAvailability.length ? 'phút có thể dành cho học theo lịch (đã trừ thời gian nghỉ) / phút làm bài Cambridge và ôn từ đã ghi' : 'chưa cài khung giờ học hàng tuần'} />
          <Stat label="Reading · độ chính xác" value={readingAccuracy.value} detail={readingAccuracy.detail} />
          <Stat label="Listening · độ chính xác" value={listeningAccuracy.value} detail={listeningAccuracy.detail} />
          <Stat label="Từ đã ôn" value={`${reviewedWordCount}`} detail={`${weekReviews} lượt ôn được ghi nhận trong tuần`} />
          <Stat label="Từ đang nắm vững" value={`${masteredVocabThisWeek}`} detail="được ôn trong tuần và hiện có trạng thái nắm vững" />
          <Stat label="Câu sai đã nắm vững" value={`${mistakesCleared}`} detail="đạt trạng thái nắm vững trong 7 ngày gần nhất" />
        </div>
      </section>

      <section aria-labelledby="weekly-adjustment-heading" className="border-l-2 border-accent pl-5">
        <p className="eyebrow">Điều chỉnh kế hoạch</p>
        <h2 id="weekly-adjustment-heading" className="mt-1 font-display text-2xl text-ink">Tuần tới</h2>
        {weakestWeeklySkill ? <div className="mt-3 space-y-1 text-sm text-muted">
          <p>Điểm cần tập trung: <strong className="text-ink">{weakestWeeklySkill.skill === 'reading' ? 'Reading' : 'Listening'} · {weakestWeeklySkill.accuracyRate}%</strong> ({weakestWeeklySkill.correctQuestions}/{weakestWeeklySkill.totalQuestions} câu đúng trong 7 ngày gần nhất).</p>
          <p>Kế hoạch sẽ ưu tiên kỹ năng này sau phần Cambridge bạn đang làm, đồng thời giữ thứ tự các section trong từng kỹ năng.</p>
        </div> : unavailableWeakestSkill ? <p className="mt-3 text-sm text-muted">Listening đang thấp nhất ({unavailableWeakestSkill.accuracyRate}% từ {unavailableWeakestSkill.totalQuestions} câu), nhưng chưa có audio Cambridge gốc nên lịch không xếp bài nghe. Các bước Cambridge khả dụng giữ nguyên thứ tự cho đến khi có audio.</p> : <p className="mt-3 text-sm text-muted">Chưa đủ dữ liệu Cambridge trong 7 ngày gần nhất (cần ít nhất 10 câu cho một kỹ năng). Kế hoạch giữ thứ tự học hiện tại cho đến khi có thêm kết quả.</p>}
      </section>

      <section aria-labelledby="skills-heading">
        <div className="border-b border-line pb-3"><p className="eyebrow">Từ bài làm đã lưu</p><h2 id="skills-heading" className="mt-1 font-display text-2xl text-ink">Độ chính xác</h2></div>
        <div className="grid md:grid-cols-2 md:gap-10 mt-2">
          <Accuracy label="Reading" attempts={ieltsAttempts.filter(item => item.skill === 'reading')} onNavigate={() => onNavigateTab('reading')} />
          <Accuracy label="Listening" attempts={ieltsAttempts.filter(item => item.skill === 'listening')} onNavigate={() => onNavigateTab('listening')} />
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
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-line mt-4">{([1, 2, 3, 4] as const).map(number => <button key={number} type="button" aria-pressed={displayedPhase === number} onClick={() => setActivePhase(number)} className={`pb-3 text-sm ${displayedPhase === number ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-ink'}`}>Giai đoạn {number}</button>)}</div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-4 py-5"><div><p className="eyebrow">Giai đoạn {displayedPhase} · {phase[0]} · Test {displayedPhase + 4}</p><h3 className="mt-2 font-display text-xl text-ink">{phase[1]}</h3><p className="mt-2 text-sm text-muted">{phase[2]}</p></div><p className="text-sm text-muted self-end">Mặc định theo ngày bắt đầu và ngày thi đã lưu; chưa cài lịch thì bắt đầu ở giai đoạn 1. Đây là khung học, không phải dự báo điểm.</p></div>
      </section>
    </div>
  );
};
