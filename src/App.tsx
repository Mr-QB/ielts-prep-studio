import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ListeningView } from './components/ListeningView';
import { ReadingView } from './components/ReadingView';
import { GrammarView } from './components/GrammarView';
import { VocabSRSView } from './components/VocabSRSView';
import { AppTab, ExamMode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('listening');
  const [examMode, setExamMode] = useState<ExamMode>('simulation');

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-slate-800 selection:text-white">
      {/* Top Application Header with CD-IELTS Simulation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        examMode={examMode}
        onExamModeChange={setExamMode}
      />

      {/* Main Examination & Study Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'listening' && (
          <ListeningView examMode={examMode} />
        )}

        {activeTab === 'reading' && (
          <ReadingView examMode={examMode} />
        )}

        {activeTab === 'grammar' && (
          <GrammarView />
        )}

        {activeTab === 'vocab' && (
          <VocabSRSView />
        )}
      </main>

      {/* Examination Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">IELTS CD-SIMULATION</span>
            <span>•</span>
            <span>Cambridge English 12 General Training Examination System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>IDP & British Council Protocol</span>
            <span>•</span>
            <span>SuperMemo SM-2 Spaced Repetition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
