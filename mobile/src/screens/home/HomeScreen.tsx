import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CertificateCard } from '../../components/cert/CertificateCard';
import { Logo } from '../../components/Logo';
import { useAuthStore } from '../../store/authStore';
import { useCertificateStore } from '../../store/certificateStore';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import { spacing, radius } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { MainStackParamList, MainTabParamList } from '../../navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<MainStackParamList>
>;

const actions = [
  { icon: 'scan' as const, label: 'Skan et', tab: 'Scan' },
  { icon: 'images' as const, label: 'Qalereya', tab: 'Scan' },
  { icon: 'qr-code' as const, label: 'Doğrula', route: 'Verify' as const },
  { icon: 'print' as const, label: 'Çap et', route: 'Print' as const },
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const email = useAuthStore((s) => s.email);
  const items = useCertificateStore((s) => s.items);
  const load = useCertificateStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  const recent = items.slice(0, 3);
  const name = email?.split('@')[0] ?? 'İstifadəçi';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Logo compact />
          <Text style={styles.greet}>Salam, {name}</Text>
        </View>

        <Pressable
          style={[styles.hero, shadows.md]}
          onPress={() => navigation.navigate('Scan')}
        >
          <View style={styles.heroIcon}>
            <Ionicons name="document-text" size={32} color={colors.seal} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Sertifikat əlavə et</Text>
            <Text style={styles.heroSub}>Kamera ilə skan edin və ya qalereyadan yükləyin</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={36} color={colors.seal} />
        </Pressable>

        <Text style={styles.section}>Tez keçidlər</Text>
        <View style={styles.grid}>
          {actions.map((a) => (
            <Pressable
              key={a.label}
              style={[styles.action, shadows.sm]}
              onPress={() => {
                if (a.label === 'Doğrula') navigation.navigate('Verify');
                else if (a.label === 'Çap et') navigation.navigate('Print', {});
                else navigation.navigate('Scan');
              }}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={a.icon} size={22} color={colors.seal} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.section}>Son sertifikatlar</Text>
          {items.length > 0 ? (
            <Pressable onPress={() => navigation.navigate('Library')}>
              <Text style={styles.link}>Hamısı</Text>
            </Pressable>
          ) : null}
        </View>

        {recent.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={40} color={colors.inkMuted} />
            <Text style={styles.emptyText}>Hələ sertifikat yoxdur. Skan ilə başlayın.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {recent.map((c) => (
              <CertificateCard key={c.id} cert={c} onPress={() => navigation.navigate('CertDetail', { id: c.id })} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  top: { marginBottom: spacing.lg },
  greet: { fontSize: 28, fontFamily: fonts.display, color: colors.ink, marginTop: spacing.md },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(201,162,39,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontSize: 18, fontFamily: fonts.bodyBold, color: colors.parchment },
  heroSub: { fontSize: 13, fontFamily: fonts.body, color: 'rgba(244,239,230,0.7)', marginTop: 4, maxWidth: 200 },
  heroText: { flex: 1 },
  section: { fontSize: 13, fontFamily: fonts.bodySemiBold, color: colors.inkMuted, textTransform: 'uppercase', letterSpacing: 1.2 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, marginTop: spacing.sm },
  link: { fontSize: 14, fontFamily: fonts.bodySemiBold, color: colors.seal },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md, marginBottom: spacing.xl },
  action: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: { fontSize: 15, fontFamily: fonts.bodySemiBold, color: colors.ink },
  list: { gap: spacing.md },
  empty: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  emptyText: { fontSize: 14, fontFamily: fonts.body, color: colors.inkMuted, textAlign: 'center' },
});
