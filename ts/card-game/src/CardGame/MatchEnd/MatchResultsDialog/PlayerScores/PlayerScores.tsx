import { gql } from '@apollo/client';
import { Image, ProfileImage } from '@noice-com/common-ui';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import { getPlayerIdsFromMatchEnd } from '../../utils';

import styles from './PlayerScores.module.css';

import { useMatchResultsDialogPlayerScoresProfileQuery } from '@game-gen';

gql`
  query MatchResultsDialogPlayerScoresProfile($userIds: [String!]) {
    profileBatch(userIds: $userIds) {
      profiles {
        userId
        ...ProfileImageProfile
        avatars {
          avatarFullbody
        }
      }
    }
  }

  ${ProfileImage.fragments.entry}
`;

interface Props {
  matchEndMessage: MatchEndedMsg;
}

export function PlayerScores({ matchEndMessage }: Props) {
  const userIds = getPlayerIdsFromMatchEnd(matchEndMessage);

  const { data: profileData } = useMatchResultsDialogPlayerScoresProfileQuery({
    variables: { userIds },
    skip: !userIds.length,
  });

  const profiles = profileData?.profileBatch?.profiles;

  return (
    <div
      className={styles.playerScoresContainer}
      style={
        {
          '--match-end-player-scores-grid-columns': `${userIds.reduce<string>(
            (prev) => `${prev} 1fr`,
            '',
          )}`,
        } as CSSProperties
      }
    >
      <div className={styles.playerAvatarsContainer}>
        {profiles?.map((profile) => (
          <div
            className={styles.playerAvatarImageContainer}
            key={profile.userId}
          >
            <Image
              className={styles.playerAvatarImage}
              src={profile.avatars?.avatarFullbody}
            />
          </div>
        ))}
      </div>
      <div className={styles.scoreDetailsContainer}>
        <div className={styles.narrowScreenTableHeader}>
          <div className={styles.headerColumn}>Player</div>
          <div className={styles.headerColumn}>Score</div>
          <div className={styles.headerColumn}>Best Play</div>
          <div className={styles.headerColumn}>Total</div>
        </div>
        {matchEndMessage.players?.map((player, index) => {
          const profile = profiles?.find((profile) => profile.userId === player.userId);
          const score = (player.points ?? 0) - (player.bestPlay?.points ?? 0);
          const showScoreLegend = index === 0;

          if (!profile) {
            return null;
          }

          return (
            <div
              className={styles.playerScoreDetails}
              key={player.userId}
            >
              <div className={styles.profileImageContainerColumn}>
                <ProfileImage
                  profile={profile}
                  size="md"
                />

                <span className={styles.playerProfileImageName}>{profile.userTag}</span>
              </div>
              <div className={styles.profileImageContainerList}>
                <ProfileImage
                  profile={profile}
                  size="xs"
                />

                <span className={styles.playerProfileImageName}>{profile.userTag}</span>
              </div>

              <div className={styles.playerScoreDetailsList}>
                {showScoreLegend && (
                  <div className={styles.playerScoreDetailsLegend}>
                    <span className={styles.playerScoreDetailsNumbersText}>Score</span>
                    <span className={styles.playerScoreDetailsNumbersText}>
                      Best Play
                    </span>
                    <span className={styles.playerScoreDetailsNumbersTextLarge}>
                      Total
                    </span>
                  </div>
                )}

                <div
                  className={classNames(styles.playerScoreDetailsNumbers, {
                    [styles.showLegend]: showScoreLegend,
                  })}
                >
                  <span className={styles.playerScoreDetailsNumbersText}>{score}</span>
                  <span className={styles.playerScoreDetailsNumbersText}>
                    {player.bestPlay?.points ?? 0}
                  </span>
                  <span className={styles.playerScoreDetailsNumbersTextLarge}>
                    {player.points ?? 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {!!matchEndMessage.group?.points && !matchEndMessage.group?.isSolo && (
          <div className={styles.totalScoreContainer}>
            <span className={styles.totalScoreDescriptionText}>Team Score</span>
            <span className={styles.totalScoreText}>
              {matchEndMessage.group?.points ?? 0}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
