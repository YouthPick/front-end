import type { PageResult } from '@/shared/types';

export interface ApiPageMeta {
  page: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiPageEnvelope<T> {
  data: T[];
  meta: ApiPageMeta;
}

// 백엔드 페이지 목록 응답({data, meta: {page, totalCount, totalPages}})을 프론트 PageResult로 변환한다.
export function toPageResult<T>(envelope: ApiPageEnvelope<T>, pageSize: number): PageResult<T> {
  return {
    items: envelope.data,
    page: envelope.meta.page,
    pageSize,
    totalCount: envelope.meta.totalCount,
  };
}
