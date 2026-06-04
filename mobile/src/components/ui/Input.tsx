import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="rgba(28, 53, 84, 0.4)"
        style={[styles.input, error && styles.inputError, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink,
  },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 12, marginTop: spacing.xs },
});
