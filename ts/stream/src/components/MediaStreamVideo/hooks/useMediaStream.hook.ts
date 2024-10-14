import {
  useSoundController,
  useAnalytics,
  useAuthenticatedUser,
  useKeyContentLoadMetadata,
} from '@noice-com/common-ui';
import { AnalyticsEventClientStreamVideoEventEventType } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { RefObject, useEffect, useRef, useState } from 'react';

import { useStreamAPIInternal } from '@stream-context';

const logger = makeLoggers('useMediaStream');

interface HookResult {
  videoElementRef: RefObject<HTMLVideoElement>;
  loading: boolean;
  needsInteractionToUnmute: boolean;
  videoPlayFailed: boolean;
  play(): Promise<void>;
  unmute(): Promise<void>;
}

interface Props {
  stream: Nullable<MediaStream>;
  isMutedStream?: boolean;
  egressType?: string;
  livepeerUrl?: string;
  signalFirstFrame: () => Promise<void>;
}

export function useMediaStream({
  stream,
  isMutedStream,
  egressType,
  livepeerUrl,
  signalFirstFrame,
}: Props): HookResult {
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const soundController = useSoundController();
  const [loading, setLoading] = useState<boolean>(true);
  const [needsInteractionToUnmute, setNeedsInteractionToUnmute] = useState(false);
  const [videoPlayFailed, setVideoPlayFailed] = useState(false);
  const { emitAPIEvent } = useStreamAPIInternal();
  const { trackEvent } = useAnalytics();
  const { userId } = useAuthenticatedUser();
  const setKeyContentLoadMetadata = useKeyContentLoadMetadata();

  useEffect(() => {
    const videoElement = videoElementRef.current;
    if (!videoElement) {
      return;
    }

    const onLoadedData = () => {
      setLoading(false);
      emitAPIEvent('onStreamLoading', false);
    };

    const createEventListener = (
      event: AnalyticsEventClientStreamVideoEventEventType,
    ) => {
      return () => {
        trackEvent({
          clientStreamVideoEvent: {
            eventType: event,
          },
        });
      };
    };

    let firstFrameSignaled = false;
    const startEvent = async () => {
      trackEvent({
        clientStreamVideoEvent: {
          eventType: AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_PLAY,
        },
      });

      if (firstFrameSignaled) {
        return;
      }
      trackEvent({
        clientStreamVideoEvent: {
          eventType:
            AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_FIRST_VIDEO_FRAME,
        },
      });
      if (!('requestVideoFrameCallback' in videoElement)) {
        await signalFirstFrame();
      }
      firstFrameSignaled = true;

      setVideoPlayFailed(false);
    };

    const pauseEvent = () => {
      trackEvent({
        clientStreamVideoEvent: {
          eventType: AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_PAUSE,
        },
      });

      setVideoPlayFailed(true);
    };
    const endedEvent = createEventListener(
      AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_END,
    );
    const suspendEvent = () => {
      trackEvent({
        clientStreamVideoEvent: {
          eventType: AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_SUSPEND,
        },
      });

      setVideoPlayFailed(true);
    };
    const errorEvent = createEventListener(
      AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_ERROR,
    );
    const stalled = createEventListener(
      AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_STALLED,
    );
    const muted = () => {
      trackEvent({
        clientStreamVideoEvent: {
          eventType: AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_MUTED,
        },
      });

      if (isMutedStream) {
        return;
      }

      setNeedsInteractionToUnmute(true);
    };

    const unmuted = () => {
      trackEvent({
        clientStreamVideoEvent: {
          eventType: AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_UNMUTED,
        },
      });

      setNeedsInteractionToUnmute(false);
    };

    const playingEvent = () => {
      setVideoPlayFailed(false);
    };

    videoElement.addEventListener('loadeddata', onLoadedData);
    videoElement.addEventListener('play', startEvent);
    videoElement.addEventListener('playing', playingEvent);
    videoElement.addEventListener('pause', pauseEvent);
    videoElement.addEventListener('ended', endedEvent);
    videoElement.addEventListener('suspend', suspendEvent);
    videoElement.addEventListener('error', errorEvent);
    videoElement.addEventListener('stalled', stalled);
    videoElement.addEventListener('muted', muted);
    videoElement.addEventListener('unmuted', unmuted);

    let handleFirstFrame = true;
    if ('requestVideoFrameCallback' in videoElement) {
      // This is somewhat overkill but at least its the most accurate thing we can do
      videoElement.requestVideoFrameCallback(async () => {
        if (!handleFirstFrame) {
          return;
        }

        trackEvent({
          clientStreamVideoEvent: {
            eventType:
              AnalyticsEventClientStreamVideoEventEventType.EVENT_TYPE_FIRST_VIDEO_FRAME,
          },
        });

        await signalFirstFrame();
      });
    }

    return () => {
      handleFirstFrame = false;
      videoElement.removeEventListener('loadeddata', onLoadedData);
      videoElement.removeEventListener('play', startEvent);
      videoElement.removeEventListener('pause', pauseEvent);
      videoElement.removeEventListener('playing', playingEvent);
      videoElement.removeEventListener('ended', endedEvent);
      videoElement.removeEventListener('suspend', suspendEvent);
      videoElement.removeEventListener('error', errorEvent);
      videoElement.removeEventListener('stalled', stalled);
    };
  }, [videoElementRef, signalFirstFrame, trackEvent, emitAPIEvent, isMutedStream]);

  useEffect(() => {
    const handleAudioUnlocked = () => setNeedsInteractionToUnmute(false);

    soundController.addListener('audio-unlocked', handleAudioUnlocked);
    return () => {
      soundController.removeListener('audio-unlocked', handleAudioUnlocked);
    };
  }, [soundController]);

  useEffect(() => {
    if (!stream || !soundController) {
      return;
    }

    setLoading(true);
    emitAPIEvent('onStreamLoading', true);

    const playVideo = async (video: HTMLVideoElement) => {
      try {
        await video.play();
      } catch (e) {
        logger.logWarn("Couldn't play video", e);
      }
    };

    const playAudio = async (video: HTMLVideoElement, audio: MediaStreamAudioTrack) => {
      // If stream is muted, do not register audio
      if (isMutedStream) {
        return;
      }

      try {
        // Throws an error when trying to unmute but can't
        await soundController.registerStream(audio, video);
      } catch (e) {
        logger.logWarn("Couldn't register audio", e);

        // Sometimes video is paused when error, just in case hit play again
        if (video.paused) {
          await playVideo(video);
        }
      }
    };

    const bindStream = async () => {
      const videoPlayer = videoElementRef.current;

      if (!videoPlayer) {
        return;
      }

      try {
        videoPlayer.srcObject = stream;
      } catch (e) {
        // @ts-expect-error This is only here for backwards-compat, and is safe to call with the media stream if this ever runs.
        // @see: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL#using_object_urls_for_media_streams
        videoPlayer.src = URL.createObjectURL(stream);
      }

      const [audio] = stream.getAudioTracks();

      if (!audio) {
        return;
      }

      videoPlayer.muted = true;
      await playVideo(videoPlayer);
      await playAudio(videoPlayer, audio);

      setKeyContentLoadMetadata('muted', videoPlayer.muted.toString());
      setKeyContentLoadMetadata('autoplay_failed', videoPlayer.paused.toString());

      trackEvent({
        clientStreamPlayback: {
          isIntentionallyMutedPlayback: isMutedStream,
          wasAutoUnmuteSuccessful: !videoPlayer.muted,
          wasVideoAutoplaySuccessful: !videoPlayer.paused,
        },
      });

      // The Fallbacks

      // Handle situation where MEI in browser
      // prevented the video from playing
      if (videoPlayer.paused) {
        setVideoPlayFailed(true);
        return;
      }

      if (isMutedStream) {
        return;
      }

      // Sound ok, all good
      if (!videoPlayer.muted) {
        return;
      }

      // Needs user interaction to be able to unmute
      setNeedsInteractionToUnmute(true);
    };

    bindStream();
  }, [
    stream,
    isMutedStream,
    soundController,
    emitAPIEvent,
    trackEvent,
    setKeyContentLoadMetadata,
  ]);

  useEffect(() => {
    if (!egressType || !livepeerUrl) {
      return;
    }

    if (egressType !== 'livepeer') {
      return;
    }

    const videoPlayer = videoElementRef.current;

    if (!videoPlayer) {
      return;
    }

    const promise = import('@livepeer/core-web/browser').then((module) => {
      const { addMediaMetrics } = module;
      const { destroy } = addMediaMetrics(videoPlayer, {
        // specify the source URL of the video, which should include a playbackId.
        // this should only be used when using a custom video player that sets a `blob:...` URL or no `src` on the video element.
        src: livepeerUrl,
        // specify a unique viewer ID for tracking purposes
        viewerId: userId,
        // monitor when the metrics fails to report
        onError: (error) => {
          logger.logWarn('metrics collection error:', error);
        },
      });

      return destroy;
    });

    return () => {
      promise
        .then((destroy) => destroy())
        .catch((e) => logger.logWarn('Failed to destroy metrics', e));
    };
  }, [egressType, livepeerUrl, userId]);

  const play = async () => {
    if (!videoElementRef.current) {
      return;
    }

    try {
      await videoElementRef.current.play();
      setVideoPlayFailed(false);
    } catch (e) {
      setVideoPlayFailed(true);
    }
  };

  const unmute = async () => {
    if (!videoElementRef.current) {
      return;
    }

    videoElementRef.current.muted = false;
    setNeedsInteractionToUnmute(false);
  };

  return {
    videoElementRef,
    loading,
    needsInteractionToUnmute,
    videoPlayFailed,
    play,
    unmute,
  };
}
