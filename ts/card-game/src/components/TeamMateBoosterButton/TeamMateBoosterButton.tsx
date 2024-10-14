import { CoreAssets } from '@noice-com/assets-core';
import {
  Icon,
  Tooltip,
  Button,
  Dialog,
  useDialog,
  useIsHoverSupported,
} from '@noice-com/common-ui';
import { useRef } from 'react';

import { AvailableBoosterButton } from '../AvailableBoosterButton';

import styles from './TeamMateBoosterButton.module.css';
import { TeamMateBoosterDialogContent } from './TeamMateBoosterDialogContent';
import { TeamMateBoosterTooltipContent } from './TeamMateBoosterTooltipContent';

import {
  useBoosterHasPlayerRequests,
  usePlayerAvailableBooster,
  usePlayerBoosterApply,
} from '@game-logic/boosters/hooks';
import { useIsRoundBasedGame } from '@game-logic/game/hooks';

export interface Props {
  ownerId: string;
}

export function TeamMateBoosterButton({ ownerId }: Props) {
  const { applyModeActive } = usePlayerBoosterApply();
  const { availableBooster } = usePlayerAvailableBooster(ownerId);
  const hadBoosterOnMount = useRef(availableBooster !== null);
  const hasBeenRequested = useBoosterHasPlayerRequests(ownerId);
  const isRoundBasedGame = useIsRoundBasedGame();

  const isHoverSupportingDevice = useIsHoverSupported();
  const touchOnlyDeviceDialog = useDialog({
    title: 'Booster',
    options: { inlineSize: 'narrow' },
  });

  if (isRoundBasedGame) {
    return null;
  }

  if (applyModeActive) {
    return null;
  }

  // when applying a booster and button not local player booster, hide it
  if (applyModeActive) {
    return null;
  }

  if (!availableBooster) {
    return null;
  }

  const onClick = () => {
    if (hasBeenRequested) {
      availableBooster.cancelRequest();
    } else {
      availableBooster.requestBooster();
    }
    touchOnlyDeviceDialog.actions.close();
  };

  const hideTooltip = !availableBooster || !isHoverSupportingDevice;

  return (
    <div className={styles.teamMateBoosterRoot}>
      <Tooltip
        content={
          <TeamMateBoosterTooltipContent
            boosterId={availableBooster.boosterId}
            hasRequested={hasBeenRequested}
            playerId={ownerId}
          />
        }
        distance={16}
        forceState={hideTooltip ? 'hide' : undefined}
        placement="top"
      >
        <AvailableBoosterButton
          availableBooster={availableBooster}
          canShowPulse={!hadBoosterOnMount.current}
          onClick={
            !isHoverSupportingDevice && !hasBeenRequested
              ? touchOnlyDeviceDialog.actions.open
              : onClick
          }
        />
      </Tooltip>

      <Dialog store={touchOnlyDeviceDialog}>
        <Dialog.Header />
        <Dialog.Content>
          <TeamMateBoosterDialogContent boosterId={availableBooster.boosterId} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            fit="container"
            size="lg"
            theme="dark"
            onClick={onClick}
          >
            Request booster
          </Button>
        </Dialog.Actions>
      </Dialog>

      {hasBeenRequested && (
        <div className={styles.teamMateBoosterRequestedTick}>
          <Icon
            className={styles.teamMateBoosterRequestedTickSvg}
            icon={CoreAssets.Icons.Check}
          />
        </div>
      )}
    </div>
  );
}
