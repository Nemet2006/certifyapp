import { Platform, ViewStyle } from 'react-native';

export const shadows = {
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0a1628',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0a1628',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
    default: {},
  }),
  fab: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#c9a227',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
    },
    android: { elevation: 10 },
    default: {},
  }),
};
