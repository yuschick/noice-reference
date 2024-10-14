import { FieldPolicy, Reference } from '@apollo/client';

import { ChannelListBannedUsersResponse } from '../../gen';

type ExistingChannelBannedUsersPagination =
  | (Omit<ChannelListBannedUsersResponse, 'users'> & {
      users: Reference[];
    })
  | null;

type ResultChannelBannedUsersPagination =
  | (Omit<ChannelListBannedUsersResponse, 'users'> & {
      users: Reference[];
    })
  | null;

type ChannelBannedUsersFieldPolicy = FieldPolicy<
  ExistingChannelBannedUsersPagination,
  ResultChannelBannedUsersPagination,
  ResultChannelBannedUsersPagination
>;

export function channelBannedUsersPagination(): ChannelBannedUsersFieldPolicy {
  return {
    keyArgs: ['channelId'],
    read(existing) {
      if (existing) {
        return {
          ...existing,
          users: Object.values(existing.users),
        };
      }
    },

    merge(existing, incoming, { readField }) {
      if (!incoming) {
        return existing ?? null;
      }

      const existingUserIds = new Set(
        existing?.users.map((userBan) => readField('userId', userBan)),
      );

      const users = [
        ...(existing?.users ?? []),
        ...incoming.users.filter(
          (userBan) => !existingUserIds.has(readField('userId', userBan)),
        ),
      ];

      return {
        ...incoming,
        users,
      };
    },
  };
}
