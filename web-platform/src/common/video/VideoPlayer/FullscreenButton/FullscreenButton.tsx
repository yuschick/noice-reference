import { CoreAssets } from '@noice-com/assets-core';

import { ToggleButton } from '../ToggleButton/ToggleButton';

export interface FullscreenButtonProps {
  fullscreen: boolean;
  onClick?(fullscreen: boolean): void;
}

export function FullscreenButton({ onClick, fullscreen }: FullscreenButtonProps) {
  return (
    <ToggleButton
      offIcon={CoreAssets.Icons.VideoPlayerFullscreen}
      offLabel="Open fullscreen"
      on={fullscreen}
      onClick={onClick}
      onIcon={CoreAssets.Icons.VideoPlayerExitFullscreen}
      onLabel="Exit fullscreen"
    />
  );
}
