import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, Icon, Image } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../../ActivityFeedSettingsProvider';
import { ActivityItemData } from '../../types';
import styles from '../ActivityListItem/ActivityListItem.module.css';
import { EventTimestamp } from '../EventTimestamp/EventTimestamp';
import { EventUserBadges } from '../EventUserBadges/EventUserBadges';

gql`
  fragment MatchResultsBestTeam on StreamerMatchEnded {
    bestGroup {
      group {
        id
        name
        points
      }

      players {
        id
        points
        user {
          avatars {
            avatar2D
          }
          userTag
          userId
          preferredColor
          badges {
            ...UserBadge
          }
        }
      }
    }
  }
`;

export function MatchResultsBestTeam({ data }: ActivityItemData) {
  const context = useContext(ActivityFeedSettingsContext);

  if (data?.content?.__typename !== 'StreamerMatchEnded' || !context) {
    return null;
  }

  const {
    content: { bestGroup },
  } = data;

  if (!bestGroup) {
    return null;
  }

  return (
    <>
      <Icon
        className={styles.eventIcon}
        color="status-alert-main"
        icon={CoreAssets.Icons.Crown}
        size={16}
      />

      <span className={styles.eventType}>Match results - Best team</span>

      <EventTimestamp timestamp={data.timestamp} />

      <span className={styles.bestTeamName}>{bestGroup.group.name}</span>
      <span className={classNames(styles.pointsMain, styles.bestTeamPoints)}>
        {bestGroup.group.points}
      </span>

      <ul className={styles.bestTeamPlayersList}>
        {bestGroup.players.map((player) => (
          <li
            className={styles.bestTeamPlayersListItem}
            key={player.id}
          >
            <div>
              <EventUserBadges badges={player.user.badges} />
              <span className={styles.bestTeamPlayerUsername}>
                <span
                  style={{
                    color: CommonUtils.getUserIdColor({
                      preferredColor: player.user.preferredColor,
                      userId: player.user.userId,
                    }),
                  }}
                >
                  {player.user.userTag}
                </span>
              </span>
            </div>
            <span className={styles.pointsSecondary}>{player.points}</span>
          </li>
        ))}
      </ul>

      <div className={styles.bestTeamAvatarsWrapper}>
        {bestGroup.players.map((player) => (
          <div
            className={styles.bestTeamAvatarsWrapper}
            key={player.id}
          >
            <div className={styles.bestTeamPlayerAvatarWrapper}>
              <Image
                alt={player.user.userTag}
                className={styles.bestTeamPlayerAvatar}
                src={player.user.avatars?.avatar2D}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
