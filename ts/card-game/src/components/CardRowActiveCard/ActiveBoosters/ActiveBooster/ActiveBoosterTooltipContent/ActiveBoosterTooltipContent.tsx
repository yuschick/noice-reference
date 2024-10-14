import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { ReactNode } from 'react';

import styles from './ActiveBoosterTooltipContent.module.css';

import {
  ActiveBoosterTooltipContentProfileFragment,
  ActiveBoosterTooltipContentBoosterFragment,
} from '@game-gen';

export interface Props {
  boosterOwner: ActiveBoosterTooltipContentProfileFragment;
  cardOwner: ActiveBoosterTooltipContentProfileFragment;
  booster: Nullable<ActiveBoosterTooltipContentBoosterFragment>;
  replaceBooster?: Nullable<ActiveBoosterTooltipContentBoosterFragment>;
}

export function ActiveBoosterTooltipContent({
  boosterOwner,
  cardOwner,
  booster,
  replaceBooster,
}: Props) {
  const isOwnBooster = boosterOwner.userId === cardOwner.userId;
  const visualisedBooster = replaceBooster ?? booster;

  if (!visualisedBooster) {
    return null;
  }

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

  const conditionLabelText = visualisedBooster.descriptionCondition;

  const benefitRawLabel = isOwnBooster
    ? visualisedBooster.descriptionTargetSelf
    : visualisedBooster.descriptionDefaultBenefit;
  const benefitLabel = getDescriptionWithName(benefitRawLabel) ?? (
    <div className={styles.avatarBoosterInfoDescriptionLabel}>{benefitRawLabel}</div>
  );

  const otherBenefitLabel =
    !isOwnBooster &&
    getDescriptionWithName(visualisedBooster.descriptionTargetNoneBenefit);

  return (
    <div className={styles.activeBoosterWrapper}>
      <div className={styles.boosterHeader}>
        <div
          className={styles.avatarImage}
          style={{ backgroundImage: `url(${boosterOwner.avatars?.avatar2D})` }}
        />
        <div>
          <div className={styles.boosterName}>{visualisedBooster.name}</div>
          <div className={styles.boosterLabel}>Placed by {boosterOwner.userTag}</div>
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

        {!!replaceBooster && !!booster && (
          <div className={styles.replacesLabel}>
            Replaces: <span className={styles.replacedBoosterName}>{booster.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

ActiveBoosterTooltipContent.fragments = {
  profile: gql`
    fragment ActiveBoosterTooltipContentProfile on ProfileProfile {
      userId
      userTag
      avatars {
        avatar2D
      }
    }
  `,
  booster: gql`
    fragment ActiveBoosterTooltipContentBooster on GameLogicBooster {
      id
      name
      descriptionCondition
      descriptionDefaultBenefit
      descriptionTargetNoneBenefit
      descriptionTargetSelf
    }
  `,
};
