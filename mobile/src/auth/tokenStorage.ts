import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'certifyapp_access';
const REFRESH_KEY = 'certifyapp_refresh';
const EMAIL_KEY = 'certifyapp_email';

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function getStoredEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(EMAIL_KEY);
}

export async function saveTokens(
  accessToken: string,
  refreshToken: string,
  email?: string
): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  if (email) await SecureStore.setItemAsync(EMAIL_KEY, email);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
  await SecureStore.deleteItemAsync(EMAIL_KEY);
}
