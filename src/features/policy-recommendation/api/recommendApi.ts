import { fetchPolicies, mapPolicyDtosToPolicies } from "@/entities/policy";
import type { UserProfile } from "@/entities/user";

import type { PolicyRecommendation } from "../types/recommendation.types";

// 추천 점수 계산은 실서비스에서 서버가 수행한다. 백엔드 API가 준비되면 이 mock 계산을 교체한다.
export async function fetchRecommendations(profile: UserProfile): Promise<PolicyRecommendation[]> {
  const policies = mapPolicyDtosToPolicies(await fetchPolicies());

  return policies
    .map((policy, index) => {
      let score = 70;
      if (policy.region === profile.region || policy.region === "전국") score += 15;
      if (profile.interests.includes(policy.category)) score += 10;
      if (policy.target === "전체" || policy.target === "만 19~34세") score += 5;
      // Add small mock variance
      score += (index % 3) * 4;

      return {
        policy,
        score: Math.min(score, 98),
        reliability: "MEDIUM" as const,
        reasons: [
          `거주지역이 ${profile.region} 조건과 일치합니다.`,
          `관심 분야인 ${policy.category} 카테고리에 속합니다.`,
          `취업상태 조건이 정책 자격에 근접합니다.`,
        ],
      };
    })
    .sort((a, b) => b.score - a.score);
}
