import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../utils/theme/useAppTheme';
import { AppButton } from '../../../utils/components/button/AppButton';
import Strings from '../../../utils/strings/localizedStrings';

export default function RegisterScreen({ navigation }: any) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {Strings.register_button}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Registration form coming soon
      </Text>
      <View style={styles.buttonContainer}>
        <AppButton
          label="Back to Login"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
  },
});
