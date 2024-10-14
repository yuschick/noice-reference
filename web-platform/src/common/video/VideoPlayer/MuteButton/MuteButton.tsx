import { CoreAssets } from '@noice-com/assets-core';
import { IconButton } from '@noice-com/common-ui';
import { useCallback, useMemo, useState } from 'react';

export interface MuteButtonProps {
  volume: number;
  muted: boolean;
  onClick?(muted: boolean, storedVolume: number): void;
}

const volumeThresholds = [0, 0.001, 0.333, 0.666, 1.01];

export function MuteButton({ volume, muted, onClick }: MuteButtonProps) {
  const [storedVolume, setStoredVolume] = useState<number>(0);

  const onButtonClick = useCallback(() => {
    const nextMuted = !muted;

    if (nextMuted) {
      setStoredVolume(volume);
      onClick?.(nextMuted, volume);
    } else {
      onClick?.(nextMuted, storedVolume);
    }
  }, [onClick, muted, storedVolume, volume]);

  const currentIcon = useMemo(() => {
    const index = volumeThresholds.findIndex((value, index) => {
      return volume >= value && volume < volumeThresholds[index + 1];
    });

    if (index === 1) {
      return CoreAssets.Icons.VideoPlayerVolumeLow;
    }

    if (index === 2) {
      return CoreAssets.Icons.VideoPlayerVolumeMedium;
    }

    if (index === 3) {
      return CoreAssets.Icons.VideoPlayerVolumeMax;
    }

    return CoreAssets.Icons.VideoPlayerVolumeMuted;
  }, [volume]);

  return (
    <IconButton
      icon={currentIcon}
      label={muted ? 'Unmute' : 'Mute'}
      variant="ghost"
      onClick={onButtonClick}
    />
  );
}
