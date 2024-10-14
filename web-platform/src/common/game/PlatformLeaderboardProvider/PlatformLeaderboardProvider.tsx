import { LeaderboardProvider } from '@noice-com/card-game';
import { useClient } from '@noice-com/common-react-core';
import { WithChildren } from '@noice-com/common-ui';

import { useStreamGame } from '@common/stream';

export function PlatformLeaderboardProvider({ children }: WithChildren) {
  const { streamId } = useStreamGame();
  const client = useClient();

  return (
    <LeaderboardProvider
      client={client}
      streamId={streamId ?? null}
    >
      {children}
    </LeaderboardProvider>
  );
}
