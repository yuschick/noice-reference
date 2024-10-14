import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { ReactNode } from 'react';

import styles from './ActiveBoosterDialogContent.module.css';

import {
  ActiveBoosterDialogContentProfileFragment,
  ActiveBoosterDialogContentBoosterFragment,
} from '@game-gen';

export interface Props {
  boosterOwner: ActiveBoosterDialogContentProfileFragment;
  cardOwner: ActiveBoosterDialogContentProfileFragment;
  booster: ActiveBoosterDialogContentBoosterFragment;
}

export function ActiveBoosterDialogContent({ boosterOwner, cardOwner, booster }: Props) {
  const isOwnBooster = boosterOwner.userId === cardOwner.userId;

  const getDescriptionWithName = (label?: Nullable<string>): Nullable<ReactNode> => {
    if (!label) {
      return null;
    }

    if (label.includes('{playerName')) {
      return (
        <div className={styles.avatarBoosterInfoDescriptionWithName}>
          <span className={styles.avatarBoosterInfoUserTag}>{boosterOwner.userTag}</span>
          {label.replace('{playerName}', '')}
        </div>
      );
    }

    if (label.includes('{targetName}')) {
      return (
        <div className={styles.avatarBoosterInfoDescriptionWithName}>
          <span className={styles.avatarBoosterInfoUserTag}>{cardOwner.userTag}</span>
          {label.replace('{targetName}', '')}
        </div>
      );
    }
  };

  const conditionLabelText = booster.descriptionCondition;

  const benefitRawLabel = isOwnBooster
    ? booster.descriptionTargetSelf
    : booster.descriptionDefaultBenefit;

  const benefitLabel = getDescriptionWithName(benefitRawLabel) ?? (
    <div className={styles.avatarBoosterInfoDescriptionLabel}>{benefitRawLabel}</div>
  );

  const otherBenefitLabel =
    !isOwnBooster && getDescriptionWithName(booster.descriptionTargetNoneBenefit);

  return (
    <div className={styles.activeBoosterWrapper}>
      <div className={styles.boosterHeader}>
        <div
          className={styles.avatarImage}
          style={{ backgroundImage: `url(${boosterOwner.avatars?.avatar2D})` }}
        />
        <div>
          <div className={styles.boosterName}>{booster.name}</div>
        </div>
      </div>

      <div className={styles.boosterInfo}>
        <div className={styles.description}>
          {!!conditionLabelText && (
            <div className={styles.condition}>{conditionLabelText}:</div>
          )}
          <div className={styles.benefit}>{benefitLabel}</div>
          <div className={styles.benefit}>{otherBenefitLabel}</div>
        </div>
      </div>
    </div>
  );
}

ActiveBoosterDialogContent.fragments = {
  profile: gql`
    fragment ActiveBoosterDialogContentProfile on ProfileProfile {
      userId
      userTag
      avatars {
        avatar2D
      }
    }
  `,
  booster: gql`
    fragment ActiveBoosterDialogContentBooster on GameLogicBooster {
      id
      name
      descriptionCondition
      descriptionDefaultBenefit
      descriptionTargetNoneBenefit
      descriptionTargetSelf
    }
  `,
};
