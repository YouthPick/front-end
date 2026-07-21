import { describe, expect, it } from 'vitest';

import type { PolicyComparisonItemDto } from './compareApi.dto';
import { mapPolicyComparisonItemDtoToComparisonPolicy } from './compareMapper';

function createDto(overrides: Partial<PolicyComparisonItemDto> = {}): PolicyComparisonItemDto {
  return {
    policyId: 1,
    title: '청년 월세 지원',
    category: '주거',
    organizationName: '국토교통부',
    minAge: 19,
    maxAge: 34,
    incomeConditionCode: null,
    incomeMaxAmount: null,
    incomeEtcContent: null,
    additionalQualification: null,
    participationRestriction: null,
    applicationEndDate: null,
    applicationUrl: null,
    regions: [],
    ...overrides,
  };
}

// 목록·상세(entities/policy)와 같은 표시 규칙을 쓰는지 고정한다. 비교 매퍼가 자체 fallback을
// 두면서 같은 정책이 화면마다 다르게 보이던 회귀(#120)를 막는다.
describe('mapPolicyComparisonItemDtoToComparisonPolicy', () => {
  describe('카테고리', () => {
    it('식별 가능한 카테고리는 정규화된 표시명을 쓴다', () => {
      const policy = mapPolicyComparisonItemDtoToComparisonPolicy(createDto({ category: '교육' }));

      expect(policy.category).toBe('교육·직업훈련');
    });

    it('category가 null이면 정보 없음이 아니라 기타로 표시한다', () => {
      const policy = mapPolicyComparisonItemDtoToComparisonPolicy(createDto({ category: null }));

      expect(policy.category).toBe('기타');
    });

    it('식별할 수 없는 카테고리도 기타로 표시한다', () => {
      const policy = mapPolicyComparisonItemDtoToComparisonPolicy(
        createDto({ category: '알 수 없는 분류' }),
      );

      expect(policy.category).toBe('기타');
    });
  });

  describe('지역', () => {
    it('지역이 없으면 전국으로 표시한다', () => {
      const policy = mapPolicyComparisonItemDtoToComparisonPolicy(createDto({ regions: [] }));

      expect(policy.regionText).toBe('전국');
    });

    it('시도가 하나면 그 시도명을 표시한다', () => {
      const policy = mapPolicyComparisonItemDtoToComparisonPolicy(
        createDto({
          regions: [
            { regionCode: '11680', provinceName: '서울특별시', districtName: '강남구' },
            { regionCode: '11650', provinceName: '서울특별시', districtName: '서초구' },
          ],
        }),
      );

      expect(policy.regionText).toBe('서울특별시');
    });

    it('시도가 여러 개면 첫 시도 외 N으로 요약한다', () => {
      const policy = mapPolicyComparisonItemDtoToComparisonPolicy(
        createDto({
          regions: [
            { regionCode: '11680', provinceName: '서울특별시', districtName: '강남구' },
            { regionCode: '26110', provinceName: '부산광역시', districtName: '중구' },
          ],
        }),
      );

      expect(policy.regionText).toBe('부산광역시 외 1');
    });
  });
});
