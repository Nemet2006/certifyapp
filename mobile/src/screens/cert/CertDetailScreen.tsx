import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Sharing from 'expo-sharing';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useCertificateStore } from '../../store/certificateStore';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'CertDetail'>;

export function CertDetailScreen({ navigation, route }: Props) {
  const cert = useCertificateStore((s) => s.getById(route.params.id));
  const remove = useCertificateStore((s) => s.remove);

  if (!cert) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Tapılmadı" onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Sertifikat silinib və ya mövcud deyil.</Text>
      </SafeAreaView>
    );
  }

  const share = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(cert.imageUri, { dialogTitle: cert.title });
    } else {
      Alert.alert('Paylaşım', 'Bu cihazda paylaşım dəstəklənmir');
    }
  };

  const confirmDelete = () => {
    Alert.alert('Sil', 'Bu sertifikatı arxivdən silmək istəyirsiniz?', [
      { text: 'Ləğv', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await remove(cert.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={cert.title}
        subtitle={cert.subtitle}
        onBack={() => navigation.goBack()}
        right={
          <Pressable onPress={confirmDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: cert.imageUri }} style={styles.image} resizeMode="contain" />
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Doğrulama kodu</Text>
          <Text style={styles.code}>{cert.verificationCode}</Text>
        </View>
        <View style={styles.actions}>
          <Button title="Çap et" onPress={() => navigation.navigate('Print', { id: cert.id })} />
          <Button title="QR ilə doğrula" variant="secondary" onPress={() => navigation.navigate('Verify')} />
          <Button title="Paylaş" variant="secondary" onPress={share} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.parchment },
  scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeBox: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeLabel: { fontSize: 12, fontFamily: fonts.bodySemiBold, color: colors.inkMuted, textTransform: 'uppercase', letterSpacing: 1 },
  code: { fontSize: 22, fontFamily: fonts.display, color: colors.seal, marginTop: spacing.sm },
  actions: { gap: spacing.md },
  missing: { padding: spacing.lg, fontFamily: fonts.body, color: colors.inkMuted },
});
