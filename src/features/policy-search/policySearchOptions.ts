import { POLICY_ELIGIBLE_STATUSES } from '@/entities/policy';
import { REGIONS } from '@/shared/constants';

export const STATUSES = ['전체', ...POLICY_ELIGIBLE_STATUSES];

// 검색 필터는 거주지 선택(REGIONS)과 달리 '전국' 공통 정책만 보기 옵션을 함께 제공한다.
// showNationwideOnly가 region="전국"을 세팅했을 때 controlled select가 매칭되도록 한다.
export const REGION_FILTER_OPTIONS = [
  '전체',
  '전국',
  ...REGIONS.filter((region) => region !== '전체'),
];

export const AGES = ['전체', '만 19~34세', '만 18세 이하', '만 35세 이상'];
