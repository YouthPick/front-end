import type { Policy } from '@/entities/policy';

export type RecommendationReliability = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PolicyRecommendation {
  policy: Policy;
  score: number;
  reliability: RecommendationReliability;
  reasons: string[];
}

export interface RecommendationResult {
  recommendations: PolicyRecommendation[];
  // 추천 엔진 장애로 자격 매칭 대신 최신 정책 목록을 내려준 상태(규칙 10 Degraded).
  // 이 목록은 자격 필터를 거치지 않았으므로 화면 안내 문구가 매칭을 단정하면 안 된다.
  isFallback: boolean;
}
