import { usePublicRegionsQuery } from '@/entities/region';
import { useMyProfileQuery } from '@/entities/user';

import { mapMyProfileResponse } from '../model/mapMyProfileResponse';

// 마이페이지 진입 시 서버에 저장된 프로필을 조회해 표시한다. 온보딩을 아직 완료하지 않은 사용자는
// 백엔드가 data: null을 내려주므로 isOnboarded=false로 구분한다(에러가 아니라 정상 응답).
export function useMyProfile() {
  const profileQuery = useMyProfileQuery();
  const { data: regions = [], isLoading: isRegionsLoading } = usePublicRegionsQuery();

  const isLoading = profileQuery.isLoading || (Boolean(profileQuery.data) && isRegionsLoading);
  const profile = profileQuery.data ? mapMyProfileResponse(profileQuery.data, regions) : null;

  return {
    profile,
    isOnboarded: profile !== null,
    isLoading,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
  };
}
