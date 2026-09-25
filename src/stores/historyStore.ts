// TODO: replace with API-backed history later — local, persisted for now
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductSnapshot } from '../types/product';

const MAX_VIEWED = 12;
const MAX_PURCHASED = 6;

interface HistoryState {
  /** Most recent first. Powers "Xem gần đây" and the recommendation rail. */
  viewed: ProductSnapshot[];
  /** Products from the last completed order — powers "Mua lại". */
  purchased: ProductSnapshot[];
  pushViewed: (product: ProductSnapshot) => void;
  pushPurchased: (products: ProductSnapshot[]) => void;
  clearViewed: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      viewed: [],
      purchased: [],

      pushViewed: (product) =>
        set((s) => {
          // De-dupe, and remember the newest visit first.
          const rest = s.viewed.filter((i) => i.id !== product.id);
          return { viewed: [product, ...rest].slice(0, MAX_VIEWED) };
        }),

      pushPurchased: (products) =>
        set((s) => {
          const merged = [...products, ...s.purchased];
          const seen = new Set<string>();
          const unique = merged.filter((p) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          });
          return { purchased: unique.slice(0, MAX_PURCHASED) };
        }),

      clearViewed: () => set({ viewed: [] }),
    }),
    {
      name: 'vendora-history',
      partialize: (s) => ({ viewed: s.viewed, purchased: s.purchased }) as HistoryState,
    }
  )
);
