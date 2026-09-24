import React, { useState } from 'react';
import { loginUser } from '../utils/db';
import { UserProfile } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await loginUser(email.trim(), password);
    setLoading(false);
    if (result.success && result.user) onLoginSuccess(result.user);
    else setError(result.error || 'Email hoặc mật khẩu chưa chính xác.');
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="workspace-brand-mark">I</span>
          <div>
            <strong className="block text-base tracking-tight text-slate-900">IELTS Prep Studio</strong>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">A quieter way to study</span>
          </div>
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white px-7 py-8 shadow-sm sm:px-9">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">Không gian học cá nhân</p>
          <h1 className="font-serif-reading text-3xl leading-tight text-slate-900">Chào mừng bạn trở lại.</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Đăng nhập để tiếp tục lộ trình IELTS và mở lại sổ tay học tập của bạn.</p>

          {error && <p role="alert" className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email" required autoComplete="username" autoFocus value={email}
                onChange={event => setEmail(event.target.value)} placeholder="name@example.com"
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Mật khẩu
              <input
                type="password" required autoComplete="current-password" value={password}
                onChange={event => setPassword(event.target.value)} placeholder="Nhập mật khẩu"
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400"
              />
            </label>
            <button type="submit" disabled={loading} className="mt-2 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50">
              {loading ? 'Đang đăng nhập…' : 'Mở sổ học tập'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            Dữ liệu học tập được lưu riêng cho tài khoản của bạn.
          </div>
        </section>
      </div>
    </main>
  );
};
