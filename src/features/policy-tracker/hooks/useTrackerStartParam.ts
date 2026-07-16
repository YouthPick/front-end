import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { fetchPolicy, mapPolicyDetailToPolicy } from '@/entities/policy';
import { useToast } from '@/shared/ui';

import { startTracker } from '../api/trackerApi';
import { trackerKeys } from './useTrackers';

// 다른 feature(추천·찜·상세 모달)가 `/tracker?start={policyId}`로 진입시키면
// 여기서 트래커를 생성(또는 기존 항목 연결)하고 selected 파라미터로 치환한다.
export function useTrackerStartParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const startedPolicyIdRef = useRef<string | null>(null);

  const startMutation = useMutation({
    mutationFn: async (policyId: string) => {
      const policy = mapPolicyDetailToPolicy(await fetchPolicy(policyId));
      if (!policy) throw new Error(`정책을 찾을 수 없습니다: ${policyId}`);
      const result = await startTracker(policyId, policy.deadline);
      return { ...result, policyId, policyTitle: policy.title };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: trackerKeys.all });
      // 성공했을 때만 start를 selected로 치환한다 — 실패 시 start가 남아 새로고침이 곧 재시도가 된다.
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('start');
          next.set('selected', result.policyId);
          return next;
        },
        { replace: true },
      );
      if (result.created) {
        showToast(`🎉 '${result.policyTitle}' 신청관리 상태가 새로 시작되었습니다!`, 'success');
      } else {
        showToast('이미 등록된 신청 정보가 존재하여, 관리 상세로 연결되었습니다.', 'info');
      }
    },
    onError: () => {
      // 같은 start 파라미터로 재시도할 수 있게 가드를 푼다.
      startedPolicyIdRef.current = null;
      showToast('신청관리 시작에 실패했습니다. 다시 시도해 주세요.', 'warning');
    },
  });

  const startPolicyId = searchParams.get('start');

  // biome-ignore lint/correctness/useExhaustiveDependencies: startMutation은 매 렌더마다 새 객체라 제외하고 startPolicyId 변화에만 반응(ref 가드로 중복 방지)
  useEffect(() => {
    if (!startPolicyId) return;
    // StrictMode 이중 실행 및 리렌더에 의한 중복 생성 방지
    if (startedPolicyIdRef.current === startPolicyId) return;
    startedPolicyIdRef.current = startPolicyId;

    startMutation.mutate(startPolicyId);
    // startMutation은 매 렌더마다 새 객체이므로 의존성에 넣지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startPolicyId]);

  const retryStart = () => {
    if (!startPolicyId) return;
    startedPolicyIdRef.current = startPolicyId;
    startMutation.mutate(startPolicyId);
  };

  return { isStartError: startMutation.isError, retryStart };
}
