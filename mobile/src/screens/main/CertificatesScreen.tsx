import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export function CertificatesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Sertifikatlarım</Text>
        <Card style={styles.empty}>
          <View style={styles.iconWrap}>
            <Ionicons name="document-text-outline" size={40} color={colors.seal} />
          </View>
          <Text style={styles.emptyTitle}>Hələ sertifikat yoxdur</Text>
          <Text style={styles.emptyBody}>
            Tədbirə qatıldıqdan sonra rəsmi sertifikatınız burada görünəcək. PDF və QR kod ilə doğrulama tezliklə.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  content: { padding: spacing.lg, flex: 1 },
  title: { fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: spacing.lg },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.ink },
  emptyBody: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
