import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { UserCertificate } from '../../types/certificate';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import { fonts } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

interface Props {
  cert: UserCertificate;
  onPress: () => void;
  compact?: boolean;
}

export function CertificateCard({ cert, onPress, compact }: Props) {
  const date = new Date(cert.createdAt).toLocaleDateString('az-AZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Pressable onPress={onPress} style={[styles.card, shadows.sm, compact && styles.compact]}>
      <Image source={{ uri: cert.imageUri }} style={[styles.thumb, compact && styles.thumbCompact]} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {cert.title}
        </Text>
        {cert.subtitle ? (
          <Text style={styles.sub} numberOfLines={1}>
            {cert.subtitle}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Text style={styles.date}>{date}</Text>
          {cert.printedAt ? (
            <View style={styles.badge}>
              <Ionicons name="print" size={10} color={colors.success} />
              <Text style={styles.badgeText}>Çap edilib</Text>
            </View>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compact: { padding: spacing.sm },
  thumb: { width: 72, height: 88, borderRadius: radius.md, backgroundColor: colors.parchmentDark },
  thumbCompact: { width: 56, height: 68 },
  body: { flex: 1 },
  title: { fontSize: 16, fontFamily: fonts.bodySemiBold, color: colors.ink },
  sub: { fontSize: 13, fontFamily: fonts.body, color: colors.inkMuted, marginTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  date: { fontSize: 12, fontFamily: fonts.body, color: colors.inkMuted },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeText: { fontSize: 11, fontFamily: fonts.bodyMedium, color: colors.success },
});
