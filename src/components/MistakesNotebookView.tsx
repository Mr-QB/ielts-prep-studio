import React, { useState, useEffect } from 'react';
import { RecordedMistake, MistakeTagType, AppTab } from '../types';
import { loadMistakes, recordDetailedMistake } from '../utils/db';
import {
  BookOpen, Headphones, AlertTriangle, Search, Filter,
  CheckCircle2, ArrowRight, Tag, MessageSquare, Plus, RefreshCw, Trash2
} from 'lucide-react';

interface MistakesNotebookViewProps {
  onNavigateTab: (tab: AppTab) => void;
}

const ERROR_TYPE_LABELS: Record<MistakeTagType, { label: string; desc: string; color: string }> = {
  'unknown-vocabulary': { label: 'Từ vựng mới / Không biết từ', desc: 'Không hiểu nghĩa của từ then chốt', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  'synonym-paraphrase': { label: 'Bỏ lỡ Paraphrase', desc: 'Từ trong câu hỏi đổi dạng trong bài đọc/nghe', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  'distractor': { label: 'Dính bẫy (Distractor)', desc: 'Thông tin có trong bài nhưng không phải đáp án', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  'spelling': { label: 'Lỗi chính tả', desc: 'Sai chính tả từ vựng', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  'plural-singular': { label: 'Sai số ít / số nhiều', desc: 'Thiếu hoặc thừa đuôi -s/-es', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  'number': { label: 'Sai số / Ngày tháng', desc: 'Nhầm lẫn chữ số, ngày tháng, mã số', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  'missed-keyword': { label: 'Lỡ mất từ khóa', desc: 'Không bắt kịp vị trí thông tin trong bài', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'lost-concentration': { label: 'Mất tập trung', desc: 'Xao nhãng nhất thời khi đang làm bài', color: 'bg-teal-50 text-teal-700 border-teal-200' },
};

export const MistakesNotebookView: React.FC<MistakesNotebookViewProps> = ({ onNavigateTab }) => {
  const [mistakes, setMistakes] = useState<RecordedMistake[]>([]);
  const [skillFilter, setSkillFilter] = useState<'all' | 'reading' | 'listening'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Manual Add Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<'reading' | 'listening'>('reading');
  const [newTestTitle, setNewTestTitle] = useState<string>('');
  const [newQNum, setNewQNum] = useState<number>(1);
  const [newQType, setNewQType] = useState<string>('True / False / Not Given');
  const [newErrType, setNewErrType] = useState<MistakeTagType>('synonym-paraphrase');
  const [newUserAns, setNewUserAns] = useState<string>('');
  const [newCorrectAns, setNewCorrectAns] = useState<string>('');
  const [newEvidence, setNewEvidence] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    loadMistakes().then(data => {
      setMistakes(data);
      setIsLoading(false);
    });
  }, []);

  const handleSaveReflection = async (mistake: RecordedMistake) => {
    const updated: RecordedMistake = {
      ...mistake,
      note: editNote
    };
    await recordDetailedMistake(updated);
    setMistakes(prev => prev.map(m => m.id === mistake.id ? updated : m));
    setEditingId(null);
  };

  const handleAddNewMistake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle.trim() || !newCorrectAns.trim()) return;

    const newMistake: RecordedMistake = {
      id: `manual_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      skill: newSkill,
      testId: 'manual',
      testTitle: newTestTitle.trim(),
      questionId: `q_${Date.now()}`,
      questionNumber: Number(newQNum),
      questionType: newQType,
      errorType: newErrType,
      userAnswer: newUserAns.trim(),
      correctAnswer: newCorrectAns.trim(),
      evidence: newEvidence.trim(),
      note: newNote.trim(),
      timestamp: new Date().toISOString()
    };

    await recordDetailedMistake(newMistake);
    setMistakes(prev => [newMistake, ...prev]);
    setShowAddModal(false);
    // Reset form
    setNewTestTitle('');
    setNewUserAns('');
    setNewCorrectAns('');
    setNewEvidence('');
    setNewNote('');
  };

  const filteredMistakes = mistakes.filter(m => {
    if (skillFilter !== 'all' && m.skill !== skillFilter) return false;
    if (tagFilter !== 'all' && m.errorType !== tagFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.testTitle?.toLowerCase().includes(q);
      const matchType = m.questionType?.toLowerCase().includes(q);
      const matchAns = m.userAnswer?.toLowerCase().includes(q) || m.correctAnswer?.toLowerCase().includes(q);
      const matchNote = m.note?.toLowerCase().includes(q) || m.evidence?.toLowerCase().includes(q);
      return matchTitle || matchType || matchAns || matchNote;
    }
    return true;
  });

  const readingMistakesCount = mistakes.filter(m => m.skill === 'reading').length;
  const listeningMistakesCount = mistakes.filter(m => m.skill === 'listening').length;

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                ACADEMIC STUDY NOTEBOOK
              </span>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[10px] font-bold font-mono">
                Sổ Lỗi Sai (Mistakes Log)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <span>Sổ Ghi Chép Lỗi Sai & Bài Học Rút Ra</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Người đạt IELTS 6.5 - 7.0 không phải người làm nhiều đề nhất, mà là người không bao giờ lặp lại cùng một lỗi sai lần thứ hai.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-md font-mono text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ghi Thêm Lỗi Sai</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Tổng số lỗi đã lưu</span>
            <strong className="text-lg font-bold text-slate-900 font-mono">{mistakes.length}</strong>
            <span className="text-slate-400 text-[10px] ml-1">câu hỏi</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Lỗi Reading</span>
            <strong className="text-lg font-bold text-blue-700 font-mono">{readingMistakesCount}</strong>
            <span className="text-slate-400 text-[10px] ml-1">câu</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Lỗi Listening</span>
            <strong className="text-lg font-bold text-purple-700 font-mono">{listeningMistakesCount}</strong>
            <span className="text-slate-400 text-[10px] ml-1">câu</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Dạng bài sai nhiều nhất</span>
            <strong className="text-xs font-bold text-rose-700 truncate block mt-1">
              {mistakes.length > 0 ? mistakes[0].questionType : 'Chưa có'}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Skill Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md w-full md:w-auto">
          {(['all', 'reading', 'listening'] as const).map(sk => (
            <button
              key={sk}
              type="button"
              onClick={() => setSkillFilter(sk)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer capitalize ${
                skillFilter === sk ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sk === 'all' ? 'Tất cả kỹ năng' : sk === 'reading' ? 'Reading' : 'Listening'}
            </button>
          ))}
        </div>

        {/* Error Tag Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="all">Tất cả nguyên nhân sai</option>
            {Object.entries(ERROR_TYPE_LABELS).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo đề, dạng bài, từ khóa..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 3. Mistakes List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 text-xs">
            Đang tải sổ lỗi sai...
          </div>
        ) : filteredMistakes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Không có lỗi sai nào trong danh mục này!</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Khi làm bài tập Reading và Listening, các câu trả lời sai sẽ tự động được ghi nhận tại đây.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('reading')}
                className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Luyện Reading
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('listening')}
                className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Luyện Listening
              </button>
            </div>
          </div>
        ) : (
          filteredMistakes.map(m => {
            const errInfo = m.errorType ? ERROR_TYPE_LABELS[m.errorType] : null;

            return (
              <div
                key={m.id}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                {/* Mistake Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${
                      m.skill === 'reading'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}>
                      {m.skill === 'reading' ? <BookOpen className="w-3 h-3" /> : <Headphones className="w-3 h-3" />}
                      <span>{m.skill}</span>
                    </span>

                    <span className="font-bold text-xs text-slate-900">
                      {m.testTitle || 'Bài luyện tập'}
                    </span>

                    <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                      Câu #{m.questionNumber}
                    </span>

                    <span className="text-xs text-slate-500 font-medium">
                      ({m.questionType})
                    </span>
                  </div>

                  {errInfo && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${errInfo.color}`}>
                      {errInfo.label}
                    </span>
                  )}
                </div>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-md">
                    <span className="text-[10px] font-bold text-rose-700 uppercase block font-sans">
                      Câu trả lời của bạn:
                    </span>
                    <span className="text-rose-900 font-semibold mt-0.5 block line-through">
                      {m.userAnswer || '(Để trống / Không chọn)'}
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-md">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block font-sans">
                      Đáp án chính xác:
                    </span>
                    <span className="text-emerald-900 font-bold mt-0.5 block">
                      {m.correctAnswer}
                    </span>
                  </div>
                </div>

                {/* Evidence / Explanation */}
                {m.evidence && (
                  <div className="text-xs bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      Bằng chứng & Giải thích:
                    </span>
                    <p className="text-slate-700 italic leading-relaxed">
                      "{m.evidence}"
                    </p>
                  </div>
                )}

                {/* Reflection Notes (User Editable) */}
                <div className="pt-1">
                  {editingId === m.id ? (
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Ghi chép phân tích cá nhân (Tại sao lại sai? Cần nhớ gì khi gặp lại dạng này?):
                      </label>
                      <textarea
                        value={editNote}
                        onChange={e => setEditNote(e.target.value)}
                        placeholder="Ví dụ: Nhầm từ vựng 'diminish' với 'distinguish', lần sau cần gạch chân từ khóa trong đoạn 3..."
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
                        rows={3}
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveReflection(m)}
                          className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded cursor-pointer hover:bg-slate-800"
                        >
                          Lưu bài học
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3 text-xs bg-amber-50/40 p-3 rounded border border-amber-100">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-amber-900 uppercase block">
                            Bài học rút ra của bạn:
                          </span>
                          <p className="text-slate-700 mt-0.5 leading-relaxed">
                            {m.note || '(Chưa có ghi chú bài học. Bấm chỉnh sửa để ghi lại bài học rút ra.)'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(m.id);
                          setEditNote(m.note || '');
                        }}
                        className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 hover:underline shrink-0 cursor-pointer"
                      >
                        {m.note ? 'Sửa' : '+ Ghi chú'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Manual Add Mistake Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Ghi Thêm Lỗi Sai Vào Sổ
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewMistake} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kỹ năng</label>
                  <select
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  >
                    <option value="reading">Reading</option>
                    <option value="listening">Listening</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số thứ tự câu (#)</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={newQNum}
                    onChange={e => setNewQNum(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên bài thi / Đề luyện</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cambridge 18 - Reading Test 1 - Passage 2"
                  value={newTestTitle}
                  onChange={e => setNewTestTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dạng bài</label>
                  <input
                    type="text"
                    value={newQType}
                    onChange={e => setNewQType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nguyên nhân sai</label>
                  <select
                    value={newErrType}
                    onChange={e => setNewErrType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  >
                    {Object.entries(ERROR_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-rose-700 block mb-1">Câu trả lời sai của bạn</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: FALSE"
                    value={newUserAns}
                    onChange={e => setNewUserAns(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-emerald-700 block mb-1">Đáp án đúng</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: NOT GIVEN"
                    value={newCorrectAns}
                    onChange={e => setNewCorrectAns(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bằng chứng trong bài (Evidence)</label>
                <textarea
                  placeholder="Trích dẫn câu chứa đáp án trong bài đọc/nghe..."
                  value={newEvidence}
                  onChange={e => setNewEvidence(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  rows={2}
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bài học rút ra (Reflection)</label>
                <textarea
                  placeholder="Ghi lại lưu ý để lần sau không tái phạm..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Lưu vào sổ lỗi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
