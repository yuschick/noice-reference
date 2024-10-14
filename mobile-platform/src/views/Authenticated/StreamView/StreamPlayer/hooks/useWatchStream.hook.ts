import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { addEventListener as addNetInfoListener } from '@react-native-community/netinfo';
import { useEffect, useRef } from 'react';

import { useActiveMediaStream, useStreamControls } from '@hooks/useStreamStore.hook';

export function useWatchStream(streamId: string, useNative: boolean): void {
  const activeMediaStream = useActiveMediaStream();
  const streamControls = useStreamControls();
  const hasInitStream = useRef(false);

  useEffect(() => {
    // When active media stream becomes null and the stream has been started,
    // but due to connection loss it's been closed.
    if (activeMediaStream || !useNative) {
      return;
    }

    // Note: For some reason it doesn't fire correctly if set inside of mountEffect.
    // I'm not sure why, it works when we add the listener later on.
    return addNetInfoListener((state) => {
      // Reconnect the stream
      if (state.isConnected && hasInitStream.current) {
        streamControls.watch(streamId, {
          placement: StreamPlacement.STREAM_PLACEMENT_GAME_VIEW,
          rawVideo: true,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMediaStream]);

  useEffect(() => {
    if (!useNative || hasInitStream.current) {
      return;
    }

    hasInitStream.current = true;
    streamControls.watch(streamId, {
      placement: StreamPlacement.STREAM_PLACEMENT_GAME_VIEW,
      rawVideo: true,
    });

    return () => {
      activeMediaStream?.release(true);
      streamControls.stop();
    };
  }, [activeMediaStream, streamControls, streamId, useNative]);
}
