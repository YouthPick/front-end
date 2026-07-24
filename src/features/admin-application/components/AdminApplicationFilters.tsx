import { Search } from 'lucide-react';
import type { AdminPolicyApplicationStatus } from '@/entities/policy-application';

import { ALL_STATUS_VALUE } from '../hooks/useAdminApplicationFilters';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_STATUS_VALUE, label: '전체 상태' },
  { value: 'INTERESTED', label: '관심' },
  { value: 'PREPARING', label: '준비중' },
  { value: 'SUBMITTED', label: '신청완료' },
  { value: 'CLOSED', label: '종료' },
];

interface AdminApplicationFiltersProps {
  userId: string;
  onUserIdChange: (value: string) => void;
  onUserIdSubmit: () => void;
  policyName: string;
  onPolicyNameChange: (value: string) => void;
  onPolicyNameSubmit: () => void;
  status: AdminPolicyApplicationStatus | undefined;
  onStatusChange: (value: string) => void;
  deadlineStart: string;
  deadlineEnd: string;
  onDeadlineRangeChange: (range: { deadlineStart?: string; deadlineEnd?: string }) => void;
  onReset: () => void;
}

export function AdminApplicationFilters({
  userId,
  onUserIdChange,
  onUserIdSubmit,
  policyName,
  onPolicyNameChange,
  onPolicyNameSubmit,
  status,
  onStatusChange,
  deadlineStart,
  deadlineEnd,
  onDeadlineRangeChange,
  onReset,
}: AdminApplicationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <input
          type="text"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) onUserIdSubmit();
          }}
          placeholder="사용자 ID 검색"
          aria-label="사용자 ID로 정책 신청 검색"
          className="w-32 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={onUserIdSubmit}
          aria-label="사용자 ID로 검색"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={policyName}
          onChange={(e) => onPolicyNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) onPolicyNameSubmit();
          }}
          placeholder="정책명 검색"
          aria-label="정책명으로 정책 신청 검색"
          className="w-36 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={onPolicyNameSubmit}
          aria-label="정책명으로 검색"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
      </div>

      <select
        value={status ?? ALL_STATUS_VALUE}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="신청 상태 필터"
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={deadlineStart}
        onChange={(e) => onDeadlineRangeChange({ deadlineStart: e.target.value })}
        aria-label="마감일 시작"
        max={deadlineEnd || undefined}
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-600 focus:border-primary focus:outline-none"
      />
      <span className="text-xs text-slate-400">~</span>
      <input
        type="date"
        value={deadlineEnd}
        onChange={(e) => onDeadlineRangeChange({ deadlineEnd: e.target.value })}
        aria-label="마감일 종료"
        min={deadlineStart || undefined}
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-600 focus:border-primary focus:outline-none"
      />

      <button
        type="button"
        onClick={onReset}
        aria-label="필터 초기화"
        className="rounded-xl px-2.5 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      >
        초기화
      </button>
    </div>
  );
}
