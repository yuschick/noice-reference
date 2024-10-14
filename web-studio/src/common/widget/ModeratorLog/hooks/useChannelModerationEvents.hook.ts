import { gql } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { useCallback } from 'react';

import { getEventTypeFilter, isIncludedEvent } from '../util';

import {
  ChannelModerationEventType,
  ModerationEventsDocument,
  ModerationEventsHistoryDocument,
  ModerationEventsHistoryQuery,
  ModerationEventsHistoryQueryVariables,
  ModerationEventsSubscription,
  ModerationEventsSubscriptionVariables,
  ModerationLogEventFragment,
  useModerationEventsHistoryQuery,
} from '@gen';

const PAGE_SIZE = 20;

gql`
  query ModerationEventsHistory(
    $channelId: ID!
    $filter: ChannelModerationEventsFilterInput
    $cursor: String
    $pageSize: Int
  ) {
    moderationEvents(
      channelId: $channelId
      filter: $filter
      cursor: { last: $pageSize, before: $cursor }
    ) {
      events {
        ...ModerationLogEvent
      }
      pageInfo {
        startCursor
        hasPreviousPage
      }
    }
  }
`;

gql`
  subscription ModerationEvents(
    $channelId: ID!
    $filter: ChannelModerationEventsFilterInput
  ) {
    moderationEventsSubscribe(channelId: $channelId, filter: $filter) {
      ...ModerationLogEvent
    }
  }
`;

interface UseChannelModerationEventsResult {
  events: ModerationLogEventFragment[];
  fetchPrevious: () => void;
  hasPrevious?: boolean;
  loading: boolean;
}

export type UseChannelModerationEventsHook = (
  channelId: string,
  eventTypes: ChannelModerationEventType[],
) => UseChannelModerationEventsResult;

export const useChannelModerationEvents: UseChannelModerationEventsHook = (
  channelId,
  eventTypes,
) => {
  const variables = {
    channelId,
    filter: { eventTypes },
    pageSize: PAGE_SIZE,
  };

  const { data, loading, fetchMore, refetch } = useModerationEventsHistoryQuery({
    variables,
  });

  useRestartingSubscription<
    ModerationEventsSubscription,
    ModerationEventsSubscriptionVariables
  >(ModerationEventsDocument, {
    variables: {
      channelId,
      filter: { eventTypes },
    },
    onData({ client: { cache }, data }) {
      if (!data.data) {
        return;
      }

      const event = data.data.moderationEventsSubscribe;

      // Check if disabled in Filters
      if (
        !event?.content.content?.__typename ||
        !isIncludedEvent(event.content.content.__typename, eventTypes)
      ) {
        return;
      }

      cache.updateQuery<
        ModerationEventsHistoryQuery,
        ModerationEventsHistoryQueryVariables
      >(
        {
          query: ModerationEventsHistoryDocument,
          variables,
        },
        (prev) => {
          if (!prev?.moderationEvents) {
            return prev;
          }

          // Exists already, can happen at least on first render
          const exists = prev.moderationEvents.events.find(({ id }) => id === event.id);

          if (exists) {
            return prev;
          }

          return {
            ...prev,
            moderationEvents: {
              ...prev.moderationEvents,
              events: [...prev.moderationEvents.events, event],
            },
          };
        },
      );
    },
    onComplete() {
      // Refetch history when server completes, so nothing gets missed
      refetch();
    },
  });

  // Fetches previous batch of PAGE_SIZE from history
  const fetchPrevious = useCallback(() => {
    const cursor = data?.moderationEvents?.pageInfo.startCursor;
    fetchMore({
      variables: {
        pageSize: PAGE_SIZE,
        cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.moderationEvents || !prev.moderationEvents) {
          return prev;
        }

        return {
          ...prev,
          moderationEvents: {
            ...fetchMoreResult.moderationEvents,
            events: [
              ...fetchMoreResult.moderationEvents.events,
              ...prev.moderationEvents.events,
            ],
          },
        };
      },
    });
  }, [data?.moderationEvents?.pageInfo.startCursor, fetchMore]);

  return {
    events: data?.moderationEvents?.events?.filter(getEventTypeFilter(eventTypes)) || [],
    loading,
    fetchPrevious,
    hasPrevious: data?.moderationEvents?.pageInfo.hasPreviousPage,
  };
};
