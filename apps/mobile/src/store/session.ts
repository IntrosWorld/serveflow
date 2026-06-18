import { create } from "zustand";
import type { Role } from "@restaurant/shared";
type Session = { role?: Role; setRole: (role: Role) => void; clearRole: () => void };
export const useSession = create<Session>((set) => ({
  setRole: (role) => set({ role }),
  clearRole: () => set({ role: undefined }),
}));
