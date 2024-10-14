import { gql } from '@apollo/client';
import { useLazyValue } from '@noice-com/common-ui';
import { GoalCardSlot } from '@noice-com/schemas/goal-card/goal_card.pb';
import { Notification } from '@noice-com/schemas/notification/notification.pb';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';

import { GoalCardNotificationContent } from '../../content';
import { Context } from '../NotificationProvider';

import { useNotificationGoalCardLazyQuery } from '@gen';

gql`
  query NotificationGoalCard($id: ID!) {
    goalCard(id: $id) {
      id
      ...GoalCardNotificationContentGoalCard
    }
  }
`;

interface HookResult {
  onGoalCardProgress(ctx: Notification, ev: GoalCardSlot): void;
}

type Props = Context['actions'];

export function useGoalCardProgressNotification({
  addNotification,
  removeNotification,
}: Props): HookResult {
  // We store the debounced DGC slot callbacks here to reduce the amount of
  // DGC notifications, especially when the happen close to each other
  const debouncedDGCCallbacks = useLazyValue(
    () => new Map<string, (ctx: Notification, ev: GoalCardSlot) => void>(),
  );

  const [fetchGoalCard] = useNotificationGoalCardLazyQuery();

  const onGoalCardProgress = useCallback(
    (ctx: Notification, ev: GoalCardSlot) => {
      // Ignore events without progress data and when there is not really progress (= goal setting event)
      if (!ev.progress || !ev.progress.value || !ev.id) {
        return;
      }

      let onDebouncedGoalCardProgress = debouncedDGCCallbacks.get(ev.id);

      // If we don't have a debounced function for this goal card slot, create one
      if (!onDebouncedGoalCardProgress) {
        onDebouncedGoalCardProgress = debounce(
          async (ctx: Notification, ev: GoalCardSlot) => {
            if (
              !ctx.id ||
              !ev.progress ||
              !ev.progress.value ||
              !ev.progress.percentage ||
              !ev.id ||
              !ev.goalCardId
            ) {
              return;
            }

            const { data } = await fetchGoalCard({
              variables: { id: ev.goalCardId },
            });

            if (!data?.goalCard) {
              return;
            }

            addNotification({
              component: {
                type: GoalCardNotificationContent,
                props: {
                  slot: {
                    __typename: 'GoalCardGoalCardSlot',
                    id: ev.id,
                    progress: {
                      percentage: ev.progress.percentage,
                      value: ev.progress.value,
                      completed: ev.progress.completed ?? false,
                    },
                    goalCard: {
                      ...data.goalCard,
                      description: data.goalCard.description.replace(
                        '{targetValue}',
                        data.goalCard.target.toString(),
                      ),
                    },
                  },
                  onLinkClick(notificationId) {
                    removeNotification(notificationId);
                  },
                },
              },
            });
          },
          500,
        );

        // Store the debounced function for further use
        debouncedDGCCallbacks.set(ev.id, onDebouncedGoalCardProgress);
      }

      onDebouncedGoalCardProgress(ctx, ev);
    },
    [addNotification, debouncedDGCCallbacks, fetchGoalCard, removeNotification],
  );

  return { onGoalCardProgress };
}
