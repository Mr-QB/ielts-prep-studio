import React, { useState, useEffect } from 'react';
import { LISTENING_FULL_TESTS, LISTENING_SECTIONS } from '../data/listeningData';
import { LISTENING_PRACTICE_SECTIONS } from '../data/listeningPracticeData';
import { LISTENING_STRATEGY_LESSONS } from '../data/listeningStrategyData';
import { ListeningQuestion, ListeningSection, MistakeTagType, TestAttempt } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { recordAttempt, addWordToVocabDeck, lookupVocabularyApi } from '../utils/db';
import { calculateListeningBand, formatTime } from '../utils/ieltsScoring';
import { WordCapturePopover } from './WordCapturePopover';

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
  // 3 Primary Tabs
  const [activeTab, setActiveTab] = useState<'by-skill' | 'by-part' | 'full-test'>('by-skill');

  // MODE 1: BY SKILL (STRATEGY & MICRO-LESSONS)
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(LISTENING_STRATEGY_LESSONS[0].id);
  const activeStrategyLesson = LISTENING_STRATEGY_LESSONS.find(s => s.id === selectedStrategyId) || LISTENING_STRATEGY_LESSONS[0];
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillChecked, setDrillChecked] = useState<Record<string, boolean>>({});

  // MODE 2: BY PART (PRACTICE SECTIONS)
  const allAvailableSections = [...LISTENING_SECTIONS, ...LISTENING_PRACTICE_SECTIONS];
  const [selectedPartFilter, setSelectedPartFilter] = useState<1 | 2 | 3 | 4>(1);
  const sectionsInSelectedPart = allAvailableSections.filter(s => s.part === selectedPartFilter);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    sectionsInSelectedPart[0]?.id || allAvailableSections[0].id
  );
  const currentSection = allAvailableSections.find(s => s.id === selectedSectionId) || allAvailableSections[0];

  const [sectionAnswers, setSectionAnswers] = useState<Record<string, string>>({});
  const [sectionSubmitted, setSectionSubmitted] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [mistakeTagSelections, setMistakeTagSelections] = useState<Record<string, MistakeTagType>>({});
  const [addedVocabWords, setAddedVocabWords] = useState<Record<string, boolean>>({});

  // MODE 3: FULL TEST (40 QUESTIONS)
  const fullTest = LISTENING_FULL_TESTS[0];
  const [activeFullTestPartIndex, setActiveFullTestPartIndex] = useState<number>(0);
  const [fullTestAnswers, setFullTestAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);

  // Flatten all 40 questions of Full Test
  const allFullTestQuestions = fullTest.sections.flatMap((s, sIdx) =>
    s.questions.map(q => ({ question: q, partIndex: sIdx }))
  );
  const activePartSection = fullTest.sections[activeFullTestPartIndex];

  // Reset states on section change
  useEffect(() => {
    setSectionAnswers({});
    setSectionSubmitted(false);
    setShowTranscript(false);
    setMistakeTagSelections({});
  }, [selectedSectionId]);

  // Handlers for Strategy Drills
  const handleDrillAnswerChange = (drillId: string, val: string) => {
    setDrillAnswers(prev => ({ ...prev, [drillId]: val }));
  };

  const handleCheckDrill = (drillId: string) => {
    setDrillChecked(prev => ({ ...prev, [drillId]: true }));
  };

  const playTtsSnippet = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Handlers for Section Practice
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
    const lookup = await lookupVocabularyApi(word, sentence);
    const sense = lookup.senses[0];
    if (!sense?.definitionEn || !defVi.trim()) return;
    const res = await addWordToVocabDeck({
      word,
      definitionVi: defVi,
      definitionEn: sense.definitionEn,
      lemma: lookup.lemma,
      phonetic: lookup.phonetic,
      partOfSpeech: sense.partOfSpeech || lookup.partOfSpeech,
      sourceContext: sentence,
      source: 'Listening Context Practice',
      sourceType: 'listening',
      audio: lookup.audio,
      audioSource: lookup.audioSource,
      collocations: lookup.collocations
    });
    if (res.success) {
      setAddedVocabWords(prev => ({ ...prev, [word]: true }));
    }
  };

  // Full Test Handlers
  const handleFullTestAnswerChange = (qId: string, val: string) => {
    if (isTestSubmitted) return;
    setFullTestAnswers(prev => ({ ...prev, [qId]: val }));
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
    const incorrects: number[] = [];
    const mistakes: TestAttempt['mistakeTags'] = [];

    allFullTestQuestions.forEach(({ question: q, partIndex: pIdx }) => {
      const userAns = (fullTestAnswers[q.id] || '').trim();
      const target = q.correctAnswer.trim();
      const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
      const isCorrect = userAns.toLowerCase() === target.toLowerCase() || acceptable.includes(userAns.toLowerCase());

      if (isCorrect) {
        rawScore += 1;
        passageScores[pIdx].score += 1;
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
      passageScores
    });
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
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header & 3 Primary Sub-tabs */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              IELTS Listening Studio • Sổ tay luyện nghe & Bẫy âm thanh
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Chiến Lược & Luyện Nghe IELTS
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Nhận diện bẫy đổi ý (distractor), luyện phản xạ đánh vần chữ cái & con số, và bám sát mạch bài giảng trong 4 Part.
            </p>
          </div>

          {/* 3 Tabs Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('by-skill')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'by-skill'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Học kỹ năng & Bẫy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('by-part')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'by-part'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Luyện theo Part (1–4)
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
              3. Thi thử chuẩn (40 câu)
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HỌC KỸ NĂNG & BẪY (DEFAULT)                                            */}
      {/* ========================================================================= */}
      {activeTab === 'by-skill' && (
        <div className="space-y-6">
          {/* Strategy Lesson Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {LISTENING_STRATEGY_LESSONS.map(lesson => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => {
                  setSelectedStrategyId(lesson.id);
                  setDrillAnswers({});
                  setDrillChecked({});
                }}
                className={`px-3 py-2 rounded text-xs text-left shrink-0 border cursor-pointer ${
                  selectedStrategyId === lesson.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>{lesson.title}</div>
                <div className="text-[11px] opacity-75">{lesson.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Active Lesson View */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            <div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-mono text-xs font-bold">
                KỸ NĂNG CỐT LÕI
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                {activeStrategyLesson.title}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {activeStrategyLesson.subtitle}
              </p>
            </div>

            {/* Signal Words Banner */}
            {activeStrategyLesson.signalWords && activeStrategyLesson.signalWords.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Từ tín hiệu nhận biết bẫy (Signal Words)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeStrategyLesson.signalWords.map(word => (
                    <span
                      key={word}
                      className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs font-mono font-medium"
                    >
                      "{word}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Explanation */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded text-sm text-slate-800 leading-relaxed">
              {activeStrategyLesson.explanation}
            </div>

            {/* Audio Example Demonstration */}
            {activeStrategyLesson.audioExample && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Ví dụ minh họa tình huống bẫy
                </h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Audio: TTS Practice
                    </span>
                    <button
                      type="button"
                      onClick={() => playTtsSnippet(activeStrategyLesson.audioExample!.audioText)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                    >
                      <span>🔊</span>
                      <span>Nghe minh họa (TTS Practice)</span>
                    </button>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded font-serif italic text-slate-900 text-sm">
                    {activeStrategyLesson.audioExample.audioText}
                  </div>
                  <div className="font-semibold text-slate-800">
                    Câu hỏi: {activeStrategyLesson.audioExample.questionPrompt}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-900">
                      <span className="font-bold block">Bẫy thông tin đầu:</span>
                      <span className="line-through">{activeStrategyLesson.audioExample.wrongAnswer}</span>
                      <p className="text-[11px] text-rose-800 mt-1">{activeStrategyLesson.audioExample.whyWrong}</p>
                    </div>
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-950">
                      <span className="font-bold block">Đáp án chính xác:</span>
                      <span className="font-semibold">{activeStrategyLesson.audioExample.correctAnswer}</span>
                      <p className="text-[11px] text-emerald-800 mt-1">Tín hiệu: {activeStrategyLesson.audioExample.signalUsed}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Practice Drills */}
            {activeStrategyLesson.practiceDrills && activeStrategyLesson.practiceDrills.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Bài tập phản xạ tức thì ({activeStrategyLesson.practiceDrills.length} câu)
                  </h3>
                </div>

                <div className="space-y-4">
                  {activeStrategyLesson.practiceDrills.map((drill, idx) => {
                    const isChecked = !!drillChecked[drill.id];
                    const userVal = (drillAnswers[drill.id] || '').trim();
                    const isCorrect = userVal.toLowerCase() === drill.correctAnswer.toLowerCase();

                    return (
                      <div key={drill.id} className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            Audio: TTS Practice
                          </span>
                          <button
                            type="button"
                            onClick={() => playTtsSnippet(drill.audioSnippet)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                          >
                            <span>🔊</span>
                            <span>Nghe đoạn trích (TTS Practice)</span>
                          </button>
                        </div>
                        <div className="p-3 bg-white border border-slate-200 rounded font-serif italic text-slate-900 text-sm">
                          "{drill.audioSnippet}"
                        </div>
                        <div className="font-semibold text-slate-900 text-sm">
                          Câu {idx + 1}. {drill.prompt}
                        </div>

                        {drill.options ? (
                          <div className="flex flex-wrap gap-3">
                            {drill.options.map(opt => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer text-slate-800">
                                <input
                                  type="radio"
                                  name={drill.id}
                                  value={opt}
                                  checked={userVal === opt}
                                  onChange={(e) => handleDrillAnswerChange(drill.id, e.target.value)}
                                  disabled={isChecked}
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
                            onChange={(e) => handleDrillAnswerChange(drill.id, e.target.value)}
                            placeholder="Điền đáp án..."
                            disabled={isChecked}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs w-full max-w-sm"
                          />
                        )}

                        {!isChecked ? (
                          <button
                            type="button"
                            onClick={() => handleCheckDrill(drill.id)}
                            disabled={!userVal}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer disabled:opacity-40 hover:bg-slate-800"
                          >
                            Kiểm tra
                          </button>
                        ) : (
                          <div className={`p-3 rounded border text-xs ${
                            isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                          }`}>
                            <div className="font-bold">
                              {isCorrect ? '✓ Đúng!' : `✗ Chưa đúng. Đáp án: ${drill.correctAnswer}`}
                            </div>
                            <p className="mt-1 text-[11px] text-slate-700 leading-relaxed">{drill.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LUYỆN THEO PART (PART 1–4)                                             */}
      {/* ========================================================================= */}
      {activeTab === 'by-part' && (
        <div className="space-y-6">
          {/* Part 1-4 Switcher */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(pNum => {
              const partNum = pNum as 1 | 2 | 3 | 4;
              const isSelected = selectedPartFilter === partNum;
              const descriptions: Record<number, { title: string; desc: string }> = {
                1: { title: 'Part 1: Đời sống thường nhật', desc: 'Đối thoại: Điền form, họ tên, số điện thoại, ngày giờ' },
                2: { title: 'Part 2: Giới thiệu & Chỉ dẫn', desc: 'Độc thoại: Bản đồ, sự kiện địa phương, thông báo công cộng' },
                3: { title: 'Part 3: Thảo luận học thuật', desc: 'Đối thoại sinh viên / giảng viên: Đề tài nghiên cứu' },
                4: { title: 'Part 4: Bài giảng độc thoại', desc: 'Bài thuyết trình đại học: Từ vựng học thuật, ghi chép ghi chú' }
              };

              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => {
                    setSelectedPartFilter(partNum);
                    const firstInPart = allAvailableSections.find(s => s.part === partNum);
                    if (firstInPart) setSelectedSectionId(firstInPart.id);
                  }}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-xs">{descriptions[pNum].title}</div>
                  <div className={`text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {descriptions[pNum].desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section selector pills in selected part */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {sectionsInSelectedPart.map(sec => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSectionId(sec.id)}
                className={`px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer border ${
                  selectedSectionId === sec.id
                    ? 'bg-blue-900 text-white border-blue-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Main Practice Container */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-xs font-bold">
                    Part {currentSection.part}
                  </span>
                  {/* Audio Status Label */}
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Audio: {currentSection.audioSources?.some(a => a.isStreamable && !a.isSynthetic) ? 'Real Recording' : 'TTS Practice'}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  {currentSection.questions.length} câu hỏi
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900">{currentSection.title}</h2>
              <p className="text-xs text-slate-600">{currentSection.context}</p>
              <div className="text-xs text-slate-500 font-mono">
                Chỉ dẫn: {currentSection.instructions}
              </div>
            </div>

            {/* Audio Player Component */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <AudioPlayer
                transcript={currentSection.questions.map(q => q.answerSentence || '').join('\n')}
                audioSources={currentSection.audioSources}
                narratorVoice={currentSection.narratorVoice}
              />
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {currentSection.questions.map(q => {
                const userVal = (sectionAnswers[q.id] || '').trim();
                const target = q.correctAnswer.trim();
                const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
                const isCorrect = userVal.toLowerCase() === target.toLowerCase() || acceptable.includes(userVal.toLowerCase());

                return (
                  <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        Câu {q.number}. {q.prompt}
                      </span>
                      {sectionSubmitted && (
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] shrink-0 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? 'ĐÚNG ✓' : 'SAI ✗'}
                        </span>
                      )}
                    </div>

                    {/* Options if Multiple Choice */}
                    {q.options && q.options.length > 0 ? (
                      <div className="space-y-1.5">
                        {q.options.map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer text-slate-800">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={userVal === opt || userVal === opt[0]}
                              onChange={(e) => handleSectionAnswerChange(q.id, e.target.value)}
                              disabled={sectionSubmitted}
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
                        onChange={(e) => handleSectionAnswerChange(q.id, e.target.value)}
                        placeholder="Điền từ cần điền..."
                        disabled={sectionSubmitted}
                        className="w-full max-w-md px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-hidden"
                      />
                    )}

                    {/* POST SUBMIT REVIEW SEQUENCE (MANDATORY 6-PART ORDER) */}
                    {sectionSubmitted && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs">
                        {/* 1 & 2. Your Answer vs Correct Answer */}
                        <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span>Bạn trả lời: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userVal || '(chưa điền)'}</strong></span>
                            <span>Đáp án đúng: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                          </div>
                        </div>

                        {/* 3. Transcript Snippet (Dẫn chứng câu nói) */}
                        {q.answerSentence && (
                          <div className="p-2.5 bg-slate-100 rounded text-[11px] text-slate-800">
                            <span className="font-bold text-slate-700 font-mono text-[10px] uppercase block">
                              Dẫn chứng âm thanh trong Transcript:
                            </span>
                            <p className="italic font-serif mt-0.5">"{q.answerSentence}"</p>
                          </div>
                        )}

                        {/* 4. Distractor (Bẫy đổi ý) */}
                        {q.distractor && (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-950 space-y-0.5">
                            <span className="font-bold block uppercase font-mono text-[10px] text-rose-900">
                              Bẫy đánh lừa (Distractor):
                            </span>
                            <p><strong>Thông tin bẫy:</strong> "{q.distractor}"</p>
                            {q.distractorNote && <p className="text-rose-800">{q.distractorNote}</p>}
                          </div>
                        )}

                        {/* 5. Paraphrase Note */}
                        {q.paraphraseNote && (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-950">
                            <strong>Từ đồng nghĩa (Paraphrase):</strong> {q.paraphraseNote}
                          </div>
                        )}

                        {/* 6. My Error Category Tag */}
                        {!isCorrect && (
                          <div className="p-2.5 bg-slate-100 rounded text-[11px] space-y-1.5">
                            <span className="font-semibold text-slate-700 block">
                              Gắn thẻ lỗi sai vào sổ tay:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {MISTAKE_TAG_OPTIONS.map(tag => (
                                <button
                                  key={tag.id}
                                  type="button"
                                  onClick={() => handleAssignMistakeTag(q.id, tag.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                                    mistakeTagSelections[q.id] === tag.id
                                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  {tag.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 7. Add to Vocab Deck */}
                        {q.targetVocab && q.targetVocab.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-1.5">
                            {q.targetVocab.map(tv => (
                              <button
                                key={tv.word}
                                type="button"
                                onClick={() => handleAddWordToVocab(tv.word, tv.definitionVi, tv.contextSentence)}
                                disabled={!!addedVocabWords[tv.word]}
                                className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-[11px] text-slate-700 cursor-pointer disabled:opacity-50"
                              >
                                {addedVocabWords[tv.word] ? `✓ Đã lưu "${tv.word}"` : `+ Lưu từ "${tv.word}" (${tv.definitionVi})`}
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

            {/* Bottom Actions */}
            {!sectionSubmitted ? (
              <button
                type="button"
                onClick={handleSectionSubmit}
                className="w-full py-2.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Nộp bài & Xem phân tích bẫy nghe
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setSectionAnswers({}); setSectionSubmitted(false); }}
                className="w-full py-2 bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Làm lại phần thi này
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. THI THỬ CHUẨN (FULL TEST 40 CÂU)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'full-test' && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded">
                Full Test • 4 Sections (40 câu)
              </span>
            </div>

            {/* Part Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
              {[0, 1, 2, 3].map(idx => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveFullTestPartIndex(idx)}
                  className={`px-3 py-1 rounded font-medium cursor-pointer ${
                    activeFullTestPartIndex === idx
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Part {idx + 1}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div>
              {!isTestSubmitted ? (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Nộp bài thi Listening
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFullTestAnswers({});
                    setFlaggedQuestions({});
                    setIsTestSubmitted(false);
                    setActiveFullTestPartIndex(0);
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
                  <div className="text-xs text-slate-500 font-mono">KẾT QUẢ THI THỬ LISTENING</div>
                  <div className="text-xl font-bold text-slate-900">
                    Đúng {fullTestRawScore} / 40 câu
                  </div>
                </div>
                <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-center">
                  <div className="text-[10px] text-blue-700 uppercase font-mono">Dự phóng Band</div>
                  <div className="text-lg font-bold text-blue-900 font-mono">Band {estimatedBandScore}</div>
                </div>
              </div>

              {/* 40 Question Palette */}
              <div className="space-y-1">
                <div className="text-xs text-slate-500">Bảng kết quả 40 câu:</div>
                <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
                  {allFullTestQuestions.map(({ question: q, partIndex: pIdx }) => {
                    const userVal = (fullTestAnswers[q.id] || '').trim().toLowerCase();
                    const target = q.correctAnswer.trim().toLowerCase();
                    const acceptable = (q.acceptableAnswers || []).map(a => a.trim().toLowerCase());
                    const isCorrect = userVal === target || acceptable.includes(userVal);

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveFullTestPartIndex(pIdx)}
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

          {/* Active Part in Full Test */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <span className="font-mono text-xs text-slate-500">Listening Part {activePartSection.part}</span>
              <h2 className="text-lg font-bold text-slate-900">{activePartSection.title}</h2>
              <p className="text-xs text-slate-600 mt-0.5">{activePartSection.context}</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <AudioPlayer
                transcript={activePartSection.questions.map(q => q.answerSentence || '').join('\n')}
                audioSources={activePartSection.audioSources}
                narratorVoice={activePartSection.narratorVoice}
              />
            </div>

            <div className="space-y-4">
              {activePartSection.questions.map(q => {
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
                              name={`full-l-${q.id}`}
                              value={opt}
                              checked={userVal === opt || userVal === opt[0]}
                              onChange={(e) => handleFullTestAnswerChange(q.id, e.target.value)}
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
                        onChange={(e) => handleFullTestAnswerChange(q.id, e.target.value)}
                        placeholder="Điền đáp án..."
                        disabled={isTestSubmitted}
                        className="w-full max-w-md px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-hidden"
                      />
                    )}

                    {isTestSubmitted && (
                      <div className="pt-2 border-t border-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span>Bạn chọn: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{userVal || '(chưa điền)'}</strong></span>
                          <span>Đáp án: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                        </div>
                        {q.answerSentence && (
                          <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                            "{q.answerSentence}"
                          </p>
                        )}
                        {q.distractorNote && (
                          <p className="text-[11px] text-rose-800">Bẫy: {q.distractorNote}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirm Submit Modal */}
          {showSubmitConfirmModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg space-y-4">
                <h3 className="font-bold text-base text-slate-900">Xác nhận nộp bài Listening</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bạn đã làm{' '}
                  <strong className="font-mono text-slate-900">
                    {Object.keys(fullTestAnswers).length} / 40
                  </strong>{' '}
                  câu. Bạn có muốn nộp bài để xem điểm và phân tích các bẫy đổi ý không?
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

      {/* Floating Word Capture from Listening Transcripts */}
      <WordCapturePopover sourceLabel="Listening Practice" sourceType="listening" />
    </div>
  );
};
