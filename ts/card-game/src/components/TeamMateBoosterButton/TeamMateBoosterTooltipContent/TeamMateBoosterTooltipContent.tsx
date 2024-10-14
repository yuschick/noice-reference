import { gql } from '@apollo/client';
import classNames from 'classnames';

import styles from './TeamMateBoosterTooltipContent.module.css';

import { getBoosterIconComponent } from '@game-common/booster';
import {
  TeamMateBoosterTooltipContentBoosterFragment,
  useTeamMateBoosterTooltipContentQuery,
} from '@game-gen';
import { BoosterType } from '@game-types';

gql`
  fragment TeamMateBoosterTooltipContentBooster on GameLogicBooster {
    name
    descriptionCondition
    descriptionDefaultBenefit
  }

  query TeamMateBoosterTooltipContent($boosterId: Int!, $userId: ID!) {
    booster(id: $boosterId) {
      id
      ...TeamMateBoosterTooltipContentBooster
    }
    profile(userId: $userId) {
      userId
      userTag
    }
  }
`;

export interface Props {
  hasRequested?: boolean;
  playerId: string;
  boosterId: BoosterType;
}

const getLabel = (description?: TeamMateBoosterTooltipContentBoosterFragment) => {
  let label = description?.descriptionDefaultBenefit ?? '';

  label = label.replace("{playerName}'s", 'Your');
  label = label.replace('{playerName}', 'You');

  return label;
};

export function TeamMateBoosterTooltipContent({
  boosterId,
  playerId,
  hasRequested,
}: Props) {
  const { data } = useTeamMateBoosterTooltipContentQuery({
    variables: {
      boosterId,
      userId: playerId,
    },
  });
  const booster = data?.booster;
  const player = data?.profile;

  if (!booster || !player) {
    return null;
  }

  const benefit = getLabel(booster);
  const BoosterIcon = getBoosterIconComponent(booster.id);

  return (
    <div
      className={classNames(styles.teamBoosterWrapper, {
        [styles.hasRequested]: hasRequested,
      })}
    >
      <div className={styles.boosterHeader}>
        <BoosterIcon className={styles.boosterIcon} />
        <div className={styles.headerLabels}>
          <div className={styles.boosterName}>{booster.name}</div>
          <div className={styles.boosterLabel}>BOOSTER</div>
        </div>
      </div>

      <div className={styles.boosterInfo}>
        <div className={styles.description}>
          <div className={styles.condition}>{booster.descriptionCondition}:</div>
          <div className={styles.benefit}>{benefit}</div>
        </div>

        <div className={styles.requestLabel}>
          {hasRequested ? 'Cancel request for' : 'Request'}{' '}
          <span className={styles.name}>{player.userTag}&apos;s</span> booster
        </div>
      </div>
    </div>
  );
}
