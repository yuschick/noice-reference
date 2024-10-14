import { gql } from '@apollo/client';
import { Button, Select, useLoadingPromise } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { UpdateChallengeSessionParams } from '../hooks';

import { SelectableChallenges } from './SelectableChallenges';
import { SelectedChallenge } from './SelectedChallenge';
import styles from './SetupChallenges.module.css';

import { useCategoryChallenges } from '@common/challenge';
import {
  ChallengesessionChallenge,
  SelectableChallengesChallengeFragment,
  SetupChallengeChallengeFragment,
} from '@gen';

gql`
  fragment SetupChallengeChallenge on ChallengesessionChallenge {
    id
    description
    ...SetupChallengeSelectedChallenge
  }
`;

interface Props {
  submissionTimeMin: Nullable<number>;
  sessionChallenges: SetupChallengeChallengeFragment[];
  categoryId: Nullable<string>;
  isLoading?: boolean;
  onUpdateChallengeSession: (params: UpdateChallengeSessionParams) => Promise<void>;
  onSubmissionStart: () => Promise<void>;
}

const pickWindowOptions = [
  {
    label: '1 min',
    value: '1',
  },
  {
    label: '2 min',
    value: '2',
  },
  {
    label: '3 min',
    value: '3',
  },
  {
    label: '4 min',
    value: '4',
  },
  {
    label: '5 min',
    value: '5',
  },
  {
    label: '10 min',
    value: '10',
  },
  {
    label: '20 min',
    value: '20',
  },
  {
    label: '30 min',
    value: '30',
  },
  {
    label: '60 min',
    value: '60',
  },
];

export function SetupChallenges({
  submissionTimeMin,
  sessionChallenges,
  categoryId,
  isLoading,
  onUpdateChallengeSession,
  onSubmissionStart,
}: Props) {
  const [isSelectingChallenge, setIsSelectingChallenge] = useState(false);

  const { categoryChallenges, onCreateChallenge } = useCategoryChallenges(categoryId);

  const notSelectedChallenges = categoryChallenges.filter(
    (challenge) =>
      !sessionChallenges.some(
        (selectedChallenge) => selectedChallenge.id === challenge.id,
      ),
  );

  const onRandomChallenge = async () => {
    const randomIndex = Math.floor(Math.random() * notSelectedChallenges.length);
    const randomChallenge = notSelectedChallenges[randomIndex];

    await onUpdateChallengeSession({
      challenges: [
        ...sessionChallenges,
        { description: randomChallenge.description },
      ] as ChallengesessionChallenge[],
    });
  };

  const onRemoveChallenge = async (challengeId: string) => {
    await onUpdateChallengeSession({
      challenges: sessionChallenges.filter(
        (c) => c.id !== challengeId,
      ) as ChallengesessionChallenge[],
    });
  };

  const onSelectChallenges = async (challenges: ChallengesessionChallenge[]) => {
    await onUpdateChallengeSession({
      challenges,
    });
    setIsSelectingChallenge(false);
  };

  const onSubmissionsTimeChange = async (newSubmissionTime: number) => {
    await onUpdateChallengeSession({
      submissionTimeMin: newSubmissionTime,
    });
  };

  const [submissionTimeChange, isSubmittingTimeChange] = useLoadingPromise(
    onSubmissionsTimeChange,
  );

  const [submissionStart, isStartingSubmission] = useLoadingPromise(onSubmissionStart);

  const isLoadingData = isLoading;

  if (isSelectingChallenge) {
    return (
      <SelectableChallenges
        selectableChallenges={
          categoryChallenges.map((c) => ({
            description: c.description,
          })) as SelectableChallengesChallengeFragment[]
        }
        selectedChallengeIds={sessionChallenges.map((c) => c.id)}
        onAddChallenge={onCreateChallenge}
        onCancel={() => setIsSelectingChallenge(false)}
        onSelectChallenges={onSelectChallenges}
      />
    );
  }

  return (
    <div>
      <h3 className={styles.setupChallengesTitle}>Setup challenges</h3>

      <div className={styles.setupChallengesListActions}>
        <Button
          isDisabled={isLoadingData}
          level="secondary"
          size="sm"
          onClick={() => setIsSelectingChallenge(true)}
        >
          Add challenge
        </Button>

        <Button
          isDisabled={notSelectedChallenges.length === 0 || isLoadingData}
          level="secondary"
          size="sm"
          onClick={onRandomChallenge}
        >
          Add Random
        </Button>
      </div>

      <div className={styles.setupChallengesSelectedChallenges}>
        {sessionChallenges.map((challenge, index) => (
          <SelectedChallenge
            challenge={challenge}
            index={index + 1}
            key={challenge.id}
            onRemoveChallenge={onRemoveChallenge}
          />
        ))}
      </div>

      <div className={styles.setupChallengesFooter}>
        <Select
          isDisabled={isLoadingData || isSubmittingTimeChange}
          label="Submission time"
          options={pickWindowOptions.map((option) => ({
            ...option,
            type: 'option',
          }))}
          theme="gray"
          value={submissionTimeMin?.toString()}
          onChange={(e) => submissionTimeChange(parseInt(e.target.value, 10))}
        />

        <div className={styles.setupChallengesActionWrapper}>
          <span className={styles.setupChallengesActionLabel}>Add 2-4 options</span>
          <Button
            isDisabled={
              isLoadingData || isStartingSubmission || sessionChallenges.length < 2
            }
            size="md"
            type="submit"
            onClick={submissionStart}
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
}
