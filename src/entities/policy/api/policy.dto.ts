// 백엔드 공개 정책 API 응답 DTO. 목록(카드)과 상세를 분리해 정의한다.
// UI model(Policy)로의 변환은 policyMapper가 담당한다.

// GET /v1/policies 목록 카드 (백엔드 PolicyCardResponse)
// minAge/maxAge null = 나이 제한 없음, applicationEndDate null = 상시/일정 미정.
// provinces는 적용 시도명 목록(중복 제거·정렬, 지역 매핑 없으면 빈 배열) — "전국/OO 외 N" 표시 문구는
// 상세의 regions와 같은 규칙으로 프론트(policyMapper)가 조립한다.
// category는 DB nullable — 실데이터에 null 존재. 매퍼가 걸러낸다.
export interface PolicyCardDto {
  id: number;
  title: string;
  category: string | null;
  description: string | null;
  minAge: number | null;
  maxAge: number | null;
  applicationEndDate: string | null;
  provinces: string[];
}

// 상세 응답의 적용 지역 (백엔드 RegionResponse)
export interface PolicyRegionDto {
  regionCode: string;
  provinceName: string;
  districtName: string;
}

// GET /v1/policies/{id} 상세 (백엔드 PolicyDetailResponse)
export interface PolicyDetailDto {
  id: number;
  policyNo: string;
  title: string;
  description: string | null;
  supportContent: string | null;
  keywords: string | null;
  category: string | null;
  middleCategory: string | null;
  organizationName: string | null;
  minAge: number | null;
  maxAge: number | null;
  incomeConditionCode: string | null;
  incomeMaxAmount: number | null;
  incomeEtcContent: string | null;
  additionalQualification: string | null;
  participationRestriction: string | null;
  applicationPeriodType: string | null;
  applicationStartDate: string | null;
  applicationEndDate: string | null;
  businessPeriodBegin: string | null;
  businessPeriodEnd: string | null;
  businessPeriodEtc: string | null;
  supportScaleCount: number | null;
  firstComeFirstServed: boolean;
  applicationUrl: string | null;
  referenceUrl1: string | null;
  referenceUrl2: string | null;
  applicationMethod: string | null;
  submissionDocuments: string | null;
  screeningMethod: string | null;
  viewCount: number;
  regions: PolicyRegionDto[];
}

// 최근 본 정책 카드. 회원 전용 실 API(#75) 연동은 이번 범위(#82) 밖 — 목데이터 유지.
export interface RecentlyViewedPolicyDto {
  id: string;
  category: string;
  title: string;
  date: string;
}
