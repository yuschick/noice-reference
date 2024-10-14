import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Notification } from '@noice-com/schemas/notification/notification.pb';
import { Reward } from '@noice-com/schemas/reward/reward.pb';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';

import { SeasonNotificationContent } from '../../content';
import { Context } from '../NotificationProvider';

import { useNotificationSeasonLazyQuery } from '@gen';

gql`
  query NotificationSeason($id: ID!, $userId: ID!) {
    season(id: $id) {
      id
      ...SeasonNotificationContentSeason
    }
  }
`;

interface HookResult {
  onReward(ctx: Notification, ev: Reward): void;
}

type Props = Context['actions'];

export function useRewardNotification({
  addNotification,
  removeNotification,
}: Props): HookResult {
  const { userId } = useAuthenticatedUser();
  const [fetchSeason] = useNotificationSeasonLazyQuery();

  const onReward = debounce(
    useCallback(
      async (ctx: Notification, ev: Reward) => {
        if (!ev.reason?.levelUp?.seasonId) {
          return;
        }

        const { data } = await fetchSeason({
          variables: { id: ev.reason.levelUp.seasonId, userId },
        });

        if (!data?.season || !ctx.id) {
          return;
        }

        addNotification({
          component: {
            type: SeasonNotificationContent,
            props: {
              season: data.season,
              onLinkClick(notificationId: string) {
                removeNotification(notificationId);
              },
            },
          },
        });
      },
      [addNotification, fetchSeason, removeNotification, userId],
    ),
    300,
  );

  return { onReward };
}
