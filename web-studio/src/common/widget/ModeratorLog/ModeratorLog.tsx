import { CoreAssets } from '@noice-com/assets-core';
import { LoadingSpinner, Button, usePopoverMenu } from '@noice-com/common-ui';
import { useCallback, useLayoutEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import { WidgetId } from '../types';

import { useChannelModerationEvents } from './hooks/useChannelModerationEvents.hook';
import { ModerationLogEvent } from './ModerationLogEvent';
import { ModerationLogFilter } from './ModerationLogFilter';
import styles from './ModeratorLog.module.css';
import { groupedFilterTypes } from './util';

import { useChannelContext } from '@common/channel';
import { AutoScrollWrapper } from '@common/scroll';

export function ModeratorLog() {
  const popover = usePopoverMenu({ placement: 'top-end' });
  const { toggle } = popover.actions;

  const { channelId } = useChannelContext();
  const [eventTypes, setEventTypes] = useState(Object.values(groupedFilterTypes).flat());
  const [filters, setFilters] = useState(Object.keys(groupedFilterTypes));
  const [previousFirstElement, setPreviousFirstElement] = useState<string>();
  const { events, hasPrevious, fetchPrevious, loading } = useChannelModerationEvents(
    channelId,
    eventTypes,
  );

  const handleToggleFilter = useCallback(
    (filter: string) => {
      const enabled = filters.includes(filter)
        ? [...filters].filter((value) => value !== filter)
        : [...filters, filter];
      setFilters(enabled);
      setEventTypes(enabled.map((filter) => groupedFilterTypes[filter]).flat());
    },
    [filters],
  );

  const handleFetchPrevious = useCallback(() => {
    setPreviousFirstElement(events?.[0]?.id);
    fetchPrevious();
  }, [events, fetchPrevious]);

  /**
   * After adding previous items from history, we want to scroll back to the position
   * where we were before fetching. This seems not being 100% proof right now, as some times
   * we scrollIntoView before new DOM elements are added. :/
   */
  useLayoutEffect(() => {
    if (!previousFirstElement) {
      return;
    }

    const goto = document.getElementById(previousFirstElement);

    if (!goto) {
      return;
    }

    goto.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setPreviousFirstElement(undefined);
  }, [events.length, previousFirstElement]);

  const latestEvent = events.length ? events[events.length - 1] : null;

  return (
    <div className={styles.wrapper}>
      <AutoScrollWrapper
        ariaLabel="Moderator log window"
        itemName="event"
        itemsAmount={events.length}
        triggerValue={latestEvent}
      >
        {loading ? (
          <div className={styles.loadingWrapper}>
            <LoadingSpinner />
          </div>
        ) : hasPrevious === false ? (
          <div className={styles.start}>
            <span className={styles.startText}>Log start</span>
          </div>
        ) : (
          <div className={styles.fetchPreviousButton}>
            <Button
              iconStart={FaArrowUp}
              level="secondary"
              size="sm"
              onClick={handleFetchPrevious}
            >
              Fetch earlier
            </Button>
          </div>
        )}
        {events.map((event) => (
          <ModerationLogEvent
            key={event.id}
            {...event}
          />
        ))}
      </AutoScrollWrapper>

      <div className={styles.bottomSettings}>
        <Button
          iconStart={CoreAssets.Icons.Filter}
          level="secondary"
          ref={popover.state.popoverMenuTriggerRef}
          size="sm"
          onClick={toggle}
        >
          Filters
        </Button>

        <ModerationLogFilter
          popover={popover}
          values={filters}
          onToggleFilter={handleToggleFilter}
        />
      </div>
    </div>
  );
}

export default {
  id: WidgetId.ModeratorLog,
  Component: ModeratorLog,
} as const;
