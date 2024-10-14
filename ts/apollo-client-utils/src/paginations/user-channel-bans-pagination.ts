import { FieldPolicy, Reference } from '@apollo/client';

import { ChannelListUserChannelBansResponse } from '../../gen';

type ExistingUserChannelBansPagination =
  | (Omit<ChannelListUserChannelBansResponse, 'bans'> & {
      bans: Record<string, Reference>;
    })
  | null;

type ResultUserChannelBansPagination =
  | (Omit<ChannelListUserChannelBansResponse, 'bans'> & {
      bans: Reference[];
    })
  | null;

type UserChannelBansFieldPolicy = FieldPolicy<
  ExistingUserChannelBansPagination,
  ResultUserChannelBansPagination,
  ResultUserChannelBansPagination
>;

export function userChannelBansPagination(): UserChannelBansFieldPolicy {
  return {
    keyArgs: ['userId'],
    read(existing) {
      if (existing) {
        return {
          ...existing,
          bans: Object.values(existing.bans),
        };
      }
    },

    merge(existing, incoming, { readField }) {
      if (!incoming) {
        return existing || null;
      }

      const bans: Record<string, Reference> = existing ? { ...existing.bans } : {};

      incoming.bans.forEach((ban) => {
        bans[readField('channelId', ban) as string] = ban;
      });

      return {
        ...incoming,
        bans,
      };
    },
  };
}
