import { useClient } from '@noice-com/common-react-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { ACCOUNT_SUSPENSION_PATH } from '@common/route';
import { useStreamGame } from '@common/stream';

export function usePlatformBan() {
  const { leaveGame, streamId: currentStreamId } = useStreamGame();

  const client = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    return client.NotificationService.notifications({
      async onPlatformUserBanned() {
        navigate(ACCOUNT_SUSPENSION_PATH, {
          replace: true,
          state: { forceBan: true },
        });

        // Refresh the session to prevent a delay between a ban and the banned UI
        client.refreshAccessToken();

        // If there is stream, leave the game too
        if (currentStreamId) {
          await leaveGame();
        }
      },
    });
  }, [client, currentStreamId, leaveGame, navigate]);
}
