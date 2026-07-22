import { describe, expect, it } from 'vitest';

import type { PolicyDetailDto } from '../api/policy.dto';
import { mapPolicyDetailToPolicy } from './policyMapper';

function baseDto(overrides: Partial<PolicyDetailDto> = {}): PolicyDetailDto {
  return {
    id: 1,
    policyNo: 'P1',
    title: '테스트 정책',
    description: null,
    supportContent: null,
    keywords: null,
    category: '일자리',
    middleCategory: null,
    organizationName: null,
    minAge: null,
    maxAge: null,
    incomeConditionCode: null,
    incomeMaxAmount: null,
    incomeEtcContent: null,
    additionalQualification: null,
    participationRestriction: null,
    applicationPeriodType: null,
    applicationStartDate: null,
    applicationEndDate: null,
    businessPeriodBegin: null,
    businessPeriodEnd: null,
    businessPeriodEtc: null,
    supportScaleCount: null,
    firstComeFirstServed: false,
    applicationUrl: null,
    referenceUrl1: null,
    referenceUrl2: null,
    applicationMethod: null,
    submissionDocuments: null,
    screeningMethod: null,
    viewCount: 0,
    regions: [],
    ...overrides,
  };
}

describe('mapPolicyDetailToPolicy의 link 필드', () => {
  it('applicationUrl이 있으면 그대로(스킴 보정만) 쓴다', () => {
    const policy = mapPolicyDetailToPolicy(
      baseDto({ applicationUrl: 'www.bokjiro.go.kr', referenceUrl1: 'https://ref1.example' }),
    );
    expect(policy.link).toBe('https://www.bokjiro.go.kr');
  });

  it('applicationUrl이 없으면 referenceUrl1로 폴백한다', () => {
    const policy = mapPolicyDetailToPolicy(
      baseDto({ applicationUrl: null, referenceUrl1: 'https://ref1.example' }),
    );
    expect(policy.link).toBe('https://ref1.example');
  });

  it('applicationUrl과 referenceUrl1이 둘 다 없으면 referenceUrl2로 폴백한다', () => {
    const policy = mapPolicyDetailToPolicy(
      baseDto({ applicationUrl: null, referenceUrl1: null, referenceUrl2: 'https://ref2.example' }),
    );
    expect(policy.link).toBe('https://ref2.example');
  });

  it('셋 다 없으면 빈 문자열이다(Presenter가 버튼을 숨기는 신호)', () => {
    const policy = mapPolicyDetailToPolicy(
      baseDto({ applicationUrl: null, referenceUrl1: null, referenceUrl2: null }),
    );
    expect(policy.link).toBe('');
  });
});
