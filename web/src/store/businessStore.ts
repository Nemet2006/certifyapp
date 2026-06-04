import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BusinessResponse } from '../api/client';
import { businessesApi } from '../api/client';

interface BusinessState {
  business: BusinessResponse | null;
  loading: boolean;
  error: string | null;
  loadForEmail: (email: string, orgName?: string) => Promise<BusinessResponse | null>;
  clear: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      business: null,
      loading: false,
      error: null,

      loadForEmail: async (email, orgName) => {
        set({ loading: true, error: null });
        try {
          try {
            const { data } = await businessesApi.byEmail(email);
            set({ business: data, loading: false });
            return data;
          } catch {
            const name = orgName?.trim() || 'Təşkilatım';
            const { data } = await businessesApi.setup(email, name);
            set({ business: data, loading: false });
            return data;
          }
        } catch {
          set({ loading: false, error: 'Backend əlçatan deyil' });
          return null;
        }
      },

      clear: () => set({ business: null, error: null }),
    }),
    { name: 'certifyapp-business' }
  )
);
