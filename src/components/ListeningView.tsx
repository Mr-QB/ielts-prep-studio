import React, { useState, useEffect } from 'react';
import { LISTENING_SECTIONS } from '../data/listeningData';
import { AudioPlayer } from './AudioPlayer';
import { ExamMode } from '../types';
import { Headphones, CheckCircle2, XCircle, RotateCcw, FileText, ChevronRight, ChevronLeft, Flag, HelpCircle, ArrowRight, BookOpen, Volume2 } from 'lucide-react';

interface ListeningViewProps {
  examMode?: ExamMode;
}

export const ListeningView: React.FC<ListeningViewProps> = ({ examMode = 'simulation' }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(LISTENING_SECTIONS[0].id);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(examMode === 'study');
  const [activeSentenceText, setActiveSentenceText] = useState<string>('');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  const currentSection = LISTENING_SECTIONS.find(s => s.id === selectedSectionId) || LISTENING_SECTIONS[0];
  const questions = currentSection.questions;
  const currentQuestion = questions[activeQuestionIndex] || questions[0];

  // Update transcript view when mode changes
  useEffect(() => {
    if (examMode === 'study') {
      setShowTranscript(true);
    } else {
      setShowTranscript(false);
    }
  }, [examMode]);

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
    setActiveQuestionIndex(0);
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(q => {
      const ans = (userAnswers[q.id] || '').trim().toLowerCase();
      const target = q.correctAnswer.trim().toLowerCase();
      const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());

      if (ans === target || acceptable.includes(ans)) {
        correctCount += 1;
      }
    });
    return correctCount;
  };

  const score = calculateScore();
  const total = questions.length;

  const getEstimatedBand = (correct: number, max: number) => {
    const ratio = correct / max;
    if (ratio >= 0.9) return 'Band 8.5 - 9.0';
    if (ratio >= 0.8) return 'Band 7.5 - 8.0';
    if (ratio >= 0.7) return 'Band 6.5 - 7.0';
    if (ratio >= 0.55) return 'Band 5.5 - 6.0';
    return 'Dưới 5.5';
  };

  // Check if active question is flagged
  const isCurrentFlagged = !!flaggedQuestions[currentQuestion?.id];

  // Keyboard navigation for CD-IELTS question jumping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing into an input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.key === 'ArrowRight' || (e.altKey && e.key.toLowerCase() === 'n')) {
        setActiveQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || (e.altKey && e.key.toLowerCase() === 'p')) {
        setActiveQuestionIndex(prev => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questions.length]);

  return (
    <div className="space-y-6 pb-20">
      {/* Test Section Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                LISTENING COMPONENT • SECTION {currentSection.sectionNumber}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">Cambridge IELTS 12 Authentic</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {currentSection.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {currentSection.context}
            </p>
          </div>

          {/* Section Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-700">Chọn Section:</span>
            <select
              value={selectedSectionId}
              onChange={(e) => {
                setSelectedSectionId(e.target.value);
                handleReset();
              }}
              className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 cursor-pointer"
            >
              {LISTENING_SECTIONS.map(s => (
                <option key={s.id} value={s.id}>
                  Section {s.sectionNumber}: {s.title.split(': ')[1] || s.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Examination Audio Player Console */}
      <AudioPlayer
        transcript={currentSection.transcript}
        narratorVoice={currentSection.narratorVoice}
        externalSources={currentSection.audioSources}
        onSentenceChange={(_, text) => setActiveSentenceText(text)}
      />

      {/* Official Instructions Banner */}
      <div className="bg-slate-100 border-l-4 border-slate-800 p-4 text-xs text-slate-800 font-medium">
        <p className="font-bold text-slate-900 uppercase tracking-wide">
          Instructions to Candidates
        </p>
        <p className="mt-0.5">
          {currentSection.instructions}
        </p>
      </div>

      {/* Main Questions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Official Question Paper Presentation */}
        <div className={`space-y-4 ${showTranscript ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Questions {questions[0]?.number} – {questions[questions.length - 1]?.number}
              </span>
              <span className="text-xs text-slate-500">
                Đã điền: <strong className="text-slate-800">{Object.keys(userAnswers).filter(k => (userAnswers[k] || '').trim()).length}</strong> / {questions.length}
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-4 divide-y divide-slate-100">
              {questions.map((q, idx) => {
                const userVal = userAnswers[q.id] || '';
                const isCorrect = userVal.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ||
                  (q.acceptableAnswers || []).map(a => a.trim().toLowerCase()).includes(userVal.trim().toLowerCase());
                const isFlagged = !!flaggedQuestions[q.id];
                const isActive = activeQuestionIndex === idx;

                return (
                  <div
                    key={q.id}
                    id={`question-${q.id}`}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`pt-4 first:pt-0 transition-colors rounded p-2 ${
                      isActive ? 'bg-slate-50/80 ring-1 ring-slate-300' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Question Number Badge with Flag indicator */}
                      <div className="relative shrink-0 mt-0.5">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded border border-slate-300 bg-white font-mono text-xs font-bold text-slate-800 shadow-xs">
                          {q.number}
                        </span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" title="Đã gắn cờ xem lại" />
                        )}
                      </div>

                      {/* Question Prompt & Input */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 leading-relaxed">
                          {q.type === 'fill-blank' ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span>{q.prompt.split('_____')[0]}</span>
                              <div className="inline-flex items-center relative">
                                <input
                                  type="text"
                                  value={userVal}
                                  disabled={isSubmitted && examMode === 'simulation'}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  placeholder={`[ ${q.number} ]`}
                                  className={`w-44 px-2.5 py-1 text-xs font-mono font-medium rounded border transition-all focus:outline-none ${
                                    isSubmitted
                                      ? isCorrect
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                                        : 'bg-rose-50 border-rose-400 text-rose-900 line-through'
                                      : 'bg-white border-slate-300 focus:border-slate-800 focus:ring-1 focus:ring-slate-800'
                                  }`}
                                />
                                {isSubmitted && (
                                  <span className="ml-1.5 shrink-0">
                                    {isCorrect ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-rose-500 inline" />
                                    )}
                                  </span>
                                )}
                              </div>
                              <span>{q.prompt.split('_____')[1] || ''}</span>
                            </div>
                          ) : (
                            <div>
                              <p className="mb-2">{q.prompt}</p>
                              {q.options && (
                                <div className="space-y-1.5 ml-2">
                                  {q.options.map((opt, optIdx) => {
                                    const optLetter = opt.charAt(0).toUpperCase();
                                    const isSelected = userVal === optLetter;
                                    return (
                                      <label
                                        key={optIdx}
                                        className={`flex items-center gap-2.5 p-2 rounded text-xs cursor-pointer border transition-colors ${
                                          isSelected
                                            ? 'border-slate-800 bg-slate-100 font-semibold text-slate-900'
                                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`q-${q.id}`}
                                          checked={isSelected}
                                          disabled={isSubmitted && examMode === 'simulation'}
                                          onChange={() => handleAnswerChange(q.id, optLetter)}
                                          className="text-slate-900 focus:ring-slate-800"
                                        />
                                        <span>{opt}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Review / Flag Button for this Question */}
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <button
                            onClick={() => toggleFlag(q.id)}
                            className={`flex items-center gap-1 cursor-pointer transition-colors ${
                              isFlagged ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <Flag className="w-3 h-3" />
                            <span>{isFlagged ? 'Đã đánh dấu Review' : 'Gắn cờ xem lại'}</span>
                          </button>

                          {/* Study mode explanation */}
                          {(isSubmitted || examMode === 'study') && (
                            <div className="text-[11px] text-slate-500">
                              Đáp án chuẩn: <strong className="font-mono text-emerald-700 uppercase">{q.correctAnswer}</strong>
                              {q.acceptableAnswers && q.acceptableAnswers.length > 0 && (
                                <span className="text-slate-400"> (chấp nhận: {q.acceptableAnswers.join(', ')})</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Explanation panel in study mode or after submit */}
                        {(isSubmitted || examMode === 'study') && (
                          <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                            <span className="font-bold text-slate-900 block mb-0.5">Phân tích băng ghi âm:</span>
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Test Submission Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại từ đầu</span>
                </button>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showTranscript ? 'Ẩn Transcript' : 'Xem Transcript & Dẫn chứng'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {!isSubmitted ? (
                  <button
                    onClick={() => setIsSubmitted(true)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded transition-colors cursor-pointer shadow-xs"
                  >
                    Nộp bài & Chấm điểm
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-slate-100 border border-slate-300 px-4 py-1.5 rounded">
                    <div className="text-xs font-mono">
                      Kết quả: <strong className="text-slate-900 text-sm">{score}/{total}</strong> ({Math.round((score/total)*100)}%)
                    </div>
                    <span className="text-slate-300">|</span>
                    <span className="text-xs font-bold text-slate-800">{getEstimatedBand(score, total)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Script & Evidence Drawer */}
        {showTranscript && (
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 sticky top-24">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Audio Script & Dẫn Chứng Đáp Án
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Cambridge Official</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Các đoạn chứa câu trả lời được đánh dấu <span className="bg-amber-100 text-amber-900 px-1 font-mono font-bold rounded">[Q1]..[Q10]</span>.
            </p>

            {/* Script Viewer with highlighting */}
            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2 text-xs font-serif-reading text-slate-800 leading-relaxed divide-y divide-slate-100">
              {currentSection.transcript.split('\n').map((line, lIdx) => {
                const isSpeakingLine = activeSentenceText && line.includes(activeSentenceText.slice(0, 20));
                const containsQuestionMarker = line.match(/\[Q\d+\]/);

                return (
                  <div
                    key={lIdx}
                    className={`pt-2 first:pt-0 transition-colors ${
                      isSpeakingLine ? 'bg-amber-50/80 -mx-2 px-2 py-1 rounded border-l-2 border-amber-500 font-sans text-slate-950 font-medium' : ''
                    }`}
                  >
                    {line.startsWith('TC EMPLOYEE:') || line.startsWith('VISITOR:') || line.startsWith('GUIDE:') ? (
                      <span className="font-sans font-bold text-[11px] text-slate-600 block mb-0.5">
                        {line.split(':')[0]}:
                      </span>
                    ) : null}
                    <p>
                      {line.replace(/^[A-Z\s]+:\s*/, '').split(/(\[Q\d+\])/g).map((part, pIdx) => {
                        if (part.match(/\[Q\d+\]/)) {
                          return (
                            <span key={pIdx} className="font-mono text-xs font-bold bg-amber-200 text-amber-950 px-1 py-0.5 mx-1 rounded border border-amber-300">
                              {part}
                            </span>
                          );
                        }
                        return part;
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Official CD-IELTS Bottom Question Navigation Palette */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-slate-100 px-4 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Question tiles grid */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-mono text-slate-400 mr-1 hidden sm:inline">Questions:</span>
            {questions.map((q, idx) => {
              const isAnswered = !!(userAnswers[q.id] || '').trim();
              const isFlagged = !!flaggedQuestions[q.id];
              const isActive = activeQuestionIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionIndex(idx);
                    const el = document.getElementById(`question-${q.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  title={`Câu ${q.number}${isAnswered ? ' (Đã làm)' : ' (Chưa làm)'}${isFlagged ? ' - Có cờ xem lại' : ''}`}
                  className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'border-2 border-amber-400 text-white bg-slate-800 shadow-sm'
                      : isAnswered
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  <span>{q.number}</span>
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900" />
                  )}
                  {isAnswered && (
                    <span className="absolute bottom-0.5 w-3.5 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Question Review & Navigation Controls */}
          <div className="flex items-center gap-3 ml-auto text-xs">
            {/* Review flag checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={isCurrentFlagged}
                onChange={() => currentQuestion && toggleFlag(currentQuestion.id)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Review</span>
            </label>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1">
              <button
                disabled={activeQuestionIndex === 0}
                onClick={() => {
                  const nextIdx = Math.max(0, activeQuestionIndex - 1);
                  setActiveQuestionIndex(nextIdx);
                  const el = document.getElementById(`question-${questions[nextIdx]?.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center gap-1 cursor-pointer font-medium"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button
                disabled={activeQuestionIndex === questions.length - 1}
                onClick={() => {
                  const nextIdx = Math.min(questions.length - 1, activeQuestionIndex + 1);
                  setActiveQuestionIndex(nextIdx);
                  const el = document.getElementById(`question-${questions[nextIdx]?.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center gap-1 cursor-pointer font-medium"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
