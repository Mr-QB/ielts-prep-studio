import React, { useState } from 'react';
import { UserProfile } from '../types';
import { updateUserProfile } from '../utils/db';
import { X, User, Check, Target, Clock, Calendar } from 'lucide-react';

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: (updated: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateSuccess
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [currentBand, setCurrentBand] = useState(user.currentBand);
  const [targetBand, setTargetBand] = useState(user.targetBand);
  const [dailyMinutes, setDailyMinutes] = useState(user.dailyStudyMinutes);
  const [startDate, setStartDate] = useState(user.roadmapStartDate || new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const updated = await updateUserProfile({
      displayName: displayName.trim(),
      currentBand: Number(currentBand),
      targetBand: Number(targetBand),
      dailyStudyMinutes: Number(dailyMinutes),
      roadmapStartDate: startDate
    });

    setSaving(false);
    if (updated) {
      setSavedSuccess(true);
      onUpdateSuccess(updated);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-700" />
            <h3 className="font-semibold text-sm text-slate-900">
              Hồ sơ học tập cá nhân
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tên hiển thị
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Email tài khoản (không đổi)
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 text-slate-500 rounded-md cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Band hiện tại
              </label>
              <select
                value={currentBand}
                onChange={(e) => setCurrentBand(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {[3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5].map(b => (
                  <option key={b} value={b}>IELTS {b.toFixed(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mục tiêu (Target)
              </label>
              <select
                value={targetBand}
                onChange={(e) => setTargetBand(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {[6.0, 6.5, 7.0, 7.5, 8.0].map(b => (
                  <option key={b} value={b}>IELTS {b.toFixed(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Thời gian học mỗi ngày (Phút)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="60"
                max="360"
                step="15"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-28 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500">
                (Khuyến nghị: 180 phút / 3 tiếng mỗi ngày)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ngày bắt đầu lộ trình 180 ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 cursor-pointer disabled:opacity-50 transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đã lưu!</span>
                </>
              ) : (
                <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
