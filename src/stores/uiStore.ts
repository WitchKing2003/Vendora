import { create } from 'zustand';

interface UiState {
  /** Cart drawer (the "smooth cart drawer animation" touchpoint). */
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  /** Quick view modal — peek at a product without leaving the grid. */
  quickViewId: string | null;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;

  /** Mobile slide-in menu. */
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;

  /**
   * Increments every time something lands in the cart. The header cart icon
   * watches this and plays its "bump" reaction — one signal, one reaction,
   * so the feedback can never be missed or duplicated.
   */
  cartBumpToken: number;
  bumpCart: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true, quickViewId: null }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen, quickViewId: null })),

  quickViewId: null,
  openQuickView: (id) => set({ quickViewId: id, cartOpen: false }),
  closeQuickView: () => set({ quickViewId: null }),

  menuOpen: false,
  setMenuOpen: (open) => set({ menuOpen: open }),

  cartBumpToken: 0,
  bumpCart: () => set((s) => ({ cartBumpToken: s.cartBumpToken + 1 })),
}));
