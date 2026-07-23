import { usePublicRegionsQuery } from '@/entities/region';
import { mapMyProfileResponse, useMyProfileQuery } from '@/entities/user';

// 마이페이지 진입 시 서버에 저장된 프로필을 조회해 표시한다. 온보딩을 아직 완료하지 않은 사용자는
// 백엔드가 data: null을 내려주므로 isOnboarded=false로 구분한다(에러가 아니라 정상 응답).
//
// enabled: 회원 전용 API라 비로그인 사용자에게는 애초에 요청을 보내지 않는다(홈 화면처럼
// 비로그인도 접근 가능한 화면에서 씀).
export function useMyProfile({ enabled = true }: { enabled?: boolean } = {}) {
  const profileQuery = useMyProfileQuery(enabled);
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
