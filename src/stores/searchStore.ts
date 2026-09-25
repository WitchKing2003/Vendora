import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_RECENT = 6;

interface SearchState {
  recent: string[];
  push: (term: string) => void;
  remove: (term: string) => void;
  clear: () => void;
}

/**
 * Recent searches are personalisation the shopper fully controls: they are
 * only ever shown back to them, and can be cleared in one click. No hidden
 * profile, no guessing.
 */
export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recent: [],

      push: (term) => {
        const value = term.trim();
        if (value.length < 2) return;
        set((s) => ({
          recent: [value, ...s.recent.filter((r) => r.toLowerCase() !== value.toLowerCase())].slice(
            0,
            MAX_RECENT
          ),
        }));
      },

      remove: (term) => set((s) => ({ recent: s.recent.filter((r) => r !== term) })),
      clear: () => set({ recent: [] }),
    }),
    { name: 'vendora-search', partialize: (s) => ({ recent: s.recent }) as SearchState }
  )
);
