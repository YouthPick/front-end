import { Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import youthPickLogo from '@/assets/images/youthpick-logo.png';
import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';

const MENU_ITEMS = [
  { to: ROUTES.home, label: '홈', end: true, muted: false, adminOnly: false },
  { to: ROUTES.search, label: '정책 찾기', end: false, muted: false, adminOnly: false },
  { to: ROUTES.recommend, label: '맞춤 추천', end: false, muted: false, adminOnly: false },
  { to: ROUTES.tracker, label: '신청관리', end: false, muted: false, adminOnly: false },
  { to: ROUTES.my, label: '마이페이지', end: false, muted: false, adminOnly: false },
  { to: ROUTES.admin, label: '관리자', end: false, muted: true, adminOnly: true },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  // 관리자 전용 링크는 실제 admin 계정에만 노출한다. (라우터 가드와 이중 방어)
  const menuItems = MENU_ITEMS.filter((item) => !item.adminOnly || user?.role === 'admin');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left side: logo and desktop menu */}
        <div className="flex items-center space-x-8">
          <Link
            to={ROUTES.home}
            onClick={() => setMobileMenuOpen(false)}
            className="flex cursor-pointer items-center"
            id="header-logo"
            aria-label="YouthPick 홈"
          >
            <img src={youthPickLogo} alt="" className="h-8 w-auto" />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-500">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `transition-all py-1.5 px-1 relative hover:text-primary ${
                    isActive
                      ? 'text-primary'
                      : item.muted
                        ? 'text-slate-400 font-medium hover:text-slate-600'
                        : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right side: login/profile */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(ROUTES.my);
              }}
              className="flex items-center space-x-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-100"
              id="header-profile-button"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white">
                {user.name[0]}
              </span>
              <span className="max-w-[70px] truncate">{user.name}님</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(ROUTES.login);
              }}
              className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-primary to-brand-secondary px-4.5 py-2 text-xs font-bold text-white transition-all hover:brightness-105 active:scale-95 cursor-pointer shadow-sm shadow-primary/10"
              id="login-button"
            >
              <User className="h-3.5 w-3.5" />
              <span>로그인</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 hover:bg-slate-50"
          >
            {mobileMenuOpen ? (
              <X className="h-4.5 w-4.5 text-slate-600" />
            ) : (
              <Menu className="h-4.5 w-4.5 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-inner animate-in slide-in-from-top duration-200">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center rounded-xl px-4 py-2.5 text-xs font-bold text-left transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
