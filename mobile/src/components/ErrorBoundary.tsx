import { Component, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.box}>
          <Text style={styles.title}>Tətbiq xətası</Text>
          <Text style={styles.msg}>{this.state.error.message}</Text>
          <Text style={styles.hint}>
            Terminalda `npm run start:phone` işlədin. Expo Go SDK 54 olmalıdır.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.parchment,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.error, marginBottom: spacing.md },
  msg: { fontSize: 14, color: colors.ink, marginBottom: spacing.md },
  hint: { fontSize: 13, color: colors.inkMuted, lineHeight: 20 },
});
