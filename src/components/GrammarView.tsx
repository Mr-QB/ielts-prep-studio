import React, { useState, useEffect } from 'react';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import { GrammarCategory, GrammarProgressStatus } from '../types';
import { loadGrammarProgress, saveGrammarProgress } from '../utils/db';
import { CheckCircle2, Circle, Clock, Check, X, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const GrammarView: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [categoryFilter, setCategoryFilter] = useState<GrammarCategory | 'all'>('all');
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

  const filteredTopics = GRAMMAR_TOPICS.filter(t => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
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
    // If not completed, mark as learning
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
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                GRAMMATICAL RANGE & ACCURACY • PROGRESSION CURRICULUM
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">Từ Nền Tảng (4.0) tới Nâng Cao (7.0+)</span>
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

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'all', label: 'Tất cả 26 bài' },
            { id: 'foundation', label: '1. Foundation (G01–G06: Band 4.0 - 5.5)' },
            { id: 'core', label: '2. Core IELTS (G07–G20: Band 6.0 - 7.0)' },
            { id: 'advanced', label: '3. Advanced (G21–G26: Band 7.5+)' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors border ${
                categoryFilter === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Left Topics Navigator / Right Active Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topics List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-3 shadow-xs max-h-[750px] overflow-y-auto space-y-1">
          {filteredTopics.map(topic => {
            const isSelected = topic.id === currentTopic.id;
            const status = progressMap[topic.id] || 'not-started';

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
                    isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {topic.code}
                  </span>
                  <span className="truncate">{topic.title}</span>
                </div>

                {status === 'completed' ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />
                ) : status === 'learning' ? (
                  <Clock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-amber-500'}`} />
                ) : (
                  <Circle className={`w-3 h-3 shrink-0 ${isSelected ? 'text-slate-500' : 'text-slate-300'}`} />
                )}
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
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                  <p className="font-semibold text-slate-900">"{ex.sentence}"</p>
                  <p className="text-slate-500 font-mono text-[11px]">{ex.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Common Mistake & Fix */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider block">
              LỖI SAI ĐIỂN HÌNH & CÁCH KHẮC PHỤC
            </span>
            <div className="p-4 bg-rose-50/40 border border-rose-200 rounded-lg text-xs space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-bold text-rose-700 shrink-0">Lỗi sai:</span>
                <span className="text-slate-800 line-through">"{currentTopic.commonMistake.incorrect}"</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700 shrink-0">Sửa đúng:</span>
                <span className="text-slate-900 font-semibold">"{currentTopic.commonMistake.corrected}"</span>
              </div>
              <p className="text-slate-600 font-mono text-[11px] pt-1 border-t border-rose-100">
                {currentTopic.commonMistake.explanation}
              </p>
            </div>
          </div>

          {/* Section 5: Mini Interactive Exercise */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider block">
              BÀI TẬP NHANH (MINI EXERCISE)
            </span>
            {currentTopic.exercises.map((ex) => {
              const userVal = exerciseAnswers[ex.id] || '';
              const isChecked = Boolean(exerciseChecked[ex.id]);
              const isCorrect = isChecked && (
                userVal.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase() ||
                (ex.acceptableAnswers || []).map(a => a.trim().toLowerCase()).includes(userVal.trim().toLowerCase())
              );

              return (
                <div key={ex.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-3 text-xs">
                  <p className="font-medium text-slate-900 whitespace-pre-line leading-relaxed">{ex.question}</p>

                  {ex.type === 'multiple-choice' && ex.options ? (
                    <div className="space-y-1.5">
                      {ex.options.map(opt => {
                        const letter = opt.charAt(0);
                        const isSelected = userVal.toUpperCase() === letter.toUpperCase();
                        return (
                          <label
                            key={opt}
                            className={`flex items-start gap-2 p-2 rounded cursor-pointer border transition-colors ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 font-medium'
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`ex-${ex.id}`}
                              value={letter}
                              checked={isSelected}
                              onChange={() => handleExerciseChange(ex.id, letter)}
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
                      value={userVal}
                      placeholder="Nhập câu trả lời viết lại / điền từ..."
                      onChange={(e) => handleExerciseChange(ex.id, e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600"
                    />
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleCheckExercise(ex.id)}
                      disabled={!userVal.trim()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded text-xs font-semibold cursor-pointer"
                    >
                      Kiểm Tra Đáp Án
                    </button>
                  </div>

                  {isChecked && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs space-y-1">
                      {isCorrect ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Chính xác!
                        </span>
                      ) : (
                        <span className="text-rose-700 font-semibold flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Chưa chính xác. Đáp án đúng: {ex.correctAnswer}
                        </span>
                      )}
                      <p className="text-slate-600 font-mono text-[11px]">{ex.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Section 6: IELTS Context Example */}
          <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs space-y-1">
            <span className="font-bold text-slate-800 text-[11px] font-mono uppercase block">
              ỨNG DỤNG THỰC TẾ TRONG WRITING/SPEAKING:
            </span>
            <p className="text-slate-700">{currentTopic.ieltsApplication}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
