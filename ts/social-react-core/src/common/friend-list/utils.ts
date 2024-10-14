import { Reference } from '@apollo/client';
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common';
import { DeepPartial } from '@noice-com/utils';

import { FriendsListFriendsResponse, ProfilePresenceStatus } from '../../../gen';

export const addNewFriendToExistingFriendList = (
  existingFriendsResponse: DeepPartial<FriendsListFriendsResponse>,
  newFriendUser: Reference | undefined,
  readField: ReadFieldFunction,
) => {
  return {
    ...existingFriendsResponse,
    users: [...(existingFriendsResponse.users ?? []), newFriendUser].sort((a, z) => {
      const aProfile = readField<Reference>('profile', a);
      const zProfile = readField<Reference>('profile', z);
      const aStatus = readField<ProfilePresenceStatus>('onlineStatus', aProfile);
      const zStatus = readField<ProfilePresenceStatus>('onlineStatus', zProfile);

      // If they are same, they are equal
      if (aStatus === zStatus) {
        return 0;
      }

      // If a is online, it should be first
      if (aStatus === ProfilePresenceStatus.PresenceStatusOnline) {
        return -1;
      }

      // If z is online, it should be first
      if (zStatus === ProfilePresenceStatus.PresenceStatusOnline) {
        return 1;
      }

      return 0;
    }),
  };
};
