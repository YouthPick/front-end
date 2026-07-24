import { useSearchParams } from 'react-router';

// 선택된 트래커를 `/tracker?selected={policyId}` URL 상태로 관리한다.
export function useTrackerSelection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPolicyId = searchParams.get('selected');

  const selectTracker = (policyId: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('selected', policyId);
        return next;
      },
      { replace: true },
    );
  };

  const clearSelection = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('selected');
        return next;
      },
      { replace: true },
    );
  };

  return { selectedPolicyId, selectTracker, clearSelection };
}
