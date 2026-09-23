import React, { useState, useEffect } from 'react';
import { RecordedMistake, MistakeTagType, AppTab, MistakeRetryStatus } from '../types';
import { loadMistakes, recordDetailedMistake } from '../utils/db';

interface MistakesNotebookViewProps {
  onNavigateTab: (tab: AppTab) => void;
}

const ERROR_TYPE_LABELS: Record<MistakeTagType, { label: string; desc: string }> = {
  'unknown-vocabulary': { label: 'Từ vựng mới', desc: 'Không hiểu nghĩa của từ then chốt' },
  'synonym-paraphrase': { label: 'Bỏ lỡ Paraphrase', desc: 'Từ trong câu hỏi đổi dạng trong bài' },
  'distractor': { label: 'Dính bẫy (Distractor)', desc: 'Thông tin có trong bài nhưng không phải đáp án' },
  'spelling': { label: 'Lỗi chính tả', desc: 'Sai chính tả từ vựng' },
  'plural-singular': { label: 'Sai số ít / số nhiều', desc: 'Thiếu hoặc thừa đuôi -s/-es' },
  'number': { label: 'Sai số / Ngày tháng', desc: 'Nhầm lẫn chữ số, ngày tháng' },
  'missed-keyword': { label: 'Lỡ mất từ khóa', desc: 'Không bắt kịp vị trí thông tin' },
  'lost-concentration': { label: 'Mất tập trung', desc: 'Xao nhãng khi đang làm bài' },
};

const COMMON_MISTAKE_REASONS = [
  'Chưa hiểu ý chính của toàn đoạn',
  'Chọn đáp án chỉ vì thấy từ khóa giống bài đọc (Bẫy từ vựng bề mặt)',
  'Không nhận ra cặp từ đồng nghĩa (Paraphrase)',
  'Bị lừa bởi thông tin đính chính phía sau (Bẫy đổi ý)',
  'Làm vội vàng do áp lực thời gian',
  'Nhầm lẫn giữa False và Not Given'
];

