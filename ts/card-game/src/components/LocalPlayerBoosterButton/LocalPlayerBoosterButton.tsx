import {
  Button,
  Dialog,
  KeyboardKeys,
  Tooltip,
  useAuthenticatedUser,
  useDialog,
  useIsHoverSupported,
  useKeyPress,
} from '@noice-com/common-ui';
import { useCallback, useRef } from 'react';

import { AvailableBoosterButton } from '../AvailableBoosterButton';
import { GenericTimerTooltipContent } from '../GenericTimerTooltipContent';

import { useBoosterRequestPreviews } from './hooks';
import styles from './LocalPlayerBoosterButton.module.css';
import { LocalPlayerBoosterTooltipContent } from './LocalPlayerBoosterTooltipContent';
import { PendingBoosterButton } from './PendingBoosterButton';
import { BoosterRequestPreview } from './RequestPreview';

import { LocalPlayerBoosterDialogContent } from '@game-components/LocalPlayerBoosterButton/LocalPlayerBoosterDialogContent';
import { useCardGameAPIInternal } from '@game-context';
import {
  usePlayerAvailableBooster,
  usePlayerBoosterApply,
} from '@game-logic/boosters/hooks';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { useIsRoundBasedGame } from '@game-logic/game/hooks';
import { usePlayingSolo } from '@game-logic/group/hooks';

export function LocalPlayerBoosterButton() {
  const { userId: localPlayerId } = useAuthenticatedUser();

  const activeCard = usePlayerActiveCard(localPlayerId);
  const { availableBooster, cooldownTimer, isTimerPaused } =
    usePlayerAvailableBooster(localPlayerId);
  const { requestedBy, onRequestAnimationEnd } =
    useBoosterRequestPreviews(availableBooster);
  const hadBoosterOnMount = useRef(availableBooster !== null);
  const { applyModeActive, toggleApplyMode } = usePlayerBoosterApply();
  const { emitAPIEvent } = useCardGameAPIInternal();
  const isRoundBasedGame = useIsRoundBasedGame();

  const isPlayingSolo = usePlayingSolo();
  const isHoverSupportingDevice = useIsHoverSupported();
  const touchOnlyDeviceDialog = useDialog({
    title: 'Booster',
    options: { inlineSize: 'narrow' },
  });

  const cancelApplyMode = useCallback(() => {
    if (applyModeActive) {
      toggleApplyMode(false);
      emitAPIEvent('onToggleApplyingBooster', false);
    }
  }, [applyModeActive, emitAPIEvent, toggleApplyMode]);

  useKeyPress(KeyboardKeys.Escape, cancelApplyMode);

  if (isRoundBasedGame) {
    return null;
  }

  if (isPlayingSolo) {
    return (
      <PendingBoosterButton
        aria-label="Boosters unavailable"
        tooltipContent={
          <div className={styles.localPlayerSoloTooltip}>
            Boosters are disabled in solo play mode
          </div>
        }
      />
    );
  }

  if (!availableBooster) {
    return (
      <PendingBoosterButton
        aria-label={
          cooldownTimer ? 'Time until booster is available' : 'Boosters unavailable'
        }
        isTimerPaused={isTimerPaused}
        timer={cooldownTimer}
        tooltipContent={
          <GenericTimerTooltipContent
            isTimerPaused={isTimerPaused}
            timer={cooldownTimer}
            timerTooltip="Booster available in"
            tooltip="Booster cooldown is paused"
          />
        }
      />
    );
  }

  const onClick = () => {
    toggleApplyMode(!applyModeActive);
    emitAPIEvent('onToggleApplyingBooster', !applyModeActive);
    touchOnlyDeviceDialog.actions.close();
  };

  const hideTooltip = !isHoverSupportingDevice || applyModeActive;

  return (
    <div className={styles.localPlayerAvailableBoosterWrapper}>
      <Tooltip
        content={
          !activeCard ? (
            'Pick a card to use booster'
          ) : (
            <LocalPlayerBoosterTooltipContent boosterId={availableBooster.boosterId} />
          )
        }
        distance={16}
        forceState={hideTooltip ? 'hide' : undefined}
        placement="top"
      >
        <AvailableBoosterButton
          availableBooster={availableBooster}
          canShowPulse={!hadBoosterOnMount.current}
          isDisabled={!activeCard}
          onClick={
            isHoverSupportingDevice || applyModeActive
              ? onClick
              : touchOnlyDeviceDialog.actions.open
          }
        />
      </Tooltip>

      <Dialog store={touchOnlyDeviceDialog}>
        <Dialog.Header />
        <Dialog.Content>
          <LocalPlayerBoosterDialogContent boosterId={availableBooster.boosterId} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            fit="container"
            size="lg"
            theme="dark"
            onClick={onClick}
          >
            Use booster
          </Button>
        </Dialog.Actions>
      </Dialog>

      {requestedBy.length > 0 && (
        <div className={styles.localPlayerRequestPreviews}>
          {requestedBy.map((userId) => (
            <BoosterRequestPreview
              key={userId}
              userId={userId}
              onDisappeared={onRequestAnimationEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
}
