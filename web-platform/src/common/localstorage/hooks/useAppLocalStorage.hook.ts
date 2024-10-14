import { useLocalStorage } from '@noice-com/common-ui';

import { AppLocalStorageKeys } from '../types';

export function useAppLocalStorage() {
  return useLocalStorage<AppLocalStorageKeys>();
}
