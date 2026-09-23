import React from 'react';
import { AppTab, ExamMode } from '../types';
import { Volume2 } from 'lucide-react';
import { playSoundTestChime } from '../utils/audioUtils';

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  examMode: ExamMode;
  onExamModeChange: (mode: ExamMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  examMode,
  onExamModeChange
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Logo / Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onTabChange('today')}
              className="flex items-center gap-2 cursor-pointer text-left"
            >
              <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase font-mono">
                IELTS Prep Studio
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Academic 6.5+
              </span>
            </button>
          </div>

          {/* Core Navigation Tabs (Today, Listening, Reading, Grammar, Vocabulary) */}
          <nav className="flex items-center gap-1">
            {[
              { id: 'today', label: 'Hôm Nay' },
              { id: 'listening', label: 'Listening' },
              { id: 'reading', label: 'Reading' },
              { id: 'grammar', label: 'Grammar' },
              { id: 'vocab', label: 'Vocabulary' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id as AppTab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Mode Switcher & Sound Test */}
          <div className="flex items-center gap-2.5">
            {/* Study Mode vs Exam Mode Toggle */}
            <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded text-xs">
              <button
                type="button"
                onClick={() => onExamModeChange('study')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  examMode === 'study'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Học tập (Study)
              </button>
              <button
                type="button"
                onClick={() => onExamModeChange('simulation')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  examMode === 'simulation'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Thi thử (Exam)
              </button>
            </div>

            {/* Quick Sound Test */}
            <button
              type="button"
              onClick={playSoundTestChime}
              title="Phát âm thanh kiểm tra tai nghe"
              className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
