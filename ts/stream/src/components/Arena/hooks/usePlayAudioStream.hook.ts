import { useSoundController } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useState } from 'react';

interface HookResponse {
  loading: boolean;
  needsInteractionToUnmute: boolean;
  play(): Promise<void>;
}

export function usePlayAudioStream(
  mediaStream: Nullable<MediaStream>,
  isMuted?: boolean,
): HookResponse {
  const soundController = useSoundController();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [needsInteractionToUnmute, setNeedsInteractionToUnmute] = useState(false);

  useEffect(() => {
    if (!mediaStream) {
      return;
    }

    const a = new Audio();
    a.srcObject = mediaStream;
    a.autoplay = true;

    soundController.registerStream(mediaStream.getAudioTracks()[0], a).catch(() => {
      setNeedsInteractionToUnmute(true);
    });

    setAudio(a);

    return () => {
      a.pause();
      a.srcObject = null;
      setAudio(null);
    };
  }, [mediaStream, soundController]);

  useEffect(() => {
    if (!audio) {
      return;
    }

    audio.muted = isMuted ?? false;
  }, [audio, isMuted]);

  const play = useCallback(async () => {
    if (!audio) {
      return;
    }

    await audio.play();
  }, [audio]);

  useEffect(() => {
    const handleAudioUnlocked = () => {
      setNeedsInteractionToUnmute(false);
      play();
    };

    soundController.addListener('audio-unlocked', handleAudioUnlocked);
    return () => {
      soundController.removeListener('audio-unlocked', handleAudioUnlocked);
    };
  }, [soundController, play]);

  return {
    loading: !mediaStream,
    needsInteractionToUnmute,
    play,
  };
}
