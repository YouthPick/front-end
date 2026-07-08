export interface PolicySearchFilters {
  region: string;
  status: string;
  category: string;
  age: string;
}

export type PolicySearchFilterKey = keyof PolicySearchFilters;
