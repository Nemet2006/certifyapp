import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CertDetailScreen } from '../screens/cert/CertDetailScreen';
import { PrintScreen } from '../screens/print/PrintScreen';
import { ScanPreviewScreen } from '../screens/scan/ScanPreviewScreen';
import { VerifyScreen } from '../screens/verify/VerifyScreen';
import { colors } from '../theme/colors';
import { MainTabs } from './MainTabs';
import { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.parchment } }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="CertDetail" component={CertDetailScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="ScanPreview" component={ScanPreviewScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Print" component={PrintScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Verify" component={VerifyScreen} options={{ animation: 'fade' }} />
    </Stack.Navigator>
  );
}
