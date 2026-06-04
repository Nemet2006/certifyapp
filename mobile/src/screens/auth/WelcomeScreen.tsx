import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/Logo';
import { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.ink, colors.inkLight, '#1c3554']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <Logo light />
        <View style={styles.hero}>
          <Text style={styles.headline}>Sertifikatlarınız{'\n'}bir toxunuş uzaqlıqda</Text>
          <Text style={styles.body}>
            Tədbirlər, rəsmi sənədlər və təhlükəsiz doğrulama — hamısı bir yerdə.
          </Text>
        </View>
        <View style={styles.actions}>
          <Button title="Daxil ol" variant="light" onPress={() => navigation.navigate('Login')} />
          <Button
            title="Hesab yarat"
            variant="outlineLight"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, padding: spacing.lg, justifyContent: 'space-between' },
  hero: { flex: 1, justifyContent: 'center', paddingVertical: spacing.xl },
  headline: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.parchment,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 17,
    color: 'rgba(244, 239, 230, 0.75)',
    lineHeight: 26,
    marginTop: spacing.md,
  },
  actions: { gap: spacing.md, paddingBottom: spacing.md },
});
