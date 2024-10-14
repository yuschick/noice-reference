import { useClient } from '@noice-com/common-react-core';
import { SetTimeoutId, useAnalytics } from '@noice-com/common-ui';
import { IWatchSession } from '@noice-com/platform-client';
import {
  ArenaConfig,
  AvatarConfigs,
  AvatarConfigsAvatar,
} from '@noice-com/schemas/rendering/config.pb';
import {
  BoosterRequestedEvent,
  BoosterUsedEvent,
  CardSetActiveEvent,
  ChatMessageSentEvent,
  EmojiEvent,
  EmoteEvent,
  GroupCheerEvent,
  MatchEndEvent,
} from '@noice-com/schemas/rendering/events.pb';
import {
  ContentMode,
  Transition,
  TransitionTarget,
} from '@noice-com/schemas/rendering/transitions.pb';
import {
  QualityLayer,
  StreamPlacement,
  WatchEventAvatarPlacement,
  WatchEventAvatarRemoval,
  WatchEventICECandidate,
  WatchEventInitPeerConnection,
  WatchEventKeyValueOp,
  WatchEventServerShuttingDown,
  WatchEventSignal,
  WatchEventQualityLayerSelected,
} from '@noice-com/schemas/stream/egress.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

import { StreamEventEmitter } from '../classes';

import { useStreamSettings, useStreamAPIInternal } from '@stream-context';
import { StreamError, StreamProps } from '@stream-types';

const { log } = makeLoggers('stream:useStreamConnection');

interface HookResult {
  stream: Nullable<MediaStream>;
  streamProps: StreamProps;
  eventEmitter: StreamEventEmitter;
  egressType: string | undefined;
  livepeerUrl: string | undefined;
  signalFirstFrame: () => Promise<void>;
}

interface Props {
  streamId: string;
  groupId: Nullable<string>;
  rawVideo?: boolean;
  onErrorCallback?: (err: StreamError) => void;

  skip?: boolean;
  placement: StreamPlacement;
}

const streamPropsDefaults = {
  arena: {
    value: null,
    ageMs: -1,
  },
  avatars: {
    value: null,
    ageMs: -1,
  },
  contentMode: {
    value: null,
    ageMs: -1,
  },
  transition: {
    value: null,
    ageMs: -1,
  },
};

const eventEmitter = new StreamEventEmitter();

