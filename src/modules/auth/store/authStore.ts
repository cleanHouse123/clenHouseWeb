import { User } from "@/core/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string;
  refreshToken: string;
  sessionExpired: boolean;
  setSessionExpired: (status: boolean) => void;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: "",
      refreshToken: "",
      sessionExpired: false,
      setSessionExpired: (status) => set({ sessionExpired: status }),
      setUser: (user) => set({ user, sessionExpired: false }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      clearUser: () =>
        set({
          user: null,
          sessionExpired: true,
          accessToken: "",
          refreshToken: "",
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
