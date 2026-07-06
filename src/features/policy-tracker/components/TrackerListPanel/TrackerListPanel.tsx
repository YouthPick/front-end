import type { TrackerItem, TrackerStatusTab } from "../../types/tracker.types";
import { TrackerCard } from "./TrackerCard";
import { TrackerStatusTabs } from "./TrackerStatusTabs";

export interface TrackerListEntry {
  tracker: TrackerItem;
  policyTitle: string;
}

interface TrackerListPanelProps {
  trackers: TrackerItem[];
  entries: TrackerListEntry[];
  activeTab: TrackerStatusTab;
  selectedPolicyId: string | null;
  onTabChange: (tab: TrackerStatusTab) => void;
  onSelect: (policyId: string) => void;
}

export function TrackerListPanel({
  trackers,
  entries,
  activeTab,
  selectedPolicyId,
  onTabChange,
  onSelect,
}: TrackerListPanelProps) {
  return (
    <div className="lg:col-span-5 space-y-5 text-left">
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold text-primary">YouthPick &gt; 나의 보관함</span>
        <h2 className="text-lg font-black text-slate-800">신청 준비 일정 관리</h2>
        <p className="text-xs text-slate-400">
          관심 등록한 정책의 제출 기한, 구비 서류 체크리스트를 놓치지 않게 체계적으로 추적합니다.
        </p>
      </div>

      <TrackerStatusTabs trackers={trackers} activeTab={activeTab} onTabChange={onTabChange} />

      <div className="space-y-3">
        {entries.map(({ tracker, policyTitle }) => (
          <TrackerCard
            key={tracker.policyId}
            tracker={tracker}
            policyTitle={policyTitle}
            isSelected={selectedPolicyId === tracker.policyId}
            onSelect={onSelect}
          />
        ))}

        {entries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 px-4 text-center text-slate-400 text-xs">
            이 카테고리 상태에 배정된 신청 일감이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
