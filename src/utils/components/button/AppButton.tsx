import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: AppButtonProps) {
  const theme = useAppTheme();
  const isPrimary = variant === 'primary';

  const buttonStyle: ViewStyle = {
    backgroundColor: isPrimary ? theme.colors.primary : 'transparent',
    borderWidth: isPrimary ? 0 : 1.5,
    borderColor: isPrimary ? undefined : theme.colors.primary,
    opacity: disabled || loading ? 0.6 : 1,
  };

  const textStyle: TextStyle = {
    color: isPrimary ? theme.colors.textInverse : theme.colors.primary,
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? theme.colors.textInverse : theme.colors.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.label, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
