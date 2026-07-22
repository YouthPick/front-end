import { useSearchParams } from 'react-router';

export const ALL_FILTER_VALUE = 'ALL';
const DEFAULT_PAGE = 1;

export interface UseUrlFiltersOptions<T extends Record<string, unknown>> {
  keys: (keyof T)[];
  normalizers?: {
    [K in keyof T]?: (value: string | null) => T[K];
  };
}

export function useUrlFilters<T extends Record<string, unknown>>({
  keys,
  normalizers,
}: UseUrlFiltersOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = keys.reduce<T>(
    (acc, key) => {
      const rawValue = searchParams.get(key as string);
      const normalizer = normalizers?.[key];
      const value = normalizer ? normalizer(rawValue) : (rawValue ?? undefined);
      acc[key] = value as T[typeof key];
      return acc;
    },
    {} as unknown as T,
  );

  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

  // Multi-key partial update; resets page to 1
  const applyFilters = (next: Partial<T>) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(next)) {
          if (!value || value === ALL_FILTER_VALUE) {
            nextParams.delete(key);
          } else {
            nextParams.set(key, value as string);
          }
        }
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  };

  const setFilter = <K extends keyof T>(key: K, value: string) => {
    applyFilters({ [key]: value } as unknown as Partial<T>);
  };

  const setPage = (nextPage: number) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        if (nextPage <= DEFAULT_PAGE) {
          nextParams.delete('page');
        } else {
          nextParams.set('page', String(nextPage));
        }
        return nextParams;
      },
      { replace: true },
    );
  };

  const resetFilters = () => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        for (const key of keys) {
          nextParams.delete(key as string);
        }
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  };

  return {
    filters,
    page,
    setFilter,
    applyFilters,
    setPage,
    resetFilters,
  };
}
