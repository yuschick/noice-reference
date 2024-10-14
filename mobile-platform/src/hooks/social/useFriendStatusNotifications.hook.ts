import { useClient } from '@noice-com/common-react-core';
import { FriendStatusUpdateEvent } from '@noice-com/schemas/friends/friends.pb';

import { useMountEffect } from '@hooks/useMountEffect.hook';

export const useFriendStatusNotifications = (
  onFriendStatusUpdate: (ev: FriendStatusUpdateEvent) => void,
) => {
  const client = useClient();

  useMountEffect(() => {
    client.NotificationService.notifications({
      onFriendStatusUpdate: (_, ev) => {
        onFriendStatusUpdate(ev);
      },
    });
  });
};
