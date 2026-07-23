import { useQuery } from '@tanstack/react-query';

import { fetchMyProfile } from '../api/myProfileApi';

export const myProfileKeys = {
  all: ['me', 'profile'] as const,
};

// enabled: 회원 전용 API라 비로그인 사용자에게는 애초에 요청을 보내지 않는다.
export function useMyProfileQuery(enabled = true) {
  return useQuery({
    queryKey: myProfileKeys.all,
    queryFn: fetchMyProfile,
    enabled,
  });
}
