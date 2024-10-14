import { gql } from '@apollo/client';

import styles from './TeamMateBoosterDialogContent.module.css';

import { getBoosterIconComponent } from '@game-common/booster';
import {
  TeamMateBoosterDialogContentBoosterFragment,
  useTeamMateBoosterDialogContentQuery,
} from '@game-gen';
import { BoosterType } from '@game-types';

gql`
  fragment TeamMateBoosterDialogContentBooster on GameLogicBooster {
    name
    descriptionCondition
    descriptionDefaultBenefit
  }

  query TeamMateBoosterDialogContent($boosterId: Int!) {
    booster(id: $boosterId) {
      id
      ...TeamMateBoosterDialogContentBooster
    }
  }
`;

export interface Props {
  boosterId: BoosterType;
}

const getLabel = (description?: TeamMateBoosterDialogContentBoosterFragment) => {
  let label = description?.descriptionDefaultBenefit ?? '';

  label = label.replace("{playerName}'s", 'Your');
  label = label.replace('{playerName}', 'You');

  return label;
};

export function TeamMateBoosterDialogContent({ boosterId }: Props) {
  const { data } = useTeamMateBoosterDialogContentQuery({
    variables: {
      boosterId,
    },
  });
  const booster = data?.booster;

  if (!booster) {
    return null;
  }

  const benefit = getLabel(booster);
  const BoosterIcon = getBoosterIconComponent(booster.id);

  return (
    <div className={styles.teamBoosterWrapper}>
      <div className={styles.boosterHeader}>
        <BoosterIcon className={styles.boosterIcon} />
        <div className={styles.headerLabels}>
          <div className={styles.boosterName}>{booster.name}</div>
        </div>
      </div>

      <div className={styles.boosterInfo}>
        <div className={styles.description}>
          <div className={styles.condition}>{booster.descriptionCondition}:</div>
          <div className={styles.benefit}>{benefit}</div>
        </div>
      </div>
    </div>
  );
}
