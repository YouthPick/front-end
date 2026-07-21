import { POLICY_ELIGIBLE_STATUSES } from '@/entities/policy';
import { REGIONS } from '@/shared/constants';

export const STATUSES = ['전체', ...POLICY_ELIGIBLE_STATUSES];

// '전체'가 지역 무관을 뜻한다(toFilterParam이 region 파라미터를 빼서 전송).
// 별도의 '전국' 선택지는 두지 않는다 — 전 시도 대상 정책은 개별 시도 조회에도 포함되므로
// 필터로서 의미가 없고, 백엔드도 특수 처리를 제거했다(back-end#93).
export const REGION_FILTER_OPTIONS = ['전체', ...REGIONS.filter((region) => region !== '전체')];

export const AGES = ['전체', '만 19~34세', '만 18세 이하', '만 35세 이상'];
