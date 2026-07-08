import { useState } from 'react';

import { useCompare } from '../hooks/useCompare';
import { ComparePanelPresenter } from './ComparePanelPresenter';

export function ComparePanelContainer() {
  const { comparingPolicies, removeCompare, clearCompare } = useCompare();
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <ComparePanelPresenter
      comparingPolicies={comparingPolicies}
      showDetailDialog={showDetailDialog}
      onOpenDetail={() => setShowDetailDialog(true)}
      onCloseDetail={() => setShowDetailDialog(false)}
      onRemove={removeCompare}
      onClear={clearCompare}
    />
  );
}
