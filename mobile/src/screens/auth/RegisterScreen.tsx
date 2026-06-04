import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const register = useAuthStore((s) => s.register);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!email.trim() || password.length < 6) {
      setError('Email və ən azı 6 simvollu şifrə lazımdır');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password, fullName.trim() || undefined);
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
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Logo />
          <Text style={styles.title}>Hesab yaradın</Text>
          <Text style={styles.sub}>Bir neçə addımla başlayın</Text>
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
          <Input label="Ad, soyad" value={fullName} onChangeText={setFullName} placeholder="Ad Soyad" />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input label="Şifrə" value={password} onChangeText={setPassword} secureTextEntry />
          <Button title="Qeydiyyatdan keç" onPress={handleRegister} loading={loading} />
          <Button title="Daxil ol" variant="ghost" onPress={() => navigation.goBack()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
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
