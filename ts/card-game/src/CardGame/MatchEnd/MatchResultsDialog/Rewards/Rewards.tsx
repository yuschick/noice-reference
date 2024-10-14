import { gql } from '@apollo/client';
import {
  CurrencyIcon,
  HorizontalProgressBar,
  SeasonRankBadge,
  useAuthenticatedUser,
} from '@noice-com/common-ui';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';
import classNames from 'classnames';

import { MatchEndRewards } from '../../types';
import { getProgression } from '../../utils';

import styles from './Rewards.module.css';

import { useMatchResultsDialogRewardsGameQuery } from '@game-gen';

gql`
  query MatchResultsDialogRewardsGame($gameId: ID, $userId: ID) {
    game(id: $gameId) {
      id
      name
      activeSeason {
        id
        name
        progression(user_id: $userId) {
          level
        }
      }
    }
  }
`;

interface Props {
  matchEndMessage: MatchEndedMsg;
  rewards: MatchEndRewards;
}

export function Rewards({ matchEndMessage, rewards }: Props) {
  const { gameId } = matchEndMessage;
  const { userId } = useAuthenticatedUser();

  const { data: gameData } = useMatchResultsDialogRewardsGameQuery({
    variables: { gameId, userId },
    skip: !gameId,
  });

  if (!gameId) {
    return null;
  }

  return (
    <div className={styles.matchResultsDialogRewardsContainer}>
      <div className={styles.rewardBox}>
        <div className={styles.rewardBoxContent}>
          <span className={styles.rewardTypeText}>Rewards</span>
          {rewards.currency.map((reward, index) => (
            <div
              className={styles.reward}
              key={`currencyReward_${index}`}
            >
              <CurrencyIcon
                size="md"
                type={reward.currencyId}
              />
              <span className={styles.rewardText}>{reward.amount}</span>
            </div>
          ))}
        </div>
        <div className={styles.rewardBoxContent}>
          <span className={styles.rewardTypeText}>Bonuses</span>

          <div className={styles.bonusTypesContainer}>
            {rewards.bonuses.teamPlayer && (
              <span className={styles.bonusTypeText}>Team player</span>
            )}
            {rewards.bonuses.participation && (
              <span className={styles.bonusTypeText}>Participation</span>
            )}
          </div>
        </div>
      </div>

      <div className={classNames(styles.rewardBox, styles.rewardBoxSeasonProgression)}>
        <SeasonRankBadge
          rank={rewards.seasonProgresion.level}
          size="lg"
        />
        <div className={styles.rewardBoxSeasonProgressionDetails}>
          <span className={styles.rewardBoxSeasonProgressionGameText}>
            {gameData?.game?.name} creators
          </span>
          <span className={styles.rewardBoxSeasonProgressionSeasonText}>
            {gameData?.game?.activeSeason.name}
          </span>
          <HorizontalProgressBar
            className={styles.progressbar}
            max={1}
            min={0}
            progress={getProgression(
              rewards.seasonProgresion.currentLevelXp,
              rewards.seasonProgresion.nextLevelXp,
              rewards.seasonProgresion.currentXp,
            )}
            title="plop"
          />
        </div>
      </div>
    </div>
  );
}
