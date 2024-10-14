import { gql } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { LoadingSpinner } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useWidgetMenu } from '../context';
import { WidgetId, ChannelWidgetProps } from '../types';

import styles from './ActivityFeed.module.css';
import { ActivityFeedFilters } from './ActivityFeedFilters';
import { ActivityFeedSettings } from './ActivityFeedSettings';
import { ActivityFeedSettingsContext } from './ActivityFeedSettingsProvider';
import { EmptyState } from './EmptyState';
import { ActivityListItem } from './items/ActivityListItem';

import { useChannelContext } from '@common/channel';
import { useListenStudioLocalStorageValue } from '@common/local-storage';
import { WidgetScrollWrapper } from '@common/scroll';
import {
  StreamActivityFeedNewChannelFollowerFragment,
  StreamActivityFeedDocument,
  StreamActivityFeedNewChannelViewerFragment,
  StreamActivityFeedSubscription,
  StreamActivityFeedSubscriptionVariables,
  StreamerChannelActivityEventFilterEventType,
  useStreamActivityFeedHistoryQuery,
  StreamActivityFeedHistoryQuery,
} from '@gen';

gql`
  query StreamActivityFeedHistory(
    $channelId: ID
    $filter: StreamerChannelActivityEventFilterInput
    $cursor: APICursorInput
  ) {
    channelActivityEvents(channelId: $channelId, filter: $filter, cursor: $cursor) {
      events {
        timestamp
        id
        content {
          ...StreamActivityFeedStreamerCardPurchase
          ...StreamActivityFeedNewChannelFollower
          ...StreamActivityFeedNewChannelViewer
          ...StreamActivityFeedNewChannelSubscriber
          ...StreamActivityFeedStreamStateUpdateStarted
          ...StreamActivityFeedStreamStateUpdateEnded
          ...StreamActivityFeedMatchStateUpdateStarted
          ...StreamActivityFeedMatchStateUpdateEnded
          ...StreamActivityFeedNewChannelSubscriptionGifted
          ...StreamActivityFeedStreamInfoUpdateTitleChange
          ...StreamActivityFeedPremiumBundlePurchase
          ...StreamActivityFeedChannelSubscriptionRenewed
          ...StreamActivityFeedHighScoringCard
          ...StreamActivityFeedAvatarItemPurchase
        }
      }

      pageInfo {
        endCursor
        hasPreviousPage
      }
    }
  }

  subscription StreamActivityFeed(
    $after: String
    $channelId: ID
    $filter: StreamerChannelActivityEventFilterInput
  ) {
    channelActivityEventsSubscribe(
      after: $after
      channelId: $channelId
      filter: $filter
    ) {
      timestamp
      id
      content {
        ...StreamActivityFeedStreamerCardPurchase
        ...StreamActivityFeedNewChannelFollower
        ...StreamActivityFeedNewChannelViewer
        ...StreamActivityFeedNewChannelSubscriber
        ...StreamActivityFeedStreamStateUpdateStarted
        ...StreamActivityFeedStreamStateUpdateEnded
        ...StreamActivityFeedMatchStateUpdateStarted
        ...StreamActivityFeedMatchStateUpdateEnded
        ...StreamActivityFeedNewChannelSubscriptionGifted
        ...StreamActivityFeedStreamInfoUpdateTitleChange
        ...StreamActivityFeedPremiumBundlePurchase
        ...StreamActivityFeedChannelSubscriptionRenewed
        ...StreamActivityFeedHighScoringCard
        ...StreamActivityFeedAvatarItemPurchase
      }
    }
  }
`;

