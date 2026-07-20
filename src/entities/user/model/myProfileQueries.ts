import { useQuery } from '@tanstack/react-query';

import { fetchMyProfile } from '../api/myProfileApi';

export const myProfileKeys = {
  all: ['me', 'profile'] as const,
};

export function useMyProfileQuery() {
  return useQuery({
    queryKey: myProfileKeys.all,
    queryFn: fetchMyProfile,
  });
}
