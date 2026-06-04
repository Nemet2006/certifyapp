import { create } from 'zustand';
import { authApi, TokenResponse } from '../api/client';
import {
  clearTokens,
  getAccessToken,
  getStoredEmail,
  saveTokens,
} from '../auth/tokenStorage';

export { getAccessToken } from '../auth/tokenStorage';

interface AuthState {
  isReady: boolean;
  isAuthenticated: boolean;
  email: string | null;
  hydrate: () => Promise<void>;
  setSession: (tokens: TokenResponse, email?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isReady: false,
  isAuthenticated: false,
  email: null,

  hydrate: async () => {
    try {
      const access = await getAccessToken();
      const email = await getStoredEmail();
      set({
        isReady: true,
        isAuthenticated: !!access,
        email: email ?? null,
      });
    } catch {
      set({ isReady: true, isAuthenticated: false, email: null });
    }
  },

  setSession: async (tokens, email) => {
    await saveTokens(tokens.accessToken, tokens.refreshToken, email);
    set({ isAuthenticated: true, email: email ?? get().email });
  },

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    await get().setSession(data, email);
  },

  register: async (email, password, fullName) => {
    const { data } = await authApi.register(email, password, fullName);
    await get().setSession(data, email);
  },

  logout: async () => {
    await clearTokens();
    set({ isAuthenticated: false, email: null });
  },
}));
