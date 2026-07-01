import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPolicyReadStates, markPolicyAsRead, type PolicyReadStateDto, type PolicyReadStatus } from "../api/policy-read-state-api";

interface UsePolicyReadStatesResult {
  readStatesByPolicyId: Record<string, PolicyReadStatus>;
  isLoading: boolean;
  isFallback: boolean;
  errorMessage: string | null;
  markRead: (policyId: string) => Promise<void>;
}

export function usePolicyReadStates(policyIds: string[]): UsePolicyReadStatesResult {
  const stablePolicyIds = useMemo(() => Array.from(new Set(policyIds)).filter(Boolean).sort(), [policyIds]);
  const [readStates, setReadStates] = useState<PolicyReadStateDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (stablePolicyIds.length === 0) {
      setReadStates([]);
      return;
    }

    const abortController = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    fetchPolicyReadStates(stablePolicyIds, abortController.signal)
      .then((result) => {
        setReadStates(result.items);
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        setReadStates([]);
        setErrorMessage(error instanceof Error ? error.message : "읽음 상태 API 호출에 실패했습니다.");
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => abortController.abort();
  }, [stablePolicyIds]);

  const markRead = useCallback(async (policyId: string) => {
    try {
      const result = await markPolicyAsRead(policyId);
      setReadStates((prev) => [
        ...prev.filter((item) => item.policyId !== policyId),
        result,
      ]);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "읽음 처리에 실패했습니다.");
      throw error;
    }
  }, []);

  const readStatesByPolicyId = useMemo(() => {
    const entries = stablePolicyIds.map((policyId) => [policyId, "UNREAD"] as const);
    readStates.forEach((item) => {
      entries.push([item.policyId, item.status]);
    });
    return Object.fromEntries(entries) as Record<string, PolicyReadStatus>;
  }, [readStates, stablePolicyIds]);

  return {
    readStatesByPolicyId,
    isLoading,
    isFallback: false,
    errorMessage,
    markRead,
  };
}
