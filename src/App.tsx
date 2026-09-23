import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TodayDashboard } from './components/TodayDashboard';
import { ListeningView } from './components/ListeningView';
import { ReadingView } from './components/ReadingView';
import { GrammarView } from './components/GrammarView';
import { VocabSRSView } from './components/VocabSRSView';
import { WritingNotesView } from './components/WritingNotesView';
import { SpeakingNotesView } from './components/SpeakingNotesView';
import { MistakesNotebookView } from './components/MistakesNotebookView';
import { WeakAreasView } from './components/WeakAreasView';
import { ProgressView } from './components/ProgressView';
import { StrategyHandbookView } from './components/StrategyHandbookView';
import { LoginView } from './components/LoginView';
import { UserProfileModal } from './components/UserProfileModal';
import { AppTab, ExamMode, UserProfile } from './types';
import { fetchCurrentUser, logoutUser } from './utils/db';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [examMode, setExamMode] = useState<ExamMode>('study');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    fetchCurrentUser().then(currentUser => {
      if (isMounted) {
        setUser(currentUser);
        setIsLoadingAuth(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setActiveTab('today');
  };

  // Loading Screen
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-700">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono font-medium text-slate-500 tracking-wider uppercase">
            Đang khởi động IELTS Prep Studio...
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated Screen
  if (!user) {
    return (
      <LoginView
        onLoginSuccess={loggedInUser => {
          setUser(loggedInUser);
          setActiveTab('today');
        }}
      />
    );
  }

  // Authenticated Application
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Application Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* User Profile & Target Settings Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdateSuccess={(updatedUser: UserProfile) => setUser(updatedUser)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'today' && (
          <TodayDashboard onNavigateTab={setActiveTab} user={user} />
        )}

        {activeTab === 'reading' && (
          <ReadingView examMode={examMode} />
        )}

        {activeTab === 'listening' && (
          <ListeningView examMode={examMode} />
        )}

        {activeTab === 'grammar' && (
          <GrammarView />
        )}

        {activeTab === 'vocab' && (
          <VocabSRSView />
        )}

        {activeTab === 'strategy' && (
          <StrategyHandbookView />
        )}

        {activeTab === 'writing' && (
          <WritingNotesView />
        )}

        {activeTab === 'speaking' && (
          <SpeakingNotesView />
        )}

        {activeTab === 'mistakes' && (
          <MistakesNotebookView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'weak-areas' && (
          <WeakAreasView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'progress' && (
          <ProgressView onNavigateTab={setActiveTab} />
        )}
      </main>

      {/* Clean Academic Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">IELTS PREP STUDIO</span>
            <span>•</span>
            <span>Sổ Tay Tự Học IELTS Thực Chiến Band 4.0 → 6.5</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Offline-Ready (IndexedDB)</span>
            <span>•</span>
            <span>Học viên: {user.displayName}</span>
            <span>•</span>
            <span>Mục tiêu Band {user.targetBand.toFixed(1)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
