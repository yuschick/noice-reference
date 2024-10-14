import { useAuthenticatedUser } from '@noice-com/common-ui';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { MatchEndRewards } from '../../types';
import { getProgression } from '../../utils';

import { CurrencyRewards } from './CurrencyRewards/CurrencyRewards';
import styles from './Results.module.css';
import { Score } from './Score/Score';
import { SeasonXp } from './SeasonXp/SeasonXp';

function getScore(matchEndMessage: MatchEndedMsg, localPlayerId: string) {
  if (matchEndMessage.group && !matchEndMessage.group.isSolo) {
    return matchEndMessage.group.points ?? 0;
  }

  return (
    matchEndMessage.players?.find((player) => player.userId === localPlayerId)?.points ??
    0
  );
}

function getScoreDescription(matchEndMessage: MatchEndedMsg) {
  if (matchEndMessage.group && !matchEndMessage.group.isSolo) {
    return 'Team Score';
  }

  return 'Score';
}

interface Props {
  matchEndMessage: MatchEndedMsg;
  rewards: MatchEndRewards;
}

export function Results({ matchEndMessage, rewards }: Props) {
  const { userId } = useAuthenticatedUser();

  return (
    <div className={styles.resultsContainer}>
      <Score
        description={getScoreDescription(matchEndMessage)}
        score={getScore(matchEndMessage, userId)}
      />
      <CurrencyRewards rewards={rewards.currency} />
      <SeasonXp
        level={rewards.seasonProgresion.level}
        progress={getProgression(
          rewards.seasonProgresion.currentLevelXp,
          rewards.seasonProgresion.nextLevelXp,
          rewards.seasonProgresion.currentXp,
        )}
        rankUp={rewards.seasonProgresion.rankUp}
      />
    </div>
  );
}
