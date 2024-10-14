import { Checkbox, useAnalytics } from '@noice-com/common-ui';
import {
  AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity,
  AnalyticsEventStudioActivityFeedFiltersActivityFeedFiltersState,
} from '@noice-com/schemas/analytics/analytics.pb';

import { WidgetFilters } from '../WidgetFilters';

import styles from './ActivityFeed.module.css';

import { useChannelContext } from '@common/channel';
import { StreamerChannelActivityEventFilterEventType } from '@gen';

interface Props {
  visibleEvents: StreamerChannelActivityEventFilterEventType[];
  setVisibleEvents: (events: StreamerChannelActivityEventFilterEventType[]) => void;
}

const eventToAnalyticsEnum: Partial<
  Record<
    StreamerChannelActivityEventFilterEventType,
    AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity
  >
> = {
  [StreamerChannelActivityEventFilterEventType.EventTypeHighScoringCardPromoted]:
    AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity.ACTIVITY_FEED_FILTER_ACTIVITY_HIGH_SCORING_CARDS,
  [StreamerChannelActivityEventFilterEventType.EventTypeStreamStarted]:
    AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity.ACTIVITY_FEED_FILTER_ACTIVITY_STREAM_AND_MATCH,
  [StreamerChannelActivityEventFilterEventType.EventTypePlayerJoined]:
    AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity.ACTIVITY_FEED_FILTER_ACTIVITY_NEW_VIEWERS,
  [StreamerChannelActivityEventFilterEventType.EventTypeChannelFollowed]:
    AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity.ACTIVITY_FEED_FILTER_ACTIVITY_NEW_FOLLOWERS,
  [StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscribed]:
    AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity.ACTIVITY_FEED_FILTER_ACTIVITY_SUBSCRIPTIONS,
  [StreamerChannelActivityEventFilterEventType.EventTypeStreamerCardPurchased]:
    AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity.ACTIVITY_FEED_FILTER_ACTIVITY_PURCHASES,
};

