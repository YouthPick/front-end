import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

import { useCompare } from '../hooks/useCompare';
import { CompareDetailDialog } from './CompareDetailDialog';
import { ComparePanelPresenter } from './ComparePanelPresenter';

export function ComparePanelContainer() {
  const { comparingPolicies, removeCompare, clearCompare } = useCompare();
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <>
      <ComparePanelPresenter
        comparingPolicies={comparingPolicies}
        onOpenDetail={() => setShowDetailDialog(true)}
        onRemove={removeCompare}
        onClear={clearCompare}
      />

      <AnimatePresence>
        {showDetailDialog && comparingPolicies.length >= 2 && (
          <CompareDetailDialog
            policies={comparingPolicies}
            onClose={() => setShowDetailDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
