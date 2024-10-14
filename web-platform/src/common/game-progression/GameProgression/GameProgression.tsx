import { gql } from '@apollo/client';
import {
  CommonUtils,
  HorizontalProgressBar,
  LoadingSkeleton,
  SeasonRankBadge,
  useMediaQuery,
} from '@noice-com/common-ui';

import styles from './GameProgression.module.css';

import { GameProgressionGameFragment, useGameProgressionLevelConfigsQuery } from '@gen';

GameProgression.fragments = {
  game: gql`
    fragment GameProgressionGame on GameGame {
      id
      name
      activeSeason {
        name
        id
        progression(user_id: $userId) {
          seasonId
          xpAmount
          level
          nextLevelThreshold
          nextLevel
        }
      }
    }
  `,
};

gql`
  query GameProgressionLevelConfigs($seasonId: ID, $minLevel: Int) {
    listLevelConfigs(seasonId: $seasonId, minLevel: $minLevel) {
      levelConfigs {
        threshold
      }
    }
  }
`;

interface Props {
  className?: string;
  progression: GameProgressionGameFragment;
}

export function GameProgression({ progression: { name, activeSeason } }: Props) {
  const { data: levelConfigData } = useGameProgressionLevelConfigsQuery({
    variables: {
      minLevel: activeSeason.progression.level,
      seasonId: activeSeason.progression.seasonId,
    },
  });

  const currentLevel = levelConfigData?.listLevelConfigs?.levelConfigs[0];
  const { progression } = activeSeason;
  const showMediumBadge = useMediaQuery(`(max-width: ${CommonUtils.getRem(600)})`);

  return (
    <div className={styles.gameProgressionWrapper}>
      <SeasonRankBadge
        rank={progression.level}
        size={showMediumBadge ? 'md' : 'lg'}
      />
      <div className={styles.gameProgressionDetailsWrapper}>
        <span className={styles.gameProgressionTitle}>
          <span translate="no">{name} </span> Creators
        </span>
        <span className={styles.seasonName}>{activeSeason.name}</span>
        {progression.nextLevelThreshold === 0 ? (
          <span className={styles.maxLevel}>Max Level</span>
        ) : (
          <HorizontalProgressBar
            className={styles.gameProgressBar}
            max={progression.nextLevelThreshold}
            min={currentLevel?.threshold ?? 0}
            progress={progression.xpAmount}
            title={`${name} rank ${progression.level}`}
          />
        )}
      </div>
    </div>
  );
}

GameProgression.Loading = () => {
  return <LoadingSkeleton className={styles.loadingSkeleton} />;
};
