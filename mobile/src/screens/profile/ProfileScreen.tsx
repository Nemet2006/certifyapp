import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiUrlBar } from '../../components/ApiUrlBar';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { getApiUrl } from '../../config/api';
import { useAuthStore } from '../../store/authStore';
import { useCertificateStore } from '../../store/certificateStore';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { MainStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);
  const count = useCertificateStore((s) => s.items.length);
  const [showDev, setShowDev] = useState(false);

  const handleLogout = () => {
    Alert.alert('Çıxış', 'Hesabdan çıxmaq istəyirsiniz?', [
      { text: 'Ləğv', style: 'cancel' },
      { text: 'Çıx', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Profil" subtitle="Şəxsi hesab" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color={colors.seal} />
        </View>
        <Text style={styles.email}>{email ?? '—'}</Text>
        <Text style={styles.role}>İstifadəçi · {count} sertifikat</Text>

        <View style={styles.menu}>
          <MenuRow icon="print-outline" label="Çap et" onPress={() => navigation.navigate('Print', {})} />
          <MenuRow icon="qr-code-outline" label="Doğrula" onPress={() => navigation.navigate('Verify')} />
          <MenuRow icon="shield-checkmark-outline" label="Məxfilik" onPress={() => Alert.alert('Tezliklə', 'Məxfilik parametrləri')} />
        </View>

        <Pressable onPress={() => setShowDev((v) => !v)} style={styles.devToggle}>
          <Text style={styles.devToggleText}>{showDev ? '▾ Developer' : '▸ Developer'}</Text>
        </Pressable>
        {showDev ? (
          <View style={styles.devBox}>
            <Text style={styles.devLabel}>API: {getApiUrl()}</Text>
            <ApiUrlBar />
          </View>
        ) : null}

        <Button title="Çıxış" variant="secondary" onPress={handleLogout} style={styles.logout} />
        <Text style={styles.footer}>CertifyApp — yalnız istifadəçi tətbiqi{'\n'}Biznes paneli: web.certifyapp.az</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.ink} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.seal,
  },
  email: { fontSize: 20, fontFamily: fonts.display, color: colors.ink, textAlign: 'center', marginTop: spacing.md },
  role: { fontSize: 14, fontFamily: fonts.body, color: colors.inkMuted, textAlign: 'center', marginTop: 4 },
  menu: {
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: { flex: 1, fontSize: 16, fontFamily: fonts.bodyMedium, color: colors.ink },
  devToggle: { marginTop: spacing.lg },
  devToggleText: { fontSize: 13, fontFamily: fonts.bodySemiBold, color: colors.inkMuted },
  devBox: { marginTop: spacing.sm, gap: spacing.sm },
  devLabel: { fontSize: 11, fontFamily: fonts.body, color: colors.inkMuted },
  logout: { marginTop: spacing.xl },
  footer: { marginTop: spacing.xl, fontSize: 12, fontFamily: fonts.body, color: colors.inkMuted, textAlign: 'center', lineHeight: 18 },
});
