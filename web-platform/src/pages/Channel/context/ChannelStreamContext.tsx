import { gql } from '@apollo/client';
import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useMatureRatedContentDialog } from '@common/channel';
import { StreamViewState, useStreamState, useStreamGame } from '@common/stream';
import { ChannelStreamContextChannelFragment } from '@gen';

gql`
  fragment ChannelStreamContextChannel on ChannelChannel {
    currentStreamId
    name
  }
`;

interface Context {
  playSolo: boolean;
  joinStream(): Promise<void>;
}

const ChannelStreamContext = createContext<Nullable<Context>>(null);

interface Props {
  channel: ChannelStreamContextChannelFragment;
}

export function ChannelStreamProvider({ channel, children }: WithChildren<Props>) {
  const [playSolo, setPlaySolo] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { joinGame } = useStreamGame();
  const { setStreamViewState } = useStreamState();

  const { onShowMatureRatedContentNotAllowedDialog } = useMatureRatedContentDialog();

  useEffect(() => {
    if (!location.state?.showMatureRatedContentNotAllowed) {
      return;
    }

    // Show the dialog when the state is set, e.g. when stream ends because of the change on mature rated content
    onShowMatureRatedContentNotAllowedDialog();

    // We do not want to trigger this hook when actions are changed, only when location state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.showMatureRatedContentNotAllowed]);

  const joinStream = useCallback(async () => {
    await joinGame(channel.currentStreamId, {
      isSolo: playSolo,
    });

    setStreamViewState(StreamViewState.Full);
    // Navigate to basic channel page
    navigate(`/${channel.name.toLowerCase()}`, { state: { joinGame: true } });

    setPlaySolo(false);
  }, [
    channel.currentStreamId,
    channel.name,
    joinGame,
    navigate,
    playSolo,
    setStreamViewState,
  ]);

  return (
    <ChannelStreamContext.Provider
      value={{
        playSolo,
        joinStream,
      }}
    >
      {children}
    </ChannelStreamContext.Provider>
  );
}

export function useChannelStream() {
  const context = useContext(ChannelStreamContext);

  if (!context) {
    throw new Error('useChannelStream must be used within a ChannelStreamProvider');
  }

  return context;
}
