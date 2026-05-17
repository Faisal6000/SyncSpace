import { Theme } from '@react-navigation/native';

export type ThemePreference = 'light' | 'dark' | 'system';

export type CustomTheme = Theme & {
  isDark: boolean;
  preference: ThemePreference;
  colors: Theme['colors'] & {
    // Surfaces
    background: string;
    backgroundSecondary: string;
    card: string;
    // Text
    text: string;
    textSecondary: string;
    textHint: string;
    textInverse: string;
    // UI elements
    primary: string;
    primaryLight: string;
    divider: string;
    border: string;
    // Input
    inputBackground: string;
    inputBorder: string;
    inputText: string;
    placeholder: string;
    // Status
    success: string;
    error: string;
    warning: string;
    info: string;
    // Chat bubbles
    bubbleSent: string;
    bubbleReceived: string;
    bubbleSentText: string;
    bubbleReceivedText: string;
    // Navigation
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
};
