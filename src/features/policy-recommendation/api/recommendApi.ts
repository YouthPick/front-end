import { type Policy, UNRESTRICTED_CONDITION } from '@/entities/policy';
import type { UserProfile } from '@/entities/user';
import { CURRENT_YEAR } from '@/shared/constants';

import type { PolicyRecommendation } from '../types/recommendation.types';

// 온보딩의 취업/학력 상태 vocabulary를 정책의 eligibleStatuses vocabulary로
// 느슨하게 연결하는 매핑. 두 값 체계가 서로 다른 목적(온보딩 입력 vs 정책 신분 구분)으로 설계돼 있어
// 직접 비교할 수 없으므로, 실질적으로 겹치는 신분에 한해 매칭시킨다.
const EMPLOYMENT_TO_ELIGIBLE_TOKENS: Record<string, string[]> = {
  미취업·구직: ['미취업', '취업준비'],
  재직: ['직장인'],
  자영업: ['창업자'],
  프리랜서: [],
  창업·창업준비: ['창업자', '취업준비'],
  기타: [],
};

const EDUCATION_TO_ELIGIBLE_TOKENS: Record<string, string[]> = {
  '고졸 미만': [],
  '고교 재학': [],
  '고교 졸업': [],
  '대학 재학': ['대학생'],
  '대졸 예정': ['대학생', '취업준비'],
  '대학 졸업': [],
  석·박사: ['대학원생'],
  기타: [],
};

function getAge(birthYear: number): number {
  return CURRENT_YEAR - birthYear;
}

function matchesAge(age: number, ageMin: number | null, ageMax: number | null): boolean {
  if (ageMin !== null && age < ageMin) return false;
  if (ageMax !== null && age > ageMax) return false;
  return true;
}

type EligibleStatusMatch = {
  matched: boolean;
  // 어느 쪽 상태 값이 실제로 일치했는지. 추천 사유 문구에 올바른 값을 표시하는 데 쓰인다.
  matchedBy: 'employment' | 'education' | null;
};

function matchesEligibleStatus(
  profile: UserProfile,
  eligibleStatuses: string[],
): EligibleStatusMatch {
  if (eligibleStatuses.length === 0 || eligibleStatuses.includes('전체')) {
    return { matched: true, matchedBy: null };
  }
  const employmentTokens = EMPLOYMENT_TO_ELIGIBLE_TOKENS[profile.employmentStatus] ?? [];
  const educationTokens = EDUCATION_TO_ELIGIBLE_TOKENS[profile.educationStatus] ?? [];
  if (eligibleStatuses.some((status) => employmentTokens.includes(status))) {
    return { matched: true, matchedBy: 'employment' };
  }
  if (eligibleStatuses.some((status) => educationTokens.includes(status))) {
    return { matched: true, matchedBy: 'education' };
  }
  return { matched: false, matchedBy: null };
}

// 결혼상태·전공: 유저가 미선택(빈 값)이거나 정책이 제한없음이면 항상 통과시키고, 그 외엔 정확히 일치해야 통과한다.
function matchesOpenCondition(userValue: string, policyCondition: string): boolean {
  return (
    policyCondition === UNRESTRICTED_CONDITION || userValue === '' || userValue === policyCondition
  );
}

type ConditionResult = 'neutral' | 'match' | 'mismatch';

function matchesSpecialConditions(profile: UserProfile, tags: string[]): ConditionResult {
  if (tags.length === 0) return 'neutral';
  return tags.some((tag) => profile.specialConditions.includes(tag)) ? 'match' : 'mismatch';
}

function matchesIncome(profile: UserProfile, incomeMax: number | null): ConditionResult {
  if (incomeMax === null) return 'neutral';
  if (profile.incomeUnknown || profile.annualIncome === null) return 'neutral';
  return profile.annualIncome <= incomeMax ? 'match' : 'mismatch';
}

// 추천 점수 계산은 실서비스에서 서버가 수행한다. 백엔드 API가 준비되면
// 이 mock 계산을 apiClient 호출로 교체하고, 정책 목록 인자는 제거한다.
export function buildRecommendations(
  policies: Policy[],
  profile: UserProfile,
): PolicyRecommendation[] {
  const age = getAge(profile.birthYear);

  return policies
    .map((policy) => {
      let score = 55;
      const reasons: string[] = [];
      // 연령·결혼상태·전공·소득처럼 정책이 명시적으로 요구하는 조건과 어긋나면 점수를 깎는 것만으로는
      // 부족하다(다른 가점으로 상쇄돼 부적격 정책이 상위에 노출될 수 있음). 하드 미스매치는 별도로 표시해
      // 아래에서 추천 목록 자체에서 제외한다.
      let hardIneligible = false;

      if (policy.region === profile.region || policy.region === '전국') {
        score += 15;
        reasons.push(`거주지역(${profile.region})이 정책 지역 조건과 일치합니다.`);
      } else {
        score -= 5;
      }

      if (policy.ageMin !== null || policy.ageMax !== null) {
        if (matchesAge(age, policy.ageMin, policy.ageMax)) {
          score += 10;
          reasons.push(`만 ${age}세로 지원 연령 조건에 해당합니다.`);
        } else {
          score -= 25;
          hardIneligible = true;
        }
      }

      const eligibleResult = matchesEligibleStatus(profile, policy.eligibleStatuses);
      if (eligibleResult.matched) {
        if (policy.eligibleStatuses.length > 0 && !policy.eligibleStatuses.includes('전체')) {
          score += 8;
          const matchedLabel =
            eligibleResult.matchedBy === 'education'
              ? profile.educationStatus
              : profile.employmentStatus;
          reasons.push(`현재 상태(${matchedLabel})가 정책 대상 자격에 포함됩니다.`);
        }
      } else {
        score -= 6;
      }

      if (profile.interests.includes(policy.category)) {
        score += 10;
        reasons.push(`관심 분야로 등록한 ${policy.category} 카테고리에 속합니다.`);
      }

      if (!matchesOpenCondition(profile.maritalStatus, policy.maritalCondition)) {
        score -= 12;
        hardIneligible = true;
      }

      if (!matchesOpenCondition(profile.major, policy.majorCondition)) {
        score -= 8;
        hardIneligible = true;
      }

      const specialResult = matchesSpecialConditions(profile, policy.specialConditionTags);
      if (specialResult === 'match') {
        score += 8;
        reasons.push('특화 조건(우대 대상)에 해당해 우선 매칭되었습니다.');
      } else if (specialResult === 'mismatch') {
        score -= 8;
      }

      const incomeResult = matchesIncome(profile, policy.incomeMax);
      if (incomeResult === 'match') {
        score += 6;
        reasons.push('입력하신 연소득이 정책 소득 기준 이내입니다.');
      } else if (incomeResult === 'mismatch') {
        score -= 15;
        hardIneligible = true;
      }

      if (reasons.length === 0) {
        reasons.push('기본 프로필 조건을 기준으로 참고용으로 추천되었습니다.');
      }

      return {
        hardIneligible,
        recommendation: {
          policy,
          score: Math.min(98, Math.max(10, score)),
          reliability: 'MEDIUM' as const,
          reasons,
        },
      };
    })
    .filter((entry) => !entry.hardIneligible)
    .map((entry) => entry.recommendation)
    .sort((a, b) => b.score - a.score);
}
