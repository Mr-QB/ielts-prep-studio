import React, { useEffect, useState, useRef } from 'react';
import { AppTab, UserProfile } from '../types';
import { Volume2, Database, ChevronDown, User, LogOut, Settings, BookOpen, BarChart3 } from 'lucide-react';
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
  const [showLearnMenu, setShowLearnMenu] = useState(false);
  const [showReviewMenu, setShowReviewMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const learnMenuRef = useRef<HTMLDivElement>(null);
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
      if (learnMenuRef.current && !learnMenuRef.current.contains(target)) {
        setShowLearnMenu(false);
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

  const isLearnActive = ['grammar', 'vocab', 'writing', 'speaking'].includes(activeTab);
  const isReviewActive = ['mistakes', 'weak-areas', 'progress'].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Logo / Notebook Identifier */}
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

          {/* Reorganized Primary Navigation (TODAY, READING, LISTENING, LEARN, REVIEW) */}
          <nav className="flex items-center gap-1.5 overflow-x-visible">
            {/* 1. TODAY */}
            <button
              type="button"
              onClick={() => onTabChange('today')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Hôm Nay
            </button>

            {/* 2. READING */}
            <button
              type="button"
              onClick={() => onTabChange('reading')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'reading'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Reading
            </button>

            {/* 3. LISTENING */}
            <button
              type="button"
              onClick={() => onTabChange('listening')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'listening'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Listening
            </button>

            {/* 4. LEARN DROPDOWN (Grammar, Vocab, Writing Notes, Speaking Notes) */}
            <div className="relative" ref={learnMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowLearnMenu(!showLearnMenu);
                  setShowReviewMenu(false);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isLearnActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Học & Ghi Chép</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showLearnMenu && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('grammar');
                      setShowLearnMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'grammar' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Grammar (26 Topics)</span>
                    <span className="text-[10px] text-slate-400 font-mono">G01-G26</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('vocab');
                      setShowLearnMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'vocab' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Vocabulary & SRS</span>
                    <span className="text-[10px] text-slate-400 font-mono">SM-2</span>
                  </button>
                  <div className="my-1 border-t border-slate-100"></div>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('writing');
                      setShowLearnMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'writing' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Writing Notes</span>
                    <span className="text-[10px] text-slate-400">T1 & T2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('speaking');
                      setShowLearnMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'speaking' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Speaking Notes</span>
                    <span className="text-[10px] text-slate-400">P1, P2, P3</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. REVIEW DROPDOWN (Mistakes, Weak Areas, Progress) */}
            <div className="relative" ref={reviewMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowReviewMenu(!showReviewMenu);
                  setShowLearnMenu(false);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isReviewActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Ôn Tập & Lỗi Sai</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showReviewMenu && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
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
                    <span>Sổ Lỗi Sai (Mistakes)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('weak-areas');
                      setShowReviewMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'weak-areas' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Điểm Yếu (Analytics)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('progress');
                      setShowReviewMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeTab === 'progress' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Lộ Trình 180 Ngày</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Header Section: Cloud Status & User Menu */}
          <div className="flex items-center gap-2.5">
            {/* Cloudflare D1 Status Badge */}
            <div
              className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                d1Connected === true
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : d1Connected === false
                  ? 'bg-slate-50 text-slate-500 border-slate-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
              title={
                d1Connected === true
                  ? 'Dữ liệu đã kết nối và đồng bộ trực tiếp với Cloudflare D1'
                  : 'Đang hoạt động chế độ lưu trữ cục bộ (Offline/Local)'
              }
            >
              <Database className={`w-3 h-3 ${d1Connected ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{d1Connected === true ? 'D1 Cloud' : 'Local'}</span>
            </div>

            {/* Sound Test Chime */}
            <button
              type="button"
              onClick={playSoundTestChime}
              title="Phát âm thanh kiểm tra tai nghe"
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* User Dropdown Menu */}
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
                <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user.displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {user.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
                      <span>Target: {user.targetBand.toFixed(1)}</span>
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
                    <span>Hồ sơ & Mục tiêu học tập</span>
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
