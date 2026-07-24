import { usePolicySearch } from '@/features/policy-search';
import { useSeo } from '@/shared/hooks';
import { SearchPagePresenter } from './SearchPagePresenter';

export function SearchPageContainer() {
  useSeo({
    title: '정책 검색',
    description: '카테고리, 지역, 마감일로 청년정책을 검색하고 나에게 맞는 정책을 찾아보세요.',
  });
  const searchProps = usePolicySearch();

  return <SearchPagePresenter {...searchProps} />;
}
