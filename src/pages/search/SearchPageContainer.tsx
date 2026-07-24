import { usePolicySearch } from '@/features/policy-search';
import { SearchPagePresenter } from './SearchPagePresenter';

export function SearchPageContainer() {
  const searchProps = usePolicySearch();

  return <SearchPagePresenter {...searchProps} />;
}
