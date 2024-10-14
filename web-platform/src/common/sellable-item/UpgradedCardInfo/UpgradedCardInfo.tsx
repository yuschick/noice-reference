import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './UpgradedCardInfo.module.css';

import { UpgradedCardLevelDetailsFragment } from '@gen';

interface Props {
  oldLevelDetails: Nullable<UpgradedCardLevelDetailsFragment>;
  newLevelDetails: Nullable<UpgradedCardLevelDetailsFragment>;
  show: boolean;
  maxLevel: boolean;
  onMountAnimationEnd: () => void;
  skipAnimation?: boolean;
  isNewStreamerCard?: boolean;
}

export function UpgradedCardInfo({
  newLevelDetails,
  oldLevelDetails,
  show,
  maxLevel,
  onMountAnimationEnd,
  skipAnimation,
  isNewStreamerCard,
}: Props) {
  const newMin = newLevelDetails?.pointsMin;
  const newMax = newLevelDetails?.pointsMax;
  const minDelta = newMin ? newMin - (oldLevelDetails?.pointsMin ?? newMin) : 0;
  const maxDelta = newMax ? newMax - (oldLevelDetails?.pointsMax ?? newMax) : 0;

  if (!show) {
    return null;
  }

  return (
    <div
      className={classNames(styles.cardInfo, {
        [styles.show]:
          show && ((!!newLevelDetails && !!oldLevelDetails) || isNewStreamerCard),
        [styles.skipAnimation]: skipAnimation,
        [styles.maxLevel]: maxLevel,
        [styles.newStreamerCard]: isNewStreamerCard,
      })}
    >
      <div className={classNames(styles.levelUpLabel, styles.hide)}>
        <div className={classNames(styles.levelUpLabelStyle)}>
          {isNewStreamerCard ? 'New' : maxLevel ? 'Max Level' : 'Level up'}
        </div>
      </div>
      <div
        className={classNames(styles.levelUpDetails)}
        onAnimationEnd={onMountAnimationEnd}
      >
        <ul className={styles.upgradeChanges}>
          {minDelta > 0 && (
            <li className={classNames(styles.changeRow)}>
              <span className={styles.changeTypeLabel}>Min</span>
              <span className={styles.changeValueLabel}>+{minDelta}</span>
            </li>
          )}
          {maxDelta > 0 && (
            <li className={classNames(styles.changeRow)}>
              <span className={styles.changeTypeLabel}>Max</span>
              <span className={styles.changeValueLabel}>+{maxDelta}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

UpgradedCardInfo.fragments = {
  entry: gql`
    fragment UpgradedCardLevelDetails on GameLogicCard {
      leveling {
        currentLevel
      }
      pointsMin
      pointsMax
    }
  `,
};
