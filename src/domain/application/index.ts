import { store } from '../../store';
import en from '../../utils/strings/locales/en.json';

type LocalizedStrings = typeof en;
type LocalizedStringsMap = Record<string, LocalizedStrings>;

export default class Application {
  private static instance: Application;
  private localizedStrings: LocalizedStringsMap = {};

  static getInstance(): Application {
    if (!this.instance) this.instance = new Application();
    return this.instance;
  }

  // Reads synchronously from Redux store — safe in non-React code
  static getAccessToken(): string {
    return store.getState().auth.loginData?.access_token ?? '';
  }

  // Used by the localizedStrings Proxy — reads from Redux store synchronously
  static getCurrentLanguageCode(): string {
    return store.getState().language.currentLanguageCode;
  }

  static getLocalizedStrings(): LocalizedStringsMap {
    return this.getInstance().localizedStrings;
  }

  static setLocalizedStrings(strings: LocalizedStringsMap): void {
    this.getInstance().localizedStrings = strings;
  }
}
