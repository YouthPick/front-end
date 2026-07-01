import { useEffect, useState } from "react";
import { fetchPolicySearchSuggestions } from "../api/policy-api";

interface UsePolicySearchSuggestionsResult {
  suggestions: string[];
  isLoading: boolean;
  isFallback: boolean;
  errorMessage: string | null;
}

export function usePolicySearchSuggestions(keyword: string): UsePolicySearchSuggestionsResult {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    const abortController = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    fetchPolicySearchSuggestions(keyword, abortController.signal)
      .then((result) => {
        setSuggestions(result.items.map((item) => item.keyword));
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        setSuggestions([]);
        setErrorMessage(error instanceof Error ? error.message : "검색어 제안 API 호출에 실패했습니다.");
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => abortController.abort();
  }, [keyword]);

  return {
    suggestions,
    isLoading,
    isFallback: false,
    errorMessage,
  };
}
