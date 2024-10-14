import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { IconButton, useLoadingPromise } from '@noice-com/common-ui';

import styles from './SelectedChallenge.module.css';

import { SetupChallengeSelectedChallengeFragment } from '@gen';

gql`
  fragment SetupChallengeSelectedChallenge on ChallengesessionChallenge {
    id
    description
  }
`;

interface Props {
  index: number;
  challenge: SetupChallengeSelectedChallengeFragment;
  onRemoveChallenge: (challengeId: string) => Promise<void>;
}

export function SelectedChallenge({ index, challenge, onRemoveChallenge }: Props) {
  const [removeChallenge, processingRemove] = useLoadingPromise(onRemoveChallenge);

  return (
    <div className={styles.selectedChallengeRoot}>
      <div className={styles.selectedChallengeIndexWrapper}>{index}</div>

      <span className={styles.selectedChallengeDescription}>{challenge.description}</span>

      <IconButton
        icon={CoreAssets.Icons.Close}
        isDisabled={processingRemove}
        label="Remove selected challenge"
        level="secondary"
        size="xs"
        variant="ghost"
        onClick={() => removeChallenge(challenge.id)}
      />
    </div>
  );
}
