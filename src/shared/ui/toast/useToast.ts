import { useToastStore } from './toastStore';

export function useToast() {
  const showToast = useToastStore((state) => state.showToast);
  return { showToast };
}
