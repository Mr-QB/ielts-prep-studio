import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { TodayDashboard } from './components/TodayDashboard';
import { CambridgeCourseView } from './components/CambridgeCourseView';
import { StudyPlanView } from './components/StudyPlanView';
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
import { AppTab, ExamFamily, UserProfile } from './types';
import { fetchCurrentUser, logoutUser } from './utils/db';

const AptisSamplesView = lazy(() => import('./components/AptisSamplesView').then(module => ({ default: module.AptisSamplesView })));

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [examFamily, setExamFamily] = useState<ExamFamily>(() => localStorage.getItem('examFamily') === 'aptis' ? 'aptis' : 'ielts');
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchCurrentUser().then(currentUser => {
      if (mounted) {
        setUser(currentUser);
        setIsLoadingAuth(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setActiveTab('today');
    setExamFamily('ielts');
    localStorage.setItem('examFamily', 'ielts');
  };

  const handleExamFamilyChange = (next: ExamFamily) => {
    setExamFamily(next);
    localStorage.setItem('examFamily', next);
    setActiveTab(next === 'aptis' ? 'aptis' : 'today');
  };

  if (isLoadingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-700">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-800 border-t-transparent" />
          <p className="text-sm text-slate-500">Đang mở sổ học tập…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView onLoginSuccess={loggedInUser => { setUser(loggedInUser); setActiveTab('today'); }} />;
  }

  return (
    <div className="workspace-app flex bg-slate-50 text-slate-900 font-sans">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        examFamily={examFamily}
        onExamFamilyChange={handleExamFamilyChange}
        user={user}
        onLogout={handleLogout}
        onOpenProfile={() => setShowProfileModal(true)}
      />
      <div className="workspace-main flex flex-col">
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onUpdateSuccess={setUser}
        />
        <main className="workspace-content flex-1">
          {examFamily === 'aptis' ? <Suspense fallback={<p className="p-8 text-sm text-muted">Aptis samples are loading…</p>}><AptisSamplesView /></Suspense> : <>
          {activeTab === 'today' && <TodayDashboard onNavigateTab={setActiveTab} user={user} />}
          {activeTab === 'plan' && <StudyPlanView onNavigateTab={setActiveTab} user={user} />}
          {activeTab === 'cambridge' && <CambridgeCourseView />}
          {activeTab === 'reading' && <CambridgeCourseView />}
          {activeTab === 'listening' && <CambridgeCourseView />}
          {activeTab === 'grammar' && <GrammarView />}
          {activeTab === 'vocab' && <VocabSRSView />}
          {activeTab === 'strategy' && <StrategyHandbookView />}
          {activeTab === 'writing' && <WritingNotesView />}
          {activeTab === 'speaking' && <SpeakingNotesView />}
          {activeTab === 'mistakes' && <MistakesNotebookView onNavigateTab={setActiveTab} />}
          {activeTab === 'weak-areas' && <WeakAreasView onNavigateTab={setActiveTab} />}
          {activeTab === 'progress' && <ProgressView onNavigateTab={setActiveTab} />}
          </>}
        </main>
        <footer className="workspace-footer mt-auto flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>{examFamily === 'aptis' ? 'Aptis Prep · Thư viện mẫu đề' : 'IELTS Prep Studio · Học tập theo nhịp của bạn'}</span>
          <span>{user.displayName} · Mục tiêu Band {user.targetBand.toFixed(1)}</span>
        </footer>
      </div>
    </div>
  );
}
