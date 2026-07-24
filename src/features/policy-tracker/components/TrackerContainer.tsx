import { ErrorState, Skeleton } from '@/shared/ui';

import { useTrackerBoard } from '../hooks/useTrackerBoard';
import { useTrackerMutations } from '../hooks/useTrackerMutations';
import { useTrackerStartParam } from '../hooks/useTrackerStartParam';
import { TrackerDetailPanel } from './TrackerDetailPanel';
import { TrackerListPanel } from './TrackerListPanel';

export function TrackerContainer() {
  const {
    trackers,
    activeTab,
    handleTabChange,
    entries,
    page,
    pageCount,
    setPage,
    isLoading,
    isError,
    retryFailedQueries,
    selectedPolicyId,
    selectTracker,
    clearSelection,
    activeTracker,
    activePolicy,
  } = useTrackerBoard();
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
    return <ErrorState title="신청관리 목록을 불러오지 못했습니다" onRetry={retryFailedQueries} />;
  }

  return (
    <div className="space-y-6">
      {isStartError && <ErrorState title="신청관리 시작에 실패했습니다" onRetry={retryStart} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <TrackerListPanel
          trackers={trackers}
          entries={entries}
          activeTab={activeTab}
          selectedPolicyId={selectedPolicyId}
          onTabChange={handleTabChange}
          onSelect={selectTracker}
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
        />

        <div className="lg:col-span-7">
          {activeTracker && activePolicy ? (
            <TrackerDetailPanel
              tracker={activeTracker}
              policy={activePolicy}
              onUpdateStatus={(status) =>
                mutations.updateStatus(activeTracker.applicationId, status)
              }
              onUpdateDate={(targetDate) =>
                mutations.updateDate(activeTracker.applicationId, targetDate)
              }
              onToggleChecklistItem={(itemId) => {
                const item = activeTracker.checklist.find(
                  (checklistItem) => checklistItem.id === itemId,
                );
                if (item) mutations.toggleChecklistItem(item);
              }}
              onDeleteChecklistItem={(itemId) => mutations.deleteChecklistItem(itemId)}
              onAddChecklistItem={(text) =>
                mutations.addChecklistItem(activeTracker.applicationId, text)
              }
              onEditChecklistItem={(itemId, text) => mutations.editChecklistItem(itemId, text)}
              onSaveMemo={(memo) => mutations.saveMemo(activeTracker.applicationId, memo)}
              onDeleteTracker={() =>
                mutations.deleteTracker(activeTracker.applicationId, { onSuccess: clearSelection })
              }
            />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-24 px-4 text-center space-y-3">
              <span className="text-4xl">📋</span>
              <h3 className="text-sm font-bold text-slate-700">관리할 신청 일감을 선택해 주세요</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                왼쪽의 신청관리 목록에서 특정 정책을 선택하거나, [맞춤 정책] 또는 [정책 찾기]
                목록에서 마음에 드는 항목의 **'신청관리 시작'**을 눌러보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
