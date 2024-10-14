import { gql } from '@apollo/client';
import { HorizontalProgressBar, Icon } from '@noice-com/common-ui';
import { GoalCardSlotState } from '@noice-com/platform-client';
import classNames from 'classnames';
import { FaCheckCircle } from 'react-icons/fa';

import styles from './DailyGoalTooltipContent.module.css';

import { getGoalCardSlotState, isGoalCardSlotReadyForPick } from '@common/goal-card';
import { DailyGoalTooltipContentGoalCardSlotFragment } from '@gen';

interface Props {
  className: string;
  index: number;
  slot: DailyGoalTooltipContentGoalCardSlotFragment;
}

DailyGoalTooltipContent.fragments = {
  entry: gql`
    fragment DailyGoalTooltipContentGoalCardSlot on GoalCardGoalCardSlot {
      id
      reward {
        __typename
      }
      goalCard {
        id
        description
        target
      }
      progress {
        value
        completed
      }
      ...GoalCardSlotStateGoalCardSlot
      ...GoalCardSlotReadyForPickGoalCardCardSlot
    }
  `,
};

const getTooltipText = (
  readyForPick: boolean,
  goalSlotState: GoalCardSlotState,
  currentProgress: number,
  target: number,
) => {
  if (readyForPick) {
    return 'Go select a new goal';
  }

  if (goalSlotState === GoalCardSlotState.COLLECTED) {
    return 'Collected';
  }

  if (goalSlotState !== GoalCardSlotState.COMPLETED) {
    return `(${currentProgress}/${target})`;
  }

  return (
    <>
      <span className={styles.completedProgress}>
        ({currentProgress}/{target})
      </span>{' '}
      Go collect the reward
    </>
  );
};

export function DailyGoalTooltipContent({ className, slot, index }: Props) {
  const readyForPick = isGoalCardSlotReadyForPick(slot);
  const state = getGoalCardSlotState(slot);
  const currentProgress = slot.progress?.value ?? 0;
  const target = slot.goalCard?.target ?? 0;
  const description =
    slot.goalCard?.description?.replace('{targetValue}', target.toString()) ?? '';
  const nameText = readyForPick ? 'No daily goal selected' : description;

  const text = getTooltipText(readyForPick, state, currentProgress, target);

  return (
    <div
      className={classNames(className, {
        [styles.notPickedYet]: readyForPick,
        [styles.completed]: state === GoalCardSlotState.COMPLETED,
        [styles.collected]: !readyForPick && state === GoalCardSlotState.COLLECTED,
      })}
    >
      <span className={styles.index}>{String(index).padStart(2, '0')}</span>

      <div className={styles.content}>
        <span className={styles.name}>{nameText}</span>

        <span>{text}</span>

        {!readyForPick && state !== GoalCardSlotState.COLLECTED && (
          <HorizontalProgressBar
            className={styles.progressBar}
            max={target}
            progress={currentProgress}
            title={description}
          />
        )}
      </div>

      {!readyForPick && state === GoalCardSlotState.COLLECTED && (
        <Icon
          className={styles.checkIcon}
          icon={FaCheckCircle}
          size={24}
        />
      )}
    </div>
  );
}
