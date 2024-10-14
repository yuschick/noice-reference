import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { parseChallengeDescription } from '@noice-com/card-game/';
import { Icon } from '@noice-com/common-ui';
import { CSSProperties, useContext } from 'react';

import { ActivityFeedSettingsContext } from '../../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../../types';
import styles from '../ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from '../EventTimestamp/EventTimestamp';

import { GameLogicChallengeState, useActivityFeedChallengeDescriptionsQuery } from '@gen';

gql`
  fragment MatchResultsChallenges on StreamerMatchEnded {
    challengeStatuses {
      challengeId
      pickRate
      challengeState
      targetValues {
        label
        value
        selector {
          attribute
          value {
            __typename
          }
        }
      }
    }
  }

  fragment ActivityFeedChallenge on GameLogicChallenge {
    id
    description
    targetValues {
      label
      value
      selector {
        attribute
        value {
          __typename
        }
      }
    }
  }
  query ActivityFeedChallengeDescriptions($challengeIds: [String!]!) {
    challengesBatch(challengeIds: $challengeIds) {
      challenges {
        ...ActivityFeedChallenge
      }
    }
  }
`;

export function MatchResultsChallenges({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  const { challengeStatuses = [] } =
    data?.content?.__typename === 'StreamerMatchEnded' ? data.content : {};
  const challengeIds = challengeStatuses?.map((challenge) => challenge.challengeId) ?? [];

  const { data: challengeDescriptions } = useActivityFeedChallengeDescriptionsQuery({
    ...variablesOrSkip({ challengeIds }),
  });

  if (data?.content?.__typename !== 'StreamerMatchEnded' || !context) {
    return null;
  }

  if (!challengeStatuses) {
    return null;
  }

  const challengeData = challengeDescriptions?.challengesBatch?.challenges ?? [];

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color="text-light"
        icon={CoreAssets.Icons.Landscape}
        size={16}
      />

      <span className={styles.eventType}>Match Challenge - Results</span>

      <EventTimestamp timestamp={data.timestamp} />

      <ul className={styles.challengesList}>
        {challengeStatuses.map((challenge) => {
          const percentage =
            challenge.pickRate !== undefined ? Math.floor(challenge.pickRate * 100) : 0;
          const data = challengeData.find((c) => c.id === challenge.challengeId);
          const targetValues = data?.targetValues ?? [];
          const description = parseChallengeDescription(
            data?.description ?? '',
            targetValues,
          );

          return (
            <li
              className={styles.challengeItem}
              key={challenge.challengeId}
              style={
                {
                  '--_pick-rate-progress-percentage': `${percentage}%`,
                } as CSSProperties
              }
            >
              <span className={styles.pickRate}>{percentage}%</span>
              <p>{description}</p>
              <div className={styles.challengeState}>
                {challenge.challengeState ===
                GameLogicChallengeState.ChallengeStateSuccess ? (
                  <span className={styles.success}>Success</span>
                ) : (
                  <span className={styles.fail}>Fail</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