export function useStreamConnection({
  streamId,
  groupId,
  rawVideo,
  onErrorCallback,
  skip,
  placement,
}: Props): HookResult {
  const client = useClient();
  const { trackEvent } = useAnalytics();

  const [stream, setStream] = useState<Nullable<MediaStream>>(null);
  const [session, setSession] = useState<Nullable<IWatchSession>>(null);
  const [streamProps, setStreamProps] = useState<StreamProps>(streamPropsDefaults);
  const [egressType, setEgressType] = useState<string | undefined>(undefined);
  const [livepeerUrl, setLivepeerUrl] = useState<string | undefined>(undefined);
  const { emitAPIEvent } = useStreamAPIInternal();
  const { setStreamQualities, streamQuality } = useStreamSettings();

  useEffect(() => {
    if (!streamQuality) {
      return;
    }

    session?.selectQualityLayer(streamQuality);
  }, [streamQuality, session]);

  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const backoffTime = useRef(1);

  const signalFirstFrame = useCallback(async () => {
    await session?.signalFirstFrame();
  }, [session]);

  useEffect(() => {
    emitAPIEvent('onContentMode', streamProps.contentMode);
  }, [streamProps.contentMode, emitAPIEvent]);

  useEffect(() => {
    if (skip) {
      return;
    }

    let timeoutId: Nullable<SetTimeoutId> = null;

    const retry = (reason: string) => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          trackEvent({
            clientStreamConnectionRetry: {
              streamId,
              rawVideo: rawVideo || false,
              reason,
              reconnectAttempt,
            },
          });
          setReconnectAttempt((current) => current + 1);
          backoffTime.current = backoffTime.current + 1;
        }, backoffTime.current * 1000);
      }
    };

    trackEvent({
      clientStreamConnectionWatch: {
        streamId,
        rawVideo: rawVideo || false,
        reconnectAttempt,
      },
    });

    const session = client.StreamingService.watch(
      streamId,
      {
        raw: !!rawVideo,
      },
      {
        onMediaStream(
          _: IWatchSession,
          stream: MediaStream,
          qualityLayers: QualityLayer[],
        ) {
          const audioTracksAmount = stream.getAudioTracks().length;
          const videoTracksAmount = stream.getVideoTracks().length;

          trackEvent({
            clientStreamConnectionMediaStream: {
              streamId,
              rawVideo: rawVideo || false,
              audioTracks: audioTracksAmount,
              videoTracks: videoTracksAmount,
            },
          });

          if (!audioTracksAmount || !videoTracksAmount) {
            log(
              `Stream didn't contain both audio and video tracks: audio=${!!audioTracksAmount} video=${!!videoTracksAmount}. Retrying.`,
            );
            retry(
              !audioTracksAmount
                ? 'No audio tracks on media stream'
                : 'No video tracks on media stream',
            );
            return;
          }

          backoffTime.current = 1;
          setStreamQualities(qualityLayers);
          setStream(stream);
        },

        onEnd(_: IWatchSession, err?: Error) {
          // Do not retry when no error, it was closed on purpose
          if (!err) {
            return;
          }

          // Do nothing if error is too many viewers
          if (err.message === 'too many viewers') {
            onErrorCallback?.(StreamError.TooManyViewers);
            return;
          }

          retry(`Stream ended with an error: ${err.message}}`);
        },

        onConnectionStateChange(
          connectState: RTCIceConnectionState,
          _gatherState: RTCIceGatheringState,
          egressType: string,
          livepeerUrl: string,
        ) {
          if (connectState === 'new') {
            setEgressType(egressType);
            setLivepeerUrl(livepeerUrl);
          }
        },

        onKeyValueOp(_: IWatchSession, ev: WatchEventKeyValueOp) {
          const { op } = ev;

          if (!op?.key || !op?.value) {
            return;
          }

          // @todo: We will need this
          const ageMs = parseInt(op.ageMs || '0', 10);
          const value = JSON.parse(op.value);

          switch (op.key) {
            case 'arena':
              setStreamProps((prev) => {
                return { ...prev, arena: { value: value as ArenaConfig, ageMs } };
              });
              break;
            case 'avatars':
              setStreamProps((prev) => {
                return { ...prev, avatars: { value: value as AvatarConfigs, ageMs } };
              });
              break;
            case 'content_mode':
              setStreamProps((prev) => {
                const prop = { value: value as ContentMode, ageMs };

                return { ...prev, contentMode: prop };
              });
              break;
            case 'transition':
              setStreamProps((prev) => {
                const transition = value as Transition;
                // If transition target is NONE, just set the KVO Object value to null
                const prop =
                  transition.target === TransitionTarget.TARGET_NONE
                    ? { value: null, ageMs }
                    : { value: transition, ageMs };

                return { ...prev, transition: prop };
              });
              break;
          }
        },

        onSignal(_: IWatchSession, ev: WatchEventSignal) {
          if (!ev.signal) {
            return;
          }

          const signal = JSON.parse(ev.signal);

          if (signal.type === 'EmojiEvent') {
            eventEmitter.emit('onEmojiEvent', signal.event as EmojiEvent);
            return;
          }

          if (signal.type === 'EmoteEvent') {
            eventEmitter.emit('onEmoteEvent', signal.event as EmoteEvent);
            return;
          }

          if (signal.type === 'CardSetActiveEvent') {
            eventEmitter.emit('onCardSetActiveEvent', signal.event as CardSetActiveEvent);
            return;
          }

          if (signal.type === 'BoosterRequestedEvent') {
            eventEmitter.emit(
              'onBoosterRequestedEvent',
              signal.event as BoosterRequestedEvent,
            );
            return;
          }

          if (signal.type === 'BoosterUsedEvent') {
            eventEmitter.emit('onBoosterUsedEvent', signal.event as BoosterUsedEvent);
            return;
          }

          if (signal.type === 'ChatMessageSentEvent') {
            eventEmitter.emit(
              'onChatMessageSentEvent',
              signal.event as ChatMessageSentEvent,
            );
            return;
          }

          if (signal.type === 'GroupCheerEvent') {
            eventEmitter.emit('onGroupCheerEvent', signal.event as GroupCheerEvent);
            return;
          }

          if (signal.type === 'MatchStartEvent') {
            eventEmitter.emit('onMatchStartEvent');
            return;
          }

          if (signal.type === 'MatchEndEvent') {
            eventEmitter.emit('onMatchEndEvent', signal.event as MatchEndEvent);
            return;
          }

          if (signal.type === 'AvatarUpdateEvent') {
            eventEmitter.emit('onAvatarUpdateEvent', signal.event as AvatarConfigsAvatar);
            return;
          }
        },

        onAvatarPlacement(_: IWatchSession, _ev: WatchEventAvatarPlacement) {
          // not implemented
        },

        onAvatarRemoval(_: IWatchSession, _ev: WatchEventAvatarRemoval) {
          // not implemented
        },

        onServerShuttingDown(_: IWatchSession, _ev: WatchEventServerShuttingDown) {
          retry('Server shutting down');
        },

        onIceCandidate(_: IWatchSession, _ev: WatchEventICECandidate) {
          // not implemented
        },

        onInitPeerConnection(_: IWatchSession, _ev: WatchEventInitPeerConnection) {
          // not implemented
        },
        onQualityLayerSelected: (
          _: IWatchSession,
          _ev: WatchEventQualityLayerSelected,
        ) => {
          // not implemented
        },
      },
      trackEvent,
      placement,
    );

    setSession(session);

    return () => {
      session.close();

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    client.StreamingService,
    rawVideo,
    streamId,
    reconnectAttempt,
    setStreamQualities,
    onErrorCallback,
    trackEvent,
    skip,
    placement,
  ]);

  useEffect(() => {
    if (session && groupId) {
      session.selectGroup(groupId);
    }
  }, [session, groupId]);

  return {
    stream,
    streamProps,
    eventEmitter,
    egressType,
    livepeerUrl,
    signalFirstFrame,
  };
}
