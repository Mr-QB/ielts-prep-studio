import React, { useState, useEffect } from 'react';
import { LISTENING_FULL_TESTS, LISTENING_SECTIONS, LISTENING_SOURCES } from '../data/listeningData';
import { LISTENING_PRACTICE_SECTIONS } from '../data/listeningPracticeData';
import { ListeningQuestion, ListeningSection, MistakeTagType, TestAttempt } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { recordAttempt, addWordToVocabDeck } from '../utils/db';
import { calculateListeningBand, formatTime } from '../utils/ieltsScoring';
import {
  RotateCcw, Eye, EyeOff, Flag, Check, X, Award,
  Clock, AlertTriangle, Plus, ChevronRight, ChevronLeft, Volume2
} from 'lucide-react';

interface ListeningViewProps {
  examMode?: 'study' | 'simulation';
}

const MISTAKE_TAG_OPTIONS: { id: MistakeTagType; label: string }[] = [
  { id: 'distractor', label: 'Bị bẫy đổi ý (Distractor)' },
  { id: 'spelling', label: 'Sai chính tả (Spelling)' },
  { id: 'plural-singular', label: 'Số ít / số nhiều (Plural/Singular)' },
  { id: 'number', label: 'Nghe nhầm số (Number)' },
  { id: 'missed-keyword', label: 'Lỡ từ khóa (Missed keyword)' },
  { id: 'synonym-paraphrase', label: 'Không bắt được từ đồng nghĩa' },
  { id: 'lost-concentration', label: 'Mất tập trung (Lost focus)' },
  { id: 'unknown-vocabulary', label: 'Từ vựng lạ chưa biết' }
];

