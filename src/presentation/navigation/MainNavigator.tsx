import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationScreen } from './routes';
import HomeScreen from '../screens/home/HomeScreen';

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={NavigationScreen.Home}
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
}
