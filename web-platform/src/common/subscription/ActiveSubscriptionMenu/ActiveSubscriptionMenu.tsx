import { gql } from '@apollo/client';
import { PopoverMenu, useAnalytics, UsePopoverMenuResult } from '@noice-com/common-ui';
import { MouseEvent, useCallback } from 'react';
import { useLocation } from 'react-router';

import { Routes, SettingsRoutes } from '@common/route';

gql`
  mutation ActiveSubscriptionMenuCancel($channelId: ID!) {
    cancelChannelSubscription(channelId: $channelId) {
      emptyTypeWorkaround
    }
  }

  query ActiveSubscriptionMenuUserBadge($userId: ID!, $channelId: ID!) {
    profile(userId: $userId) {
      userId
      badges(channel_id: $channelId) {
        ...UserBadge
      }
    }
  }
`;

interface Props {
  store: UsePopoverMenuResult;
  showManageSubscriptionsLink?: boolean;
  onCancelSubscription(): void;
}

export function ActiveSubscriptionMenu({
  store,
  showManageSubscriptionsLink,
  onCancelSubscription,
}: Props) {
  const { trackButtonClickEventOnMouseClick } = useAnalytics();
  const location = useLocation();

  const onButtonClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      trackButtonClickEventOnMouseClick(event, 'subscription-menu');
    },
    [trackButtonClickEventOnMouseClick],
  );

  return (
    <>
      <PopoverMenu store={store}>
        {showManageSubscriptionsLink && (
          <PopoverMenu.Link
            state={{ from: location.pathname }}
            to={`${Routes.Settings}/${SettingsRoutes.Subscriptions}`}
            onClick={(event) => {
              onButtonClick(event);
            }}
          >
            Manage subscriptions
          </PopoverMenu.Link>
        )}
        <PopoverMenu.Button
          onClick={(event) => {
            onCancelSubscription();
            onButtonClick(event);
          }}
        >
          Cancel subscription
        </PopoverMenu.Button>
      </PopoverMenu>
    </>
  );
}
