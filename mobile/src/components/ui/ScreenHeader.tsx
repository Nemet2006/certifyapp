import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  dark?: boolean;
}

export function ScreenHeader({ title, subtitle, onBack, right, dark }: Props) {
  const insets = useSafeAreaInsets();
  const fg = dark ? colors.parchment : colors.ink;
  const sub = dark ? 'rgba(244,239,230,0.65)' : colors.inkMuted;

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
            <Ionicons name="chevron-back" size={24} color={fg} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.titles}>
          <Text style={[styles.title, { color: fg, fontFamily: fonts.display }]}>{title}</Text>
          {subtitle ? <Text style={[styles.sub, { color: sub }]}>{subtitle}</Text> : null}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backPlaceholder: { width: 40 },
  titles: { flex: 1 },
  title: { fontSize: 26, letterSpacing: -0.3 },
  sub: { fontSize: 14, marginTop: 2, fontFamily: fonts.body },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
