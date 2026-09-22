import React, { useState, useEffect } from 'react';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import { GrammarTopic } from '../types';
import { CheckCircle2, XCircle, Plus, Trash2, ArrowRight, BookOpen, Layers, Check, HelpCircle } from 'lucide-react';

interface CustomGrammarNote {
  id: string;
  title: string;
  formula: string;
  notes: string;
  exampleBand8: string;
  createdAt: string;
}

export const GrammarView: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Custom grammar notes state (local storage)
  const [customNotes, setCustomNotes] = useState<CustomGrammarNote[]>(() => {
    try {
      const saved = localStorage.getItem('ielts_custom_grammar_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newExample, setNewExample] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('ielts_custom_grammar_notes', JSON.stringify(customNotes));
    } catch {
      // Safe fallback
    }
  }, [customNotes]);

  const currentTopic = GRAMMAR_TOPICS.find(t => t.id === selectedTopicId) || GRAMMAR_TOPICS[0];

  const handleCheckAnswer = (exerciseId: string, correctAnswer: string) => {
    const userAns = (exerciseAnswers[exerciseId] || '').trim().toLowerCase();
    const correctAns = correctAnswer.trim().toLowerCase();

    // Check clean punctuation match
    const cleanUser = userAns.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
    const cleanTarget = correctAns.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();

    const isMatch = cleanUser === cleanTarget || userAns === correctAns;

    setExerciseResults(prev => ({
      ...prev,
      [exerciseId]: isMatch
    }));
    setShowExplanation(prev => ({
      ...prev,
      [exerciseId]: true
    }));
  };

  const handleSaveCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNote: CustomGrammarNote = {
      id: `custom-g-${Date.now()}`,
      title: newTitle.trim(),
      formula: newFormula.trim() || 'Negative Adverbial + Aux + S + V',
      notes: newNotes.trim() || 'Ghi chú ngữ pháp cá nhân',
      exampleBand8: newExample.trim() || 'Ví dụ minh họa chuẩn Band 8.0+',
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    setCustomNotes([newNote, ...customNotes]);
    setNewTitle('');
    setNewFormula('');
    setNewNotes('');
    setNewExample('');
    setIsAddingNote(false);
  };

  const handleDeleteNote = (id: string) => {
    setCustomNotes(customNotes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Editorial Academic Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                IELTS WRITING & SPEAKING • BAND CRITERIA GRA
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">Cambridge Applied Linguistics</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Ngữ Pháp Trọng Điểm & Biến Đổi Cú Pháp (Band 7.5 – 8.5)
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Nâng cấp tiêu chí <strong>Grammatical Range and Accuracy</strong> bằng cách thay thế các cấu trúc đơn giản (Band 6.0) bằng cấu trúc phức hợp (Đảo ngữ, Câu chẻ, Mệnh đề phân từ, Danh từ hóa).
            </p>
          </div>

          <button
            onClick={() => setIsAddingNote(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Cấu Trúc Cá Nhân</span>
          </button>
        </div>

        {/* Structure Selector Tabs */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-4">
          {GRAMMAR_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedTopicId === topic.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Study Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Formula, Linguistic Matrix & Transformation Exercises */}
        <div className="lg:col-span-8 space-y-6">
          {/* Topic Detail Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  CẤU TRÚC HỌC THUẬT: {currentTopic.level}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {currentTopic.title}
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {currentTopic.concept}
              </p>
            </div>

            {/* Formula Block (Monospace code presentation) */}
            <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs border border-slate-800 shadow-inner">
              <span className="text-slate-400 text-[11px] block uppercase font-sans mb-1 font-bold">
                Công thức chuẩn cú pháp:
              </span>
              <p className="text-amber-400 font-semibold tracking-wide text-sm">
                {currentTopic.formula}
              </p>
            </div>

            {/* Key Rules List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Quy tắc biến đổi trọng tâm:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {currentTopic.rules.map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-900 font-mono font-bold">•</span>
                    <span className="font-mono text-slate-900">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Side-by-Side Comparative Matrix: Band 6 vs Band 8.5 */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Bảng đối chiếu Band 6.0 vs Band 8.5:
              </span>

              <div className="space-y-3">
                {currentTopic.bandComparison.map((comp, cIdx) => (
                  <div key={cIdx} className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                      {/* Band 6 Column */}
                      <div className="p-3 bg-slate-50/70">
                        <span className="text-[11px] font-bold text-slate-500 font-mono uppercase block mb-1">
                          Band 6.0 (Câu thông thường)
                        </span>
                        <p className="text-slate-700 italic">"{comp.band6}"</p>
                      </div>

                      {/* Band 8.5 Column */}
                      <div className="p-3 bg-slate-100/50">
                        <span className="text-[11px] font-bold text-slate-900 font-mono uppercase block mb-1">
                          Band 8.5 (Cú pháp học thuật)
                        </span>
                        <p className="text-slate-950 font-semibold font-serif-reading text-sm">
                          "{comp.band8}"
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white border-t border-slate-200 text-slate-600 text-[11px]">
                      <strong>Phân tích ngôn ngữ:</strong> {comp.analysis}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Transformation Laboratory */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Thực hành biến đổi câu (Transformation Laboratory)
              </h3>
              <span className="text-xs text-slate-500">
                {currentTopic.exercises.length} bài tập
              </span>
            </div>

            <div className="space-y-5">
              {currentTopic.exercises.map((ex, exIdx) => {
                const userAns = exerciseAnswers[ex.id] || '';
                const result = exerciseResults[ex.id];
                const isChecked = showExplanation[ex.id];

                return (
                  <div key={ex.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700">
                        Bài tập {exIdx + 1}:
                      </span>
                      {isChecked && (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${result ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {result ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {result ? 'Chính xác!' : 'Chưa đúng chuẩn'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                      {ex.question}
                    </p>

                    {/* Rewrite input or Multiple Choice */}
                    {ex.type === 'rewrite' || ex.type === 'fill-gap' && !ex.options ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={userAns}
                          onChange={(e) => setExerciseAnswers({ ...exerciseAnswers, [ex.id]: e.target.value })}
                          placeholder="Gõ câu biến đổi hoàn chỉnh của bạn tại đây..."
                          className="w-full p-2.5 text-xs font-mono rounded border border-slate-300 bg-white focus:outline-none focus:border-slate-800"
                        />
                        <button
                          onClick={() => handleCheckAnswer(ex.id, ex.correctAnswer)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded transition-colors cursor-pointer"
                        >
                          Kiểm tra cú pháp
                        </button>
                      </div>
                    ) : ex.options ? (
                      <div className="space-y-1.5">
                        {ex.options.map((opt, oIdx) => {
                          const optKey = opt.split('.')[0]?.trim() || opt;
                          const isSelected = userAns.toUpperCase() === optKey.toUpperCase() || userAns === opt;
                          return (
                            <label
                              key={oIdx}
                              className={`flex items-center gap-2.5 p-2 rounded text-xs cursor-pointer border transition-colors ${
                                isSelected
                                  ? 'border-slate-800 bg-white font-semibold text-slate-900'
                                  : 'border-slate-200 hover:bg-white text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`ex-${ex.id}`}
                                checked={isSelected}
                                onChange={() => {
                                  setExerciseAnswers({ ...exerciseAnswers, [ex.id]: optKey });
                                  handleCheckAnswer(ex.id, ex.correctAnswer);
                                }}
                                className="text-slate-900 focus:ring-slate-800"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : null}

                    {/* Step-by-step grammatical explanation */}
                    {isChecked && (
                      <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1.5 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-[11px] uppercase">
                            Đáp án chuẩn Cambridge:
                          </span>
                        </div>
                        <p className="font-mono text-emerald-800 font-semibold bg-emerald-50/60 p-1.5 rounded border border-emerald-200">
                          {ex.correctAnswer}
                        </p>
                        <p className="text-slate-600 leading-relaxed pt-1">
                          <strong>Giải thích cú pháp:</strong> {ex.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Personal Grammar Notebook */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-800" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Sổ Tay Ngữ Pháp Cá Nhân
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {customNotes.length} ghi chú
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Lưu lại các cấu trúc bạn gặp phải trong quá trình làm đề Cambridge 12 để ôn luyện trước ngày thi.
            </p>

            {/* Custom Notes List */}
            {customNotes.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
                Chưa có cấu trúc cá nhân nào. Bấm nút "Thêm Cấu Trúc" để tạo ghi chú mới.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {customNotes.map(n => (
                  <div key={n.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Xóa ghi chú này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono text-[11px] bg-white p-1.5 rounded border border-slate-200 text-slate-800">
                      {n.formula}
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {n.notes}
                    </p>

                    <div className="p-2 bg-slate-100/70 rounded border border-slate-200/80 text-[11px]">
                      <span className="font-bold text-slate-800 block mb-0.5">Ví dụ áp dụng:</span>
                      <span className="italic font-serif-reading text-slate-900">"{n.exampleBand8}"</span>
                    </div>

                    <span className="text-[10px] text-slate-400 block font-mono">
                      Ngày tạo: {n.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Structure Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-200">
              Thêm Cấu Trúc Ngữ Pháp Mới Vào Sổ Tay
            </h3>

            <form onSubmit={handleSaveCustomNote} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên cấu trúc / Chủ điểm:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đảo ngữ với Scarcely... when"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Công thức cú pháp:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Scarcely + had + S + V3 + when + S + V2"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  className="w-full p-2 font-mono border border-slate-300 rounded focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ghi chú ngữ pháp & lưu ý tránh lỗi:</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Không dùng than sau Scarcely, chỉ dùng when..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ví dụ câu hoàn chỉnh (Band 8.0+):</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ câu áp dụng trong đề thi Writing Task 2..."
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  className="w-full p-2 font-serif-reading border border-slate-300 rounded focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded cursor-pointer transition-colors"
                >
                  Lưu vào sổ tay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
