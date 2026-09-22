import React, { useState, useEffect, useRef } from 'react';
import { READING_PASSAGES } from '../data/readingData';
import { ExamMode } from '../types';
import { BookOpen, CheckCircle2, XCircle, RotateCcw, Highlighter, Type, Flag, ChevronLeft, ChevronRight, MessageSquare, Trash2, HelpCircle } from 'lucide-react';

interface ReadingViewProps {
  examMode?: ExamMode;
}

interface TextAnnotation {
  id: string;
  passageId: string;
  selectedText: string;
  color: 'yellow' | 'blue' | 'green';
  note?: string;
  timestamp: number;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ examMode = 'simulation' }) => {
  const [selectedPassageId, setSelectedPassageId] = useState<string>(READING_PASSAGES[0].id);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'compact'>('normal');
  const [activeHighlightColor, setActiveHighlightColor] = useState<'yellow' | 'green' | 'blue'>('yellow');
  const [annotations, setAnnotations] = useState<TextAnnotation[]>(() => {
    try {
      const saved = localStorage.getItem('ielts_reading_annotations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedTextForNote, setSelectedTextForNote] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');
  const [showNotePopup, setShowNotePopup] = useState<boolean>(false);

  const passageContainerRef = useRef<HTMLDivElement | null>(null);

  const currentPassage = READING_PASSAGES.find(p => p.id === selectedPassageId) || READING_PASSAGES[0];
  const questions = currentPassage.questions;
  const currentQuestion = questions[activeQuestionIndex] || questions[0];

  useEffect(() => {
    try {
      localStorage.setItem('ielts_reading_annotations', JSON.stringify(annotations));
    } catch {
      // safe fallback
    }
  }, [annotations]);

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
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();
      if (userAns === correctAns) {
        correctCount += 1;
      }
    });
    return correctCount;
  };

  const score = calculateScore();
  const total = questions.length;

  const getEstimatedBand = (correct: number, max: number) => {
    const ratio = correct / max;
    if (ratio >= 0.9) return 'Band 8.0 - 9.0';
    if (ratio >= 0.8) return 'Band 7.0 - 7.5';
    if (ratio >= 0.65) return 'Band 6.0 - 6.5';
    if (ratio >= 0.5) return 'Band 5.0 - 5.5';
    return 'Dưới 5.0';
  };

  // Text selection handler for official Highlight / Notes tool
  const handlePassageMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const text = selection.toString().trim();
    if (text.length > 2) {
      setSelectedTextForNote(text);
    }
  };

  const addHighlight = (color: 'yellow' | 'blue' | 'green') => {
    if (!selectedTextForNote) return;
    const newAnn: TextAnnotation = {
      id: `ann-${Date.now()}`,
      passageId: currentPassage.id,
      selectedText: selectedTextForNote,
      color,
      timestamp: Date.now()
    };
    setAnnotations([newAnn, ...annotations]);
    setSelectedTextForNote('');
    if (window.getSelection) window.getSelection()?.removeAllRanges();
  };

  const addNote = () => {
    if (!selectedTextForNote || !noteInput.trim()) return;
    const newAnn: TextAnnotation = {
      id: `ann-${Date.now()}`,
      passageId: currentPassage.id,
      selectedText: selectedTextForNote,
      color: activeHighlightColor,
      note: noteInput.trim(),
      timestamp: Date.now()
    };
    setAnnotations([newAnn, ...annotations]);
    setSelectedTextForNote('');
    setNoteInput('');
    setShowNotePopup(false);
    if (window.getSelection) window.getSelection()?.removeAllRanges();
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  const currentPassageAnnotations = annotations.filter(a => a.passageId === currentPassage.id);
  const isCurrentFlagged = !!flaggedQuestions[currentQuestion?.id];

  // Global arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

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
    <div className="space-y-4 pb-20">
      {/* Passage Selector & Official CD-IELTS Reading Utility Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              READING COMPONENT • SECTION {currentPassage.passageNumber}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 font-medium">Cambridge IELTS 12 General Training</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            {currentPassage.title}
          </h1>
        </div>

        {/* Utilities: Passage switcher, Font sizing, and Highlight color */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Passage Switcher */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Bài đọc:</span>
            <select
              value={selectedPassageId}
              onChange={(e) => {
                setSelectedPassageId(e.target.value);
                handleReset();
              }}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 cursor-pointer"
            >
              {READING_PASSAGES.map(p => (
                <option key={p.id} value={p.id}>
                  Section {p.passageNumber}: {p.title.split(': ')[1] || p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center border border-slate-200 rounded p-0.5 bg-slate-50 text-xs">
            <button
              onClick={() => setFontSize('compact')}
              title="Cỡ chữ nhỏ"
              className={`px-2 py-0.5 rounded cursor-pointer ${fontSize === 'compact' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('normal')}
              title="Cỡ chữ tiêu chuẩn"
              className={`px-2 py-0.5 rounded cursor-pointer ${fontSize === 'normal' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              title="Cỡ chữ lớn"
              className={`px-2 py-0.5 rounded cursor-pointer ${fontSize === 'large' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              A+
            </button>
          </div>

          {/* Highlight Color Picker */}
          <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-1 bg-slate-50 text-xs">
            <Highlighter className="w-3.5 h-3.5 text-slate-500 mr-1" />
            <button
              onClick={() => setActiveHighlightColor('yellow')}
              className={`w-4 h-4 rounded-full bg-yellow-300 border ${activeHighlightColor === 'yellow' ? 'ring-2 ring-slate-800 ring-offset-1 border-yellow-500' : 'border-yellow-400'}`}
              title="Màu highlight vàng"
            />
            <button
              onClick={() => setActiveHighlightColor('blue')}
              className={`w-4 h-4 rounded-full bg-sky-300 border ${activeHighlightColor === 'blue' ? 'ring-2 ring-slate-800 ring-offset-1 border-sky-500' : 'border-sky-400'}`}
              title="Màu highlight xanh dương"
            />
            <button
              onClick={() => setActiveHighlightColor('green')}
              className={`w-4 h-4 rounded-full bg-emerald-300 border ${activeHighlightColor === 'green' ? 'ring-2 ring-slate-800 ring-offset-1 border-emerald-500' : 'border-emerald-400'}`}
              title="Màu highlight xanh lá"
            />
          </div>
        </div>
      </div>

      {/* Floating Selection Tooltip when text is selected */}
      {selectedTextForNote && (
        <div className="bg-slate-900 text-white rounded-lg p-2.5 shadow-xl flex items-center gap-2 text-xs z-30 animate-in fade-in max-w-xl mx-auto border border-slate-700">
          <span className="text-slate-400 truncate max-w-[180px] italic">"{selectedTextForNote}"</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => addHighlight('yellow')}
              className="px-2 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded cursor-pointer"
            >
              Vàng
            </button>
            <button
              onClick={() => addHighlight('blue')}
              className="px-2 py-1 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded cursor-pointer"
            >
              Xanh
            </button>
            <button
              onClick={() => setShowNotePopup(true)}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Ghi chú</span>
            </button>
            <button
              onClick={() => setSelectedTextForNote('')}
              className="px-1.5 py-1 text-slate-400 hover:text-white cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Note input popup dialog */}
      {showNotePopup && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 p-5 max-w-md w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Thêm ghi chú cho đoạn văn bản</h3>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-200">
              "{selectedTextForNote}"
            </p>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Nhập ghi chú hoặc suy luận của bạn..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none focus:border-slate-800"
              autoFocus
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => { setShowNotePopup(false); setNoteInput(''); }}
                className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={addNote}
                className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 cursor-pointer"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Split Screen Container: Left (Passage), Right (Questions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Pane: Reading Passage (Official Typography & Text Presentation) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-h-[750px] overflow-y-auto pr-4">
          <div className="pb-3 mb-4 border-b border-slate-200 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider">
              READING PASSAGE
            </span>
            <span className="text-xs text-slate-400">
              Bôi đen văn bản để Highlight & Thêm ghi chú
            </span>
          </div>

          {/* Passage Content */}
          <div
            ref={passageContainerRef}
            onMouseUp={handlePassageMouseUp}
            className={`font-serif-reading text-slate-900 leading-relaxed select-text space-y-4 ${
              fontSize === 'compact' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'
            }`}
          >
            {currentPassage.content.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="flex items-start gap-3">
                  {/* Paragraph Identifier */}
                  <span className="shrink-0 font-sans font-bold text-xs bg-slate-100 text-slate-700 border border-slate-300 w-6 h-6 rounded flex items-center justify-center mt-1 select-none">
                    {item.label}
                  </span>
                  <div className="flex-1 whitespace-pre-line">
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User Annotations List for this passage */}
          {currentPassageAnnotations.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-200 space-y-2 font-sans">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Ghi chú của bạn trên bài đọc ({currentPassageAnnotations.length}):</span>
              </div>
              <div className="space-y-1.5">
                {currentPassageAnnotations.map(ann => (
                  <div
                    key={ann.id}
                    className="flex items-start justify-between gap-2 p-2 rounded bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div>
                      <span className={`inline-block px-1.5 py-0.5 rounded font-serif-reading text-[11px] mr-1.5 ${
                        ann.color === 'yellow' ? 'bg-yellow-200' : ann.color === 'blue' ? 'bg-sky-200' : 'bg-emerald-200'
                      }`}>
                        "{ann.selectedText}"
                      </span>
                      {ann.note && <p className="mt-1 text-slate-700 font-medium">{ann.note}</p>}
                    </div>
                    <button
                      onClick={() => removeAnnotation(ann.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Xóa ghi chú này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Pane: Official Questions Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-h-[750px] overflow-y-auto space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                QUESTIONS {questions[0]?.number} – {questions[questions.length - 1]?.number}
              </span>
              <span className="text-[11px] text-slate-500">
                Đã trả lời: <strong>{Object.keys(userAnswers).filter(k => (userAnswers[k] || '').trim()).length}</strong> / {questions.length}
              </span>
            </div>
            {isSubmitted && (
              <div className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 rounded border border-slate-300">
                Score: {score}/{total} ({getEstimatedBand(score, total)})
              </div>
            )}
          </div>

          {/* Questions Render */}
          <div className="space-y-4 divide-y divide-slate-100">
            {questions.map((q, idx) => {
              const userVal = (userAnswers[q.id] || '').trim().toLowerCase();
              const correctVal = q.correctAnswer.trim().toLowerCase();
              const isCorrect = userVal === correctVal;
              const isFlagged = !!flaggedQuestions[q.id];
              const isActive = activeQuestionIndex === idx;

              return (
                <div
                  key={q.id}
                  id={`reading-q-${q.id}`}
                  onClick={() => setActiveQuestionIndex(idx)}
                  className={`pt-4 first:pt-0 transition-colors rounded p-2.5 ${
                    isActive ? 'bg-slate-50/80 ring-1 ring-slate-300' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Question Number Badge */}
                    <div className="relative shrink-0 mt-0.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded border border-slate-300 bg-white font-mono text-xs font-bold text-slate-800 shadow-xs">
                        {q.number}
                      </span>
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
                      )}
                    </div>

                    {/* Question Body */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 leading-relaxed mb-2">
                        {q.prompt}
                      </p>

                      {/* True/False/Not Given or Options */}
                      {q.type === 'true-false-notgiven' ? (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {['TRUE', 'FALSE', 'NOT GIVEN'].map(choice => {
                            const isSelected = userVal === choice.toLowerCase();
                            return (
                              <button
                                key={choice}
                                type="button"
                                disabled={isSubmitted && examMode === 'simulation'}
                                onClick={() => handleAnswerChange(q.id, choice)}
                                className={`px-2.5 py-1 rounded border text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? isSubmitted
                                      ? isCorrect
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-rose-600 text-white border-rose-600'
                                      : 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>
                      ) : q.options && q.options.length > 0 ? (
                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => {
                            const optKey = opt.split(' ')[0] || opt;
                            const isSelected = userVal === optKey.toLowerCase() || userVal === opt.toLowerCase();
                            return (
                              <label
                                key={oIdx}
                                className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer border transition-colors ${
                                  isSelected
                                    ? 'border-slate-800 bg-slate-100 font-semibold text-slate-900'
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`read-q-${q.id}`}
                                  checked={isSelected}
                                  disabled={isSubmitted && examMode === 'simulation'}
                                  onChange={() => handleAnswerChange(q.id, optKey)}
                                  className="text-slate-900 focus:ring-slate-800"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={userAnswers[q.id] || ''}
                            disabled={isSubmitted && examMode === 'simulation'}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            placeholder="Nhập câu trả lời..."
                            className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      )}

                      {/* Flag button & Explanation in Study Mode */}
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <button
                          onClick={() => toggleFlag(q.id)}
                          className={`flex items-center gap-1 cursor-pointer transition-colors ${
                            isFlagged ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Flag className="w-3 h-3" />
                          <span>{isFlagged ? 'Đã gắn cờ Review' : 'Gắn cờ xem lại'}</span>
                        </button>

                        {(isSubmitted || examMode === 'study') && (
                          <span className="font-mono font-bold text-xs text-emerald-700">
                            Đáp án: {q.correctAnswer.toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Explanation box */}
                      {(isSubmitted || examMode === 'study') && (
                        <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                          {q.paragraphReference && (
                            <span className="font-bold text-slate-900 block text-[11px]">
                              Vị trí dẫn chứng: {q.paragraphReference}
                            </span>
                          )}
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại đề này</span>
            </button>

            {!isSubmitted ? (
              <button
                onClick={() => setIsSubmitted(true)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded cursor-pointer transition-colors"
              >
                Nộp bài đọc & Chấm điểm
              </button>
            ) : (
              <div className="text-xs font-mono font-bold text-slate-800">
                Đúng {score}/{total} ({getEstimatedBand(score, total)})
              </div>
            )}
          </div>
        </div>
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
                    const el = document.getElementById(`reading-q-${q.id}`);
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
                  const el = document.getElementById(`reading-q-${questions[nextIdx]?.id}`);
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
                  const el = document.getElementById(`reading-q-${questions[nextIdx]?.id}`);
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
