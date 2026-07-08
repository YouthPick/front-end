import { create } from "zustand";

import { generateId } from "@/shared/utils";

export type ToastType = "success" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

const TOAST_DURATION_MS = 3000;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, type = "success") => {
    const id = generateId();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, TOAST_DURATION_MS);
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
