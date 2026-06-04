import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImageManipulator from 'expo-image-manipulator';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useCertificateStore } from '../../store/certificateStore';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'ScanPreview'>;

export function ScanPreviewScreen({ navigation, route }: Props) {
  const { uri, source } = route.params;
  const add = useCertificateStore((s) => s.add);
  const [previewUri, setPreviewUri] = useState(uri);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  const enhance = async () => {
    setEnhancing(true);
    try {
      const result = await ImageManipulator.manipulateAsync(
        previewUri,
        [{ resize: { width: 1200 } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
      );
      setPreviewUri(result.uri);
    } finally {
      setEnhancing(false);
    }
  };

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Başlıq', 'Sertifikat üçün ad daxil edin');
      return;
    }
    setSaving(true);
    try {
      const cert = await add({
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        imageUri: previewUri,
        source: source === 'gallery' ? 'gallery' : 'scan',
      });
      navigation.replace('CertDetail', { id: cert.id });
    } catch {
      Alert.alert('Xəta', 'Saxlanmadı');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Önizləmə" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: previewUri }} style={styles.image} resizeMode="contain" />
        <PressableEnhance onPress={enhance} loading={enhancing} />
        <Input label="Sertifikat adı" value={title} onChangeText={setTitle} placeholder="məs: Python kursu" />
        <Input label="Tədbir / təşkilat (ixtiyari)" value={subtitle} onChangeText={setSubtitle} placeholder="məs: Tech Academy" />
        <Button title="Arxivə əlavə et" onPress={save} loading={saving} />
        <Button title="Ləğv et" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PressableEnhance({ onPress, loading }: { onPress: () => void; loading: boolean }) {
  return (
    <View style={styles.enhanceRow}>
      <Text style={styles.enhanceHint}>CamScanner tipli təmizləmə — ölçü optimallaşdırılır</Text>
      <Button title={loading ? 'Emal…' : 'Şəkli təkmilləşdir'} variant="secondary" onPress={onPress} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  image: {
    width: '100%',
    height: 360,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  enhanceRow: { gap: spacing.sm },
  enhanceHint: { fontSize: 12, fontFamily: fonts.body, color: colors.inkMuted },
});
