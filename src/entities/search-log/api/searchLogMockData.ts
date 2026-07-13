import type { SearchLogDto } from './searchLog.dto';

const QUERY_SAMPLES: { original: string; normalized: string; resultCount: number }[] = [
  { original: '청년 월세', normalized: '청년월세', resultCount: 4 },
  { original: 'k-디지털 트레이닝', normalized: 'k디지털트레이닝', resultCount: 2 },
  { original: '청년내일채움공제', normalized: '청년내일채움공제', resultCount: 1 },
  { original: '주거 지원', normalized: '주거지원', resultCount: 6 },
  { original: '국비지원 교육', normalized: '국비지원교육', resultCount: 3 },
  { original: '창업 지원금', normalized: '창업지원금', resultCount: 5 },
  { original: '청년수당', normalized: '청년수당', resultCount: 2 },
  { original: '   ', normalized: '', resultCount: 0 },
];

const MOCK_SEARCH_LOG_COUNT = 32;
const MINUTE_MS = 60 * 1000;

function buildMockSearchLogs(): SearchLogDto[] {
  return Array.from({ length: MOCK_SEARCH_LOG_COUNT }, (_, index) => {
    const sample = QUERY_SAMPLES[index % QUERY_SAMPLES.length];
    return {
      id: `search-log-${index + 1}`,
      userId: index % 5 === 0 ? null : `user-${(index % 12) + 1}`,
      originalQuery: sample.original,
      normalizedQuery: sample.normalized,
      resultCount: sample.resultCount,
      searchedAt: new Date(Date.now() - index * (MINUTE_MS * 11)).toISOString(),
    };
  });
}

export const MOCK_SEARCH_LOG_DTOS: SearchLogDto[] = buildMockSearchLogs();
