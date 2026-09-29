import React, { useEffect, useState } from 'react';
import { AppTab, ExamFamily, UserProfile } from '../types';
import { playSoundTestChime } from '../utils/audioUtils';
import { checkD1Status } from '../utils/db';

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  examFamily: ExamFamily;
  onExamFamilyChange: (family: ExamFamily) => void;
  user: UserProfile;
  onLogout: () => void;
  onOpenProfile: () => void;
}

const groups: { title: string; items: { tab: AppTab; label: string }[] }[] = [
  { title: 'Bắt đầu', items: [{ tab: 'today', label: 'Hôm nay' }, { tab: 'plan', label: 'Kế hoạch học' }] },
  { title: 'Luyện tập', items: [{ tab: 'cambridge', label: 'Cambridge 12 GT' }] },
  { title: 'Kiến thức', items: [
    { tab: 'vocab', label: 'Từ vựng' },
    { tab: 'grammar', label: 'Ngữ pháp' },
    { tab: 'strategy', label: 'Chiến thuật' },
    { tab: 'writing', label: 'Viết' },
    { tab: 'speaking', label: 'Nói' }
  ] },
  { title: 'Ôn tập', items: [
    { tab: 'mistakes', label: 'Sổ lỗi sai' },
    { tab: 'progress', label: 'Tiến độ' }
  ] }
];

const mobileGroups = [
  { key: 'practice', label: 'Luyện tập', items: groups[1].items },
  { key: 'learn', label: 'Kiến thức', items: groups[2].items },
  { key: 'review', label: 'Kế hoạch & ôn', items: [{ tab: 'plan' as const, label: 'Kế hoạch học' }, ...groups[3].items] }
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, examFamily, onExamFamilyChange, user, onLogout, onOpenProfile }) => {
  const [d1Connected, setD1Connected] = useState<boolean | null>(null);
  const [mobileMenu, setMobileMenu] = useState<string | null>(null);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = () => checkD1Status().then(status => mounted && setD1Connected(status.connected));
    check();
    const timer = window.setInterval(check, 30000);
    return () => { mounted = false; window.clearInterval(timer); };
  }, []);

  const navItem = (tab: AppTab, label: string, mobile = false) => (
    <button
      key={tab}
      type="button"
      aria-current={activeTab === tab ? 'page' : undefined}
      onClick={() => { onTabChange(tab); setMobileMenu(null); }}
      className={`workspace-link ${activeTab === tab ? 'workspace-link-active' : ''} ${mobile ? 'workspace-link-mobile' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <aside className="workspace-sidebar">
        <button type="button" onClick={() => onTabChange('today')} className="workspace-brand">
          <span className="workspace-brand-mark">I</span>
          <span><strong>{examFamily === 'aptis' ? 'Aptis Prep' : 'IELTS Prep'}</strong><small>STUDY STUDIO</small></span>
        </button>

        <div className="mx-4 mt-4 grid grid-cols-2 rounded-lg border border-line bg-paper-deep p-1" aria-label="Chế độ học">
          {(['ielts', 'aptis'] as const).map(family => <button key={family} type="button" aria-pressed={examFamily === family} onClick={() => onExamFamilyChange(family)} className={`rounded-md px-2 py-2 text-xs font-semibold transition-colors ${examFamily === family ? 'bg-paper text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>{family.toUpperCase()}</button>)}
        </div>

        <nav className="workspace-navigation" aria-label="Điều hướng chính">
          {examFamily === 'aptis' ? <section className="workspace-nav-group"><h2>Mẫu đề</h2>{navItem('aptis', 'Bốn kỹ năng')}</section> : groups.map(group => (
            <section key={group.title} className="workspace-nav-group">
              <h2>{group.title}</h2>
              {group.items.map(item => navItem(item.tab, item.label))}
            </section>
          ))}
        </nav>

        <div className="workspace-sidebar-bottom">
          <div className="workspace-sync-status">
            <span className={`workspace-status-dot ${d1Connected ? 'is-connected' : ''}`} />
            <span>{d1Connected ? 'Đã kết nối đồng bộ' : 'Lưu trên thiết bị'}</span>
          </div>
          <button type="button" className="workspace-utility-link" onClick={playSoundTestChime}>Kiểm tra âm thanh</button>
          <div className="workspace-account">
            <button type="button" className="workspace-account-button" onClick={() => setUserMenu(!userMenu)} aria-expanded={userMenu}>
              <span className="workspace-avatar">{user.displayName.charAt(0).toUpperCase()}</span>
              <span className="workspace-account-copy"><strong>{user.displayName}</strong><small>Band {user.targetBand.toFixed(1)} · {user.dailyStudyMinutes} phút/ngày</small></span>
              <span aria-hidden="true" className="workspace-account-caret">⌄</span>
            </button>
            {userMenu && (
              <div className="workspace-account-menu">
                <button type="button" onClick={() => { setUserMenu(false); onOpenProfile(); }}>Hồ sơ & mục tiêu</button>
                <button type="button" onClick={() => { setUserMenu(false); onLogout(); }}>Đăng xuất</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <header className="workspace-mobile-header">
        <button type="button" onClick={() => onTabChange('today')} className="workspace-brand workspace-brand-mobile">
          <span className="workspace-brand-mark">{examFamily === 'aptis' ? 'A' : 'I'}</span><strong>{examFamily === 'aptis' ? 'Aptis Prep' : 'IELTS Prep'}</strong>
        </button>
        <div className="flex shrink-0 rounded-md border border-line bg-paper-deep p-0.5" aria-label="Chế độ học">
          {(['ielts', 'aptis'] as const).map(family => <button key={family} type="button" aria-pressed={examFamily === family} onClick={() => onExamFamilyChange(family)} className={`rounded px-2 py-1 text-[10px] font-semibold ${examFamily === family ? 'bg-paper text-ink shadow-sm' : 'text-muted'}`}>{family.toUpperCase()}</button>)}
        </div>
        <button type="button" className="workspace-mobile-account" onClick={() => setUserMenu(!userMenu)} aria-label="Mở menu tài khoản">
          {user.displayName.charAt(0).toUpperCase()}
        </button>
        {userMenu && (
          <div className="workspace-mobile-account-menu">
            <button type="button" onClick={() => { setUserMenu(false); onOpenProfile(); }}>Hồ sơ & mục tiêu</button>
            <button type="button" onClick={() => { setUserMenu(false); onLogout(); }}>Đăng xuất</button>
          </div>
        )}
      </header>
      <nav className="workspace-mobile-nav" aria-label="Điều hướng trên điện thoại">
        {examFamily === 'aptis' ? navItem('aptis', 'Mẫu đề', true) : <>
        {navItem('today', 'Hôm nay', true)}
        {mobileGroups.map(group => (
          <div key={group.key} className="workspace-mobile-nav-group">
            <button
              type="button"
              className={`workspace-link workspace-link-mobile ${group.items.some(item => item.tab === activeTab) ? 'workspace-link-active' : ''}`}
              onClick={() => setMobileMenu(mobileMenu === group.key ? null : group.key)}
              aria-expanded={mobileMenu === group.key}
            >{group.label}</button>
            {mobileMenu === group.key && <div className="workspace-mobile-submenu">{group.items.map(item => navItem(item.tab, item.label, true))}</div>}
          </div>
        ))}
        </>}
      </nav>
    </>
  );
};
