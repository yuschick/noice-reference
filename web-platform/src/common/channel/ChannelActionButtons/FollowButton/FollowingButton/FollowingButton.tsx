import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Button, useAuthenticatedUser, usePopoverMenu } from '@noice-com/common-ui';
import { ComponentProps, MouseEvent } from 'react';

import { FollowingPopoverMenu } from './FollowingPopoverMenu/FollowingPopoverMenu';

import { useChannelFollowerNotificationSettingsQuery } from '@gen';

gql`
  query ChannelFollowerNotificationSettings($channelId: ID!, $userId: ID!) {
    channelFollowerNotificationSettings(channelId: $channelId, userId: $userId) {
      userId
      channelId
      channelLiveNotificationEnabled
    }

    channelNotificationSettings(userId: $userId) {
      userId
      channelLiveNotification {
        emailEnabled
      }
    }
  }
`;

interface Props {
  channelId: string;
  size: ComponentProps<typeof Button>['size'];
  skipPopovers?: boolean;
  onButtonClick(event: MouseEvent<HTMLButtonElement>): void;
  onUnfollowClick(): void;
}

export function FollowingButton({
  channelId,
  size,
  onButtonClick,
  onUnfollowClick: onUnfollowClickProp,
  skipPopovers,
}: Props) {
  const { userId } = useAuthenticatedUser();

  const popover = usePopoverMenu({ placement: 'bottom-end' });

  const { data: notificationData } = useChannelFollowerNotificationSettingsQuery({
    variables: {
      channelId,
      userId,
    },
    // it's safer to fetch the data from the backend rather than assume notification settings using cache only
    fetchPolicy: 'cache-and-network',
  });

  const isChannelNotificationsEnabled =
    !!notificationData?.channelFollowerNotificationSettings
      ?.channelLiveNotificationEnabled;

  const isGlobalNotificationsEnabled =
    !!notificationData?.channelNotificationSettings?.channelLiveNotification.emailEnabled;

  const onFollowingButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onButtonClick(event);

    if (skipPopovers) {
      onUnfollowClickProp();
      return;
    }

    popover.actions.toggle();
  };

  const onUnfollowClick = (event: MouseEvent<HTMLButtonElement>) => {
    onButtonClick(event);
    onUnfollowClickProp();
  };

  return (
    <>
      <Button
        iconEnd={
          !skipPopovers
            ? isChannelNotificationsEnabled
              ? CoreAssets.Icons.Bell
              : CoreAssets.Icons.BellOff
            : undefined
        }
        level="secondary"
        ref={popover.state.popoverMenuTriggerRef}
        size={size}
        onClick={onFollowingButtonClick}
      >
        Following
      </Button>

      {!skipPopovers && (
        <FollowingPopoverMenu
          channelId={channelId}
          isChannelNotificationsEnabled={isChannelNotificationsEnabled}
          isGlobalNotificationsEnabled={isGlobalNotificationsEnabled}
          popoverStore={popover}
          onUnfollowClick={onUnfollowClick}
        />
      )}
    </>
  );
}
