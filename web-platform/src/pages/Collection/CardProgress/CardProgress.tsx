import { gql } from '@apollo/client';
import { CSSProperties } from 'react';

import styles from './CardProgress.module.css';

import { CardProgressCardFragment } from '@gen';

gql`
  fragment CardProgress on GameLogicCardLeveling {
    currentLevel
    progressToNextLevel
    nextLevelLimit
  }

  fragment CardProgressCard on GameLogicCard {
    id
    name
    leveling {
      ...CardProgress
    }
  }
`;

interface Props {
  card: CardProgressCardFragment;
}

export function CardProgress({ card }: Props) {
  const { leveling } = card;
  const currentAmount = leveling.progressToNextLevel;
  const nextLevelAmount =
    (leveling.nextLevelLimit ?? -1) < 0 ? currentAmount : leveling.nextLevelLimit;
  const isMax = currentAmount === nextLevelAmount;

  if (isMax) {
    return (
      <div className={styles.cardProgressMaxContainer}>
        <span className={styles.maxText}>Max Level</span>
      </div>
    );
  }

  return (
    <div className={styles.cardProgressContainer}>
      <div
        aria-valuemax={nextLevelAmount}
        aria-valuenow={currentAmount}
        className={styles.progressFill}
        role="progressbar"
        style={
          {
            '--module-card-progress': `${(currentAmount / nextLevelAmount) * 100}%`,
          } as CSSProperties
        }
        title={`${card.name} level ${leveling.currentLevel}`}
      />
      <div className={styles.levelContainer}>
        <span className={styles.lvlText}>Level Up:</span>
        <span className={styles.lvlNumberText}>
          {currentAmount}/{nextLevelAmount}
        </span>
      </div>
    </div>
  );
}
