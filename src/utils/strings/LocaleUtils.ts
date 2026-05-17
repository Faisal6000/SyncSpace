import { NativeModules, Platform } from 'react-native';
import { PossibleLanguages } from './PossibleLanguages';

export class LocaleUtils {
  static getDeviceLanguage(): string {
    const locale =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0]
        : NativeModules.I18nManager?.localeIdentifier;

    const languageCode = locale?.split('_')[0] ?? 'en';

    // Check if the device language is supported
    const supportedCodes = Object.values(PossibleLanguages) as string[];
    return supportedCodes.includes(languageCode) ? languageCode : 'en';
  }
}
