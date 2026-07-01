import { useCallback, useEffect, useState } from "react";
import { deleteFavoritePolicy, fetchFavoritePolicies, saveFavoritePolicy, type FavoritePolicyDto } from "../api/favorite-policy-api";

interface UseFavoritePoliciesResult {
  savedPolicyIds: string[];
  favoritePolicies: FavoritePolicyDto[];
  isLoading: boolean;
  isFallback: boolean;
  errorMessage: string | null;
  toggleFavoritePolicy: (policyId: string) => Promise<"saved" | "removed">;
}

export function useFavoritePolicies(): UseFavoritePoliciesResult {
  const [savedPolicyIds, setSavedPolicyIds] = useState<string[]>([]);
  const [favoritePolicies, setFavoritePolicies] = useState<FavoritePolicyDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    fetchFavoritePolicies(abortController.signal)
      .then((result) => {
        setFavoritePolicies(result.items);
        setSavedPolicyIds(result.items.map((item) => item.policyId));
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        setFavoritePolicies([]);
        setSavedPolicyIds([]);
        setErrorMessage(error instanceof Error ? error.message : "관심 정책 API 호출에 실패했습니다.");
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => abortController.abort();
  }, []);

  const toggleFavoritePolicy = useCallback(async (policyId: string): Promise<"saved" | "removed"> => {
    const wasSaved = savedPolicyIds.includes(policyId);
    const nextSavedPolicyIds = wasSaved
      ? savedPolicyIds.filter((id) => id !== policyId)
      : [...savedPolicyIds, policyId];

    setSavedPolicyIds(nextSavedPolicyIds);

    try {
      if (wasSaved) {
        await deleteFavoritePolicy(policyId);
        return "removed";
      }
      await saveFavoritePolicy(policyId);
      return "saved";
    } catch (error: unknown) {
      setSavedPolicyIds(savedPolicyIds);
      setErrorMessage(error instanceof Error ? error.message : "관심 정책 변경에 실패했습니다.");
      throw error;
    }
  }, [savedPolicyIds]);

  return {
    savedPolicyIds,
    favoritePolicies,
    isLoading,
    isFallback: false,
    errorMessage,
    toggleFavoritePolicy,
  };
}
