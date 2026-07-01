import { useCallback, useEffect, useState } from "react";
import { fetchPolicySyncJobs, rebuildSearchIndex, startPolicySync } from "../api/admin-sync-api";
import { mapPolicySyncJobDto } from "../lib/admin-sync-mapper";
import type { AdminSyncLog } from "./types";

interface UseAdminSyncResult {
  syncHistory: AdminSyncLog[];
  isLoadingHistory: boolean;
  isAdminSyncing: boolean;
  isSearchIndexRebuilding: boolean;
  isFallback: boolean;
  errorMessage: string | null;
  runAdminSync: () => Promise<AdminSyncLog>;
  runSearchIndexRebuild: () => Promise<string>;
}

export function useAdminSync(): UseAdminSyncResult {
  const [syncHistory, setSyncHistory] = useState<AdminSyncLog[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isAdminSyncing, setIsAdminSyncing] = useState(false);
  const [isSearchIndexRebuilding, setIsSearchIndexRebuilding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoadingHistory(true);

    fetchPolicySyncJobs(abortController.signal)
      .then((result) => {
        setSyncHistory(result.items.map(mapPolicySyncJobDto));
        setErrorMessage(null);
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        setSyncHistory([]);
        setErrorMessage(
          error instanceof Error ? error.message : "동기화 이력 API 호출에 실패했습니다.",
        );
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoadingHistory(false);
        }
      });

    return () => abortController.abort();
  }, []);

  const runAdminSync = useCallback(async () => {
    setIsAdminSyncing(true);
    try {
      const job = await startPolicySync("FULL");
      const log = mapPolicySyncJobDto(job);
      setSyncHistory((prev) => [log, ...prev.filter((item) => item.id !== log.id)]);
      setErrorMessage(null);
      return log;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "정책 수집 실행 API 호출에 실패했습니다.";
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsAdminSyncing(false);
    }
  }, []);

  const runSearchIndexRebuild = useCallback(async () => {
    setIsSearchIndexRebuilding(true);
    try {
      const result = await rebuildSearchIndex();
      setErrorMessage(null);
      return `${result.message} (${result.indexJobId})`;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "검색 인덱스 재생성 API 호출에 실패했습니다.";
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsSearchIndexRebuilding(false);
    }
  }, []);

  return {
    syncHistory,
    isLoadingHistory,
    isAdminSyncing,
    isSearchIndexRebuilding,
    isFallback: false,
    errorMessage,
    runAdminSync,
    runSearchIndexRebuild,
  };
}
