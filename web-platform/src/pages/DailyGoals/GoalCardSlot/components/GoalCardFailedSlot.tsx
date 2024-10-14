import { gql } from '@apollo/client';
import { WithChildren } from '@noice-com/common-ui';

import { GoalCard } from '../../GoalCard/GoalCard';

import styles from './GoalCardFailedSlot.module.css';

import { DailyGoalCardFailedSlotGoalCardFragment } from '@gen';

interface Props {
  card?: DailyGoalCardFailedSlotGoalCardFragment;
  onFailedAnimationEnd?(): void;
}

export function DailyGoalCardFailedSlot({
  card,
  children,
  onFailedAnimationEnd,
}: WithChildren<Props>) {
  return (
    <div
      className={styles.wrapper}
      onAnimationEnd={onFailedAnimationEnd}
    >
      <div>{card ? <GoalCard card={card} /> : children}</div>
      <span className={styles.label}>Card Failed</span>
    </div>
  );
}

DailyGoalCardFailedSlot.fragments = {
  entry: gql`
    fragment DailyGoalCardFailedSlotGoalCard on GoalCardGoalCard {
      ...GoalCardCard
    }
  `,
};
