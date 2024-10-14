import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

type Processor = MediaStreamTrackProcessor<VideoFrame>;

export function useMediaStreamVideoTrackProcessor(
  mediaStream: Nullable<MediaStream>,
): Nullable<Processor> {
  const [mediaStreamTrackProcessor, setMediaStreamTrackProcessor] =
    useState<Nullable<Processor>>(null);

  useEffect(() => {
    if (!mediaStream) {
      return;
    }

    const videoTrack = mediaStream.getVideoTracks()[0];
    if (!videoTrack) {
      return;
    }

    const mediaStreamTrackProcessor = new MediaStreamTrackProcessor({
      track: videoTrack,
    });
    setMediaStreamTrackProcessor(mediaStreamTrackProcessor);

    return () => {
      setMediaStreamTrackProcessor(null);
    };
  }, [mediaStream]);

  return mediaStreamTrackProcessor;
}

export function isMediaStreamVideoTrackProcessorSupported(): boolean {
  return typeof MediaStreamTrackProcessor !== 'undefined';
}
