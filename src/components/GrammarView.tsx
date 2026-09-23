import React, { useState, useEffect } from 'react';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import { GrammarProgressStatus } from '../types';
import { loadGrammarProgress, saveGrammarProgress } from '../utils/db';

interface GrammarCategoryGroup {
  id: string;
  titleVi: string;
  titleEn: string;
  tag?: string;
  codes: string[];
}

const GRAMMAR_CATEGORY_GROUPS: GrammarCategoryGroup[] = [
  {
    id: 'sentence-tenses',
    titleVi: '1. Nền tảng câu & Thì cốt lõi',
    titleEn: 'Sentence Basics & Tenses',
    tag: 'Foundation',
    codes: ['G01', 'G02', 'G03']
  },
  {
    id: 'nouns-articles',
    titleVi: '2. Danh từ, Mạo từ & Quy chiếu',
    titleEn: 'Nouns, Articles & Referencing',
    tag: 'Foundation',
    codes: ['G04', 'G05', 'G06']
  },
  {
    id: 'description-comparisons',
    titleVi: '3. Mô tả & So sánh (Task 1 & Task 2)',
    titleEn: 'Modifiers, Comparisons & Prepositions',
    tag: 'Core Task 1 & 2',
    codes: ['G07', 'G08', 'G09', 'G10']
  },
  {
    id: 'clauses-passive',
    titleVi: '4. Mệnh đề, Động từ khuyết thiếu & Bị động',
    titleEn: 'Relative Clauses, Modals & Passive',
    tag: 'Core Sentence Variety',
    codes: ['G11', 'G12', 'G13', 'G14']
  },
  {
    id: 'complex-conditionals',
    titleVi: '5. Câu phức & Câu điều kiện',
    titleEn: 'Conditionals & Subordination',
    tag: 'Complex Sentences',
    codes: ['G15', 'G16']
  },
  {
    id: 'cohesion-hedging',
    titleVi: '6. Liên kết ý & Phong cách học thuật',
    titleEn: 'Discourse, Cause-Effect & Hedging',
    tag: 'Academic Writing',
    codes: ['G17', 'G18', 'G19', 'G20']
  },
  {
    id: 'advanced-variety',
    titleVi: '7. Cấu trúc nâng cao (Tùy chọn Band 7+)',
    titleEn: 'Inversion, Cleft Sentences & Participles',
    tag: 'Optional 7+',
    codes: ['G21', 'G22', 'G23', 'G24', 'G25', 'G26']
  }
];