export const MistakesNotebookView: React.FC<MistakesNotebookViewProps> = ({ onNavigateTab }) => {
  const [mistakes, setMistakes] = useState<RecordedMistake[]>([]);
  const [skillFilter, setSkillFilter] = useState<'all' | 'reading' | 'listening'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | MistakeRetryStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState<string>('');
  const [retryingMistake, setRetryingMistake] = useState<RecordedMistake | null>(null);
  const [retryAnswerInput, setRetryAnswerInput] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>(COMMON_MISTAKE_REASONS[0]);
  const [retryResult, setRetryResult] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    loadMistakes().then(data => {
      // Default unset status to 'new' or 'retry'
      const initialized = data.map(m => ({
        ...m,
        status: m.status || 'retry',
        consecutiveCorrect: m.consecutiveCorrect || 0,
        retryCount: m.retryCount || 0
      }));
      setMistakes(initialized);
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

  const handleStartRetry = (m: RecordedMistake) => {
    setRetryingMistake(m);
    setRetryAnswerInput('');
    setSelectedReason(m.selectedReason || COMMON_MISTAKE_REASONS[0]);
    setRetryResult(null);
  };

  const handleSubmitRetry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retryingMistake || !retryAnswerInput.trim()) return;

    const userClean = retryAnswerInput.trim().toLowerCase();
    const correctClean = retryingMistake.correctAnswer.trim().toLowerCase();
    const isCorrect = userClean === correctClean;

    const newRetryCount = (retryingMistake.retryCount || 0) + 1;
    const newConsecutive = isCorrect ? (retryingMistake.consecutiveCorrect || 0) + 1 : 0;

    let newStatus: MistakeRetryStatus = 'learning';
    let nextDays = 1;

    if (newConsecutive >= 2) {
      newStatus = 'mastered';
      nextDays = 30;
    } else if (isCorrect) {
      newStatus = 'learning';
      nextDays = 3;
    } else {
      newStatus = 'retry';
      nextDays = 1;
    }

    const nextDate = new Date(Date.now() + nextDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const updated: RecordedMistake = {
      ...retryingMistake,
      status: newStatus,
      retryCount: newRetryCount,
      consecutiveCorrect: newConsecutive,
      nextRetryDate: nextDate,
      selectedReason: selectedReason
    };

    await recordDetailedMistake(updated);
    setMistakes(prev => prev.map(m => m.id === retryingMistake.id ? updated : m));

    setRetryResult({
      isCorrect,
      feedback: isCorrect
        ? (newStatus === 'mastered' ? 'Chính xác! Bạn đã làm đúng 2 lần liên tiếp và chính thức NẮM VỮNG câu này.' : 'Chính xác! Lần làm lại tiếp theo sẽ vào sau 3 ngày.')
        : `Chưa chính xác. Đáp án đúng là: ${retryingMistake.correctAnswer}. Hệ thống sẽ nhắc bạn làm lại vào ngày mai.`
    });
  };

  const filteredMistakes = mistakes.filter(m => {
    if (skillFilter !== 'all' && m.skill !== skillFilter) return false;
    if (statusFilter !== 'all' && (m.status || 'retry') !== statusFilter) return false;
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

  const retryDueCount = mistakes.filter(m => (m.status || 'retry') === 'retry').length;
  const masteredCount = mistakes.filter(m => m.status === 'mastered').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Sổ Lỗi Sai & Hàng Đợi Làm Lại (Mistake Retry Queue)
        </h1>
        <p className="text-base text-slate-600 mt-1">
          Làm sai không đáng sợ; không sửa mới đáng sợ. Mỗi câu sai sẽ được lên lịch làm lại sau <span className="font-semibold text-slate-900">1 ngày, 3 ngày và 7 ngày</span> cho đến khi bạn làm đúng 2 lần liên tiếp để chính thức Nắm Vững (Mastered).
        </p>

        {/* Status Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-sm">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-xs text-slate-500 block">Tổng số câu sai</span>
            <strong className="text-xl font-bold text-slate-900 font-mono">{mistakes.length}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-xs text-rose-700 font-semibold block">Cần làm lại hôm nay</span>
            <strong className="text-xl font-bold text-rose-700 font-mono">{retryDueCount}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-xs text-amber-700 font-semibold block">Đang học / Đang rèn</span>
            <strong className="text-xl font-bold text-amber-700 font-mono">{mistakes.filter(m => m.status === 'learning').length}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-xs text-emerald-700 font-semibold block">Đã nắm vững ✓</span>
            <strong className="text-xl font-bold text-emerald-700 font-mono">{masteredCount}</strong>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'retry', label: 'Cần làm lại' },
            { id: 'learning', label: 'Đang rèn' },
            { id: 'mastered', label: 'Đã nắm vững' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skill & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700"
          >
            <option value="all">Mọi kỹ năng</option>
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
          </select>

          <input
            type="text"
            placeholder="Tìm kiếm câu sai..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* 3. Mistakes List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-sm text-slate-500">
            Đang tải dữ liệu sổ lỗi sai...
          </div>
        ) : filteredMistakes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-2">
            <p className="text-base font-bold text-slate-800">Không có câu sai nào trong danh mục này!</p>
            <p className="text-sm text-slate-500">
              Khi làm bài tập Reading hoặc Listening, các câu trả lời sai sẽ tự động được ghi nhận vào đây để bạn lên lịch làm lại.
            </p>
          </div>
        ) : (
          filteredMistakes.map(m => {
            const errInfo = m.errorType ? ERROR_TYPE_LABELS[m.errorType] : null;
            const isMastered = m.status === 'mastered';
            const isRetry = (m.status || 'retry') === 'retry';

            return (
              <div
                key={m.id}
                className={`bg-white border rounded-lg p-5 shadow-xs space-y-3 transition-colors ${
                  isMastered ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {m.skill}
                    </span>
                    <strong className="text-sm font-bold text-slate-900">
                      {m.testTitle || 'Bài luyện tập'}
                    </strong>
                    <span className="font-mono text-xs text-slate-500">
                      Câu #{m.questionNumber}
                    </span>
                    <span className="text-xs text-slate-600">
                      ({m.questionType})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                      isMastered
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isRetry
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {isMastered ? 'Nắm vững ✓' : isRetry ? 'Cần làm lại' : 'Đang rèn'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStartRetry(m)}
                      className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                    >
                      {isMastered ? 'Làm lại thử thách' : 'Làm lại câu này'}
                    </button>
                  </div>
                </div>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-rose-50/50 border border-rose-200 rounded">
                    <span className="text-xs font-semibold text-rose-800 block">Bạn từng trả lời:</span>
                    <span className="font-mono line-through text-rose-900 mt-0.5 block">
                      {m.userAnswer || '(Không chọn / Bỏ trống)'}
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded">
                    <span className="text-xs font-semibold text-emerald-800 block">Đáp án chính xác:</span>
                    <span className="font-mono font-bold text-emerald-900 mt-0.5 block">
                      {m.correctAnswer}
                    </span>
                  </div>
                </div>

                {/* Evidence snippet */}
                {m.evidence && (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase block mb-0.5">Bằng chứng trong bài đọc / nghe:</span>
                    <p className="text-slate-800 italic">"{m.evidence}"</p>
                  </div>
                )}

                {/* Selected Reason if any */}
                {m.selectedReason && (
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Nguyên nhân sai đã xác định: </span>
                    <span>{m.selectedReason}</span>
                  </div>
                )}

                {/* Reflection Notes */}
                <div className="pt-1">
                  {editingId === m.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editNote}
                        onChange={e => setEditNote(e.target.value)}
                        placeholder="Ghi lại bài học rút ra để không lặp lại lần sau..."
                        className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveReflection(m)}
                          className="px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded"
                        >
                          Lưu bài học
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span>Bài học rút ra: {m.note || '(Chưa có ghi chú)'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(m.id);
                          setEditNote(m.note || '');
                        }}
                        className="text-slate-800 font-semibold hover:underline cursor-pointer"
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

      {/* 4. Interactive Retry Modal */}
      {retryingMistake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-slate-500">
                  {retryingMistake.skill} • {retryingMistake.questionType}
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Làm Lại Câu #{retryingMistake.questionNumber}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setRetryingMistake(null)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-sm text-slate-800">
              <span className="text-xs font-bold text-slate-500 block mb-1">Bài thi:</span>
              <p className="font-semibold">{retryingMistake.testTitle}</p>
              {retryingMistake.evidence && (
                <p className="mt-2 text-xs italic text-slate-600">
                  Gợi ý: "{retryingMistake.evidence}"
                </p>
              )}
            </div>

            {retryResult ? (
              <div className={`p-4 rounded-lg border space-y-2 text-sm ${
                retryResult.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <strong className="block text-base">
                  {retryResult.isCorrect ? 'Chúc mừng bạn!' : 'Chưa đúng!'}
                </strong>
                <p>{retryResult.feedback}</p>
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setRetryingMistake(null)}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRetry} className="space-y-4 text-sm">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Nhập câu trả lời làm lại của bạn:
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập đáp án (ví dụ: TRUE, FALSE, hoặc từ vựng)..."
                    value={retryAnswerInput}
                    onChange={e => setRetryAnswerInput(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Lý do bạn làm sai ở lần trước là gì?
                  </label>
                  <select
                    value={selectedReason}
                    onChange={e => setSelectedReason(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
                  >
                    {COMMON_MISTAKE_REASONS.map((r, idx) => (
                      <option key={idx} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRetryingMistake(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    Kiểm tra kết quả
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
