import { create } from 'zustand';
import type { IconName } from '../components/brand/Icon';

export type ToastTone = 'success' | 'info' | 'warn' | 'error';

export interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  message?: string;
  /** Overrides the tone's default icon. */
  icon?: IconName;
  /** Colour of the woven swatch thumbnail shown on the left. */
  swatch?: string;
  /** Letter printed on the swatch. */
  swatchLabel?: string;
  /** ms before auto-dismiss; 0 keeps it until dismissed. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

type ToastInput = Omit<Toast, 'id'>;

interface ToastState {
  toasts: Toast[];
  push: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const MAX_VISIBLE = 3;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  push: (toast) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = toast.duration ?? 4200;

    set((s) => ({ toasts: [...s.toasts, { ...toast, id }].slice(-MAX_VISIBLE) }));

    if (duration > 0) {
      window.setTimeout(() => get().dismiss(id), duration);
    }
    return id;
  },

  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

/** Imperative helper so stores/handlers can toast without a hook. */
export const toast = (input: ToastInput) => useToastStore.getState().push(input);
