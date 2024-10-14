import { FieldPolicy, Reference } from '@apollo/client';

import { StreamerListChannelActivityEventsResponse } from '../../gen';

type ExistingActivityFeedPagination =
  | (Omit<StreamerListChannelActivityEventsResponse, 'events'> & {
      events: Reference[];
    })
  | null;

type ResultActivityFeedPagination =
  | (Omit<StreamerListChannelActivityEventsResponse, 'events'> & {
      events: Reference[];
    })
  | null;

type ActivityFeedFieldPolicy = FieldPolicy<
  ExistingActivityFeedPagination,
  ResultActivityFeedPagination,
  ResultActivityFeedPagination
>;

export function channelActivityFeedsPagination(): ActivityFeedFieldPolicy {
  return {
    keyArgs: ['channelId'],
    read(existing) {
      if (existing) {
        return existing;
      }
    },

    merge(existing, incoming, { readField }) {
      if (!incoming) {
        return existing ?? null;
      }

      const existingEventIds = new Set(
        existing?.events.map((event) => readField('id', event)),
      );

      const events = [
        ...(existing?.events ?? []),
        ...(incoming.events?.filter(
          (event) => !existingEventIds.has(readField('id', event)),
        ) ?? []),
      ];

      return {
        ...incoming,
        events,
      };
    },
  };
}
