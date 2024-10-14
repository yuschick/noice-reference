import { gql } from '@apollo/client';
import classNames from 'classnames';

import styles from './LocalPlayerBoosterTooltipContent.module.css';

import {
  replaceDynamicBoosterNames,
  getBoosterIconComponent,
} from '@game-common/booster';
import { useLocalPlayerBoosterTooltipContentQuery } from '@game-gen';
import { BoosterType } from '@game-types';

gql`
  query LocalPlayerBoosterTooltipContent($boosterId: Int!) {
    booster(id: $boosterId) {
      id
      name
      descriptionCondition
      descriptionDefaultBenefit
      descriptionTargetNoneBenefit
    }
  }
`;

export interface Props {
  className?: string;
  boosterId: BoosterType;
}

export function LocalPlayerBoosterTooltipContent({ boosterId, className }: Props) {
  const { data } = useLocalPlayerBoosterTooltipContentQuery({
    variables: {
      boosterId,
    },
  });

  const booster = data?.booster;

  if (!booster) {
    return null;
  }

  const boosterInfo = replaceDynamicBoosterNames('You', 'You', booster);
  const BoosterIcon = getBoosterIconComponent(booster.id);

  return (
    <div className={classNames(styles.localBoosterWrapper, className)}>
      <div className={styles.boosterHeader}>
        <BoosterIcon className={styles.boosterIcon} />
        <div className={styles.headerLabels}>
          {!!boosterInfo.name && (
            <div className={styles.boosterName}>{boosterInfo.name}</div>
          )}
          <div className={styles.boosterLabel}>BOOSTER</div>
        </div>
      </div>

      <div className={styles.boosterInfo}>
        <div className={styles.description}>
          <div className={styles.condition}>{boosterInfo.descriptionCondition}:</div>
          <div className={styles.benefit}>{boosterInfo.descriptionDefaultBenefit}</div>
          {!!boosterInfo.descriptionTargetNoneBenefit && (
            <>
              <div className={styles.condition}>If used on another players card:</div>
              <div className={styles.benefit}>
                {boosterInfo.descriptionTargetNoneBenefit}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
