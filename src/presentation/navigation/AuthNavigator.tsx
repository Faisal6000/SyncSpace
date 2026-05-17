import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationScreen } from './routes';
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/register/RegisterScreen';
import { SlideLeftRightTransition } from '../../utils/animations/SlideLeftRightTransition';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...SlideLeftRightTransition,
      }}>
      <Stack.Screen
        name={NavigationScreen.Login}
        component={LoginScreen}
      />
      <Stack.Screen
        name={NavigationScreen.Register}
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
}
