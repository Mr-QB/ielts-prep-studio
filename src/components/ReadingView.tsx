import React, { useState, useEffect, useRef } from 'react';
import { READING_FULL_TESTS, READING_PASSAGES, READING_SOURCES } from '../data/readingData';
import { READING_PRACTICE_SETS } from '../data/readingPracticeData';
import { ReadingQuestionType, ReadingPassage, ReadingQuestion, TestAttempt } from '../types';
import { recordAttempt, addWordToVocabDeck } from '../utils/db';
import { calculateReadingBand, formatTime } from '../utils/ieltsScoring';
import {
  Highlighter, Flag, Check, X, RotateCcw, Clock, AlertCircle,
  HelpCircle, BookOpen, ChevronRight, ChevronLeft, Plus, CheckCircle2, Award
} from 'lucide-react';

interface ReadingViewProps {
  examMode?: 'study' | 'simulation';
}

const QUESTION_TYPE_LABELS: Record<ReadingQuestionType, string> = {
  'true-false-notgiven': 'True / False / Not Given',
  'yes-no-notgiven': 'Yes / No / Not Given',
  'matching-headings': 'Matching Headings',
  'matching-information': 'Matching Information',
  'matching-features': 'Matching Features',
  'matching-sentence-endings': 'Matching Sentence Endings',
  'multiple-choice': 'Multiple Choice',
  'sentence-completion': 'Sentence Completion',
  'summary-completion': 'Summary Completion',
  'note-completion': 'Note Completion',
  'table-completion': 'Table Completion',
  'flowchart-completion': 'Flow-chart Completion',
  'diagram-label-completion': 'Diagram Label Completion',
  'short-answer': 'Short Answer'
};

