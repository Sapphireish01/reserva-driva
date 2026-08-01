import { create } from "zustand";
import { clearStoredToken, setStoredToken } from "../api/client";

interface AuthState {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  login: async (token) => {
    await setStoredToken(token);
    set({ isAuthenticated: true });
  },
  logout: async () => {
    await clearStoredToken();
    set({ isAuthenticated: false });
  },
}));