export function ActivityFeedFilters({ visibleEvents, setVisibleEvents }: Props) {
  const { channelId } = useChannelContext();
  const { trackEvent } = useAnalytics();

  const handleToggledEvent = (event: StreamerChannelActivityEventFilterEventType) => {
    const eventsGroup: StreamerChannelActivityEventFilterEventType[] = [];
    const activity = eventToAnalyticsEnum[event];

    if (event === StreamerChannelActivityEventFilterEventType.EventTypeStreamStarted) {
      eventsGroup.push(
        StreamerChannelActivityEventFilterEventType.EventTypeStreamStarted,
        StreamerChannelActivityEventFilterEventType.EventTypeStreamEnded,
      );
    }

    if (event === StreamerChannelActivityEventFilterEventType.EventTypeMatchStarted) {
      eventsGroup.push(
        StreamerChannelActivityEventFilterEventType.EventTypeMatchStarted,
        StreamerChannelActivityEventFilterEventType.EventTypeMatchEnded,
      );
    }

    if (
      event === StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscribed
    ) {
      eventsGroup.push(
        StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscribed,
        StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscriptionGifted,
        StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscriptionRenewed,
      );
    }

    if (
      event === StreamerChannelActivityEventFilterEventType.EventTypeStreamerCardPurchased
    ) {
      eventsGroup.push(
        StreamerChannelActivityEventFilterEventType.EventTypeStreamerCardPurchased,
        StreamerChannelActivityEventFilterEventType.EventTypeBundlePurchased,
        StreamerChannelActivityEventFilterEventType.EventTypeAvatarItemPurchased,
      );
    }

    const newEvents = visibleEvents.includes(event)
      ? eventsGroup.length
        ? visibleEvents.filter((e) => !eventsGroup.includes(e))
        : visibleEvents.filter((e) => e !== event)
      : eventsGroup.length
      ? [...visibleEvents, ...eventsGroup]
      : [...visibleEvents, event];

    trackEvent({
      clientStudioWidgetActivityFeedFilter: {
        activity,
        channelId,
        option: visibleEvents.includes(event)
          ? AnalyticsEventStudioActivityFeedFiltersActivityFeedFiltersState.ACTIVITY_FEED_FILTERS_STATE_OFF
          : AnalyticsEventStudioActivityFeedFiltersActivityFeedFiltersState.ACTIVITY_FEED_FILTERS_STATE_ON,
      },
    });

    setVisibleEvents(newEvents);
  };

  return (
    <WidgetFilters>
      <div className={styles.menuWrapper}>
        <div className={styles.settingsTitle}>Activity Feed Filters</div>

        <div className={styles.groupWrapper}>
          <div className={styles.settingsSecondaryValue}>Events</div>

          <section className={styles.group}>
            <Checkbox
              checked={visibleEvents.includes(
                StreamerChannelActivityEventFilterEventType.EventTypeStreamStarted,
              )}
              label="Stream start/end events"
              name="events"
              value={StreamerChannelActivityEventFilterEventType.EventTypeStreamStarted}
              onChange={() =>
                handleToggledEvent(
                  StreamerChannelActivityEventFilterEventType.EventTypeStreamStarted,
                )
              }
            />
            <Checkbox
              checked={visibleEvents.includes(
                StreamerChannelActivityEventFilterEventType.EventTypeMatchStarted,
              )}
              label="Match start/end events"
              name="events"
              value={StreamerChannelActivityEventFilterEventType.EventTypeMatchStarted}
              onChange={() =>
                handleToggledEvent(
                  StreamerChannelActivityEventFilterEventType.EventTypeMatchStarted,
                )
              }
            />
            <Checkbox
              checked={visibleEvents.includes(
                StreamerChannelActivityEventFilterEventType.EventTypePlayerJoined,
              )}
              label="New viewers"
              name="events"
              value={StreamerChannelActivityEventFilterEventType.EventTypePlayerJoined}
              onChange={() =>
                handleToggledEvent(
                  StreamerChannelActivityEventFilterEventType.EventTypePlayerJoined,
                )
              }
            />
            <Checkbox
              checked={visibleEvents.includes(
                StreamerChannelActivityEventFilterEventType.EventTypeChannelFollowed,
              )}
              label="Followers"
              name="events"
              value={StreamerChannelActivityEventFilterEventType.EventTypeChannelFollowed}
              onChange={() =>
                handleToggledEvent(
                  StreamerChannelActivityEventFilterEventType.EventTypeChannelFollowed,
                )
              }
            />
            <Checkbox
              checked={visibleEvents.includes(
                StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscribed,
              )}
              label="Subscriptions"
              name="events"
              value={
                StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscribed
              }
              onChange={() =>
                handleToggledEvent(
                  StreamerChannelActivityEventFilterEventType.EventTypeChannelSubscribed,
                )
              }
            />
            <Checkbox
              checked={visibleEvents.includes(
                StreamerChannelActivityEventFilterEventType.EventTypeStreamerCardPurchased,
              )}
              label="Store purchases"
              name="events"
              value={
                StreamerChannelActivityEventFilterEventType.EventTypeStreamerCardPurchased
              }
              onChange={() =>
                handleToggledEvent(
                  StreamerChannelActivityEventFilterEventType.EventTypeStreamerCardPurchased,
                )
              }
            />
            <Checkbox
              checked={visibleEvents.includes(
                StreamerChannelActivityEventFilterEventType.EventTypeHighScoringCardPromoted,
              )}
              label="High scoring cards"
              name="events"
              value={
                StreamerChannelActivityEventFilterEventType.EventTypeHighScoringCardPromoted
              }
              onChange={() =>
                handleToggledEvent(
                  StreamerChannelActivityEventFilterEventType.EventTypeHighScoringCardPromoted,
                )
              }
            />
          </section>
        </div>
      </div>
    </WidgetFilters>
  );
}
