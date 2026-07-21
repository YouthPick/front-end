import { POLICY_ELIGIBLE_STATUSES } from '@/entities/policy';
import { REGIONS } from '@/shared/constants';

export const STATUSES = ['전체', ...POLICY_ELIGIBLE_STATUSES];

// 검색 필터는 거주지 선택과 같은 목록을 쓴다. '전체'가 지역 무관을 뜻하고(toFilterParam이 region을
// 빼서 전송), 별도의 '전국' 선택지는 두지 않는다 — 전 시도 대상 정책은 policy_regions에 전 시도가
// 들어 있어 개별 시도 조회에도 포함되므로 필터로서 의미가 없다(back-end#93에서 특수 처리 제거).
export const REGION_FILTER_OPTIONS = REGIONS;

export const AGES = ['전체', '만 19~34세', '만 18세 이하', '만 35세 이상'];
