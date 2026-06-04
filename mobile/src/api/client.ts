import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getApiUrl, getAuthUrl } from '../config/api';
import { getAccessToken } from '../auth/tokenStorage';

const authHttp = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

const attachBaseAndToken = async (config: Parameters<Parameters<typeof api.interceptors.request.use>[0]>[0]) => {
  const isAuth = config.url?.startsWith('/api/v1/auth');
  config.baseURL = isAuth ? getAuthUrl() : getApiUrl();
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authHttp.interceptors.request.use(async (config) => {
  config.baseURL = getAuthUrl();
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string | null;
  role: 'USER' | 'BUSINESS' | 'ADMIN';
}

export interface BusinessResponse {
  id: string;
  userId: string;
  name: string;
  verified: boolean;
}

export const authApi = {
  login: (email: string, password: string) =>
    authHttp.post<TokenResponse>('/api/v1/auth/login', { email, password }),
  register: (email: string, password: string, fullName?: string) =>
    authHttp.post<TokenResponse>('/api/v1/auth/register', {
      email,
      password,
      fullName,
      role: 'USER',
    }),
};

export const usersApi = {
  list: () => api.get<UserResponse[]>('/api/v1/users'),
};

export const businessesApi = {
  list: () => api.get<BusinessResponse[]>('/api/v1/businesses'),
};

export const healthApi = {
  check: () => api.get('/actuator/health'),
};

export interface CertificateVerifyResponse {
  verificationCode: string;
  authStatus: 'ISSUED' | 'AUTHENTIC' | 'REVOKED' | null;
  found: boolean;
  title: string | null;
  holderName: string | null;
  businessName: string | null;
  eventTitle: string | null;
  message: string;
}

export const verifyApi = {
  byCode: (code: string) =>
    api.get<CertificateVerifyResponse>(
      `/api/v1/issued-certificates/verify/${encodeURIComponent(code.trim().toUpperCase())}`
    ),
};

export function getApiErrorMessage(err: unknown): string {
  const base = getApiUrl();
  if (axios.isAxiosError(err)) {
    if (!err.response && (err.code === 'ECONNABORTED' || err.message === 'Network Error')) {
      return `Serverə qoşula bilmədi (${base}).\n\n• Backend işləyir? (run-backend.sh)\n• Fiziki telefondasınızsa Profil və ya .env-də IP yazın\n• Eyni WiFi şəbəkəsində olun`;
    }
    const msg = err.response?.data?.message;
    if (typeof msg === 'string') return msg;
    if (err.response?.status === 401) return 'Email və ya şifrə səhvdir';
  }
  return 'Xəta baş verdi. Yenidən cəhd edin.';
}
