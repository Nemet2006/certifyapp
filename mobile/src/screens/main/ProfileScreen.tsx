import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../store/authStore';
import { getApiUrl } from '../../config/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export function ProfileScreen() {
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert('Çıxış', 'Hesabdan çıxmaq istəyirsiniz?', [
      { text: 'Ləğv', style: 'cancel' },
      {
        text: 'Çıxış',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Profil</Text>
        <Card>
          <View style={styles.row}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color={colors.seal} />
            </View>
            <View style={styles.info}>
              <Text style={styles.email}>{email ?? '—'}</Text>
              <Text style={styles.role}>İstifadəçi</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.meta}>
          <Text style={styles.metaLabel}>Backend API</Text>
          <Text style={styles.metaValue}>{getApiUrl()}</Text>
        </Card>
        <Button title="Çıxış" variant="secondary" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  content: { padding: spacing.lg, flex: 1 },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.parchment,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  email: { fontSize: 17, fontWeight: '600', color: colors.ink },
  role: { fontSize: 13, color: colors.inkMuted, marginTop: 2 },
  meta: { marginTop: spacing.md, marginBottom: spacing.lg },
  metaLabel: { fontSize: 12, color: colors.inkMuted, textTransform: 'uppercase', letterSpacing: 1 },
  metaValue: { fontSize: 13, color: colors.ink, marginTop: spacing.xs, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
