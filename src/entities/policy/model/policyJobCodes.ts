// 온통청년 취업상태 코드(jobCd). 정책은 이 코드로 대상을 한정하고, 사용자는 온보딩 프로필 코드로
// 저장되므로 판정하려면 한쪽으로 번역해야 한다. 방향을 "온보딩 → jobCd"로 잡은 이유는, 반대로 가면
// 우리가 물어본 적 없는 코드(예: 영농종사자)를 어떻게 다룰지 매번 정해야 하기 때문이다.
//
// 실측(2026-07-21, 2,638건) 기준 분포와 의미 — 코드값은 정책 제목으로 교차 확인했다:
//   0013010 제한없음 1,962 · 0013003 미취업자 281 · 0013006 창업자 94
//   0013001 재직자 93 · 0013008 영농종사자 44 · 0013009 기타 43

/** 취업상태를 따지지 않는 정책. 어떤 상태를 골라도 대상에 포함되므로 백엔드가 함께 반환한다. */
export const JOB_CODE_UNRESTRICTED = '0013010';

/** 온보딩 EMPLOYMENT_STATUS_OPTIONS의 code → jobCd. 여기 없는 코드는 필터를 걸지 않는다. */
const JOB_CODE_BY_PROFILE_CODE: Record<string, string> = {
  UNEMPLOYED: '0013003',
  EMPLOYED: '0013001',
  SELF_EMPLOYED: '0013002',
  FREELANCER: '0013004',
  STARTUP: '0013006',
  ETC: '0013009',
};

export function jobCodeForProfileCode(profileCode: string | null): string | undefined {
  return profileCode ? JOB_CODE_BY_PROFILE_CODE[profileCode] : undefined;
}
