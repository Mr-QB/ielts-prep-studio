import React, { useEffect, useRef, useState } from 'react';
import type { PrivateBookManifest, PrivateListeningTest, PrivateListeningTranscripts } from '../types/bookPractice';
import type { TestAttempt } from '../types';
import { loadCambridgeManifest, loadCambridgeListeningTest, loadCambridgeListeningTranscripts, gradeCambridgeListeningTest } from '../utils/bookPractice';
import { clearCambridgePracticeDraft, loadAttemptsFromStorage, loadCambridgePracticeDraft, markAttemptReviewed, recordAttempt, saveCambridgePracticeDraft } from '../utils/db';
import { WordCapturePopover } from './WordCapturePopover';
import { ActiveStudyClock } from '../utils/studyClock';

type GradeResult = { score: number; total: number; answers: Record<string, string>; correctByQuestion: Record<string, boolean> };

interface Cambridge12ListeningPilotProps { testNumber: number; partNumber: number; onBack?: () => void; onNext?: () => void }

export const Cambridge12ListeningPilot: React.FC<Cambridge12ListeningPilotProps> = ({ testNumber, partNumber, onBack, onNext }) => {
  const studyClock = useRef<ActiveStudyClock | null>(null);
  if (!studyClock.current) studyClock.current = new ActiveStudyClock();
  const [manifest, setManifest] = useState<PrivateBookManifest | null>(null);
  const [test, setTest] = useState<PrivateListeningTest | null>(null);
  const activePart = partNumber;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const [attemptId, setAttemptId] = useState('');
  const [reviewComplete, setReviewComplete] = useState(false);
  const [transcripts, setTranscripts] = useState<PrivateListeningTranscripts | null>(null);
  const [busy, setBusy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const updateVisibility = () => studyClock.current?.setVisible(document.visibilityState !== 'hidden');
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    let active = true;
    setBusy(true);
    setTest(null);
    setAnswers({});
    setResult(null);
    setAttemptId('');
    setReviewComplete(false);
    setTranscripts(null);
    setError('');
    Promise.all([loadCambridgeManifest(), loadCambridgeListeningTest(testNumber), loadAttemptsFromStorage()])
      .then(async ([book, data, attempts]) => {
        if (!active) return;
        setManifest(book);
        setTest(data);
        const previous = attempts
          .filter(attempt => (attempt.sourcePackId === book.id || attempt.bookId === book.bookId) && attempt.testNumber === testNumber && attempt.module === 'listening' && attempt.sectionNumber === partNumber)
          .sort((a, b) => b.date.localeCompare(a.date))[0];
        const savedDraft = await loadCambridgePracticeDraft(`test-${testNumber}-listening-${partNumber}`);
        if (previous?.questionResults?.length) {
          setAnswers(previous.userAnswers);
          setAttemptId(previous.id);
          setReviewComplete(Boolean(previous.reviewedAt) || previous.incorrectQuestionNumbers.length === 0);
          setResult({
            score: previous.score, total: previous.total,
            answers: Object.fromEntries(previous.questionResults.map(item => [String(item.questionNumber), item.correctAnswer])),
            correctByQuestion: Object.fromEntries(previous.questionResults.map(item => [String(item.questionNumber), item.isCorrect]))
          });
          try { setTranscripts(await loadCambridgeListeningTranscripts(testNumber)); } catch { /* Saved attempt remains reviewable when transcripts are not cached. */ }
        } else if (savedDraft) setAnswers(savedDraft.answers);
      })
      .catch(reason => {
        if (active) setError(reason instanceof Error ? reason.message : 'Không tải được bài Listening Cambridge.');
      })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [testNumber, partNumber]);

  const part = test?.parts.find(item => item.partNumber === activePart);
  const allQuestions = test?.parts.flatMap(item => item.questionGroups.flatMap(group => group.questions.map(question => ({
    ...question,
    options: question.options || group.options,
  })))) ?? [];
  const questionPart = new Map<number, number>(test?.parts.flatMap(item =>
    item.questionGroups.flatMap(group => group.questions.map(question => [question.number, item.partNumber] as [number, number]))
  ) ?? []);
  const visibleQuestions = allQuestions.filter(question => questionPart.get(question.number) === activePart);

  const submit = async () => {
    if (!test || !manifest || !visibleQuestions.length || submitting || result) return;
    setSubmitting(true);
    setError('');
    let graded: GradeResult;
    try {
      graded = await gradeCambridgeListeningTest(testNumber, answers, visibleQuestions.map(question => question.number));
    } catch (reason) {
      setSubmitting(false);
      setError(reason instanceof Error ? reason.message : 'Không thể chấm bài Listening. Cần kết nối máy chủ để chấm.');
      return;
    }

    const incorrect = visibleQuestions.filter(question => !graded.correctByQuestion[String(question.number)]);
    const questionTypeStats: NonNullable<TestAttempt['questionTypeStats']> = {};
    for (const question of visibleQuestions) {
      const stat = questionTypeStats[question.type] || { correct: 0, total: 0 };
      stat.total += 1;
      if (graded.correctByQuestion[String(question.number)]) stat.correct += 1;
      questionTypeStats[question.type] = stat;
    }
    const nextAttemptId = 'cambridge12-gt-test' + testNumber + '-listening-p' + activePart + '-' + Date.now();
    const questionResults = visibleQuestions.map(question => ({
      questionNumber: question.number,
      sectionNumber: questionPart.get(question.number),
      questionType: question.type,
      userAnswer: answers[String(question.number)] || '',
      correctAnswer: graded.answers[String(question.number)] || '',
      isCorrect: !!graded.correctByQuestion[String(question.number)],
      printedPage: question.printedPage,
      sourcePdfPage: question.sourcePdfPage
    }));
    const mistakes: TestAttempt['mistakeTags'] = incorrect.map(question => ({
      questionNumber: question.number,
      sectionNumber: questionPart.get(question.number),
      type: question.type,
      userAnswer: answers[String(question.number)] || '(chưa trả lời)',
      correctAnswer: graded.answers[String(question.number)] || '',
      questionPrompt: question.prompt || question.type,
      options: question.options,
      sourcePage: question.printedPage,
      sourcePdfPage: question.sourcePdfPage
    }));
    try {
      await recordAttempt({
        id: nextAttemptId, examFamily: 'ielts', skill: 'listening', sectionId: nextAttemptId,
        sectionTitle: 'Cambridge IELTS 12 GT · Test ' + testNumber + ' · Listening',
        source: manifest.id, sourcePackId: manifest.id, module: 'listening',
        bookId: manifest.bookId, testNumber, sectionNumber: activePart,
        date: new Date().toISOString(), reviewedAt: incorrect.length === 0 ? new Date().toISOString() : undefined, score: graded.score, total: graded.total,
        durationSeconds: studyClock.current?.elapsedSeconds() ?? 0, mode: 'study', userAnswers: answers,
        incorrectQuestionNumbers: incorrect.map(question => question.number),
        questionResults, questionTypeStats, mistakeTags: mistakes
      });
      await clearCambridgePracticeDraft(`test-${testNumber}-listening-${activePart}`);
      setAttemptId(nextAttemptId);
      setReviewComplete(incorrect.length === 0);
      setResult(graded);
    } catch (reason) {
      setSubmitting(false);
      setError(reason instanceof Error ? reason.message : 'Không thể lưu lượt làm Listening.');
      return;
    }
    try {
      setTranscripts(await loadCambridgeListeningTranscripts(testNumber));
    } catch (reason) {
      setError('Lượt làm đã lưu; chưa tải được transcript. ' + (reason instanceof Error ? reason.message : ''));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
    setTranscripts(null);
    setReviewComplete(false);
    setAttemptId('');
    setError('');
    void clearCambridgePracticeDraft(`test-${testNumber}-listening-${activePart}`);
  };
  const updateAnswer = (questionNumber: number, value: string) => {
    const nextAnswers = { ...answers, [String(questionNumber)]: value };
    setAnswers(nextAnswers);
    void saveCambridgePracticeDraft({ id: `test-${testNumber}-listening-${activePart}`, testNumber, module: 'listening', sectionNumber: activePart, answers: nextAnswers, updatedAt: new Date().toISOString() });
  };
  const completeReview = async () => {
    if (attemptId) await markAttemptReviewed(attemptId);
    setReviewComplete(true);
  };

  if (busy) return <div className="p-6 text-sm text-slate-600">Đang tải nội dung Cambridge 12 GT…</div>;
  if (error && !test) return <div role="alert" className="p-4 border border-rose-200 bg-rose-50 text-rose-900 rounded">{error}</div>;
  if (!test || !part) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          {onBack && <button type="button" onClick={onBack} className="text-sm text-slate-600 underline underline-offset-4">Cambridge 12 › Test {testNumber}</button>}
          <p className="mt-2 text-xs text-slate-500">Học liệu Cambridge cá nhân</p>
          <h2 className="text-xl font-semibold text-slate-900">Test {testNumber} · Listening · Part {activePart}</h2>
        </div>
        {result && <button type="button" onClick={reset} className="rounded border border-slate-300 px-3 py-1.5 text-sm">Làm lại Part này</button>}
      </div>

      {part.audio.status === 'available' && part.audio.fileName ? <section className="rounded border border-slate-200 bg-white p-4">
        <label htmlFor="cambridge-listening-audio" className="mb-2 block text-sm font-medium text-slate-800">Nghe bản ghi âm gốc</label>
        <audio id="cambridge-listening-audio" controls preload="metadata" className="w-full" src={`/api/private-content/cambridge12-gt/test/${testNumber}/listening/part/${activePart}/audio`} />
      </section> : <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
        Chưa có audio Cambridge gốc. Bạn có thể làm câu hỏi và xem bản chép lời sau khi nộp, nhưng nội dung này không thay thế bài nghe có audio.
      </div>}

      {!result && <div className="flex justify-end">
        <button type="button" onClick={() => void submit()} disabled={submitting}
          className="rounded bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
          {submitting ? 'Đang chấm…' : 'Nộp Part này'}
        </button>
      </div>}

      <section className="rounded border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Part {part.partNumber}: {part.title}</h3>
        <div className="mt-4 space-y-5">
          {part.questionGroups.map(group => (
            <div key={group.id} className="space-y-3">
              <p className="whitespace-pre-line text-sm font-medium text-slate-700">{group.instructions}</p>
              {group.asset && <img src={group.asset} alt="Sơ đồ câu hỏi trong Cambridge IELTS 12 GT" className="max-h-[32rem] w-full max-w-3xl rounded border border-slate-200 object-contain object-left" />}
              {group.questions.map(question => {
                const selected = answers[String(question.number)] || '';
                const correct = result?.correctByQuestion[String(question.number)];
                const options = question.options ?? group.options;
                return (
                  <div key={question.id} className="rounded border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <label className="text-sm text-slate-900" htmlFor={question.id}>
                        <span className="mr-2 font-semibold">{question.number}.</span>{question.prompt}
                      </label>
                      {result && <span className={'shrink-0 text-xs font-semibold ' + (correct ? 'text-emerald-700' : 'text-rose-700')}>{correct ? 'Đúng' : 'Chưa đúng'}</span>}
                    </div>
                    {options?.length ? (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {options.map(option => {
                          const code = option.match(/^[A-I]\b/)?.[0] ?? option;
                          return <label key={option} className="flex items-center gap-2 text-sm text-slate-800">
                            <input type="radio" name={question.id} checked={selected === code} disabled={!!result}
                              onChange={() => updateAnswer(question.number, code)} />
                            <span>{option}</span>
                          </label>;
                        })}
                      </div>
                    ) : (
                      <input id={question.id} value={selected} disabled={!!result}
                        onChange={event => updateAnswer(question.number, event.target.value)}
                        className="mt-3 w-full max-w-lg rounded border border-slate-300 px-3 py-2 text-sm" />
                    )}
                    {result && <p className="mt-2 text-xs text-slate-600">Bạn trả lời: <strong>{selected || '(chưa trả lời)'}</strong> · Đáp án: <strong>{result.answers[String(question.number)]}</strong></p>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {result && transcripts && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Bản chép lời · chỉ hiện sau khi nộp</h3>
          {transcripts.parts.filter(item => item.partNumber === activePart).map(item => (
            <section key={item.partNumber} className="rounded border border-slate-200 bg-white p-5">
              <p className="mb-2 text-xs text-slate-500">Nguồn: Cambridge IELTS 12 GT · trang in {item.printedPages.join('–')}</p>
              <div className="whitespace-pre-line text-sm leading-7 text-slate-800">{item.transcript}</div>
              <WordCapturePopover sourceLabel="Cambridge IELTS 12 GT" sourceType="listening" sourcePackId={manifest?.id} testNumber={testNumber} sectionNumber={item.partNumber} />
            </section>
          ))}
        </div>
      )}

      {result && <div className="flex flex-wrap items-center gap-3 rounded border border-slate-200 bg-white p-4">
        <strong className="text-lg">{result.score}/{result.total}</strong>
        {!reviewComplete ? <button type="button" onClick={() => void completeReview()} className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">Ôn xong câu sai</button> : onNext ? <button type="button" onClick={onNext} className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">Part tiếp theo</button> : <span className="text-sm text-slate-600">Đã ôn xong câu sai</span>}
      </div>}

      {error && <div role="alert" className="rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{error}</div>}
    </div>
  );
};

