import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { healthApi } from '../api/client';
import { getApiUrl, loadStoredApiUrl, saveApiUrl } from '../config/api';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

export function ApiUrlBar() {
  const [url, setUrl] = useState(getApiUrl());
  const [status, setStatus] = useState<'idle' | 'ok' | 'fail' | 'checking'>('idle');

  useEffect(() => {
    loadStoredApiUrl().then(setUrl);
  }, []);

  const testConnection = async () => {
    await saveApiUrl(url);
    setStatus('checking');
    try {
      await healthApi.check();
      setStatus('ok');
    } catch {
      setStatus('fail');
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Server ünvanı (API Gateway)</Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="http://192.168.1.101:8090"
        placeholderTextColor="rgba(28, 53, 84, 0.4)"
      />
      <Pressable style={styles.btn} onPress={testConnection}>
        <Text style={styles.btnText}>
          {status === 'checking' ? 'Yoxlanır…' : 'Bağlantını yoxla'}
        </Text>
      </Pressable>
      {status === 'ok' && <Text style={styles.ok}>✓ Server əlçatandır</Text>}
      {status === 'fail' && (
        <Text style={styles.fail}>
          ✗ Qoşulmadı. IP-ni yoxlayın: terminalda `hostname -I`
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  label: { fontSize: 12, color: 'rgba(244, 239, 230, 0.7)', marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
  },
  btn: {
    marginTop: spacing.sm,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.seal,
    borderRadius: radius.sm,
  },
  btnText: { color: colors.ink, fontWeight: '600', fontSize: 14 },
  ok: { color: '#86efac', fontSize: 12, marginTop: spacing.sm },
  fail: { color: '#fca5a5', fontSize: 12, marginTop: spacing.sm, lineHeight: 18 },
});
