import { gql } from '@apollo/client';

import styles from './ActiveSessionChallenge.module.css';

import { ActiveSessionChallengeFragment } from '@gen';

gql`
  fragment ActiveSessionChallenge on ChallengesessionChallenge {
    id
    description
  }
`;

interface Props {
  challenge: ActiveSessionChallengeFragment;
}

export function ActiveSessionChallenge({ challenge }: Props) {
  const { description } = challenge;

  return (
    <div className={styles.activeSessionChallengeRoot}>
      {/*
        TODO: suppport total picks
        <span className={styles.activeSessionPickRate}>{totalPicks}</span> 
      */}
      <span>{description}</span>
    </div>
  );
}
