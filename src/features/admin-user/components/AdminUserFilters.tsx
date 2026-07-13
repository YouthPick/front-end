import { RotateCcw } from 'lucide-react';
import type { AdminUserAccountStatus, UserRole } from '@/entities/user';

import { ALL_FILTER_VALUE } from '../hooks/useAdminUserFilters';

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_FILTER_VALUE, label: '전체 역할' },
  { value: 'member', label: '일반 회원' },
  { value: 'admin', label: '관리자' },
];

const ACCOUNT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_FILTER_VALUE, label: '전체 상태' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'DELETED', label: '탈퇴' },
];

const PROVIDER_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_FILTER_VALUE, label: '전체 가입경로' },
  { value: '카카오', label: '카카오' },
  { value: '네이버', label: '네이버' },
  { value: 'Google', label: 'Google' },
];

interface AdminUserFiltersProps {
  role: UserRole | undefined;
  onRoleChange: (value: string) => void;
  accountStatus: AdminUserAccountStatus | undefined;
  onAccountStatusChange: (value: string) => void;
  provider: string | undefined;
  onProviderChange: (value: string) => void;
  onReset: () => void;
}

export function AdminUserFilters({
  role,
  onRoleChange,
  accountStatus,
  onAccountStatusChange,
  provider,
  onProviderChange,
  onReset,
}: AdminUserFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={role ?? ALL_FILTER_VALUE}
        onChange={(e) => onRoleChange(e.target.value)}
        aria-label="역할 필터"
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none"
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={accountStatus ?? ALL_FILTER_VALUE}
        onChange={(e) => onAccountStatusChange(e.target.value)}
        aria-label="계정 상태 필터"
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none"
      >
        {ACCOUNT_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={provider ?? ALL_FILTER_VALUE}
        onChange={(e) => onProviderChange(e.target.value)}
        aria-label="가입경로 필터"
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none"
      >
        {PROVIDER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onReset}
        aria-label="필터 초기화"
        className="inline-flex items-center space-x-1 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>초기화</span>
      </button>
    </div>
  );
}
