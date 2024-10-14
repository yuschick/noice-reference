import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import { ActivityItemData } from '../types';

import styles from './ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from './EventTimestamp/EventTimestamp';

gql`
  fragment StreamActivityFeedStreamInfoUpdateTitleChange on StreamerStreamTitleChanged {
    title
  }
`;

export function StreamInfoUpdate({ data }: ActivityItemData) {
  if (data?.content?.__typename !== 'StreamerStreamTitleChanged') {
    return null;
  }
  const { content } = data;

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color={'text-light'}
        icon={CoreAssets.Icons.Info}
        size={16}
      />

      <span className={styles.eventType}>Stream info</span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        Stream title updated
        <span className={styles.eventDescriptionSecondary}>{content.title}</span>
      </div>
    </>
  );
}
