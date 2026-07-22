import { jobCodeForProfileCode } from '@/entities/policy';
import { codeForLabel, EMPLOYMENT_STATUS_OPTIONS } from '@/entities/user';
import { REGIONS } from '@/shared/constants';

// 취업상태 선택지는 온보딩과 같은 목록을 쓴다. 이전에는 mock 데이터 어휘(취업준비/대학생/…)를 썼는데
// '취업준비'와 '미취업'이 같은 jobCd로 겹쳤고, '대학생'은 jobCd가 아니라 schoolCd 축이라 서버로
// 번역할 방법이 없었다. 온보딩 어휘는 처음부터 jobCd를 보고 만들어져 1:1로 대응한다.
export const STATUSES = ['전체', ...EMPLOYMENT_STATUS_OPTIONS.map((option) => option.label)];

/** 선택된 취업상태 라벨을 백엔드 jobCode로 옮긴다. '전체'·미지정·모르는 라벨은 필터 미적용. */
export function toJobCodeParam(status: string | undefined): string | undefined {
  if (!status || status === '전체') return undefined;
  return jobCodeForProfileCode(codeForLabel(EMPLOYMENT_STATUS_OPTIONS, status));
}

// 검색 필터는 거주지 선택과 같은 목록을 쓴다. '전체'가 지역 무관을 뜻하고(toFilterParam이 region을
// 빼서 전송), 별도의 '전국' 선택지는 두지 않는다 — 전 시도 대상 정책은 policy_regions에 전 시도가
// 들어 있어 개별 시도 조회에도 포함되므로 필터로서 의미가 없다(back-end#93에서 특수 처리 제거).
export const REGION_FILTER_OPTIONS = REGIONS;

export const AGES = ['전체', '만 19~34세', '만 18세 이하', '만 35세 이상'];
