import { gql } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { useState } from 'react';

import {
  StreamMatchEventsFragment,
  StreamEventsDocument,
  StreamEventsSubscription,
  StreamEventsSubscriptionVariables,
  StreamerChannelFollowed,
  StreamerStreamEventFilterEventType,
} from '@gen';

gql`
  fragment StreamMatchEvents on StreamerStreamEventContentUnion {
    ... on GameLogicMatchStartedMsg {
      streamId
    }
    ...MatchStatusEndEvent
    ...HighScoringCardEvent
    ...NewFollower
    ...NewSubscriber
    ...NewGiftSubscription
  }
  subscription StreamEvents(
    $streamId: ID!
    $filter: StreamerStreamEventFilterInput
    $channelId: ID!
  ) {
    streamEventsSubscribe(streamId: $streamId, filter: $filter) {
      timestamp
      content {
        ...StreamMatchEvents
      }
    }
  }
`;

export type StreamMatchEvents = StreamMatchEventsFragment;

export type StreamMatchEvent = { timestamp: Date } & StreamMatchEvents;

export function useStreamEvents(
  channelId: string,
  streamId: string,
  filters: StreamerStreamEventFilterEventType[],
) {
  const [streamEvents, setStreamEvents] = useState<StreamMatchEvent[]>([]);

  const { loading } = useRestartingSubscription<
    StreamEventsSubscription,
    StreamEventsSubscriptionVariables
  >(StreamEventsDocument, {
    variables: { streamId, filter: { eventTypes: filters }, channelId },
    onData({ data }) {
      const event = data.data?.streamEventsSubscribe;

      if (!event?.content?.__typename) {
        return;
      }

      if (event.content.__typename === 'GameLogicMatchStartedMsg') {
        /* On match start, remove all previous match events */
        setStreamEvents([
          { ...event.content, timestamp: new Date(event.timestamp) } as StreamMatchEvent,
        ]);
      }

      if (
        event.content.__typename === 'GameLogicMatchEndedMsg' ||
        event.content.__typename === 'GameLogicHighScoringCardPromotedMsg' ||
        event.content.__typename === 'StreamerChannelFollowed' ||
        event.content.__typename === 'StreamerChannelSubscribed' ||
        event.content.__typename === 'StreamerSubscriptionGifted'
      ) {
        setStreamEvents((previousStreamEvents) => {
          if (
            event.content?.__typename === 'StreamerChannelFollowed' &&
            previousStreamEvents.some(
              (streamEvent) =>
                streamEvent.__typename === 'StreamerChannelFollowed' &&
                streamEvent.userId === (event.content as StreamerChannelFollowed)?.userId,
            )
          ) {
            // if the same user is trying to follow the channel multiple times, ignore it.
            // This is done to prevent spamming of follower events
            return previousStreamEvents;
          }

          return [
            {
              ...event.content,
              timestamp: new Date(event.timestamp),
            } as StreamMatchEvent,
            ...previousStreamEvents,
          ];
        });
        return;
      }
    },
  });

  return {
    events: streamEvents,
    loading,
  };
}