export const ListeningView: React.FC<ListeningViewProps> = () => {
  const [activeMode, setActiveMode] = useState<'section' | 'full-test'>('section');

  // SECTION PRACTICE STATES
  const allAvailableSections = [...LISTENING_SECTIONS, ...LISTENING_PRACTICE_SECTIONS];
  const [selectedSectionId, setSelectedSectionId] = useState<string>(LISTENING_SECTIONS[0].id);
  const currentSection = allAvailableSections.find(s => s.id === selectedSectionId) || LISTENING_SECTIONS[0];

  const [sectionAnswers, setSectionAnswers] = useState<Record<string, string>>({});
  const [sectionSubmitted, setSectionSubmitted] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [mistakeTagSelections, setMistakeTagSelections] = useState<Record<string, MistakeTagType>>({});
  const [addedVocabWords, setAddedVocabWords] = useState<Record<string, boolean>>({});

  // FULL TEST STATES
  const fullTest = LISTENING_FULL_TESTS[0];
  const [activePartIndex, setActivePartIndex] = useState<number>(0);
  const [fullTestAnswers, setFullTestAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);

  // Flatten all 40 questions of Full Test
  const allFullTestQuestions: { question: ListeningQuestion; partIndex: number }[] = fullTest.sections.flatMap((s, sIdx) =>
    s.questions.map(q => ({ question: q, partIndex: sIdx }))
  );

  const activePartSection = fullTest.sections[activePartIndex];

  // Reset answers when section changes
  useEffect(() => {
    setSectionAnswers({});
    setSectionSubmitted(false);
    setShowTranscript(false);
    setMistakeTagSelections({});
  }, [selectedSectionId]);

  // -------------------------------------------------------------
  // SECTION PRACTICE HANDLERS
  // -------------------------------------------------------------
  const handleSectionAnswerChange = (qId: string, val: string) => {
    setSectionAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSectionSubmit = () => {
    setSectionSubmitted(true);
    setShowTranscript(true);

    const incorrects: TestAttempt['mistakeTags'] = [];
    currentSection.questions.forEach(q => {
      const userAns = (sectionAnswers[q.id] || '').trim();
      const target = q.correctAnswer.trim();
      const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
      const isCorrect = userAns.toLowerCase() === target.toLowerCase() || acceptable.includes(userAns.toLowerCase());

      if (!isCorrect) {
        incorrects.push({
          questionNumber: q.number,
          type: q.type,
          userAnswer: userAns || '(chưa trả lời)',
          correctAnswer: target,
          distractorNote: q.distractorNote,
          paraphraseNote: q.paraphraseNote
        });
      }
    });

    if (incorrects.length > 0) {
      recordAttempt({
        id: `practice-listen-${Date.now()}`,
        skill: 'listening',
        sectionId: currentSection.id,
        sectionTitle: currentSection.title,
        date: new Date().toISOString(),
        score: currentSection.questions.length - incorrects.length,
        total: currentSection.questions.length,
        durationSeconds: 300,
        mode: 'study',
        userAnswers: sectionAnswers,
        incorrectQuestionNumbers: incorrects.map(m => m.questionNumber),
        mistakeTags: incorrects
      });
    }
  };

  const handleAssignMistakeTag = (qId: string, tag: MistakeTagType) => {
    setMistakeTagSelections(prev => ({ ...prev, [qId]: tag }));
  };

  const handleAddWordToVocab = async (word: string, defVi: string, sentence: string) => {
    const res = await addWordToVocabDeck({
      word,
      definitionVi: defVi,
      sourceContext: sentence,
      source: 'Listening Context Practice'
    });
    if (res.success) {
      setAddedVocabWords(prev => ({ ...prev, [word]: true }));
    }
  };

  // -------------------------------------------------------------
  // FULL TEST HANDLERS
  // -------------------------------------------------------------
  const handleFullTestAnswerChange = (qId: string, val: string) => {
    if (isTestSubmitted) return;
    setFullTestAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const toggleFlagQuestion = (qNum: number) => {
    setFlaggedQuestions(prev => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const handleFinalSubmitFullTest = () => {
    setShowSubmitConfirmModal(false);
    setIsTestSubmitted(true);

    let rawScore = 0;
    const passageScores = fullTest.sections.map((s, idx) => ({
      passageIndex: idx,
      score: 0,
      total: s.questions.length
    }));

    const typeStats: Record<string, { correct: number; total: number }> = {};
    const incorrects: number[] = [];
    const mistakes: TestAttempt['mistakeTags'] = [];

    allFullTestQuestions.forEach(({ question: q, partIndex: pIdx }) => {
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
          distractorNote: q.distractorNote,
          paraphraseNote: q.paraphraseNote
        });
      }
    });

    recordAttempt({
      id: `full-listening-${Date.now()}`,
      skill: 'listening',
      sectionId: fullTest.id,
      sectionTitle: fullTest.title,
      date: new Date().toISOString(),
      score: rawScore,
      total: 40,
      durationSeconds: 1800,
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
    setIsTestSubmitted(false);
    setActivePartIndex(0);
  };

  const fullTestRawScore = isTestSubmitted
    ? allFullTestQuestions.filter(({ question: q }) => {
        const userAns = (fullTestAnswers[q.id] || '').trim().toLowerCase();
        const target = q.correctAnswer.trim().toLowerCase();
        const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
        return userAns === target || acceptable.includes(userAns);
      }).length
    : 0;

  const estimatedBandScore = calculateListeningBand(fullTestRawScore);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                IELTS ACADEMIC LISTENING STUDIO
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">Bẫy Thông Tin & Phân Tích Transcript</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Luyện Nghe Chi Tiết & Nhận Diện Bẫy Distractor
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveMode('section')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'section'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Luyện Từng Part (Section Practice)
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
              <span>2. Thi Thử Chuẩn (Full Test 4 Parts / 40 Câu)</span>
            </button>
          </div>
        </div>

        {/* Section Practice: Part pills */}
        {activeMode === 'section' && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase font-mono mr-1">CHỌN PHẦN LUYỆN:</span>
            {allAvailableSections.map(sec => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSectionId(sec.id)}
                className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedSectionId === sec.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Part {sec.part}: {sec.title.split(':')[1] || sec.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. SECTION PRACTICE VIEW                                                  */}
      {/* ========================================================================= */}
      {activeMode === 'section' && (
        <div className="space-y-6">
          {/* Section Audio Player Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-mono text-[10px] font-semibold">
                  Part {currentSection.part}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{currentSection.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{currentSection.context}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showTranscript ? 'Ẩn Transcript' : 'Xem Transcript'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSectionAnswers({}); setSectionSubmitted(false); }}
                  className="px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại</span>
                </button>
              </div>
            </div>

            {/* Audio Player Component */}
            <AudioPlayer
              audioSources={currentSection.audioSources}
              transcript={currentSection.transcript}
              narratorVoice={currentSection.narratorVoice}
            />
          </div>

          {/* Split Content: Questions Left / Transcript & Distractor Review Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Questions List (60%) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                    CÂU HỎI ({currentSection.questions.length} CÂU)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{currentSection.instructions}</p>
                </div>
                {sectionSubmitted && (
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    Đã nộp bài
                  </span>
                )}
              </div>

              <div className="space-y-5">
                {currentSection.questions.map(q => {
                  const userVal = (sectionAnswers[q.id] || '').trim();
                  const target = q.correctAnswer.trim();
                  const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
                  const isCorrect = userVal.toLowerCase() === target.toLowerCase() || acceptable.includes(userVal.toLowerCase());
                  const currentMistakeTag = mistakeTagSelections[q.id];

                  return (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          Câu {q.number}. {q.prompt}
                        </span>
                        {sectionSubmitted && (
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

                      {/* Options or Text field */}
                      {q.options && q.options.length > 0 ? (
                        <div className="space-y-1.5">
                          {q.options.map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={userVal === opt || userVal === opt[0]}
                                onChange={(e) => handleSectionAnswerChange(q.id, e.target.value)}
                                disabled={sectionSubmitted}
                                className="text-slate-900 focus:ring-slate-900"
                              />
                              <span className="text-slate-800">{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => handleSectionAnswerChange(q.id, e.target.value)}
                            placeholder="Điền câu trả lời nghe được..."
                            disabled={sectionSubmitted}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs font-sans focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                          />
                        </div>
                      )}

                      {/* ======================================================= */}
                      {/* CRITICAL: POST-SUBMIT DISTRACTOR & TRANSCRIPT ANALYSIS   */}
                      {/* ======================================================= */}
                      {sectionSubmitted && (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 text-xs">
                          {/* Answer comparison */}
                          <div className="p-2.5 bg-white rounded border border-slate-200 flex justify-between text-[11px]">
                            <span>Bạn nghe: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userVal || '(chưa điền)'}</strong></span>
                            <span>Đáp án chuẩn: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                          </div>

                          {/* Distractor Warning Block */}
                          {q.distractor && q.distractor !== 'None' && (
                            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded text-xs space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                <span>BẪY GÂY NHIỄU (DISTRACTOR TRONG BÀI THI):</span>
                              </div>
                              <p className="text-amber-950">
                                Thông tin làm bạn nghe nhầm: <strong className="underline">{q.distractor}</strong>
                              </p>
                              {q.distractorNote && (
                                <p className="text-[11px] text-amber-900 pt-1">
                                  <strong>Giải thích thủ thuật:</strong> {q.distractorNote}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Answer sentence in audio */}
                          {q.answerSentence && (
                            <div className="p-2.5 bg-emerald-50/60 rounded border border-emerald-100 text-[11px] text-emerald-950 font-sans">
                              <span className="font-bold text-emerald-900 block font-mono text-[10px] uppercase">
                                Câu chứa đáp án trong bài nghe:
                              </span>
                              <p className="italic mt-0.5">"{q.answerSentence}"</p>
                            </div>
                          )}

                          {/* Mistake Tagging Selector */}
                          {!isCorrect && (
                            <div className="p-2.5 bg-slate-100 rounded space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-700 uppercase font-mono block">
                                Gắn thẻ lỗi sai để hệ thống theo dõi điểm yếu:
                              </span>
                              <select
                                value={currentMistakeTag || ''}
                                onChange={(e) => handleAssignMistakeTag(q.id, e.target.value as MistakeTagType)}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                              >
                                <option value="">-- Chọn nguyên nhân mắc lỗi --</option>
                                {MISTAKE_TAG_OPTIONS.map(opt => (
                                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Target vocab */}
                          {q.targetVocab && q.targetVocab.length > 0 && (
                            <div className="pt-1 flex flex-wrap gap-2">
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
                                      <span>Lưu từ "{tv.word}" vào SRS</span>
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

              {!sectionSubmitted && (
                <button
                  type="button"
                  onClick={handleSectionSubmit}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Nộp bài & Xem phân tích bẫy Distractor
                </button>
              )}
            </div>

            {/* Right: Collapsible Transcript with Answer Highlights (40%) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 max-h-[750px] overflow-y-auto">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                  TRANSCRIPT BÀI NGHE (LỜI THOẠI)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {showTranscript ? 'Đang mở' : 'Đang ẩn'}
                </span>
              </div>

              {showTranscript ? (
                <div className="text-xs text-slate-700 leading-relaxed font-sans space-y-3 whitespace-pre-line">
                  {currentSection.transcript}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
                  <p>Transcript được ẩn trong lúc làm bài để rèn luyện kỹ năng nghe thật.</p>
                  <p className="text-[11px] text-slate-400">Transcript sẽ tự động mở sau khi bạn bấm "Nộp bài".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FULL TEST MODE VIEW (4 PARTS = 40 QUESTIONS)                           */}
      {/* ========================================================================= */}
      {activeMode === 'full-test' && (
        <div className="space-y-6">
          {/* Top Bar for Full Test */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-700">
                FULL MOCK TEST: 4 PARTS (40 QUESTIONS)
              </span>
            </div>

            {/* Part 1 / 2 / 3 / 4 Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
              {fullTest.sections.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActivePartIndex(idx)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    activePartIndex === idx
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Part {idx + 1}
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
                  Nộp bài thi Listening
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetFullTest}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại đề thi</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Summary if submitted */}
          {isTestSubmitted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600 text-white rounded-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase font-mono">
                      KẾT QUẢ THI THỬ LISTENING
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Điểm thô: {fullTestRawScore} / 40 • Ước tính: Band {estimatedBandScore.toFixed(1)}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Breakdown by Part */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-200 text-xs">
                {fullTest.sections.map((sec, idx) => {
                  const sQuestions = sec.questions;
                  const sCorrect = sQuestions.filter(q => {
                    const ans = (fullTestAnswers[q.id] || '').trim().toLowerCase();
                    return ans === q.correctAnswer.toLowerCase() || (q.acceptableAnswers || []).map(a => a.toLowerCase()).includes(ans);
                  }).length;
                  return (
                    <div key={sec.id} className="p-3 bg-white rounded border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Part {idx + 1}</span>
                      <strong className="text-base font-bold text-slate-900 font-mono">
                        {sCorrect} / {sQuestions.length} đúng
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Part Audio Player */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{activePartSection.title}</h3>
            <AudioPlayer
              audioSources={activePartSection.audioSources}
              transcript={activePartSection.transcript}
              narratorVoice={activePartSection.narratorVoice}
            />
          </div>

          {/* Questions of Active Part */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                CÂU HỎI PART {activePartIndex + 1} ({activePartSection.questions.length} CÂU)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Q{activePartSection.questions[0].number} – Q{activePartSection.questions[activePartSection.questions.length - 1].number}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePartSection.questions.map(q => {
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
                      <div className="flex items-center gap-1 shrink-0">
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

                    {q.options && q.options.length > 0 ? (
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
                    ) : (
                      <div>
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => handleFullTestAnswerChange(q.id, e.target.value)}
                          placeholder="Điền đáp án..."
                          disabled={isTestSubmitted}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs font-sans focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                    )}

                    {isTestSubmitted && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span>Bạn chọn: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userVal || '(chưa điền)'}</strong></span>
                          <span>Đáp án đúng: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                        </div>
                        {q.distractor && q.distractor !== 'None' && (
                          <p className="text-amber-800">
                            <strong>Bẫy distractor:</strong> {q.distractor} - {q.distractorNote}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Fixed Q1-Q40 Palette */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 font-mono">BẢNG ĐIỀU HƯỚNG LISTENING Q1 – Q40</span>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-900"></span> Đã điền</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-200"></span> Chưa điền</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Gắn cờ</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {allFullTestQuestions.map(({ question: q, partIndex: pIdx }) => {
                const hasAnswer = !!(fullTestAnswers[q.id] || '').trim();
                const isFlagged = !!flaggedQuestions[q.number];
                const isCurrentPart = pIdx === activePartIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setActivePartIndex(pIdx)}
                    className={`w-7 h-7 rounded text-[11px] font-mono font-bold flex items-center justify-center cursor-pointer transition-colors border ${
                      isFlagged
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : hasAnswer
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    } ${isCurrentPart ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
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
            <h3 className="text-base font-bold text-slate-900">Xác Nhận Nộp Bài Thi Listening</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn đã hoàn thành {Object.keys(fullTestAnswers).filter(k => (fullTestAnswers[k] || '').trim() !== '').length} / 40 câu hỏi.
              Bạn có chắc chắn muốn nộp bài để xem kết quả và phân tích chi tiết bẫy distractor?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSubmitConfirmModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer"
              >
                Tiếp tục kiểm tra
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
