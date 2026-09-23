import React, { useState, useEffect } from 'react';
import { READING_FULL_TESTS, READING_PASSAGES, READING_FOUNDATION_SETS } from '../data/readingData';
import { READING_PRACTICE_SETS } from '../data/readingPracticeData';
import { READING_QUESTION_GROUPS, READING_STRATEGY_LESSONS } from '../data/readingStrategyData';
import { ReadingQuestionType, ReadingQuestion, TestAttempt, ReadingQuestionGroup } from '../types';
import { recordAttempt, addWordToVocabDeck } from '../utils/db';
import { calculateReadingBand, formatTime } from '../utils/ieltsScoring';
import { WordCapturePopover } from './WordCapturePopover';

interface ReadingViewProps {
  examMode?: 'study' | 'simulation';
}

const QUESTION_TYPE_LABELS: Record<ReadingQuestionType, { label: string; group: ReadingQuestionGroup }> = {
  'true-false-notgiven': { label: 'True / False / Not Given', group: 'statements' },
  'yes-no-notgiven': { label: 'Yes / No / Not Given', group: 'statements' },
  'matching-headings': { label: 'Matching Headings', group: 'matching' },
  'matching-information': { label: 'Matching Information', group: 'matching' },
  'matching-features': { label: 'Matching Features', group: 'matching' },
  'matching-sentence-endings': { label: 'Matching Sentence Endings', group: 'matching' },
  'multiple-choice': { label: 'Multiple Choice', group: 'questions' },
  'sentence-completion': { label: 'Sentence Completion', group: 'completion' },
  'summary-completion': { label: 'Summary Completion', group: 'completion' },
  'note-completion': { label: 'Note Completion', group: 'completion' },
  'table-completion': { label: 'Table Completion', group: 'completion' },
  'flowchart-completion': { label: 'Flow-chart Completion', group: 'completion' },
  'diagram-label-completion': { label: 'Diagram Label Completion', group: 'completion' },
  'short-answer': { label: 'Short Answer', group: 'questions' }
};

