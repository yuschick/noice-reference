import { FieldPolicy, Reference } from '@apollo/client';

import { ChannelGetUserFollowedChannelsResponse } from '../../gen';

type ExistingFollowedChannelsPagination =
  | (Omit<ChannelGetUserFollowedChannelsResponse, 'channels'> & {
      channels: Reference[];
    })
  | null;

type ResultFolloweChannelsPagination =
  | (Omit<ChannelGetUserFollowedChannelsResponse, 'channels'> & {
      channels: Reference[];
    })
  | null;

type FollowedChannelsFieldPolicy = FieldPolicy<
  ExistingFollowedChannelsPagination,
  ResultFolloweChannelsPagination,
  ResultFolloweChannelsPagination
>;

export function followedChannelsPagination(): FollowedChannelsFieldPolicy {
  return {
    keyArgs: ['userId', 'liveStatus', '@connection'],
    read(existing) {
      if (existing) {
        return existing;
      }
    },

    merge(existing, incoming, { readField, args }) {
      if (!incoming) {
        return existing ?? null;
      }

      const existingChannelIds = new Set(
        existing?.channels.map((channel) => readField('id', channel)),
      );

      let channels = [
        ...(existing?.channels ?? []),
        ...(incoming.channels?.filter(
          (channel) => !existingChannelIds.has(readField('id', channel)),
        ) ?? []),
      ];

      // If there is liveStatus argument, filter channels by liveStatus
      if (args?.liveStatus) {
        channels = channels.filter(
          (channel) => readField('liveStatus', channel) === args.liveStatus,
        );
      }

      return {
        ...incoming,
        channels,
      };
    },
  };
}
