import { CameraView, useCameraPermissions } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useCertificateStore } from '../../store/certificateStore';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Verify'>;

export function VerifyScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const items = useCertificateStore((s) => s.items);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [scanned, setScanned] = useState(false);

  const onBarcode = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    const match = items.find(
      (c) => data.includes(c.verificationCode) || c.verificationCode === data
    );
    if (match) {
      setResult({
        ok: true,
        message: `Etibarlı — «${match.title}» (${match.verificationCode})`,
      });
    } else if (data.startsWith('CERT-')) {
      setResult({ ok: false, message: 'Kod tanınmadı — arxivinizdə yoxdur' });
    } else {
      setResult({ ok: false, message: 'Naməlum QR məzmunu' });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Doğrula" subtitle="QR kodu skan edin" onBack={() => navigation.goBack()} />
      {!permission?.granted ? (
        <View style={styles.center}>
          <Text style={styles.text}>Kamera icazəsi lazımdır</Text>
          <Button title="İcazə ver" onPress={requestPermission} />
        </View>
      ) : (
        <View style={styles.cameraWrap}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : onBarcode}
          />
          <View style={styles.frame} pointerEvents="none" />
        </View>
      )}
      {result ? (
        <View style={[styles.result, result.ok ? styles.ok : styles.fail]}>
          <Text style={styles.resultText}>{result.message}</Text>
          <Button
            title="Yenidən skan"
            variant="secondary"
            onPress={() => {
              setScanned(false);
              setResult(null);
            }}
          />
        </View>
      ) : (
        <Text style={styles.hint}>Sertifikat detallarındakı doğrulama kodunu QR kimi çap edə bilərsiniz</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  center: { flex: 1, padding: spacing.lg, justifyContent: 'center', gap: spacing.md },
  text: { fontFamily: fonts.body, color: colors.inkMuted, textAlign: 'center' },
  cameraWrap: { flex: 1, margin: spacing.lg, borderRadius: radius.xl, overflow: 'hidden' },
  camera: { flex: 1 },
  frame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: colors.seal,
    margin: 40,
    borderRadius: radius.lg,
  },
  hint: { padding: spacing.lg, fontSize: 13, fontFamily: fonts.body, color: colors.inkMuted, textAlign: 'center' },
  result: { margin: spacing.lg, padding: spacing.lg, borderRadius: radius.lg, gap: spacing.md },
  ok: { backgroundColor: 'rgba(5,150,105,0.12)' },
  fail: { backgroundColor: 'rgba(220,38,38,0.1)' },
  resultText: { fontSize: 15, fontFamily: fonts.bodySemiBold, color: colors.ink },
});
