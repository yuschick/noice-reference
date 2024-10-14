import { useSessionStorage } from '@noice-com/common-ui';

import type { AppSessionStorageKeys } from '../types';

export function useAppSessionStorage() {
  return useSessionStorage<AppSessionStorageKeys>();
}
