// 값은 백엔드 regions 테이블의 sido_name과 문자열이 완전히 일치해야 한다.
// 목록 API의 region 필터가 시도명 exact match이기 때문이다
// (back-end V3__seed_regions.sql 기준 16개 시도 — 광주광역시/전라남도는 전남광주통합특별시로 통합됨).
// 시드가 바뀌면 이 배열도 함께 갱신한다.
export const REGIONS = [
  '전체',
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전남광주통합특별시',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

// 표시명이 전송값과 다른 시도. '전남광주통합특별시'는 행정 표준 명칭이 아니라 시드의 통합 명칭이라
// 그대로 노출하면 광주·전남 주민이 자기 지역으로 인지하기 어렵다. 값은 유지하고 라벨만 바꾼다.
const REGION_LABEL_OVERRIDES: Record<string, string> = {
  전남광주통합특별시: '광주·전남',
};

export function regionLabel(region: string): string {
  return REGION_LABEL_OVERRIDES[region] ?? region;
}
