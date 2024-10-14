import { gql } from '@apollo/client';
import { RankNumber } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './LeaderboardItem.module.css';

import { useLeaderboardItemPlayersQuery } from '@game-gen';
import { GroupProps } from '@game-types';

gql`
  query LeaderboardItemPlayers($playerIds: [String!]!) {
    profileBatch(userIds: $playerIds) {
      profiles {
        userId
        userTag
        avatars {
          avatar2D
        }
      }
    }
  }
`;

const sortDescendingByScore = <Obj extends { score: number }>(a: Obj, b: Obj) =>
  b.score - a.score;

export interface Props {
  group: GroupProps;
  /** @default 'collapsed' */
  variant?: 'collapsed' | 'scoreboard';
}

export function LeaderboardItem({ group, variant = 'collapsed' }: Props) {
  const { groupName, playerData, own, rank, score } = group;

  const displayGroupName = groupName === '' ? 'Mystery Group' : groupName;
  const playerIds = playerData.map((player) => player.playerId);

  const { data } = useLeaderboardItemPlayersQuery({
    variables: {
      playerIds,
    },
    skip: !playerIds.length,
  });

  const playerProfiles = data?.profileBatch?.profiles ?? [];
  const playerProfilesWithScore = playerProfiles
    .map((profile) => ({
      ...profile,
      score: playerData.find(({ playerId }) => playerId === profile.userId)?.score || 0,
    }))
    .sort(sortDescendingByScore);

  if (!playerProfilesWithScore.length) {
    return null;
  }

  return (
    <div
      className={classNames(styles.leaderboardItemRoot, {
        [styles.isOwn]: own,
        [styles.collapsed]: variant === 'collapsed',
        [styles.withScoreboard]: variant === 'scoreboard',
      })}
    >
      <div className={styles.leaderboardItemHeader}>
        <RankNumber rankNumber={rank} />

        <div className={styles.leaderboardItemHeaderLabelContainer}>
          <div className={styles.leaderboardItemHeaderGroupName}>{displayGroupName}</div>
          <div className={styles.leaderboardItemHeaderGroupScore}>{score}</div>
          {own && <div className={styles.leaderboardItemYourTeamLabel}>Your team</div>}
        </div>
      </div>

      <div className={styles.leaderboardItemContent}>
        {variant === 'scoreboard' && (
          <table className={styles.leaderboardItemScoreboard}>
            <tbody>
              {playerProfilesWithScore.map((player) => (
                <tr
                  className={styles.leaderboardItemScoreboardRow}
                  key={player.userId}
                >
                  <td className={styles.leaderboardItemScoreboardUserTag}>
                    {player.userTag}
                  </td>
                  <td className={styles.leaderboardItemScoreboardScore}>
                    {player.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className={styles.leaderboardItemAvatarList}>
          {/* We reverse here since we use flex row reverse so we would still have most scoring first */}
          {[...playerProfilesWithScore].reverse().map((player) => {
            return (
              <div
                className={styles.leaderboardItemAvatarWrapper}
                key={player.userId}
              >
                <div
                  className={styles.leaderboardItemAvatarImageContainer}
                  style={
                    {
                      backgroundImage: `url(${player.avatars?.avatar2D})`,
                    } as CSSProperties
                  }
                />
                <div className={styles.leaderboardItemPlayerHoverInfo}>
                  <span>
                    {player.userTag}: {player.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
