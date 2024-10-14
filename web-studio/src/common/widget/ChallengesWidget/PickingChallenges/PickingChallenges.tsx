import { gql } from '@apollo/client';
import { Button, useLoadingPromise } from '@noice-com/common-ui';

import { ActiveSessionChallenge } from '../ActiveSessionChallenge';

import styles from './PickingChallenges.module.css';

import { PickingChallengesChallengeFragment } from '@gen';

gql`
  fragment PickingChallengesChallenge on ChallengesessionChallenge {
    id
    ...ActiveSessionChallenge
  }
`;

interface Props {
  sessionChallenges: PickingChallengesChallengeFragment[];
  onSubmissionCancel: () => Promise<void>;
}

export function PickingChallenges({ sessionChallenges, onSubmissionCancel }: Props) {
  const [cancelSubmission, isCancellingSubmission] =
    useLoadingPromise(onSubmissionCancel);

  return (
    <div>
      <h3 className={styles.pickingChallengesTitle}>Submission open</h3>

      <div className={styles.pickingChallengesChallengesWrapper}>
        {sessionChallenges.map((challenge) => (
          <ActiveSessionChallenge
            challenge={challenge}
            key={challenge.id}
          />
        ))}
      </div>

      <div className={styles.pickingChallengesActionsWrapper}>
        <Button
          isDisabled={isCancellingSubmission}
          level="secondary"
          onClick={cancelSubmission}
        >
          Cancel submission
        </Button>
      </div>
    </div>
  );
}
