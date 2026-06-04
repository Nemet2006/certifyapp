import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Logo } from '../../components/Logo';
import { getApiErrorMessage } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Email və şifrə daxil edin');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Logo />
          <Text style={styles.title}>Xoş gəldiniz</Text>
          <Text style={styles.sub}>Hesabınıza daxil olun</Text>
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="siz@example.com"
          />
          <Input
            label="Şifrə"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="••••••••"
          />
          <Button title="Daxil ol" onPress={handleLogin} loading={loading} />
          <Button
            title="Qeydiyyat"
            variant="ghost"
            onPress={() => navigation.navigate('Register')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink, marginTop: spacing.xl },
  sub: { fontSize: 15, color: colors.inkMuted, marginBottom: spacing.lg },
  errorBanner: {
    backgroundColor: '#fef2f2',
    color: colors.error,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    fontSize: 14,
  },
});
