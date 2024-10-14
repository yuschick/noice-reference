import { gql } from '@apollo/client';
import { Button, Checkbox, useLoadingPromise } from '@noice-com/common-ui';
import { useState } from 'react';

import { AddChallenge } from './AddChallenge';
import styles from './SelectableChallenges.module.css';

import { ChallengesessionChallenge, SelectableChallengesChallengeFragment } from '@gen';

gql`
  fragment SelectableChallengesChallenge on ChallengesessionChallenge {
    id
    description
  }
`;

interface Props {
  selectedChallengeIds: string[];
  selectableChallenges: SelectableChallengesChallengeFragment[];
  onAddChallenge: (description: string) => Promise<void>;
  onSelectChallenges: (challenges: ChallengesessionChallenge[]) => Promise<void>;
  onCancel: () => void;
}

export function SelectableChallenges({
  selectedChallengeIds,
  selectableChallenges,
  onCancel,
  onAddChallenge,
  onSelectChallenges,
}: Props) {
  const [selectedChallenges, setSelectedChallenges] = useState<
    SelectableChallengesChallengeFragment[]
  >(selectableChallenges.filter((c) => selectedChallengeIds.includes(c.id)) ?? []);
  const [showAddChallenge, setShowAddChallenge] = useState(false);

  const onHandleAddChallenge = async (description: string) => {
    await onAddChallenge(description);
    setShowAddChallenge(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedChallenges.length < 2 || selectedChallenges.length > 4) {
      return;
    }

    await onSelectChallenges(selectedChallenges as ChallengesessionChallenge[]);
  };

  const [handleSubmit, isSubmitting] = useLoadingPromise(onSubmit);

  if (showAddChallenge) {
    return (
      <AddChallenge
        onAddChallenge={onHandleAddChallenge}
        onCancel={() => setShowAddChallenge(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.selectableChallengesHeader}>
        <h3 className={styles.selectableChallengesTitle}>Add challenge</h3>

        <Button
          level="secondary"
          size="sm"
          onClick={() => setShowAddChallenge(true)}
        >
          Create new challenge
        </Button>
      </div>

      <div className={styles.selectableChallengesChallenges}>
        {selectableChallenges.map((challenge) => (
          <div
            className={styles.selectableChallengesChallenge}
            key={challenge.id}
          >
            <Checkbox
              checked={selectedChallengeIds.includes(challenge.id)}
              label={challenge.description}
              name="challenge"
              onChange={(e) => {
                const isChecked = e.target.checked;

                setSelectedChallenges((prev) => {
                  if (isChecked) {
                    return [...prev, challenge];
                  }

                  return prev.filter((c) => c.id !== challenge.id);
                });
              }}
            />
          </div>
        ))}
      </div>

      <div className={styles.selectableChallengesFooter}>
        <div className={styles.selectableChallengesFooterInfo}>
          <span className={styles.selectableChallengesFooterInfoInstruction}>
            Select 2-4 options
          </span>
          <span className={styles.selectableChallengesFooterInfoCounter}>
            <strong className={styles.selectableChallengesFooterInfoCounterNumber}>
              {selectedChallenges.length}
            </strong>{' '}
            Selected
          </span>
        </div>

        <div className={styles.selectableChallengesFooterActions}>
          <Button
            isDisabled={
              selectedChallenges.length < 2 ||
              selectedChallenges.length > 4 ||
              isSubmitting
            }
            level="secondary"
            size="sm"
            type="submit"
          >
            Add selected
          </Button>

          <Button
            fit="content"
            isDisabled={isSubmitting}
            level="secondary"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
