import React, { useState, useEffect } from 'react';
import { AppTab, ExamMode } from '../types';
import { Headphones, BookOpen, PenTool, Brain, Volume2, Clock, Eye, EyeOff, HelpCircle, Shield, X, CheckCircle2 } from 'lucide-react';
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
  const [timerSeconds, setTimerSeconds] = useState<number>(30 * 60); // 30 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isTimerHidden, setIsTimerHidden] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [testedAudio, setTestedAudio] = useState<boolean>(false);

  // Timer countdown for CD-IELTS simulation
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSoundTest = () => {
    playSoundTestChime();
    setTestedAudio(true);
    setTimeout(() => setTestedAudio(false), 2500);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-slate-100 shadow-md">
      {/* Official CD-IELTS Examination Status Bar */}
      <div className="border-b border-slate-800 px-4 sm:px-6 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Candidate & Test Authority */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-sans font-bold tracking-wider text-amber-400">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>IELTS CD-SIM</span>
            </div>
            <span className="text-slate-600 hidden md:inline">|</span>
            <div className="flex items-center gap-3 text-slate-300">
              <span>Candidate: <span className="text-white font-semibold">VN-094182</span></span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="hidden sm:inline">Module: <span className="text-white font-semibold">General Training / Academic</span></span>
              <span className="text-slate-600 hidden lg:inline">•</span>
              <span className="hidden lg:inline text-slate-400">Cambridge 12 Authentic</span>
            </div>
          </div>

          {/* Test Utilities: Sound Check, Timer & Mode */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Audio Check Button */}
            <button
              onClick={handleSoundTest}
              title="Phát âm thanh kiểm tra tai nghe (Sound Check)"
              className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
            >
              <Volume2 className={`w-3.5 h-3.5 ${testedAudio ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">{testedAudio ? 'Chuông tốt' : 'Sound Test'}</span>
            </button>

            {/* Official CD-IELTS Countdown Clock */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded px-2.5 py-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              {isTimerHidden ? (
                <span className="text-slate-500 italic text-[11px] select-none">Timer hidden</span>
              ) : (
                <span
                  className={`font-semibold tracking-wider ${
                    timerSeconds < 120
                      ? 'text-rose-400 animate-pulse'
                      : timerSeconds < 300
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {formatTimer(timerSeconds)} left
                </span>
              )}
              <button
                onClick={() => setIsTimerHidden(!isTimerHidden)}
                title={isTimerHidden ? 'Hiện đồng hồ đếm ngược' : 'Ẩn đồng hồ theo quy chế CD-IELTS'}
                className="text-slate-400 hover:text-slate-200 cursor-pointer ml-1"
              >
                {isTimerHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </div>

            {/* Mode Switcher: Exam vs Study */}
            <div className="flex items-center rounded border border-slate-700 p-0.5 bg-slate-950 font-sans">
              <button
                onClick={() => onExamModeChange('simulation')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  examMode === 'simulation'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mô phỏng 100% phòng thi thật CD-IELTS (Không xem trước đáp án, điều hướng bảng câu hỏi)"
              >
                Thi thật CD-IELTS
              </button>
              <button
                onClick={() => onExamModeChange('study')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  examMode === 'study'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Chế độ phân tích: Xem transcript audio, đối chiếu dẫn chứng đọc hiểu & ngữ pháp"
              >
                Học & Phân tích
              </button>
            </div>

            {/* Help / Guidelines Button */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="text-slate-400 hover:text-white cursor-pointer"
              title="Quy chế thi và hướng dẫn"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Module Navigation Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-13">
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* Tab 1: Listening */}
            <button
              onClick={() => onTabChange('listening')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                activeTab === 'listening'
                  ? 'border-amber-400 text-white bg-slate-800/60 rounded-t'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-t'
              }`}
            >
              <Headphones className="w-4 h-4 text-slate-300" />
              <span>1. Luyện Nghe</span>
            </button>

            {/* Tab 2: Reading */}
            <button
              onClick={() => onTabChange('reading')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                activeTab === 'reading'
                  ? 'border-amber-400 text-white bg-slate-800/60 rounded-t'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-t'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-300" />
              <span>2. Luyện Đọc</span>
            </button>

            {/* Tab 3: Grammar */}
            <button
              onClick={() => onTabChange('grammar')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                activeTab === 'grammar'
                  ? 'border-amber-400 text-white bg-slate-800/60 rounded-t'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-t'
              }`}
            >
              <PenTool className="w-4 h-4 text-slate-300" />
              <span>3. Ngữ Pháp & Biến Đổi Câu (Band 8+)</span>
            </button>

            {/* Tab 4: Vocab SRS */}
            <button
              onClick={() => onTabChange('vocab')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                activeTab === 'vocab'
                  ? 'border-amber-400 text-white bg-slate-800/60 rounded-t'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-t'
              }`}
            >
              <Brain className="w-4 h-4 text-slate-300" />
              <span>4. Luyện Từ (Anki SRS)</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>IDP / British Council CD-IELTS Ready</span>
          </div>
        </div>
      </div>

      {/* Help & CD-IELTS Guidelines Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Quy chế & Hướng dẫn thi CD-IELTS</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 space-y-1.5">
                <span className="font-bold text-amber-400 block text-sm">1. Quy định thời gian & Làm bài</span>
                <p>
                  • Khác với bài thi giấy, bài thi Nghe trên máy (Computer-delivered) chỉ có <strong>2 phút</strong> cuối để kiểm tra lại đáp án (thay vì 10 phút chuyển đáp án trên giấy). Bạn phải điền trực tiếp vào màn hình.
                </p>
                <p>
                  • Bài thi Đọc có 60 phút cho 40 câu hỏi. Đồng hồ đếm ngược luôn hiển thị ở góc trên và cảnh báo đỏ khi còn dưới 5 phút và 2 phút.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 space-y-1.5">
                <span className="font-bold text-amber-400 block text-sm">2. Công cụ Đánh dấu & Ghi chú (Highlight & Notes)</span>
                <p>
                  • Bôi đen văn bản trong bài Đọc để chọn màu Highlight (Vàng, Xanh lam, Xanh lá) hoặc ghi chú nhanh câu hỏi.
                </p>
                <p>
                  • Bảng câu hỏi dưới chân trang (Question Palette) cho phép bạn chuyển nhanh câu, xem trạng thái Đã trả lời, Chưa làm, và tích chọn <strong>Review</strong> để quay lại sau.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 space-y-1.5">
                <span className="font-bold text-amber-400 block text-sm">3. Phím tắt hữu ích</span>
                <p>• <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-amber-300">Space</span>: Lật mặt từ vựng Flashcard</p>
                <p>• <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-amber-300">1 - 4</span>: Đánh giá SRS (Again, Hard, Good, Easy)</p>
                <p>• <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-amber-300">R</span>: Phát âm thanh từ vựng chuẩn Cambridge</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer"
              >
                Đã hiểu, quay lại làm bài
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
