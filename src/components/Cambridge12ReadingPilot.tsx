import React, { useEffect, useRef, useState } from 'react';
import type { TestAttempt } from '../types';
import type { PrivateBookManifest, PrivateReadingSection } from '../types/bookPractice';
import { flattenBookReadingQuestions, gradeCambridgeReadingTest, loadCambridgeManifest, loadCambridgeReadingSection } from '../utils/bookPractice';
import { clearCambridgePracticeDraft, loadAttemptsFromStorage, loadCambridgePracticeDraft, markAttemptReviewed, recordAttempt, saveCambridgePracticeDraft } from '../utils/db';
import { WordCapturePopover } from './WordCapturePopover';
import { ActiveStudyClock } from '../utils/studyClock';
import { readingChoiceValue } from '../utils/bookPracticeGrade';

interface GradeResult { score: number; total: number; answers: Record<string, string>; correctByQuestion: Record<string, boolean> }
const TEXT_ANSWER_TYPES = new Set(['sentence-completion', 'summary-completion', 'note-completion', 'table-completion', 'flowchart-completion', 'short-answer', 'diagram-label-completion']);

interface Cambridge12ReadingPilotProps { testNumber: number; sectionNumber?: number; onBack?: () => void; onNext?: () => void }

export const Cambridge12ReadingPilot: React.FC<Cambridge12ReadingPilotProps> = ({ testNumber, sectionNumber, onBack, onNext }) => {
  const studyClock = useRef<ActiveStudyClock | null>(null);
  if (!studyClock.current) studyClock.current = new ActiveStudyClock();
  const [manifest, setManifest] = useState<PrivateBookManifest | null>(null);
  const [sections, setSections] = useState<PrivateReadingSection[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const [attemptId, setAttemptId] = useState('');
  const [reviewComplete, setReviewComplete] = useState(false);
  const [busy, setBusy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const updateVisibility = () => studyClock.current?.setVisible(document.visibilityState !== 'hidden');
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    let active = true;
    setBusy(true);
    setSections([]);
    setAnswers({});
    setResult(null);
    setSecondsLeft(60 * 60);
    setTimerRunning(false);
    setError('');
    Promise.all([
      loadCambridgeManifest(),
      Promise.all((sectionNumber ? [sectionNumber] : [1, 2, 3]).map(number => loadCambridgeReadingSection(testNumber, number))),
      loadAttemptsFromStorage()
    ]).then(async ([book, readingSections, attempts]) => {
      if (!active) return;
      setManifest(book);
      setSections(readingSections);
      const previous = attempts
        .filter(attempt => (attempt.sourcePackId === book.id || attempt.bookId === book.bookId) && attempt.testNumber === testNumber && attempt.module === 'reading' && attempt.sectionNumber === sectionNumber)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const draftId = `test-${testNumber}-reading-${sectionNumber ?? 'all'}`;
      const savedDraft = await loadCambridgePracticeDraft(draftId);
      if (previous) {
        const questionNumbers = readingSections.flatMap(item => flattenBookReadingQuestions(item).map(question => question.number));
        const graded = await gradeCambridgeReadingTest(testNumber, previous.userAnswers, questionNumbers);
        if (active) { setAnswers(previous.userAnswers); setResult(graded); setAttemptId(previous.id); setReviewComplete(Boolean(previous.reviewedAt) || previous.incorrectQuestionNumbers.length === 0); }
      } else if (active && savedDraft) setAnswers(savedDraft.answers);
    }).catch(reason => {
      if (active) setError(reason instanceof Error ? reason.message : 'Không tải được nội dung Cambridge.');
    }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [testNumber, sectionNumber]);

  const submit = async () => {
    if (!sections.length || !manifest || result || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const questionNumbers = sections.flatMap(section => flattenBookReadingQuestions(section).map(question => question.number));
      const graded = await gradeCambridgeReadingTest(testNumber, answers, questionNumbers);
      const questions = sections.flatMap(section => section.questionGroups.flatMap(group => group.questions.map(question => ({
        ...question,
        options: question.options || group.options,
        sectionNumber: section.sectionNumber,
      }))));
      const incorrect = questions.filter(question => !graded.correctByQuestion[String(question.number)]);
      const questionTypeStats: NonNullable<TestAttempt['questionTypeStats']> = {};
      for (const question of questions) {
        const stat = questionTypeStats[question.type] || { correct: 0, total: 0 };
        stat.total += 1;
        if (graded.correctByQuestion[String(question.number)]) stat.correct += 1;
        questionTypeStats[question.type] = stat;
      }
      const nextAttemptId = `cambridge12-gt-test${testNumber}-reading-s${sectionNumber ?? 'all'}-${Date.now()}`;
      const completedWithoutMistakes = incorrect.length === 0;
      await recordAttempt({
        id: nextAttemptId, examFamily: 'ielts', skill: 'reading', sectionId: nextAttemptId,
        sectionTitle: `Cambridge IELTS 12 GT · Test ${testNumber} · Reading`,
        source: manifest.id, sourcePackId: manifest.id, module: 'reading', bookId: manifest.bookId, testNumber, sectionNumber,
        date: new Date().toISOString(), reviewedAt: completedWithoutMistakes ? new Date().toISOString() : undefined, score: graded.score, total: graded.total,
        durationSeconds: sectionNumber ? studyClock.current?.elapsedSeconds() ?? 0 : 60 * 60 - secondsLeft, mode: sectionNumber ? 'study' : 'simulation', userAnswers: answers,
        incorrectQuestionNumbers: incorrect.map(question => question.number),
        questionResults: questions.map(question => ({
          questionNumber: question.number, sectionNumber: question.sectionNumber, questionType: question.type,
          userAnswer: answers[String(question.number)] || '', correctAnswer: graded.answers[String(question.number)],
          isCorrect: graded.correctByQuestion[String(question.number)], printedPage: question.printedPage, sourcePdfPage: question.sourcePdfPage
        })),
        questionTypeStats,
        mistakeTags: incorrect.map(question => ({
          questionNumber: question.number, sectionNumber: question.sectionNumber, type: question.type,
          userAnswer: answers[String(question.number)] || '(unanswered)', correctAnswer: graded.answers[String(question.number)],
          questionPrompt: question.prompt || question.type,
          options: question.options,
          sourcePage: question.printedPage, sourcePdfPage: question.sourcePdfPage
        }))
      });
      await clearCambridgePracticeDraft(`test-${testNumber}-reading-${sectionNumber ?? 'all'}`);
      setAttemptId(nextAttemptId);
      setReviewComplete(completedWithoutMistakes);
      setResult(graded);
      setTimerRunning(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể chấm bài.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!timerRunning || result) return;
    const timer = window.setInterval(() => setSecondsLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning, result]);
  useEffect(() => {
    if (timerRunning && secondsLeft === 0 && !result) void submit();
  }, [secondsLeft, timerRunning, result]);

  const updateAnswer = (number: number, value: string) => {
    if (result) return;
    setAnswers(previous => ({ ...previous, [String(number)]: value }));
    void saveCambridgePracticeDraft({
      id: `test-${testNumber}-reading-${sectionNumber ?? 'all'}`, testNumber, module: 'reading',
      sectionNumber: sectionNumber ?? 0, answers: { ...answers, [String(number)]: value }, updatedAt: new Date().toISOString()
    });
    if (sectionNumber === undefined) setTimerRunning(true);
  };
  const reset = () => { setAnswers({}); setResult(null); setAttemptId(''); setReviewComplete(false); setError(''); setSecondsLeft(60 * 60); setTimerRunning(false); void clearCambridgePracticeDraft(`test-${testNumber}-reading-${sectionNumber ?? 'all'}`); };
  const formatTime = `${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;
  const visibleQuestions = sections.flatMap(item => flattenBookReadingQuestions(item));
  const completeReview = async () => {
    if (attemptId) await markAttemptReviewed(attemptId);
    setReviewComplete(true);
  };

  if (busy) return <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Đang tải bài đọc…</p>;
  if (error && !sections.length) return <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">{error}</div>;
  if (!manifest || !sections.length) return null;

  return <div className="space-y-5">
    <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      {onBack && <button type="button" onClick={onBack} className="text-sm text-slate-600 underline underline-offset-4">Cambridge 12 › Test {testNumber}</button>}
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">Cambridge IELTS 12 GT · General Training</p>
      <h2 className="mt-2 font-serif text-2xl text-slate-950">Test {testNumber} · Reading{sectionNumber ? ` · Phần ${sectionNumber}` : ''}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Làm bài, nộp và ôn lại câu sai trước khi tiếp tục.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-1">{visibleQuestions.length} câu hỏi</span>
        {sectionNumber === undefined && <span className={`rounded-full px-3 py-1 font-mono ${secondsLeft < 300 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100'}`}>{formatTime} còn lại</span>}
        {sectionNumber === undefined && !timerRunning && !result && <button type="button" className="rounded-full border border-slate-300 px-3 py-1" onClick={() => setTimerRunning(true)}>Bắt đầu tính giờ</button>}
      </div>
    </header>

    {sections.map(section => {
      const questions = flattenBookReadingQuestions(section);
      return <section key={section.sectionNumber} className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <h3 className="font-serif text-xl text-slate-950">Phần {section.sectionNumber}</h3>
          <p className="text-sm text-slate-600">Câu {Math.min(...questions.map(question => question.number))}–{Math.max(...questions.map(question => question.number))}</p>
        </div>
        {section.passages.map(passage => <article key={passage.id} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
            <h4 className="font-serif text-xl text-slate-950">{passage.title}</h4>
            <span className="text-xs text-slate-500">Sách trang {passage.printedPage} · PDF trang {passage.sourcePdfPage}</span>
          </div>
          <div className="whitespace-pre-line font-serif text-[15px] leading-7 text-slate-800">{passage.text}</div>
        </article>)}
        <WordCapturePopover sourceLabel={`Cambridge IELTS 12 GT · Test ${testNumber} · Reading Section ${section.sectionNumber}`} sourceType="reading" sourcePackId={manifest.id} testNumber={testNumber} sectionNumber={section.sectionNumber} />
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          {section.questionGroups.map(group => <div key={group.id}>
            <div className="mb-4 rounded-lg bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-700">{group.instructions}</p>
              {group.options?.some(option => option.length > 1) && <ul className="mt-3 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">{group.options.map(option => <li key={option}>{option}</li>)}</ul>}
              <p className="mt-2 text-xs text-slate-500">Sách trang {group.printedPage} · PDF trang {group.sourcePdfPage}</p>
            </div>
            <div className="space-y-3">
              {group.questions.map(question => {
                const answer = answers[String(question.number)] || '';
                const correct = result?.answers[String(question.number)] || '';
                const isCorrect = Boolean(result?.correctByQuestion[String(question.number)]);
                const inputOptions = question.options || group.options;
                const textEntry = TEXT_ANSWER_TYPES.has(question.type) || !inputOptions?.length;
                return <div key={question.id} className={`rounded-xl border p-4 ${result ? isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50' : 'border-slate-200'}`}>
                  <p className="text-sm font-medium leading-6 text-slate-900"><span className="mr-2 font-semibold text-emerald-800">{question.number}.</span>{question.prompt}</p>
                  {textEntry ? <input aria-label={`Câu ${question.number}`} disabled={Boolean(result)} value={answer} onChange={event => updateAnswer(question.number, event.target.value)} className="mt-3 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100" /> : <div className="mt-3 flex flex-wrap gap-2">{inputOptions.map(option => {
                    const choice = readingChoiceValue(option);
                    const description = question.options?.find(item => item.startsWith(`${choice} `)) || group.options?.find(item => item.startsWith(`${choice} `));
                    return <label key={choice} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${answer === choice ? 'border-emerald-800 bg-emerald-50 text-emerald-950' : 'border-slate-200 text-slate-700'} ${result ? 'pointer-events-none opacity-90' : ''}`}>
                      <input className="sr-only" type="radio" name={question.id} value={choice} checked={answer === choice} disabled={Boolean(result)} onChange={() => updateAnswer(question.number, choice)} />{description || choice}
                    </label>;
                  })}</div>}
              {result && <p className={`mt-3 text-sm ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>Bạn trả lời: {answer || '—'} · {isCorrect ? 'Đúng' : `Đáp án: ${correct}`} · trang {question.printedPage} trong sách</p>}
                </div>;
              })}
            </div>
          </div>)}
          {result && <div role="status" className="mt-5 rounded-xl bg-slate-900 p-4 text-white"><p className="text-xs uppercase tracking-widest text-slate-300">Kết quả lượt làm</p><p className="mt-1 font-serif text-2xl">{result.score} / {result.total}</p><p className="mt-1 text-sm text-slate-300">Lượt làm và câu sai đã được lưu.</p></div>}
          {error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}
          {(sectionNumber !== undefined || section.sectionNumber === 3) && <div className="mt-5 flex flex-wrap items-center gap-3">{!result ? <button type="button" onClick={() => void submit()} disabled={submitting} className="rounded-lg bg-emerald-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{submitting ? 'Đang chấm…' : 'Nộp phần này'}</button> : <><strong className="text-lg">{result.score}/{result.total}</strong>{!reviewComplete ? <button type="button" onClick={() => void completeReview()} className="rounded-lg bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Ôn xong câu sai</button> : onNext ? <button type="button" onClick={onNext} className="rounded-lg bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Phần tiếp theo</button> : <button type="button" onClick={reset} className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800">Làm lại phần này</button>}</>}</div>}
        </div>
      </section>;
    })}
  </div>;
};
