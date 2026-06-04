import { CameraView, useCameraPermissions } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verifyApi } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Verify'>;

export function VerifyScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkCode = async (raw: string) => {
    const code = raw.trim().toUpperCase();
    if (!code) return;
    setLoading(true);
    try {
      const { data } = await verifyApi.byCode(code);
      if (!data.found) {
        setResult({ ok: false, message: data.message });
      } else if (data.authStatus === 'AUTHENTIC') {
        setResult({ ok: true, message: `✓ ${data.businessName}: ${data.message}` });
      } else if (data.authStatus === 'REVOKED') {
        setResult({ ok: false, message: `✗ Saxta: ${data.message}` });
      } else {
        setResult({
          ok: true,
          message: `${data.businessName} verib, amma hələ rəsmi təsdiq yoxdur. ${data.eventTitle ?? ''}`,
        });
      }
    } catch {
      setResult({
        ok: false,
        message: 'Serverə qoşula bilmədi — yalnız öz skan etdiyiniz kodlar offline işləyir',
      });
    } finally {
      setLoading(false);
    }
  };

  const onBarcode = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    checkCode(data);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Doğrula" subtitle="Təşkilatın verdiyi sertifikat?" onBack={() => navigation.goBack()} />
      {!permission?.granted ? (
        <View style={styles.center}>
          <Text style={styles.text}>Kamera və ya kodu əl ilə daxil edin</Text>
          <Button title="Kamera icazəsi" onPress={requestPermission} />
        </View>
      ) : (
        <View style={styles.cameraWrap}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : onBarcode}
          />
        </View>
      )}

      <View style={styles.manual}>
        <TextInput
          style={styles.input}
          placeholder="CERT-XXXXXXXX"
          placeholderTextColor={colors.inkMuted}
          value={manualCode}
          onChangeText={setManualCode}
          autoCapitalize="characters"
        />
        <Button title={loading ? '…' : 'Kodu yoxla'} onPress={() => checkCode(manualCode)} loading={loading} />
      </View>

      {result ? (
        <View style={[styles.result, result.ok ? styles.ok : styles.fail]}>
          <Text style={styles.resultText}>{result.message}</Text>
          <Button
            title="Yenidən"
            variant="secondary"
            onPress={() => {
              setScanned(false);
              setResult(null);
              setManualCode('');
            }}
          />
        </View>
      ) : (
        <Text style={styles.hint}>
          Tələbə təşkilatı web paneldən «Bəli, biz verdik» desə, burada yaşıl təsdiq görünər
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  center: { flex: 1, padding: spacing.lg, justifyContent: 'center', gap: spacing.md },
  text: { fontFamily: fonts.body, color: colors.inkMuted, textAlign: 'center' },
  cameraWrap: { height: 220, margin: spacing.lg, borderRadius: radius.xl, overflow: 'hidden' },
  camera: { flex: 1 },
  manual: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  hint: { padding: spacing.lg, fontSize: 13, fontFamily: fonts.body, color: colors.inkMuted, textAlign: 'center' },
  result: { margin: spacing.lg, padding: spacing.lg, borderRadius: radius.lg, gap: spacing.md },
  ok: { backgroundColor: 'rgba(5,150,105,0.12)' },
  fail: { backgroundColor: 'rgba(220,38,38,0.1)' },
  resultText: { fontSize: 15, fontFamily: fonts.bodySemiBold, color: colors.ink, lineHeight: 22 },
});
