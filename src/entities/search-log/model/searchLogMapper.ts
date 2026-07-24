import type { SearchLogDto } from '../api/searchLog.dto';
import type { SearchLog } from './searchLog.types';

export function mapSearchLogDtoToSearchLog(dto: SearchLogDto): SearchLog {
  return {
    id: dto.id,
    userId: dto.userId,
    originalQuery: dto.originalQuery,
    normalizedQuery: dto.normalizedQuery,
    resultCount: dto.resultCount,
    searchedAt: dto.searchedAt,
  };
}
