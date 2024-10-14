import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { CHANNEL_STORE_ANCHOR } from '@common/route';
import { StreamViewState, useStreamState } from '@common/stream';

export function useChannelStoreLinkStreamView() {
  const { setStreamViewState, streamViewState } = useStreamState();
  const { hash } = useLocation();

  useEffect(() => {
    if (streamViewState !== StreamViewState.Full) {
      return;
    }

    if (hash === `#${CHANNEL_STORE_ANCHOR}`) {
      setStreamViewState(StreamViewState.ChannelPage);
    }
  }, [hash, setStreamViewState, streamViewState]);
}
