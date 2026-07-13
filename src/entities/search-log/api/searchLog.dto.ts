export interface SearchLogDto {
  id: string;
  userId: string | null;
  originalQuery: string;
  normalizedQuery: string;
  resultCount: number;
  searchedAt: string;
}
