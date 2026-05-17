import React from 'react';
import { useAppSelector } from '../../store/hooks';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function AppNavigator() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
}

export { AppNavigator };
