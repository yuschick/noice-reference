import { CoreAssets } from '@noice-com/assets-core';
import {
  FTUEActionType,
  TooltipPortal,
  useAnalytics,
  useAuthenticatedUser,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';
import { AnalyticsEventClientCardSelectOpenedCardSelectOpenedContext as CardSelectOpenedContext } from '@noice-com/schemas/analytics/analytics.pb';
import { useRef } from 'react';
import { HiRefresh } from 'react-icons/hi';

import { useSwitchOut } from '../hooks';

import { GenericTimerTooltipContent } from '@game-components/GenericTimerTooltipContent';
import { ProgressIconButton } from '@game-components/ProgressIconButton';
import { useCardGameUIState } from '@game-context';
import { useCardGameState } from '@game-logic/game/context';

interface Props {
  preventTooltip?: boolean;
}

export function SwitchOut({ preventTooltip }: Props) {
  const tooltipAnchorRef = useRef<HTMLDivElement>(null);

  const { userId: localPlayerId } = useAuthenticatedUser();
  const { trackEvent } = useAnalytics();
  const gameInstance = useCardGameState();

  const { repeatPulse, isReady, isLocked, timer } = useSwitchOut();

  const { openCardSelect } = useCardGameUIState();
  const triggerFTUEAction = useTriggerFTUEAction();

  const handleClick = () => {
    trackEvent({
      clientSwitchOutButtonClicked: {
        isCardSelectAvailable: isReady,
        isLocked,
        isCoolingDown: !isReady && !!timer?.hasTimeLeft,
        currentCardId: gameInstance?.getPlayerActiveCard(localPlayerId)?.cardId ?? '',
        roundPhase: gameInstance?.roundPhase,
        isRoundBasedGame: gameInstance?.isRoundBasedGame(),
        gameId: gameInstance?.getGameId(),
      },
    });

    if (!isReady) {
      return;
    }

    openCardSelect(CardSelectOpenedContext.CARD_SELECT_OPENED_CONTEXT_SWITCH_OUT);
    triggerFTUEAction(FTUEActionType.SwitchCardClicked);
  };

  return (
    <div>
      <ProgressIconButton
        aria-disabled={!isReady}
        aria-label="Switch out my card"
        data-ftue-anchor="cardSwitchIcon"
        icon={isLocked ? CoreAssets.Icons.Lock : HiRefresh}
        isReady={isReady}
        ref={tooltipAnchorRef}
        repeatPulse={repeatPulse}
        timer={timer}
        onClick={handleClick}
      />
      <TooltipPortal
        anchorRef={tooltipAnchorRef}
        disabled={preventTooltip}
        placement="top"
      >
        {isLocked ? (
          'You can only select cards between rounds'
        ) : (
          <GenericTimerTooltipContent
            isReady={isReady}
            timer={timer}
            timerTooltip="Switch out ready in"
            tooltip="Switch out your card"
          />
        )}
      </TooltipPortal>
    </div>
  );
}