export const GrammarView: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [selectedCategoryGroupId, setSelectedCategoryGroupId] = useState<string>('sentence-tenses');
  const [searchQuery, setSearchQuery] = useState<string>('');
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
      handleUpdateStatus(currentTopic.id, 'studying');
    }
  };

  // Stats
  const completedCount = Object.values(progressMap).filter(s => s === 'mastered').length;
  const learningCount = Object.values(progressMap).filter(s => s === 'studying').length;

  // Active category group
  const activeGroup = GRAMMAR_CATEGORY_GROUPS.find(g => g.id === selectedCategoryGroupId) || GRAMMAR_CATEGORY_GROUPS[0];
  const topicsInActiveGroup = GRAMMAR_TOPICS.filter(t => activeGroup.codes.includes(t.code));

  // Search filtered topics
  const searchFilteredTopics = searchQuery.trim()
    ? GRAMMAR_TOPICS.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.concept.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Page Title & Study Overview */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              Sổ tay ngữ pháp IELTS • Lộ trình Band 4.0 → 6.5
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              26 Chủ Điểm Ngữ Pháp Thực Chiến
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Học theo 7 nhóm chuyên đề ứng dụng trực tiếp cho Writing & Speaking. Không học công thức rườm rà — chỉ tập trung cấu trúc tạo câu chính xác và tránh lỗi mất điểm.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0 self-start sm:self-auto">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
              Đã vững: <strong className="font-mono text-slate-900">{completedCount}</strong>/26
            </div>
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
              Đang học: <strong className="font-mono text-slate-900">{learningCount}</strong>
            </div>
          </div>
        </div>

        {/* 7 Human-friendly category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 scrollbar-none">
          {GRAMMAR_CATEGORY_GROUPS.map(group => {
            const isSelected = selectedCategoryGroupId === group.id && !searchQuery.trim();
            const groupTopics = GRAMMAR_TOPICS.filter(t => group.codes.includes(t.code));
            const groupMastered = groupTopics.filter(t => progressMap[t.id] === 'mastered').length;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  setSelectedCategoryGroupId(group.id);
                  setSearchQuery('');
                  // Auto-select first topic in this group if current isn't in it
                  if (!group.codes.includes(currentTopic.code)) {
                    const firstInGroup = GRAMMAR_TOPICS.find(t => t.code === group.codes[0]);
                    if (firstInGroup) {
                      setSelectedTopicId(firstInGroup.id);
                      setExerciseChecked({});
                    }
                  }
                }}
                className={`px-3 py-2 rounded text-xs text-left shrink-0 transition-colors border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-medium">{group.titleVi}</div>
                <div className="text-[11px] opacity-75 mt-0.5 flex items-center justify-between gap-2">
                  <span>{group.tag}</span>
                  <span className="font-mono">{groupMastered}/{group.codes.length}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topics Navigator within active group */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">
              {searchQuery ? `Tìm kiếm: "${searchQuery}"` : activeGroup.titleVi}
            </span>
            <span className="font-mono">
              {(searchFilteredTopics || topicsInActiveGroup).length} bài
            </span>
          </div>

          {/* Quick Filter Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên bài, cấu trúc..."
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Topics List */}
          <div className="bg-white border border-slate-200 rounded-lg p-2 space-y-1">
            {(searchFilteredTopics || topicsInActiveGroup).map(topic => {
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
                      : 'bg-white text-slate-800 border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`px-1.5 py-0.5 rounded font-mono text-[11px] shrink-0 font-bold ${
                      isSelected
                        ? 'bg-slate-800 text-slate-200'
                        : isAdv
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {topic.code}
                    </span>
                    <span className="truncate">{topic.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-[11px]">
                    {status === 'mastered' ? (
                      <span className={isSelected ? 'text-emerald-300 font-bold' : 'text-emerald-600 font-bold'}>✓</span>
                    ) : status === 'studying' ? (
                      <span className={isSelected ? 'text-amber-300' : 'text-amber-600'}>●</span>
                    ) : (
                      <span className={isSelected ? 'text-slate-400' : 'text-slate-300'}>○</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Band Guidance Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Lời khuyên Band 4.0 → 6.5:</div>
            <p className="text-[12px] leading-relaxed">
              Mục tiêu là câu ít lỗi sai ngữ pháp cơ bản (chia thì, số ít/nhiều, mạo từ). 20 bài đầu (G01–G20) chiếm 90% sự tiến bộ của bạn. 6 bài cuối (G21–G26) chỉ học khi điểm ngữ pháp cơ bản đã đạt trên 80%.
            </p>
          </div>
        </div>

        {/* Right Column: 7-Part Micro-Lesson View */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          {/* Header & Status Toggle */}
          <div className="border-b border-slate-200 pb-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-xs font-bold">
                  {currentTopic.code}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium font-mono uppercase ${
                  isCurrentTopicAdvanced
                    ? 'bg-purple-100 text-purple-900 border border-purple-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  {isCurrentTopicAdvanced ? 'Band 7+ Optional' : 'Band 4.0 - 6.5 Essential'}
                </span>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center gap-1 text-xs">
                {(['not-started', 'studying', 'mastered'] as GrammarProgressStatus[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(currentTopic.id, st)}
                    className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer border transition-colors ${
                      (progressMap[currentTopic.id] || 'not-started') === st
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st === 'not-started' ? 'Chưa học' : st === 'studying' ? 'Đang học' : 'Đã nắm vững ✓'}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {currentTopic.title}
            </h2>

            {isCurrentTopicAdvanced && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                <strong>Lưu ý:</strong> Đây là chủ điểm nâng cao (Band 7+). Hãy chắc chắn bạn đã nắm vững 20 chủ điểm cơ bản trước khi đầu tư thời gian vào dạng này.
              </div>
            )}
          </div>

          {/* Part 1: Cần nhớ trong 30s */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Cần nhớ trong 30 giây
            </h3>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-sm text-slate-800 leading-relaxed">
              {currentTopic.concept}
            </div>
          </div>

          {/* Part 2: Khi nào dùng trong IELTS */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Ứng dụng trong IELTS (Writing / Speaking / Reading)
            </h3>
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded text-sm text-blue-950 leading-relaxed space-y-1">
              <div>{currentTopic.whyItMatters}</div>
              {currentTopic.ieltsApplication && (
                <div className="pt-1.5 border-t border-blue-200/60 text-xs text-blue-900 font-medium">
                  {currentTopic.ieltsApplication}
                </div>
              )}
            </div>
          </div>

          {/* Part 3: Công thức & Quy tắc */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Công thức & Quy tắc cốt lõi
            </h3>
            <div className="p-3 bg-slate-900 text-slate-100 rounded font-mono text-xs overflow-x-auto leading-relaxed">
              {currentTopic.formula}
            </div>
            <ul className="space-y-1.5 text-sm text-slate-700 list-disc list-inside pt-1">
              {currentTopic.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">{rule}</li>
              ))}
            </ul>
          </div>

          {/* Part 4 & 5: Ví dụ dễ hiểu & Ví dụ ngữ cảnh IELTS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4 & 5. Ví dụ chuẩn mực
            </h3>
            <div className="space-y-2">
              {currentTopic.examples.map((ex, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-sm space-y-1">
                  <div className="font-medium text-slate-900">"{ex.sentence}"</div>
                  <div className="text-xs text-slate-500 italic">{ex.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Part 6: Lỗi người Việt hay sai nhất */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              6. Lỗi sai kinh điển cần tránh
            </h3>
            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded text-xs space-y-2">
              <div>
                <span className="font-semibold text-rose-900">Sai: </span>
                <span className="line-through text-rose-800">{currentTopic.commonMistake.incorrect}</span>
              </div>
              <div>
                <span className="font-semibold text-emerald-900">Đúng: </span>
                <span className="font-medium text-emerald-800">{currentTopic.commonMistake.corrected}</span>
              </div>
              <div className="pt-2 border-t border-rose-200/80 text-slate-700 leading-relaxed text-[12px]">
                <strong>Giải thích:</strong> {currentTopic.commonMistake.explanation}
              </div>
            </div>
          </div>

          {/* Part 7: Mini Practice (Vận dụng tức thì) */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                7. Luyện tập tức thì (Mini Practice)
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {currentTopic.exercises.length} câu
              </span>
            </div>

            <div className="space-y-4">
              {currentTopic.exercises.map(ex => {
                const isChecked = !!exerciseChecked[ex.id];
                const userVal = (exerciseAnswers[ex.id] || '').trim();
                const isCorrect = userVal.toLowerCase() === ex.correctAnswer.toLowerCase() ||
                  (ex.acceptableAnswers || []).map(a => a.toLowerCase()).includes(userVal.toLowerCase());

                return (
                  <div key={ex.id} className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
                    <div className="font-medium text-slate-900 text-sm">{ex.question}</div>

                    {ex.type === 'multiple-choice' && ex.options && (
                      <div className="space-y-2">
                        {ex.options.map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer text-slate-800">
                            <input
                              type="radio"
                              name={ex.id}
                              value={opt[0]}
                              checked={userVal === opt[0]}
                              onChange={(e) => handleExerciseChange(ex.id, e.target.value)}
                              disabled={isChecked}
                              className="text-slate-900"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {(ex.type === 'fill-gap' || ex.type === 'rewrite') && (
                      <div>
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => handleExerciseChange(ex.id, e.target.value)}
                          placeholder="Nhập câu trả lời của bạn..."
                          disabled={isChecked}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-900 text-xs focus:outline-hidden focus:border-slate-500"
                        />
                      </div>
                    )}

                    {!isChecked ? (
                      <button
                        type="button"
                        onClick={() => handleCheckExercise(ex.id)}
                        disabled={!userVal}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
                      >
                        Kiểm tra đáp án
                      </button>
                    ) : (
                      <div className={`p-3 rounded border text-xs space-y-1 ${
                        isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{isCorrect ? '✓ Chính xác!' : `✗ Chưa đúng. Đáp án đúng: ${ex.correctAnswer}`}</span>
                        </div>
                        <p className="text-[12px] text-slate-700 leading-relaxed">{ex.explanation}</p>
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
