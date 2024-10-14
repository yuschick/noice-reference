import { useClient } from '@noice-com/common-react-core';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { Routes } from '@common/route';
import { StreamViewState, useStreamState, useStreamGame } from '@common/stream';

/**
 * This hook handles channel bans when channel has a stream.
 */
export function useStreamChannelBan(channelId: Nullable<string>) {
  const { streamViewState } = useStreamState();
  const { leaveGame } = useStreamGame();

  const client = useClient();
  const navigate = useNavigate();
  const isInChannelPath =
    streamViewState === StreamViewState.Full ||
    streamViewState === StreamViewState.ChannelPage;

  useEffect(() => {
    if (!channelId) {
      return;
    }

    return client.NotificationService.notifications({
      onChannelUserBanned(_ctx, ev) {
        // If the current channel is not the banned channel, no actions needed
        if (channelId !== ev.channelId) {
          return;
        }

        // Navigate user out from channel pages, replace in history if on channel pages
        navigate(generatePath(Routes.ChannelBan, { channelId: ev.channelId }), {
          replace: isInChannelPath,
        });

        leaveGame();
      },
    });
  }, [channelId, client.NotificationService, isInChannelPath, leaveGame, navigate]);
}
