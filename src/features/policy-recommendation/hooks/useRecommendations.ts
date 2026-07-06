import { useQuery } from "@tanstack/react-query";

import { useProfileStore, type UserProfile } from "@/entities/user";

import { fetchRecommendations } from "../api/recommendApi";

export const recommendationKeys = {
  byProfile: (profile: UserProfile) => ["recommendations", profile] as const,
};

export function useRecommendations() {
  const profile = useProfileStore((state) => state.profile);

  const {
    data: recommendations = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: recommendationKeys.byProfile(profile),
    queryFn: () => fetchRecommendations(profile),
  });

  return { profile, recommendations, isLoading, isError, reload: refetch };
}
