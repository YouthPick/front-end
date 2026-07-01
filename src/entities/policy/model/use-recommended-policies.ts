import { useEffect, useMemo, useState } from "react";
import {
  fetchRecommendedPolicies,
  type RecommendationConfidence,
  type RecommendedPolicyQuery,
} from "../api/recommendation-api";
import { mapPolicyCardDto } from "../lib/policy-mapper";
import type { Policy } from "./types";

export interface RecommendedPolicy {
  policy: Policy;
  score: number;
  reliability: RecommendationConfidence;
  reasons: string[];
  reasonDetails: Array<{
    code: string;
    message: string;
    score: number;
  }>;
  checkpoints: string[];
}

interface UseRecommendedPoliciesResult {
  recommendedPolicies: RecommendedPolicy[];
  isLoading: boolean;
  isFallback: boolean;
  errorMessage: string | null;
  message: string;
  personalized: boolean;
}

export function useRecommendedPolicies(
  query: RecommendedPolicyQuery,
): UseRecommendedPoliciesResult {
  const queryKey = useMemo(() => JSON.stringify(query), [query]);
  const [recommendedPolicies, setRecommendedPolicies] = useState<RecommendedPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("서버 추천 데이터를 불러오는 중입니다.");
  const [personalized, setPersonalized] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const parsedQuery = JSON.parse(queryKey) as RecommendedPolicyQuery;

    setIsLoading(true);
    setErrorMessage(null);

    fetchRecommendedPolicies(parsedQuery, abortController.signal)
      .then((result) => {
        setRecommendedPolicies(
          result.items.map((item) => ({
            policy: mapPolicyCardDto(item.policy),
            score: item.score,
            reliability: item.confidence,
            reasons: item.reasons.map((reason) => reason.message),
            reasonDetails: item.reasons,
            checkpoints: item.checkpoints,
          })),
        );
        setMessage(result.message);
        setPersonalized(result.personalized);
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        setRecommendedPolicies([]);
        setMessage("추천 서버 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        setPersonalized(false);
        setErrorMessage(error instanceof Error ? error.message : "추천 API 호출에 실패했습니다.");
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => abortController.abort();
  }, [queryKey]);

  return {
    recommendedPolicies,
    isLoading,
    isFallback: false,
    errorMessage,
    message,
    personalized,
  };
}
