import { Platform } from 'react-native';
import { CustomTheme, ThemePreference } from './CustomTheme';

export const commonColors = {
  primary: '#4F46E5', // Indigo 600
  primaryLight: '#818CF8', // Indigo 400
  success: '#10B981', // Emerald 500
  error: '#EF4444', // Red 500
  warning: '#F59E0B', // Amber 500
  info: '#3B82F6', // Blue 500
};

const defaultFonts = Platform.select({
  ios: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '600' as const },
    heavy: { fontFamily: 'System', fontWeight: '700' as const },
  },
  default: {
    regular: { fontFamily: 'sans-serif', fontWeight: 'normal' as const },
    medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' as const },
    bold: { fontFamily: 'sans-serif', fontWeight: '600' as const },
    heavy: { fontFamily: 'sans-serif', fontWeight: '700' as const },
  },
});

export const lightTheme: CustomTheme = {
  dark: false,
  isDark: false,
  preference: 'light',
  fonts: defaultFonts,
  colors: {
    ...commonColors,
    background: '#F9FAFB',
    backgroundSecondary: '#F3F4F6',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#374151',
    textHint: '#9CA3AF',
    textInverse: '#FFFFFF',
    divider: '#E5E7EB',
    border: '#D1D5DB',
    inputBackground: '#FFFFFF',
    inputBorder: '#D1D5DB',
    inputText: '#111827',
    placeholder: '#9CA3AF',
    bubbleSent: '#4F46E5',
    bubbleReceived: '#F3F4F6',
    bubbleSentText: '#FFFFFF',
    bubbleReceivedText: '#111827',
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#4F46E5',
    tabBarInactive: '#9CA3AF',
    // React Navigation required
    primary: '#4F46E5',
    notification: '#EF4444',
  },
};

export const darkTheme: CustomTheme = {
  dark: true,
  isDark: true,
  preference: 'dark',
  fonts: defaultFonts,
  colors: {
    ...commonColors,
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    card: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textHint: '#64748B',
    textInverse: '#0F172A',
    divider: '#334155',
    border: '#475569',
    inputBackground: '#1E293B',
    inputBorder: '#334155',
    inputText: '#F1F5F9',
    placeholder: '#64748B',
    bubbleSent: '#4F46E5',
    bubbleReceived: '#1E293B',
    bubbleSentText: '#FFFFFF',
    bubbleReceivedText: '#F1F5F9',
    tabBarBackground: '#1E293B',
    tabBarActive: '#818CF8',
    tabBarInactive: '#64748B',
    primary: '#4F46E5',
    notification: '#EF4444',
  },
};

export function resolveTheme(preference: ThemePreference, systemDark: boolean): CustomTheme {
  switch (preference) {
    case 'light':
      return { ...lightTheme, preference };
    case 'dark':
      return { ...darkTheme, preference };
    case 'system':
    default:
      return systemDark
        ? { ...darkTheme, preference: 'system' }
        : { ...lightTheme, preference: 'system' };
  }
}
