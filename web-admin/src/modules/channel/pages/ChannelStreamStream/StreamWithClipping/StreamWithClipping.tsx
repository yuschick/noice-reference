import { useClient } from '@noice-com/common-react-core';
import { HlsPlayer, LoadingSpinner } from '@noice-com/common-ui';
import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { ClipTimeController } from './ClipTimeController';
import styles from './StreamWithClipping.module.css';

import { Button } from '@common/button';
import { showSnackbar } from '@common/snackbar';

interface Props {
  channelId: string;
  streamId: string;
  offset: number;
}

const MAX_CLIP_LENGTH = 60 * 10;

const getCurrentLength = (startTime: number, endTime: number) => {
  const lengthInSeconds = Math.ceil(endTime - startTime);
  const minutes = Math.floor(lengthInSeconds / 60);

  if (lengthInSeconds < 0) {
    return 'negative, that can not work';
  }

  if (minutes > 0) {
    return `${minutes} min ${lengthInSeconds % 60} s`;
  }

  return `${lengthInSeconds} s`;
};

export function StreamWithClipping({ channelId, offset, streamId }: Props) {
  const client = useClient();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [isGeneratingClip, setIsGeneratingClip] = useState(false);

  const beforeUnloadHandler = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (isGeneratingClip) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    }

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [beforeUnloadHandler, isGeneratingClip]);

  useLayoutEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    const onVideoLoaded = () => {
      setVideoDuration(videoElement.duration ?? 0);
    };

    videoElement.addEventListener('loadedmetadata', onVideoLoaded);

    return () => {
      videoElement?.removeEventListener('loadedmetadata', onVideoLoaded);
    };
  }, []);

  const onSetStartTime = () => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.pause();
    setStartTime(videoRef.current.currentTime);
  };

  const onStartTimeChange = (value: number) => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.currentTime = value;
    setStartTime(videoRef.current.currentTime);
  };

  const onSetEndTime = () => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.pause();
    setEndTime(videoRef.current.currentTime);
  };

  const onEndTimeChange = (value: number) => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.currentTime = value;
    setEndTime(videoRef.current.currentTime);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsGeneratingClip(true);

    try {
      const url = await client.RecordingService.encodeRecording(streamId, {
        clip: {
          start: `${startTime}s`,
          end: `${endTime}s`,
        },
      });

      setIsGeneratingClip(false);
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      showSnackbar('positive', 'Clip generated successfully');

      const link = document.createElement('a');
      link.setAttribute('download', '');
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showSnackbar('error', `Failed to generate clip: ${error.message}`);
      setIsGeneratingClip(false);
    }
  };

  return (
    <>
      <HlsPlayer
        channelId={channelId}
        offset={offset}
        ref={videoRef}
        streamId={streamId}
      />

      <form
        className={styles.streamClipForm}
        onSubmit={onSubmit}
      >
        <ClipTimeController
          isDisabled={isGeneratingClip}
          label="Clip Start"
          value={startTime}
          videoDuration={videoDuration}
          onChange={onStartTimeChange}
          onSet={onSetStartTime}
        />

        <ClipTimeController
          isDisabled={isGeneratingClip}
          label="Clip End"
          max={startTime + MAX_CLIP_LENGTH}
          min={startTime + 1}
          value={endTime}
          videoDuration={videoDuration}
          onChange={onEndTimeChange}
          onSet={onSetEndTime}
        />

        {isGeneratingClip ? (
          <div className={styles.generatingWrapper}>
            <LoadingSpinner size="sm" />
            Generating clip...
          </div>
        ) : (
          <Button
            disabled={isGeneratingClip}
            text="Generate Clip"
            type="submit"
          />
        )}

        <div className={styles.guideWrapper}>
          Current clip length is{' '}
          <span className={styles.lengthValue}>
            {getCurrentLength(startTime, endTime)}
          </span>{' '}
          (maximum is {MAX_CLIP_LENGTH / 60} min).
        </div>
      </form>
    </>
  );
}
