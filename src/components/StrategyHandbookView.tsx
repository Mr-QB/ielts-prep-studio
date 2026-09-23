import React, { useState } from 'react';
import { STRATEGY_SECTIONS, StrategySection } from '../data/strategyData';

export const StrategyHandbookView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reading' | 'listening' | 'exam'>('reading');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('strat-r-skimming');

  const filteredSections = STRATEGY_SECTIONS.filter(s => s.skill === activeTab);
  const currentSection = STRATEGY_SECTIONS.find(s => s.id === selectedSectionId) || filteredSections[0] || STRATEGY_SECTIONS[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Cẩm Nang Chiến Thuật Làm Bài (Strategy Handbook)
        </h1>
        <p className="text-base text-slate-600 mt-1 max-w-3xl">
          Phương pháp tư duy, kỹ thuật đọc lướt định vị từ khóa và chiến lược phòng thi thực tế đã được kiểm chứng bởi các cựu giám khảo IELTS.
        </p>

        {/* Skill Category Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          {(['reading', 'listening', 'exam'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                const first = STRATEGY_SECTIONS.find(s => s.skill === tab);
                if (first) setSelectedSectionId(first.id);
              }}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer capitalize ${
                activeTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab === 'reading' ? 'Chiến Thuật Reading' : tab === 'listening' ? 'Chiến Thuật Listening' : 'Kỹ Năng Phòng Thi'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Content Split: Left topics list, Right detailed strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation */}
        <div className="lg:col-span-4 space-y-2">
          {filteredSections.map(sec => {
            const isSelected = sec.id === currentSection.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSectionId(sec.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <h3 className="text-sm font-bold block">{sec.title}</h3>
                <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {sec.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {currentSection.title}
            </h2>
            <p className="text-base text-slate-600 mt-1">
              {currentSection.summary}
            </p>
          </div>

          {/* Core Rule */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
              Nguyên tắc vàng cần nhớ:
            </span>
            <p className="text-base font-semibold text-slate-900 leading-relaxed">
              {currentSection.coreRule}
            </p>
          </div>

          {/* Step by step */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Các bước thực hiện chuẩn xác:
            </h3>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal pl-5">
              {currentSection.steps.map((st, idx) => (
                <li key={idx} className="leading-relaxed">
                  {st}
                </li>
              ))}
            </ol>
          </div>

          {/* Practical Tips */}
          {currentSection.tips.length > 0 && (
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg space-y-2">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wide block">
                Mẹo thực chiến:
              </span>
              <ul className="space-y-1.5 text-sm text-blue-900 list-disc pl-5">
                {currentSection.tips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Example / Comparison if available */}
          {currentSection.examples && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
              <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-lg">
                <span className="text-xs font-bold text-rose-800 uppercase block mb-1">Cách làm sai lầm:</span>
                <p className="text-rose-900">{currentSection.examples.wrongApproach}</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">Cách làm chuẩn:</span>
                <p className="text-emerald-900">{currentSection.examples.correctApproach}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
