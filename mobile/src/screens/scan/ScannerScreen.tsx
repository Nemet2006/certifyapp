import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { MainStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function ScannerScreen() {
  const navigation = useNavigation<Nav>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [flash, setFlash] = useState(false);

  const openPreview = (uri: string, source: 'scan' | 'gallery') => {
    navigation.navigate('ScanPreview', { uri, source });
  };

  const capture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.85 });
      if (photo?.uri) openPreview(photo.uri, 'scan');
    } catch {
      Alert.alert('Xəta', 'Şəkil çəkilmədi');
    }
  };

  const pickGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!result.canceled && result.assets[0]?.uri) {
      openPreview(result.assets[0].uri, 'gallery');
    }
  };

  if (!permission) {
    return <View style={styles.center} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.perm}>
        <ScreenHeader title="Skan" subtitle="Kamera icazəsi lazımdır" />
        <Text style={styles.permText}>Sertifikatı skan etmək üçün kameraya icazə verin.</Text>
        <Pressable style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>İcazə ver</Text>
        </Pressable>
        <Pressable style={styles.galleryLink} onPress={pickGallery}>
          <Text style={styles.galleryLinkText}>Qalereyadan seç</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" enableTorch={flash}>
        <SafeAreaView style={styles.overlay}>
          <ScreenHeader title="Skan et" subtitle="Sənədi çərçivəyə yerləşdirin" dark />
          <View style={styles.frameWrap}>
            <View style={styles.frame}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>
            <Text style={styles.hint}>Avtomatik kəsmə — önizləmədə düzəldin</Text>
          </View>
          <View style={styles.controls}>
            <Pressable style={styles.sideBtn} onPress={pickGallery}>
              <Text style={styles.sideBtnText}>Qalereya</Text>
            </Pressable>
            <Pressable style={styles.shutter} onPress={capture}>
              <View style={styles.shutterInner} />
            </Pressable>
            <Pressable style={styles.sideBtn} onPress={() => setFlash((f) => !f)}>
              <Text style={styles.sideBtnText}>{flash ? 'Flaş off' : 'Flaş'}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const cornerSize = 28;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, backgroundColor: colors.ink },
  overlay: { flex: 1, justifyContent: 'space-between' },
  frameWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  frame: {
    width: '100%',
    aspectRatio: 3 / 4,
    maxHeight: 420,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.lg,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: cornerSize,
    height: cornerSize,
    borderColor: colors.seal,
  },
  tl: { top: -1, left: -1, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: -1, right: -1, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: -1, left: -1, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: -1, right: -1, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  hint: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: fonts.body, marginTop: spacing.md, textAlign: 'center' },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.seal },
  sideBtn: { minWidth: 72, alignItems: 'center' },
  sideBtnText: { color: colors.white, fontSize: 14, fontFamily: fonts.bodySemiBold },
  perm: { flex: 1, backgroundColor: colors.parchment, padding: spacing.lg },
  permText: { fontSize: 16, fontFamily: fonts.body, color: colors.inkMuted, marginVertical: spacing.lg },
  permBtn: { backgroundColor: colors.ink, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  permBtnText: { color: colors.parchment, fontFamily: fonts.bodyBold, fontSize: 16 },
  galleryLink: { marginTop: spacing.lg, alignItems: 'center' },
  galleryLinkText: { color: colors.seal, fontFamily: fonts.bodySemiBold, fontSize: 15 },
});
