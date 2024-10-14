import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Button, IconButton, useAuthenticatedUser } from '@noice-com/common-ui';

import {
  ChannelChannelRole,
  useGiftSubscriptionToCommunityButtonRolesQuery,
} from '@social-gen';
import { useGiveGiftButton } from '@social-hooks';
import { GiftTarget } from '@social-types';

type Props = {
  className?: string;
  channelId: string;
  title?: string;
  size: React.ComponentProps<typeof Button>['size'];
  level: React.ComponentProps<typeof Button>['level'];
  theme?: React.ComponentProps<typeof Button>['theme'];
};

gql`
  query GiftSubscriptionToCommunityButtonRoles($userId: ID!, $channelId: ID!) {
    userChannelRoles(userId: $userId, channelId: $channelId) {
      roles
    }
  }
`;

export const GiftSubscriptionToCommunityButton = ({
  className,
  channelId,
  title,
  size,
  level,
  theme,
}: Props) => {
  const { userId, isFullAccount } = useAuthenticatedUser();

  const { data, loading } = useGiftSubscriptionToCommunityButtonRolesQuery({
    variables: { channelId: channelId, userId },
    skip: !isFullAccount,
  });
  const roles = data?.userChannelRoles?.roles || [];
  const isOwnChannel = roles.some(
    (role) => role === ChannelChannelRole.ChannelRoleStreamer,
  );

  const { showGiftButton, onGiftButtonClick } = useGiveGiftButton({
    target: GiftTarget.Community,
    channelId,
  });

  if (!isFullAccount || !showGiftButton || loading || isOwnChannel) {
    return null;
  }

  return (
    <div className={className}>
      {title ? (
        <Button
          iconStart={CoreAssets.Icons.Gift}
          level={level}
          size={size}
          theme={theme}
          onClick={onGiftButtonClick}
        >
          {title}
        </Button>
      ) : (
        <IconButton
          icon={CoreAssets.Icons.Gift}
          label="Gift subscription"
          level={level}
          size={size}
          theme={theme}
          onClick={onGiftButtonClick}
        />
      )}
    </div>
  );
};
