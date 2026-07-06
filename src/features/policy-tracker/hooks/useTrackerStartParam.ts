import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { fetchPolicy } from "@/entities/policy";
import { useToast } from "@/shared/ui";

import { startTracker } from "../api/trackerApi";
import { trackerKeys } from "./useTrackers";

// 다른 feature(추천·찜·상세 모달)가 `/tracker?start={policyId}`로 진입시키면
// 여기서 트래커를 생성(또는 기존 항목 연결)하고 selected 파라미터로 치환한다.
export function useTrackerStartParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const startedPolicyIdRef = useRef<string | null>(null);

  const startMutation = useMutation({
    mutationFn: async (policyId: string) => {
      const policy = await fetchPolicy(policyId);
      if (!policy) return null;
      const result = await startTracker(policyId, policy.deadline);
      return { ...result, policyTitle: policy.title };
    },
    onSuccess: (result) => {
      if (!result) return;
      queryClient.invalidateQueries({ queryKey: trackerKeys.all });
      if (result.created) {
        showToast(`🎉 '${result.policyTitle}' 신청관리 상태가 새로 시작되었습니다!`, "success");
      } else {
        showToast("이미 등록된 신청 정보가 존재하여, 관리 상세로 연결되었습니다.", "info");
      }
    },
  });

  const startPolicyId = searchParams.get("start");

  useEffect(() => {
    if (!startPolicyId) return;
    // StrictMode 이중 실행 및 리렌더에 의한 중복 생성 방지
    if (startedPolicyIdRef.current === startPolicyId) return;
    startedPolicyIdRef.current = startPolicyId;

    startMutation.mutate(startPolicyId);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("start");
        next.set("selected", startPolicyId);
        return next;
      },
      { replace: true },
    );
    // startMutation은 매 렌더마다 새 객체이므로 의존성에 넣지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startPolicyId]);
}