export const ReadingView: React.FC<ReadingViewProps> = () => {
  // Top-level mode: 'practice' (by question type) or 'full-test' (40 questions, 60 mins)
  const [activeMode, setActiveMode] = useState<'practice' | 'full-test'>('practice');

  // PRACTICE MODE STATES
  const [selectedQuestionType, setSelectedQuestionType] = useState<ReadingQuestionType>('true-false-notgiven');
  const activePracticeSet = READING_PRACTICE_SETS.find(s => s.questionType === selectedQuestionType) || READING_PRACTICE_SETS[0];

  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState<boolean>(false);
  const [addedVocabWords, setAddedVocabWords] = useState<Record<string, boolean>>({});

  // FULL TEST MODE STATES
  const fullTest = READING_FULL_TESTS[0];
  const [activePassageIndex, setActivePassageIndex] = useState<number>(0);
  const [fullTestAnswers, setFullTestAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(60 * 60); // 60 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);

  // Highlighter states
  const [activeHighlightColor, setActiveHighlightColor] = useState<'yellow' | 'green' | 'blue'>('yellow');
  const [highlights, setHighlights] = useState<Record<string, boolean>>({});

  // Timer effect for Full Test
  useEffect(() => {
    let interval: any = null;
    if (activeMode === 'full-test' && isTimerRunning && !isTestSubmitted && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            handleFinalSubmitFullTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeMode, isTimerRunning, isTestSubmitted, secondsLeft]);

  // Reset practice state on question type change
  useEffect(() => {
    setPracticeAnswers({});
    setPracticeSubmitted(false);
  }, [selectedQuestionType]);

  // Flatten all 40 questions of Full Test
  const allFullTestQuestions: { question: ReadingQuestion; passageIndex: number }[] = fullTest.passages.flatMap((p, pIdx) =>
    p.questions.map(q => ({ question: q, passageIndex: pIdx }))
  );

  const currentPassage = fullTest.passages[activePassageIndex];

  // -------------------------------------------------------------
  // PRACTICE MODE HANDLERS
  // -------------------------------------------------------------
  const handlePracticeAnswerChange = (qId: string, val: string) => {
    setPracticeAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handlePracticeSubmit = () => {
    setPracticeSubmitted(true);

    // Record mistakes if any
    const incorrects: TestAttempt['mistakeTags'] = [];
    activePracticeSet.questions.forEach(q => {
      const userAns = (practiceAnswers[q.id] || '').trim();
      const target = q.correctAnswer.trim();
      const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
      const isCorrect = userAns.toLowerCase() === target.toLowerCase() || acceptable.includes(userAns.toLowerCase());

      if (!isCorrect) {
        incorrects.push({
          questionNumber: q.number,
          type: q.type,
          userAnswer: userAns || '(chưa điền)',
          correctAnswer: target,
          paraphraseNote: q.passageParaphrase
        });
      }
    });

    if (incorrects.length > 0) {
      recordAttempt({
        id: `practice-read-${Date.now()}`,
        skill: 'reading',
        sectionId: activePracticeSet.id,
        sectionTitle: activePracticeSet.title,
        date: new Date().toISOString(),
        score: activePracticeSet.questions.length - incorrects.length,
        total: activePracticeSet.questions.length,
        durationSeconds: 180,
        mode: 'study',
        userAnswers: practiceAnswers,
        incorrectQuestionNumbers: incorrects.map(m => m.questionNumber),
        mistakeTags: incorrects
      });
    }
  };

  const handleAddWordToVocab = async (word: string, defVi: string, sentence: string) => {
    const res = await addWordToVocabDeck({
      word,
      definitionVi: defVi,
      sourceContext: sentence,
      source: 'Reading Practice'
    });
    if (res.success) {
      setAddedVocabWords(prev => ({ ...prev, [word]: true }));
    }
  };

  // -------------------------------------------------------------
  // FULL TEST MODE HANDLERS
  // -------------------------------------------------------------
  const handleFullTestAnswerChange = (qId: string, val: string) => {
    if (isTestSubmitted) return;
    setFullTestAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const toggleFlagQuestion = (qNum: number) => {
    setFlaggedQuestions(prev => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const startFullTest = () => {
    setIsTimerRunning(true);
  };

  const handleFinalSubmitFullTest = () => {
    setShowSubmitConfirmModal(false);
    setIsTestSubmitted(true);
    setIsTimerRunning(false);

    let rawScore = 0;
    const passageScores = [
      { passageIndex: 0, score: 0, total: fullTest.passages[0].questions.length },
      { passageIndex: 1, score: 0, total: fullTest.passages[1].questions.length },
      { passageIndex: 2, score: 0, total: fullTest.passages[2].questions.length }
    ];

    const typeStats: Record<string, { correct: number; total: number }> = {};
    const incorrects: number[] = [];
    const mistakes: TestAttempt['mistakeTags'] = [];

    allFullTestQuestions.forEach(({ question: q, passageIndex: pIdx }) => {
      const userAns = (fullTestAnswers[q.id] || '').trim();
      const target = q.correctAnswer.trim();
      const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
      const isCorrect = userAns.toLowerCase() === target.toLowerCase() || acceptable.includes(userAns.toLowerCase());

      if (!typeStats[q.type]) {
        typeStats[q.type] = { correct: 0, total: 0 };
      }
      typeStats[q.type].total += 1;

      if (isCorrect) {
        rawScore += 1;
        passageScores[pIdx].score += 1;
        typeStats[q.type].correct += 1;
      } else {
        incorrects.push(q.number);
        mistakes.push({
          questionNumber: q.number,
          type: q.type,
          userAnswer: userAns || '(chưa trả lời)',
          correctAnswer: target,
          paraphraseNote: q.passageParaphrase
        });
      }
    });

    // Record complete attempt to IndexedDB
    recordAttempt({
      id: `full-reading-${Date.now()}`,
      skill: 'reading',
      sectionId: fullTest.id,
      sectionTitle: fullTest.title,
      date: new Date().toISOString(),
      score: rawScore,
      total: 40,
      durationSeconds: 3600 - secondsLeft,
      mode: 'simulation',
      userAnswers: fullTestAnswers,
      incorrectQuestionNumbers: incorrects,
      mistakeTags: mistakes,
      passageScores,
      questionTypeStats: typeStats
    });
  };

  const handleResetFullTest = () => {
    setFullTestAnswers({});
    setFlaggedQuestions({});
    setSecondsLeft(60 * 60);
    setIsTimerRunning(false);
    setIsTestSubmitted(false);
    setActivePassageIndex(0);
  };

  // Compute Full Test summary metrics if submitted
  const fullTestRawScore = isTestSubmitted
    ? allFullTestQuestions.filter(({ question: q }) => {
        const userAns = (fullTestAnswers[q.id] || '').trim().toLowerCase();
        const target = q.correctAnswer.trim().toLowerCase();
        const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
        return userAns === target || acceptable.includes(userAns);
      }).length
    : 0;

  const estimatedBandScore = calculateReadingBand(fullTestRawScore, 'academic');

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                IELTS ACADEMIC READING STUDIO
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">Bản Quyền Học Thuật Minh Bạch</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Luyện Đọc & Phân Tích Dẫn Chứng Paraphrase
            </h1>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveMode('practice')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'practice'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Luyện Theo Dạng Bài (Practice by Type)
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('full-test')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'full-test'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>2. Thi Thử Chuẩn (Full Test 40 Câu)</span>
            </button>
          </div>
        </div>

        {/* Practice Mode: 14 Question Types Pills */}
        {activeMode === 'practice' && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase font-mono block">
              CHỌN DẠNG CÂU HỎI CẦN LUYỆN TẬP CHUYÊN SÂU:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
              {(Object.keys(QUESTION_TYPE_LABELS) as ReadingQuestionType[]).map(typeKey => (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setSelectedQuestionType(typeKey)}
                  className={`px-3 py-1 rounded text-xs whitespace-nowrap transition-colors cursor-pointer border ${
                    selectedQuestionType === typeKey
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                  }`}
                >
                  {QUESTION_TYPE_LABELS[typeKey]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. PRACTICE MODE VIEW                                                     */}
      {/* ========================================================================= */}
      {activeMode === 'practice' && (
        <div className="space-y-6">
          {/* Header of selected drill set */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-mono text-[10px] font-semibold">
                Dạng: {QUESTION_TYPE_LABELS[activePracticeSet.questionType]}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{activePracticeSet.title}</h2>
              <p className="text-xs text-slate-500">Chủ đề: {activePracticeSet.topic} • Độ khó: {activePracticeSet.difficulty}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setPracticeAnswers({}); setPracticeSubmitted(false); }}
                className="px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </button>
            </div>
          </div>

          {/* 55/45 Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Passage Content (55%) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-h-[750px] overflow-y-auto space-y-4 font-serif text-slate-800 leading-relaxed text-sm">
              <h3 className="font-sans font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                {activePracticeSet.passageTitle}
              </h3>
              {activePracticeSet.content.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="font-sans font-bold text-xs text-slate-400 block font-mono">[{sec.label}]</span>
                  <p>{sec.text}</p>
                </div>
              ))}
            </div>

            {/* Right Column: Questions & Paraphrase Analysis (45%) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5 max-h-[750px] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                  BÀI TẬP ({activePracticeSet.questions.length} CÂU HỎI)
                </span>
                {practiceSubmitted && (
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    Đã nộp bài & Hiện giải thích
                  </span>
                )}
              </div>

              {/* Question List */}
              <div className="space-y-5">
                {activePracticeSet.questions.map(q => {
                  const userVal = (practiceAnswers[q.id] || '').trim();
                  const target = q.correctAnswer.trim();
                  const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
                  const isCorrect = userVal.toLowerCase() === target.toLowerCase() || acceptable.includes(userVal.toLowerCase());

                  return (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          Câu {q.number}. {q.prompt}
                        </span>
                        {practiceSubmitted && (
                          isCorrect ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] shrink-0">
                              ĐÚNG ✓
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px] shrink-0">
                              SAI ✗
                            </span>
                          )
                        )}
                      </div>

                      {/* Options if available */}
                      {q.options && q.options.length > 0 && (
                        <div className="space-y-1.5">
                          {q.options.map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={userVal === opt || userVal === opt[0]}
                                onChange={(e) => handlePracticeAnswerChange(q.id, e.target.value)}
                                disabled={practiceSubmitted}
                                className="text-slate-900 focus:ring-slate-900"
                              />
                              <span className="text-slate-800">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Text Input for completion / short answer */}
                      {(!q.options || q.options.length === 0) && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => handlePracticeAnswerChange(q.id, e.target.value)}
                            placeholder="Điền đáp án của bạn..."
                            disabled={practiceSubmitted}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-sans"
                          />
                        </div>
                      )}

                      {/* ======================================================= */}
                      {/* CRITICAL: POST-SUBMIT PARAPHRASE & EVIDENCE BREAKDOWN   */}
                      {/* ======================================================= */}
                      {practiceSubmitted && (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs">
                          {/* Answer comparison */}
                          <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span>Bạn trả lời: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userVal || '(chưa điền)'}</strong></span>
                              <span>Đáp án đúng: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                            </div>
                            {q.acceptableAnswers && q.acceptableAnswers.length > 0 && (
                              <p className="text-[10px] text-slate-400">
                                Đáp án chấp nhận khác: {q.acceptableAnswers.join(', ')}
                              </p>
                            )}
                          </div>

                          {/* Paraphrase matching table */}
                          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1.5">
                            <span className="text-[10px] font-bold text-amber-900 uppercase font-mono tracking-wider block">
                              CẶP TỪ ĐỒNG NGHĨA (PARAPHRASE IN IELTS)
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div className="p-1.5 bg-white rounded border border-amber-100 text-amber-950">
                                <span className="text-[10px] text-slate-400 block font-sans">Từ khóa câu hỏi:</span>
                                <strong>{q.questionKeywords || q.prompt}</strong>
                              </div>
                              <div className="p-1.5 bg-white rounded border border-amber-100 text-amber-950">
                                <span className="text-[10px] text-slate-400 block font-sans">Từ tương đương bài đọc:</span>
                                <strong>{q.passageParaphrase || 'Xem dẫn chứng'}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Evidence snippet */}
                          {q.evidenceSnippet && (
                            <div className="p-2.5 bg-slate-100 rounded text-[11px] text-slate-800">
                              <span className="font-bold text-slate-700 block font-mono text-[10px] uppercase">
                                Câu dẫn chứng trong bài ({q.paragraphReference}):
                              </span>
                              <p className="italic font-serif mt-0.5">"{q.evidenceSnippet}"</p>
                            </div>
                          )}

                          {/* Vietnamese explanation */}
                          <div className="p-2.5 bg-emerald-50 rounded border border-emerald-100 text-[11px] text-emerald-950">
                            <strong>Giải thích tiếng Việt:</strong> {q.explanationVi || q.explanation}
                          </div>

                          {/* Target vocab: Add to Vocabulary SRS */}
                          {q.targetVocab && q.targetVocab.length > 0 && (
                            <div className="pt-1 flex flex-wrap items-center gap-2">
                              {q.targetVocab.map(tv => (
                                <button
                                  key={tv.word}
                                  type="button"
                                  onClick={() => handleAddWordToVocab(tv.word, tv.definitionVi, tv.contextSentence)}
                                  disabled={!!addedVocabWords[tv.word]}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-[11px] font-semibold text-slate-800 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                                >
                                  {addedVocabWords[tv.word] ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Đã thêm: "{tv.word}"</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3 text-slate-500" />
                                      <span>Lưu từ "{tv.word}" ({tv.definitionVi}) vào SRS</span>
                                    </>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit button */}
              {!practiceSubmitted && (
                <button
                  type="button"
                  onClick={handlePracticeSubmit}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Nộp bài & Phân tích Paraphrase
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FULL TEST MODE VIEW (60 MINUTES / 40 QUESTIONS)                       */}
      {/* ========================================================================= */}
      {activeMode === 'full-test' && (
        <div className="space-y-6">
          {/* Top Control Bar: Timer, Passage Selector, Finish button */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 shadow-xs">
            <div className="flex items-center gap-3">
              {/* Timer Display */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-sm font-bold border ${
                secondsLeft < 300
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-slate-100 text-slate-900 border-slate-200'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(secondsLeft)}</span>
              </div>

              {!isTimerRunning && !isTestSubmitted && (
                <button
                  type="button"
                  onClick={startFullTest}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Bắt đầu tính giờ 60p
                </button>
              )}

              {isTimerRunning && !isTestSubmitted && (
                <span className="text-xs text-slate-500 font-mono">Đang làm bài thi thử...</span>
              )}
            </div>

            {/* Passage 1 / 2 / 3 Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
              {fullTest.passages.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePassageIndex(idx)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    activePassageIndex === idx
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Passage {idx + 1}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {!isTestSubmitted ? (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Nộp bài thi (Finish Test)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetFullTest}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại đề này</span>
                </button>
              )}
            </div>
          </div>

          {/* Test Results Summary Banner (Only shown if submitted) */}
          {isTestSubmitted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600 text-white rounded-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase font-mono">
                      KẾT QUẢ THI THỬ ACADEMIC READING
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Điểm thô: {fullTestRawScore} / 40 • Ước tính: Band {estimatedBandScore.toFixed(1)}
                    </h2>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-mono text-right">
                  Thời gian làm: {formatTime(3600 - secondsLeft)} / 60:00
                </div>
              </div>

              {/* Breakdown by Passage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-200 text-xs">
                {fullTest.passages.map((p, idx) => {
                  const pQuestions = p.questions;
                  const pCorrect = pQuestions.filter(q => {
                    const ans = (fullTestAnswers[q.id] || '').trim().toLowerCase();
                    return ans === q.correctAnswer.toLowerCase() || (q.acceptableAnswers || []).map(a => a.toLowerCase()).includes(ans);
                  }).length;
                  return (
                    <div key={p.id} className="p-3 bg-white rounded border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Passage {idx + 1}: {p.title.split(':')[0]}</span>
                      <strong className="text-base font-bold text-slate-900 font-mono">
                        {pCorrect} / {pQuestions.length} câu đúng
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Test 55/45 Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Passage Content (55%) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-h-[800px] overflow-y-auto space-y-4 font-serif text-slate-800 leading-relaxed text-sm">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  READING PASSAGE {activePassageIndex + 1}
                </span>
                <h3 className="font-sans font-bold text-lg text-slate-900 mt-1">{currentPassage.title}</h3>
                {currentPassage.subtitle && <p className="text-xs text-slate-500 font-sans mt-0.5">{currentPassage.subtitle}</p>}
              </div>

              {currentPassage.content.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="font-sans font-bold text-xs text-slate-400 block font-mono">[{sec.label}]</span>
                  <p>{sec.text}</p>
                </div>
              ))}
            </div>

            {/* Right: Questions for Active Passage (45%) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5 max-h-[800px] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                  CÂU HỎI PASSAGE {activePassageIndex + 1} ({currentPassage.questions.length} CÂU)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Q{currentPassage.questions[0].number} – Q{currentPassage.questions[currentPassage.questions.length - 1].number}
                </span>
              </div>

              {/* Questions */}
              <div className="space-y-5">
                {currentPassage.questions.map(q => {
                  const userVal = (fullTestAnswers[q.id] || '').trim();
                  const target = q.correctAnswer.trim();
                  const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
                  const isCorrect = userVal.toLowerCase() === target.toLowerCase() || acceptable.includes(userVal.toLowerCase());
                  const isFlagged = !!flaggedQuestions[q.number];

                  return (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          Câu {q.number}. {q.prompt}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleFlagQuestion(q.number)}
                            className={`p-1 rounded cursor-pointer ${
                              isFlagged ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Gắn cờ xem lại"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                          {isTestSubmitted && (
                            isCorrect ? (
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Đúng ✓</span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">Sai ✗</span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Options if Multiple Choice / Headings */}
                      {q.options && q.options.length > 0 && (
                        <div className="space-y-1.5">
                          {q.options.map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={userVal === opt || userVal === opt[0]}
                                onChange={(e) => handleFullTestAnswerChange(q.id, e.target.value)}
                                disabled={isTestSubmitted}
                                className="text-slate-900 focus:ring-slate-900"
                              />
                              <span className="text-slate-800">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Text Input */}
                      {(!q.options || q.options.length === 0) && (
                        <div>
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => handleFullTestAnswerChange(q.id, e.target.value)}
                            placeholder="Nhập đáp án..."
                            disabled={isTestSubmitted}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs font-sans focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                          />
                        </div>
                      )}

                      {/* If test submitted, show full Paraphrase explanation */}
                      {isTestSubmitted && (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs">
                          <div className="p-2 bg-white rounded border border-slate-200 flex justify-between text-[11px]">
                            <span>Bạn chọn: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userVal || '(chưa điền)'}</strong></span>
                            <span>Đáp án đúng: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                          </div>

                          <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-xs space-y-1 font-mono">
                            <span className="text-[10px] text-amber-800 uppercase font-sans font-bold block">
                              Paraphrase đối ứng:
                            </span>
                            <p className="text-amber-950 font-bold">
                              {q.questionKeywords || q.prompt} ≈ {q.passageParaphrase || 'Xem bài đọc'}
                            </p>
                          </div>

                          <p className="text-slate-700 text-[11px]">
                            <strong>Giải thích:</strong> {q.explanationVi || q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Fixed Q1-Q40 Question Navigator Palette */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 font-mono">BẢNG ĐIỀU HƯỚNG CÂU HỎI Q1 – Q40</span>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-900"></span> Đã điền</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-200"></span> Chưa điền</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Gắn cờ</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {allFullTestQuestions.map(({ question: q, passageIndex: pIdx }) => {
                const hasAnswer = !!(fullTestAnswers[q.id] || '').trim();
                const isFlagged = !!flaggedQuestions[q.number];
                const isCurrentPassage = pIdx === activePassageIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setActivePassageIndex(pIdx)}
                    className={`w-7 h-7 rounded text-[11px] font-mono font-bold flex items-center justify-center cursor-pointer transition-colors border ${
                      isFlagged
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : hasAnswer
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    } ${isCurrentPassage ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                  >
                    {q.number}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Xác Nhận Nộp Bài Thi Reading</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn đã trả lời {Object.keys(fullTestAnswers).filter(k => (fullTestAnswers[k] || '').trim() !== '').length} / 40 câu hỏi.
              Thời gian còn lại: <strong>{formatTime(secondsLeft)}</strong>. Bạn có chắc chắn muốn nộp bài để xem phân tích đáp án và quy đổi Band điểm?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSubmitConfirmModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer"
              >
                Quay lại làm tiếp
              </button>
              <button
                type="button"
                onClick={handleFinalSubmitFullTest}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded cursor-pointer"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
