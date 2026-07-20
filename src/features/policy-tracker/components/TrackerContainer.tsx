import { useQueries } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { fetchPolicy, mapPolicyDetailToPolicy, policyKeys } from '@/entities/policy';
import { usePagination } from '@/shared/hooks';
import { ErrorState, Skeleton } from '@/shared/ui';

import { useTrackerMutations } from '../hooks/useTrackerMutations';
import { useTrackerSelection } from '../hooks/useTrackerSelection';
import { useTrackerStartParam } from '../hooks/useTrackerStartParam';
import { useTrackers } from '../hooks/useTrackers';
import type { TrackerStatusTab } from '../types/tracker.types';
import { TrackerDetailPanel } from './TrackerDetailPanel';
import { TRACKER_STATUS_TABS, type TrackerListEntry, TrackerListPanel } from './TrackerListPanel';

const TRACKER_PAGE_SIZE = 5;

export function TrackerContainer() {
  // 마이페이지 활동 지표 등에서 `?tab=관심` 형태로 진입하면 해당 탭을 초기 탭으로 연다.
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TrackerStatusTab>(() => {
    const tabParam = searchParams.get('tab');
    return TRACKER_STATUS_TABS.includes(tabParam as TrackerStatusTab)
      ? (tabParam as TrackerStatusTab)
      : '전체';
  });
  const {
    data: trackers = [],
    isLoading: isTrackersLoading,
    isError: isTrackersError,
    refetch: refetchTrackers,
  } = useTrackers();
  // 등록된 트래커의 정책만 상세 API로 개별 조회한다. '전체 목록'(최신 100건) join 방식은
  // 100건 밖 정책을 조용히 누락시켰다. 상세 캐시(policyKeys.detail)는 상세 모달과 공유된다.
  const policyQueries = useQueries({
    queries: trackers.map((tracker) => ({
      queryKey: policyKeys.detail(tracker.policyId),
      queryFn: async () => mapPolicyDetailToPolicy(await fetchPolicy(tracker.policyId)),
    })),
  });
  const policies = policyQueries.flatMap((query) => (query.data ? [query.data] : []));
  const { selectedPolicyId, selectTracker, clearSelection } = useTrackerSelection();
  const mutations = useTrackerMutations();
  const { isStartError, retryStart } = useTrackerStartParam();

  // 목록(trackers)과 정책 조인(policies) 딜레이가 달라, policies가 pending/실패인 동안
  // policyTitle 필터가 목록을 비우면 탭 카운트(raw trackers)와 불일치가 생긴다.
  // 두 쿼리를 함께 게이트해 로딩/에러 상태에서 일관된 UI를 보장한다.
  // 단 404(삭제·비노출 전환 정책)는 에러가 아니라 '없는 항목'으로 취급해 목록에서만 제외한다.
  const isLoading = isTrackersLoading || policyQueries.some((query) => query.isPending);
  const isError =
    isTrackersError ||
    policyQueries.some(
      (query) =>
        query.isError && !(isAxiosError(query.error) && query.error.response?.status === 404),
    );

  // 로딩/에러 중에도 훅 호출 순서를 지키기 위해 조기 return보다 위에서 계산한다.
  const entries: TrackerListEntry[] = trackers
    .filter((tracker) => activeTab === '전체' || tracker.status === activeTab)
    .map((tracker) => ({
      tracker,
      policyTitle: policies.find((policy) => policy.id === tracker.policyId)?.title ?? '',
    }))
    .filter((entry) => entry.policyTitle !== '');
  const { page, pageItems, pageCount, setPage } = usePagination(entries, TRACKER_PAGE_SIZE);

  const handleTabChange = (tab: TrackerStatusTab) => {
    setActiveTab(tab);
    setPage(1);
  };

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
    return (
      <ErrorState
        title="신청관리 목록을 불러오지 못했습니다"
        onRetry={() => {
          if (isTrackersError) refetchTrackers();
          for (const query of policyQueries) {
            if (query.isError) query.refetch();
          }
        }}
      />
    );
  }

  const activeTracker = trackers.find((tracker) => tracker.policyId === selectedPolicyId) ?? null;
  const activePolicy = activeTracker
    ? (policies.find((policy) => policy.id === activeTracker.policyId) ?? null)
    : null;

  return (
    <div className="space-y-6">
      {isStartError && <ErrorState title="신청관리 시작에 실패했습니다" onRetry={retryStart} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <TrackerListPanel
          trackers={trackers}
          entries={pageItems}
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
              onUpdateStatus={(status) => mutations.updateStatus(activeTracker.policyId, status)}
              onUpdateDate={(targetDate) =>
                mutations.updateDate(activeTracker.policyId, targetDate)
              }
              onToggleChecklistItem={(itemId) =>
                mutations.toggleChecklistItem(activeTracker.policyId, itemId)
              }
              onDeleteChecklistItem={(itemId) =>
                mutations.deleteChecklistItem(activeTracker.policyId, itemId)
              }
              onAddChecklistItem={(text) =>
                mutations.addChecklistItem(activeTracker.policyId, text)
              }
              onEditChecklistItem={(itemId, text) =>
                mutations.editChecklistItem(activeTracker.policyId, itemId, text)
              }
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
                왼쪽의 신청관리 목록에서 특정 정책을 선택하거나, [맞춤 추천] 또는 [정책 찾기]
                목록에서 마음에 드는 항목의 **'신청관리 시작'**을 눌러보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
