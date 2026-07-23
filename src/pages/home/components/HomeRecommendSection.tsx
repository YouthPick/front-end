import type { Policy } from '@/entities/policy';
import type { UserProfile } from '@/entities/user';
import { type PolicyRecommendation, RecommendationPreview } from '@/features/policy-recommendation';
import { ErrorState, Skeleton } from '@/shared/ui';

import { RecommendSetupCta } from './RecommendSetupCta';

interface HomeRecommendSectionProps {
  isAuthenticated: boolean;
  userName: string | null;
  profile: UserProfile | null;
  recommendations: PolicyRecommendation[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onStartRecommend: () => void;
  onEditProfile: () => void;
  onBrowseAll: () => void;
  onViewAll: () => void;
  onViewDetails: (policy: Policy) => void;
}

export function HomeRecommendSection({
  isAuthenticated,
  userName,
  profile,
  recommendations,
  isLoading,
  isError,
  onRetry,
  onStartRecommend,
  onEditProfile,
  onBrowseAll,
  onViewAll,
  onViewDetails,
}: HomeRecommendSectionProps) {
  if (!isAuthenticated || !userName) {
    return <RecommendSetupCta onStartRecommend={onStartRecommend} onBrowseAll={onBrowseAll} />;
  }

  if (isError) {
    return <ErrorState title="맞춤 추천을 불러오지 못했습니다" onRetry={onRetry} />;
  }

  if (isLoading) {
    return <Skeleton className="h-64" />;
  }

  // 온보딩 미완료 사용자는 서버가 프로필을 null로 내려준다(에러가 아니라 정상 응답).
  // 로딩 조건에 섞으면 스켈레톤에서 빠져나오지 못하므로 Empty 분기로 분리한다.
  if (!profile) {
    return (
      <RecommendSetupCta
        primaryLabel="맞춤 프로필 설정하고 추천받기"
        onStartRecommend={onStartRecommend}
        onBrowseAll={onBrowseAll}
      />
    );
  }

  return (
    <RecommendationPreview
      userName={userName}
      profile={profile}
      recommendations={recommendations}
      onEditProfile={onEditProfile}
      onViewAll={onViewAll}
      onViewDetails={onViewDetails}
    />
  );
}
