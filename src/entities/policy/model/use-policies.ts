import { useEffect, useState } from "react";
import type { FilterState } from "@features/policy-filter";
import { fetchPolicies } from "../api/policy-api";
import { mapPolicyCardDto } from "../lib/policy-mapper";
import type { Policy } from "./types";

export interface PolicyPagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface UsePoliciesResult {
  policies: Policy[];
  pagination: PolicyPagination;
  isLoading: boolean;
  isFallback: boolean;
  errorMessage: string | null;
}

const EMPTY_PAGINATION: PolicyPagination = {
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
};

export function usePolicies(keyword: string, filters: FilterState, page = 0, size = 20): UsePoliciesResult {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [pagination, setPagination] = useState<PolicyPagination>(EMPTY_PAGINATION);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    fetchPolicies({ keyword, filters, page, size }, abortController.signal)
      .then((result) => {
        setPolicies(result.items.map(mapPolicyCardDto));
        setPagination(result.pagination);
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        setPolicies([]);
        setPagination({ ...EMPTY_PAGINATION, page, size });
        setErrorMessage(error instanceof Error ? error.message : "정책 API 호출에 실패했습니다.");
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => abortController.abort();
  }, [keyword, filters, page, size]);

  return {
    policies,
    pagination,
    isLoading,
    isFallback: false,
    errorMessage,
  };
}
