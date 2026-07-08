import type { TrackerItem, TrackerStatusTab } from "../../types/tracker.types";

export const TRACKER_STATUS_TABS: TrackerStatusTab[] = [
  "전체",
  "관심",
  "준비중",
  "신청완료",
  "결과대기",
  "종료",
];

interface TrackerStatusTabsProps {
  trackers: TrackerItem[];
  activeTab: TrackerStatusTab;
  onTabChange: (tab: TrackerStatusTab) => void;
}

export function TrackerStatusTabs({ trackers, activeTab, onTabChange }: TrackerStatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
      {TRACKER_STATUS_TABS.map((tab) => {
        const count =
          tab === "전체"
            ? trackers.length
            : trackers.filter((tracker) => tracker.status === tab).length;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            aria-pressed={activeTab === tab}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-all ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200/85"
            }`}
          >
            {tab} {count}
          </button>
        );
      })}
    </div>
  );
}
