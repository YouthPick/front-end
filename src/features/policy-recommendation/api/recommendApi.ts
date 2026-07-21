import { fetchRecommendedPolicies, mapPolicyCardToPolicy } from '@/entities/policy';

import type {
  PolicyRecommendation,
  RecommendationReliability,
} from '../types/recommendation.types';

// 매칭 축(백엔드 REC 6축) → 추천 사유 문구. 새 축이 추가돼도 화면이 깨지지 않도록 알 수 없는 축은 그대로 보여준다.
const REASON_BY_AXIS: Record<string, string> = {
  나이: '지원 연령 조건에 해당합니다.',
  지역: '거주 지역이 정책 지역 조건과 일치합니다.',
  취업: '현재 취업·구직 상태가 지원 대상에 포함됩니다.',
  학력: '학력 조건이 지원 대상에 포함됩니다.',
  분야: '관심 분야로 등록한 카테고리와 일치합니다.',
  키워드: '관심 키워드가 정책과 일치합니다.',
};

function toReasons(matchedAxes: string[]): string[] {
  return matchedAxes.map((axis) => REASON_BY_AXIS[axis] ?? `${axis} 조건이 일치합니다.`);
}

const HIGH_SCORE_THRESHOLD = 70;
const MEDIUM_SCORE_THRESHOLD = 45;

function toReliability(score: number): RecommendationReliability {
  if (score >= HIGH_SCORE_THRESHOLD) return 'HIGH';
  if (score >= MEDIUM_SCORE_THRESHOLD) return 'MEDIUM';
  return 'LOW';
}

// 맞춤정책 조회(회원 전용). 매칭 점수는 백엔드(REC 6축)가 계산해 내려주고, 프론트는 표시용 사유 문구·신뢰도만 파생한다.
export async function fetchRecommendations(): Promise<PolicyRecommendation[]> {
  const dtos = await fetchRecommendedPolicies();
  return dtos.map((dto) => ({
    policy: mapPolicyCardToPolicy(dto),
    score: dto.score,
    reliability: toReliability(dto.score),
    reasons: toReasons(dto.matchedAxes),
  }));
}
