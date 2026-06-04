import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { loadStoredApiUrl } from '../config/api';
import { useCertificateStore } from '../store/certificateStore';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';

SplashScreen.preventAutoHideAsync().catch(() => {});

const HYDRATE_TIMEOUT_MS = 8_000;

export function RootNavigator() {
  const isReady = useAuthStore((s) => s.isReady);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(() => {
      if (!cancelled && !useAuthStore.getState().isReady) {
        useAuthStore.setState({ isReady: true, isAuthenticated: false, email: null });
        setBootError('Başlanğıc yüklənməsi çox uzun çəkdi. Yenidən açın.');
      }
    }, HYDRATE_TIMEOUT_MS);

    loadStoredApiUrl()
      .then(() => Promise.all([hydrate(), useCertificateStore.getState().load()]))
      .catch(() => {
        if (!cancelled) {
          useAuthStore.setState({ isReady: true, isAuthenticated: false, email: null });
          setBootError('Konfiqurasiya yüklənmədi.');
        }
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [hydrate]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.seal} />
        <Text style={styles.loadingText}>Yüklənir…</Text>
      </View>
    );
  }

  if (bootError) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{bootError}</Text>
      </View>
    );
  }

  return isAuthenticated ? <MainStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.parchment,
    gap: spacing.md,
    padding: spacing.lg,
  },
  loadingText: { fontSize: 15, color: colors.inkMuted },
  errorText: { fontSize: 15, color: colors.error, textAlign: 'center' },
});
