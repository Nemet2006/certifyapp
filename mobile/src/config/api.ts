import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const STORAGE_KEY = 'certifyapp_api_url';
const STORAGE_AUTH_KEY = 'certifyapp_auth_url';

function trimUrl(url: string): string {
  return url.replace(/\/$/, '');
}

function envAuthUrl(): string | undefined {
  const v = process.env.EXPO_PUBLIC_AUTH_URL?.trim();
  return v ? trimUrl(v) : undefined;
}

function envUserUrl(): string | undefined {
  const v = process.env.EXPO_PUBLIC_USER_URL?.trim() ?? process.env.EXPO_PUBLIC_API_URL?.trim();
  return v ? trimUrl(v) : undefined;
}

/** Default auth URL (login/register) */
export function getDefaultAuthUrl(): string {
  const env = envAuthUrl();
  if (env) return env;

  if (Device.isDevice) {
    const hint = Constants.expoConfig?.extra?.authUrlLan as string | undefined;
    if (hint) return trimUrl(hint);
    return 'https://certifyapp-auth.onrender.com';
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8087';
  }
  return 'http://localhost:8087';
}

/** Default user/business API URL */
export function getDefaultApiUrl(): string {
  const env = envUserUrl();
  if (env) return env;

  if (Device.isDevice) {
    const hint = Constants.expoConfig?.extra?.apiUrlLan as string | undefined;
    if (hint) return trimUrl(hint);
    return 'https://certifyapp-user.onrender.com';
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8082';
  }
  return 'http://localhost:8082';
}

let authUrl = getDefaultAuthUrl();
let apiUrl = getDefaultApiUrl();

export function getAuthUrl(): string {
  return authUrl;
}

export function getApiUrl(): string {
  return apiUrl;
}

export function setApiUrl(url: string): void {
  apiUrl = trimUrl(url);
}

export function setAuthUrl(url: string): void {
  authUrl = trimUrl(url);
}

export async function loadStoredApiUrl(): Promise<string> {
  const [storedUser, storedAuth] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEY),
    AsyncStorage.getItem(STORAGE_AUTH_KEY),
  ]);
  if (storedAuth?.trim()) setAuthUrl(storedAuth.trim());
  if (storedUser?.trim()) {
    setApiUrl(storedUser.trim());
    return apiUrl;
  }
  setApiUrl(getDefaultApiUrl());
  setAuthUrl(getDefaultAuthUrl());
  return apiUrl;
}

export async function saveApiUrl(url: string): Promise<void> {
  const normalized = trimUrl(url);
  await AsyncStorage.setItem(STORAGE_KEY, normalized);
  setApiUrl(normalized);
}

export async function saveAuthUrl(url: string): Promise<void> {
  const normalized = trimUrl(url);
  await AsyncStorage.setItem(STORAGE_AUTH_KEY, normalized);
  setAuthUrl(normalized);
}

export const API_URL = getApiUrl();
