import { useState } from "react";

import { usePoliciesQuery } from "@/entities/policy";
import { ErrorState, Skeleton } from "@/shared/ui";

import { useTrackerMutations } from "../hooks/useTrackerMutations";
import { useTrackers } from "../hooks/useTrackers";
import { useTrackerSelection } from "../hooks/useTrackerSelection";
import { useTrackerStartParam } from "../hooks/useTrackerStartParam";
import type { TrackerStatusTab } from "../types/tracker.types";
import { TrackerDetailPanel } from "./TrackerDetailPanel";
import { TrackerListPanel, type TrackerListEntry } from "./TrackerListPanel";

export function TrackerContainer() {
  const [activeTab, setActiveTab] = useState<TrackerStatusTab>("전체");
  const { data: trackers = [], isLoading, isError, refetch } = useTrackers();
  const { data: policies = [] } = usePoliciesQuery();
  const { selectedPolicyId, selectTracker, clearSelection } = useTrackerSelection();
  const mutations = useTrackerMutations();
  const { isStartError, retryStart } = useTrackerStartParam();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="lg:col-span-7">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="신청관리 목록을 불러오지 못했습니다" onRetry={() => refetch()} />;
  }

  const entries: TrackerListEntry[] = trackers
    .filter((tracker) => activeTab === "전체" || tracker.status === activeTab)
    .map((tracker) => ({
      tracker,
      policyTitle: policies.find((policy) => policy.id === tracker.policyId)?.title ?? "",
    }))
    .filter((entry) => entry.policyTitle !== "");

  const activeTracker = trackers.find((tracker) => tracker.policyId === selectedPolicyId) ?? null;
  const activePolicy = activeTracker
    ? policies.find((policy) => policy.id === activeTracker.policyId) ?? null
    : null;

  return (
    <div className="space-y-6">
      {isStartError && (
        <ErrorState title="신청관리 시작에 실패했습니다" onRetry={retryStart} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <TrackerListPanel
          trackers={trackers}
          entries={entries}
          activeTab={activeTab}
          selectedPolicyId={selectedPolicyId}
          onTabChange={setActiveTab}
          onSelect={selectTracker}
        />

        <div className="lg:col-span-7">
          {activeTracker && activePolicy ? (
            <TrackerDetailPanel
              tracker={activeTracker}
              policy={activePolicy}
              onUpdateStatus={(status) => mutations.updateStatus(activeTracker.policyId, status)}
              onUpdateDate={(targetDate) => mutations.updateDate(activeTracker.policyId, targetDate)}
              onToggleChecklistItem={(itemId) =>
                mutations.toggleChecklistItem(activeTracker.policyId, itemId)
              }
              onDeleteChecklistItem={(itemId) =>
                mutations.deleteChecklistItem(activeTracker.policyId, itemId)
              }
              onAddChecklistItem={(text) => mutations.addChecklistItem(activeTracker.policyId, text)}
              onSaveMemo={(memo) => mutations.saveMemo(activeTracker.policyId, memo)}
              onDeleteTracker={() =>
                mutations.deleteTracker(activeTracker.policyId, { onSuccess: clearSelection })
              }
            />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-24 px-4 text-center space-y-3">
              <span className="text-4xl">📋</span>
              <h3 className="text-sm font-bold text-slate-700">관리할 신청 일감을 선택해 주세요</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                왼쪽의 신청관리 목록에서 특정 정책을 선택하거나, [맞춤 추천] 또는 [정책 찾기] 목록에서 마음에 드는 항목의 **'신청관리 시작'**을 눌러보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
