import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outlineLight' | 'light';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
}: Props) {
  const isPrimary = variant === 'primary' || variant === 'light';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'outlineLight' && styles.outlineLight,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'light' ? colors.ink : isPrimary ? colors.parchment : colors.ink} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'primary' && styles.textPrimary,
            variant === 'light' && styles.textLight,
            variant === 'secondary' && styles.textSecondary,
            variant === 'ghost' && styles.textGhost,
            variant === 'outlineLight' && styles.textGhostLight,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.ink,
  },
  light: {
    backgroundColor: colors.parchment,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  outlineLight: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: '600' },
  textPrimary: { color: colors.parchment },
  textLight: { color: colors.ink },
  textSecondary: { color: colors.ink },
  textGhost: { color: colors.inkMuted },
  textGhostLight: { color: colors.parchment },
});