const defaultVisibleEvents = [
  StreamerChannelActivityEventFilterEventType.EventTypeBundlePurchased,
  StreamerChannelActivityEventFilterEventType.EventTypeChannelFollowed,
  StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscribed,
  StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscriptionGifted,
  StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscriptionRenewed,
  StreamerChannelActivityEventFilterEventType.EventTypeMatchEnded,
  StreamerChannelActivityEventFilterEventType.EventTypeMatchStarted,
  StreamerChannelActivityEventFilterEventType.EventTypeStreamEnded,
  StreamerChannelActivityEventFilterEventType.EventTypeStreamStarted,
  StreamerChannelActivityEventFilterEventType.EventTypeStreamTitleChanged,
  StreamerChannelActivityEventFilterEventType.EventTypeStreamerCardPurchased,
  StreamerChannelActivityEventFilterEventType.EventTypePlayerJoined,
  StreamerChannelActivityEventFilterEventType.EventTypeHighScoringCardPromoted,
  StreamerChannelActivityEventFilterEventType.EventTypeAvatarItemPurchased,
];

const eventTypenameToFilterMap: Record<
  string,
  StreamerChannelActivityEventFilterEventType
> = {
  ['GameLogicHighScoringCardPromotedMsg']:
    StreamerChannelActivityEventFilterEventType.EventTypeHighScoringCardPromoted,
  ['StreamerStreamStarted']:
    StreamerChannelActivityEventFilterEventType.EventTypeStreamStarted,
  ['StreamerMatchStarted']:
    StreamerChannelActivityEventFilterEventType.EventTypeMatchStarted,
  ['StreamerMatchEnded']: StreamerChannelActivityEventFilterEventType.EventTypeMatchEnded,
  ['StreamerStreamEnded']:
    StreamerChannelActivityEventFilterEventType.EventTypeStreamEnded,
  ['StreamerPlayerJoined']:
    StreamerChannelActivityEventFilterEventType.EventTypePlayerJoined,
  ['StreamerChannelFollowed']:
    StreamerChannelActivityEventFilterEventType.EventTypeChannelFollowed,
  ['StreamerChannelSubscribed']:
    StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscribed,
  ['StreamerSubscriptionGifted']:
    StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscriptionGifted,
  ['StreamerSubscriptionRenewed']:
    StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscriptionRenewed,
  ['StreamerCardPurchased']:
    StreamerChannelActivityEventFilterEventType.EventTypeStreamerCardPurchased,
  ['StreamerBundlePurchased']:
    StreamerChannelActivityEventFilterEventType.EventTypeBundlePurchased,
  ['StreamerAvatarItemPurchased']:
    StreamerChannelActivityEventFilterEventType.EventTypeAvatarItemPurchased,
};

