import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageChangeListener } from './StorageChangeListener';

class LocalStorageService {
  private static instance: LocalStorageService;
  private listeners: Set<StorageChangeListener<any>> = new Set();

  static getInstance(): LocalStorageService {
    if (!this.instance) this.instance = new LocalStorageService();
    return this.instance;
  }

  async setData<T>(key: string, data: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    this.listeners.forEach(cb => cb(key, data));
  }

  async getData<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  subscribeToChanges<T>(callback: StorageChangeListener<T>): void {
    this.listeners.add(callback);
  }

  unsubscribeFromChanges<T>(callback: StorageChangeListener<T>): void {
    this.listeners.delete(callback);
  }
}

export const localStorageService = LocalStorageService.getInstance();
