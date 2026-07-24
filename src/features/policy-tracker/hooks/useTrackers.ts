import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/entities/user';

import { fetchTrackers } from '../api/trackerApi';

export const trackerKeys = {
  all: ['trackers'] as const,
};

export function useTrackers() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: trackerKeys.all,
    queryFn: fetchTrackers,
    staleTime: 5 * 60 * 1000, // 5분
    enabled: isAuthenticated,
  });
}
