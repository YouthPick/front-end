import { useQuery } from '@tanstack/react-query';

import { fetchTrackers } from '../api/trackerApi';

export const trackerKeys = {
  all: ['trackers'] as const,
};

export function useTrackers() {
  return useQuery({
    queryKey: trackerKeys.all,
    queryFn: fetchTrackers,
  });
}
