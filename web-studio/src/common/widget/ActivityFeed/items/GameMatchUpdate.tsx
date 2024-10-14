import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import { ActivityItemData } from '../types';

import styles from './ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from './EventTimestamp/EventTimestamp';

gql`
  fragment StreamActivityFeedMatchStateUpdateStarted on StreamerMatchStarted {
    streamId
  }

  fragment StreamActivityFeedMatchStateUpdateEnded on StreamerMatchEnded {
    streamId
    ...MatchResultsBestPlayer
    ...MatchResultsBestPlay
    ...MatchResultsBestTeam
    ...MatchResultsChallenges
  }
`;

export function GameMatchUpdate({ data }: ActivityItemData) {
  if (
    data?.content?.__typename !== 'StreamerMatchStarted' &&
    data?.content?.__typename !== 'StreamerMatchEnded'
  ) {
    return null;
  }

  const { content } = data;

  const hasStarted = content.__typename === 'StreamerMatchStarted';

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color={hasStarted ? 'green-main' : 'status-error-main'}
        icon={
          hasStarted ? CoreAssets.Icons.ArrowFromLeftLine : CoreAssets.Icons.ArrowToRight
        }
        size={16}
      />

      <span className={styles.eventType}>Stream event</span>

      <EventTimestamp timestamp={data.timestamp} />

      <div className={styles.eventDescription}>
        {hasStarted ? 'Match started' : 'Match ended'}
      </div>
    </>
  );
}
