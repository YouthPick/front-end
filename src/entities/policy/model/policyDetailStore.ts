import { create } from 'zustand';

interface PolicyDetailStore {
  selectedPolicyId: string | null;
  openPolicyDetail: (policyId: string) => void;
  closePolicyDetail: () => void;
}

export const usePolicyDetailStore = create<PolicyDetailStore>((set) => ({
  selectedPolicyId: null,
  openPolicyDetail: (policyId) => set({ selectedPolicyId: policyId }),
  closePolicyDetail: () => set({ selectedPolicyId: null }),
}));
