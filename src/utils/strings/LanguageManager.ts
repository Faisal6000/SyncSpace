import { localStorageService } from '../storage/LocalStorageService';
import { StorageDataKeys } from '../../data/constants/StorageDataKeys';

export class LanguageManager {
  static async setLanguage(code: string): Promise<void> {
    await localStorageService.setData(StorageDataKeys.LANGUAGE_CODE, code);
  }

  static async getLanguage(): Promise<string> {
    const code = await localStorageService.getData<string>(StorageDataKeys.LANGUAGE_CODE);
    return code ?? 'en';
  }
}