export function ActivityFeed({ streamId }: ChannelWidgetProps) {
  const context = useContext(ActivityFeedSettingsContext);
  const newViewerEventsRef = useRef<StreamActivityFeedSubscription[]>([]);
  const newViewerBatchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const newFollowerEventsRef = useRef<StreamActivityFeedSubscription[]>([]);
  const newFollowersBatchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [hasRefetched, setHasRefetched] = useState<boolean>(false);
  const [activities, setActivities] = useState<StreamActivityFeedSubscription[]>([]);
  const [historicalActivities, setHistoricalActivities] = useState<
    Set<{
      timestamp: string;
      event: NonNullable<
        StreamActivityFeedHistoryQuery['channelActivityEvents']
      >['events'][0];
    }>
  >(new Set());
  const { channelId } = useChannelContext();
  const { setFilters, setSettings } = useWidgetMenu();

  const [visibleEvents = defaultVisibleEvents, setVisibleEvents] =
    useListenStudioLocalStorageValue('activityFeed.filters');

  const {
    data: historicalData,
    fetchMore,
    loading: loadingHistoricalEvents,
  } = useStreamActivityFeedHistoryQuery({
    ...variablesOrSkip({
      channelId,
      filter: { eventTypes: visibleEvents },
      cursor: {
        last: 25,
      },
    }),
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (!data || !data.channelActivityEvents?.events.length) {
        return;
      }

      const events = [...data.channelActivityEvents.events];
      const prevEvents = Array.from(historicalActivities);
      const mergedEvents: {
        timestamp: string;
        event: NonNullable<
          StreamActivityFeedHistoryQuery['channelActivityEvents']
        >['events'][0];
      }[] = [];

      [...events, ...prevEvents].forEach((event) =>
        mergedEvents.push({
          timestamp: event.timestamp,
          event: event as NonNullable<
            StreamActivityFeedHistoryQuery['channelActivityEvents']
          >['events'][0],
        }),
      );

      mergedEvents.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });

      setHistoricalActivities(new Set(mergedEvents));
      return;
    },
  });

  const handleFetchNextHistoricalData = useCallback(async () => {
    if (
      !loadingHistoricalEvents &&
      historicalData?.channelActivityEvents?.pageInfo.hasPreviousPage
    ) {
      const last = historicalData?.channelActivityEvents?.pageInfo.endCursor;
      setHasRefetched(true);

      await fetchMore({
        variables: {
          cursor: {
            before: last,
          },
        },
      });

      setHasRefetched(false);
    }
  }, [
    loadingHistoricalEvents,
    fetchMore,
    historicalData?.channelActivityEvents?.pageInfo,
  ]);

  const { data } = useRestartingSubscription<
    StreamActivityFeedSubscription,
    StreamActivityFeedSubscriptionVariables
  >(StreamActivityFeedDocument, {
    ...variablesOrSkip({
      channelId,
      filter: { eventTypes: visibleEvents },
    }),
  });

  useEffect(() => {
    const filters = (
      <ActivityFeedFilters
        key={`${WidgetId.ActivityFeed}-${streamId}-filters`}
        setVisibleEvents={setVisibleEvents}
        visibleEvents={visibleEvents}
      />
    );

    const settings = (
      <ActivityFeedSettings key={`${WidgetId.ActivityFeed}-${streamId}-settings`} />
    );

    setFilters(filters);
    setSettings(settings);
  }, [setFilters, setSettings, setVisibleEvents, streamId, visibleEvents]);

  /*
   It is possible that the player join events can flood the activity feed.
   To prevent this, we batch the player join events and display them as a single event.
   When a GameLogicPlayerJoinedMsg event is received, we start the timer and send any GameLogicPlayerJoinedMsg
   events to the newViewerEvents ref. When the timer is up, we send the batched events to the activity feed.
  */
  const handleNewViewerBatching = useCallback(() => {
    if (!newViewerBatchTimeoutRef.current || !newViewerEventsRef.current.length) {
      newViewerBatchTimeoutRef.current = setTimeout(() => {
        const latestViewerData = newViewerEventsRef.current.at(-1);

        if (!latestViewerData || !latestViewerData.channelActivityEventsSubscribe) {
          return;
        }

        const profiles = newViewerEventsRef.current.map(
          (viewer) =>
            (
              viewer.channelActivityEventsSubscribe
                ?.content as StreamActivityFeedNewChannelViewerFragment
            )?.viewer,
        );

        const newViewerActivity = {
          ...latestViewerData,
          channelActivityEventsSubscribe: {
            ...latestViewerData.channelActivityEventsSubscribe,
            content: {
              ...(latestViewerData.channelActivityEventsSubscribe
                ?.content as StreamActivityFeedNewChannelViewerFragment),
              viewers: profiles,
            },
            id: latestViewerData.channelActivityEventsSubscribe.id,
            timestamp:
              latestViewerData.channelActivityEventsSubscribe.timestamp ??
              new Date().toISOString(),
          },
        };

        setActivities((prev) => [...prev, newViewerActivity]);

        // Cleanup
        newViewerBatchTimeoutRef.current = null;
        newViewerEventsRef.current = [];
      }, 10 * 1000);
    }
  }, []);

  const handleNewFollowerBatching = useCallback(() => {
    if (!newFollowersBatchTimeoutRef.current || !newFollowerEventsRef.current.length) {
      newFollowersBatchTimeoutRef.current = setTimeout(() => {
        const latestFollowerData = newFollowerEventsRef.current.at(-1);

        if (!latestFollowerData || !latestFollowerData.channelActivityEventsSubscribe) {
          return;
        }

        const profiles = newFollowerEventsRef.current.map(
          (follower) =>
            (
              follower.channelActivityEventsSubscribe
                ?.content as StreamActivityFeedNewChannelFollowerFragment
            )?.follower,
        );

        const newFollowerActivity = {
          ...latestFollowerData,
          channelActivityEventsSubscribe: {
            ...latestFollowerData.channelActivityEventsSubscribe,
            content: {
              ...(latestFollowerData.channelActivityEventsSubscribe
                ?.content as StreamActivityFeedNewChannelFollowerFragment),
              followers: profiles,
            },
            id: latestFollowerData.channelActivityEventsSubscribe.id,
            timestamp:
              latestFollowerData.channelActivityEventsSubscribe.timestamp ??
              new Date().toISOString(),
          },
        };

        setActivities((prev) => [...prev, newFollowerActivity]);

        // Cleanup
        newFollowersBatchTimeoutRef.current = null;
        newFollowerEventsRef.current = [];
      }, 10 * 1000);
    }
  }, []);

  useEffect(() => {
    if (data) {
      const { content } = data.channelActivityEventsSubscribe ?? {};

      if (
        content?.__typename === 'StreamerPlayerJoined' &&
        !newViewerEventsRef.current.includes(data)
      ) {
        handleNewViewerBatching();
        newViewerEventsRef.current = [data, ...newViewerEventsRef.current];
        return;
      }

      if (content?.__typename === 'StreamerChannelFollowed') {
        handleNewFollowerBatching();
        newFollowerEventsRef.current = [data, ...newFollowerEventsRef.current];
        return;
      }

      setActivities((prev) => [...prev, data]);
    }

    return () => {
      if (newViewerBatchTimeoutRef.current) {
        clearTimeout(newViewerBatchTimeoutRef.current);
      }

      if (newFollowersBatchTimeoutRef.current) {
        clearTimeout(newFollowersBatchTimeoutRef.current);
      }
    };
  }, [data, handleNewFollowerBatching, handleNewViewerBatching]);

  const filteredActivities = activities.filter((activity) => {
    const typename = activity.channelActivityEventsSubscribe?.content?.__typename;

    return typename && visibleEvents.includes(eventTypenameToFilterMap[typename]);
  });

  const filteredHistoricalActivities = Array.from(historicalActivities).filter(
    (activity) => {
      const typename = activity?.event.content?.__typename;

      return typename && visibleEvents.includes(eventTypenameToFilterMap[typename]);
    },
  );

  return (
    <WidgetScrollWrapper
      className={styles.activityFeedWrapper}
      items={filteredActivities}
      label="Activity Feed"
      latestItemDirection={context?.direction}
      preventScrollToNewItems={hasRefetched}
      onScrollToEnd={handleFetchNextHistoricalData}
    >
      {filteredActivities.length || filteredHistoricalActivities.length ? (
        <>
          {context?.direction === 'bottom' && loadingHistoricalEvents && (
            <div className={styles.loadingWrapper}>
              <LoadingSpinner size="sm" />
            </div>
          )}

          <ul
            className={classNames(
              styles.activityFeedList,
              styles[context?.direction || 'top'],
            )}
          >
            {filteredHistoricalActivities.map((activity, index) => (
              <ActivityListItem
                data={activity?.event}
                key={`${activity.event.id}-${index}`}
              />
            ))}

            {filteredActivities.map((activity, index) => (
              <ActivityListItem
                data={activity.channelActivityEventsSubscribe}
                key={`${activity.channelActivityEventsSubscribe?.id}-${index}`}
              />
            ))}
          </ul>

          {context?.direction === 'top' && loadingHistoricalEvents && (
            <div className={styles.loadingWrapper}>
              <LoadingSpinner size="sm" />
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </WidgetScrollWrapper>
  );
}
