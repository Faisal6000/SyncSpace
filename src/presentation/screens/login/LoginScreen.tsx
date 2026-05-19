import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '../../../utils/theme/useAppTheme';
import { useAppDispatch } from '../../../store/hooks';
import { loginSuccess } from '../../../store/slices/authSlice';
import { AppButton } from '../../../utils/components/button/AppButton';
import { container } from '../../../di/inversify.config';
import { TYPES } from '../../../di/types';
import { AuthRepository } from '../../../domain/repository/AuthRepository';
import { NetworkResponseType } from '../../../utils/network/NetworkResponse';
import { LoaderService, EventListener } from '../../../domain/services/EventListener';
import { ErrorMessageHandler } from '../../../utils/network/ErrorMessageHandler';
import Strings from '../../../utils/strings/localizedStrings';
import { NavigationScreen } from '../../navigation/routes';

export default function LoginScreen({ navigation }: any) {
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      EventListener.showErrorToast('Please fill in all fields');
      return;
    }

    LoaderService.show();
    try {
      const authRepo = container.get<AuthRepository>(TYPES.AuthRepository);
      const result = await authRepo.login(email, password);
      LoaderService.dismiss();

      if (result.responseType === NetworkResponseType.SUCCESS) {
        dispatch(loginSuccess(result.response));
      } else {
        EventListener.showErrorToast(ErrorMessageHandler.getDisplayMessage());
      }
    } catch {
      LoaderService.dismiss();
      EventListener.showErrorToast(ErrorMessageHandler.getDisplayMessage());
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {Strings.welcome_message}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Sign in to continue
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
              },
            ]}
            placeholder={Strings.email_placeholder}
            placeholderTextColor={theme.colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
              },
            ]}
            placeholder={Strings.password_placeholder}
            placeholderTextColor={theme.colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton label={Strings.login_button} onPress={handleLogin} />

          <View style={styles.registerRow}>
            <Text style={[styles.registerText, { color: theme.colors.textSecondary }]}>
              Don't have an account?
            </Text>
            <AppButton
              label={Strings.register_button}
              onPress={() => navigation.navigate(NavigationScreen.Register)}
              variant="secondary"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  registerRow: {
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  registerText: {
    fontSize: 14,
  },
});
