import { useLocalStorage } from '@noice-com/common-ui';

import { StreamLocalStorageKeys } from '@stream-types';

export function useStreamLocalStorage() {
  return useLocalStorage<StreamLocalStorageKeys>();
}
