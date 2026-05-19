import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../utils/theme/useAppTheme';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';
import { AppButton } from '../../../utils/components/button/AppButton';

export default function HomeScreen() {
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.auth.loginData?.user_id);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Home</Text>
        <Text style={[styles.userInfo, { color: theme.colors.textSecondary }]}>
          Logged in as: {userId ?? 'Unknown'}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton label="Log Out" onPress={handleLogout} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  userInfo: {
    fontSize: 16,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
});
