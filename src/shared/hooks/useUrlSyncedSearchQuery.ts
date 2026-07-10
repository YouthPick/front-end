import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { SEARCH_DEBOUNCE_MS } from '@/shared/constants';

// 검색어를 로컬 state로 관리하고 URL 쿼리파라미터(key)에는 디바운스로 반영한다.
// URL을 controlled value로 직접 쓰면 매 키 입력마다 라우터 리렌더를 거치게 되어
// 한글 조합(IME) 입력 중 값이 깨지는 문제가 있어, 로컬 state를 우선한다.
export function useUrlSyncedSearchQuery(
  key: string,
  debounceMs: number = SEARCH_DEBOUNCE_MS,
): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get(key) ?? '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (query === '') {
            next.delete(key);
          } else {
            next.set(key, query);
          }
          return next;
        },
        { replace: true },
      );
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs, key, setSearchParams]);

  return [query, setQuery];
}
