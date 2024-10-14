import { CoreAssets } from '@noice-com/assets-core';

import { ToggleButton } from '../ToggleButton/ToggleButton';

export interface PlayButtonProps {
  paused: boolean;
  onClick?(paused: boolean): void;
}

export function PlayButton({ paused, onClick }: PlayButtonProps) {
  return (
    <ToggleButton
      offIcon={CoreAssets.Icons.VideoPlayerPause}
      offLabel="Pause"
      on={paused}
      onClick={onClick}
      onIcon={CoreAssets.Icons.VideoPlayerPlay}
      onLabel="Play"
    />
  );
}
