import { FieldPolicy, Reference } from '@apollo/client';

import {
  FriendsListFriendsRequestFilterInput,
  FriendsListFriendsResponse,
  ProfilePresenceStatus,
} from '../../gen';

type ExistingFriendsPagination =
  | (Omit<FriendsListFriendsResponse, 'users'> & {
      users: Reference[];
    })
  | null;

type ResultFriendsPagination =
  | (Omit<FriendsListFriendsResponse, 'users'> & {
      users: Reference[];
    })
  | null;

type FriendsFieldPolicy = FieldPolicy<
  ExistingFriendsPagination,
  ResultFriendsPagination,
  ResultFriendsPagination
>;

export function friendsPagination(): FriendsFieldPolicy {
  return {
    keyArgs: ['userId', 'filters', 'priorityOrder'],
    read(existing) {
      if (existing) {
        return existing;
      }
    },

    merge(existing, incoming, { readField, args }) {
      let users: Reference[] = [];

      // Do not merge when there is channel id
      const doNotMerge: boolean =
        args?.filters?.some(
          (filter: FriendsListFriendsRequestFilterInput) => !!filter['channelId'],
        ) ?? false;

      if (!incoming) {
        if (doNotMerge) {
          return null;
        }

        return existing ?? null;
      }

      if (!doNotMerge && existing) {
        users = existing.users;
      }

      const existingUserIds = new Set(users.map((user) => readField('userId', user)));
      // Merge users, but filter out duplicate users
      const mergedUsers = [
        ...users,
        ...incoming.users.filter(
          (user) => !existingUserIds.has(readField('userId', user)),
        ),
      ].sort((a, z) => {
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
      });

      return {
        ...incoming,
        users: mergedUsers,
      };
    },
  };
}
