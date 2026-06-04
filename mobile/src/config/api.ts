import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const STORAGE_KEY = 'certifyapp_api_url';

/** Default URL when nothing is configured */
export function getDefaultApiUrl(): string {
  const env = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (env) return env.replace(/\/$/, '');

  // Fiziki telefon — localhost və 10.0.2.2 işləmir
  if (Device.isDevice) {
    const hint = Constants.expoConfig?.extra?.apiUrlLan as string | undefined;
    if (hint) return hint.replace(/\/$/, '');
    return 'http://192.168.1.101:8090';
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8090';
  }
  return 'http://localhost:8090';
}

let apiUrl = getDefaultApiUrl();

export function getApiUrl(): string {
  return apiUrl;
}

export function setApiUrl(url: string): void {
  apiUrl = url.replace(/\/$/, '');
}

export async function loadStoredApiUrl(): Promise<string> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored?.trim()) {
    setApiUrl(stored.trim());
    return apiUrl;
  }
  setApiUrl(getDefaultApiUrl());
  return apiUrl;
}

export async function saveApiUrl(url: string): Promise<void> {
  const normalized = url.replace(/\/$/, '');
  await AsyncStorage.setItem(STORAGE_KEY, normalized);
  setApiUrl(normalized);
}

export const API_URL = getApiUrl();
