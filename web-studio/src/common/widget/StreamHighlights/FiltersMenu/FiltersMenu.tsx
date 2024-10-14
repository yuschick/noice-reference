import { Checkbox, Icon } from '@noice-com/common-ui';
import { useId, useRef, useState } from 'react';
import { BiFilterAlt } from 'react-icons/bi';

import styles from './FiltersMenu.module.css';

import { Popout } from '@common/popout';
import { StreamerStreamEventFilterEventType } from '@gen';

type Props = {
  filters: StreamerStreamEventFilterEventType[];
  handleToggleFilter: (filter: StreamerStreamEventFilterEventType) => void;
};

export function FiltersMenu({ filters, handleToggleFilter }: Props) {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  return (
    <>
      <button
        className={styles.filtersMenuButton}
        ref={triggerButtonRef}
        type="button"
        onClick={() => setShowPopover(!showPopover)}
      >
        <span>Filters</span>
        <Icon icon={BiFilterAlt} />
      </button>

      <Popout
        anchor={triggerButtonRef}
        id={id}
        isOpen={showPopover}
        placement="top-end"
        onOutsideClickCallback={() => setShowPopover(false)}
      >
        <div className={styles.filtersListContainer}>
          <h3 className={styles.filtersListHeading}>Events</h3>

          <Checkbox
            checked={filters.includes(
              StreamerStreamEventFilterEventType.EventTypeChannelFollowed,
            )}
            label="New Followers"
            name="event-filters"
            value={StreamerStreamEventFilterEventType.EventTypeChannelFollowed}
            onChange={() =>
              handleToggleFilter(
                StreamerStreamEventFilterEventType.EventTypeChannelFollowed,
              )
            }
          />

          <Checkbox
            checked={filters.includes(
              StreamerStreamEventFilterEventType.EventTypeChannelSubscribed,
            )}
            label="New Subscribers"
            name="event-filters"
            value={StreamerStreamEventFilterEventType.EventTypeChannelSubscribed}
            onChange={() =>
              handleToggleFilter(
                StreamerStreamEventFilterEventType.EventTypeChannelSubscribed,
              )
            }
          />

          <Checkbox
            checked={filters.includes(
              StreamerStreamEventFilterEventType.EventTypeChannelSubscriptionGifted,
            )}
            label="New Gift Subscriptions"
            name="event-filters"
            value={StreamerStreamEventFilterEventType.EventTypeChannelSubscriptionGifted}
            onChange={() =>
              handleToggleFilter(
                StreamerStreamEventFilterEventType.EventTypeChannelSubscriptionGifted,
              )
            }
          />

          <Checkbox
            checked={filters.includes(
              StreamerStreamEventFilterEventType.EventTypeHighScoringCardPromoted,
            )}
            label="High Scoring Cards"
            name="event-filters"
            value={StreamerStreamEventFilterEventType.EventTypeHighScoringCardPromoted}
            onChange={() =>
              handleToggleFilter(
                StreamerStreamEventFilterEventType.EventTypeHighScoringCardPromoted,
              )
            }
          />
        </div>
      </Popout>
    </>
  );
}
