import { CheckCircle2, Compass, Home, Sparkles, User } from 'lucide-react';
import { NavLink } from 'react-router';

import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';

const NAV_ITEMS = [
  { to: ROUTES.home, label: '홈', icon: Home, end: true, authOnly: false },
  { to: ROUTES.search, label: '정책', icon: Compass, end: false, authOnly: false },
  { to: ROUTES.recommend, label: '추천', icon: Sparkles, end: false, authOnly: false },
  { to: ROUTES.tracker, label: '신청관리', icon: CheckCircle2, end: false, authOnly: true },
  { to: ROUTES.my, label: '마이', icon: User, end: false, authOnly: false },
];

export function MobileNav() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 로그인 전용 탭(신청관리)은 인증 사용자에게만 노출한다.
  const navItems = NAV_ITEMS.filter((item) => !item.authOnly || isAuthenticated);

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-2 flex items-center justify-around text-[10px] font-bold text-slate-400">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-0.5 ${
                isActive ? 'text-primary font-black' : 'hover:text-slate-600'
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
