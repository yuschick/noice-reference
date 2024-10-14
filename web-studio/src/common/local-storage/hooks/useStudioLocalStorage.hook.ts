import { useLocalStorage } from '@noice-com/common-ui';

import { StudioLocalStorageKeys } from '../types';

export function useStudioLocalStorage() {
  return useLocalStorage<StudioLocalStorageKeys>();
}
