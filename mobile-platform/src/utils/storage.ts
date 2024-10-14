import { Session } from '@noice-com/platform-client';
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

enum StorageKeys {
  AuthSession = 'user.authSession',
  PendingEmailVerification = 'user.pendingEmailVerification',
  PendingSignUp = 'user.pendingSignUp',
  UserRecentUsedEmojis = 'user.recentUsedEmojis',
  AppleEmailPeristedEmail = 'appAuth.appleAccountPersistedEmail',
  MarketingTrackingInfo = 'user.marketingTrackingInfo',
}

type MarketingTrackingInfo = {
  firstOpen?: number;
};

const localStorage = new MMKV({
  id: 'global-storage',
  // @todo add encryption key? but getting it from where?
  // encryptionKey: 'something',
});

export const LocalStorage = {
  setAuthSession: (session: Session | null) => {
    if (!session) {
      localStorage.delete(StorageKeys.AuthSession);
      return;
    }

    const stringified = JSON.stringify(session);
    localStorage.set(StorageKeys.AuthSession, stringified);
  },
  getAuthSession: (): Session | null => {
    const sessionStr = localStorage.getString(StorageKeys.AuthSession);
    if (!sessionStr) {
      return null;
    }

    const parsed = JSON.parse(sessionStr) as Session;
    if (!parsed) {
      return null;
    }

    return {
      ...parsed,
      created: new Date(parsed.created),
    };
  },
  setRecentEmojis: (emojiKeys?: string[]) => {
    if (!emojiKeys?.length) {
      return;
    }

    const stringified = JSON.stringify(emojiKeys);
    localStorage.set(StorageKeys.UserRecentUsedEmojis, stringified);
  },
  getRecentEmojis: (): string[] => {
    const sessionStr = localStorage.getString(StorageKeys.UserRecentUsedEmojis);
    if (!sessionStr) {
      return [];
    }

    const parsed = JSON.parse(sessionStr) as string[];
    if (!parsed) {
      return [];
    }

    return parsed;
  },
  setMarketingTrackingInfo: (info: MarketingTrackingInfo) => {
    const prevInfoStr = localStorage.getString(StorageKeys.MarketingTrackingInfo);
    const prevInfo: MarketingTrackingInfo = JSON.parse(prevInfoStr) ?? {};

    const newInfo = { ...prevInfo, ...info };
    const newInfoStr = JSON.stringify(newInfo);
    localStorage.set(StorageKeys.MarketingTrackingInfo, newInfoStr);
  },
  getMarketingTrackingInfo: (): MarketingTrackingInfo => {
    const infoStr = localStorage.getString(StorageKeys.MarketingTrackingInfo);

    if (!infoStr) {
      return {};
    }

    const info = JSON.parse(infoStr) as MarketingTrackingInfo;

    return info;
  },
};

export const zustandPersitentStorage: StateStorage = {
  setItem: (name, value) => {
    return localStorage.set(name, value);
  },
  getItem: (name) => {
    const value = localStorage.getString(name);

    return value ?? null;
  },
  removeItem: (name) => {
    return localStorage.delete(name);
  },
};

const CLIENT_STORAGE_KEY = 'PLATFORM_CLIENT_';

export const clientStorage = {
  get: function (key: string): string {
    return localStorage.getString(`${CLIENT_STORAGE_KEY}${key}`) ?? '';
  },
  remove: function (key: string): void {
    localStorage.delete(`${CLIENT_STORAGE_KEY}${key}`);
  },
  set: function (key: string, value: string): void {
    localStorage.set(`${CLIENT_STORAGE_KEY}${key}`, value);
  },
};
