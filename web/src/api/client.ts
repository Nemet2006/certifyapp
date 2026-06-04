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

export interface EventResponse {
  id: string;
  businessId: string;
  title: string;
  description: string | null;
  endDate: string;
  attendeeCount: number;
  certificatesIssued: number;
}

export interface AttendeeResponse {
  participationId: string;
  userId: string;
  email: string;
  fullName: string | null;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  certificateIssued: boolean;
  verificationCode: string | null;
}

export type CertificateAuthStatus = 'ISSUED' | 'AUTHENTIC' | 'REVOKED';

export interface IssuedCertificateResponse {
  id: string;
  verificationCode: string;
  title: string;
  holderName: string;
  holderEmail: string;
  eventTitle: string | null;
  businessName: string | null;
  authStatus: CertificateAuthStatus;
  issuedAt: string;
  verifiedAt: string | null;
  revokedReason: string | null;
}

export interface CertificateVerifyResponse {
  verificationCode: string;
  authStatus: CertificateAuthStatus | null;
  found: boolean;
  title: string | null;
  holderName: string | null;
  holderEmail: string | null;
  businessName: string | null;
  eventTitle: string | null;
  issuedAt: string | null;
  message: string;
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
  setup: (email: string, organizationName: string) =>
    api.post<BusinessResponse>('/api/v1/businesses/setup', { email, organizationName }),
  byEmail: (email: string) => api.get<BusinessResponse>(`/api/v1/businesses/by-email/${encodeURIComponent(email)}`),
};

export const eventsApi = {
  list: (businessId: string) => api.get<EventResponse[]>(`/api/v1/businesses/${businessId}/events`),
  create: (businessId: string, data: { title: string; description?: string; endDate: string }) =>
    api.post<EventResponse>(`/api/v1/businesses/${businessId}/events`, data),
};

export const attendeesApi = {
  list: (eventId: string) => api.get<AttendeeResponse[]>(`/api/v1/events/${eventId}/attendees`),
  add: (eventId: string, data: { email: string; fullName?: string }) =>
    api.post<AttendeeResponse>(`/api/v1/events/${eventId}/attendees`, data),
  issueAll: (eventId: string, certificateTitle?: string) =>
    api.post<IssuedCertificateResponse[]>(`/api/v1/events/${eventId}/issue-certificates`, {
      issueToAllCompleted: true,
      certificateTitle,
    }),
  issueSelected: (eventId: string, participationIds: string[], certificateTitle?: string) =>
    api.post<IssuedCertificateResponse[]>(`/api/v1/events/${eventId}/issue-certificates`, {
      participationIds,
      certificateTitle,
    }),
};

export const issuedCertificatesApi = {
  list: (businessId: string) =>
    api.get<IssuedCertificateResponse[]>(`/api/v1/businesses/${businessId}/issued-certificates`),
  verify: (code: string) =>
    api.get<CertificateVerifyResponse>(`/api/v1/issued-certificates/verify/${encodeURIComponent(code.trim().toUpperCase())}`),
  authenticate: (businessId: string, certificateId: string) =>
    api.post<IssuedCertificateResponse>(
      `/api/v1/businesses/${businessId}/issued-certificates/${certificateId}/authenticate`
    ),
  revoke: (businessId: string, certificateId: string, reason?: string) =>
    api.post<IssuedCertificateResponse>(
      `/api/v1/businesses/${businessId}/issued-certificates/${certificateId}/revoke`,
      { reason }
    ),
};

export const healthApi = {
  gateway: () => api.get('/actuator/health'),
};

export default api;
