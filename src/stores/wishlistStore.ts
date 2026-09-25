// TODO: replace with API-backed wishlist later — local, persisted for now
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductSnapshot } from '../types/product';

interface WishlistState {
  items: ProductSnapshot[];
  /** id of the most recently toggled item — drives the heart burst animation */
  pulseId: string | null;
  toggle: (product: ProductSnapshot) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      pulseId: null,

      toggle: (product) => {
        const exists = get().items.some((i) => i.id === product.id);
        set((s) => ({
          items: exists ? s.items.filter((i) => i.id !== product.id) : [product, ...s.items],
          pulseId: product.id,
        }));
        return !exists;
      },

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [], pulseId: null }),
    }),
    {
      name: 'vendora-wishlist',
      partialize: (s) => ({ items: s.items }) as WishlistState,
    }
  )
);

/** Non-reactive read, useful inside event handlers. */
export const isWishlisted = (id: string) =>
  useWishlistStore.getState().items.some((i) => i.id === id);

export const wishlistCount = (items: ProductSnapshot[]) => items.length;
