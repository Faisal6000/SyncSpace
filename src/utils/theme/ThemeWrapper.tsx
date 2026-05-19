import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../../store/hooks';
import { resolveTheme } from './themes';
import { navigationRef } from '../../domain/services/NavigationService';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const preference = useAppSelector(state => state.theme.preference);
  const systemDark = useColorScheme() === 'dark';
  const resolvedTheme = resolveTheme(preference, systemDark);

  return (
    <NavigationContainer theme={resolvedTheme} ref={navigationRef}>
      {children}
    </NavigationContainer>
  );
}
