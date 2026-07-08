import { create } from 'zustand';

interface CompareStore {
  policyIds: string[];
  addPolicyId: (policyId: string) => void;
  removePolicyId: (policyId: string) => void;
  clearPolicyIds: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  policyIds: [],
  addPolicyId: (policyId) => set((state) => ({ policyIds: [...state.policyIds, policyId] })),
  removePolicyId: (policyId) =>
    set((state) => ({ policyIds: state.policyIds.filter((id) => id !== policyId) })),
  clearPolicyIds: () => set({ policyIds: [] }),
}));
