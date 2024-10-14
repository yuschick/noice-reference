import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import { ActivityItemData } from '../types';

import styles from './ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from './EventTimestamp/EventTimestamp';

gql`
  fragment StreamActivityFeedStreamStateUpdateStarted on StreamerStreamStarted {
    streamId
  }

  fragment StreamActivityFeedStreamStateUpdateEnded on StreamerStreamEnded {
    streamId
  }
`;

export function StreamStateUpdate({ data }: ActivityItemData) {
  if (
    data?.content?.__typename !== 'StreamerStreamStarted' &&
    data?.content?.__typename !== 'StreamerStreamEnded'
  ) {
    return null;
  }
  const { content } = data;

  const hasStarted = content.__typename === 'StreamerStreamStarted';

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color={hasStarted ? 'green-main' : 'status-error-main'}
        icon={CoreAssets.Icons.Broadcast}
        size={16}
      />

      <span className={styles.eventType}>Stream event</span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        {hasStarted ? 'Stream started' : 'Stream ended'}
      </div>
    </>
  );
}
