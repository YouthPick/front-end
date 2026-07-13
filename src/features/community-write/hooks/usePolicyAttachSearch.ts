import { useState } from 'react';

import { usePolicySearchQuery } from '@/entities/policy';

// 정책 첨부 모달 전용 검색 상태. 검색 페이지의 URL 동기화 없이 로컬 상태로만 관리한다.
export function usePolicyAttachSearch() {
  const [draftQuery, setDraftQuery] = useState('');
  const [query, setQuery] = useState('');

  const { data: policies = [], isLoading, isError, refetch } = usePolicySearchQuery({ query });

  const submitSearch = () => setQuery(draftQuery.trim());

  return {
    draftQuery,
    setDraftQuery,
    submitSearch,
    policies,
    isLoading,
    isError,
    reload: refetch,
  };
}
