import { ChevronRight } from 'lucide-react';

import type { TrackerItem } from '../../types/tracker.types';

interface TrackerCardProps {
  tracker: TrackerItem;
  policyTitle: string;
  isSelected: boolean;
  onSelect: (policyId: string) => void;
}

function getStatusBadgeClasses(status: TrackerItem['status']): string {
  switch (status) {
    case '준비중':
      return 'bg-amber-50 text-amber-600 border border-amber-100';
    case '신청완료':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    default:
      return 'bg-slate-50 text-slate-500 border border-slate-100';
  }
}

export function TrackerCard({ tracker, policyTitle, isSelected, onSelect }: TrackerCardProps) {
  const totalItems = tracker.checklist.length;
  const completedItems = tracker.checklist.filter((item) => item.completed).length;
  const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(tracker.policyId)}
      className={`block w-full rounded-2xl border p-4 transition-all cursor-pointer text-left ${
        isSelected
          ? 'border-primary bg-primary/[0.01] shadow-sm ring-2 ring-primary/10'
          : 'border-slate-100 bg-white hover:border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${getStatusBadgeClasses(tracker.status)}`}
        >
          {tracker.status}
        </span>
        <span className="text-[10px] text-slate-400 font-bold">목표: {tracker.targetDate}</span>
      </div>

      <h4 className="text-xs font-extrabold text-slate-800 mt-2 line-clamp-1">{policyTitle}</h4>

      {/* Progress bar */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
          <span>
            체크리스트 {completedItems}/{totalItems} 완료
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
        <span>수정기록: 2026.06.23</span>
        <span className="text-primary hover:underline flex items-center space-x-0.5">
          <span>관리하기</span>
          <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}
