import { useQuery } from '@tanstack/react-query';

import { policyKeys } from '@/entities/policy';

import { fetchRecommendations } from '../api/recommendApi';
import type { RecommendationResult } from '../types/recommendation.types';

// 조회 전/실패 시 기본값. 매 렌더 새 객체가 만들어지지 않도록 모듈 상수로 둔다.
const EMPTY_RESULT: RecommendationResult = { recommendations: [], isFallback: false };

// 프로필은 이 훅이 돌려주지 않는다 — Zustand store의 프로필은 isOnboarded만 persist돼서
// 새로고침 후 나머지 필드가 빈 값(region: '', birthYear: 0)으로 남기 때문이다.
// 프로필을 표시해야 하는 화면은 서버가 원본인 useMyProfile()을 쓴다.
//
// enabled: 회원 전용 API라 비로그인 사용자에게는 애초에 요청을 보내지 않는다(홈 화면처럼
// 비로그인도 접근 가능한 화면에서 씀). 로그인 필수 화면(예: /recommend)은 항상 인증된
// 상태라 기본값 true로 둬도 안전하다.
export function useRecommendations({ enabled = true }: { enabled?: boolean } = {}) {
  const {
    data = EMPTY_RESULT,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: policyKeys.recommended,
    queryFn: fetchRecommendations,
    enabled,
  });

  // isFallback은 추천 엔진 장애로 자격 매칭 대신 최신 정책을 보여주는 상태다.
  // 화면은 이 값으로 안내 문구를 바꿔야 한다(규칙 10 Degraded).
  return {
    recommendations: data.recommendations,
    isFallback: data.isFallback,
    isLoading,
    isError,
    reload: refetch,
  };
}
