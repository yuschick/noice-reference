import { useCallback, useEffect, useState } from 'react';

import { AppLocalStorageKeys } from '../types';

import { useAppLocalStorage } from './useAppLocalStorage.hook';

export function useListenAppLocalStorageValue<Key extends keyof AppLocalStorageKeys>(
  key: Key,
): [AppLocalStorageKeys[Key], (value: AppLocalStorageKeys[Key]) => void] {
  const localStorage = useAppLocalStorage();

  const [value, setValue] = useState(localStorage.GetValue(key));

  useEffect(() => {
    setValue(localStorage.GetValue(key));

    return localStorage.SetListener(key, (value) => {
      setValue(value);
    });
  }, [key, localStorage]);

  const setLocalStorageValue = useCallback(
    (value: AppLocalStorageKeys[Key]) => {
      localStorage.SetValue(key, value);
    },
    [key, localStorage],
  );

  return [value, setLocalStorageValue];
}
