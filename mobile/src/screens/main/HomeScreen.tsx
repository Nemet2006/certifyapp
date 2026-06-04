import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { businessesApi, healthApi, usersApi } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export function HomeScreen() {
  const email = useAuthStore((s) => s.email);

  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => healthApi.check().then((r) => r.data),
  });

  const users = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.list().then((r) => r.data),
  });

  const businesses = useQuery({
    queryKey: ['businesses'],
    queryFn: () => businessesApi.list().then((r) => r.data),
  });

  const refreshing = health.isFetching || users.isFetching;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            health.refetch();
            users.refetch();
            businesses.refetch();
          }} tintColor={colors.seal} />
        }
      >
        <Text style={styles.greeting}>Salam 👋</Text>
        <Text style={styles.email}>{email ?? 'İstifadəçi'}</Text>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Ionicons name="people" size={24} color={colors.seal} />
            <Text style={styles.statNum}>{users.data?.length ?? '—'}</Text>
            <Text style={styles.statLabel}>İstifadəçi</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="business" size={24} color={colors.inkMuted} />
            <Text style={styles.statNum}>{businesses.data?.length ?? '—'}</Text>
            <Text style={styles.statLabel}>Biznes</Text>
          </Card>
        </View>

        <Card>
          <View style={styles.statusRow}>
            <View style={[styles.dot, health.isSuccess && styles.dotOk]} />
            <Text style={styles.statusText}>
              API {health.isSuccess ? 'aktiv' : health.isError ? 'offline' : 'yoxlanır…'}
            </Text>
          </View>
          <Text style={styles.hint}>
            Sertifikatlarınız burada görünəcək. Backend hazır olduqda PDF və QR doğrulama əlavə olunacaq.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  scroll: { padding: spacing.lg },
  greeting: { fontSize: 14, color: colors.inkMuted, fontWeight: '600' },
  email: { fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: 'flex-start' },
  statNum: { fontSize: 32, fontWeight: '700', color: colors.ink, marginTop: spacing.sm },
  statLabel: { fontSize: 13, color: colors.inkMuted },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.parchmentDark },
  dotOk: { backgroundColor: colors.success },
  statusText: { fontSize: 16, fontWeight: '600', color: colors.ink },
  hint: { fontSize: 14, color: colors.inkMuted, lineHeight: 22 },
});
