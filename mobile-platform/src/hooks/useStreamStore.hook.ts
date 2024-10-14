import { MediaStream } from '@livekit/react-native-webrtc';
import { Client, IWatchSession } from '@noice-com/platform-client';
import { QualityLayer, StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { EventEmitter, ListenerFn } from 'eventemitter3';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { useMountEffect } from './useMountEffect.hook';

import { Analytics } from '@lib/Analytics';

const { logError, logInfo } = makeLoggers('StreamStore');

interface StreamEvents {
  onServerShutdown: [];
  onStreamEnd: [error?: Error];
}

type Listener<EventName extends keyof StreamEvents = keyof StreamEvents> = (
  eventName: EventName,
  listener: ListenerFn<StreamEvents[EventName]>,
) => () => void;

interface WatchOpts {
  rawVideo?: boolean;
  placement: StreamPlacement;
}

interface StreamState {
  streamId: string | null;
  mediaStream: MediaStream | null;

  qualityLayers: QualityLayer[];
  selectedQualityLayer: QualityLayer | null;
  retryAttempt: number;

  init: (client: Client) => void;
  addListener: Listener;
  watch: (streamId: string, opts: WatchOpts) => void;
  stop: () => void;
  selectQualityLayer: (qualityLayer: QualityLayer) => void;
}

export const useStreamStore = create<StreamState>((set) => {
  const emitter = new EventEmitter<StreamEvents>();
  let client: Client;
  let session: IWatchSession | null = null;
  let timeoutRef: Nullable<number> = null;

  const withRetry = (fn: (retry: () => void) => void) => {
    let retryAttempt = 0;
    let backOffTime = 1;

    const retry = () => {
      timeoutRef = setTimeout(() => {
        retryAttempt += 1;
        backOffTime += 1;
        set({ retryAttempt });
        fn(retry);
      }, backOffTime * 1000);
    };

    set({ retryAttempt });
    fn(retry);
  };

  const stop = (currentSession: IWatchSession) => {
    logInfo('stop called automatically');

    if (timeoutRef !== null) {
      clearTimeout(timeoutRef);
      timeoutRef = null;
    }

    currentSession?.close();

    session?.close();
    session = null;
    set({
      streamId: null,
      mediaStream: null,
      retryAttempt: 0,
    });
  };

  return {
    streamId: null,
    mediaStream: null,
    retryAttempt: 0,
    selectedQualityLayer: null,
    qualityLayers: [],

    init: (cli) => {
      client = cli;
    },
    addListener: (eventName, handler) => {
      emitter.addListener(eventName, handler);
      return () => {
        emitter.removeListener(eventName, handler);
      };
    },
    watch: (streamId, { placement, rawVideo = false }) => {
      if (!client) {
        logError(`Stream store must be initialized with client!`);
        return;
      }

      // Incase an existing session is running we'll stop it first
      // Otherwise we'll get layered streams running, removing this will cause that issue.
      if (session) {
        stop(session);
      }

      logInfo(`attempting to connect to stream ${streamId}`, new Date().toLocaleString());
      withRetry((retry) => {
        logInfo(`retrying connection ${streamId}....`, new Date().toLocaleString());

        session = client.StreamingService.watch(
          streamId,
          {
            raw: !!rawVideo,
          },
          {
            onMediaStream(_, mediaStream, qualityLayers) {
              logInfo('got media stream', new Date().toLocaleString());
              set({
                streamId,
                mediaStream,
                qualityLayers,
                selectedQualityLayer: qualityLayers[0],
              });
            },
            onEnd(sess, err) {
              logInfo('media stream ended', err);
              emitter.emit('onStreamEnd', err);

              // If we don't have an error, it was closed on purpose
              if (!err) {
                stop(sess);
                return;
              }

              logError(err);
              retry();
            },
            onConnectionStateChange(sess, connectionState, _gatherState) {
              logInfo('connection state changed', connectionState);
              // This state is ran after disconnected upon failure to reconnect.
              // At that point we will kill the stream until a connection is established again.
              if (connectionState === 'failed') {
                stop(sess);
              }
            },
            onAvatarPlacement() {
              // not implemented
            },
            onAvatarRemoval() {
              // not implemented
            },
            onServerShuttingDown() {
              logInfo('rtc server shutting down');
              emitter.emit('onServerShutdown');
              retry();
            },
            onKeyValueOp() {
              // not implemented
            },
            onSignal() {
              // not implemented
            },
            onIceCandidate() {
              // not implemented
            },
            onQualityLayerSelected() {
              // not implemented
            },
            onInitPeerConnection() {
              // not implemented
            },
          },
          (payload) => {
            Analytics.trackEvent(payload);
          },
          placement,
        );
      });
    },
    stop: () => !!session && stop(session),
    selectQualityLayer: (qualityLayer: QualityLayer) => {
      session?.selectQualityLayer(qualityLayer);
      set({ selectedQualityLayer: qualityLayer });
    },
  };
});

export const useInitStreamStore = (client: Client) => {
  const init = useStreamStore((state) => state.init);

  useMountEffect(() => {
    init(client);
  });
};

export const useStreamControls = () => {
  return useStreamStore(
    useShallow(({ watch, stop, addListener, selectQualityLayer }) => ({
      watch,
      stop,
      addListener,
      selectQualityLayer,
    })),
  );
};

export const useActiveStreamId = () => {
  return useStreamStore((state) => state.streamId);
};

export const useActiveMediaStream = () => {
  return useStreamStore((state) => state.mediaStream);
};

export const useQualityLayers = () => {
  return useStreamStore(
    useShallow(({ qualityLayers, selectedQualityLayer, selectQualityLayer }) => ({
      qualityLayers,
      selectedQualityLayer,
      selectQualityLayer,
    })),
  );
};