export const ReadingView: React.FC<ReadingViewProps> = () => {
  // 4 Primary Modes
  const [activeTab, setActiveTab] = useState<'by-type' | 'foundation' | 'by-passage' | 'full-test'>('by-type');

  // FOUNDATION SETS STATE
  const [selectedFoundationId, setSelectedFoundationId] = useState<string>(READING_FOUNDATION_SETS[0].id);
  const [foundationAnswers, setFoundationAnswers] = useState<Record<string, string>>({});
  const [foundationSubmitted, setFoundationSubmitted] = useState<boolean>(false);
  const activeFoundationSet = READING_FOUNDATION_SETS.find(f => f.id === selectedFoundationId) || READING_FOUNDATION_SETS[0];

  // MODE 1: BY TYPE STATES
  const [selectedGroup, setSelectedGroup] = useState<ReadingQuestionGroup>('statements');
  const [selectedQuestionType, setSelectedQuestionType] = useState<ReadingQuestionType>('true-false-notgiven');
  const [typeSubTab, setTypeSubTab] = useState<'strategy' | 'drill'>('strategy');

  // Mini practice in strategy lesson
  const [miniAnswers, setMiniAnswers] = useState<Record<string, string>>({});
  const [miniSubmitted, setMiniSubmitted] = useState<boolean>(false);

  // Drill practice set
  const activePracticeSet = READING_PRACTICE_SETS.find(s => s.questionType === selectedQuestionType) || READING_PRACTICE_SETS[0];
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState<boolean>(false);
  const [mistakeReasons, setMistakeReasons] = useState<Record<string, string>>({});
  const [addedVocabWords, setAddedVocabWords] = useState<Record<string, boolean>>({});

  // MODE 2: BY PASSAGE STATES
  const [selectedPassageId, setSelectedPassageId] = useState<string>(READING_PASSAGES[0].id);
  const activePassage = READING_PASSAGES.find(p => p.id === selectedPassageId) || READING_PASSAGES[0];
  const [passageAnswers, setPassageAnswers] = useState<Record<string, string>>({});
  const [passageSubmitted, setPassageSubmitted] = useState<boolean>(false);

  // MODE 3: FULL TEST STATES
  const fullTest = READING_FULL_TESTS[0];
  const [activePassageIndex, setActivePassageIndex] = useState<number>(0);
  const [fullTestAnswers, setFullTestAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(60 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);

  // Active Strategy Lesson
  const currentStrategyLesson = READING_STRATEGY_LESSONS.find(l => l.type === selectedQuestionType) || READING_STRATEGY_LESSONS[0];

  // Full Test timer
  useEffect(() => {
    let interval: any = null;
    if (activeTab === 'full-test' && isTimerRunning && !isTestSubmitted && secondsLeft > 0) {
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
  }, [activeTab, isTimerRunning, isTestSubmitted, secondsLeft]);

  // Reset drill when question type changes
  useEffect(() => {
    setPracticeAnswers({});
    setPracticeSubmitted(false);
    setMiniAnswers({});
    setMiniSubmitted(false);
  }, [selectedQuestionType]);

  const allFullTestQuestions = fullTest.passages.flatMap((p, pIdx) =>
    p.questions.map(q => ({ question: q, passageIndex: pIdx }))
  );

  // Handlers for Drill Practice
  const handlePracticeAnswerChange = (qId: string, val: string) => {
    setPracticeAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handlePracticeSubmit = () => {
    setPracticeSubmitted(true);
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

  // Handlers for Passage Practice
  const handlePassageSubmit = () => {
    setPassageSubmitted(true);
  };

  // Full Test Submit
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

      if (!typeStats[q.type]) typeStats[q.type] = { correct: 0, total: 0 };
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

  const handleAddWord = async (word: string, defVi: string, sentence: string) => {
    const res = await addWordToVocabDeck({
      word,
      definitionVi: defVi,
      sourceContext: sentence,
      source: 'Reading Notebook'
    });
    if (res.success) {
      setAddedVocabWords(prev => ({ ...prev, [word]: true }));
    }
  };

  // Full Test Raw Score & Band
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
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header & 3 Primary Sub-tabs */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              IELTS Academic Reading • Sổ tay luyện đọc & Dẫn chứng
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Chiến Lược & Luyện Đọc IELTS
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Tập trung vào 4 nhóm dạng câu hỏi, bẻ khóa từ đồng nghĩa (paraphrase) và định vị dẫn chứng chính xác trong bài đọc.
            </p>
          </div>

          {/* Primary 4 Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('by-type')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'by-type'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. 14 Dạng bài
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('foundation')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'foundation'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Nền tảng 4.0 (Mini Sets)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('by-passage')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'by-passage'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Luyện Passage
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('full-test')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'full-test'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. Mock Test (40 câu)
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HỌC THEO DẠNG BÀI (DEFAULT)                                            */}
      {/* ========================================================================= */}
      {activeTab === 'by-type' && (
        <div className="space-y-6">
          {/* 4 Group Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {READING_QUESTION_GROUPS.map(group => {
              const isSelected = selectedGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setSelectedGroup(group.id);
                    // Select first question type belonging to this group
                    const firstType = (Object.keys(QUESTION_TYPE_LABELS) as ReadingQuestionType[]).find(
                      t => QUESTION_TYPE_LABELS[t].group === group.id
                    );
                    if (firstType) setSelectedQuestionType(firstType);
                  }}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-xs">{group.label}</div>
                  <div className={`text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {group.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sub-types pills within selected group */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(Object.keys(QUESTION_TYPE_LABELS) as ReadingQuestionType[])
              .filter(t => QUESTION_TYPE_LABELS[t].group === selectedGroup)
              .map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedQuestionType(t)}
                  className={`px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer border transition-colors ${
                    selectedQuestionType === t
                      ? 'bg-blue-900 text-white border-blue-900 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {QUESTION_TYPE_LABELS[t].label}
                </button>
              ))}
          </div>

          {/* Switcher: Chiến lược 7 phần vs Luyện tập Passage */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setTypeSubTab('strategy')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer border ${
                typeSubTab === 'strategy'
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Chiến lược & Bài học 7 phần
            </button>
            <button
              type="button"
              onClick={() => setTypeSubTab('drill')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer border ${
                typeSubTab === 'drill'
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Luyện tập thực chiến ({activePracticeSet.questions.length} câu)
            </button>
          </div>

          {/* SUBTAB 1: STRATEGY MICRO-LESSON (7 PARTS) */}
          {typeSubTab === 'strategy' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
              <div>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-mono text-xs font-bold">
                  {QUESTION_TYPE_LABELS[selectedQuestionType].label}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {currentStrategyLesson.title}
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  {currentStrategyLesson.subtitle}
                </p>
              </div>

              {/* OFFICIAL FORMAT */}
              {currentStrategyLesson.officialFormat && (
                <div className="p-4 bg-slate-900 text-white rounded-lg text-xs space-y-1.5 shadow-xs">
                  <div className="font-bold uppercase tracking-wider text-amber-400 font-mono text-[11px] flex items-center gap-1.5">
                    <span>📋</span>
                    <span>OFFICIAL FORMAT (Quy Định & Định Dạng Chính Thức IELTS)</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans text-xs">{currentStrategyLesson.officialFormat}</p>
                </div>
              )}

              {/* RECOMMENDED STRATEGY */}
              {currentStrategyLesson.recommendedStrategy && currentStrategyLesson.recommendedStrategy.length > 0 && (
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-lg text-xs space-y-2">
                  <div className="font-bold text-blue-900 uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5">
                    <span>💡</span>
                    <span>RECOMMENDED STRATEGY (Chiến Lược Gợi Ý — Thử nghiệm xem phù hợp bản thân)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-800">
                    {currentStrategyLesson.recommendedStrategy.map((rec, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold shrink-0">•</span>
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 1. Cần nhớ trong 30s */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  1. Cần nhớ trong 30 giây
                </h3>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-sm text-slate-800 space-y-1.5">
                  {currentStrategyLesson.rememberIn30Sec.map((line, idx) => (
                    <div key={idx} className="leading-relaxed">• {line}</div>
                  ))}
                </div>
              </div>

              {/* 2. Các bước làm bài */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  2. Quy trình 4 bước làm bài chuẩn
                </h3>
                <div className="space-y-2">
                  {currentStrategyLesson.steps.map((st, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded text-sm text-slate-800">
                      {st}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Cặp Paraphrase hay gặp */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  3. Bảng đối chiếu Paraphrase kinh điển
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {currentStrategyLesson.keywordsParaphrase.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                      <div className="text-slate-500 font-mono text-[11px]">Đề bài:</div>
                      <div className="font-semibold text-slate-900">"{item.question}"</div>
                      <div className="text-slate-500 font-mono text-[11px] pt-1">Bài đọc:</div>
                      <div className="font-semibold text-blue-900">"{item.passage}"</div>
                      <div className="text-[11px] text-slate-600 pt-1 italic">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Bẫy thường gặp & Cách xử lý */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  4. Các bẫy IELTS giăng ra & Cách né
                </h3>
                <div className="space-y-2">
                  {currentStrategyLesson.commonTraps.map((tr, idx) => (
                    <div key={idx} className="p-3.5 bg-rose-50/70 border border-rose-200 rounded text-xs space-y-2">
                      <div className="font-bold text-rose-900 text-sm">⚠ {tr.trap}</div>
                      <div className="text-slate-700 bg-white p-2 rounded border border-rose-100">
                        {tr.example}
                      </div>
                      <div className="text-emerald-900 font-medium">
                        <strong>Cách xử lý:</strong> {tr.fix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Ví dụ đối chiếu thực tế */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  5. Ví dụ thực tế có phân tích dẫn chứng
                </h3>
                <div className="space-y-3">
                  {currentStrategyLesson.examples.map((ex, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                      <div>
                        <span className="font-semibold text-slate-500 font-mono text-[11px]">Câu hỏi: </span>
                        <span className="text-slate-900 font-medium">{ex.question}</span>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200 rounded text-slate-800 italic font-serif">
                        "{ex.passage}"
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                          Đáp án: {ex.answer}
                        </span>
                        <span className="text-slate-600">{ex.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Mini Practice vận dụng 3 câu */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                    6. Mini Practice kiểm tra hiểu bài (3 câu)
                  </h3>
                  {miniSubmitted && (
                    <span className="text-xs font-bold text-emerald-700">Đã nộp bài</span>
                  )}
                </div>

                {/* Short mini passage */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded font-serif text-sm text-slate-800 leading-relaxed">
                  <div className="font-sans text-xs font-bold text-slate-500 mb-1">Đoạn văn ngắn:</div>
                  "{currentStrategyLesson.miniPractice.passage}"
                </div>

                {/* Mini questions */}
                <div className="space-y-3">
                  {currentStrategyLesson.miniPractice.questions.map(mq => {
                    const userVal = miniAnswers[mq.id] || '';
                    const isCorrect = userVal.toLowerCase() === mq.correctAnswer.toLowerCase();

                    return (
                      <div key={mq.id} className="p-3 bg-white border border-slate-200 rounded text-xs space-y-2">
                        <div className="font-medium text-slate-900">{mq.prompt}</div>

                        {mq.options && (
                          <div className="flex flex-wrap items-center gap-3">
                            {mq.options.map(opt => (
                              <label key={opt} className="flex items-center gap-1.5 cursor-pointer text-slate-800">
                                <input
                                  type="radio"
                                  name={mq.id}
                                  value={opt}
                                  checked={userVal === opt}
                                  onChange={(e) => setMiniAnswers(prev => ({ ...prev, [mq.id]: e.target.value }))}
                                  disabled={miniSubmitted}
                                  className="text-slate-900"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {miniSubmitted && (
                          <div className={`p-2.5 rounded border text-xs ${
                            isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                          }`}>
                            <div className="font-bold">
                              {isCorrect ? '✓ Đúng' : `✗ Sai. Đáp án: ${mq.correctAnswer}`}
                            </div>
                            <p className="mt-1 text-[11px] text-slate-700">{mq.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!miniSubmitted ? (
                  <button
                    type="button"
                    onClick={() => setMiniSubmitted(true)}
                    className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer hover:bg-slate-800"
                  >
                    Kiểm tra đáp án Mini Practice
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setMiniAnswers({}); setMiniSubmitted(false); }}
                    className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-700 cursor-pointer"
                  >
                    Làm lại Mini Practice
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SUBTAB 2: DRILL PRACTICE SET (55/45 SPLIT) */}
          {typeSubTab === 'drill' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Passage (55%) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 max-h-[750px] overflow-y-auto space-y-4 font-serif text-slate-800 leading-relaxed text-sm">
                <div className="font-sans border-b border-slate-100 pb-2">
                  <span className="text-[11px] text-slate-500 font-mono">Dạng: {QUESTION_TYPE_LABELS[activePracticeSet.questionType].label}</span>
                  <h3 className="font-bold text-base text-slate-900">{activePracticeSet.passageTitle}</h3>
                </div>
                {activePracticeSet.content.map((sec, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="font-sans font-bold text-xs text-slate-400 block font-mono">[{sec.label}]</span>
                    <p>{sec.text}</p>
                  </div>
                ))}
              </div>

              {/* Questions & Paraphrase Breakdown (45%) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 space-y-4 max-h-[750px] overflow-y-auto">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                    Bài tập ({activePracticeSet.questions.length} câu)
                  </span>
                  {practiceSubmitted && (
                    <span className="text-xs font-bold text-emerald-700">Đã nộp bài</span>
                  )}
                </div>

                <div className="space-y-4">
                  {activePracticeSet.questions.map(q => {
                    const userVal = (practiceAnswers[q.id] || '').trim();
                    const target = q.correctAnswer.trim();
                    const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
                    const isCorrect = userVal.toLowerCase() === target.toLowerCase() || acceptable.includes(userVal.toLowerCase());

                    return (
                      <div key={q.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            Câu {q.number}. {q.prompt}
                          </span>
                          {practiceSubmitted && (
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] shrink-0 ${
                              isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isCorrect ? 'ĐÚNG ✓' : 'SAI ✗'}
                            </span>
                          )}
                        </div>

                        {/* Options if available */}
                        {q.options && q.options.length > 0 && (
                          <div className="space-y-1.5">
                            {q.options.map(opt => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer text-slate-800">
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt}
                                  checked={userVal === opt || userVal === opt[0]}
                                  onChange={(e) => handlePracticeAnswerChange(q.id, e.target.value)}
                                  disabled={practiceSubmitted}
                                  className="text-slate-900"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {(!q.options || q.options.length === 0) && (
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => handlePracticeAnswerChange(q.id, e.target.value)}
                            placeholder="Điền đáp án..."
                            disabled={practiceSubmitted}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-hidden focus:border-slate-500 font-sans"
                          />
                        )}

                        {/* POST SUBMIT PARAPHRASE & EVIDENCE BREAKDOWN */}
                        {practiceSubmitted && (
                          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs">
                            <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span>Bạn điền: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userVal || '(chưa điền)'}</strong></span>
                                <span>Đáp án đúng: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                              </div>
                            </div>

                            {/* Paraphrase Box */}
                            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded space-y-1.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase font-mono">
                                Cặp Paraphrase trong bài:
                              </div>
                              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                                <div className="p-1.5 bg-white rounded border border-amber-100">
                                  <div className="text-[10px] text-slate-400 font-sans">Từ khóa câu hỏi:</div>
                                  <strong>{q.questionKeywords || q.prompt}</strong>
                                </div>
                                <div className="p-1.5 bg-white rounded border border-amber-100">
                                  <div className="text-[10px] text-slate-400 font-sans">Từ tương đương bài đọc:</div>
                                  <strong>{q.passageParaphrase || 'Xem dẫn chứng'}</strong>
                                </div>
                              </div>
                            </div>

                            {/* Evidence Snippet */}
                            {q.evidenceSnippet && (
                              <div className="p-2.5 bg-slate-100 rounded text-[11px] text-slate-800">
                                <span className="font-bold text-slate-700 font-mono text-[10px] uppercase block">
                                  Dẫn chứng trong đoạn ({q.paragraphReference}):
                                </span>
                                <p className="italic font-serif mt-0.5">"{q.evidenceSnippet}"</p>
                              </div>
                            )}

                            {/* Vietnamese Explanation */}
                            <div className="p-2.5 bg-emerald-50 rounded border border-emerald-100 text-[11px] text-emerald-950">
                              <strong>Giải thích:</strong> {q.explanationVi || q.explanation}
                            </div>

                            {/* Self-Reflection: Why did you make a mistake? */}
                            {!isCorrect && (
                              <div className="p-2 bg-slate-100 rounded text-[11px] space-y-1">
                                <span className="font-semibold text-slate-700">Nguyên nhân sai:</span>
                                <select
                                  value={mistakeReasons[q.id] || ''}
                                  onChange={(e) => setMistakeReasons(prev => ({ ...prev, [q.id]: e.target.value }))}
                                  className="w-full p-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
                                >
                                  <option value="">-- Chọn lý do sai để lưu sổ tay --</option>
                                  <option value="missed_paraphrase">Bỏ sót / Không nhận ra paraphrase</option>
                                  <option value="misread_keywords">Nhìn nhầm từ khóa / Đọc lướt quá ẩu</option>
                                  <option value="over_inferred">Tự suy đoán / Suy luận ngoài bài</option>
                                  <option value="negative_trap">Mắc bẫy từ phủ định / giới hạn (all, only)</option>
                                  <option value="time_pressure">Hết giờ / Không kịp tìm dẫn chứng</option>
                                </select>
                              </div>
                            )}

                            {/* Save vocab */}
                            {q.targetVocab && q.targetVocab.length > 0 && (
                              <div className="pt-1 flex flex-wrap gap-1.5">
                                {q.targetVocab.map(tv => (
                                  <button
                                    key={tv.word}
                                    type="button"
                                    onClick={() => handleAddWord(tv.word, tv.definitionVi, tv.contextSentence)}
                                    disabled={!!addedVocabWords[tv.word]}
                                    className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-[11px] text-slate-700 cursor-pointer disabled:opacity-50"
                                  >
                                    {addedVocabWords[tv.word] ? `✓ Đã lưu "${tv.word}"` : `+ Lưu từ "${tv.word}"`}
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

                {!practiceSubmitted ? (
                  <button
                    type="button"
                    onClick={handlePracticeSubmit}
                    className="w-full py-2.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Nộp bài & Phân tích Paraphrase
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setPracticeAnswers({}); setPracticeSubmitted(false); }}
                    className="w-full py-2 bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    Làm lại bài luyện tập này
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BỘ ĐỀ NỀN TẢNG BAND 4.0 (FOUNDATION MINI-SETS)                          */}
      {/* ========================================================================= */}
      {activeTab === 'foundation' && (
        <div className="space-y-6">
          {/* Foundation Set Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {READING_FOUNDATION_SETS.map((fSet, idx) => (
              <button
                key={fSet.id}
                type="button"
                onClick={() => {
                  setSelectedFoundationId(fSet.id);
                  setFoundationAnswers({});
                  setFoundationSubmitted(false);
                }}
                className={`px-3 py-2 rounded text-xs text-left shrink-0 border cursor-pointer ${
                  selectedFoundationId === fSet.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>Mini Set {idx + 1}: {fSet.title.split(': ')[1] || fSet.title}</div>
                <div className="text-[11px] opacity-75">{fSet.topic} • {fSet.wordCount} words • {fSet.questions.length} câu</div>
              </button>
            ))}
          </div>

          {/* Foundation Notice Banner */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-lg text-xs flex items-start gap-2.5">
            <span className="text-base shrink-0">🎯</span>
            <div>
              <div className="font-bold text-amber-950">
                {activeFoundationSet.sourceNotice} — Kỹ năng mục tiêu: {activeFoundationSet.targetSkill}
              </div>
              <p className="text-amber-900/90 mt-0.5 leading-relaxed">
                Được biên soạn ngắn gọn ({activeFoundationSet.wordCount} từ) giúp học viên band ~4.0 làm quen với kỹ năng định vị từ khóa và đọc hiểu có trọng tâm mà không bị ngợp. Bôi đen bất kỳ từ mới nào trong bài đọc để tra cứu và lưu từ tức thì.
              </p>
            </div>
          </div>

          {/* 2-Column Study Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Foundation Passage */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                  Target Band: {activeFoundationSet.targetBand} • {activeFoundationSet.wordCount} words
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {activeFoundationSet.title}
                </h2>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100 font-serif leading-relaxed text-slate-900 text-sm">
                {activeFoundationSet.passage.map((para, pIdx) => (
                  <div key={pIdx} className="space-y-1">
                    {para.label && (
                      <span className="font-sans font-bold text-xs text-slate-500 font-mono block">
                        {para.label}
                      </span>
                    )}
                    <p className="text-justify leading-7">{para.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive Questions */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Câu hỏi luyện tập ({activeFoundationSet.questions.length} câu)
                </h3>
                {foundationSubmitted && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Đã nộp bài
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {activeFoundationSet.questions.map((q, idx) => {
                  const userVal = (foundationAnswers[q.id] || '').trim();
                  const isCorrect = userVal.toLowerCase() === q.correctAnswer.toLowerCase() ||
                    (q.acceptableAnswers || []).some(a => a.toLowerCase() === userVal.toLowerCase());

                  return (
                    <div key={q.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-2.5">
                      <div className="font-semibold text-slate-900 text-xs leading-relaxed">
                        Câu {idx + 1}. {q.prompt}
                      </div>

                      {/* Options */}
                      {q.options && q.options.length > 0 ? (
                        <div className="space-y-1.5">
                          {q.options.map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-slate-800">
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={userVal === opt || (opt.includes('. ') && userVal === opt[0])}
                                onChange={(e) => setFoundationAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                disabled={foundationSubmitted}
                                className="text-slate-900"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => setFoundationAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Điền từ cần điền..."
                          disabled={foundationSubmitted}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs font-sans"
                        />
                      )}

                      {/* Feedback after submit */}
                      {foundationSubmitted && (
                        <div className={`p-2.5 rounded border text-xs space-y-1 ${
                          isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                        }`}>
                          <div className="font-bold flex items-center justify-between">
                            <span>{isCorrect ? '✓ Chính xác!' : `✗ Chưa đúng. Đáp án: ${q.correctAnswer}`}</span>
                            {q.paragraphReference && (
                              <span className="font-mono text-[10px] opacity-75">{q.paragraphReference}</span>
                            )}
                          </div>
                          <p className="text-[11px] leading-relaxed opacity-90">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!foundationSubmitted ? (
                <button
                  type="button"
                  onClick={() => setFoundationSubmitted(true)}
                  className="w-full py-2.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Kiểm tra đáp án & Dẫn chứng
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFoundationAnswers({});
                    setFoundationSubmitted(false);
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold cursor-pointer border border-slate-300"
                >
                  Làm lại bài này
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LUYỆN PASSAGE (PASSAGE LEVEL)                                         */}
      {/* ========================================================================= */}
      {activeTab === 'by-passage' && (
        <div className="space-y-6">
          {/* Passage Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {READING_PASSAGES.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPassageId(p.id);
                  setPassageAnswers({});
                  setPassageSubmitted(false);
                }}
                className={`px-3 py-2 rounded text-xs text-left shrink-0 border cursor-pointer ${
                  selectedPassageId === p.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>Passage {idx + 1}: {p.title}</div>
                <div className="text-[11px] opacity-75">{p.topic} • {p.wordCount} words</div>
              </button>
            ))}
          </div>

          {/* 55/45 Split View for Passage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 max-h-[750px] overflow-y-auto space-y-4 font-serif text-slate-800 leading-relaxed text-sm">
              <div className="font-sans border-b border-slate-100 pb-2">
                <span className="text-xs text-slate-500 font-mono">Passage {activePassage.passageNumber} • Band {activePassage.estimatedBand}</span>
                <h2 className="font-bold text-lg text-slate-900">{activePassage.title}</h2>
              </div>
              {activePassage.content.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="font-sans font-bold text-xs text-slate-400 block font-mono">[{sec.label}]</span>
                  <p>{sec.text}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 space-y-4 max-h-[750px] overflow-y-auto">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                  Câu hỏi ({activePassage.questions.length} câu)
                </span>
                {passageSubmitted && (
                  <span className="text-xs font-bold text-emerald-700">Đã nộp bài</span>
                )}
              </div>

              <div className="space-y-4">
                {activePassage.questions.map(q => {
                  const userVal = (passageAnswers[q.id] || '').trim();
                  const target = q.correctAnswer.trim();
                  const isCorrect = userVal.toLowerCase() === target.toLowerCase();

                  return (
                    <div key={q.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                      <div className="font-semibold text-slate-900">
                        Câu {q.number}. {q.prompt}
                      </div>

                      {q.options && q.options.length > 0 ? (
                        <div className="space-y-1.5">
                          {q.options.map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-slate-800">
                              <input
                                type="radio"
                                name={`passage-${q.id}`}
                                value={opt}
                                checked={userVal === opt || userVal === opt[0]}
                                onChange={(e) => setPassageAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                disabled={passageSubmitted}
                                className="text-slate-900"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => setPassageAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Điền đáp án..."
                          disabled={passageSubmitted}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-hidden"
                        />
                      )}

                      {passageSubmitted && (
                        <div className="pt-2 border-t border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span>Bạn chọn: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userVal || '(chưa điền)'}</strong></span>
                            <span>Đáp án đúng: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                          </div>
                          {q.evidenceSnippet && (
                            <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                              "{q.evidenceSnippet}"
                            </p>
                          )}
                          <p className="text-[11px] text-slate-700">{q.explanationVi || q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!passageSubmitted ? (
                <button
                  type="button"
                  onClick={handlePassageSubmit}
                  className="w-full py-2.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Nộp bài Passage
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setPassageAnswers({}); setPassageSubmitted(false); }}
                  className="w-full py-2 bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Làm lại Passage này
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. THI THỬ CHUẨN (FULL TEST 40 CÂU / 60 PHÚT)                            */}
      {/* ========================================================================= */}
      {activeTab === 'full-test' && (
        <div className="space-y-6">
          {/* Top Test Control Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 shadow-xs">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded font-mono text-sm font-bold border ${
                secondsLeft < 300
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-slate-100 text-slate-900 border-slate-200'
              }`}>
                ⏱ {formatTime(secondsLeft)}
              </div>

              {!isTimerRunning && !isTestSubmitted && (
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(true)}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                >
                  Bắt đầu tính giờ 60p
                </button>
              )}
            </div>

            {/* Passage 1 / 2 / 3 Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
              {[0, 1, 2].map(idx => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePassageIndex(idx)}
                  className={`px-3 py-1 rounded font-medium cursor-pointer ${
                    activePassageIndex === idx
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
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
                  className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Nộp bài thi
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFullTestAnswers({});
                    setFlaggedQuestions({});
                    setSecondsLeft(60 * 60);
                    setIsTimerRunning(false);
                    setIsTestSubmitted(false);
                    setActivePassageIndex(0);
                  }}
                  className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Thi lại từ đầu
                </button>
              )}
            </div>
          </div>

          {/* Test Result Banner if submitted */}
          {isTestSubmitted && (
            <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs text-slate-500 font-mono">KẾT QUẢ THI THỬ READING</div>
                  <div className="text-xl font-bold text-slate-900">
                    Đúng {fullTestRawScore} / 40 câu
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-center">
                    <div className="text-[10px] text-blue-700 uppercase font-mono">Dự phóng Band</div>
                    <div className="text-lg font-bold text-blue-900 font-mono">Band {estimatedBandScore}</div>
                  </div>
                </div>
              </div>

              {/* 40 Question Palette */}
              <div className="space-y-1">
                <div className="text-xs text-slate-500">Bảng đối chiếu 40 câu:</div>
                <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
                  {allFullTestQuestions.map(({ question: q, passageIndex: pIdx }) => {
                    const userVal = (fullTestAnswers[q.id] || '').trim().toLowerCase();
                    const target = q.correctAnswer.trim().toLowerCase();
                    const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
                    const isCorrect = userVal === target || acceptable.includes(userVal);

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActivePassageIndex(pIdx)}
                        className={`p-1.5 text-center rounded font-mono text-xs font-bold border cursor-pointer ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {q.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Active Passage in Full Test */}
          {(() => {
            const passage = fullTest.passages[activePassageIndex];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 max-h-[750px] overflow-y-auto space-y-4 font-serif text-slate-800 leading-relaxed text-sm">
                  <div className="font-sans border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-500 font-mono">Reading Passage {passage.passageNumber}</span>
                    <h2 className="font-bold text-lg text-slate-900">{passage.title}</h2>
                  </div>
                  {passage.content.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="font-sans font-bold text-xs text-slate-400 block font-mono">[{sec.label}]</span>
                      <p>{sec.text}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 space-y-4 max-h-[750px] overflow-y-auto">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                      Passage {passage.passageNumber} ({passage.questions.length} câu)
                    </span>
                  </div>

                  <div className="space-y-4">
                    {passage.questions.map(q => {
                      const userVal = (fullTestAnswers[q.id] || '').trim();
                      const target = q.correctAnswer.trim();
                      const isCorrect = userVal.toLowerCase() === target.toLowerCase();

                      return (
                        <div key={q.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900">
                              Câu {q.number}. {q.prompt}
                            </span>
                            <button
                              type="button"
                              onClick={() => setFlaggedQuestions(prev => ({ ...prev, [q.number]: !prev[q.number] }))}
                              className={`text-[11px] px-1.5 py-0.5 rounded cursor-pointer border ${
                                flaggedQuestions[q.number]
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              ⚑
                            </button>
                          </div>

                          {q.options && q.options.length > 0 ? (
                            <div className="space-y-1.5">
                              {q.options.map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer text-slate-800">
                                  <input
                                    type="radio"
                                    name={`full-${q.id}`}
                                    value={opt}
                                    checked={userVal === opt || userVal === opt[0]}
                                    onChange={(e) => setFullTestAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    disabled={isTestSubmitted}
                                    className="text-slate-900"
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={userVal}
                              onChange={(e) => setFullTestAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder="Điền đáp án..."
                              disabled={isTestSubmitted}
                              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-hidden"
                            />
                          )}

                          {isTestSubmitted && (
                            <div className="pt-2 border-t border-slate-200 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span>Bạn chọn: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userVal || '(chưa điền)'}</strong></span>
                                <span>Đáp án: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                              </div>
                              {q.evidenceSnippet && (
                                <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                                  "{q.evidenceSnippet}"
                                </p>
                              )}
                              <p className="text-[11px] text-slate-700">{q.explanationVi || q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Confirm Submit Modal */}
          {showSubmitConfirmModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg space-y-4">
                <h3 className="font-bold text-base text-slate-900">Xác nhận nộp bài Reading</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bạn đã làm{' '}
                  <strong className="font-mono text-slate-900">
                    {Object.keys(fullTestAnswers).length} / 40
                  </strong>{' '}
                  câu. Thời gian còn lại là {formatTime(secondsLeft)}. Bạn có chắc muốn nộp bài để xem điểm và phân tích paraphrase không?
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitConfirmModal(false)}
                    className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50"
                  >
                    Làm tiếp
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmitFullTest}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-bold cursor-pointer hover:bg-slate-800"
                  >
                    Nộp bài ngay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Word Capture from Reading Passages */}
      <WordCapturePopover sourceLabel="Reading Practice" sourceType="reading" />
    </div>
  );
};
