import React, { useEffect, useMemo, useState } from 'react';
import type { VocabCard, VocabDeck } from '../../../../types';
import { playPronunciation } from '../../../../utils/srsEngine';
import { getNextLearningTask } from '../services/newVocabularyTaskScheduler';
import { evaluateTypedAnswer, type TypedAnswerResult } from '../services/typedAnswerEvaluator';
import { countLearnedWords, createWordStates, getNewVocabularyCards, recordLearningTaskResult, refillActivePool } from '../services/learningSessionService';
import type { LearningWordState, VocabularyLearningTask, VocabularySessionMode } from '../types';

const taskLabels = {
  FLASHCARD: 'Làm quen từ', MCQ_EN_VI: 'Nhận diện nghĩa', MCQ_VI_EN: 'Gợi nghĩa tiếng Việt',
  TYPE_VI_EN: 'Tự nhớ và gõ từ', DEFINITION: 'Hiểu định nghĩa', CONTEXT: 'Dùng từ trong ngữ cảnh',
} as const;

interface Session {
  cards: VocabCard[];
  states: Record<string, LearningWordState>;
  activeIds: string[];
  poolSize: number;
  mode: VocabularySessionMode;
  questionIndex: number;
  previousCardId?: string;
  finished: boolean;
}

interface Feedback {
  task: VocabularyLearningTask;
  correct: boolean;
  typed?: TypedAnswerResult;
}

interface Props {
  decks: VocabDeck[];
  initialDeckId: string;
  onExit: () => void;
}

