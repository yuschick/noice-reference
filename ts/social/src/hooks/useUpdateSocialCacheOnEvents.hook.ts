import { useUpdateFriendListsCacheOnEvents } from './useUpdateFriendListsCacheOnEvents.hook';
import { useUpdateProfileCacheOnEvents } from './useUpdateProfileCacheOnEvents.hook';

export function useUpdateSocialCacheOnEvents() {
  useUpdateProfileCacheOnEvents();
  useUpdateFriendListsCacheOnEvents();
}
