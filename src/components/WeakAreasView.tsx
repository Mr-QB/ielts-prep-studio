import React, { useState, useEffect } from 'react';
import { WeakAreaStat, AppTab } from '../types';
import { getWeakAreaStats } from '../utils/db';

interface WeakAreasViewProps {
  onNavigateTab: (tab: AppTab) => void;
}

export const WeakAreasView: React.FC<WeakAreasViewProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<WeakAreaStat[]>([]);
  const [skillFilter, setSkillFilter] = useState<'all' | 'reading' | 'listening'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    getWeakAreaStats().then(data => {
      setStats(data);
      setIsLoading(false);
    });
  }, []);

  const filteredStats = stats.filter(s => {
    if (s.totalQuestions < 10) return false;
    if (skillFilter !== 'all' && s.skill !== skillFilter) return false;
    return true;
  });

  const criticalWeakAreas = filteredStats.filter(s => s.accuracyRate < 60);
  const moderateWeakAreas = filteredStats.filter(s => s.accuracyRate >= 60 && s.accuracyRate < 75);
  const masteredAreas = filteredStats.filter(s => s.accuracyRate >= 75);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                DIAGNOSTIC & PERFORMANCE ANALYTICS
              </span>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold font-mono">
                Phân Tích Điểm Yếu
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Dạng Bài Cần Cải Thiện & Khắc Phục
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Hệ thống tự động tổng hợp tỷ lệ làm sai theo từng dạng bài từ tất cả bài luyện tập bạn đã hoàn thành để đề xuất bài luyện trọng tâm.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs">
            {(['all', 'reading', 'listening'] as const).map(sk => (
              <button
                key={sk}
                type="button"
                onClick={() => setSkillFilter(sk)}
                className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer capitalize ${
                  skillFilter === sk ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sk === 'all' ? 'Tất cả' : sk === 'reading' ? 'Reading' : 'Listening'}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-rose-800 font-bold uppercase text-[10px]">Cần chú ý gấp (&lt; 60%)</span>
            </div>
            <strong className="text-xl font-bold text-rose-900 font-mono mt-1 block">
              {criticalWeakAreas.length} dạng bài
            </strong>
            <span className="text-rose-700 text-[11px]">Độ chính xác chưa đạt mức an toàn</span>
          </div>

          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-amber-800 font-bold uppercase text-[10px]">Đang cải thiện (60–75%)</span>
            </div>
            <strong className="text-xl font-bold text-amber-900 font-mono mt-1 block">
              {moderateWeakAreas.length} dạng bài
            </strong>
            <span className="text-amber-700 text-[11px]">Cần thêm 1–2 lần luyện tập để vững</span>
          </div>

          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-bold uppercase text-[10px]">Vững vàng (&gt; 75%)</span>
            </div>
            <strong className="text-xl font-bold text-emerald-900 font-mono mt-1 block">
              {masteredAreas.length} dạng bài
            </strong>
            <span className="text-emerald-700 text-[11px]">Duy trì phong độ làm bài</span>
          </div>
        </div>
      </div>

      {/* 2. Detailed Weak Areas Table / Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 text-xs">
            Đang phân tích dữ liệu bài làm...
          </div>
        ) : filteredStats.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-3">
            <div>
              <p className="text-sm font-bold text-slate-800">Chưa đủ dữ liệu phân tích</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Cần ít nhất 10 câu trả lời cho một dạng bài trước khi hệ thống xem tỷ lệ đó là có ý nghĩa.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('reading')}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Làm bài tập Reading
              </button>
            </div>
          </div>
        ) : (
          filteredStats.map(stat => {
            const isCritical = stat.accuracyRate < 60;
            const isModerate = stat.accuracyRate >= 60 && stat.accuracyRate < 75;

            return (
              <div
                key={`${stat.skill}-${stat.questionType}`}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${
                      stat.skill === 'reading'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}>
                      <span>{stat.skill}</span>
                    </span>

                    <h3 className="text-sm font-bold text-slate-900">
                      {stat.questionType}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {stat.accuracyRate}% đúng
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        ({stat.totalQuestions - stat.incorrectCount}/{stat.totalQuestions} câu)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateTab(stat.skill === 'reading' ? 'reading' : 'listening')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <span>Luyện dạng này</span>
                    </button>
                  </div>
                </div>

                {/* Accuracy Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isCritical ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stat.accuracyRate}%` }}
                  ></div>
                </div>

                {/* Recommendation */}
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                  <strong className="text-slate-800 block text-[11px] font-mono uppercase mb-0.5">
                    Khuyến nghị chiến thuật:
                  </strong>
                  <p className="leading-relaxed">
                    {stat.recommendation || (
                      isCritical
                        ? 'Dạng bài này đang kéo tụt điểm tổng. Hãy mở lại các câu đã làm sai trong Sổ Lỗi Sai để phân tích xem sai do thiếu từ vựng hay do bẫy distractors.'
                        : 'Duy trì luyện tập dạng này ít nhất 1 bài mỗi tuần để không bị mất nhịp nhận diện từ khóa.'
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
