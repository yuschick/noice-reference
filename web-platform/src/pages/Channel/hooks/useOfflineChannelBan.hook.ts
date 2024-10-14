import { useClient } from '@noice-com/common-react-core';
import { useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { Routes } from '@common/route';
import { useStreamGame } from '@common/stream';

/**
 * This hook handles channel bans when channel is offline.
 */
export function useOfflineChannelBan(channelId: Nullable<string>) {
  const { userId } = useAuthentication();
  const { streamId } = useStreamGame();
  const client = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!channelId || !userId) {
      return;
    }

    return client.NotificationService.notifications({
      async onChannelUserBanned(_ctx, ev) {
        // Game view will handle the ban event when there is stream going on
        if (streamId) {
          return;
        }

        // If the current channel is not the banned channel, no actions needed
        if (channelId !== ev.channelId) {
          return;
        }

        // Navigate user out from channel pages, replace in history if on channel pages
        navigate(generatePath(Routes.ChannelBan, { channelId: ev.channelId }), {
          replace: true,
        });
      },
    });
  }, [channelId, client.NotificationService, navigate, streamId, userId]);
}
