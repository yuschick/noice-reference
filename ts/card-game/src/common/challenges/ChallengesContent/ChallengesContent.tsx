import { Tooltip } from '@noice-com/common-ui';
import classNames from 'classnames';

import { Challenge } from './Challenge';
import styles from './ChallengesContent.module.css';
import { ChallengeContentType } from './hooks';

import { useSelectedChallenge } from '@game-logic/challenges/hooks';

interface Props {
  challenges: ChallengeContentType[];
  isLoading?: boolean;
  isChallengeSelectable?: boolean;
  selectChallenge?: (challengeId: string) => void;
}

const getText = (status: ChallengeContentType['status']) => {
  switch (status) {
    case 'success':
      return 'Succeeded';
    case 'failure':
      return 'Can no longer succeed';
    case 'unresolved':
      return 'Not resolved';
  }
};

export const ChallengesContent = ({
  challenges,
  isLoading,
  isChallengeSelectable,
  selectChallenge,
}: Props) => {
  const { selectedChallengeId } = useSelectedChallenge();

  return (
    <div className={styles.challenges}>
      {isLoading
        ? Array(3)
            .fill(null)
            .map((_, index) => (
              <Challenge
                key={index}
                isLoading
              />
            ))
        : challenges.map((challenge) => (
            <Tooltip
              content={
                <div>
                  Challenges cannot be selected or <br />
                  changed during a match.
                  <span
                    className={classNames(
                      styles.challengesTooltipChallengeStatus,
                      styles[challenge.status],
                    )}
                  >
                    {getText(challenge.status)}
                  </span>
                </div>
              }
              forceState={isChallengeSelectable ? 'hide' : undefined}
              key={challenge.id}
              placement="top"
            >
              <Challenge
                challenge={challenge}
                isDisabled={!isChallengeSelectable}
                isSelected={selectedChallengeId === challenge.id}
                onClick={() => selectChallenge?.(challenge.id)}
              />
            </Tooltip>
          ))}
    </div>
  );
};
