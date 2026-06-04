import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  light?: boolean;
  compact?: boolean;
}

export function Logo({ light, compact }: Props) {
  const fg = light ? colors.parchment : colors.ink;
  const sub = light ? 'rgba(244, 239, 230, 0.6)' : colors.inkMuted;
  return (
    <View style={[styles.row, compact && styles.compact]}>
      <View style={[styles.icon, light && styles.iconLight]}>
        <Ionicons name="shield-checkmark" size={compact ? 22 : 28} color={light ? colors.ink : colors.seal} />
      </View>
      {!compact && (
        <View>
          <Text style={[styles.title, { color: fg }]}>CertifyApp</Text>
          <Text style={[styles.sub, { color: sub }]}>Sertifikat platforması</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  compact: { gap: spacing.sm },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLight: { backgroundColor: colors.seal },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  sub: { fontSize: 10, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 },
});