export const NewVocabularyLearning: React.FC<Props> = ({ decks, initialDeckId, onExit }) => {
  const [sourceDeckId, setSourceDeckId] = useState(initialDeckId);
  const [wordLimit, setWordLimit] = useState<5 | 10 | 20>(5);
  const [mode, setMode] = useState<VocabularySessionMode>('DEEP');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [canContinue, setCanContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [counts, setCounts] = useState({ correct: 0, wrong: 0, spelling: 0, meaning: 0 });

  const sourceCards = sourceDeckId === 'all' ? decks.flatMap(deck => deck.cards) : decks.find(deck => deck.id === sourceDeckId)?.cards || [];
  const newCards = useMemo(() => getNewVocabularyCards(sourceCards), [sourceCards]);
  const currentTask = session && !session.finished ? getNextLearningTask({
    cards: session.cards,
    activeCardIds: session.activeIds,
    states: session.states,
    sessionMode: session.mode,
    questionIndex: session.questionIndex,
    previousCardId: session.previousCardId,
  }) : undefined;
  const learnedCount = session ? countLearnedWords(session.states) : 0;
  const missedCount = session ? session.cards.length - learnedCount : 0;

  const startSession = (cards = newCards.slice(0, wordLimit)) => {
    if (!cards.length) return;
    const poolSize = cards.length <= 5 ? 5 : 10;
    setSession({ cards, states: createWordStates(cards), activeIds: cards.slice(0, poolSize).map(card => card.id), poolSize, mode, questionIndex: 0, finished: false });
    setCounts({ correct: 0, wrong: 0, spelling: 0, meaning: 0 });
    setFeedback(null);
    setSelectedAnswer('');
    setTypedAnswer('');
    setRevealed(false);
  };

  const finishSession = () => setSession(current => current ? { ...current, finished: true } : current);

  const advance = () => {
    setFeedback(null);
    setCanContinue(false);
    setSelectedAnswer('');
    setTypedAnswer('');
    setRevealed(false);
    setSession(current => current && feedback?.task ? { ...current, questionIndex: current.questionIndex + 1, previousCardId: feedback.task.card.id } : current);
  };

  useEffect(() => {
    if (!feedback) return;
    if (feedback.correct) {
      const timer = window.setTimeout(advance, 650);
      return () => window.clearTimeout(timer);
    }
    setCanContinue(false);
    const timer = window.setTimeout(() => setCanContinue(true), 1200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const submitResult = (task: VocabularyLearningTask, correct: boolean, typed?: TypedAnswerResult) => {
    if (!session || feedback) return;
    const priorState = session.states[task.card.id];
    const nextState = recordLearningTaskResult(task.card, priorState, task.taskType, correct, session.questionIndex, session.mode);
    const nextStates = { ...session.states, [task.card.id]: nextState };
    const nextActiveIds = refillActivePool(session.activeIds, session.cards, nextStates, session.poolSize);
    const complete = countLearnedWords(nextStates) === session.cards.length;
    setSession({ ...session, states: nextStates, activeIds: nextActiveIds, finished: complete });
    setCounts(previous => ({
      correct: previous.correct + (correct ? 1 : 0),
      wrong: previous.wrong + (correct ? 0 : 1),
      spelling: previous.spelling + (typed?.status === 'SPELLING_ERROR' ? 1 : 0),
      meaning: previous.meaning + (!correct && typed?.status !== 'SPELLING_ERROR' ? 1 : 0),
    }));
    setFeedback({ task, correct, typed });
    if (!correct) playPronunciation(task.card.word);
  };

  const checkTyped = () => {
    if (!currentTask || !typedAnswer.trim()) return;
    const result = evaluateTypedAnswer(typedAnswer, currentTask.card.word, currentTask.card.acceptedAnswers || []);
    submitResult(currentTask, result.status === 'CORRECT', result);
  };

  const checkChoice = () => {
    if (!currentTask || !selectedAnswer) return;
    submitResult(currentTask, selectedAnswer.trim().toLocaleLowerCase() === currentTask.correctAnswer.trim().toLocaleLowerCase());
  };

  const displayedTask = feedback?.task || currentTask;
  const activeCard = displayedTask?.card;
  const isChoiceTask = displayedTask && ['MCQ_EN_VI', 'MCQ_VI_EN', 'DEFINITION', 'CONTEXT'].includes(displayedTask.taskType);
  const cardsNeedingReview = session?.cards.filter(card => session.states[card.id].stage !== 'LEARNED') || [];

  return (
    <section className="space-y-5" aria-label="Học từ mới">
      <header className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs uppercase tracking-wider font-bold text-slate-500">HỌC TỪ MỚI · TIẾN ĐỘ TRONG PHIÊN</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Học từ mới</h2><p className="mt-1 text-sm text-slate-600">Các lượt này giúp làm quen từ; lịch ôn dài hạn vẫn nằm trong mục Ôn tập chủ động.</p></div>
          <button type="button" onClick={onExit} className="px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Quay lại từ vựng</button>
        </div>
      </header>

      {!session && <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="text-sm font-semibold text-slate-800">Bộ từ
            <select value={sourceDeckId} onChange={event => setSourceDeckId(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal">
              <option value="all">Tất cả bộ từ ({getNewVocabularyCards(decks.flatMap(deck => deck.cards)).length} từ mới)</option>
              {decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name} ({getNewVocabularyCards(deck.cards).length} từ mới)</option>)}
            </select>
          </label>
          <fieldset><legend className="text-sm font-semibold text-slate-800">Số từ trong phiên</legend><div className="mt-2 flex gap-2">{([5, 10, 20] as const).map(value => <button key={value} type="button" aria-pressed={wordLimit === value} onClick={() => setWordLimit(value)} className={`rounded-lg border px-4 py-2 text-sm ${wordLimit === value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-700'}`}>{value} từ</button>)}</div></fieldset>
        </div>
        <fieldset><legend className="text-sm font-semibold text-slate-800">Cách học</legend><div className="mt-2 grid sm:grid-cols-2 gap-3">
          {([['DEEP', 'Học kỹ', 'Nhận diện, gõ từ và hiểu qua định nghĩa hoặc câu ví dụ.'], ['QUICK', 'Học nhanh', 'Nhận diện nghĩa theo hai chiều.']] as const).map(([value, title, description]) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={`rounded-lg border p-4 text-left ${mode === value ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}><span className="block font-semibold text-slate-900">{title}</span><span className="mt-1 block text-sm text-slate-600">{description}</span></button>)}
        </div></fieldset>
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={() => setPreviewOpen(value => !value)} disabled={!newCards.length} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50">{previewOpen ? 'Ẩn xem trước' : 'Xem trước danh sách'}</button>
          <button type="button" onClick={() => startSession()} disabled={!newCards.length} className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">Bắt đầu học {Math.min(wordLimit, newCards.length)} từ</button>
          {!newCards.length && <span className="text-sm text-slate-500">Bộ từ này chưa có mục mới đủ nghĩa để bắt đầu.</span>}
        </div>
        {previewOpen && <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Từ</th><th className="p-3">Nghĩa đã lưu</th><th className="p-3">Phát âm</th></tr></thead><tbody>{newCards.slice(0, wordLimit).map(card => <tr key={card.id} className="border-t border-slate-100"><td className="p-3 font-semibold">{card.word}</td><td className="p-3">{card.definitionVi}</td><td className="p-3">{card.phonetic || '—'}</td></tr>)}</tbody></table></div>}
      </div>}

      {session && !session.finished && displayedTask && <div className="mx-auto max-w-2xl bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{taskLabels[displayedTask.taskType]}{displayedTask.retry ? ' · LÀM LẠI' : ''}</p><p className="mt-1 text-sm text-slate-700">{learnedCount} / {session.cards.length} từ đã học trong phiên</p></div><button type="button" onClick={finishSession} className="text-sm text-slate-600 underline underline-offset-2">Kết thúc phiên</button></div>
        <div className="h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-700 transition-all" style={{ width: `${learnedCount / session.cards.length * 100}%` }} /></div>
        <div className="text-center space-y-3"><p className="text-xs uppercase tracking-widest text-slate-500">{displayedTask.prompt}</p>
          {displayedTask.taskType === 'DEFINITION' ? <p className="mx-auto max-w-lg font-serif-reading text-xl text-slate-800">{displayedTask.card.definitionEn}</p> : displayedTask.taskType === 'CONTEXT' ? <p className="mx-auto max-w-lg font-serif-reading text-xl text-slate-800">{displayedTask.contextBefore}<span className="mx-1 inline-block min-w-16 border-b-2 border-slate-500">&nbsp;</span>{displayedTask.contextAfter}</p> : displayedTask.taskType === 'MCQ_VI_EN' ? <p className="font-display text-3xl font-semibold text-slate-900">{displayedTask.card.definitionVi}</p> : <p className="font-display text-3xl font-semibold text-slate-900">{displayedTask.card.word}</p>}
          <div className="flex items-center justify-center gap-3 text-sm text-slate-500">{activeCard?.phonetic && <span className="font-mono">{activeCard.phonetic}</span>}<button type="button" onClick={() => activeCard && playPronunciation(activeCard.word)} className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50">Nghe phát âm</button></div>
        </div>

        {!feedback && currentTask?.taskType === 'FLASHCARD' && <div className="text-center space-y-4">{!revealed ? <button type="button" onClick={() => setRevealed(true)} className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">Hiện nghĩa</button> : <div className="space-y-3 rounded-lg bg-slate-50 p-4"><p className="text-xl font-semibold text-slate-900">{currentTask.card.definitionVi}</p>{currentTask.card.definitionEn && <p className="text-sm text-slate-700">{currentTask.card.definitionEn}</p>}{currentTask.card.example && <p className="font-serif-reading text-base italic text-slate-600">{currentTask.card.example}</p>}<p className="text-sm font-medium text-slate-700">Bạn đã nhớ nghĩa chưa?</p><div className="flex justify-center gap-3"><button type="button" onClick={() => submitResult(currentTask, false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Chưa nhớ</button><button type="button" onClick={() => submitResult(currentTask, true)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Đã nhớ</button></div></div>}</div>}

        {isChoiceTask && displayedTask?.options && <div className="space-y-2">{displayedTask.options.map((option, index) => { const correctOption = feedback && option.toLowerCase() === displayedTask.correctAnswer.toLowerCase(); const chosenWrong = feedback && !feedback.correct && option === selectedAnswer; return <button key={`${displayedTask.taskType}-${option}`} type="button" disabled={!!feedback} onClick={() => setSelectedAnswer(option)} className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${correctOption ? 'border-emerald-400 bg-emerald-50 text-emerald-950' : chosenWrong ? 'border-rose-300 bg-rose-50 text-rose-900' : selectedAnswer === option ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:bg-slate-50'}`}><span className="mr-2 font-mono text-slate-400">{String.fromCharCode(65 + index)}.</span>{option}</button>;})}{!feedback && <button type="button" onClick={checkChoice} disabled={!selectedAnswer} className="mt-2 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Kiểm tra</button>}</div>}

        {!feedback && currentTask?.taskType === 'TYPE_VI_EN' && <form onSubmit={event => { event.preventDefault(); checkTyped(); }} className="space-y-3"><input key={currentTask.card.id} autoFocus value={typedAnswer} onChange={event => setTypedAnswer(event.target.value)} placeholder="Gõ từ tiếng Anh" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-lg" /><button type="submit" disabled={!typedAnswer.trim()} className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Kiểm tra</button></form>}

        {feedback && <div role="status" className={`rounded-lg border p-4 space-y-3 ${feedback.correct ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-amber-200 bg-amber-50 text-amber-950'}`}><p className="font-semibold">{feedback.correct ? 'Chính xác.' : feedback.typed?.status === 'SPELLING_ERROR' ? 'Gần đúng — sai chính tả.' : 'Chưa chính xác.'}</p>{feedback.typed && <p className="text-sm">Bạn gõ: <strong>{feedback.typed.received || '(để trống)'}</strong><br />Đáp án: <strong>{feedback.typed.expected}</strong></p>}{!feedback.correct && <p className="text-sm">{feedback.task.card.definitionVi}{feedback.task.card.definitionEn ? ` · ${feedback.task.card.definitionEn}` : ''}</p>}{feedback.correct && <p className="text-sm">{feedback.task.card.word} · {feedback.task.card.definitionVi}</p>}{!feedback.correct && <button type="button" onClick={() => playPronunciation(feedback.task.card.word)} className="text-sm underline">Nghe lại phát âm</button>}{!feedback.correct && <div><button type="button" disabled={!canContinue} onClick={advance} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-45">Tiếp tục</button></div>}</div>}
      </div>}

      {session?.finished && <div className="mx-auto max-w-xl bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5">
        <div><p className="text-xs uppercase tracking-wider font-bold text-slate-500">TỔNG KẾT PHIÊN</p><h3 className="mt-1 text-2xl font-bold text-slate-900">{learnedCount === session.cards.length ? 'Đã hoàn thành' : 'Phiên đã kết thúc'}</h3><p className="mt-1 text-sm text-slate-600">{learnedCount} / {session.cards.length} từ đạt mức học trong phiên. Đây chưa phải trạng thái nắm vững dài hạn.</p></div>
        <dl className="divide-y divide-slate-100 rounded-lg bg-slate-50 px-4"><div className="flex justify-between py-3 text-sm"><dt>Trả lời đúng</dt><dd className="font-mono font-semibold">{counts.correct}</dd></div><div className="flex justify-between py-3 text-sm"><dt>Lỗi chính tả</dt><dd className="font-mono font-semibold">{counts.spelling}</dd></div><div className="flex justify-between py-3 text-sm"><dt>Lỗi nghĩa / ghi nhớ</dt><dd className="font-mono font-semibold">{counts.meaning}</dd></div><div className="flex justify-between py-3 text-sm"><dt>Từ còn cần xem lại</dt><dd className="font-mono font-semibold">{missedCount}</dd></div></dl>
        <div className="flex flex-wrap gap-3">{missedCount > 0 && <button type="button" onClick={() => startSession(cardsNeedingReview)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Ôn lại {missedCount} từ còn vướng</button>}<button type="button" onClick={onExit} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Hoàn thành</button></div>
      </div>}
    </section>
  );
};
