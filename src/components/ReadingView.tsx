import React, { useState, useEffect } from 'react';
import { READING_PASSAGES, READING_SOURCES } from '../data/readingData';
import { ExamMode, TestAttempt } from '../types';
import { recordAttempt } from '../utils/db';
import { Highlighter, Type, Flag, RotateCcw, Check, X, BookOpen, AlertCircle } from 'lucide-react';

interface ReadingViewProps {
  examMode?: ExamMode;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ examMode = 'study' }) => {
  // Selector states
  const [filterType, setFilterType] = useState<'academic' | 'general-training'>('academic');
  const [selectedPassageId, setSelectedPassageId] = useState<string>(READING_PASSAGES[0].id);

  // Question & exam states
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'compact' | 'normal' | 'large'>('normal');

  // Highlights state
  const [activeHighlightColor, setActiveHighlightColor] = useState<'yellow' | 'green' | 'blue'>('yellow');
  const [highlights, setHighlights] = useState<Record<string, boolean>>({});

  const availablePassages = READING_PASSAGES.filter(p => p.testType === filterType);
  const currentPassage = READING_PASSAGES.find(p => p.id === selectedPassageId) || availablePassages[0] || READING_PASSAGES[0];
  const questions = currentPassage.questions;
  const currentSource = READING_SOURCES.find(s => s.id === currentPassage.sourceId);

  // Switch selected passage when filter type changes
  useEffect(() => {
    const firstMatching = READING_PASSAGES.find(p => p.testType === filterType);
    if (firstMatching) {
      setSelectedPassageId(firstMatching.id);
    }
  }, [filterType]);

  // Reset answer states on passage change
  useEffect(() => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
  }, [selectedPassageId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    if (isSubmitted && examMode === 'simulation') return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(q => {
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const target = q.correctAnswer.trim().toLowerCase();
      const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
      if (userAns === target || acceptable.includes(userAns)) {
        correctCount += 1;
      }
    });
    return correctCount;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const incorrects: number[] = [];
    const mistakes: TestAttempt['mistakeTags'] = [];

    questions.forEach(q => {
      const userAns = (userAnswers[q.id] || '').trim();
      const target = q.correctAnswer.trim();
      const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
      const isCorrect = userAns.toLowerCase() === target.toLowerCase() || acceptable.includes(userAns.toLowerCase());

      if (!isCorrect) {
        incorrects.push(q.number);
        mistakes.push({
          questionNumber: q.number,
          type: q.type,
          userAnswer: userAns || '(chưa điền)',
          correctAnswer: target
        });
      }
    });

    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      skill: 'reading',
      sectionId: currentPassage.id,
      sectionTitle: currentPassage.title,
      date: new Date().toISOString(),
      score,
      total: questions.length,
      durationSeconds: 1200,
      mode: examMode,
      userAnswers,
      incorrectQuestionNumbers: incorrects,
      mistakeTags: mistakes
    };

    recordAttempt(attempt);
  };

  const score = calculateScore();
  const total = questions.length;

  const fontClass =
    fontSize === 'compact'
      ? 'text-xs leading-relaxed'
      : fontSize === 'large'
      ? 'text-base leading-loose'
      : 'text-sm leading-relaxed';

  return (
    <div className="space-y-4 pb-16">
      {/* Content Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
              READING LIBRARY • IELTS ACADEMIC PRIORITY
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Luyện Đọc Học Thuật 3 Passages Chuẩn Thời Lượng 60 Phút
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Category Toggle: Academic vs General Training */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded text-xs">
              <button
                type="button"
                onClick={() => setFilterType('academic')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  filterType === 'academic'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                IELTS Academic
              </button>
              <button
                type="button"
                onClick={() => setFilterType('general-training')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  filterType === 'general-training'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                General Training (Legacy)
              </button>
            </div>
          </div>
        </div>

        {/* Passage Selection Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {availablePassages.map(p => {
            const isSelected = p.id === currentPassage.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPassageId(p.id)}
                className={`px-3 py-1.5 rounded text-xs text-left transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className={`mr-1.5 px-1 rounded text-[10px] font-mono ${
                  isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  Passage {p.passageNumber}
                </span>
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* General Training Warning Badge if GT is active */}
        {currentPassage.testType === 'general-training' && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Lưu ý:</strong> Đây là bài đọc <strong>General Training</strong> từ tài liệu Cambridge 12 cá nhân. Mục tiêu chính của bạn là <strong>IELTS Academic</strong>, hãy ưu tiên tab IELTS Academic.
            </span>
          </div>
        )}
      </div>

      {/* Reading Utilities: Font Size, Highlighter */}
      <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">Cỡ chữ văn bản:</span>
          <div className="flex items-center gap-1 border border-slate-200 rounded p-0.5">
            <button
              type="button"
              onClick={() => setFontSize('compact')}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                fontSize === 'compact' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                fontSize === 'normal' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                fontSize === 'large' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'
              }`}
            >
              A+
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-mono">
          <span>{currentPassage.wordCount} từ</span>
          <span>•</span>
          <span>{questions.length} câu hỏi</span>
        </div>
      </div>

      {/* Split View: Left Passage (~55%) / Right Questions (~45%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Passage (Independent Scroll) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-h-[750px] overflow-y-auto space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-700">
                Passage {currentPassage.passageNumber}
              </span>
              <span className="text-xs text-slate-500">{currentPassage.topic}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{currentPassage.title}</h2>
            {currentPassage.subtitle && (
              <p className="text-xs text-slate-500 mt-1 italic">{currentPassage.subtitle}</p>
            )}
          </div>

          <article className={`space-y-4 font-serif-reading text-slate-800 ${fontClass}`}>
            {currentPassage.content.map(para => (
              <div key={para.label} className="flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 select-none mt-1">
                  {para.label}
                </span>
                <p className="text-justify leading-relaxed">{para.text}</p>
              </div>
            ))}
          </article>
        </div>

        {/* Right Pane: Questions (Independent Scroll) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-h-[750px] overflow-y-auto space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
              QUESTIONS {questions[0]?.number} – {questions[questions.length - 1]?.number}
            </span>
            <button
              type="button"
              onClick={handleReset}
              title="Làm lại các câu hỏi"
              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const isFlagged = Boolean(flaggedQuestions[q.id]);
              const isCorrect = isSubmitted && (
                userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ||
                (q.acceptableAnswers || []).map(a => a.trim().toLowerCase()).includes(userAns.trim().toLowerCase())
              );

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : 'bg-rose-50/40 border-rose-300'
                      : isFlagged
                      ? 'bg-amber-50/30 border-amber-300'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-slate-200 text-slate-800 text-xs font-bold font-mono flex items-center justify-center">
                        {q.number}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">
                        {q.type}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFlag(q.id)}
                      className={`p-1 rounded cursor-pointer ${
                        isFlagged ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-medium text-slate-900 mb-2.5 leading-relaxed">{q.prompt}</p>

                  {/* Question Inputs */}
                  {q.type === 'true-false-notgiven' ? (
                    <div className="flex flex-wrap gap-2">
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswerChange(q.id, opt)}
                          disabled={isSubmitted && examMode === 'simulation'}
                          className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border transition-colors ${
                            userAns === opt
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : q.type === 'multiple-choice' || q.type === 'matching-features' ? (
                    <div className="space-y-1.5">
                      {q.options?.map(opt => {
                        const letter = opt.charAt(0);
                        const isSelected = userAns.toUpperCase() === letter.toUpperCase();
                        return (
                          <label
                            key={opt}
                            className={`flex items-start gap-2 text-xs p-2 rounded cursor-pointer border transition-colors ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 font-medium'
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`rq-${q.id}`}
                              value={letter}
                              checked={isSelected}
                              disabled={isSubmitted && examMode === 'simulation'}
                              onChange={() => handleAnswerChange(q.id, letter)}
                              className="hidden"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={userAns}
                      placeholder="Gõ từ đáp án..."
                      disabled={isSubmitted && examMode === 'simulation'}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600"
                    />
                  )}

                  {/* Feedback on submit */}
                  {isSubmitted && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 text-xs space-y-1">
                      <div className="font-semibold">
                        {isCorrect ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Đúng: {q.correctAnswer}
                          </span>
                        ) : (
                          <span className="text-rose-700 flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> Đáp án đúng: {q.correctAnswer}
                          </span>
                        )}
                      </div>
                      {q.paragraphReference && (
                        <span className="text-[11px] text-slate-500 font-mono block">
                          Vị trí đoạn: {q.paragraphReference}
                        </span>
                      )}
                      <p className="text-slate-600 font-mono text-[11px]">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              {isSubmitted ? (
                <span className="font-bold text-slate-900 text-sm">
                  {score} / {total} câu đúng ({Math.round((score / total) * 100)}%)
                </span>
              ) : (
                <span>Đã làm: {Object.keys(userAnswers).length} / {questions.length}</span>
              )}
            </div>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
              >
                Chấm Điểm & Xem Vị Trí Đoạn
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold cursor-pointer"
              >
                Làm Lại Passage Này
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
