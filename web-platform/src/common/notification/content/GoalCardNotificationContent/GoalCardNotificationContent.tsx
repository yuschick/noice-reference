import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { HorizontalProgressBar, ButtonLink, Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './GoalCardNotificationContent.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';
import { Routes } from '@common/route';
import { GoalCardNotificationContentGoalCardSlotFragment } from '@gen';

gql`
  fragment GoalCardNotificationContentGoalCardSlot on GoalCardGoalCardSlot {
    id
    progress {
      percentage
      value
      completed
    }
    goalCard {
      ...GoalCardNotificationContentGoalCard
    }
  }

  fragment GoalCardNotificationContentGoalCard on GoalCardGoalCard {
    id
    description
    target
  }
`;

interface Props extends NotificationComponentBaseProps {
  slot: GoalCardNotificationContentGoalCardSlotFragment;
  onLinkClick(notificationId: string): void;
}

export function GoalCardNotificationContent({
  theme = 'light',
  slot,
  onLinkClick,
  notificationId,
}: Props) {
  const { progress, goalCard } = slot;

  if (!progress || !goalCard) {
    return null;
  }

  return (
    <div
      className={classNames(styles.wrapper, styles[theme], {
        [styles.completed]: progress.completed,
      })}
    >
      <Icon
        className={styles.icon}
        icon={CoreAssets.Icons.DailyGoals}
      />

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span>{goalCard.description}</span>

          <span className={styles.progress}>
            {progress.completed ? 'Completed' : `(${progress.value}/${goalCard.target})`}
          </span>
        </div>

        {progress.completed ? (
          <ButtonLink
            size="sm"
            to={Routes.DailyGoals}
            variant="cta"
            onClick={() => onLinkClick(notificationId)}
          >
            Go collect your reward
          </ButtonLink>
        ) : (
          <HorizontalProgressBar
            className={styles.progressBar}
            max={goalCard.target}
            progress={progress.value}
            title="Progress in goal card"
          />
        )}
      </div>
    </div>
  );
}
