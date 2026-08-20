import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthState extends Partial<AuthSession> {
  setSession: (session: AuthSession) => void;
  updateTokens: (tokens: Pick<AuthSession, "accessToken" | "refreshToken">) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: undefined,
      name: undefined,
      email: undefined,
      role: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      setSession: (session) => set(session),
      updateTokens: (tokens) => set(tokens),
      clearSession: () =>
        set({
          userId: undefined,
          name: undefined,
          email: undefined,
          role: undefined,
          accessToken: undefined,
          refreshToken: undefined,
        }),
      isAuthenticated: () => Boolean(get().userId && get().accessToken),
    }),
    { name: "seam.auth" },
  ),
);
