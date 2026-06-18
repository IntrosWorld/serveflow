import { create } from "zustand";
import type { Role } from "@restaurant/shared";
type Session = { role?: Role; token?: string; name?: string; login: (session: { role: Role; token: string; name: string }) => void; clearRole: () => void };
export const useSession = create<Session>((set) => ({
  login: (session) => set(session),
  clearRole: () => set({ role: undefined, token: undefined, name: undefined }),
}));
