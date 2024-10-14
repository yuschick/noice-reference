import { useCallback, useEffect, useState } from 'react';

import { StudioLocalStorageKeys } from '../types';

import { useStudioLocalStorage } from './useStudioLocalStorage.hook';

export function useListenStudioLocalStorageValue<
  Key extends keyof StudioLocalStorageKeys,
>(key: Key): [StudioLocalStorageKeys[Key], (value: StudioLocalStorageKeys[Key]) => void] {
  const localStorage = useStudioLocalStorage();

  const [value, setValue] = useState(localStorage.GetValue(key));

  useEffect(() => {
    return localStorage.SetListener(key, (value) => {
      setValue(value);
    });
  }, [key, localStorage]);

  const setLocalStorageValue = useCallback(
    (value: StudioLocalStorageKeys[Key]) => {
      localStorage.SetValue(key, value);
    },
    [key, localStorage],
  );

  return [value, setLocalStorageValue];
}
