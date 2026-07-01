import { useEffect, useState } from "react";
import { fetchAdminMetrics, type AdminMetricsDto } from "../api/admin-metrics-api";

interface UseAdminMetricsResult {
  metrics: AdminMetricsDto;
  isLoading: boolean;
  isFallback: boolean;
  errorMessage: string | null;
}

const EMPTY_ADMIN_METRICS: AdminMetricsDto = {
  policy: {
    totalCount: 0,
    exposedCount: 0,
    activeCount: 0,
    missingReferenceUrlCount: 0,
  },
  user: {
    profileCount: 0,
    favoriteCount: 0,
    readStateCount: 0,
  },
  sync: {
    totalJobCount: 0,
    succeededJobCount: 0,
    failedJobCount: 0,
    runningJobCount: 0,
    lastJobStatus: null,
    lastJobErrorCount: 0,
  },
  generatedAt: "",
};

export function useAdminMetrics(): UseAdminMetricsResult {
  const [metrics, setMetrics] = useState<AdminMetricsDto>(EMPTY_ADMIN_METRICS);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);

    fetchAdminMetrics(abortController.signal)
      .then((result) => {
        setMetrics(result);
        setErrorMessage(null);
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        setMetrics(EMPTY_ADMIN_METRICS);
        setErrorMessage(error instanceof Error ? error.message : "운영 지표 API 호출에 실패했습니다.");
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => abortController.abort();
  }, []);

  return {
    metrics,
    isLoading,
    isFallback: false,
    errorMessage,
  };
}
