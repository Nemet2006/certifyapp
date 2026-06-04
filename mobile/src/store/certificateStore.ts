import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { CertificateSource, UserCertificate } from '../types/certificate';

const STORAGE_KEY = 'certifyapp_user_certificates';

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function makeCode(): string {
  return `CERT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

interface CertificateState {
  items: UserCertificate[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (input: {
    title: string;
    subtitle?: string;
    imageUri: string;
    source: CertificateSource;
  }) => Promise<UserCertificate>;
  remove: (id: string) => Promise<void>;
  markPrinted: (id: string) => Promise<void>;
  getById: (id: string) => UserCertificate | undefined;
}

async function persist(items: UserCertificate[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const useCertificateStore = create<CertificateState>((set, get) => ({
  items: [],
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const items = raw ? (JSON.parse(raw) as UserCertificate[]) : [];
      set({ items, loaded: true });
    } catch {
      set({ items: [], loaded: true });
    }
  },

  add: async ({ title, subtitle, imageUri, source }) => {
    const cert: UserCertificate = {
      id: makeId(),
      title,
      subtitle,
      imageUri,
      createdAt: new Date().toISOString(),
      source,
      verificationCode: makeCode(),
    };
    const items = [cert, ...get().items];
    await persist(items);
    set({ items });
    return cert;
  },

  remove: async (id) => {
    const items = get().items.filter((c) => c.id !== id);
    await persist(items);
    set({ items });
  },

  markPrinted: async (id) => {
    const items = get().items.map((c) =>
      c.id === id ? { ...c, printedAt: new Date().toISOString() } : c
    );
    await persist(items);
    set({ items });
  },

  getById: (id) => get().items.find((c) => c.id === id),
}));
