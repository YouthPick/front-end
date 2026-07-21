import { useQueries } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { fetchPolicy, mapPolicyDetailToPolicy, policyKeys } from '@/entities/policy';
import { usePagination } from '@/shared/hooks';

import { TRACKER_STATUS_TABS, type TrackerListEntry } from '../components/TrackerListPanel';
import type { TrackerStatusTab } from '../types/tracker.types';
import { useTrackerSelection } from './useTrackerSelection';
import { useTrackers } from './useTrackers';

const TRACKER_PAGE_SIZE = 5;

// 신청관리 화면(TrackerContainer)의 데이터 조립을 전담한다: 목록·정책 조인, 탭 필터링,
// 페이지네이션, 로딩/에러 게이팅, 선택 상태까지 여기서 계산해 Container는 조립만 하게 한다.
export function useTrackerBoard() {
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

  const retryFailedQueries = () => {
    if (isTrackersError) refetchTrackers();
    for (const query of policyQueries) {
      if (query.isError) query.refetch();
    }
  };

  const activeTracker = trackers.find((tracker) => tracker.policyId === selectedPolicyId) ?? null;
  const activePolicy = activeTracker
    ? (policies.find((policy) => policy.id === activeTracker.policyId) ?? null)
    : null;

  return {
    trackers,
    activeTab,
    handleTabChange,
    entries: pageItems,
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
  };
}
