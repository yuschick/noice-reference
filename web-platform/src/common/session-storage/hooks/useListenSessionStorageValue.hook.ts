import { useCallback, useEffect, useState } from 'react';

import { AppSessionStorageKeys } from '../types';

import { useAppSessionStorage } from './useAppSessionStorage.hook';

export function useListenSessionStorageValue<Key extends keyof AppSessionStorageKeys>(
  key: Key,
): [AppSessionStorageKeys[Key], (value: AppSessionStorageKeys[Key]) => void] {
  const sessionStorage = useAppSessionStorage();

  const [value, setValue] = useState(sessionStorage.getValue(key));

  useEffect(() => {
    return sessionStorage.addListener(key, (value) => {
      setValue(value);
    });
  }, [key, sessionStorage]);

  const setSessionStorageValue = useCallback(
    (value: AppSessionStorageKeys[Key]) => {
      sessionStorage.setValue(key, value);
    },
    [key, sessionStorage],
  );

  return [value, setSessionStorageValue];
}
