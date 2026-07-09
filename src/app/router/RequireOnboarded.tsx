import { Navigate, Outlet, useLocation } from 'react-router';

import { useProfileStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';

// 온보딩(프로필 설정)을 완료하지 않은 사용자가 맞춤 추천 탭으로 들어오면 마법사로 안내한다.
// 완료 후 원래 가려던 경로로 복귀할 수 있게 ProtectedRoute와 동일한 state.from 규약을 사용한다.
export function RequireOnboarded() {
  const isOnboarded = useProfileStore((state) => state.profile.isOnboarded);
  const location = useLocation();

  if (!isOnboarded) {
    return (
      <Navigate
        to={ROUTES.profileSetup}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  return <Outlet />;
}
