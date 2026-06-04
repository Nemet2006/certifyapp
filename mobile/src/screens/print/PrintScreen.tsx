import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Print from 'expo-print';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useCertificateStore } from '../../store/certificateStore';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Print'>;

export function PrintScreen({ navigation, route }: Props) {
  const items = useCertificateStore((s) => s.items);
  const markPrinted = useCertificateStore((s) => s.markPrinted);
  const load = useCertificateStore((s) => s.load);
  const [selectedId, setSelectedId] = useState(route.params?.id ?? items[0]?.id);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const cert = items.find((c) => c.id === selectedId) ?? items[0];

  const printDoc = async () => {
    if (!cert) {
      Alert.alert('Seçim', 'Çap üçün sertifikat əlavə edin');
      return;
    }
    setPrinting(true);
    try {
      const html = `
        <html><head><meta charset="utf-8"/>
        <style>
          body { font-family: Georgia, serif; padding: 24px; color: #0a1628; }
          h1 { color: #c9a227; font-size: 22px; }
          img { max-width: 100%; border: 1px solid #e8dfd0; border-radius: 8px; }
          .code { margin-top: 16px; font-size: 14px; color: #1c3554; }
        </style></head><body>
          <h1>${cert.title}</h1>
          ${cert.subtitle ? `<p>${cert.subtitle}</p>` : ''}
          <img src="${cert.imageUri}" />
          <p class="code">Doğrulama: ${cert.verificationCode}</p>
          <p style="font-size:11px;color:#888">CertifyApp — ${new Date(cert.createdAt).toLocaleDateString('az-AZ')}</p>
        </body></html>`;
      await Print.printAsync({ html });
      await markPrinted(cert.id);
      Alert.alert('Uğurlu', 'Çap dialoqu açıldı');
    } catch {
      Alert.alert('Xəta', 'Çap mümkün olmadı');
    } finally {
      setPrinting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Çap et" subtitle="PDF / printer" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {!cert ? (
          <Text style={styles.empty}>Arxivdə sertifikat yoxdur</Text>
        ) : (
          <>
            <Text style={styles.label}>Önizləmə</Text>
            <Image source={{ uri: cert.imageUri }} style={styles.preview} resizeMode="contain" />
            {items.length > 1 ? (
              <View style={styles.picker}>
                {items.map((c) => (
                  <Button
                    key={c.id}
                    title={c.title.length > 20 ? `${c.title.slice(0, 18)}…` : c.title}
                    variant={selectedId === c.id ? 'primary' : 'secondary'}
                    onPress={() => setSelectedId(c.id)}
                    style={styles.pickBtn}
                  />
                ))}
              </View>
            ) : null}
            <Text style={styles.note}>
              Sistem çap dialoqu açılacaq. Print-shop inteqrasiyası backend hazır olanda aktiv olacaq.
            </Text>
            <Button title="Çap et" onPress={printDoc} loading={printing} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  label: { fontSize: 13, fontFamily: fonts.bodySemiBold, color: colors.inkMuted },
  preview: {
    height: 280,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  picker: { gap: spacing.sm },
  pickBtn: { minHeight: 44 },
  note: { fontSize: 13, fontFamily: fonts.body, color: colors.inkMuted, lineHeight: 20 },
  empty: { fontFamily: fonts.body, color: colors.inkMuted, padding: spacing.lg },
});
