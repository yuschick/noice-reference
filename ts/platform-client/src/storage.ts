import { logger } from './lib';
import { IStorage } from './types';

const IS_BROWSER = typeof window === 'object' && typeof window.document === 'object';
const HAS_LOCAL_STORAGE = IS_BROWSER && typeof window.localStorage === 'object';

const log = logger('LocalStorage');

export class LocalStorage implements IStorage {
  public get(key: string): string | null {
    if (HAS_LOCAL_STORAGE) {
      return localStorage.getItem(key);
    }

    log.warn('LocalStorage is not available in this environment');

    return null;
  }
  public set(key: string, value: string): void {
    if (HAS_LOCAL_STORAGE) {
      return localStorage.setItem(key, value);
    }

    log.warn('LocalStorage is not available in this environment');
  }
  public remove(key: string): void {
    if (HAS_LOCAL_STORAGE) {
      return localStorage.removeItem(key);
    }

    log.warn('LocalStorage is not available in this environment');
  }
}
