import { FieldPolicy, Reference } from '@apollo/client';

import { ChannelListChannelPrivilegedUsersResponse } from '../../gen';

type ExistingChannelPagination =
  | (Omit<ChannelListChannelPrivilegedUsersResponse, 'users'> & {
      users: Record<string, Reference>;
    })
  | null;

type ResultChannelPagination =
  | (Omit<ChannelListChannelPrivilegedUsersResponse, 'users'> & {
      users: Reference[];
    })
  | null;

type ChannelFieldPolicy = FieldPolicy<
  ExistingChannelPagination,
  ResultChannelPagination,
  ResultChannelPagination
>;

export function channelPrivilegedUsersPagination(): ChannelFieldPolicy {
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
        return existing || null;
      }

      const users: Record<string, Reference> = existing ? { ...existing.users } : {};

      incoming.users.forEach((user) => {
        users[readField('userId', user) as string] = user;
      });

      return {
        ...incoming,
        users,
      };
    },
  };
}
