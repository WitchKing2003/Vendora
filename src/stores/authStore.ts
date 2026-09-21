// TODO: replace with real API auth later — client-side mock via zustand
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: (email, name) =>
        set({
          user: {
            email,
            name: name?.trim() || email.split("@")[0].replace(/[._-]/g, " "),
          },
        }),

      signup: (name, email) => set({ user: { name: name.trim(), email } }),

      logout: () => set({ user: null }),
    }),
    { name: "vendora-auth" }
  )
);
