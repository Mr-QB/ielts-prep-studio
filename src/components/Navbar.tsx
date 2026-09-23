import React, { useEffect, useState, useRef } from 'react';
import { AppTab, UserProfile } from '../types';
import { Volume2, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { playSoundTestChime } from '../utils/audioUtils';
import { checkD1Status } from '../utils/db';

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  user: UserProfile;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  user,
  onLogout,
  onOpenProfile
}) => {
  const [d1Connected, setD1Connected] = useState<boolean | null>(null);
  const [showPracticeMenu, setShowPracticeMenu] = useState(false);
  const [showKnowledgeMenu, setShowKnowledgeMenu] = useState(false);
  const [showReviewMenu, setShowReviewMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const practiceMenuRef = useRef<HTMLDivElement>(null);
  const knowledgeMenuRef = useRef<HTMLDivElement>(null);
  const reviewMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const verify = () => {
      checkD1Status().then(status => {
        if (isMounted) setD1Connected(status.connected);
      });
    };
    verify();
    const interval = setInterval(verify, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (practiceMenuRef.current && !practiceMenuRef.current.contains(target)) {
        setShowPracticeMenu(false);
      }
      if (knowledgeMenuRef.current && !knowledgeMenuRef.current.contains(target)) {
        setShowKnowledgeMenu(false);
      }
      if (reviewMenuRef.current && !reviewMenuRef.current.contains(target)) {
        setShowReviewMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPracticeActive = ['reading', 'listening'].includes(activeTab);
  const isKnowledgeActive = ['grammar', 'vocab', 'writing', 'speaking', 'strategy'].includes(activeTab);
  const isReviewActive = ['mistakes', 'progress', 'weak-areas'].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Notebook Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onTabChange('today')}
              className="flex items-center gap-2 cursor-pointer text-left"
            >
              <span className="font-bold text-sm tracking-tight text-slate-900 font-mono">
                IELTS PREP
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Study Notebook
              </span>
            </button>
          </div>

          {/* Primary Clean Text-First Navigation */}
          <nav className="flex items-center gap-1 overflow-x-visible">
            {/* 1. HÔM NAY */}
            <button
              type="button"
              onClick={() => onTabChange('today')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Hôm Nay
            </button>

            {/* 2. LUYỆN (Reading, Listening) */}
            <div className="relative" ref={practiceMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowPracticeMenu(!showPracticeMenu);
                  setShowKnowledgeMenu(false);
                  setShowReviewMenu(false);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isPracticeActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Luyện</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showPracticeMenu && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('reading');
                      setShowPracticeMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'reading' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Reading</span>
                    <span className="text-[11px] text-slate-400">Đọc học thuật</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('listening');
                      setShowPracticeMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'listening' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Listening</span>
                    <span className="text-[11px] text-slate-400">Nghe & bẫy đổi ý</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. KIẾN THỨC (Grammar, Vocab, Writing, Speaking, Chiến thuật) */}
            <div className="relative" ref={knowledgeMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowKnowledgeMenu(!showKnowledgeMenu);
                  setShowPracticeMenu(false);
                  setShowReviewMenu(false);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isKnowledgeActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Kiến Thức</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showKnowledgeMenu && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('grammar');
                      setShowKnowledgeMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'grammar' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Ngữ Pháp (8 Nhóm)</span>
                    <span className="text-[11px] text-slate-400">G01–G26</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('vocab');
                      setShowKnowledgeMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'vocab' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Từ Vựng & Paraphrase</span>
                    <span className="text-[11px] text-slate-400">Core 4.0–6.5</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('strategy');
                      setShowKnowledgeMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'strategy' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Chiến Thuật Làm Bài</span>
                    <span className="text-[11px] text-slate-400">Skim, Scan, Bẫy</span>
                  </button>
                  <div className="my-1 border-t border-slate-100"></div>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('writing');
                      setShowKnowledgeMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'writing' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Writing Cheat Sheet</span>
                    <span className="text-[11px] text-slate-400">Khung bài & Cụm từ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('speaking');
                      setShowKnowledgeMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'speaking' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Speaking & Story Bank</span>
                    <span className="text-[11px] text-slate-400">10 Câu chuyện mẫu</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. ÔN TẬP (Lỗi sai, Tiến độ) */}
            <div className="relative" ref={reviewMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowReviewMenu(!showReviewMenu);
                  setShowPracticeMenu(false);
                  setShowKnowledgeMenu(false);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isReviewActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Ôn Tập</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showReviewMenu && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('mistakes');
                      setShowReviewMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'mistakes' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Sổ Lỗi Sai</span>
                    <span className="text-[11px] text-slate-400">Làm lại theo chu kỳ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('progress');
                      setShowReviewMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'progress' || activeTab === 'weak-areas' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Tiến Độ & Năng Lực</span>
                    <span className="text-[11px] text-slate-400">Báo cáo tuần & 180 ngày</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Section: Cloud status & User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Minimal Cloud Status */}
            <span
              className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                d1Connected === true
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
              title={d1Connected === true ? 'Đã đồng bộ trực tiếp với Cloud' : 'Chế độ lưu trữ nội bộ'}
            >
              {d1Connected === true ? 'Cloud ✓' : 'Local'}
            </span>

            {/* Sound test button */}
            <button
              type="button"
              onClick={playSoundTestChime}
              title="Phát âm thanh kiểm tra tai nghe"
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-slate-100 cursor-pointer transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[80px] truncate hidden md:inline-block">
                  {user.displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user.displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {user.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                      <span>Mục tiêu: Band {user.targetBand.toFixed(1)}</span>
                      <span>•</span>
                      <span>{user.dailyStudyMinutes}p/ngày</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hồ sơ & Mục tiêu</span>
                  </button>

                  <div className="my-1 border-t border-slate-100"></div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
