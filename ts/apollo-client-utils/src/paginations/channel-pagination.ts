import { FieldPolicy, InMemoryCache, Reference, gql } from '@apollo/client';
import { DeepPartial } from '@noice-com/utils';

import {
  ChannelChannel,
  ChannelListChannelsResponse,
  ChannelLiveStatus,
} from '../../gen';

type ExistingChannelPagination =
  | (Omit<ChannelListChannelsResponse, 'channels'> & {
      channels: Record<string, Reference>;
    })
  | null;

type ResultChannelPagination =
  | (Omit<ChannelListChannelsResponse, 'channels'> & {
      channels: Reference[];
    })
  | null;

type ChannelFieldPolicy = FieldPolicy<
  ExistingChannelPagination,
  ResultChannelPagination,
  ResultChannelPagination
>;

const changedLiveStatus = (oldLiveStatus: ChannelLiveStatus) => {
  if (oldLiveStatus === ChannelLiveStatus.LiveStatusOffline) {
    return ChannelLiveStatus.LiveStatusLive;
  }

  if (oldLiveStatus === ChannelLiveStatus.LiveStatusLive) {
    return ChannelLiveStatus.LiveStatusOffline;
  }

  return oldLiveStatus;
};

const updateRemovedChannelLiveStatus = (
  removedChannelIds: string[],
  cache: InMemoryCache,
  liveStatusArg: ChannelLiveStatus,
) => {
  removedChannelIds.forEach((channelId) => {
    cache.updateFragment<DeepPartial<ChannelChannel>>(
      {
        id: cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
        fragment: gql`
          fragment LiveStatusChangedChannelUpdate on ChannelChannel {
            liveStatus
          }
        `,
      },
      (existingChannel) => ({
        ...existingChannel,
        liveStatus: changedLiveStatus(liveStatusArg),
      }),
    );
  });
};

export function channelPagination(): ChannelFieldPolicy {
  return {
    keyArgs: ['liveStatus', 'name', 'gameId', '@connection'],
    read(existing) {
      if (existing) {
        return {
          ...existing,
          channels: Object.values(existing.channels),
        };
      }
    },

    merge(existing, incoming, { readField, args, cache }) {
      if (!incoming) {
        return existing ?? null;
      }

      let channels: Record<string, Reference> = {};

      // If there is existing and cursor is present, we are paginating, so include existing
      if (existing && (args?.cursor?.after || args?.cursor?.before)) {
        channels = { ...existing.channels };
      }
      // If we are not paginating, but we have live status argument, we know that channels
      // that are in existing but not incoming have changed live status,
      // so lets update existing channels live status
      else if (
        existing &&
        args?.cursor?.first &&
        incoming.channels.length < args.cursor.first &&
        args?.liveStatus &&
        [ChannelLiveStatus.LiveStatusLive, ChannelLiveStatus.LiveStatusOffline].includes(
          args.liveStatus,
        )
      ) {
        const ingomingChannelsIds = incoming.channels.map(
          (channel) => readField('id', channel) as string,
        );

        // Get all channels that were in existing but not incoming
        const changedLiveStatusChannels = Object.keys(existing.channels).filter(
          (channeldId) => !ingomingChannelsIds.includes(channeldId),
        );

        updateRemovedChannelLiveStatus(changedLiveStatusChannels, cache, args.liveStatus);
      }

      incoming.channels.forEach((channel) => {
        channels[readField('id', channel) as string] = channel;
      });

      return {
        ...incoming,
        channels,
      };
    },
  };
}
