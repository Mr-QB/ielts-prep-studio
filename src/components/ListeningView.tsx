import React, { useState, useEffect } from 'react';
import { LISTENING_SECTIONS, LISTENING_SOURCES } from '../data/listeningData';
import { AudioPlayer } from './AudioPlayer';
import { ExamMode, TestAttempt } from '../types';
import { recordAttempt } from '../utils/db';
import { Flag, Eye, EyeOff, RotateCcw, Check, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface ListeningViewProps {
  examMode?: ExamMode;
}

export const ListeningView: React.FC<ListeningViewProps> = ({ examMode = 'study' }) => {
  // Library filter states
  const [selectedSourceId, setSelectedSourceId] = useState<string>('all');
  const [selectedPart, setSelectedPart] = useState<number | 'all'>('all');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(LISTENING_SECTIONS[0].id);

  // User input states
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  const filteredSections = LISTENING_SECTIONS.filter(sec => {
    if (selectedSourceId !== 'all' && sec.sourceId !== selectedSourceId) return false;
    if (selectedPart !== 'all' && sec.sectionNumber !== selectedPart) return false;
    return true;
  });

  const currentSection = LISTENING_SECTIONS.find(s => s.id === selectedSectionId) || LISTENING_SECTIONS[0];
  const questions = currentSection.questions;
  const currentQuestion = questions[activeQuestionIndex] || questions[0];
  const currentSource = LISTENING_SOURCES.find(s => s.id === currentSection.sourceId);

  // Reset states on section switch
  useEffect(() => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
    setShowTranscript(false);
    setActiveQuestionIndex(0);
  }, [selectedSectionId]);

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
    setShowTranscript(false);
    setActiveQuestionIndex(0);
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
    setShowTranscript(true);

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
          userAnswer: userAns || '(chưa trả lời)',
          correctAnswer: target
        });
      }
    });

    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      skill: 'listening',
      sectionId: currentSection.id,
      sectionTitle: currentSection.title,
      date: new Date().toISOString(),
      score,
      total: questions.length,
      durationSeconds: currentSection.duration,
      mode: examMode,
      userAnswers,
      incorrectQuestionNumbers: incorrects,
      mistakeTags: mistakes
    };

    recordAttempt(attempt);
  };

  const score = calculateScore();
  const total = questions.length;

  return (
    <div className="space-y-6 pb-16">
      {/* Content Selector Bar (Source -> Part -> Lesson) */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
              LISTENING LIBRARY • ACADEMIC FOCUS
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Luyện Nghe IELTS 4 Parts Chuẩn Format
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Source */}
            <select
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-medium cursor-pointer"
            >
              <option value="all">Tất cả nguồn học liệu</option>
              {LISTENING_SOURCES.map(s => (
                <option key={s.id} value={s.id}>{s.provider} ({s.title})</option>
              ))}
            </select>

            {/* Filter by Part */}
            <select
              value={selectedPart}
              onChange={(e) => setSelectedPart(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-medium cursor-pointer"
            >
              <option value="all">Tất cả các Part (1-4)</option>
              <option value={1}>Part 1: Hội thoại đời thường</option>
              <option value={2}>Part 2: Độc thoại đời sống</option>
              <option value={3}>Part 3: Thảo luận học thuật</option>
              <option value={4}>Part 4: Bài giảng học thuật</option>
            </select>
          </div>
        </div>

        {/* Compact Lesson List Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {filteredSections.map(sec => {
            const isSelected = sec.id === selectedSectionId;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSectionId(sec.id)}
                className={`px-3 py-1.5 rounded text-xs text-left transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`px-1 rounded text-[10px] font-mono ${
                    isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    P{sec.sectionNumber}
                  </span>
                  <span className="truncate max-w-[200px]">{sec.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Header & Provenance Badge */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-slate-100 text-slate-700 border border-slate-200">
              Part {currentSection.sectionNumber}
            </span>

            {/* Source Provenance Badge */}
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
              currentSource?.isOfficial
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : currentSource?.sourceType === 'user-reference'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              {currentSource?.provider || 'Học liệu tự học'}
            </span>

            {currentSection.verificationStatus === 'audio-unavailable' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                Audio unavailable on web
              </span>
            )}
          </div>

          <span className="text-xs text-slate-500 font-mono">
            {questions.length} câu hỏi • Thời lượng: ~{Math.round(currentSection.duration / 60)} phút
          </span>
        </div>

        <h2 className="text-base font-bold text-slate-900">{currentSection.title}</h2>
        <p className="text-xs text-slate-600 leading-relaxed">{currentSection.context}</p>

        {currentSection.sourceNotice && (
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
            {currentSection.sourceNotice}
          </div>
        )}

        {/* Minimal Audio Player */}
        <AudioPlayer
          transcript={currentSection.transcript}
          narratorVoice={currentSection.narratorVoice}
          audioSources={currentSection.audioSources}
          canonicalUrl={currentSection.canonicalUrl}
          examMode={examMode}
        />
      </div>

      {/* Question Pane & Answers */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="text-xs font-semibold text-slate-800">
            <span>{currentSection.instructions}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Reveal Transcript Button */}
            <button
              type="button"
              onClick={() => setShowTranscript(prev => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer font-medium"
            >
              {showTranscript ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
              <span>{showTranscript ? 'Ẩn Transcript' : 'Xem Transcript'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Làm lại bài tập"
              className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAns = userAnswers[q.id] || '';
            const isFlagged = Boolean(flaggedQuestions[q.id]);
            const isAnswered = Boolean(userAns.trim());
            const isCorrect = isSubmitted && (
              userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ||
              (q.acceptableAnswers || []).map(a => a.trim().toLowerCase()).includes(userAns.trim().toLowerCase())
            );

            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-rose-50/40 border-rose-300'
                    : isFlagged
                    ? 'bg-amber-50/30 border-amber-300'
                    : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold font-mono flex items-center justify-center">
                      {q.number}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase font-mono">
                      {q.type}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFlag(q.id)}
                    title={isFlagged ? 'Bỏ đánh dấu' : 'Đánh dấu xem lại'}
                    className={`p-1 rounded cursor-pointer ${
                      isFlagged ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-sm font-medium text-slate-900 mb-3">{q.prompt}</p>

                {/* Question Input / Option Selection */}
                {q.type === 'multiple-choice' && q.options ? (
                  <div className="space-y-1.5 ml-1">
                    {q.options.map(opt => {
                      const letter = opt.charAt(0);
                      const isSelected = userAns.toUpperCase() === letter.toUpperCase();
                      return (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 text-xs p-2 rounded cursor-pointer border transition-colors ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 font-medium'
                              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
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
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userAns}
                      placeholder="Nhập câu trả lời..."
                      disabled={isSubmitted && examMode === 'simulation'}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="max-w-xs w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600"
                    />
                  </div>
                )}

                {/* Explanation and Mistake feedback upon submit */}
                {isSubmitted && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Đúng: {q.correctAnswer}
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Sai. Đáp án đúng: {q.correctAnswer}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-mono text-[11px]">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Bar & Score Summary */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            {isSubmitted ? (
              <span className="font-bold text-slate-900 text-sm">
                Kết quả: {score} / {total} câu đúng ({Math.round((score / total) * 100)}%)
              </span>
            ) : (
              <span>Đã làm: {Object.keys(userAnswers).length} / {questions.length} câu</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
              >
                Chấm Điểm & Xem Giải Thích
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold cursor-pointer"
              >
                Luyện Tập Lại Bài Này
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Transcript Section */}
        {showTranscript && (
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                AUDIOSCRIPT (Kèm đánh dấu đáp án [Q])
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {currentSection.narratorVoice}
              </span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
              {currentSection.transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
