import React, { useState, useEffect } from 'react';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import { GrammarProgressStatus } from '../types';
import { loadGrammarProgress, saveGrammarProgress } from '../utils/db';
import { CheckCircle2, Circle, Clock, Check, X, ArrowRight, BookOpen, Layers, AlertCircle, Sparkles } from 'lucide-react';

export const GrammarView: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [tierFilter, setTierFilter] = useState<'all' | 'essential' | 'advanced'>('all');
  const [progressMap, setProgressMap] = useState<Record<string, GrammarProgressStatus>>({});

  // Interactive exercise state
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [exerciseChecked, setExerciseChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadGrammarProgress().then(res => {
      setProgressMap(res || {});
    });
  }, []);

  const currentTopic = GRAMMAR_TOPICS.find(t => t.id === selectedTopicId) || GRAMMAR_TOPICS[0];
  const isCurrentTopicAdvanced = currentTopic.category === 'advanced' || parseInt(currentTopic.code.replace('G', ''), 10) >= 21;

  const filteredTopics = GRAMMAR_TOPICS.filter(t => {
    const isAdv = t.category === 'advanced' || parseInt(t.code.replace('G', ''), 10) >= 21;
    if (tierFilter === 'essential') return !isAdv;
    if (tierFilter === 'advanced') return isAdv;
    return true;
  });

  const handleUpdateStatus = (topicId: string, status: GrammarProgressStatus) => {
    const updated = { ...progressMap, [topicId]: status };
    setProgressMap(updated);
    saveGrammarProgress(topicId, status);
  };

  const handleExerciseChange = (exId: string, val: string) => {
    setExerciseAnswers(prev => ({ ...prev, [exId]: val }));
  };

  const handleCheckExercise = (exId: string) => {
    setExerciseChecked(prev => ({ ...prev, [exId]: true }));
    if (!progressMap[currentTopic.id] || progressMap[currentTopic.id] === 'not-started') {
      handleUpdateStatus(currentTopic.id, 'learning');
    }
  };

  // Stats
  const completedCount = Object.values(progressMap).filter(s => s === 'completed').length;
  const learningCount = Object.values(progressMap).filter(s => s === 'learning').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Progress Stats */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                GRAMMATICAL RANGE & ACCURACY • PROGRESSION CURRICULUM
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">Lộ trình Band 4.0 → 6.5 → 7.0</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              26 Chủ Điểm Ngữ Pháp IELTS Thực Chiến
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500">Đã hoàn thành: </span>
              <span className="font-bold text-slate-900 font-mono">{completedCount} / 26</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-500">Đang học: </span>
              <span className="font-bold text-slate-900 font-mono">{learningCount}</span>
            </div>
          </div>
        </div>

        {/* Essential vs Advanced Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setTierFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors border ${
              tierFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả 26 bài (Toàn bộ)
          </button>

          <button
            type="button"
            onClick={() => setTierFilter('essential')}
            className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors border flex items-center gap-1.5 ${
              tierFilter === 'essential'
                ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>ESSENTIAL — Band 4.0 → 6.5 (G01–G20 • Học trước)</span>
          </button>

          <button
            type="button"
            onClick={() => setTierFilter('advanced')}
            className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors border flex items-center gap-1.5 ${
              tierFilter === 'advanced'
                ? 'bg-purple-900 text-white border-purple-900 font-semibold shadow-xs'
                : 'bg-white text-purple-800 border-purple-300 hover:bg-purple-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>ADVANCED — Optional Band 7+ (G21–G26 • Tùy chọn)</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Topics Navigator / Right Active Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topics List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-3 shadow-xs max-h-[750px] overflow-y-auto space-y-1">
          {filteredTopics.map(topic => {
            const isSelected = topic.id === currentTopic.id;
            const status = progressMap[topic.id] || 'not-started';
            const isAdv = topic.category === 'advanced' || parseInt(topic.code.replace('G', ''), 10) >= 21;

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  setExerciseChecked({});
                }}
                className={`w-full text-left p-2.5 rounded text-xs transition-colors cursor-pointer border flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-800 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] shrink-0 ${
                    isSelected
                      ? 'bg-slate-700 text-slate-200'
                      : isAdv
                      ? 'bg-purple-100 text-purple-800 font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {topic.code}
                  </span>
                  <span className="truncate">{topic.title}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isAdv && !isSelected && (
                    <span className="text-[9px] px-1 py-0.2 bg-purple-50 text-purple-700 border border-purple-200 rounded">
                      7+
                    </span>
                  )}
                  {status === 'completed' ? (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />
                  ) : status === 'learning' ? (
                    <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-amber-500'}`} />
                  ) : (
                    <Circle className={`w-3 h-3 ${isSelected ? 'text-slate-500' : 'text-slate-300'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Lesson Content */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          {/* Lesson Header */}
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-xs font-bold">
                  {currentTopic.code}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase font-mono ${
                  currentTopic.category === 'foundation'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : currentTopic.category === 'core'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-purple-50 text-purple-800 border border-purple-200'
                }`}>
                  {currentTopic.category}
                </span>
                {isCurrentTopicAdvanced && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                    Optional for Band 7+
                  </span>
                )}
              </div>

              {/* Status Toggle Button */}
              <div className="flex items-center gap-1">
                {(['not-started', 'learning', 'completed'] as GrammarProgressStatus[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(currentTopic.id, st)}
                    className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer border ${
                      (progressMap[currentTopic.id] || 'not-started') === st
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st === 'not-started' ? 'Chưa học' : st === 'learning' ? 'Đang học' : 'Đã xong ✓'}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{currentTopic.title}</h2>

            {/* Optional for Band 7+ Banner Alert */}
            {isCurrentTopicAdvanced && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-950 flex items-start gap-2.5 mt-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Lưu ý cho người học Band 4.0 → 6.0:</strong>
                  <p className="mt-0.5 text-amber-900">
                    Đây là cấu trúc ngữ pháp nâng cao (Band 7+). Nếu bạn đang ở band 4.0 - 5.5, hãy ưu tiên nắm vững 20 chủ điểm Essential (G01–G20) trước, tránh mất quá nhiều thời gian vào cấu trúc phức tạp hiếm gặp.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 1: Why it matters in IELTS */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 space-y-1">
            <span className="font-bold text-slate-900 block font-mono text-[11px] uppercase tracking-wider">
              TẠI SAO QUAN TRỌNG TRONG BÀI THI IELTS?
            </span>
            <p className="leading-relaxed">{currentTopic.whyItMatters}</p>
          </div>

          {/* Section 2: Formula & Concept */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider block">
              CÔNG THỨC & NGUYÊN TẮC CỐT LÕI
            </span>
            <div className="p-3 bg-slate-900 text-slate-100 rounded-md font-mono text-xs overflow-x-auto">
              {currentTopic.formula}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{currentTopic.concept}</p>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-700">
              {currentTopic.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">{rule}</li>
              ))}
            </ul>
          </div>

          {/* Section 3: Concise Examples */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider block">
              VÍ DỤ NGỮ CẢNH CHUẨN MỰC
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {currentTopic.examples.map((ex, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                  <p className="font-medium text-slate-900">"{ex.sentence}"</p>
                  <p className="text-slate-500 italic text-[11px]">{ex.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Common Mistake & Correction */}
          <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-lg text-xs space-y-2">
            <span className="font-bold text-rose-900 block font-mono text-[11px] uppercase tracking-wider">
              LỖI SAI KINH ĐIỂN CẦN TRÁNH TRONG IELTS
            </span>
            <div className="space-y-1">
              <p className="text-rose-800">
                <span className="font-semibold text-rose-900">Sai: </span>
                <span className="line-through">{currentTopic.commonMistake.incorrect}</span>
              </p>
              <p className="text-emerald-800">
                <span className="font-semibold text-emerald-900">Đúng: </span>
                <span className="font-medium">{currentTopic.commonMistake.corrected}</span>
              </p>
            </div>
            <p className="text-slate-700 text-[11px] pt-1 border-t border-rose-100">
              <strong>Giải thích:</strong> {currentTopic.commonMistake.explanation}
            </p>
          </div>

          {/* Section 5: Interactive Mini Exercises */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                BÀI TẬP VẬN DỤNG TỨC THÌ (MINI-TEST)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {currentTopic.exercises.length} câu hỏi
              </span>
            </div>

            <div className="space-y-4">
              {currentTopic.exercises.map(ex => {
                const isChecked = !!exerciseChecked[ex.id];
                const userVal = (exerciseAnswers[ex.id] || '').trim();
                const isCorrect = userVal.toLowerCase() === ex.correctAnswer.toLowerCase() ||
                  (ex.acceptableAnswers || []).map(a => a.toLowerCase()).includes(userVal.toLowerCase());

                return (
                  <div key={ex.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                    <p className="font-medium text-slate-900">{ex.question}</p>

                    {ex.type === 'multiple-choice' && ex.options && (
                      <div className="space-y-1.5">
                        {ex.options.map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={ex.id}
                              value={opt[0]}
                              checked={userVal === opt[0]}
                              onChange={(e) => handleExerciseChange(ex.id, e.target.value)}
                              disabled={isChecked}
                              className="text-slate-900 focus:ring-slate-900"
                            />
                            <span className="text-slate-800">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {(ex.type === 'fill-gap' || ex.type === 'rewrite') && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => handleExerciseChange(ex.id, e.target.value)}
                          placeholder="Nhập câu trả lời của bạn..."
                          disabled={isChecked}
                          className="flex-1 px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-900 text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                    )}

                    {!isChecked ? (
                      <button
                        type="button"
                        onClick={() => handleCheckExercise(ex.id)}
                        disabled={!userVal}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                      >
                        Kiểm tra đáp án
                      </button>
                    ) : (
                      <div className={`p-3 rounded border text-xs space-y-1 ${
                        isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                          <span>{isCorrect ? 'Chính xác!' : `Chưa đúng. Đáp án: ${ex.correctAnswer}`}</span>
                        </div>
                        <p className="text-[11px] text-slate-700">{ex.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
