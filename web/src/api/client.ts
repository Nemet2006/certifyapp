import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
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
    api.post<TokenResponse>('/api/v1/auth/login', { email, password }),
  register: (email: string, password: string, fullName?: string, role: 'USER' | 'BUSINESS' = 'BUSINESS') =>
    api.post<TokenResponse>('/api/v1/auth/register', {
      email,
      password,
      fullName,
      role,
    }),
};

export const usersApi = {
  list: () => api.get<UserResponse[]>('/api/v1/users'),
  create: (data: { email: string; fullName?: string; role: string }) =>
    api.post<UserResponse>('/api/v1/users', data),
};

export const businessesApi = {
  list: () => api.get<BusinessResponse[]>('/api/v1/businesses'),
};

export const healthApi = {
  gateway: () => api.get('/actuator/health'),
};

export default api;
