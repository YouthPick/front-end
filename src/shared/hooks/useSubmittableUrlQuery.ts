import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

// 검색어를 로컬 draft state로 관리하고, 제출(submitQuery) 시에만 URL 쿼리파라미터(key)에 반영한다.
// 타이핑만으로는 검색·URL이 바뀌지 않고, 버튼/Enter 제출 시에만 실제 검색에 반영되는 화면에 사용한다.
// 뒤로가기 등 외부 요인으로 URL 값이 바뀌면 draft도 그 값에 맞춰 동기화한다.
export function useSubmittableUrlQuery(key: string) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get(key) ?? '';
  const [draftQuery, setDraftQuery] = useState(query);

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  const applyQuery = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      },
      { replace: true },
    );
  };

  const submitQuery = () => applyQuery(draftQuery);

  return { query, draftQuery, setDraftQuery, submitQuery };
}
