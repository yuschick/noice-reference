import { CoreAssets } from '@noice-com/assets-core';
import { TooltipPortal, useIsHoverSupported } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { ComponentProps, ReactNode, useRef } from 'react';

import { ProgressIconButton } from '@game-components/ProgressIconButton';
import { GameTimer } from '@game-logic/timer';

interface Props extends Omit<ComponentProps<'button'>, 'ref' | 'onClick'> {
  tooltipContent: ReactNode;
  timer?: Nullable<GameTimer>;
  isTimerPaused?: boolean;
}

export function PendingBoosterButton({
  tooltipContent,
  timer,
  isTimerPaused,
  ...buttonProps
}: Props) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isHoverSupportingDevice = useIsHoverSupported();

  return (
    <>
      <ProgressIconButton
        {...buttonProps}
        disabled={!timer}
        icon={CoreAssets.Icons.Question}
        isTimerPaused={isTimerPaused}
        ref={tooltipRef}
        timer={timer ?? null}
      />
      <TooltipPortal
        anchorRef={tooltipRef}
        disabled={!isHoverSupportingDevice}
        placement="top"
      >
        {tooltipContent}
      </TooltipPortal>
    </>
  );
}
