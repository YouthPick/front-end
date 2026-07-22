import {
  fetchPolicyCardPage,
  fetchRecommendedPolicies,
  mapPolicyCardToPolicy,
} from '@/entities/policy';

import type {
  PolicyRecommendation,
  RecommendationReliability,
} from '../types/recommendation.types';

// 매칭 축(백엔드 10축) → 추천 사유 문구. 백엔드가 축을 추가해도 화면이 깨지지 않도록 알 수 없는 축은
// fallback 문구로 내보내지만, 문구가 어색해지므로(예: "특화조건 조건이 일치합니다.") 축이 늘면 여기도 같이 채운다.
const REASON_BY_AXIS: Record<string, string> = {
  나이: '지원 연령 조건에 해당합니다.',
  지역: '거주 지역이 정책 지역 조건과 일치합니다.',
  취업: '현재 취업·구직 상태가 지원 대상에 포함됩니다.',
  학력: '학력 조건이 지원 대상에 포함됩니다.',
  분야: '관심 분야로 등록한 카테고리와 일치합니다.',
  키워드: '관심 키워드가 정책과 일치합니다.',
  특화조건: '특화조건(우대 대상)에 해당합니다.',
  전공: '전공 계열이 지원 대상에 포함됩니다.',
  결혼여부: '결혼 여부 조건에 해당합니다.',
  소득: '연소득이 정책 소득 기준 이내입니다.',
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

// 맞춤정책 조회(회원 전용). 매칭 점수는 백엔드가 계산해 내려주고, 프론트는 표시용 사유 문구·신뢰도만 파생한다.
export async function fetchRecommendations(): Promise<PolicyRecommendation[]> {
  try {
    const dtos = await fetchRecommendedPolicies();
    return dtos.map((dto) => ({
      policy: mapPolicyCardToPolicy(dto),
      score: dto.score,
      reliability: toReliability(dto.score),
      reasons: toReasons(dto.matchedAxes),
    }));
  } catch (error) {
    console.warn('추천 정책 조회 실패. 최신 정책 Fallback을 제공합니다.', error);
    try {
      const pageResult = await fetchPolicyCardPage(1, 6);
      return pageResult.data.map((dto) => ({
        policy: mapPolicyCardToPolicy(dto),
        score: 0,
        reliability: 'LOW',
        reasons: ['최근 등록된 새로운 청년 정책입니다.'],
      }));
    } catch (fallbackError) {
      console.error('최신 정책 Fallback 조회마저 실패했습니다.', fallbackError);
      return [];
    }
  }
}
