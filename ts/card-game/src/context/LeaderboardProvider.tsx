import { WithChildren } from '@noice-com/common-ui';
import { Client as NoiceClient } from '@noice-com/platform-client';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useEffect, useState } from 'react';

import { LeaderboardHandler } from '@game-classes';

const noopHandler = new LeaderboardHandler('no-stream');
const LeaderboardContext = createContext<LeaderboardHandler>(noopHandler);

function useLeaderboardData(
  streamId: Nullable<string>,
  client: NoiceClient,
): LeaderboardHandler {
  const [handler, setHandler] = useState<LeaderboardHandler>(noopHandler);

  useEffect(() => {
    // If not stream id, disconnect from handler
    if (!streamId) {
      handler.disconnect();
      return;
    }

    if (streamId !== handler.streamId) {
      setHandler(new LeaderboardHandler(streamId));
    } else if (!handler.active) {
      handler.connect(client);
    }

    // Unsub
    return () => {
      handler.disconnect();
    };
  }, [client, streamId, handler]);

  return handler;
}

export function useLeaderboards(): LeaderboardHandler {
  return useContext(LeaderboardContext);
}

interface ProviderProps {
  client: NoiceClient;
  streamId: Nullable<string>;
}

export function LeaderboardProvider({
  client,
  streamId,
  children,
}: WithChildren<ProviderProps>): JSX.Element {
  const leaderboards = useLeaderboardData(streamId, client);

  return (
    <LeaderboardContext.Provider value={leaderboards}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function MockLeaderboardProvider({ children }: WithChildren) {
  return (
    <LeaderboardContext.Provider value={noopHandler}>
      {children}
    </LeaderboardContext.Provider>
  );
}
