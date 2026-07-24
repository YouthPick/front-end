import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Loader2,
  LogIn,
  MessagesSquare,
  RefreshCw,
  ScrollText,
  Search,
  Users,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router';

import { ROUTES } from '@/shared/constants';
import { useSeo } from '@/shared/hooks';

const NAV_SECTIONS = [
  {
    label: '대시보드',
    items: [{ to: ROUTES.admin, label: '운영사 대시보드', icon: LayoutDashboard, end: true }],
  },
  {
    label: '로그',
    items: [
      { to: ROUTES.adminLogsLogin, label: '로그인 로그', icon: LogIn, end: false },
      { to: ROUTES.adminLogsApplication, label: '애플리케이션 로그', icon: ScrollText, end: false },
      { to: ROUTES.adminLogsSearch, label: '검색 로그', icon: Search, end: false },
      { to: ROUTES.adminLogsBatch, label: '배치 작업 로그', icon: RefreshCw, end: false },
    ],
  },
  {
    label: '엔티티 관리',
    items: [
      { to: ROUTES.adminUsers, label: '사용자 관리', icon: Users, end: false },
      { to: ROUTES.adminPolicies, label: '정책 관리', icon: FileText, end: false },
      { to: ROUTES.adminApplications, label: '정책 신청 관리', icon: ClipboardList, end: false },
      { to: ROUTES.adminCommunity, label: '커뮤니티 관리', icon: MessagesSquare, end: false },
    ],
  },
] as const;

export function AdminLayout() {
  useSeo({ title: '관리자', noindex: true });
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isStaleUpdating = isFetching > 0 || isMutating > 0;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start relative">
      <aside className="lg:w-56 lg:flex-shrink-0">
        <nav
          aria-label="관리자 메뉴"
          className="space-y-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm lg:sticky lg:top-20"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="space-y-1.5">
              <span className="block px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {section.label}
              </span>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 rounded-xl px-2.5 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        isActive ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 relative">
        {isStaleUpdating && (
          <div
            aria-live="polite"
            className="absolute top-0 right-0 flex items-center space-x-1.5 rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 shadow-sm animate-in fade-in duration-200"
          >
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            <span>{isMutating > 0 ? '서버에 반영 중...' : '데이터 동기화 중...'}</span>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
