import { useLocalStorage } from '@noice-com/common-ui';

import { ChatLocalStorageKeys } from '../types';

export function useChatLocalStorage() {
  return useLocalStorage<ChatLocalStorageKeys>();
}
