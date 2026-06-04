import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { HomeScreen } from '../screens/home/HomeScreen';
import { LibraryScreen } from '../screens/library/LibraryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ScannerScreen } from '../screens/scan/ScannerScreen';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { spacing } from '../theme/spacing';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function ScanTabButton({ onPress }: BottomTabBarButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.fabWrap} accessibilityRole="button" accessibilityLabel="Skan et">
      <View style={[styles.fab, shadows.fab]}>
        <Ionicons name="scan" size={28} color={colors.ink} />
      </View>
    </Pressable>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.seal,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size, focused }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Scan: 'scan',
            Library: focused ? 'folder' : 'folder-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Əsas' }} />
      <Tab.Screen
        name="Scan"
        component={ScannerScreen}
        options={{
          title: 'Skan',
          tabBarButton: (props) => <ScanTabButton {...props} />,
        }}
      />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ title: 'Arxiv' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    height: 72,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  fabWrap: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.seal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
});
