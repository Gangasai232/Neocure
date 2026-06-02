import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      name: "",
      role: "",
      email: "",
      setUser: ({ name, role, email }) => set({ name, role, email }),
      clearUser: () => set({ name: "", role: "", email: "" }),
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);
