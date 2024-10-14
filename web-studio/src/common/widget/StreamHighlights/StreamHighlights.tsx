import { MountTransition } from '@noice-com/common-ui';
import { useState } from 'react';

import { LiveChannelWidgetProps, WidgetOfflineCheck, WidgetId } from '../types';

import { FiltersMenu } from './FiltersMenu/FiltersMenu';
import {
  StreamMatchEvent,
  StreamMatchEvents,
  useStreamEvents,
} from './hooks/useStreamEvents.hook';
import { MatchEnded } from './MatchEnded/MatchEnded';
import { MatchStarted } from './MatchStarted/MatchStarted';
import { NewFollower } from './NewFollower/NewFollower';
import { NewGiftSubscription } from './NewGiftSubscription/NewGiftSubscription';
import { NewHighScoringCard } from './NewHighScoringCard/NewHighScoringCard';
import { NewSubscriber } from './NewSubscriber/NewSubscriber';
import styles from './StreamHighlights.module.css';

import { useChannelContext } from '@common/channel';
import { EffectsVolumeControl } from '@common/volume';
import { StreamerStreamEventFilterEventType } from '@gen';

type Props = LiveChannelWidgetProps;

function renderStateByStreamEvent<T extends StreamMatchEvent>(
  event: T | undefined,
  index = 0,
) {
  if (!event) {
    return;
  }

  switch (event.__typename) {
    case 'GameLogicMatchEndedMsg':
      return <MatchEnded {...event} />;

    case 'GameLogicMatchStartedMsg':
      return <MatchStarted timestamp={event.timestamp} />;

    case 'GameLogicHighScoringCardPromotedMsg': {
      return index ? (
        <NewHighScoringCard.ListView {...event} />
      ) : (
        <MountTransition
          duration="--noi-duration-quick"
          transitionClassName={styles.showExpandedEvent}
          isShown
        >
          <div className={styles.expandedEventWrapper}>
            <div className={styles.hideEventOverflow}>
              <NewHighScoringCard {...event} />
            </div>
          </div>
        </MountTransition>
      );
    }
    case 'StreamerChannelFollowed':
      return index ? (
        <NewFollower.ListView {...event} />
      ) : (
        <MountTransition
          duration="--noi-duration-quick"
          transitionClassName={styles.showExpandedEvent}
          isShown
        >
          <div className={styles.expandedEventWrapper}>
            <div className={styles.hideEventOverflow}>
              <NewFollower {...event} />
            </div>
          </div>
        </MountTransition>
      );

    case 'StreamerChannelSubscribed':
      return index ? (
        <NewSubscriber.ListView {...event} />
      ) : (
        <MountTransition
          duration="--noi-duration-quick"
          transitionClassName={styles.showExpandedEvent}
          isShown
        >
          <div className={styles.expandedEventWrapper}>
            <div className={styles.hideEventOverflow}>
              <NewSubscriber {...event} />
            </div>
          </div>
        </MountTransition>
      );

    case 'StreamerSubscriptionGifted':
      return index ? (
        <NewGiftSubscription.ListView {...event} />
      ) : (
        <MountTransition
          duration="--noi-duration-quick"
          transitionClassName={styles.showExpandedEvent}
          isShown
        >
          <div className={styles.expandedEventWrapper}>
            <div className={styles.hideEventOverflow}>
              <NewGiftSubscription {...event} />
            </div>
          </div>
        </MountTransition>
      );
  }
}

const defaultMatchEvents = ['GameLogicMatchStartedMsg', 'GameLogicMatchEndedMsg'];
const defaultEventFilters: StreamerStreamEventFilterEventType[] = [
  StreamerStreamEventFilterEventType.EventTypeChannelFollowed,
  StreamerStreamEventFilterEventType.EventTypeChannelSubscribed,
  StreamerStreamEventFilterEventType.EventTypeHighScoringCardPromoted,
  StreamerStreamEventFilterEventType.EventTypeChannelSubscriptionGifted,
];

const eventToFilterMap: Partial<
  Record<NonNullable<StreamMatchEvents['__typename']>, StreamerStreamEventFilterEventType>
> = {
  ['GameLogicHighScoringCardPromotedMsg']:
    StreamerStreamEventFilterEventType.EventTypeHighScoringCardPromoted,
  ['StreamerChannelFollowed']:
    StreamerStreamEventFilterEventType.EventTypeChannelFollowed,
  ['StreamerChannelSubscribed']:
    StreamerStreamEventFilterEventType.EventTypeChannelSubscribed,
  ['StreamerSubscriptionGifted']:
    StreamerStreamEventFilterEventType.EventTypeChannelSubscriptionGifted,
};

function StreamHighlightsWidget({ streamId }: Props) {
  const { channelId } = useChannelContext();
  const [eventFilters, setEventFilters] =
    useState<StreamerStreamEventFilterEventType[]>(defaultEventFilters);

  const { events } = useStreamEvents(channelId, streamId, defaultEventFilters);

  function handleFilterToggle(filter: StreamerStreamEventFilterEventType) {
    if (eventFilters.includes(filter)) {
      setEventFilters(eventFilters.filter((f) => f !== filter));
      return;
    }

    setEventFilters([...eventFilters, filter]);
  }

  return (
    <section
      aria-label="Stream highlights"
      className={styles.spotlightWrapper}
    >
      <div className={styles.spotlightEventsContainer}>
        <ul className={styles.spotlightEventsList}>
          {events
            .filter((streamEvent) => {
              // When event filters are toggled, we want to toggle any existing event UI as well.
              const eventType = streamEvent.__typename;
              if (!eventType) {
                return;
              }

              if (defaultMatchEvents.includes(eventType)) {
                // Ensure we always return match start/end events
                return streamEvent;
              }

              // exclude any events that are not active in the filters list
              const eventFilterType = eventToFilterMap[eventType];
              if (!eventFilterType || !eventFilters.includes(eventFilterType)) {
                return;
              }

              // return enabled event to the UI
              return streamEvent;
            })
            .map((event, index) => (
              <li
                className={styles.spotlightEventListItem}
                key={event.timestamp.toString()}
              >
                {renderStateByStreamEvent(event, index)}
              </li>
            ))}
        </ul>
      </div>
      <div className={styles.spotlightControlsContainer}>
        <EffectsVolumeControl />
        <FiltersMenu
          filters={eventFilters}
          handleToggleFilter={handleFilterToggle}
        />
      </div>
    </section>
  );
}

export default {
  offline: ({ streamId, isNoicePredictionsEnabled }: WidgetOfflineCheck) => {
    if (streamId && isNoicePredictionsEnabled) {
      return null;
    }

    if (!isNoicePredictionsEnabled) {
      return {
        title: 'Noice Predictions is disabled',
        description:
          'Stream Highlights shows interesting events that are happening with the audience like high scoring cards.',
      };
    }

    return {
      title: 'Waiting for a match to start',
      description:
        'Stream Highlights shows interesting events that are happening with the audience like high scoring cards.',
    };
  },
  id: WidgetId.StreamHighlights,
  Component: StreamHighlightsWidget,
} as const;
