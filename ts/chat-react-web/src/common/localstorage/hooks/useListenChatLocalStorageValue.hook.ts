import { useCallback, useEffect, useState } from 'react';

import { ChatLocalStorageKeys } from '../types';

import { useChatLocalStorage } from './useChatLocalStorage.hook';

export function useListenChatLocalStorageValue<Key extends keyof ChatLocalStorageKeys>(
  key: Key,
): [ChatLocalStorageKeys[Key], (value: ChatLocalStorageKeys[Key]) => void] {
  const localStorage = useChatLocalStorage();

  const [value, setValue] = useState(localStorage.GetValue(key));

  useEffect(() => {
    return localStorage.SetListener(key, (value) => {
      setValue(value);
    });
  }, [key, localStorage]);

  const setLocalStorageValue = useCallback(
    (value: ChatLocalStorageKeys[Key]) => {
      localStorage.SetValue(key, value);
    },
    [key, localStorage],
  );

  return [value, setLocalStorageValue];
}
